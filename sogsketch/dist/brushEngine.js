const base = { size: 24, opacity: 100, flow: 100, hardness: 90, spacing: 10, smoothing: 35, stabilizer: 4, rotation: 0, angle: 0, randomSize: 0, randomOpacity: 0, randomRotation: 0, blendStrength: 55, tip: "round", texture: "none" };
const p = (category, id, name, changes) => ({ id, name, category, ...base, ...changes });
export const defaultBrushes = [
    p("Pencil", "hb-pencil", "HB Pencil", { size: 4, flow: 82, hardness: 92, spacing: 7, smoothing: 18, texture: "paper" }),
    p("Pencil", "2b-pencil", "2B Pencil", { size: 7, opacity: 88, flow: 74, hardness: 76, spacing: 8, smoothing: 20, texture: "grain", randomOpacity: 8 }),
    p("Pencil", "6b-pencil", "6B Pencil", { size: 13, opacity: 82, flow: 60, hardness: 55, spacing: 9, smoothing: 15, texture: "charcoal", randomSize: 8, randomOpacity: 12 }),
    p("Pencil", "mechanical-pencil", "Mechanical Pencil", { size: 2, hardness: 100, spacing: 5, smoothing: 28, stabilizer: 6 }),
    p("Pencil", "rough-sketch", "Rough Sketch", { size: 8, opacity: 72, flow: 58, hardness: 65, spacing: 12, smoothing: 10, texture: "paper", randomSize: 16, randomOpacity: 18 }),
    p("Ink", "fine-liner", "Fine Liner", { size: 5, hardness: 100, spacing: 5, smoothing: 62, stabilizer: 8 }),
    p("Ink", "ink-pen", "Ink Pen", { size: 15, hardness: 96, spacing: 6, smoothing: 66, stabilizer: 7, tip: "bristle", angle: 8 }),
    p("Ink", "g-pen", "G Pen", { size: 12, hardness: 100, spacing: 4, smoothing: 72, stabilizer: 10, tip: "chisel", angle: 28 }),
    p("Ink", "comic-pen", "Comic Pen", { size: 18, hardness: 100, spacing: 5, smoothing: 78, stabilizer: 12, tip: "chisel", angle: 42 }),
    p("Ink", "technical-pen", "Technical Pen", { size: 3, hardness: 100, spacing: 3, smoothing: 82, stabilizer: 14 }),
    p("Paint", "soft-round", "Soft Round", { size: 90, opacity: 55, flow: 28, hardness: 5, spacing: 6, smoothing: 45 }),
    p("Paint", "hard-round", "Hard Round", { size: 36, hardness: 100, spacing: 5, smoothing: 48 }),
    p("Paint", "airbrush", "Airbrush", { size: 135, opacity: 35, flow: 16, hardness: 0, spacing: 5, smoothing: 38 }),
    p("Paint", "gouache", "Gouache", { size: 58, opacity: 94, flow: 76, hardness: 72, spacing: 9, smoothing: 48, tip: "round", texture: "paper", randomOpacity: 3 }),
    p("Paint", "acrylic", "Acrylic", { size: 64, opacity: 96, flow: 84, hardness: 82, spacing: 8, smoothing: 32, tip: "flat", texture: "canvas", angle: 18 }),
    p("Paint", "oil-paint", "Oil Paint", { size: 72, opacity: 92, flow: 64, hardness: 68, spacing: 7, smoothing: 44, tip: "bristle", texture: "canvas", randomRotation: 8 }),
    p("Paint", "flat-brush", "Flat Brush", { size: 80, hardness: 94, spacing: 6, smoothing: 42, tip: "flat", angle: 25 }),
    p("Paint", "wet-paint", "Wet Paint", { size: 76, opacity: 80, flow: 48, hardness: 38, spacing: 6, smoothing: 52, tip: "bristle", texture: "wet", blendStrength: 32 }),
    p("Marker", "alcohol-marker", "Alcohol Marker", { size: 52, opacity: 60, flow: 52, hardness: 72, spacing: 5, smoothing: 60, tip: "chisel", angle: 34 }),
    p("Marker", "chisel-marker", "Chisel Marker", { size: 44, opacity: 88, flow: 78, hardness: 92, spacing: 5, smoothing: 55, tip: "chisel", angle: 45 }),
    p("Marker", "round-marker", "Round Marker", { size: 32, opacity: 82, flow: 72, hardness: 88, spacing: 5, smoothing: 55 }),
    p("Marker", "soft-marker", "Soft Marker", { size: 56, opacity: 48, flow: 35, hardness: 28, spacing: 6, smoothing: 62 }),
    p("Watercolor", "soft-watercolor", "Soft Watercolor", { size: 110, opacity: 34, flow: 20, hardness: 10, spacing: 8, smoothing: 48, texture: "paper", randomOpacity: 10 }),
    p("Watercolor", "wet-watercolor", "Wet Watercolor", { size: 125, opacity: 38, flow: 18, hardness: 4, spacing: 7, smoothing: 55, texture: "wet", randomSize: 8, randomOpacity: 14 }),
    p("Watercolor", "dry-watercolor", "Dry Watercolor", { size: 72, opacity: 55, flow: 34, hardness: 48, spacing: 12, smoothing: 38, tip: "bristle", texture: "paper", randomOpacity: 18 }),
    p("Watercolor", "wash-brush", "Wash Brush", { size: 180, opacity: 22, flow: 12, hardness: 0, spacing: 5, smoothing: 65, tip: "flat", texture: "wet" }),
    p("Texture", "chalk", "Chalk", { size: 48, opacity: 76, flow: 62, hardness: 68, spacing: 14, smoothing: 24, texture: "chalk", randomSize: 12, randomOpacity: 18, randomRotation: 25 }),
    p("Texture", "charcoal", "Charcoal", { size: 66, opacity: 78, flow: 52, hardness: 45, spacing: 13, smoothing: 18, tip: "bristle", texture: "charcoal", randomSize: 18, randomOpacity: 22, randomRotation: 35 }),
    p("Texture", "pastel", "Pastel", { size: 54, opacity: 68, flow: 50, hardness: 42, spacing: 11, smoothing: 26, texture: "grain", randomOpacity: 14 }),
    p("Texture", "sponge", "Sponge", { size: 95, opacity: 62, flow: 45, hardness: 55, spacing: 24, smoothing: 12, tip: "scatter", texture: "grain", randomSize: 30, randomOpacity: 25, randomRotation: 100 }),
    p("Texture", "grain-brush", "Grain Brush", { size: 70, opacity: 70, flow: 48, hardness: 58, spacing: 12, smoothing: 30, texture: "grain", randomSize: 12, randomOpacity: 20 }),
    p("Effects", "glow", "Glow", { size: 100, opacity: 54, flow: 30, hardness: 0, spacing: 5, smoothing: 52 }),
    p("Effects", "scatter", "Scatter", { size: 52, opacity: 78, flow: 70, hardness: 90, spacing: 30, smoothing: 8, tip: "scatter", randomSize: 55, randomOpacity: 35, randomRotation: 100 }),
    p("Effects", "leaves", "Leaves", { size: 42, opacity: 92, flow: 82, hardness: 100, spacing: 42, smoothing: 15, tip: "leaf", randomSize: 38, randomOpacity: 16, randomRotation: 100 }),
    p("Effects", "grass", "Grass", { size: 64, opacity: 88, flow: 82, hardness: 94, spacing: 18, smoothing: 22, tip: "grass", randomSize: 28, randomOpacity: 14, randomRotation: 15 }),
    p("Effects", "clouds", "Clouds", { size: 160, opacity: 28, flow: 18, hardness: 2, spacing: 18, smoothing: 48, tip: "cloud", randomSize: 35, randomOpacity: 25, randomRotation: 100 })
];
export const brushCategories = ["Pencil", "Ink", "Paint", "Marker", "Watercolor", "Texture", "Effects", "Custom"];
const stampCache = new Map();
const hash = (text) => { let value = 2166136261; for (let i = 0; i < text.length; i++)
    value = Math.imul(value ^ text.charCodeAt(i), 16777619); return value >>> 0; };
