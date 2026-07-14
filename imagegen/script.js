const newProjectView = document.querySelector("#newProjectView");
const editorView = document.querySelector("#editorView");
const canvas = document.querySelector("#canvas");
const context = canvas.getContext("2d");
const input = document.querySelector("#imageInput");
const widthInput = document.querySelector("#widthInput");
const heightInput = document.querySelector("#heightInput");
const projectName = document.querySelector("#projectName");
const backgroundInput = document.querySelector("#backgroundInput");
const zoomInput = document.querySelector("#zoomInput");
const zoomValue = document.querySelector("#zoomValue");
const zoomStatus = document.querySelector("#zoomStatus");
const resolutionLabel = document.querySelector("#resolutionLabel");
const emptyState = document.querySelector("#emptyState");
const jpegButton = document.querySelector("#jpegButton");
const pngButton = document.querySelector("#pngButton");
const dropZone = document.querySelector("#dropZone");
const filterSelect = document.querySelector("#filterSelect");
const brightnessInput = document.querySelector("#brightnessInput");
const contrastInput = document.querySelector("#contrastInput");
const dotSizeInput = document.querySelector("#dotSizeInput");
const halftoneInput = document.querySelector("#halftoneInput");
const canvasStage = document.querySelector(".canvas-stage");
const canvasDocument = document.querySelector("#canvasDocument");
const moveTool = document.querySelector("#moveTool");
const handTool = document.querySelector("#handTool");

const state = { image:null, baseScale:1, zoom:1, offsetX:0, offsetY:0, rotation:0, background:"#000000", dragging:false, filter:"none", brightness:100, contrast:100, halftone:false, dotSize:6, tool:"move", viewZoom:1, viewX:0, viewY:0, viewDragging:false };

function boundedSize(value) { return Math.min(4096, Math.max(320, Math.round(Number(value) || 320))); }

function createProject() {
  canvas.width = boundedSize(widthInput.value);
  canvas.height = boundedSize(heightInput.value);
  state.background = backgroundInput.value;
  document.querySelector("#documentName").textContent = projectName.value.trim() || "Untitled";
  resolutionLabel.textContent = `${canvas.width} × ${canvas.height} px`;
  newProjectView.hidden = true;
  editorView.hidden = false;
  resetWorkspaceView();
  centerImage();
}

function showNewProject() { editorView.hidden = true; newProjectView.hidden = false; }

function centerImage() {
  state.zoom = 1; state.offsetX = 0; state.offsetY = 0;
  zoomInput.value = 100; updateZoomLabels();
  if (state.image) calculateBaseScale();
  draw();
}

function calculateBaseScale() {
  const rotated = state.rotation % 180 !== 0;
  const imageWidth = rotated ? state.image.naturalHeight : state.image.naturalWidth;
  const imageHeight = rotated ? state.image.naturalWidth : state.image.naturalHeight;
  state.baseScale = Math.max(canvas.width / imageWidth, canvas.height / imageHeight);
}

function imageBounds() {
  const rotated = state.rotation % 180 !== 0;
  return {
    width:(rotated ? state.image.naturalHeight : state.image.naturalWidth) * state.baseScale * state.zoom,
    height:(rotated ? state.image.naturalWidth : state.image.naturalHeight) * state.baseScale * state.zoom
  };
}

function clampOffsets() {
  if (!state.image) return;
  const bounds = imageBounds();
  const maxX = Math.max(0, (bounds.width - canvas.width) / 2);
  const maxY = Math.max(0, (bounds.height - canvas.height) / 2);
  state.offsetX = Math.min(maxX, Math.max(-maxX, state.offsetX));
  state.offsetY = Math.min(maxY, Math.max(-maxY, state.offsetY));
}

function drawBackground() {
  context.clearRect(0,0,canvas.width,canvas.height);
  if (state.background !== "transparent") { context.fillStyle=state.background; context.fillRect(0,0,canvas.width,canvas.height); }
}

function draw() {
  drawBackground();
  if (!state.image) return;
  clampOffsets();
  const scale = state.baseScale * state.zoom;
  context.save();
  context.translate(canvas.width/2 + state.offsetX, canvas.height/2 + state.offsetY);
  context.rotate(state.rotation * Math.PI / 180);
  context.filter = buildCanvasFilter();
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = "high";
  context.drawImage(state.image, -state.image.naturalWidth*scale/2, -state.image.naturalHeight*scale/2, state.image.naturalWidth*scale, state.image.naturalHeight*scale);
  context.restore();
  if (state.halftone) drawHalftone();
}

function buildCanvasFilter() {
  const filters = [`brightness(${state.brightness}%)`, `contrast(${state.contrast}%)`];
  if (state.filter === "bw" || state.filter === "archive") filters.push("grayscale(1)");
  if (state.filter === "invert") filters.push("invert(1)");
  if (state.filter === "warm") filters.push("sepia(.62)", "saturate(1.25)");
  return filters.join(" ");
}

