import type {BrushCategory,BrushPreset,BrushSettings,BrushTexture,BrushTip} from "./types.js";

const base:Omit<BrushPreset,"id"|"name"|"category">={size:24,opacity:100,flow:100,hardness:90,spacing:10,smoothing:35,stabilizer:4,pressureCurve:50,rotation:0,angle:0,randomSize:0,randomOpacity:0,randomRotation:0,blendStrength:55,tip:"round",texture:"none"};
const p=(category:BrushCategory,id:string,name:string,changes:Partial<typeof base>):BrushPreset=>({id,name,category,...base,...changes});

export const defaultBrushes:BrushPreset[]=[
 p("Core Brushes","hard-round","Hard Round",{size:24,hardness:100,spacing:8,smoothing:28}),
 p("Core Brushes","soft-round","Soft Round",{size:72,opacity:55,flow:35,hardness:0,spacing:3,smoothing:32}),
 p("Core Brushes","airbrush","Airbrush",{size:96,opacity:34,flow:18,hardness:0,spacing:2,smoothing:30}),
 p("Core Brushes","opaque-pressure","Opaque Pressure",{size:32,hardness:100,spacing:4,smoothing:38,pressureCurve:64}),
 p("Core Brushes","tapered-round","Tapered Round",{size:18,hardness:100,spacing:4,smoothing:58,stabilizer:8,pressureCurve:76}),
 p("Core Brushes","soft-glaze","Soft Glaze",{size:110,opacity:22,flow:12,hardness:12,spacing:2,smoothing:42}),

 p("Ink","pressure-ink","Pressure Ink",{size:14,hardness:100,spacing:4,smoothing:52,stabilizer:7,pressureCurve:62}),
 p("Ink","comic-pen","Comic Pen",{size:10,hardness:100,spacing:3,smoothing:64,stabilizer:10,pressureCurve:72}),
 p("Ink","technical-pen","Technical Pen",{size:4,hardness:100,spacing:3,smoothing:46,stabilizer:8,pressureCurve:20}),
 p("Ink","dry-ink","Dry Ink",{size:17,opacity:94,flow:88,hardness:100,spacing:7,smoothing:44,tip:"bristle",texture:"paper",pressureCurve:66}),
 p("Ink","sumi-ink","Sumi Ink",{size:38,opacity:90,flow:72,hardness:78,spacing:5,smoothing:48,tip:"bristle",texture:"wet",pressureCurve:70}),
 p("Ink","calligraphy-45","Calligraphy 45°",{size:30,hardness:100,spacing:3,smoothing:58,stabilizer:9,tip:"flat",angle:45,pressureCurve:40}),

 p("Pencils","pencil","HB Pencil",{size:3,opacity:82,flow:100,hardness:100,spacing:5,smoothing:22,texture:"paper"}),
 p("Pencils","2b-pencil","2B Pencil",{size:6,opacity:78,flow:78,hardness:92,spacing:6,smoothing:25,texture:"grain",pressureCurve:62}),
 p("Pencils","6b-pencil","6B Pencil",{size:11,opacity:72,flow:68,hardness:82,spacing:7,smoothing:24,texture:"charcoal",pressureCurve:68}),
 p("Pencils","mechanical-pencil","Mechanical Pencil",{size:2,opacity:92,hardness:100,spacing:4,smoothing:38,stabilizer:5,texture:"paper",pressureCurve:25}),
 p("Pencils","colored-pencil","Colored Pencil",{size:7,opacity:68,flow:72,hardness:88,spacing:7,smoothing:28,texture:"paper",pressureCurve:58}),

 p("Paint","flat-paint","Flat Paint",{size:54,opacity:100,flow:100,hardness:100,spacing:3,smoothing:46,tip:"paint",pressureCurve:46}),
 p("Paint","wet-paint","Wet Paint",{size:62,opacity:76,flow:58,hardness:72,spacing:4,smoothing:50,tip:"bristle",texture:"wet",pressureCurve:58}),
 p("Paint","gouache","Gouache",{size:48,opacity:94,flow:86,hardness:92,spacing:4,smoothing:42,tip:"paint",texture:"paper",pressureCurve:52}),
 p("Paint","oil-bristle","Oil Bristle",{size:46,opacity:88,flow:62,hardness:84,spacing:5,smoothing:38,tip:"bristle",texture:"canvas",pressureCurve:58}),
 p("Paint","acrylic","Acrylic",{size:42,opacity:98,flow:92,hardness:96,spacing:3,smoothing:40,tip:"paint",texture:"canvas",pressureCurve:48}),
 p("Paint","watercolor-wash","Watercolor Wash",{size:115,opacity:24,flow:18,hardness:8,spacing:2,smoothing:46,texture:"wet",pressureCurve:44}),
 p("Paint","palette-knife","Palette Knife",{size:58,opacity:100,flow:92,hardness:100,spacing:4,smoothing:30,tip:"flat",texture:"canvas",angle:18,pressureCurve:30}),

 p("Markers","alcohol-marker","Alcohol Marker",{size:34,opacity:38,flow:34,hardness:88,spacing:3,smoothing:48,tip:"paint",pressureCurve:34}),
 p("Markers","chisel-marker","Chisel Marker",{size:42,opacity:62,flow:52,hardness:100,spacing:3,smoothing:54,tip:"chisel",angle:45,pressureCurve:25}),
 p("Markers","brush-marker","Brush Marker",{size:20,opacity:82,flow:76,hardness:100,spacing:3,smoothing:62,stabilizer:8,pressureCurve:74}),
 p("Markers","highlighter","Highlighter",{size:48,opacity:25,flow:30,hardness:100,spacing:3,smoothing:44,tip:"chisel",angle:0,pressureCurve:18}),

 p("Texture","chalk","Chalk",{size:28,opacity:72,flow:68,hardness:88,spacing:8,smoothing:22,tip:"bristle",texture:"chalk",randomSize:8,randomOpacity:10}),
 p("Texture","charcoal","Charcoal",{size:34,opacity:68,flow:64,hardness:76,spacing:8,smoothing:20,tip:"bristle",texture:"charcoal",randomSize:10,randomOpacity:14}),
 p("Texture","pastel","Soft Pastel",{size:45,opacity:62,flow:55,hardness:55,spacing:7,smoothing:25,tip:"bristle",texture:"grain",randomSize:6,randomOpacity:10}),
 p("Texture","grain-shader","Grain Shader",{size:90,opacity:20,flow:16,hardness:18,spacing:5,smoothing:32,texture:"grain",randomOpacity:12}),

 p("Specialty Brushes","sponge","Sponge",{size:70,opacity:58,flow:70,hardness:70,spacing:38,smoothing:12,tip:"scatter",texture:"grain",randomSize:22,randomOpacity:15,randomRotation:45}),
 p("Specialty Brushes","grass","Grass",{size:48,opacity:88,flow:90,hardness:100,spacing:32,smoothing:18,tip:"grass",randomSize:18,randomOpacity:8,randomRotation:8}),
 p("Specialty Brushes","leaves","Leaves",{size:34,opacity:90,flow:90,hardness:100,spacing:48,smoothing:16,tip:"leaf",randomSize:24,randomOpacity:10,randomRotation:38}),
 p("Specialty Brushes","clouds","Clouds",{size:120,opacity:24,flow:35,hardness:0,spacing:24,smoothing:30,tip:"cloud",randomSize:20,randomOpacity:12,randomRotation:25}),
 p("Specialty Brushes","scatter","Scatter",{size:32,opacity:72,flow:78,hardness:100,spacing:48,smoothing:8,tip:"scatter",randomSize:35,randomOpacity:20,randomRotation:90})
];

