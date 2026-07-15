import { HistoryManager } from "./history.js";
import { canvasCopy, clamp, downloadBlob, hexToRgb, hslToRgb, qs, rgbToHex, rgbToHsl } from "./utils.js";
import { getBrushStamp, SmudgeRenderer, StrokeRenderer } from "./brushEngine.js";
import { BrushLibrary } from "./brushLibrary.js";
const paint = qs("#paintCanvas"), overlay = qs("#overlayCanvas"), stage = qs("#canvasStage"), viewport = qs("#viewport");
const paintCtx = paint.getContext("2d", { willReadFrequently: true }), overlayCtx = overlay.getContext("2d");
const fileInput = qs("#fileInput"), layerList = qs("#layerList"), historyList = qs("#historyList"), navigator = qs("#navigator"), navCtx = navigator.getContext("2d");
const fgInput = qs("#fgColor"), bgInput = qs("#bgColor"), hexInput = qs("#hexInput"), rInput = qs("#rInput"), gInput = qs("#gInput"), bInput = qs("#bInput"), hInput = qs("#hInput"), sInput = qs("#sInput"), lInput = qs("#lInput");
const toolLabels = { brush: "Freehand brush", pencil: "Pencil", eraser: "Eraser", smudge: "Blend / Smudge", line: "Line", rectangle: "Rectangle", ellipse: "Ellipse", polygon: "Polygon", polyline: "Polyline", path: "Bezier path", fill: "Fill bucket", gradient: "Gradient", picker: "Color picker", move: "Move layer", transform: "Transform layer", crop: "Crop canvas", selectRect: "Rectangle selection", selectEllipse: "Ellipse selection", text: "Text", pan: "Pan canvas", zoom: "Zoom" };
const state = { width: 1600, height: 1000, resolution: 72, name: "Untitled", background: "#FFFFFF", layers: [], selectedLayerId: null, nextLayerId: 1, tool: "brush", brush: { size: 24, opacity: 100, flow: 100, hardness: 85, spacing: 12, smoothing: 35, stabilizer: 4, pressureCurve: 50, rotation: 0, angle: 0, randomSize: 0, randomOpacity: 0, randomRotation: 0, blendStrength: 55, tip: "round", texture: "none", eraserMode: false, symmetry: false }, foreground: "#000000", backgroundColor: "#FFFFFF", recentColors: ["#000000", "#FFFFFF"], selection: null, guides: [], view: { zoom: .65, panX: 0, panY: 0, rotation: 0, flipX: 1, flipY: 1, grid: false, rulers: false, snap: true }, autosave: true };
let drawing = false, workspacePanning = false, startPoint = { x: 0, y: 0, pressure: 1 }, lastPoint = { x: 0, y: 0, pressure: 1 }, panStart = { x: 0, y: 0, panX: 0, panY: 0 }, moveStart = { x: 0, y: 0, layerX: 0, layerY: 0 }, pathPoints = [], strokePoints = [], strokeBefore = null, textPoint = null, historyBusy = false, autosaveTimer = 0, activeBrushId = localStorage.getItem("sogsketch-active-brush") ?? "hard-round", smudgeBuffer = null, strokeRenderer = null, mirrorStrokeRenderer = null, smudgeRenderer = null;
const history = new HistoryManager(renderHistory);
let brushLibrary;
function makeLayer(name, background = false) { const canvas = document.createElement("canvas"); canvas.width = state.width; canvas.height = state.height; return { id: state.nextLayerId++, name, canvas, visible: true, locked: false, opacity: 100, blendMode: "source-over", alphaInherit: false, groupId: null, x: 0, y: 0, scaleX: 1, scaleY: 1 }; }
function selectedLayer() { return state.layers.find(layer => layer.id === state.selectedLayerId) ?? null; }
function setCanvasSize(width, height) { state.width = clamp(Math.round(width), 64, 8192); state.height = clamp(Math.round(height), 64, 8192); for (const canvas of [paint, overlay]) {
    canvas.width = state.width;
    canvas.height = state.height;
} stage.style.width = `${state.width}px`; stage.style.height = `${state.height}px`; qs("#canvasStatus").textContent = `${state.width} × ${state.height} px · ${state.resolution} ppi`; }
function syncView() { stage.style.setProperty("--zoom", String(state.view.zoom)); stage.style.setProperty("--pan-x", `${state.view.panX}px`); stage.style.setProperty("--pan-y", `${state.view.panY}px`); stage.style.setProperty("--rotation", `${state.view.rotation}deg`); stage.style.setProperty("--flip-x", String(state.view.flipX)); stage.style.setProperty("--flip-y", String(state.view.flipY)); qs("#zoomInput").value = String(Math.round(state.view.zoom * 100)); qs("#zoomValue").value = `${Math.round(state.view.zoom * 100)}%`; qs("#canvasShell").classList.toggle("show-grid", state.view.grid); qs("#canvasShell").classList.toggle("show-rulers", state.view.rulers); }
function composite(target = paintCtx) { target.save(); target.clearRect(0, 0, state.width, state.height); if (state.background !== "transparent") {
    target.fillStyle = state.background;
    target.fillRect(0, 0, state.width, state.height);
} for (const layer of state.layers) {
    if (!layer.visible)
        continue;
    target.save();
    target.globalAlpha = layer.opacity / 100;
    target.globalCompositeOperation = layer.alphaInherit ? "source-atop" : layer.blendMode;
    target.translate(state.width / 2 + layer.x, state.height / 2 + layer.y);
    target.scale(layer.scaleX, layer.scaleY);
    target.drawImage(layer.canvas, -state.width / 2, -state.height / 2);
    target.restore();
} target.restore(); drawSelection(); updateNavigator(); scheduleAutosave(); }
function drawSelection() { overlayCtx.clearRect(0, 0, state.width, state.height); overlayCtx.save(); overlayCtx.lineWidth = 1 / state.view.zoom; overlayCtx.setLineDash([7 / state.view.zoom, 5 / state.view.zoom]); for (const guide of state.guides) {
    overlayCtx.strokeStyle = "#59bddd";
    overlayCtx.beginPath();
    if (guide.axis === "x") {
        overlayCtx.moveTo(0, guide.position);
        overlayCtx.lineTo(state.width, guide.position);
    }
    else {
        overlayCtx.moveTo(guide.position, 0);
        overlayCtx.lineTo(guide.position, state.height);
    }
    overlayCtx.stroke();
} if (state.selection) {
    const selection = state.selection;
    overlayCtx.strokeStyle = "#fff";
    overlayCtx.lineWidth = 2 / state.view.zoom;
    if (selection.ellipse) {
        overlayCtx.beginPath();
        overlayCtx.ellipse(selection.x + selection.width / 2, selection.y + selection.height / 2, Math.abs(selection.width / 2), Math.abs(selection.height / 2), 0, 0, Math.PI * 2);
        overlayCtx.stroke();
    }
    else
        overlayCtx.strokeRect(selection.x, selection.y, selection.width, selection.height);
} overlayCtx.restore(); }
function updateNavigator() { navCtx.clearRect(0, 0, navigator.width, navigator.height); const scale = Math.min(navigator.width / state.width, navigator.height / state.height); navCtx.drawImage(paint, (navigator.width - state.width * scale) / 2, (navigator.height - state.height * scale) / 2, state.width * scale, state.height * scale); }
function layerSnapshot(layer) { return { id: layer.id, name: layer.name, image: layer.canvas.toDataURL("image/png"), visible: layer.visible, locked: layer.locked, opacity: layer.opacity, blendMode: layer.blendMode, alphaInherit: layer.alphaInherit, groupId: layer.groupId, x: layer.x, y: layer.y, scaleX: layer.scaleX, scaleY: layer.scaleY }; }
function snapshot(label) { return { label, width: state.width, height: state.height, resolution: state.resolution, name: state.name, background: state.background, layers: state.layers.map(layerSnapshot), selectedLayerId: state.selectedLayerId, nextLayerId: state.nextLayerId, foreground: state.foreground, backgroundColor: state.backgroundColor, selection: state.selection ? { ...state.selection } : null }; }
function checkpoint(label) { if (historyBusy)
    return; history.push(snapshot(label)); setStatus(label); }
