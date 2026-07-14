const $ = (selector) => document.querySelector(selector);
const newProjectView = $("#newProjectView");
const editorView = $("#editorView");
const canvas = $("#canvas");
const context = canvas.getContext("2d");
const input = $("#imageInput");
const widthInput = $("#widthInput");
const heightInput = $("#heightInput");
const projectName = $("#projectName");
const backgroundInput = $("#backgroundInput");
const zoomInput = $("#zoomInput");
const zoomValue = $("#zoomValue");
const zoomStatus = $("#zoomStatus");
const resolutionLabel = $("#resolutionLabel");
const emptyState = $("#emptyState");
const jpegButton = $("#jpegButton");
const pngButton = $("#pngButton");
const dropZone = $("#dropZone");
const filterSelect = $("#filterSelect");
const brightnessInput = $("#brightnessInput");
const contrastInput = $("#contrastInput");
const dotSizeInput = $("#dotSizeInput");
const halftoneInput = $("#halftoneInput");
const brushSizeInput = $("#brushSizeInput");
const canvasStage = $(".canvas-stage");
const canvasDocument = $("#canvasDocument");
const moveTool = $("#moveTool");
const handTool = $("#handTool");
const cutTool = $("#cutTool");
const layerList = $("#layerList");
const triptychFlyout = $("#triptychFlyout");
const triptychPositionInput = $("#triptychPositionInput");
const triptychCountInput = $("#triptychCountInput");
const triptychSizeInput = $("#triptychSizeInput");

const state = {
  layers:[], selectedLayerId:null, nextLayerId:1, background:"#000000", tool:"move",
  filter:"none", brightness:100, contrast:100, halftone:false, dotSize:6, brushSize:60, triptychPosition:50, triptychCount:3, triptychSize:100,
  viewZoom:1, viewX:0, viewY:0, viewDragging:false, layerDragging:false, cutting:false
};

function boundedSize(value) { return Math.min(4096,Math.max(320,Math.round(Number(value)||320))); }
function selectedLayer() { return state.layers.find((layer)=>layer.id===state.selectedLayerId)||null; }

function createProject() {
  canvas.width=boundedSize(widthInput.value); canvas.height=boundedSize(heightInput.value);
  state.background=backgroundInput.value; state.layers=[]; state.selectedLayerId=null;
  $("#documentName").textContent=projectName.value.trim()||"Untitled";
  resolutionLabel.textContent=`${canvas.width} × ${canvas.height} px`;
  newProjectView.hidden=true; editorView.hidden=false; resetWorkspaceView(); renderLayers(); draw();
}

function showNewProject() { editorView.hidden=true; newProjectView.hidden=false; }
function layerScale(layer) { return layer.baseScale*layer.zoom; }

function centerSelectedLayer() {
  const layer=selectedLayer(); if(!layer)return;
  layer.x=0; layer.y=0; layer.zoom=1; calculateBaseScale(layer); syncLayerControls(); draw();
}

function calculateBaseScale(layer) {
  const rotated=layer.rotation%180!==0;
  const width=rotated?layer.surface.height:layer.surface.width;
  const height=rotated?layer.surface.width:layer.surface.height;
  layer.baseScale=layer.isBackground?Math.max(canvas.width/width,canvas.height/height):Math.min(canvas.width/width,canvas.height/height)*.68;
}

function drawBackground() {
  context.clearRect(0,0,canvas.width,canvas.height);
  if(state.background!=="transparent"){context.fillStyle=state.background;context.fillRect(0,0,canvas.width,canvas.height);}
}

function buildCanvasFilter() {
  const filters=[`brightness(${state.brightness}%)`,`contrast(${state.contrast}%)`];
  if(state.filter==="bw"||state.filter==="archive")filters.push("grayscale(1)");
  if(state.filter==="invert")filters.push("invert(1)");
  if(state.filter==="warm")filters.push("sepia(.62)","saturate(1.25)");
  return filters.join(" ");
}