export const brushCategories:BrushCategory[]=["Core Brushes","Ink","Pencils","Paint","Markers","Texture","Specialty Brushes","Custom"];

const stampCache=new Map<string,HTMLCanvasElement>();
const hash=(text:string):number=>{let value=2166136261;for(let i=0;i<text.length;i++)value=Math.imul(value^text.charCodeAt(i),16777619);return value>>>0};
const randomFactory=(seed:number):(()=>number)=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};

export function getBrushStamp(settings:BrushSettings,color:string,size:number):HTMLCanvasElement{
 const px=Math.max(2,Math.ceil(size)),key=[settings.tip,settings.texture,settings.hardness,color,px].join("|");
 const cached=stampCache.get(key);if(cached)return cached;
 const pad=Math.max(3,Math.ceil(px*.18)),canvas=document.createElement("canvas");canvas.width=canvas.height=px+pad*2;
 const ctx=canvas.getContext("2d")!,cx=canvas.width/2,cy=canvas.height/2,r=px/2;
 ctx.fillStyle=color;const shape=()=>{ctx.beginPath();if(settings.tip==="flat")ctx.roundRect(cx-r,cy-r*.32,px,px*.64,Math.max(1,r*.08));else if(settings.tip==="chisel"){ctx.ellipse(cx,cy,r,r*.24,0,0,Math.PI*2)}else if(settings.tip==="paint"){ctx.roundRect(cx-r,cy-r*.37,px,px*.74,Math.max(2,r*.35))}else if(settings.tip==="leaf"){ctx.moveTo(cx-r,cy);ctx.quadraticCurveTo(cx,cy-r,cx+r,cy);ctx.quadraticCurveTo(cx,cy+r,cx-r,cy)}else if(settings.tip==="grass"){for(let i=-2;i<=2;i++){ctx.moveTo(cx+i*r*.18,cy+r);ctx.quadraticCurveTo(cx+i*r*.25,cy,cx+i*r*.38,cy-r)}}else if(settings.tip==="cloud"){ctx.arc(cx-r*.36,cy,r*.48,0,Math.PI*2);ctx.arc(cx,cy-r*.2,r*.58,0,Math.PI*2);ctx.arc(cx+r*.42,cy+r*.02,r*.42,0,Math.PI*2)}else if(settings.tip==="bristle"){for(let i=-3;i<=3;i++)ctx.ellipse(cx+i*r*.22,cy,r*.14,r,0,0,Math.PI*2)}else ctx.arc(cx,cy,r,0,Math.PI*2)};
 if(settings.tip==="round"&&settings.hardness<98){const gradient=ctx.createRadialGradient(cx,cy,r*settings.hardness/100,cx,cy,r);gradient.addColorStop(0,color);gradient.addColorStop(1,"transparent");ctx.fillStyle=gradient}shape();ctx.fill();
 if(settings.tip==="scatter"){ctx.clearRect(0,0,canvas.width,canvas.height);const rnd=randomFactory(hash(key));for(let i=0;i<18;i++){ctx.globalAlpha=.35+rnd()*.65;ctx.beginPath();ctx.arc(cx+(rnd()-.5)*px,cy+(rnd()-.5)*px,Math.max(1,rnd()*r*.24),0,Math.PI*2);ctx.fill()}}
 if(settings.texture!=="none"){const rnd=randomFactory(hash(key+settings.texture));ctx.save();ctx.globalCompositeOperation="destination-out";const densities:{[K in BrushTexture]:number}={none:0,paper:.10,grain:.18,chalk:.28,charcoal:.34,canvas:.17,wet:.08},density=densities[settings.texture];for(let i=0;i<px*px*density/18;i++){ctx.globalAlpha=.15+rnd()*.55;const x=pad+rnd()*px,y=pad+rnd()*px,s=settings.texture==="canvas"?1:1+rnd()*3;ctx.fillRect(x,y,s,s)}ctx.restore()}
 stampCache.set(key,canvas);if(stampCache.size>180)stampCache.delete(stampCache.keys().next().value!);return canvas
}

