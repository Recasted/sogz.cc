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
const duoFlyout = $("#duoFlyout");
const duoCountInput = $("#duoCountInput");
const duoSizeInput = $("#duoSizeInput");
const duoXInput = $("#duoXInput");
const duoYInput = $("#duoYInput");
const duoMirrorInput = $("#duoMirrorInput");
const colorFlyout = $("#colorFlyout");
const colorPanelButton = $("#colorPanelButton");
const tintColorInput = $("#tintColorInput");
const tintHexInput = $("#tintHexInput");
const exposureInput = $("#exposureInput");
const saturationInput = $("#saturationInput");
const hueInput = $("#hueInput");
const sepiaInput = $("#sepiaInput");
const blurInput = $("#blurInput");
const tintInput = $("#tintInput");
const hueFlyoutInput = $("#hueFlyoutInput");
const tintFlyoutInput = $("#tintFlyoutInput");

$("#supportClose").addEventListener("click",()=>{$("#supportPopup").hidden=true;});
document.querySelectorAll("[data-close-flyout]").forEach((button)=>button.addEventListener("click",()=>{button.closest(".triptych-flyout, .tool-flyout").hidden=true;colorPanelButton?.classList.remove("active");}));
document.addEventListener("keydown",(event)=>{if(event.key!=="Escape")return;document.querySelectorAll(".triptych-flyout, .tool-flyout").forEach((flyout)=>flyout.hidden=true);colorPanelButton?.classList.remove("active");});

const state = {
  layers:[], selectedLayerId:null, nextLayerId:1, background:"#000000", tool:"move",
  filter:"none", brightness:100, contrast:100, exposure:0, saturation:100, hue:0, sepia:0, blur:0,
  tintColor:"#ff4f92", tintStrength:0, halftone:false, dotSize:6, brushSize:60,
  triptychPosition:50, triptychCount:3, triptychSize:100,
  duoCount:2, duoSize:100, duoX:50, duoY:50, duoMirror:false,
  viewZoom:1, viewX:0, viewY:0, viewDragging:false, layerDragging:false, cutting:false
};
const undoStack=[];
const redoStack=[];
const historyLimit=16;
const historyKeys=["selectedLayerId","nextLayerId","background","filter","brightness","contrast","exposure","saturation","hue","sepia","blur","tintColor","tintStrength","halftone","dotSize","brushSize","triptychPosition","triptychCount","triptychSize","duoCount","duoSize","duoX","duoY","duoMirror"];

function copySurface(source){const surface=document.createElement("canvas");surface.width=source.width;surface.height=source.height;surface.getContext("2d").drawImage(source,0,0);return surface;}
function captureHistoryState(){const snapshot={canvasWidth:canvas.width,canvasHeight:canvas.height};historyKeys.forEach((key)=>snapshot[key]=state[key]);snapshot.layers=state.layers.map((layer)=>({...layer,surface:copySurface(layer.surface)}));return snapshot;}
function updateHistoryButtons(){$("#undoButton").disabled=undoStack.length===0;$("#redoButton").disabled=redoStack.length===0;}
function checkpoint(){undoStack.push(captureHistoryState());if(undoStack.length>historyLimit)undoStack.shift();redoStack.length=0;updateHistoryButtons();}
function restoreHistoryState(snapshot){canvas.width=snapshot.canvasWidth;canvas.height=snapshot.canvasHeight;historyKeys.forEach((key)=>state[key]=snapshot[key]);state.layers=snapshot.layers.map((layer)=>({...layer,surface:copySurface(layer.surface)}));state.layerDragging=false;state.cutting=false;resolutionLabel.textContent=`${canvas.width} × ${canvas.height} px`;renderLayers();syncLayerControls();updateFilterControls();draw();}
function undo(){if(!undoStack.length)return;redoStack.push(captureHistoryState());restoreHistoryState(undoStack.pop());updateHistoryButtons();}
function redo(){if(!redoStack.length)return;undoStack.push(captureHistoryState());restoreHistoryState(redoStack.pop());updateHistoryButtons();}

function boundedSize(value) { return Math.min(4096,Math.max(320,Math.round(Number(value)||320))); }
function selectedLayer() { return state.layers.find((layer)=>layer.id===state.selectedLayerId)||null; }