function draw() {
  drawBackground();
  state.layers.forEach((layer)=>{
    if(!layer.visible)return;
    const scale=layerScale(layer);
    context.save(); context.translate(canvas.width/2+layer.x,canvas.height/2+layer.y); context.rotate(layer.rotation*Math.PI/180);
    context.filter=buildCanvasFilter(); context.imageSmoothingEnabled=true; context.imageSmoothingQuality="high";
    context.drawImage(layer.surface,-layer.surface.width*scale/2,-layer.surface.height*scale/2,layer.surface.width*scale,layer.surface.height*scale); context.restore();
  });
  if(state.filter==="triptych"&&state.layers.length)drawTriptych();
  if(state.halftone&&state.layers.length)drawHalftone();
}

function drawTriptych() {
  const layer=selectedLayer()||[...state.layers].reverse().find((item)=>item.visible);
  if(!layer)return;
  const bandHeight=canvas.height/state.triptychCount;
  const targetRatio=canvas.width/bandHeight;
  const sourceRatio=layer.surface.width/layer.surface.height;
  let sourceX=0,sourceY=0,sourceWidth=layer.surface.width,sourceHeight=layer.surface.height;
  if(sourceRatio>targetRatio){sourceWidth=sourceHeight*targetRatio;sourceX=(layer.surface.width-sourceWidth)/2;}
  else{sourceHeight=sourceWidth/targetRatio;sourceY=(layer.surface.height-sourceHeight)*(state.triptychPosition/100);}
  const cropScale=100/state.triptychSize;
  const originalSourceWidth=sourceWidth,originalSourceHeight=sourceHeight;
  sourceWidth*=cropScale;sourceHeight*=cropScale;
  sourceX+=(originalSourceWidth-sourceWidth)/2;
  const availableY=layer.surface.height-sourceHeight;
  sourceY=Math.max(0,availableY*(state.triptychPosition/100));
  drawBackground();
  context.save();context.filter=buildCanvasFilter();
  for(let index=0;index<state.triptychCount;index++){
    context.drawImage(layer.surface,sourceX,sourceY,sourceWidth,sourceHeight,0,index*bandHeight,canvas.width,bandHeight);
    if(index>0){context.fillStyle="rgba(255,255,255,.18)";context.fillRect(0,index*bandHeight,canvas.width,Math.max(1,canvas.height/900));}
  }
  context.restore();
}

function drawHalftone() {
  const size=state.dotSize; const tile=document.createElement("canvas"); tile.width=size;tile.height=size;
  const tileContext=tile.getContext("2d");tileContext.fillStyle="rgba(0,0,0,.72)";tileContext.beginPath();tileContext.arc(size/2,size/2,Math.max(.65,size*.23),0,Math.PI*2);tileContext.fill();
  context.save();context.globalCompositeOperation="multiply";context.fillStyle=context.createPattern(tile,"repeat");context.fillRect(0,0,canvas.width,canvas.height);context.restore();
}

function loadFiles(files) {
  [...files].filter((file)=>file.type.startsWith("image/")).forEach((file)=>{
    const url=URL.createObjectURL(file);const image=new Image();
    image.onload=()=>{URL.revokeObjectURL(url);addImageLayer(image,file.name);};image.src=url;
  });
}

function addImageLayer(image,name) {
  const surface=document.createElement("canvas");surface.width=image.naturalWidth;surface.height=image.naturalHeight;surface.getContext("2d").drawImage(image,0,0);
  const layer={id:state.nextLayerId++,name,surface,x:0,y:0,zoom:1,baseScale:1,rotation:0,visible:true,isBackground:state.layers.length===0};
  calculateBaseScale(layer);state.layers.push(layer);state.selectedLayerId=layer.id;
  emptyState.hidden=true;dropZone.classList.remove("empty");jpegButton.disabled=false;pngButton.disabled=false;renderLayers();syncLayerControls();draw();
}