function drawHalftone() {
  const size = state.dotSize;
  const tile = document.createElement("canvas");
  tile.width = size; tile.height = size;
  const tileContext = tile.getContext("2d");
  tileContext.fillStyle = "rgba(0,0,0,.72)";
  tileContext.beginPath();
  tileContext.arc(size/2, size/2, Math.max(.65,size*.23), 0, Math.PI*2);
  tileContext.fill();
  context.save();
  context.globalCompositeOperation = "multiply";
  context.fillStyle = context.createPattern(tile,"repeat");
  context.fillRect(0,0,canvas.width,canvas.height);
  context.restore();
}

function updateFilterControls() {
  filterSelect.value = state.filter;
  brightnessInput.value = state.brightness;
  contrastInput.value = state.contrast;
  dotSizeInput.value = state.dotSize;
  halftoneInput.checked = state.halftone;
  document.querySelector("#brightnessValue").value = `${state.brightness}%`;
  document.querySelector("#contrastValue").value = `${state.contrast}%`;
  document.querySelector("#dotSizeValue").value = `${state.dotSize}px`;
  document.querySelector(".dot-control").classList.toggle("disabled",!state.halftone);
  document.querySelectorAll("[data-filter]").forEach((button)=>button.classList.toggle("active",button.dataset.filter===state.filter));
}

function applyFilterPreset(name) {
  state.filter = name;
  if (name === "archive") { state.brightness=68; state.contrast=215; state.halftone=true; }
  else if (name === "bw") { state.brightness=100; state.contrast=115; state.halftone=false; }
  else if (name === "warm") { state.brightness=104; state.contrast=92; state.halftone=false; }
  else { state.brightness=100; state.contrast=100; state.halftone=false; }
  updateFilterControls(); draw();
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file); const image = new Image();
  image.onload = () => {
    URL.revokeObjectURL(url); state.image=image; state.rotation=0;
    document.querySelector("#layerName").textContent=file.name;
    document.querySelector("#layerThumb").style.backgroundImage=`url("${image.src}")`;
    emptyState.hidden=true; dropZone.classList.remove("empty"); jpegButton.disabled=false; pngButton.disabled=false; centerImage();
  };
  image.src=url;
}

function updateZoomLabels() { zoomValue.value=`${zoomInput.value}%`; }

function updateWorkspaceView() {
  canvasDocument.style.setProperty("--view-zoom",state.viewZoom);
  canvasDocument.style.setProperty("--view-x",`${state.viewX}px`);
  canvasDocument.style.setProperty("--view-y",`${state.viewY}px`);
  zoomStatus.textContent=`${Math.round(state.viewZoom*100)}%`;
}

function resetWorkspaceView() { state.viewZoom=1; state.viewX=0; state.viewY=0; updateWorkspaceView(); }

function selectTool(tool) {
  state.tool=tool;
  moveTool.classList.toggle("active",tool==="move");
  handTool.classList.toggle("active",tool==="hand");
  dropZone.classList.toggle("hand",tool==="hand");
}

function download(type) {
  if (!state.image) return;
  const extension=type==="image/png"?"png":"jpg";
  const safeName=(projectName.value||"sogz-image").trim().replace(/[^a-z0-9_-]+/gi,"-");
  canvas.toBlob((blob)=>{ if(!blob)return; const link=document.createElement("a"); link.href=URL.createObjectURL(blob); link.download=`${safeName}.${extension}`; link.click(); setTimeout(()=>URL.revokeObjectURL(link.href),1000); },type,.94);
}

document.querySelectorAll("[data-category]").forEach((button)=>{
  if (!button.closest(".category-tabs")) return;
  button.addEventListener("click",()=>{
    document.querySelectorAll(".category-tabs button").forEach((item)=>item.classList.remove("active")); button.classList.add("active");
    document.querySelectorAll(".preset-card").forEach((card)=>card.classList.toggle("hidden",card.dataset.category!==button.dataset.category));
  });
});

document.querySelectorAll(".preset-card").forEach((card)=>card.addEventListener("click",()=>{
  document.querySelectorAll(".preset-card").forEach((item)=>item.classList.remove("selected")); card.classList.add("selected");
  if (card.dataset.preset==="current") {
    const ratio=window.innerWidth/window.innerHeight; widthInput.value=ratio>=1?1920:Math.round(1920*ratio); heightInput.value=ratio>=1?Math.round(1920/ratio):1920;
  } else { const [width,height]=card.dataset.size.split("x").map(Number); widthInput.value=width; heightInput.value=height; }
}));

