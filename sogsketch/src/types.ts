export type ToolName = "brush"|"pencil"|"eraser"|"line"|"rectangle"|"ellipse"|"polygon"|"polyline"|"path"|"fill"|"gradient"|"picker"|"move"|"transform"|"crop"|"selectRect"|"selectEllipse"|"text"|"pan"|"zoom";

export interface Point { x:number; y:number; pressure:number }
export interface Selection { x:number; y:number; width:number; height:number; ellipse:boolean }
export interface BrushSettings { size:number; opacity:number; flow:number; hardness:number; spacing:number; smoothing:number; stabilizer:number; eraserMode:boolean; symmetry:boolean }
export interface PaintLayer { id:number; name:string; canvas:HTMLCanvasElement; visible:boolean; locked:boolean; opacity:number; blendMode:GlobalCompositeOperation; alphaInherit:boolean; groupId:number|null; x:number; y:number; scaleX:number; scaleY:number }
export interface Guide { axis:"x"|"y"; position:number }
export interface ViewState { zoom:number; panX:number; panY:number; rotation:number; flipX:number; flipY:number; grid:boolean; rulers:boolean; snap:boolean }
export interface AppState { width:number; height:number; resolution:number; name:string; background:string; layers:PaintLayer[]; selectedLayerId:number|null; nextLayerId:number; tool:ToolName; brush:BrushSettings; foreground:string; backgroundColor:string; recentColors:string[]; selection:Selection|null; guides:Guide[]; view:ViewState; autosave:boolean }
export interface LayerSnapshot { id:number; name:string; image:string; visible:boolean; locked:boolean; opacity:number; blendMode:GlobalCompositeOperation; alphaInherit:boolean; groupId:number|null; x:number; y:number; scaleX:number; scaleY:number }
export interface Snapshot { label:string; width:number; height:number; resolution:number; name:string; background:string; layers:LayerSnapshot[]; selectedLayerId:number|null; nextLayerId:number; foreground:string; backgroundColor:string; selection:Selection|null }
export interface ProjectFile { format:"sogsketch"; version:1; savedAt:string; state:Omit<Snapshot,"label">; brush:BrushSettings; guides:Guide[] }
export interface BrushPreset { id:string; name:string; size:number; opacity:number; flow:number; hardness:number; spacing:number; smoothing:number }