const randomFactory = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export function getBrushStamp(settings, color, size) {
    const px = Math.max(2, Math.ceil(size)), key = [settings.tip, settings.texture, settings.hardness, color, px].join("|");
    const cached = stampCache.get(key);
    if (cached)
        return cached;
    const pad = Math.max(3, Math.ceil(px * .18)), canvas = document.createElement("canvas");
    canvas.width = canvas.height = px + pad * 2;
    const ctx = canvas.getContext("2d"), cx = canvas.width / 2, cy = canvas.height / 2, r = px / 2;
    ctx.fillStyle = color;
    const shape = () => { ctx.beginPath(); if (settings.tip === "flat")
        ctx.roundRect(cx - r, cy - r * .32, px, px * .64, Math.max(1, r * .08));
    else if (settings.tip === "chisel") {
        ctx.ellipse(cx, cy, r, r * .24, 0, 0, Math.PI * 2);
    }
    else if (settings.tip === "leaf") {
        ctx.moveTo(cx - r, cy);
        ctx.quadraticCurveTo(cx, cy - r, cx + r, cy);
        ctx.quadraticCurveTo(cx, cy + r, cx - r, cy);
    }
    else if (settings.tip === "grass") {
        for (let i = -2; i <= 2; i++) {
            ctx.moveTo(cx + i * r * .18, cy + r);
            ctx.quadraticCurveTo(cx + i * r * .25, cy, cx + i * r * .38, cy - r);
        }
    }
    else if (settings.tip === "cloud") {
        ctx.arc(cx - r * .36, cy, r * .48, 0, Math.PI * 2);
        ctx.arc(cx, cy - r * .2, r * .58, 0, Math.PI * 2);
        ctx.arc(cx + r * .42, cy + r * .02, r * .42, 0, Math.PI * 2);
    }
    else if (settings.tip === "bristle") {
        for (let i = -3; i <= 3; i++)
            ctx.ellipse(cx + i * r * .22, cy, r * .14, r, 0, 0, Math.PI * 2);
    }
    else
        ctx.arc(cx, cy, r, 0, Math.PI * 2); };
    if (settings.tip === "round" && settings.hardness < 98) {
        const gradient = ctx.createRadialGradient(cx, cy, r * settings.hardness / 100, cx, cy, r);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
    }
    shape();
    ctx.fill();
    if (settings.tip === "scatter") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const rnd = randomFactory(hash(key));
        for (let i = 0; i < 18; i++) {
            ctx.globalAlpha = .35 + rnd() * .65;
            ctx.beginPath();
            ctx.arc(cx + (rnd() - .5) * px, cy + (rnd() - .5) * px, Math.max(1, rnd() * r * .24), 0, Math.PI * 2);
            ctx.fill();
        }
    }
    if (settings.texture !== "none") {
        const rnd = randomFactory(hash(key + settings.texture));
        ctx.save();
        ctx.globalCompositeOperation = "destination-out";
        const densities = { none: 0, paper: .10, grain: .18, chalk: .28, charcoal: .34, canvas: .17, wet: .08 }, density = densities[settings.texture];
        for (let i = 0; i < px * px * density / 18; i++) {
            ctx.globalAlpha = .15 + rnd() * .55;
            const x = pad + rnd() * px, y = pad + rnd() * px, s = settings.texture === "canvas" ? 1 : 1 + rnd() * 3;
            ctx.fillRect(x, y, s, s);
        }
        ctx.restore();
    }
    stampCache.set(key, canvas);
    if (stampCache.size > 180)
        stampCache.delete(stampCache.keys().next().value);
    return canvas;
}
export function presetToSettings(preset, current) { return { ...current, ...preset, eraserMode: false, symmetry: current.symmetry }; }
export function validateBrushes(presets) { const ids = new Set(); return presets.flatMap(brush => { const errors = []; if (!brush.id || ids.has(brush.id))
    errors.push(`Invalid or duplicate id: ${brush.id}`); ids.add(brush.id); if (brush.size <= 0 || brush.opacity < 1 || brush.opacity > 100 || brush.spacing < 1)
    errors.push(`Invalid settings: ${brush.name}`); return errors; }); }
//# sourceMappingURL=brushEngine.js.map