function renderLayers() {
  layerList.replaceChildren();
  [...state.layers].reverse().forEach((layer)=>{
    const button=document.createElement("button");button.type="button";button.className=`layer${layer.id===state.selectedLayerId?" active":""}${layer.visible?"":" muted"}`;
    const thumb=document.createElement("i");try{thumb.style.backgroundImage=`url("${layer.surface.toDataURL("image/png")}")`;}catch{}
    const name=document.createElement("span");name.textContent=layer.name;const visible=document.createElement("b");visible.textContent=layer.visible?"◉":"○";
    button.append(thumb,name,visible);button.addEventListener("click",()=>{state.selectedLayerId=layer.id;renderLayers();syncLayerControls();});
    visible.addEventListener("click",(event)=>{event.stopPropagation();layer.visible=!layer.visible;renderLayers();draw();});layerList.append(button);
  });
  $("#deleteLayerButton").disabled=!selectedLayer();
  emptyState.hidden=state.layers.length>0;dropZone.classList.toggle("empty",state.layers.length===0);
  jpegButton.disabled=state.layers.length===0;pngButton.disabled=state.layers.length===0;
}

function syncLayerControls(){const layer=selectedLayer();zoomInput.value=layer?Math.round(layer.zoom*100):100;zoomValue.value=`${zoomInput.value}%`;}

function canvasPoint(event){const rect=canvas.getBoundingClientRect();return{x:(event.clientX-rect.left)*canvas.width/rect.width,y:(event.clientY-rect.top)*canvas.height/rect.height};}
function pointInLayer(layer,point){const dx=point.x-canvas.width/2-layer.x,dy=point.y-canvas.height/2-layer.y,angle=-layer.rotation*Math.PI/180,scale=layerScale(layer);return{x:(dx*Math.cos(angle)-dy*Math.sin(angle))/scale+layer.surface.width/2,y:(dx*Math.sin(angle)+dy*Math.cos(angle))/scale+layer.surface.height/2};}

function hitTestLayer(point){
  for(let index=state.layers.length-1;index>=0;index--){const layer=state.layers[index];if(!layer.visible)continue;const local=pointInLayer(layer,point);if(local.x<0||local.y<0||local.x>=layer.surface.width||local.y>=layer.surface.height)continue;try{if(layer.surface.getContext("2d").getImageData(Math.floor(local.x),Math.floor(local.y),1,1).data[3]>8)return layer;}catch{return layer;}}
  return null;
}

function cutAt(event){
  const layer=selectedLayer();if(!layer)return;const local=pointInLayer(layer,canvasPoint(event));const layerContext=layer.surface.getContext("2d");
  layerContext.save();layerContext.globalCompositeOperation="destination-out";layerContext.beginPath();layerContext.arc(local.x,local.y,state.brushSize/layerScale(layer)/2,0,Math.PI*2);layerContext.fill();layerContext.restore();draw();
}

function updateFilterControls(){filterSelect.value=state.filter;brightnessInput.value=state.brightness;contrastInput.value=state.contrast;dotSizeInput.value=state.dotSize;halftoneInput.checked=state.halftone;$("#brightnessValue").value=`${state.brightness}%`;$("#contrastValue").value=`${state.contrast}%`;$("#dotSizeValue").value=`${state.dotSize}px`;$(".dot-control").classList.toggle("disabled",!state.halftone);triptychFlyout.hidden=state.filter!=="triptych";document.querySelectorAll("[data-filter]").forEach((button)=>button.classList.toggle("active",button.dataset.filter===state.filter));}
function applyFilterPreset(name){state.filter=name;if(name==="archive"){state.brightness=68;state.contrast=215;state.halftone=true;}else if(name==="bw"){state.brightness=100;state.contrast=115;state.halftone=false;}else if(name==="warm"){state.brightness=104;state.contrast=92;state.halftone=false;}else{state.brightness=100;state.contrast=100;state.halftone=false;}updateFilterControls();draw();}