async function imageFromUrl(url) { return await new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Image could not be loaded")); image.src = url; }); }
async function restoreSnapshot(item) { historyBusy = true; setCanvasSize(item.width, item.height); state.resolution = item.resolution; state.name = item.name; state.background = item.background; state.layers = []; for (const saved of item.layers) {
    const canvas = document.createElement("canvas");
    canvas.width = item.width;
    canvas.height = item.height;
    canvas.getContext("2d").drawImage(await imageFromUrl(saved.image), 0, 0);
    state.layers.push({ ...saved, canvas });
} state.selectedLayerId = item.selectedLayerId; state.nextLayerId = item.nextLayerId; state.foreground = item.foreground; state.backgroundColor = item.backgroundColor; state.selection = item.selection; historyBusy = false; syncColors(); renderLayers(); composite(); updateTitle(); }
async function undo() { const item = history.undo(snapshot("Redo")); if (item)
    await restoreSnapshot(item); }
async function redo() { const item = history.redo(snapshot("Undo")); if (item)
    await restoreSnapshot(item); }
function renderHistory() { historyList.replaceChildren(...history.labels(item => item.label).map(label => { const li = document.createElement("li"); li.textContent = label; return li; })); document.querySelectorAll('[data-command="undo"]').forEach(button => button.disabled = !history.canUndo); document.querySelectorAll('[data-command="redo"]').forEach(button => button.disabled = !history.canRedo); }
function renderLayers() { layerList.replaceChildren(); [...state.layers].reverse().forEach(layer => { const row = document.createElement("div"); row.className = `layer-row${layer.id === state.selectedLayerId ? " active" : ""}${layer.locked ? " locked" : ""}${layer.groupId ? " grouped" : ""}`; row.draggable = true; row.dataset.id = String(layer.id); const eye = document.createElement("button"); eye.textContent = layer.visible ? "◉" : "○"; eye.title = "Toggle visibility"; const thumb = document.createElement("i"); thumb.className = "thumb"; thumb.style.backgroundImage = `url(${layer.canvas.toDataURL("image/png")})`; const name = document.createElement("span"); name.className = "name"; name.textContent = layer.name; const lock = document.createElement("button"); lock.textContent = layer.locked ? "🔒" : "◇"; lock.title = "Lock layer"; const clip = document.createElement("button"); clip.textContent = layer.alphaInherit ? "α" : "·"; clip.title = "Alpha inherit"; row.append(eye, thumb, name, lock, clip); row.addEventListener("click", () => { state.selectedLayerId = layer.id; renderLayers(); syncLayerOptions(); }); row.addEventListener("dblclick", () => renameLayer()); eye.addEventListener("click", event => { event.stopPropagation(); checkpoint("Layer visibility"); layer.visible = !layer.visible; renderLayers(); composite(); }); lock.addEventListener("click", event => { event.stopPropagation(); checkpoint("Layer lock"); layer.locked = !layer.locked; renderLayers(); }); clip.addEventListener("click", event => { event.stopPropagation(); checkpoint("Alpha inherit"); layer.alphaInherit = !layer.alphaInherit; renderLayers(); composite(); }); row.addEventListener("dragstart", event => { event.dataTransfer?.setData("text/plain", String(layer.id)); row.classList.add("dragging"); }); row.addEventListener("dragend", () => document.querySelectorAll(".layer-row").forEach(node => node.classList.remove("dragging", "drag-over"))); row.addEventListener("dragover", event => { event.preventDefault(); row.classList.add("drag-over"); }); row.addEventListener("dragleave", () => row.classList.remove("drag-over")); row.addEventListener("drop", event => { event.preventDefault(); const sourceId = Number(event.dataTransfer?.getData("text/plain")); if (!sourceId || sourceId === layer.id)
    return; checkpoint("Reorder layers"); const visual = [...state.layers].reverse(); const sourceIndex = visual.findIndex(item => item.id === sourceId); const [moved] = visual.splice(sourceIndex, 1); if (!moved)
    return; const targetIndex = visual.findIndex(item => item.id === layer.id); visual.splice(targetIndex + (event.clientY > row.getBoundingClientRect().top + row.offsetHeight / 2 ? 1 : 0), 0, moved); state.layers = visual.reverse(); state.selectedLayerId = sourceId; renderLayers(); composite(); }); layerList.append(row); }); syncLayerOptions(); }
function syncLayerOptions() { const layer = selectedLayer(); qs("#blendMode").value = layer?.blendMode ?? "source-over"; qs("#layerOpacity").value = String(layer?.opacity ?? 100); qs("#alphaInherit").checked = layer?.alphaInherit ?? false; }
function addLayer(name = `Paint Layer ${state.layers.length + 1}`) { checkpoint("Add layer"); const layer = makeLayer(name); state.layers.push(layer); state.selectedLayerId = layer.id; renderLayers(); composite(); }
function duplicateLayer() { const source = selectedLayer(); if (!source)
    return; checkpoint("Duplicate layer"); const copy = { ...source, id: state.nextLayerId++, name: `${source.name} copy`, canvas: canvasCopy(source.canvas), x: source.x + 12, y: source.y + 12 }; state.layers.push(copy); state.selectedLayerId = copy.id; renderLayers(); composite(); }
function deleteLayer() { if (state.layers.length <= 1)
    return; const index = state.layers.findIndex(layer => layer.id === state.selectedLayerId); if (index < 0)
    return; checkpoint("Delete layer"); state.layers.splice(index, 1); state.selectedLayerId = state.layers.at(-1)?.id ?? null; renderLayers(); composite(); }
function renameLayer() { const layer = selectedLayer(); if (!layer)
    return; const value = prompt("Layer name", layer.name); if (!value?.trim())
    return; checkpoint("Rename layer"); layer.name = value.trim(); renderLayers(); }
function groupLayer() { const layer = selectedLayer(); if (!layer)
    return; checkpoint("Group layer"); layer.groupId = layer.groupId ? null : Date.now(); renderLayers(); }
function mergeDown() { const index = state.layers.findIndex(layer => layer.id === state.selectedLayerId); if (index <= 0)
    return; checkpoint("Merge down"); const upper = state.layers[index], lower = state.layers[index - 1]; if (!upper || !lower)
    return; const ctx = lower.canvas.getContext("2d"); ctx.save(); ctx.globalAlpha = upper.opacity / 100; ctx.globalCompositeOperation = upper.blendMode; ctx.translate(state.width / 2 + upper.x, state.height / 2 + upper.y); ctx.scale(upper.scaleX, upper.scaleY); ctx.drawImage(upper.canvas, -state.width / 2, -state.height / 2); ctx.restore(); state.layers.splice(index, 1); state.selectedLayerId = lower.id; renderLayers(); composite(); }
function flatten() { checkpoint("Flatten image"); const merged = document.createElement("canvas"); merged.width = state.width; merged.height = state.height; composite(merged.getContext("2d")); const layer = makeLayer("Flattened"); layer.canvas.getContext("2d").drawImage(merged, 0, 0); state.layers = [layer]; state.selectedLayerId = layer.id; state.background = "transparent"; renderLayers(); composite(); }
function pointFromEvent(event) { const rect = overlay.getBoundingClientRect(); let x = clamp((event.clientX - rect.left) * state.width / rect.width, 0, state.width), y = clamp((event.clientY - rect.top) * state.height / rect.height, 0, state.height); if (state.view.snap) {
    const distance = 10 / state.view.zoom;
    for (const guide of state.guides) {
        if (guide.axis === "x" && Math.abs(y - guide.position) < distance)
            y = guide.position;
        if (guide.axis === "y" && Math.abs(x - guide.position) < distance)
            x = guide.position;
    }
} return { x, y, pressure: event.pointerType === "pen" && event.pressure > 0 ? event.pressure : 1 }; }
function layerPoint(point, layer) { return { x: (point.x - state.width / 2 - layer.x) / layer.scaleX + state.width / 2, y: (point.y - state.height / 2 - layer.y) / layer.scaleY + state.height / 2, pressure: point.pressure }; }
function inSelection(point) { const s = state.selection; if (!s)
    return true; const x = (point.x - s.x) / s.width, y = (point.y - s.y) / s.height; return s.ellipse ? ((x - .5) ** 2 + (y - .5) ** 2 <= .25) : x >= 0 && x <= 1 && y >= 0 && y <= 1; }
function clipToSelection(ctx) { const s = state.selection; if (!s)
    return; ctx.beginPath(); if (s.ellipse)
    ctx.ellipse(s.x + s.width / 2, s.y + s.height / 2, Math.abs(s.width / 2), Math.abs(s.height / 2), 0, 0, Math.PI * 2);
else
    ctx.rect(s.x, s.y, s.width, s.height); ctx.clip(); }
function brushStamp(ctx, point, size, color, erase, rotation = 0) { if (!inSelection(point))
    return; const pressure = Math.max(.08, point.pressure), randomSize = 1 + (Math.random() * 2 - 1) * state.brush.randomSize / 100, actualSize = Math.max(.5, size * pressure * randomSize), stamp = getBrushStamp(state.brush, color, actualSize), randomOpacity = 1 - Math.random() * state.brush.randomOpacity / 100, angle = (state.brush.angle + state.brush.rotation + rotation + (Math.random() * 2 - 1) * state.brush.randomRotation) * Math.PI / 180; ctx.save(); clipToSelection(ctx); ctx.globalAlpha = (state.brush.opacity / 100) * (state.brush.flow / 100) * randomOpacity; ctx.globalCompositeOperation = erase ? "destination-out" : "source-over"; ctx.translate(point.x, point.y); ctx.rotate(angle); ctx.drawImage(stamp, -stamp.width / 2, -stamp.height / 2); ctx.restore(); }
function strokeLine(ctx, a, b, size, color, erase) { const distance = Math.hypot(b.x - a.x, b.y - a.y), direction = Math.atan2(b.y - a.y, b.x - a.x), pressure = Math.max(.08, (a.pressure + b.pressure) / 2), randomSize = 1 + (Math.random() * 2 - 1) * state.brush.randomSize / 100, width = Math.max(.5, size * pressure * randomSize), stampTip = ["scatter", "leaf", "grass", "cloud"].includes(state.brush.tip); if (stampTip) {
    const step = Math.max(2, width * state.brush.spacing / 100), steps = Math.max(1, Math.ceil(distance / step)), degrees = direction * 180 / Math.PI;
    for (let index = 1; index <= steps; index++) {
        const t = index / steps;
        brushStamp(ctx, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, pressure: a.pressure + (b.pressure - a.pressure) * t }, size, color, erase, degrees);
    }
    return;
} if (distance < .01)
    return; ctx.save(); clipToSelection(ctx); ctx.globalCompositeOperation = erase ? "destination-out" : "source-over"; ctx.strokeStyle = color; ctx.lineJoin = "round"; ctx.lineCap = "butt"; const opacity = (state.brush.opacity / 100) * (state.brush.flow / 100) * (1 - Math.random() * state.brush.randomOpacity / 100), softness = 1 - state.brush.hardness / 100, brushAngle = (state.brush.angle + state.brush.rotation) * Math.PI / 180; ctx.globalAlpha = opacity; if (state.brush.tip === "chisel")
    ctx.lineWidth = Math.max(.5, width * (.22 + .78 * Math.abs(Math.sin(direction - brushAngle))));
else if (state.brush.tip === "flat")
    ctx.lineWidth = width * .72;
else
    ctx.lineWidth = width; if (softness > .05 && !erase) {
    ctx.shadowColor = color;
    ctx.shadowBlur = width * softness * .65;
    if (state.brush.hardness < 20) {
        ctx.globalAlpha = opacity * .42;
        ctx.lineWidth = width * (.55 + state.brush.hardness / 100);
    }
} const overlap = Math.min(distance * .25, width * .12), extendX = Math.cos(direction) * overlap, extendY = Math.sin(direction) * overlap; ctx.beginPath(); ctx.moveTo(a.x - extendX, a.y - extendY); ctx.lineTo(b.x + extendX, b.y + extendY); ctx.stroke(); const textured = state.brush.tip === "bristle" || ["grain", "chalk", "charcoal"].includes(state.brush.texture); if (textured && !erase) {
    const strands = state.brush.tip === "bristle" ? 7 : state.brush.texture === "charcoal" || state.brush.texture === "chalk" ? 5 : 3, normalX = -Math.sin(direction), normalY = Math.cos(direction);
    ctx.shadowBlur = 0;
    ctx.lineCap = "butt";
    for (let strand = 0; strand < strands; strand++) {
        const spread = (strand - (strands - 1) / 2) / (Math.max(1, strands - 1)) * width * .72, jitter = (Math.random() - .5) * width * .12;
        ctx.globalAlpha = opacity * (.16 + Math.random() * .16);
        ctx.lineWidth = Math.max(.45, width / (strands * (state.brush.texture === "charcoal" ? 1.35 : 1.8)));
        ctx.beginPath();
        ctx.moveTo(a.x - extendX + normalX * (spread + jitter), a.y - extendY + normalY * (spread + jitter));
        ctx.lineTo(b.x + extendX + normalX * (spread - jitter), b.y + extendY + normalY * (spread - jitter));
        ctx.stroke();
    }
} ctx.restore(); }
function smudgeSegment(from, to) { const layer = selectedLayer(); if (!layer || layer.locked)
    return; const ctx = layer.canvas.getContext("2d", { willReadFrequently: true }), a = layerPoint(from, layer), b = layerPoint(to, layer), distance = Math.hypot(b.x - a.x, b.y - a.y), size = Math.max(2, state.brush.size * ((a.pressure + b.pressure) / 2)), step = Math.max(1, size * .12), steps = Math.max(1, Math.ceil(distance / step)), patch = Math.max(4, Math.ceil(size)); if (!smudgeBuffer || smudgeBuffer.width !== patch || smudgeBuffer.height !== patch) {
    smudgeBuffer = document.createElement("canvas");
    smudgeBuffer.width = smudgeBuffer.height = patch;
} const bufferCtx = smudgeBuffer.getContext("2d"); ctx.save(); clipToSelection(ctx); for (let index = 1; index <= steps; index++) {
    const t = index / steps, sourceT = Math.max(0, t - 1 / steps), sx = a.x + (b.x - a.x) * sourceT - patch / 2, sy = a.y + (b.y - a.y) * sourceT - patch / 2, dx = a.x + (b.x - a.x) * t - patch / 2, dy = a.y + (b.y - a.y) * t - patch / 2;
    bufferCtx.clearRect(0, 0, patch, patch);
    bufferCtx.drawImage(layer.canvas, sx, sy, patch, patch, 0, 0, patch, patch);
    ctx.globalAlpha = (state.brush.opacity / 100) * (state.brush.blendStrength / 100) * (.35 + .65 * (a.pressure + (b.pressure - a.pressure) * t));
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(smudgeBuffer, dx, dy, patch, patch);
} ctx.restore(); }
function drawBrushSegment(from, to) { const layer = selectedLayer(); if (!layer || layer.locked)
    return; if (state.tool === "smudge") {
    smudgeSegment(from, to);
    return;
} const ctx = layer.canvas.getContext("2d"), a = layerPoint(from, layer), b = layerPoint(to, layer), size = state.brush.size, erase = state.tool === "eraser" || state.brush.eraserMode; strokeLine(ctx, a, b, size, state.foreground, erase); if (state.brush.symmetry)
    strokeLine(ctx, { ...a, x: state.width - a.x }, { ...b, x: state.width - b.x }, size, state.foreground, erase); }