export function presetToSettings(preset:BrushPreset,current:BrushSettings):BrushSettings{return{...current,...preset,pressureCurve:preset.pressureCurve??current.pressureCurve??50,eraserMode:false,symmetry:current.symmetry}}
export function validateBrushes(presets:BrushPreset[]):string[]{const ids=new Set<string>();return presets.flatMap(brush=>{const errors:string[]=[];if(!brush.id||ids.has(brush.id))errors.push(`Invalid or duplicate id: ${brush.id}`);ids.add(brush.id);if(brush.size<=0||brush.opacity<1||brush.opacity>100||brush.spacing<1)errors.push(`Invalid settings: ${brush.name}`);return errors})}

export interface StrokePoint {x:number;y:number;pressure:number}
export interface StrokeOptions {settings:BrushSettings;color:string;erase:boolean;clip?:(ctx:CanvasRenderingContext2D)=>void;seed?:number}

const effectTips=new Set<BrushTip>(["scatter","leaf","grass","cloud"]);
const pressureValue=(raw:number,curve:number):number=>{
 const p=Math.min(1,Math.max(.02,raw));
 const exponent=Math.pow(2,(50-Math.min(100,Math.max(0,curve)))/50);
 return Math.pow(p,exponent);
};

/** A stroke-local, distance driven dab renderer. It never depends on event rate. */
export class StrokeRenderer{
 private previous:StrokePoint|null=null;
 private filtered:StrokePoint|null=null;
 private carry=0;
 private dabIndex=0;
 private random:()=>number;
 constructor(private readonly ctx:CanvasRenderingContext2D,private readonly options:StrokeOptions){this.random=randomFactory(options.seed??((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0))}
 private get usesStampPath():boolean{const s=this.options.settings;return effectTips.has(s.tip)||s.tip==="bristle"||s.texture!=="none"||s.hardness<45}
 begin(point:StrokePoint):void{this.previous={...point};this.filtered={...point};if(this.usesStampPath)this.paint(point,0,true);else this.drawStart(point)}
 add(point:StrokePoint):void{
  if(!this.previous||!this.filtered){this.begin(point);return}
  const rawDistance=Math.hypot(point.x-this.previous.x,point.y-this.previous.y);
  if(rawDistance<.01)return;
  const settings=this.options.settings;
  const smoothing=Math.min(.88,(settings.smoothing/100)*.58+(settings.stabilizer/30)*.3);
  const follow=1-smoothing;
  const target={x:this.filtered.x+(point.x-this.filtered.x)*follow,y:this.filtered.y+(point.y-this.filtered.y)*follow,pressure:this.filtered.pressure+(point.pressure-this.filtered.pressure)*Math.max(.28,follow)};
  if(this.usesStampPath)this.emitSegment(this.filtered,target);else this.drawContinuous(this.filtered,target);
  this.previous={...point};this.filtered=target;
 }
 private drawStart(point:StrokePoint):void{const s=this.options.settings,p=pressureValue(point.pressure,s.pressureCurve),radius=Math.max(.25,s.size*p/2),alpha=(s.opacity/100)*(s.flow/100);this.ctx.save();this.options.clip?.(this.ctx);this.ctx.globalCompositeOperation=this.options.erase?"destination-out":"source-over";this.ctx.globalAlpha=alpha;this.ctx.fillStyle=this.options.color;this.ctx.beginPath();if(s.tip==="flat"||s.tip==="chisel"){const angle=(s.angle+s.rotation)*Math.PI/180;this.ctx.ellipse(point.x,point.y,radius,Math.max(.5,radius*(s.tip==="chisel"?.24:.32)),angle,0,Math.PI*2)}else this.ctx.arc(point.x,point.y,radius,0,Math.PI*2);this.ctx.fill();this.ctx.restore()}
 private drawContinuous(a:StrokePoint,b:StrokePoint):void{
  const s=this.options.settings,pa=pressureValue(a.pressure,s.pressureCurve),pb=pressureValue(b.pressure,s.pressureCurve),ra=Math.max(.25,s.size*pa/2),rb=Math.max(.25,s.size*pb/2),alpha=(s.opacity/100)*(s.flow/100),angle=(s.angle+s.rotation)*Math.PI/180;
  const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<.01)return;
  const nx=-dy/d,ny=dx/d;
  let wa=ra,wb=rb;
  if(s.tip==="flat"||s.tip==="chisel"){
   const nibX=Math.cos(angle),nibY=Math.sin(angle),sideX=-nibY,sideY=nibX,minor=s.tip==="chisel"?.24:.32;
   const projection=Math.sqrt((nx*nibX+ny*nibY)**2+minor**2*(nx*sideX+ny*sideY)**2);
   wa=Math.max(.4,ra*projection);wb=Math.max(.4,rb*projection);
  }
  this.ctx.save();this.options.clip?.(this.ctx);this.ctx.globalCompositeOperation=this.options.erase?"destination-out":"source-over";this.ctx.globalAlpha=alpha;this.ctx.fillStyle=this.options.color;this.ctx.beginPath();this.ctx.moveTo(a.x+nx*wa,a.y+ny*wa);this.ctx.lineTo(b.x+nx*wb,b.y+ny*wb);this.ctx.lineTo(b.x-nx*wb,b.y-ny*wb);this.ctx.lineTo(a.x-nx*wa,a.y-ny*wa);this.ctx.closePath();this.ctx.fill();
  this.ctx.beginPath();if(s.tip==="flat"||s.tip==="chisel")this.ctx.ellipse(b.x,b.y,rb,Math.max(.4,rb*(s.tip==="chisel"?.24:.32)),angle,0,Math.PI*2);else this.ctx.arc(b.x,b.y,rb,0,Math.PI*2);this.ctx.fill();this.ctx.restore();
 }
 end(point?:StrokePoint):void{
  if(point)this.add(point);
  this.previous=null;this.filtered=null;
 }
 private emitSegment(a:StrokePoint,b:StrokePoint,finish=false):void{
  const distance=Math.hypot(b.x-a.x,b.y-a.y);if(distance<.01)return;
  const direction=Math.atan2(b.y-a.y,b.x-a.x);
  let travelled=0;
  while(true){
   const t=Math.min(1,travelled/distance),pressure=pressureValue(a.pressure+(b.pressure-a.pressure)*t,this.options.settings.pressureCurve);
   const diameter=Math.max(.5,this.options.settings.size*pressure);
   const spacing=Math.max(.45,diameter*this.options.settings.spacing/100);
   const needed=this.dabIndex===0?0:spacing-this.carry;
   if(travelled+needed>distance)break;
   travelled+=needed;
   const at=travelled/distance;
   this.paint({x:a.x+(b.x-a.x)*at,y:a.y+(b.y-a.y)*at,pressure:a.pressure+(b.pressure-a.pressure)*at},direction);
   this.carry=0;
  }
  this.carry+=Math.max(0,distance-travelled);
  if(finish&&this.carry>Math.max(.5,this.options.settings.size*.08)){this.paint(b,direction);this.carry=0}
 }
 private paint(point:StrokePoint,direction:number,initial=false):void{
  const s=this.options.settings,pressure=pressureValue(point.pressure,s.pressureCurve),isEffect=effectTips.has(s.tip);
  const sizeJitter=isEffect?s.randomSize/100:Math.min(.08,s.randomSize/500);
  const diameter=Math.max(.5,s.size*pressure*(1+(this.random()*2-1)*sizeJitter));
  const stamp=getBrushStamp(s,this.options.color,diameter);
  const directionAngle=s.tip==="bristle"?direction-Math.PI/2:(s.tip==="grass"||s.tip==="leaf")?direction:0;
  const randomAngle=isEffect?(this.random()*2-1)*s.randomRotation*Math.PI/180:0;
  const angle=(s.angle+s.rotation)*Math.PI/180+directionAngle+randomAngle;
  const opacityJitter=isEffect?s.randomOpacity/100:Math.min(.08,s.randomOpacity/500);
  const baseAlpha=(s.opacity/100)*(s.flow/100)*(1-this.random()*opacityJitter);
  const alpha=initial?Math.min(1,baseAlpha):1-Math.pow(1-Math.min(.99,baseAlpha),Math.max(.25,s.spacing/12));
  this.ctx.save();this.options.clip?.(this.ctx);this.ctx.globalCompositeOperation=this.options.erase?"destination-out":"source-over";this.ctx.globalAlpha=alpha;this.ctx.translate(point.x,point.y);this.ctx.rotate(angle);this.ctx.drawImage(stamp,-stamp.width/2,-stamp.height/2);this.ctx.restore();this.dabIndex++;
 }
}

