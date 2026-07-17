export type ToolName = "brush"|"pencil"|"eraser"|"smudge"|"line"|"rectangle"|"ellipse"|"polygon"|"polyline"|"path"|"fill"|"gradient"|"picker"|"move"|"transform"|"crop"|"selectRect"|"selectEllipse"|"text"|"pan"|"zoom";

export interface Point { x:number; y:number; pressure:number }
export interface Selection { x:number; y:number; width:number; height:number; ellipse:boolean }
export type BrushCategory="Core Brushes"|"Ink"|"Pencils"|"Paint"|"Markers"|"Texture"|"Specialty Brushes"|"Custom";
export type BrushTip="round"|"paint"|"flat"|"chisel"|"bristle"|"scatter"|"leaf"|"grass"|"cloud";
export type BrushTexture="none"|"paper"|"grain"|"chalk"|"charcoal"|"canvas"|"wet";
export interface BrushSettings { size:number; opacity:number; flow:number; hardness:number; spacing:number; smoothing:number; stabilizer:number; pressureCurve:number; rotation:number; angle:number; randomSize:number; randomOpacity:number; randomRotation:number; blendStrength:number; tip:BrushTip; texture:BrushTexture; eraserMode:boolean; symmetry:boolean }
export interface PaintLayer { id:number; name:string; canvas:HTMLCanvasElement; visible:boolean; locked:boolean; opacity:number; blendMode:GlobalCompositeOperation; alphaInherit:boolean; groupId:number|null; x:number; y:number; scaleX:number; scaleY:number }
export interface Guide { axis:"x"|"y"; position:number }
export interface ReferenceImage { id:number; name:string; src:string; x:number; y:number; baseWidth:number; baseHeight:number; scale:number; opacity:number; visible:boolean }
export interface ViewState { zoom:number; panX:number; panY:number; rotation:number; flipX:number; flipY:number; grid:boolean; rulers:boolean; snap:boolean }
export interface AppState { width:number; height:number; resolution:number; name:string; background:string; layers:PaintLayer[]; selectedLayerId:number|null; nextLayerId:number; tool:ToolName; brush:BrushSettings; foreground:string; backgroundColor:string; recentColors:string[]; selection:Selection|null; guides:Guide[]; view:ViewState; autosave:boolean }
export interface LayerSnapshot { id:number; name:string; image:string; visible:boolean; locked:boolean; opacity:number; blendMode:GlobalCompositeOperation; alphaInherit:boolean; groupId:number|null; x:number; y:number; scaleX:number; scaleY:number }
export interface Snapshot { label:string; width:number; height:number; resolution:number; name:string; background:string; layers:LayerSnapshot[]; selectedLayerId:number|null; nextLayerId:number; foreground:string; backgroundColor:string; selection:Selection|null }
export interface ProjectFile { format:"sogsketch"; version:1; savedAt:string; state:Omit<Snapshot,"label">; brush:BrushSettings; guides:Guide[]; references?:ReferenceImage[] }
export interface BrushPreset extends Omit<BrushSettings,"eraserMode"|"symmetry"> { id:string; name:string; category:BrushCategory; custom?:boolean; favourite?:boolean }