document.querySelector("#swapButton").addEventListener("click",()=>{ const width=widthInput.value; widthInput.value=heightInput.value; heightInput.value=width; });
document.querySelector("#createButton").addEventListener("click",createProject);
document.querySelector("#newButton").addEventListener("click",showNewProject);
document.querySelector("#screenButton").addEventListener("click",()=>{ showNewProject(); document.querySelector("[data-category='screen']").click(); });

function openPicker() { input.click(); }
["#openButton","#toolbarOpen","#replaceButton"].forEach((selector)=>document.querySelector(selector).addEventListener("click",openPicker));
input.addEventListener("change",()=>loadFile(input.files[0]));
["#centerMenuButton","#toolbarCenter","#centerButton"].forEach((selector)=>document.querySelector(selector).addEventListener("click",centerImage));
document.querySelector("#toolbarRotate").addEventListener("click",()=>{ if(!state.image)return; state.rotation=(state.rotation+90)%360; calculateBaseScale(); centerImage(); });
moveTool.addEventListener("click",()=>selectTool("move"));
handTool.addEventListener("click",()=>selectTool("hand"));

document.querySelectorAll("[data-filter]").forEach((button)=>button.addEventListener("click",()=>applyFilterPreset(button.dataset.filter)));
filterSelect.addEventListener("change",()=>applyFilterPreset(filterSelect.value));
brightnessInput.addEventListener("input",()=>{ state.brightness=Number(brightnessInput.value); updateFilterControls(); draw(); });
contrastInput.addEventListener("input",()=>{ state.contrast=Number(contrastInput.value); updateFilterControls(); draw(); });
dotSizeInput.addEventListener("input",()=>{ state.dotSize=Number(dotSizeInput.value); updateFilterControls(); draw(); });
halftoneInput.addEventListener("change",()=>{ state.halftone=halftoneInput.checked; updateFilterControls(); draw(); });

zoomInput.addEventListener("input",()=>{ state.zoom=Number(zoomInput.value)/100; updateZoomLabels(); draw(); });
jpegButton.addEventListener("click",()=>download("image/jpeg")); pngButton.addEventListener("click",()=>download("image/png"));

canvas.addEventListener("pointerdown",(event)=>{ if(!state.image || state.tool!=="move" || event.button!==0)return; state.dragging=true; state.startX=event.clientX; state.startY=event.clientY; state.startOffsetX=state.offsetX; state.startOffsetY=state.offsetY; canvas.setPointerCapture(event.pointerId); canvas.classList.add("dragging"); });
canvas.addEventListener("pointermove",(event)=>{ if(!state.dragging)return; const rect=canvas.getBoundingClientRect(); state.offsetX=state.startOffsetX+(event.clientX-state.startX)*canvas.width/rect.width; state.offsetY=state.startOffsetY+(event.clientY-state.startY)*canvas.height/rect.height; draw(); });
function stopDragging(event){ state.dragging=false; if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId); canvas.classList.remove("dragging"); }
canvas.addEventListener("pointerup",stopDragging); canvas.addEventListener("pointercancel",stopDragging);

canvasStage.addEventListener("wheel",(event)=>{
  event.preventDefault();
  const next=state.viewZoom*(event.deltaY<0?1.12:.89);
  state.viewZoom=Math.min(4,Math.max(.25,next));
  updateWorkspaceView();
},{passive:false});

canvasStage.addEventListener("pointerdown",(event)=>{
  const wantsPan=state.tool==="hand" || event.button===1 || event.target===canvasStage;
  if(!state.image || !wantsPan)return;
  state.viewDragging=true; state.viewStartX=event.clientX; state.viewStartY=event.clientY; state.viewStartPanX=state.viewX; state.viewStartPanY=state.viewY;
  canvasStage.setPointerCapture(event.pointerId); dropZone.classList.add("panning");
});
canvasStage.addEventListener("pointermove",(event)=>{ if(!state.viewDragging)return; state.viewX=state.viewStartPanX+event.clientX-state.viewStartX; state.viewY=state.viewStartPanY+event.clientY-state.viewStartY; updateWorkspaceView(); });
function stopWorkspacePan(event){ if(!state.viewDragging)return; state.viewDragging=false; if(canvasStage.hasPointerCapture(event.pointerId))canvasStage.releasePointerCapture(event.pointerId); dropZone.classList.remove("panning"); }
canvasStage.addEventListener("pointerup",stopWorkspacePan); canvasStage.addEventListener("pointercancel",stopWorkspacePan);

["dragenter","dragover"].forEach((name)=>dropZone.addEventListener(name,(event)=>{event.preventDefault();}));
["dragleave","drop"].forEach((name)=>dropZone.addEventListener(name,(event)=>{event.preventDefault();}));
dropZone.addEventListener("drop",(event)=>loadFile(event.dataTransfer.files[0]));
dropZone.addEventListener("click",()=>{ if(!state.image) openPicker(); });
dropZone.classList.add("empty");
updateFilterControls();
updateWorkspaceView();
draw();