/** Persistent colour-pickup smudge. The carried patch is deposited and refreshed at each distance-spaced dab. */
export class SmudgeRenderer{
 private previous:StrokePoint|null=null;private carry=0;private pickup=document.createElement("canvas");private mask=document.createElement("canvas");
 constructor(private readonly ctx:CanvasRenderingContext2D,private readonly settings:BrushSettings,private readonly clip?:(ctx:CanvasRenderingContext2D)=>void){}
 begin(point:StrokePoint):void{this.previous={...point};this.capture(point)}
 add(point:StrokePoint):void{if(!this.previous){this.begin(point);return}const a=this.previous,distance=Math.hypot(point.x-a.x,point.y-a.y);if(distance<.01)return;const step=Math.max(1,this.settings.size*Math.max(.05,this.settings.spacing/100)*.45);let d=step-this.carry;while(d<=distance){const t=d/distance;this.dab({x:a.x+(point.x-a.x)*t,y:a.y+(point.y-a.y)*t,pressure:a.pressure+(point.pressure-a.pressure)*t});d+=step}this.carry=Math.max(0,distance-(d-step));this.previous={...point}}
 end(point?:StrokePoint):void{if(point)this.add(point);this.previous=null}
 private ensure(size:number):void{if(this.pickup.width===size)return;this.pickup.width=this.pickup.height=this.mask.width=this.mask.height=size;const m=this.mask.getContext("2d")!,r=size/2,g=m.createRadialGradient(r,r,0,r,r,r);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(Math.max(.05,this.settings.hardness/100),"rgba(255,255,255,.94)");g.addColorStop(1,"rgba(255,255,255,0)");m.fillStyle=g;m.fillRect(0,0,size,size)}
 private capture(point:StrokePoint):void{const size=Math.max(4,Math.ceil(this.settings.size*pressureValue(point.pressure,this.settings.pressureCurve)));this.ensure(size);const p=this.pickup.getContext("2d")!;p.clearRect(0,0,size,size);p.drawImage(this.ctx.canvas,point.x-size/2,point.y-size/2,size,size,0,0,size,size);p.globalCompositeOperation="destination-in";p.drawImage(this.mask,0,0);p.globalCompositeOperation="source-over"}
 private dab(point:StrokePoint):void{const size=this.pickup.width;if(!size)return;const strength=(this.settings.blendStrength/100)*pressureValue(point.pressure,this.settings.pressureCurve);this.ctx.save();this.clip?.(this.ctx);this.ctx.globalAlpha=Math.min(.92,strength);this.ctx.drawImage(this.pickup,point.x-size/2,point.y-size/2);this.ctx.restore();const p=this.pickup.getContext("2d")!;p.globalAlpha=Math.max(.08,1-strength*.72);p.globalCompositeOperation="source-over";p.drawImage(this.ctx.canvas,point.x-size/2,point.y-size/2,size,size,0,0,size,size);p.globalAlpha=1;p.globalCompositeOperation="destination-in";p.drawImage(this.mask,0,0);p.globalCompositeOperation="source-over"}
}