function renderContinuousStroke() { const layer = selectedLayer(); if (!layer || layer.locked || !strokeBefore || strokePoints.length < 2)
    return; const ctx = layer.canvas.getContext("2d"), points = strokePoints.map(point => layerPoint(point, layer)), erase = state.tool === "eraser" || state.brush.eraserMode, averagePressure = points.reduce((sum, point) => sum + point.pressure, 0) / points.length, width = Math.max(.5, state.brush.size * averagePressure), opacity = (state.brush.opacity / 100) * (state.brush.flow / 100), direction = Math.atan2(points.at(-1).y - points[0].y, points.at(-1).x - points[0].x), angle = (state.brush.angle + state.brush.rotation) * Math.PI / 180; ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height); ctx.drawImage(strokeBefore, 0, 0); const trace = (offset = 0) => { const normalX = -Math.sin(direction) * offset, normalY = Math.cos(direction) * offset; ctx.beginPath(); ctx.moveTo(points[0].x + normalX, points[0].y + normalY); for (let index = 1; index < points.length - 1; index++) {
    const current = points[index], next = points[index + 1], midX = (current.x + next.x) / 2, midY = (current.y + next.y) / 2;
    ctx.quadraticCurveTo(current.x + normalX, current.y + normalY, midX + normalX, midY + normalY);
} const last = points.at(-1); ctx.lineTo(last.x + normalX, last.y + normalY); ctx.stroke(); }; ctx.save(); clipToSelection(ctx); ctx.globalCompositeOperation = erase ? "destination-out" : "source-over"; ctx.strokeStyle = state.foreground; ctx.globalAlpha = opacity; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = state.brush.tip === "chisel" ? width * (.22 + .78 * Math.abs(Math.sin(direction - angle))) : state.brush.tip === "flat" ? width * .72 : width; const softness = 1 - state.brush.hardness / 100; if (softness > .05 && !erase) {
    ctx.shadowColor = state.foreground;
    ctx.shadowBlur = width * softness * .55;
    if (state.brush.hardness < 20) {
        ctx.globalAlpha = opacity * .48;
        ctx.lineWidth = width * (.5 + state.brush.hardness / 100);
    }
} trace(); if (state.brush.tip === "bristle" && !erase) {
    ctx.shadowBlur = 0;
    ctx.globalAlpha = opacity * .18;
    ctx.lineWidth = Math.max(.5, width / 10);
    for (const offset of [-.32, -.2, -.1, .1, .2, .32])
        trace(width * offset);
} if (state.brush.symmetry) {
    ctx.save();
    ctx.translate(state.width, 0);
    ctx.scale(-1, 1);
    trace();
    ctx.restore();
} ctx.restore(); }
function withLayerContext(draw) { const layer = selectedLayer(); if (!layer || layer.locked)
    return; const ctx = layer.canvas.getContext("2d"); ctx.save(); ctx.globalAlpha = state.brush.opacity / 100; ctx.strokeStyle = state.foreground; ctx.fillStyle = state.foreground; ctx.lineWidth = state.brush.size; ctx.lineCap = "round"; ctx.lineJoin = "round"; draw(ctx); ctx.restore(); composite(); }
