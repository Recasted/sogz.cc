export class HistoryManager<T> {
  private undoItems:T[]=[];
  private redoItems:T[]=[];
  constructor(private readonly onChange:()=>void=()=>{}){}
  push(item:T):void{this.undoItems.push(item);this.redoItems=[];this.onChange()}
  undo(current:T):T|null{const item=this.undoItems.pop();if(item===undefined)return null;this.redoItems.push(current);this.onChange();return item}
  redo(current:T):T|null{const item=this.redoItems.pop();if(item===undefined)return null;this.undoItems.push(current);this.onChange();return item}
  reset():void{this.undoItems=[];this.redoItems=[];this.onChange()}
  labels(getLabel:(item:T)=>string):string[]{return this.undoItems.map(getLabel)}
  get canUndo():boolean{return this.undoItems.length>0}
  get canRedo():boolean{return this.redoItems.length>0}
  get undoCount():number{return this.undoItems.length}
  get redoCount():number{return this.redoItems.length}
}