function updateWorkspaceView(){canvasDocument.style.setProperty("--view-zoom",state.viewZoom);canvasDocument.style.setProperty("--view-x",`${state.viewX}px`);canvasDocument.style.setProperty("--view-y",`${state.viewY}px`);zoomStatus.textContent=`${Math.round(state.viewZoom*100)}%`;}
function resetWorkspaceView(){state.viewZoom=1;state.viewX=0;state.viewY=0;updateWorkspaceView();}
function selectTool(tool){state.tool=tool;moveTool.classList.toggle("active",tool==="move");handTool.classList.toggle("active",tool==="hand");cutTool.classList.toggle("active",tool==="cut");dropZone.classList.toggle("hand",tool==="hand");dropZone.classList.toggle("cut",tool==="cut");}

function download(type){if(!state.layers.length)return;const extension=type==="image/png"?"png":"jpg";const safeName=(projectName.value||"sogz-image").trim().replace(/[^a-z0-9_-]+/gi,"-");canvas.toBlob((blob)=>{if(!blob)return;const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`${safeName}.${extension}`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);},type,.94);}

document.querySelectorAll(".category-tabs [data-category]").forEach((button)=>button.addEventListener("click",()=>{document.querySelectorAll(".category-tabs button").forEach((item)=>item.classList.remove("active"));button.classList.add("active");document.querySelectorAll(".preset-card").forEach((card)=>card.classList.toggle("hidden",card.dataset.category!==button.dataset.category));}));
document.querySelectorAll(".preset-card").forEach((card)=>card.addEventListener("click",()=>{document.querySelectorAll(".preset-card").forEach((item)=>item.classList.remove("selected"));card.classList.add("selected");if(card.dataset.preset==="current"){const ratio=innerWidth/innerHeight;widthInput.value=ratio>=1?1920:Math.round(1920*ratio);heightInput.value=ratio>=1?Math.round(1920/ratio):1920;}else{const[width,height]=card.dataset.size.split("x").map(Number);widthInput.value=width;heightInput.value=height;}}));
$("#swapButton").addEventListener("click",()=>{const width=widthInput.value;widthInput.value=heightInput.value;heightInput.value=width;});
$("#createButton").addEventListener("click",createProject);$("#newButton").addEventListener("click",showNewProject);$("#screenButton").addEventListener("click",()=>{showNewProject();$("[data-category='screen']").click();});

function openPicker(){input.value="";input.click();}
["#openButton","#toolbarOpen","#replaceButton","#addLayerButton"].forEach((selector)=>$(selector).addEventListener("click",openPicker));
input.addEventListener("change",()=>loadFiles(input.files));
["#centerMenuButton","#toolbarCenter","#centerButton"].forEach((selector)=>$(selector).addEventListener("click",centerSelectedLayer));
$("#toolbarRotate").addEventListener("click",()=>{const layer=selectedLayer();if(!layer)return;layer.rotation=(layer.rotation+90)%360;calculateBaseScale(layer);centerSelectedLayer();});
$("#deleteLayerButton").addEventListener("click",()=>{const index=state.layers.findIndex((layer)=>layer.id===state.selectedLayerId);if(index<0)return;state.layers.splice(index,1);state.selectedLayerId=state.layers.at(-1)?.id||null;renderLayers();syncLayerControls();draw();});
moveTool.addEventListener("click",()=>selectTool("move"));handTool.addEventListener("click",()=>selectTool("hand"));cutTool.addEventListener("click",()=>selectTool("cut"));

document.querySelectorAll("[data-filter]").forEach((button)=>button.addEventListener("click",()=>applyFilterPreset(button.dataset.filter)));
filterSelect.addEventListener("change",()=>applyFilterPreset(filterSelect.value));
brightnessInput.addEventListener("input",()=>{state.brightness=Number(brightnessInput.value);updateFilterControls();draw();});
contrastInput.addEventListener("input",()=>{state.contrast=Number(contrastInput.value);updateFilterControls();draw();});
dotSizeInput.addEventListener("input",()=>{state.dotSize=Number(dotSizeInput.value);updateFilterControls();draw();});
halftoneInput.addEventListener("change",()=>{state.halftone=halftoneInput.checked;updateFilterControls();draw();});
brushSizeInput.addEventListener("input",()=>{state.brushSize=Number(brushSizeInput.value);$("#brushSizeValue").value=`${state.brushSize}px`;});
triptychPositionInput.addEventListener("input",()=>{state.triptychPosition=Number(triptychPositionInput.value);$("#triptychPositionValue").value=`${state.triptychPosition}%`;draw();});
triptychCountInput.addEventListener("input",()=>{state.triptychCount=Number(triptychCountInput.value);$("#triptychCountValue").value=String(state.triptychCount);draw();});
triptychSizeInput.addEventListener("input",()=>{state.triptychSize=Number(triptychSizeInput.value);$("#triptychSizeValue").value=`${state.triptychSize}%`;draw();});
zoomInput.addEventListener("input",()=>{const layer=selectedLayer();if(!layer)return;layer.zoom=Number(zoomInput.value)/100;zoomValue.value=`${zoomInput.value}%`;draw();});
jpegButton.addEventListener("click",()=>download("image/jpeg"));pngButton.addEventListener("click",()=>download("image/png"));