function createProject() {
  canvas.width=boundedSize(widthInput.value); canvas.height=boundedSize(heightInput.value);
  state.background=backgroundInput.value; state.layers=[]; state.selectedLayerId=null;
  undoStack.length=0;redoStack.length=0;updateHistoryButtons();
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
  const exposureBrightness=Math.max(10,Math.min(500,state.brightness*Math.pow(2,state.exposure)));
  const filters=[`brightness(${exposureBrightness}%)`,`contrast(${state.contrast}%)`,`saturate(${state.saturation}%)`,`hue-rotate(${state.hue}deg)`,`sepia(${state.sepia}%)`,`blur(${state.blur}px)`];
  if(state.filter==="bw"||state.filter==="archive")filters.push("grayscale(1)");
  if(state.filter==="invert")filters.push("invert(1)");
  if(state.filter==="warm")filters.push("sepia(.62)","saturate(1.25)");
  if(state.filter==="cool")filters.push("sepia(.18)","saturate(1.18)","hue-rotate(168deg)");
  if(state.filter==="soft")filters.push("brightness(1.07)","contrast(.9)","saturate(1.08)","blur(.45px)");
  if(state.filter==="vintage")filters.push("sepia(.38)","saturate(.78)","contrast(1.08)");
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
  if(state.filter==="duo"&&state.layers.length)drawDuo();
  applyColorTint();
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

function coverCrop(surface,targetRatio,positionX,positionY,sizePercent) {
  const sourceRatio=surface.width/surface.height;
  let sourceWidth=surface.width,sourceHeight=surface.height;
  if(sourceRatio>targetRatio)sourceWidth=sourceHeight*targetRatio;
  else sourceHeight=sourceWidth/targetRatio;
  const cropScale=100/sizePercent;
  sourceWidth*=cropScale;sourceHeight*=cropScale;
  const sourceX=Math.max(0,(surface.width-sourceWidth)*(positionX/100));
  const sourceY=Math.max(0,(surface.height-sourceHeight)*(positionY/100));
  return {sourceX,sourceY,sourceWidth,sourceHeight};
}

function drawDuo() {
  const layer=selectedLayer()||[...state.layers].reverse().find((item)=>item.visible);
  if(!layer)return;
  const panelWidth=canvas.width/state.duoCount;
  const crop=coverCrop(layer.surface,panelWidth/canvas.height,state.duoX,state.duoY,state.duoSize);
  drawBackground();
  context.save();context.filter=buildCanvasFilter();
  for(let index=0;index<state.duoCount;index++){
    context.save();
    if(state.duoMirror&&index%2===1){context.translate((index+1)*panelWidth,0);context.scale(-1,1);context.drawImage(layer.surface,crop.sourceX,crop.sourceY,crop.sourceWidth,crop.sourceHeight,0,0,panelWidth,canvas.height);}
    else context.drawImage(layer.surface,crop.sourceX,crop.sourceY,crop.sourceWidth,crop.sourceHeight,index*panelWidth,0,panelWidth,canvas.height);
    context.restore();
    if(index>0){context.fillStyle="rgba(255,255,255,.16)";context.fillRect(index*panelWidth,0,Math.max(1,canvas.width/900),canvas.height);}
  }
  context.restore();
}

function applyColorTint() {
  if(state.tintStrength<=0)return;
  context.save();context.globalCompositeOperation="source-atop";context.globalAlpha=state.tintStrength/100;context.fillStyle=state.tintColor;context.fillRect(0,0,canvas.width,canvas.height);context.restore();
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
  checkpoint();
  const surface=document.createElement("canvas");surface.width=image.naturalWidth;surface.height=image.naturalHeight;surface.getContext("2d").drawImage(image,0,0);
  const layer={id:state.nextLayerId++,name,surface,x:0,y:0,zoom:1,baseScale:1,rotation:0,visible:true,isBackground:state.layers.length===0};
  calculateBaseScale(layer);state.layers.push(layer);state.selectedLayerId=layer.id;
  emptyState.hidden=true;dropZone.classList.remove("empty");jpegButton.disabled=false;pngButton.disabled=false;renderLayers();syncLayerControls();draw();
}

function renderLayers() {
  layerList.replaceChildren();
  [...state.layers].reverse().forEach((layer)=>{
    const button=document.createElement("button");button.type="button";button.className=`layer${layer.id===state.selectedLayerId?" active":""}${layer.visible?"":" muted"}`;
    button.draggable=true;button.dataset.layerId=String(layer.id);
    const thumb=document.createElement("i");try{thumb.style.backgroundImage=`url("${layer.surface.toDataURL("image/png")}")`;}catch{}
    const name=document.createElement("span");name.textContent=layer.name;const visible=document.createElement("b");visible.textContent=layer.visible?"◉":"○";
    button.append(thumb,name,visible);button.addEventListener("click",()=>{state.selectedLayerId=layer.id;renderLayers();syncLayerControls();});
    button.addEventListener("dragstart",(event)=>{event.dataTransfer.effectAllowed="move";event.dataTransfer.setData("text/plain",String(layer.id));button.classList.add("dragging");});
    button.addEventListener("dragend",()=>{document.querySelectorAll(".layer").forEach((item)=>item.classList.remove("dragging","drag-over"));});
    button.addEventListener("dragover",(event)=>{event.preventDefault();event.dataTransfer.dropEffect="move";button.classList.add("drag-over");});
    button.addEventListener("dragleave",()=>button.classList.remove("drag-over"));
    button.addEventListener("drop",(event)=>{event.preventDefault();const sourceId=Number(event.dataTransfer.getData("text/plain"));if(!sourceId||sourceId===layer.id)return;checkpoint();const visual=[...state.layers].reverse();const sourceIndex=visual.findIndex((item)=>item.id===sourceId);const [moved]=visual.splice(sourceIndex,1);const targetIndex=visual.findIndex((item)=>item.id===layer.id);const after=event.clientY>button.getBoundingClientRect().top+button.offsetHeight/2;visual.splice(targetIndex+(after?1:0),0,moved);state.layers=visual.reverse();state.selectedLayerId=sourceId;renderLayers();syncLayerControls();draw();});
    visible.addEventListener("click",(event)=>{event.stopPropagation();checkpoint();layer.visible=!layer.visible;renderLayers();draw();});layerList.append(button);
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

function updateFilterControls(){
  filterSelect.value=state.filter;brightnessInput.value=state.brightness;contrastInput.value=state.contrast;
  exposureInput.value=Math.round(state.exposure*10);saturationInput.value=state.saturation;hueInput.value=state.hue;sepiaInput.value=state.sepia;blurInput.value=state.blur;tintInput.value=state.tintStrength;
  hueFlyoutInput.value=state.hue;tintFlyoutInput.value=state.tintStrength;tintColorInput.value=state.tintColor;tintHexInput.value=state.tintColor.toUpperCase();
  dotSizeInput.value=state.dotSize;halftoneInput.checked=state.halftone;
  $("#brightnessValue").value=`${state.brightness}%`;$("#contrastValue").value=`${state.contrast}%`;$("#exposureValue").value=state.exposure.toFixed(1);
  $("#saturationValue").value=`${state.saturation}%`;$("#hueValue").value=`${state.hue}°`;$("#hueFlyoutValue").value=`${state.hue}°`;$("#sepiaValue").value=`${state.sepia}%`;$("#blurValue").value=`${state.blur}px`;
  $("#tintValue").value=`${state.tintStrength}%`;$("#tintFlyoutValue").value=`${state.tintStrength}%`;$("#dotSizeValue").value=`${state.dotSize}px`;
  duoCountInput.value=state.duoCount;duoSizeInput.value=state.duoSize;duoXInput.value=state.duoX;duoYInput.value=state.duoY;duoMirrorInput.checked=state.duoMirror;
  $("#duoCountValue").value=String(state.duoCount);$("#duoSizeValue").value=`${state.duoSize}%`;$("#duoXValue").value=`${state.duoX}%`;$("#duoYValue").value=`${state.duoY}%`;
  $(".dot-control").classList.toggle("disabled",!state.halftone);triptychFlyout.hidden=state.filter!=="triptych";duoFlyout.hidden=state.filter!=="duo";
  document.querySelectorAll("[data-filter]").forEach((button)=>button.classList.toggle("active",button.dataset.filter===state.filter));
}

function resetColorAdjustments(){state.brightness=100;state.contrast=100;state.exposure=0;state.saturation=100;state.hue=0;state.sepia=0;state.blur=0;state.tintStrength=0;}
function applyFilterPreset(name){
  state.filter=name;resetColorAdjustments();state.halftone=false;
  if(name==="archive"){state.brightness=68;state.contrast=215;state.halftone=true;}
  else if(name==="bw"){state.contrast=115;}
  else if(name==="warm"){state.brightness=104;state.contrast=92;state.saturation=112;state.sepia=10;}
  else if(name==="cool"){state.contrast=104;state.saturation=112;}
  else if(name==="soft"){state.brightness=103;state.contrast=94;state.saturation=106;}
  else if(name==="vintage"){state.brightness=98;state.contrast=108;state.saturation=82;state.sepia=18;}
  updateFilterControls();draw();
}

function updateWorkspaceView(){canvasDocument.style.setProperty("--view-zoom",state.viewZoom);canvasDocument.style.setProperty("--view-x",`${state.viewX}px`);canvasDocument.style.setProperty("--view-y",`${state.viewY}px`);zoomStatus.textContent=`${Math.round(state.viewZoom*100)}%`;}
function resetWorkspaceView(){state.viewZoom=1;state.viewX=0;state.viewY=0;updateWorkspaceView();}
function selectTool(tool){state.tool=tool;moveTool.classList.toggle("active",tool==="move");handTool.classList.toggle("active",tool==="hand");cutTool.classList.toggle("active",tool==="cut");dropZone.classList.toggle("hand",tool==="hand");dropZone.classList.toggle("cut",tool==="cut");}
function showColorFlyout(show){colorFlyout.hidden=!show;colorPanelButton.classList.toggle("active",show);}

function download(type){if(!state.layers.length)return;const extension=type==="image/png"?"png":"jpg";const safeName=(projectName.value||"sogz-image").trim().replace(/[^a-z0-9_-]+/gi,"-");canvas.toBlob((blob)=>{if(!blob)return;const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`${safeName}.${extension}`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);},type,.94);}

document.querySelectorAll(".category-tabs [data-category]").forEach((button)=>button.addEventListener("click",()=>{document.querySelectorAll(".category-tabs button").forEach((item)=>item.classList.remove("active"));button.classList.add("active");document.querySelectorAll(".preset-card").forEach((card)=>card.classList.toggle("hidden",card.dataset.category!==button.dataset.category));}));
document.querySelectorAll(".preset-card").forEach((card)=>card.addEventListener("click",()=>{document.querySelectorAll(".preset-card").forEach((item)=>item.classList.remove("selected"));card.classList.add("selected");if(card.dataset.preset==="current"){const ratio=innerWidth/innerHeight;widthInput.value=ratio>=1?1920:Math.round(1920*ratio);heightInput.value=ratio>=1?Math.round(1920/ratio):1920;}else{const[width,height]=card.dataset.size.split("x").map(Number);widthInput.value=width;heightInput.value=height;}}));
$("#swapButton").addEventListener("click",()=>{const width=widthInput.value;widthInput.value=heightInput.value;heightInput.value=width;});
$("#createButton").addEventListener("click",createProject);$("#newButton").addEventListener("click",showNewProject);$("#screenButton").addEventListener("click",()=>{showNewProject();$("[data-category='screen']").click();});

function openPicker(){input.value="";input.click();}
["#openButton","#toolbarOpen","#replaceButton","#addLayerButton"].forEach((selector)=>$(selector).addEventListener("click",openPicker));
input.addEventListener("change",()=>loadFiles(input.files));
["#centerMenuButton","#toolbarCenter","#centerButton"].forEach((selector)=>$(selector).addEventListener("click",()=>{if(!selectedLayer())return;checkpoint();centerSelectedLayer();}));
$("#toolbarRotate").addEventListener("click",()=>{const layer=selectedLayer();if(!layer)return;checkpoint();layer.rotation=(layer.rotation+90)%360;calculateBaseScale(layer);centerSelectedLayer();});
$("#toolbarFlip").addEventListener("click",()=>{const layer=selectedLayer();if(!layer)return;checkpoint();const flipped=document.createElement("canvas");flipped.width=layer.surface.width;flipped.height=layer.surface.height;const flippedContext=flipped.getContext("2d");flippedContext.translate(flipped.width,0);flippedContext.scale(-1,1);flippedContext.drawImage(layer.surface,0,0);layer.surface=flipped;renderLayers();draw();});
$("#toolbarDuplicate").addEventListener("click",()=>{const source=selectedLayer();if(!source)return;checkpoint();const surface=document.createElement("canvas");surface.width=source.surface.width;surface.height=source.surface.height;surface.getContext("2d").drawImage(source.surface,0,0);const copy={...source,id:state.nextLayerId++,name:`${source.name} copy`,surface,isBackground:false,x:source.x+20,y:source.y+20};state.layers.push(copy);state.selectedLayerId=copy.id;renderLayers();syncLayerControls();draw();});
$("#deleteLayerButton").addEventListener("click",()=>{const index=state.layers.findIndex((layer)=>layer.id===state.selectedLayerId);if(index<0)return;checkpoint();state.layers.splice(index,1);state.selectedLayerId=state.layers.at(-1)?.id||null;renderLayers();syncLayerControls();draw();});
moveTool.addEventListener("click",()=>selectTool("move"));handTool.addEventListener("click",()=>selectTool("hand"));cutTool.addEventListener("click",()=>selectTool("cut"));

document.querySelectorAll("[data-filter]").forEach((button)=>button.addEventListener("click",()=>{checkpoint();applyFilterPreset(button.dataset.filter);}));
filterSelect.addEventListener("change",()=>applyFilterPreset(filterSelect.value));
brightnessInput.addEventListener("input",()=>{state.brightness=Number(brightnessInput.value);updateFilterControls();draw();});
contrastInput.addEventListener("input",()=>{state.contrast=Number(contrastInput.value);updateFilterControls();draw();});
exposureInput.addEventListener("input",()=>{state.exposure=Number(exposureInput.value)/10;updateFilterControls();draw();});
saturationInput.addEventListener("input",()=>{state.saturation=Number(saturationInput.value);updateFilterControls();draw();});
hueInput.addEventListener("input",()=>{state.hue=Number(hueInput.value);updateFilterControls();draw();});
sepiaInput.addEventListener("input",()=>{state.sepia=Number(sepiaInput.value);updateFilterControls();draw();});
blurInput.addEventListener("input",()=>{state.blur=Number(blurInput.value);updateFilterControls();draw();});
tintInput.addEventListener("input",()=>{state.tintStrength=Number(tintInput.value);updateFilterControls();draw();});
dotSizeInput.addEventListener("input",()=>{state.dotSize=Number(dotSizeInput.value);updateFilterControls();draw();});
halftoneInput.addEventListener("change",()=>{state.halftone=halftoneInput.checked;updateFilterControls();draw();});
brushSizeInput.addEventListener("input",()=>{state.brushSize=Number(brushSizeInput.value);$("#brushSizeValue").value=`${state.brushSize}px`;});
triptychPositionInput.addEventListener("input",()=>{state.triptychPosition=Number(triptychPositionInput.value);$("#triptychPositionValue").value=`${state.triptychPosition}%`;draw();});
triptychCountInput.addEventListener("input",()=>{state.triptychCount=Number(triptychCountInput.value);$("#triptychCountValue").value=String(state.triptychCount);draw();});
triptychSizeInput.addEventListener("input",()=>{state.triptychSize=Number(triptychSizeInput.value);$("#triptychSizeValue").value=`${state.triptychSize}%`;draw();});
duoCountInput.addEventListener("input",()=>{state.duoCount=Number(duoCountInput.value);updateFilterControls();draw();});
duoSizeInput.addEventListener("input",()=>{state.duoSize=Number(duoSizeInput.value);updateFilterControls();draw();});
duoXInput.addEventListener("input",()=>{state.duoX=Number(duoXInput.value);updateFilterControls();draw();});
duoYInput.addEventListener("input",()=>{state.duoY=Number(duoYInput.value);updateFilterControls();draw();});
duoMirrorInput.addEventListener("change",()=>{state.duoMirror=duoMirrorInput.checked;draw();});
colorPanelButton.addEventListener("click",()=>showColorFlyout(colorFlyout.hidden));
$("#openColorButton").addEventListener("click",()=>showColorFlyout(true));
tintColorInput.addEventListener("input",()=>{state.tintColor=tintColorInput.value.toLowerCase();updateFilterControls();draw();});
tintHexInput.addEventListener("input",()=>{const value=tintHexInput.value.trim();const normalized=/^#[0-9a-f]{6}$/i.test(value)?value:`#${value}`;if(/^#[0-9a-f]{6}$/i.test(normalized)){state.tintColor=normalized.toLowerCase();tintColorInput.value=state.tintColor;draw();}});
tintHexInput.addEventListener("change",()=>updateFilterControls());
hueFlyoutInput.addEventListener("input",()=>{state.hue=Number(hueFlyoutInput.value);updateFilterControls();draw();});
tintFlyoutInput.addEventListener("input",()=>{state.tintStrength=Number(tintFlyoutInput.value);updateFilterControls();draw();});
$("#resetAdjustmentsButton").addEventListener("click",()=>{checkpoint();resetColorAdjustments();updateFilterControls();draw();});
const resetValues={brightness:100,contrast:100,exposure:0,saturation:100,hue:0,sepia:0,blur:0,tintStrength:0,dotSize:6,halftone:false};
document.querySelectorAll("[data-reset]").forEach((button)=>button.addEventListener("click",(event)=>{event.preventDefault();event.stopPropagation();checkpoint();state[button.dataset.reset]=resetValues[button.dataset.reset];updateFilterControls();draw();}));

const historyControls=[filterSelect,zoomInput,brightnessInput,contrastInput,exposureInput,saturationInput,hueInput,sepiaInput,blurInput,tintInput,dotSizeInput,halftoneInput,brushSizeInput,triptychPositionInput,triptychCountInput,triptychSizeInput,duoCountInput,duoSizeInput,duoXInput,duoYInput,duoMirrorInput,tintColorInput,hueFlyoutInput,tintFlyoutInput];
historyControls.forEach((control)=>{control.addEventListener("pointerdown",checkpoint);control.addEventListener("keydown",(event)=>{if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Home","End","PageUp","PageDown"].includes(event.key))checkpoint();});});
tintHexInput.addEventListener("focus",checkpoint);
$("#undoButton").addEventListener("click",undo);$("#redoButton").addEventListener("click",redo);
document.addEventListener("keydown",(event)=>{if(!(event.ctrlKey||event.metaKey))return;const key=event.key.toLowerCase();if(key==="z"){event.preventDefault();if(event.shiftKey)redo();else undo();}else if(key==="y"){event.preventDefault();redo();}});
zoomInput.addEventListener("input",()=>{const layer=selectedLayer();if(!layer)return;layer.zoom=Number(zoomInput.value)/100;zoomValue.value=`${zoomInput.value}%`;draw();});
jpegButton.addEventListener("click",()=>download("image/jpeg"));pngButton.addEventListener("click",()=>download("image/png"));
$("#exportButton").addEventListener("click",()=>download("image/png"));

canvas.addEventListener("pointerdown",(event)=>{
  if(event.button!==0||!state.layers.length)return;const point=canvasPoint(event);
  if(state.tool==="cut"){checkpoint();state.cutting=true;canvas.setPointerCapture(event.pointerId);cutAt(event);return;}
  if(state.tool!=="move")return;const hit=hitTestLayer(point);if(hit){state.selectedLayerId=hit.id;renderLayers();syncLayerControls();}
  const layer=selectedLayer();if(!layer)return;checkpoint();state.layerDragging=true;state.startX=event.clientX;state.startY=event.clientY;state.startLayerX=layer.x;state.startLayerY=layer.y;canvas.setPointerCapture(event.pointerId);canvas.classList.add("dragging");
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
dropZone.classList.add("empty");updateFilterControls();updateWorkspaceView();renderLayers();updateHistoryButtons();draw();