function previewShape(point) { overlayCtx.clearRect(0, 0, state.width, state.height); overlayCtx.save(); overlayCtx.strokeStyle = state.foreground; overlayCtx.lineWidth = state.brush.size / state.view.zoom; overlayCtx.globalAlpha = state.brush.opacity / 100; overlayCtx.setLineDash(state.tool.startsWith("select") || state.tool === "crop" ? [8, 6] : []); const x = startPoint.x, y = startPoint.y, w = point.x - x, h = point.y - y; overlayCtx.beginPath(); if (state.tool === "line")
    overlayCtx.moveTo(x, y), overlayCtx.lineTo(point.x, point.y);
else if (state.tool === "rectangle" || state.tool === "crop" || state.tool === "selectRect")
    overlayCtx.rect(x, y, w, h);
else if (state.tool === "ellipse" || state.tool === "selectEllipse")
    overlayCtx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
else if (state.tool === "path")
    overlayCtx.moveTo(x, y), overlayCtx.bezierCurveTo(x, point.y, point.x, y, point.x, point.y);
else if (state.tool === "gradient") {
    const gradient = overlayCtx.createLinearGradient(x, y, point.x, point.y);
    gradient.addColorStop(0, state.foreground);
    gradient.addColorStop(1, state.backgroundColor);
    overlayCtx.fillStyle = gradient;
    overlayCtx.fillRect(0, 0, state.width, state.height);
} overlayCtx.stroke(); overlayCtx.restore(); }
function commitShape(point) { const x = startPoint.x, y = startPoint.y, w = point.x - x, h = point.y - y; if (state.tool === "crop") {
    state.selection = { x: Math.min(x, point.x), y: Math.min(y, point.y), width: Math.abs(w), height: Math.abs(h), ellipse: false };
    cropToSelection();
    return;
} if (state.tool === "selectRect" || state.tool === "selectEllipse") {
    state.selection = { x: Math.min(x, point.x), y: Math.min(y, point.y), width: Math.abs(w), height: Math.abs(h), ellipse: state.tool === "selectEllipse" };
    drawSelection();
    return;
} if (state.tool === "gradient") {
    withLayerContext(ctx => { const gradient = ctx.createLinearGradient(x, y, point.x, point.y); gradient.addColorStop(0, state.foreground); gradient.addColorStop(1, state.backgroundColor); ctx.globalAlpha = state.brush.opacity / 100; ctx.fillStyle = gradient; ctx.fillRect(0, 0, state.width, state.height); });
    return;
} withLayerContext(ctx => { ctx.beginPath(); if (state.tool === "line")
    ctx.moveTo(x, y), ctx.lineTo(point.x, point.y);
else if (state.tool === "rectangle")
    ctx.rect(x, y, w, h);
else if (state.tool === "ellipse")
    ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
else if (state.tool === "path")
    ctx.moveTo(x, y), ctx.bezierCurveTo(x, point.y, point.x, y, point.x, point.y); ctx.stroke(); }); }
function drawPathPreview(point) { overlayCtx.clearRect(0, 0, state.width, state.height); if (!pathPoints.length)
    return; overlayCtx.save(); overlayCtx.strokeStyle = state.foreground; overlayCtx.lineWidth = Math.max(1, state.brush.size / state.view.zoom); overlayCtx.beginPath(); overlayCtx.moveTo(pathPoints[0].x, pathPoints[0].y); for (const p of pathPoints.slice(1))
    overlayCtx.lineTo(p.x, p.y); if (point)
    overlayCtx.lineTo(point.x, point.y); if (state.tool === "polygon" && pathPoints.length > 2)
    overlayCtx.lineTo(pathPoints[0].x, pathPoints[0].y); overlayCtx.stroke(); overlayCtx.restore(); }
function finishPath() { if (pathPoints.length < 2)
    return; checkpoint(state.tool === "polygon" ? "Polygon" : "Polyline"); withLayerContext(ctx => { ctx.beginPath(); ctx.moveTo(pathPoints[0].x, pathPoints[0].y); for (const point of pathPoints.slice(1))
    ctx.lineTo(point.x, point.y); if (state.tool === "polygon")
    ctx.closePath(); ctx.stroke(); }); pathPoints = []; drawSelection(); }
function floodFill(point) {
    const layer = selectedLayer();
    if (!layer || layer.locked)
        return;
    const local = layerPoint(point, layer), x = Math.floor(local.x), y = Math.floor(local.y), width = layer.canvas.width, height = layer.canvas.height;
    if (x < 0 || y < 0 || x >= width || y >= height || !inSelection(local))
        return;
    const ctx = layer.canvas.getContext("2d", { willReadFrequently: true }), image = ctx.getImageData(0, 0, width, height), data = image.data, start = (y * width + x) * 4;
    const target = [data[start], data[start + 1], data[start + 2], data[start + 3]], rgb = hexToRgb(state.foreground), sourceAlpha = state.brush.opacity / 100;
    const colourDistance = (at) => {
        const alphaDelta = Math.abs(data[at + 3] - target[3]);
        if (target[3] < 16 && data[at + 3] < 16)
            return alphaDelta;
        return Math.abs(data[at] - target[0]) + Math.abs(data[at + 1] - target[1]) + Math.abs(data[at + 2] - target[2]) + alphaDelta * 1.5;
    };
    if (colourDistance(start) === 0 && target[0] === rgb[0] && target[1] === rgb[1] && target[2] === rgb[2] && target[3] === Math.round(sourceAlpha * 255))
        return;
    checkpoint("Fill");
    const seen = new Uint8Array(width * height), stack = [y * width + x], matched = [];
    while (stack.length) {
        const key = stack.pop();
        if (seen[key])
            continue;
        seen[key] = 1;
        const cx = key % width, cy = Math.floor(key / width), at = key * 4;
        if (colourDistance(at) > 72 || !inSelection({ x: cx + .5, y: cy + .5, pressure: 1 }))
            continue;
        matched.push(key);
        if (cx > 0)
            stack.push(key - 1);
        if (cx + 1 < width)
            stack.push(key + 1);
        if (cy > 0)
            stack.push(key - width);
        if (cy + 1 < height)
            stack.push(key + width);
    }
    for (const key of matched) {
        const at = key * 4, destinationAlpha = data[at + 3] / 255, outAlpha = sourceAlpha + destinationAlpha * (1 - sourceAlpha);
        if (outAlpha <= 0)
            continue;
        data[at] = Math.round((rgb[0] * sourceAlpha + data[at] * destinationAlpha * (1 - sourceAlpha)) / outAlpha);
        data[at + 1] = Math.round((rgb[1] * sourceAlpha + data[at + 1] * destinationAlpha * (1 - sourceAlpha)) / outAlpha);
        data[at + 2] = Math.round((rgb[2] * sourceAlpha + data[at + 2] * destinationAlpha * (1 - sourceAlpha)) / outAlpha);
        data[at + 3] = Math.round(outAlpha * 255);
    }
    ctx.putImageData(image, 0, 0);
    composite();
    setStatus(`Filled ${matched.length.toLocaleString()} pixels`);
}
function pickColor(point) { const pixel = paintCtx.getImageData(Math.floor(point.x), Math.floor(point.y), 1, 1).data; setForeground(rgbToHex(pixel[0], pixel[1], pixel[2])); }
function clearSelectionOrLayer() { const layer = selectedLayer(); if (!layer || layer.locked)
    return; checkpoint("Clear"); const ctx = layer.canvas.getContext("2d"); if (state.selection)
    ctx.clearRect(state.selection.x, state.selection.y, state.selection.width, state.selection.height);
else
    ctx.clearRect(0, 0, state.width, state.height); composite(); }