/* Deferred local pixel tools; kept out of this cache-correction build.
export type PixelToolMode="mixer"|"blur"|"sharpen"|"dodge"|"burn";
export class PixelToolRenderer{
 private previous:StrokePoint|null=null;private carry=0;private carried:[number,number,number]|null=null;
 constructor(private readonly ctx:CanvasRenderingContext2D,private readonly settings:BrushSettings,private readonly mode:PixelToolMode,private readonly color:[number,number,number]){}
 begin(point:StrokePoint):void{this.previous={...point};this.apply(point)}
 add(point:StrokePoint):void{if(!this.previous){this.begin(point);return}const a=this.previous,d=Math.hypot(point.x-a.x,point.y-a.y);if(d<.01)return;const step=Math.max(1,this.settings.size*.12);let at=step-this.carry;while(at<=d){const t=at/d;this.apply({x:a.x+(point.x-a.x)*t,y:a.y+(point.y-a.y)*t,pressure:a.pressure+(point.pressure-a.pressure)*t});at+=step}this.carry=Math.max(0,d-(at-step));this.previous={...point}}
 end(point?:StrokePoint):void{if(point)this.add(point);this.previous=null}
 private apply(point:StrokePoint):void{const radius=Math.max(2,Math.ceil(this.settings.size*pressureValue(point.pressure,this.settings.pressureCurve)/2)),x=Math.max(0,Math.floor(point.x-radius)),y=Math.max(0,Math.floor(point.y-radius)),w=Math.min(this.ctx.canvas.width-x,radius*2+1),h=Math.min(this.ctx.canvas.height-y,radius*2+1);if(w<1||h<1)return;const image=this.ctx.getImageData(x,y,w,h),source=new Uint8ClampedArray(image.data),data=image.data,strength=(this.settings.blendStrength/100)*.32;
  if(this.mode==="mixer"&&!this.carried)this.carried=[this.color[0],this.color[1],this.color[2]];
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){const dx=x+px-point.x,dy=y+py-point.y,fall=Math.max(0,1-Math.hypot(dx,dy)/radius);if(!fall)continue;const i=(py*w+px)*4,a=strength*fall*fall;if(this.mode==="blur"||this.mode==="sharpen"){let rr=0,gg=0,bb=0,count=0;for(let oy=-1;oy<=1;oy++)for(let ox=-1;ox<=1;ox++){const sx=Math.min(w-1,Math.max(0,px+ox)),sy=Math.min(h-1,Math.max(0,py+oy)),si=(sy*w+sx)*4;rr+=source[si]!;gg+=source[si+1]!;bb+=source[si+2]!;count++}rr/=count;gg/=count;bb/=count;const factor=this.mode==="blur"?a:-a*.75;data[i]=Math.min(255,Math.max(0,data[i]!+(rr-data[i]!)*factor));data[i+1]=Math.min(255,Math.max(0,data[i+1]!+(gg-data[i+1]!)*factor));data[i+2]=Math.min(255,Math.max(0,data[i+2]!+(bb-data[i+2]!)*factor))}else if(this.mode==="mixer"){const c=this.carried!;const pickup=a*.45;c[0]+= (data[i]!-c[0])*pickup;c[1]+=(data[i+1]!-c[1])*pickup;c[2]+=(data[i+2]!-c[2])*pickup;data[i]+= (c[0]-data[i]!)*a;data[i+1]+=(c[1]-data[i+1]!)*a;data[i+2]+=(c[2]-data[i+2]!)*a;data[i+3]=Math.max(data[i+3]!,Math.round(255*a))}else{const sign=this.mode==="dodge"?1:-1;data[i]=Math.min(255,Math.max(0,data[i]!+sign*255*a*.28));data[i+1]=Math.min(255,Math.max(0,data[i+1]!+sign*255*a*.28));data[i+2]=Math.min(255,Math.max(0,data[i+2]!+sign*255*a*.28))}}
  this.ctx.putImageData(image,x,y)}
}
*/