canvas.addEventListener("pointerdown",(event)=>{
  if(event.button!==0||!state.layers.length)return;const point=canvasPoint(event);
  if(state.tool==="cut"){state.cutting=true;canvas.setPointerCapture(event.pointerId);cutAt(event);return;}
  if(state.tool!=="move")return;const hit=hitTestLayer(point);if(hit){state.selectedLayerId=hit.id;renderLayers();syncLayerControls();}
  const layer=selectedLayer();if(!layer)return;state.layerDragging=true;state.startX=event.clientX;state.startY=event.clientY;state.startLayerX=layer.x;state.startLayerY=layer.y;canvas.setPointerCapture(event.pointerId);canvas.classList.add("dragging");
});
canvas.addEventListener("pointermove",(event)=>{if(state.cutting){cutAt(event);return;}if(!state.layerDragging)return;const layer=selectedLayer();if(!layer)return;const rect=canvas.getBoundingClientRect();layer.x=state.startLayerX+(event.clientX-state.startX)*canvas.width/rect.width;layer.y=state.startLayerY+(event.clientY-state.startY)*canvas.height/rect.height;draw();});
function stopCanvasAction(event){state.layerDragging=false;state.cutting=false;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);canvas.classList.remove("dragging");if(state.layers.length)renderLayers();}
canvas.addEventListener("pointerup",stopCanvasAction);canvas.addEventListener("pointercancel",stopCanvasAction);

canvasStage.addEventListener("wheel",(event)=>{event.preventDefault();state.viewZoom=Math.min(4,Math.max(.25,state.viewZoom*(event.deltaY<0?1.12:.89)));updateWorkspaceView();},{passive:false});
canvasStage.addEventListener("pointerdown",(event)=>{const wantsPan=state.tool==="hand"||event.button===1||event.target===canvasStage;if(!state.layers.length||!wantsPan)return;state.viewDragging=true;state.viewStartX=event.clientX;state.viewStartY=event.clientY;state.viewStartPanX=state.viewX;state.viewStartPanY=state.viewY;canvasStage.setPointerCapture(event.pointerId);dropZone.classList.add("panning");});
canvasStage.addEventListener("pointermove",(event)=>{if(!state.viewDragging)return;state.viewX=state.viewStartPanX+event.clientX-state.viewStartX;state.viewY=state.viewStartPanY+event.clientY-state.viewStartY;updateWorkspaceView();});
function stopWorkspacePan(event){if(!state.viewDragging)return;state.viewDragging=false;if(canvasStage.hasPointerCapture(event.pointerId))canvasStage.releasePointerCapture(event.pointerId);dropZone.classList.remove("panning");}
canvasStage.addEventListener("pointerup",stopWorkspacePan);canvasStage.addEventListener("pointercancel",stopWorkspacePan);

["dragenter","dragover","dragleave","drop"].forEach((name)=>dropZone.addEventListener(name,(event)=>event.preventDefault()));
dropZone.addEventListener("drop",(event)=>loadFiles(event.dataTransfer.files));
dropZone.addEventListener("click",()=>{if(!state.layers.length)openPicker();});
dropZone.classList.add("empty");updateFilterControls();updateWorkspaceView();renderLayers();draw();