function pointerDown(event) { event.preventDefault(); event.stopPropagation(); const point = pointFromEvent(event); startPoint = lastPoint = point; overlay.setPointerCapture(event.pointerId); if (state.tool === "pan" || event.button === 1 || event.altKey) {
    drawing = true;
    panStart = { x: event.clientX, y: event.clientY, panX: state.view.panX, panY: state.view.panY };
    viewport.classList.add("panning");
    return;
} if (state.tool === "zoom") {
    setZoom(state.view.zoom * (event.shiftKey ? .8 : 1.25));
    return;
} if (state.tool === "picker") {
    pickColor(point);
    return;
} if (state.tool === "fill") {
    floodFill(point);
    return;
} if (state.tool === "text") {
    textPoint = point;
    qs("#textDialog").showModal();
    return;
} if (state.tool === "polygon" || state.tool === "polyline") {
    pathPoints.push(point);
    drawPathPreview();
    return;
} const layer = selectedLayer(); if (["brush", "pencil", "eraser", "smudge", "line", "rectangle", "ellipse", "path", "gradient"].includes(state.tool) && (!layer || layer.locked))
    return; drawing = true; if (["brush", "pencil", "eraser", "smudge"].includes(state.tool)) {
    checkpoint(toolLabels[state.tool]);
    const ctx = layer.canvas.getContext("2d", { willReadFrequently: state.tool === "smudge" }), local = layerPoint(point, layer), clip = (target) => clipToSelection(target);
    if (state.tool === "smudge") {
        smudgeRenderer = new SmudgeRenderer(ctx, state.brush, clip);
        smudgeRenderer.begin(local);
    }
    else {
        const options = { settings: { ...state.brush }, color: state.foreground, erase: state.tool === "eraser" || state.brush.eraserMode, clip };
        strokeRenderer = new StrokeRenderer(ctx, options);
        strokeRenderer.begin(local);
        if (state.brush.symmetry) {
            mirrorStrokeRenderer = new StrokeRenderer(ctx, { ...options, seed: Date.now() });
            mirrorStrokeRenderer.begin({ ...local, x: state.width - local.x });
        }
    }
    composite();
}
else if (state.tool === "move" || state.tool === "transform") {
    if (!layer)
        return;
    checkpoint(toolLabels[state.tool]);
    moveStart = { x: event.clientX, y: event.clientY, layerX: layer.x, layerY: layer.y };
}
else if (["line", "rectangle", "ellipse", "path", "gradient"].includes(state.tool))
    checkpoint(toolLabels[state.tool]); }
function pointerMove(event) { const point = pointFromEvent(event); qs("#pointerStatus").textContent = `${Math.round(point.x)}, ${Math.round(point.y)}`; if ((state.tool === "polygon" || state.tool === "polyline") && pathPoints.length) {
    drawPathPreview(point);
    return;
} if (!drawing)
    return; event.preventDefault(); if (state.tool === "pan" || event.buttons === 4 || event.altKey) {
    state.view.panX = panStart.panX + event.clientX - panStart.x;
    state.view.panY = panStart.panY + event.clientY - panStart.y;
    syncView();
    return;
} const layer = selectedLayer(); if (state.tool === "move" && layer) {
    layer.x = moveStart.layerX + (event.clientX - moveStart.x) / state.view.zoom;
    layer.y = moveStart.layerY + (event.clientY - moveStart.y) / state.view.zoom;
    composite();
    return;
} if (state.tool === "transform" && layer) {
    const amount = 1 + (event.clientX - moveStart.x) / 300;
    layer.scaleX = clamp(amount, .05, 8);
    layer.scaleY = event.shiftKey ? layer.scaleX : clamp(1 + (event.clientY - moveStart.y) / 300, .05, 8);
    composite();
    return;
} if (["brush", "pencil", "eraser", "smudge"].includes(state.tool) && layer) {
    const samples = event.getCoalescedEvents?.() ?? [event];
    for (const sample of samples) {
        const local = layerPoint(pointFromEvent(sample), layer);
        smudgeRenderer?.add(local);
        strokeRenderer?.add(local);
        mirrorStrokeRenderer?.add({ ...local, x: state.width - local.x });
    }
    lastPoint = point;
    composite();
    return;
} previewShape(point); }
function pointerUp(event) { if (!drawing)
    return; const point = pointFromEvent(event), layer = selectedLayer(), local = layer ? layerPoint(point, layer) : point; drawing = false; viewport.classList.remove("panning"); if (overlay.hasPointerCapture(event.pointerId))
    overlay.releasePointerCapture(event.pointerId); if (["brush", "pencil", "eraser", "smudge"].includes(state.tool)) {
    strokeRenderer?.end(local);
    mirrorStrokeRenderer?.end({ ...local, x: state.width - local.x });
    smudgeRenderer?.end(local);
    strokeRenderer = mirrorStrokeRenderer = smudgeRenderer = null;
    composite();
} if (["line", "rectangle", "ellipse", "path", "gradient", "crop", "selectRect", "selectEllipse"].includes(state.tool))
    commitShape(point); strokeBefore = null; drawSelection(); }
function viewportPointerDown(event) { if (event.target === overlay)
    return; if (event.button !== 1 && state.tool !== "pan" && !event.altKey)
    return; event.preventDefault(); workspacePanning = true; panStart = { x: event.clientX, y: event.clientY, panX: state.view.panX, panY: state.view.panY }; viewport.setPointerCapture(event.pointerId); viewport.classList.add("panning"); }
function viewportPointerMove(event) { if (!workspacePanning)
    return; event.preventDefault(); state.view.panX = panStart.panX + event.clientX - panStart.x; state.view.panY = panStart.panY + event.clientY - panStart.y; syncView(); }
function viewportPointerUp(event) { if (!workspacePanning)
    return; workspacePanning = false; viewport.classList.remove("panning"); if (viewport.hasPointerCapture(event.pointerId))
    viewport.releasePointerCapture(event.pointerId); }
function cropToSelection() { const s = state.selection; if (!s || s.width < 2 || s.height < 2)
    return; checkpoint("Crop canvas"); const x = Math.round(s.x), y = Math.round(s.y), width = Math.round(s.width), height = Math.round(s.height); for (const layer of state.layers) {
    const copy = canvasCopy(layer.canvas);
    layer.canvas.width = width;
    layer.canvas.height = height;
    layer.canvas.getContext("2d").drawImage(copy, -x, -y);
    layer.x = 0;
    layer.y = 0;
} state.selection = null; setCanvasSize(width, height); composite(); fitCanvas(); }
function resizeDocument(width, height) { checkpoint("Resize canvas"); for (const layer of state.layers) {
    const copy = canvasCopy(layer.canvas);
    layer.canvas.width = width;
    layer.canvas.height = height;
    layer.canvas.getContext("2d").drawImage(copy, 0, 0, width, height);
    layer.x = 0;
    layer.y = 0;
} setCanvasSize(width, height); composite(); fitCanvas(); }
function applyFilter(name) { const layer = selectedLayer(); if (!layer || layer.locked)
    return; checkpoint(name); const ctx = layer.canvas.getContext("2d", { willReadFrequently: true }); if (name === "Soft blur") {
    const copy = canvasCopy(layer.canvas);
    ctx.clearRect(0, 0, state.width, state.height);
    ctx.filter = "blur(3px)";
    ctx.drawImage(copy, 0, 0);
    ctx.filter = "none";
}
else {
    const image = ctx.getImageData(0, 0, state.width, state.height), data = image.data;
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        if (name === "Grayscale") {
            const v = Math.round(r * .299 + g * .587 + b * .114);
            data[i] = data[i + 1] = data[i + 2] = v;
        }
        else if (name === "Invert colors") {
            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
        }
        else {
            data[i] = clamp(r * .393 + g * .769 + b * .189, 0, 255);
            data[i + 1] = clamp(r * .349 + g * .686 + b * .168, 0, 255);
            data[i + 2] = clamp(r * .272 + g * .534 + b * .131, 0, 255);
        }
    }
    ctx.putImageData(image, 0, 0);
} composite(); }
function setTool(tool) { state.tool = tool; pathPoints = []; document.querySelectorAll("[data-tool]").forEach(button => button.classList.toggle("active", button.dataset.tool === tool)); qs("#toolName").textContent = toolLabels[tool]; qs("#canvasHud").textContent = tool === "polygon" || tool === "polyline" ? "Click points · double-click or Enter to finish" : tool === "transform" ? "Drag horizontally/vertically to scale" : tool === "crop" ? "Drag the crop rectangle" : "Click and drag on the canvas"; overlay.style.cursor = tool === "pan" ? "grab" : tool === "text" ? "text" : tool === "picker" ? "copy" : tool === "zoom" ? "zoom-in" : "crosshair"; }
function setZoom(value) { state.view.zoom = clamp(value, .1, 8); syncView(); }
function fitCanvas() { const rect = viewport.getBoundingClientRect(); setZoom(Math.min((rect.width - 70) / state.width, (rect.height - 70) / state.height)); state.view.panX = state.view.panY = 0; syncView(); }
function setStatus(text) { qs("#statusText").textContent = text; }
function updateTitle() { qs("#docTitle").textContent = `${state.name}.sogsketch`; document.title = `${state.name} — SogSketch`; }
function syncBrushInputs() { for (const key of ["size", "opacity", "flow", "hardness", "spacing", "smoothing", "stabilizer", "pressureCurve", "rotation", "angle", "blendStrength"]) {
    const input = qs(`#${key}Input`);
    input.value = String(state.brush[key]);
    qs(`#${key}Value`).value = key === "size" ? `${state.brush[key]} px` : key === "stabilizer" ? String(state.brush[key]) : key === "rotation" || key === "angle" ? `${state.brush[key]}°` : `${state.brush[key]}%`;
} qs("#eraserModeButton").classList.toggle("active", state.brush.eraserMode); qs("#symmetryButton").classList.toggle("active", state.brush.symmetry); drawBrushPreview(); brushLibrary?.syncSettings(); }
function drawBrushPreview() { const canvas = qs("#brushPreview"), ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); const size = Math.min(32, Math.max(3, state.brush.size * .38)), effect = ["scatter", "leaf", "grass", "cloud"].includes(state.brush.tip); ctx.strokeStyle = state.foreground; ctx.globalAlpha = Math.max(.28, state.brush.opacity / 100); if (effect) {
    const stamp = getBrushStamp(state.brush, state.foreground, size);
    for (let x = 12; x < canvas.width - 8; x += Math.max(8, size * state.brush.spacing / 75)) {
        const y = canvas.height / 2 + Math.sin(x / 25) * 8;
        ctx.drawImage(stamp, x - stamp.width / 2, y - stamp.height / 2);
    }
    return;
} ctx.lineCap = state.brush.tip === "flat" || state.brush.tip === "chisel" ? "square" : "round"; ctx.lineJoin = "round"; ctx.lineWidth = state.brush.tip === "chisel" ? size * .35 : state.brush.tip === "flat" ? size * .72 : size; if (state.brush.hardness < 35) {
    ctx.shadowColor = state.foreground;
    ctx.shadowBlur = size * (1 - state.brush.hardness / 100) * .55;
    ctx.globalAlpha *= .55;
} ctx.beginPath(); ctx.moveTo(10, canvas.height * .66); ctx.bezierCurveTo(canvas.width * .28, canvas.height * .12, canvas.width * .62, canvas.height * .9, canvas.width - 10, canvas.height * .35); ctx.stroke(); }
function renderBrushPresets() { if (!brushLibrary)
    return; const container = qs("#brushPresets"), presets = brushLibrary.all.slice(0, 8); container.replaceChildren(...presets.map(preset => { const button = document.createElement("button"); button.className = "preset"; button.title = preset.name; button.setAttribute("aria-label", preset.name); const dot = document.createElement("i"); const size = clamp(preset.size / 3, 4, 34); dot.style.width = dot.style.height = `${size}px`; button.append(dot); button.addEventListener("click", () => brushLibrary.selectById(preset.id)); return button; })); }
function applyBrushPreset(preset) { activeBrushId = preset.id; localStorage.setItem("sogsketch-active-brush", activeBrushId); const recent = qs("#recentBrushes"), chip = document.createElement("button"); chip.textContent = preset.name; chip.addEventListener("click", () => brushLibrary.selectById(preset.id)); recent.prepend(chip); while (recent.children.length > 5)
    recent.lastElementChild?.remove(); renderBrushPresets(); }
function saveBrushPreset() { brushLibrary.saveCurrent(); }
function setForeground(color, remember = true) { if (!/^#[0-9a-f]{6}$/i.test(color))
    return; state.foreground = color.toUpperCase(); if (remember) {
    state.recentColors = [state.foreground, ...state.recentColors.filter(item => item !== state.foreground)].slice(0, 16);
} syncColors(); drawBrushPreview(); }
function syncColors() { fgInput.value = state.foreground; bgInput.value = state.backgroundColor; hexInput.value = state.foreground; const [r, g, b] = hexToRgb(state.foreground), [h, s, l] = rgbToHsl(r, g, b); rInput.value = String(r); gInput.value = String(g); bInput.value = String(b); hInput.value = String(h); sInput.value = String(s); lInput.value = String(l); const history = qs("#colorHistory"); history.replaceChildren(...state.recentColors.map(color => { const button = document.createElement("button"); button.className = "color-chip"; button.style.background = color; button.title = color; button.addEventListener("click", () => setForeground(color)); return button; })); }
async function loadImageFile(file) { const url = URL.createObjectURL(file); try {
    const image = await imageFromUrl(url);
    checkpoint("Import image");
    const layer = makeLayer(file.name);
    const scale = Math.min(state.width / image.naturalWidth, state.height / image.naturalHeight);
    layer.canvas.getContext("2d").drawImage(image, (state.width - image.naturalWidth * scale) / 2, (state.height - image.naturalHeight * scale) / 2, image.naturalWidth * scale, image.naturalHeight * scale);
    state.layers.push(layer);
    state.selectedLayerId = layer.id;
    renderLayers();
    composite();
}
finally {
    URL.revokeObjectURL(url);
} }
async function openProject(file) { const project = JSON.parse(await file.text()); if (project.format !== "sogsketch")
    throw new Error("Not a SogSketch project"); await restoreSnapshot({ ...project.state, label: "Open project" }); state.brush = { ...state.brush, ...project.brush }; state.guides = project.guides; history.reset(); syncBrushInputs(); fitCanvas(); setStatus("Project opened"); }
function saveProject() { const project = { format: "sogsketch", version: 1, savedAt: new Date().toISOString(), state: (() => { const { label, ...rest } = snapshot("Save project"); return rest; })(), brush: { ...state.brush }, guides: [...state.guides] }; downloadBlob(new Blob([JSON.stringify(project)], { type: "application/json" }), `${safeName()}.sogsketch`); }
function safeName() { return state.name.trim().replace(/[^a-z0-9_-]+/gi, "-") || "sogsketch"; }
function exportImage(type) { const output = document.createElement("canvas"); output.width = state.width; output.height = state.height; const ctx = output.getContext("2d"); if (type !== "image/png" && state.background === "transparent") {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, state.width, state.height);
} ctx.drawImage(paint, 0, 0); output.toBlob(blob => { if (blob)
    downloadBlob(blob, `${safeName()}.${type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp"}`); }, type, .94); }
function scheduleAutosave() { if (!state.autosave || historyBusy)
    return; clearTimeout(autosaveTimer); autosaveTimer = window.setTimeout(() => { try {
    const { label, ...saved } = snapshot("Recovery");
    localStorage.setItem("sogsketch-recovery", JSON.stringify({ format: "sogsketch", version: 1, savedAt: new Date().toISOString(), state: saved, brush: state.brush, guides: state.guides }));
}
catch {
    setStatus("Recovery storage full — project not autosaved");
} }, 1200); }
async function recover() { const raw = localStorage.getItem("sogsketch-recovery"); if (!raw || !confirm("Recover your last SogSketch document?"))
    return; await openProject(new File([raw], "recovery.sogsketch", { type: "application/json" })); }
function newDocument() { qs("#newDialog").showModal(); }
function createDocument() { const width = Number(qs("#newWidth").value), height = Number(qs("#newHeight").value); document.body.classList.remove("needs-document"); state.name = qs("#newName").value.trim() || "Untitled"; state.resolution = Number(qs("#newResolution").value) || 72; const background = qs("#newBackground").value; state.background = background === "custom" ? qs("#newBackgroundColor").value : background; state.layers = []; state.nextLayerId = 1; state.selection = null; setCanvasSize(width, height); const layer = makeLayer("Paint Layer 1"); state.layers = [layer]; state.selectedLayerId = layer.id; history.reset(); updateTitle(); renderLayers(); composite(); fitCanvas(); setStatus("New document"); }
function showMessage(title, html) { qs("#messageTitle").textContent = title; qs("#messageBody").innerHTML = html; qs("#messageDialog").showModal(); }
const commands = { new: newDocument, open: () => fileInput.click(), saveProject, exportPng: () => exportImage("image/png"), exportJpg: () => exportImage("image/jpeg"), exportWebp: () => exportImage("image/webp"), undo, redo, clear: clearSelectionOrLayer, selectAll: () => { state.selection = { x: 0, y: 0, width: state.width, height: state.height, ellipse: false }; drawSelection(); }, selectNone: () => { state.selection = null; drawSelection(); }, invertSelection: () => { state.selection = state.selection ? null : { x: 0, y: 0, width: state.width, height: state.height, ellipse: false }; drawSelection(); }, fit: fitCanvas, zoomIn: () => setZoom(state.view.zoom * 1.25), zoomOut: () => setZoom(state.view.zoom * .8), toggleGrid: () => { state.view.grid = !state.view.grid; syncView(); }, toggleRulers: () => { state.view.rulers = !state.view.rulers; syncView(); }, fullscreen: () => { document.body.classList.toggle("canvas-only"); }, resize: () => { const width = Number(prompt("New width", String(state.width))), height = Number(prompt("New height", String(state.height))); if (width && height)
        resizeDocument(width, height); }, rotateLeft: () => { state.view.rotation -= 15; syncView(); }, rotateRight: () => { state.view.rotation += 15; syncView(); }, flipH: () => { state.view.flipX *= -1; syncView(); }, flipV: () => { state.view.flipY *= -1; syncView(); }, addLayer, duplicateLayer, renameLayer, groupLayer, mergeDown, flatten, deleteLayer, filterGray: () => applyFilter("Grayscale"), filterInvert: () => applyFilter("Invert colors"), filterSepia: () => applyFilter("Sepia"), filterBlur: () => applyFilter("Soft blur"), saveWorkspace: () => { localStorage.setItem("sogsketch-workspace", JSON.stringify({ dock: !qs("#dock").classList.contains("mobile-hidden"), tools: !qs("#toolbar").classList.contains("mobile-hidden") })); setStatus("Workspace saved"); }, resetWorkspace: () => { localStorage.removeItem("sogsketch-workspace"); qs("#dock").classList.remove("mobile-hidden"); qs("#toolbar").classList.remove("mobile-hidden"); }, shortcuts: () => showMessage("Keyboard shortcuts", "<p><b>B/P/E</b> brush, pencil, eraser · <b>L/R/O</b> line, rectangle, ellipse · <b>F/G/I</b> fill, gradient, picker · <b>M/T/H/Z</b> move, text, pan, zoom · <b>Ctrl+Z/Y</b> undo/redo · <b>[ ]</b> brush size · <b>Space</b> temporary pan · <b>Enter</b> finish polygon · <b>Tab</b> canvas-only mode.</p>"), about: () => showMessage("About SogSketch", "<p>SogSketch is a lightweight, local-first drawing and painting studio. Your images stay in your browser unless you export them.</p>") };
Object.assign(commands, { addGuideX: () => { const position = Number(prompt("Horizontal guide position", String(Math.round(state.height / 2)))); if (Number.isFinite(position)) {
        state.guides.push({ axis: "x", position: clamp(position, 0, state.height) });
        drawSelection();
    } }, addGuideY: () => { const position = Number(prompt("Vertical guide position", String(Math.round(state.width / 2)))); if (Number.isFinite(position)) {
        state.guides.push({ axis: "y", position: clamp(position, 0, state.width) });
        drawSelection();
    } }, toggleSnap: () => { state.view.snap = !state.view.snap; setStatus(`Snap to guides ${state.view.snap ? "on" : "off"}`); }, clearGuides: () => { state.guides = []; drawSelection(); }, saveWorkspace: () => { const panels = [...document.querySelectorAll(".dock details")].map(panel => panel.open); localStorage.setItem("sogsketch-workspace", JSON.stringify({ dock: !qs("#dock").classList.contains("mobile-hidden"), tools: !qs("#toolbar").classList.contains("mobile-hidden"), panels, grid: state.view.grid, rulers: state.view.rulers, snap: state.view.snap })); setStatus("Workspace saved"); } });
function restoreWorkspacePreferences() { const saved = JSON.parse(localStorage.getItem("sogsketch-workspace") ?? "null"); if (!saved)
    return; if (saved.panels)
    document.querySelectorAll(".dock details").forEach((panel, index) => panel.open = saved.panels?.[index] ?? panel.open); state.view.grid = saved.grid ?? state.view.grid; state.view.rulers = saved.rulers ?? state.view.rulers; state.view.snap = saved.snap ?? state.view.snap; syncView(); }
function bindUi() { document.querySelectorAll("[data-tool]").forEach(button => button.addEventListener("click", () => setTool(button.dataset.tool))); document.querySelectorAll("[data-tool-command]").forEach(button => button.addEventListener("click", () => setTool(button.dataset.toolCommand))); document.querySelectorAll("[data-command]").forEach(button => button.addEventListener("click", () => { const command = button.dataset.command; if (command)
    void commands[command]?.(); button.closest(".menus details")?.removeAttribute("open"); })); for (const key of ["size", "opacity", "flow", "hardness", "spacing", "smoothing", "stabilizer"]) {
    qs(`#${key}Input`).addEventListener("input", event => { state.brush[key] = Number(event.target.value); syncBrushInputs(); });
} qs("#eraserModeButton").addEventListener("click", () => { state.brush.eraserMode = !state.brush.eraserMode; syncBrushInputs(); }); qs("#symmetryButton").addEventListener("click", () => { state.brush.symmetry = !state.brush.symmetry; syncBrushInputs(); }); overlay.addEventListener("pointerdown", pointerDown); overlay.addEventListener("pointermove", pointerMove); overlay.addEventListener("pointerup", pointerUp); overlay.addEventListener("pointercancel", pointerUp); overlay.addEventListener("dblclick", finishPath); viewport.addEventListener("pointerdown", viewportPointerDown); viewport.addEventListener("pointermove", viewportPointerMove); viewport.addEventListener("pointerup", viewportPointerUp); viewport.addEventListener("pointercancel", viewportPointerUp); viewport.addEventListener("wheel", event => { event.preventDefault(); setZoom(state.view.zoom * (event.deltaY < 0 ? 1.12 : .89)); }, { passive: false }); qs("#zoomInput").addEventListener("input", event => setZoom(Number(event.target.value) / 100)); fileInput.addEventListener("change", async () => { for (const file of [...(fileInput.files ?? [])]) {
    if (file.name.endsWith(".sogsketch") || file.type === "application/json")
        await openProject(file);
    else if (file.type.startsWith("image/"))
        await loadImageFile(file);
} fileInput.value = ""; }); qs("#blendMode").addEventListener("change", event => { const layer = selectedLayer(); if (!layer)
    return; checkpoint("Blend mode"); layer.blendMode = event.target.value; composite(); }); qs("#layerOpacity").addEventListener("pointerdown", () => checkpoint("Layer opacity")); qs("#layerOpacity").addEventListener("input", event => { const layer = selectedLayer(); if (layer) {
    layer.opacity = Number(event.target.value);
    composite();
} }); qs("#alphaInherit").addEventListener("change", event => { const layer = selectedLayer(); if (layer) {
    checkpoint("Alpha inherit");
    layer.alphaInherit = event.target.checked;
    renderLayers();
    composite();
} }); fgInput.addEventListener("input", () => setForeground(fgInput.value)); bgInput.addEventListener("input", () => { state.backgroundColor = bgInput.value.toUpperCase(); }); hexInput.addEventListener("change", () => setForeground(hexInput.value)); for (const input of [rInput, gInput, bInput])
    input.addEventListener("change", () => setForeground(rgbToHex(Number(rInput.value), Number(gInput.value), Number(bInput.value)))); for (const input of [hInput, sInput, lInput])
    input.addEventListener("change", () => setForeground(rgbToHex(...hslToRgb(Number(hInput.value), Number(sInput.value), Number(lInput.value))))); qs("#swapColors").addEventListener("click", () => { [state.foreground, state.backgroundColor] = [state.backgroundColor, state.foreground]; syncColors(); }); qs("#resetColors").addEventListener("click", () => { state.foreground = "#000000"; state.backgroundColor = "#FFFFFF"; syncColors(); }); qs("#saveBrushPreset").addEventListener("click", saveBrushPreset); qs("#toolsToggle").addEventListener("click", () => qs("#toolbar").classList.toggle("mobile-hidden")); const dock = qs("#dock"), dockToggle = qs("#dockToggle"); const setDockHidden = (hidden) => { dock.classList.toggle("mobile-hidden", hidden); dockToggle.title = hidden ? "Open edit panels" : "Close edit panels"; dockToggle.setAttribute("aria-expanded", String(!hidden)); }; dockToggle.addEventListener("click", () => setDockHidden(!dock.classList.contains("mobile-hidden"))); qs("#dockClose").addEventListener("click", () => setDockHidden(true)); qs("#autosaveToggle").addEventListener("change", event => { state.autosave = event.target.checked; }); const newDialog = qs("#newDialog"); newDialog.addEventListener("cancel", event => { if (document.body.classList.contains("needs-document"))
    event.preventDefault(); }); newDialog.addEventListener("close", () => { if (document.body.classList.contains("needs-document"))
    setTimeout(() => newDialog.showModal(), 0); }); qs("#newBackground").addEventListener("change", event => { qs("#customBackgroundLabel").hidden = event.target.value !== "custom"; }); qs("#newOrientation").addEventListener("change", event => { const width = qs("#newWidth"), height = qs("#newHeight"); const wantsPortrait = event.target.value === "portrait"; if ((Number(width.value) < Number(height.value)) !== wantsPortrait)
    [width.value, height.value] = [height.value, width.value]; }); document.querySelectorAll("[data-preset-category]").forEach(button => button.addEventListener("click", () => { document.querySelectorAll("[data-preset-category]").forEach(item => item.classList.remove("active")); button.classList.add("active"); document.querySelectorAll(".preset-card").forEach(card => card.classList.toggle("hidden", card.dataset.category !== button.dataset.presetCategory)); })); document.querySelectorAll(".preset-card[data-size]").forEach(card => card.addEventListener("click", () => { document.querySelectorAll(".preset-card").forEach(item => item.classList.remove("selected")); card.classList.add("selected"); const [width, height] = card.dataset.size.split("x").map(Number); qs("#newWidth").value = String(width); qs("#newHeight").value = String(height); })); qs("#swapCanvasSize").addEventListener("click", () => { const width = qs("#newWidth"), height = qs("#newHeight"); [width.value, height.value] = [height.value, width.value]; }); qs("#supportClose").addEventListener("click", () => { qs("#supportPopup").hidden = true; }); qs("#createDocument").addEventListener("click", createDocument); qs("#applyText").addEventListener("click", () => { if (!textPoint)
    return; checkpoint("Text"); withLayerContext(ctx => { ctx.font = `${qs("#fontStyle").value} ${Number(qs("#fontSize").value)}px ${qs("#fontFamily").value}`; ctx.fillStyle = state.foreground; ctx.fillText(qs("#textValue").value, textPoint.x, textPoint.y); }); textPoint = null; }); window.addEventListener("resize", fitCanvas); document.addEventListener("pointerdown", event => { if (!event.target.closest(".menus details"))
    document.querySelectorAll(".menus details[open]").forEach(item => item.removeAttribute("open")); }); }
function keyHandler(event) { const target = event.target; if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
    return; const mod = event.ctrlKey || event.metaKey, key = event.key.toLowerCase(); if (mod && key === "z") {
    event.preventDefault();
    void (event.shiftKey ? redo() : undo());
    return;
} if (mod && key === "y") {
    event.preventDefault();
    void redo();
    return;
} if (mod && key === "s") {
    event.preventDefault();
    saveProject();
    return;
} if (mod && key === "o") {
    event.preventDefault();
    fileInput.click();
    return;
} if (mod && key === "n") {
    event.preventDefault();
    newDocument();
    return;
} if (mod && key === "a") {
    event.preventDefault();
    commands.selectAll?.();
    return;
} if (mod && key === "d") {
    event.preventDefault();
    commands.selectNone?.();
    return;
} if (event.key === "Enter" && (state.tool === "polygon" || state.tool === "polyline")) {
    finishPath();
    return;
} if (event.key === "Delete") {
    clearSelectionOrLayer();
    return;
} if (event.key === "[") {
    state.brush.size = clamp(state.brush.size - 2, 1, 500);
    syncBrushInputs();
    return;
} if (event.key === "]") {
    state.brush.size = clamp(state.brush.size + 2, 1, 500);
    syncBrushInputs();
    return;
} if (event.key === "Tab") {
    event.preventDefault();
    commands.fullscreen?.();
    return;
} if (event.key === "Escape") {
    state.selection = null;
    pathPoints = [];
    drawSelection();
    return;
} const map = { b: "brush", p: "pencil", e: "eraser", u: "smudge", l: "line", r: "rectangle", o: "ellipse", f: "fill", g: "gradient", i: "picker", m: "move", c: "crop", s: "selectRect", t: "text", h: "pan", z: "zoom" }; if (map[key])
    setTool(map[key]); if (key === "x") {
    [state.foreground, state.backgroundColor] = [state.backgroundColor, state.foreground];
    syncColors();
} if (key === "d") {
    state.foreground = "#000000";
    state.backgroundColor = "#FFFFFF";
    syncColors();
} if (key === "2")
    fitCanvas(); }
function bindBrushEngineUi() { for (const key of ["rotation", "angle", "blendStrength"]) {
    qs(`#${key}Input`).addEventListener("input", event => { state.brush[key] = Number(event.target.value); syncBrushInputs(); });
} document.querySelectorAll("[data-tool]").forEach(button => button.addEventListener("click", () => { qs("#blendStrengthOption").hidden = button.dataset.tool !== "smudge"; if (button.dataset.tool === "smudge")
    qs("#canvasHud").textContent = "Drag across paint to blend colours"; })); document.addEventListener("keydown", event => { if (event.key.toLowerCase() === "u" && !(["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)))
    qs("#blendStrengthOption").hidden = false; }); brushLibrary = new BrushLibrary(() => state.brush, settings => { state.brush = { ...settings }; syncBrushInputs(); }, applyBrushPreset); brushLibrary.selectById(activeBrushId); }
async function init() { document.body.classList.add("needs-document"); setCanvasSize(Number(qs("#newWidth").value), Number(qs("#newHeight").value)); state.layers = []; state.selectedLayerId = null; bindUi(); bindBrushEngineUi(); document.addEventListener("keydown", keyHandler); syncView(); syncColors(); syncBrushInputs(); renderBrushPresets(); renderLayers(); updateTitle(); composite(); setTimeout(fitCanvas, 50); const workspace = JSON.parse(localStorage.getItem("sogsketch-workspace") ?? "null"); if (workspace?.dock === false)
    qs("#dock").classList.add("mobile-hidden"); if (workspace?.tools === false)
    qs("#toolbar").classList.add("mobile-hidden"); if (matchMedia("(max-width:900px)").matches)
    qs("#dock").classList.add("mobile-hidden"); setStatus("Choose a canvas"); setTimeout(() => qs("#newDialog").showModal(), 0); }
restoreWorkspacePreferences();
void init().catch(error => { console.error(error); showMessage("SogSketch error", `<p>${String(error)}</p>`); });
//# sourceMappingURL=app.js.map