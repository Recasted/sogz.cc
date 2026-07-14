export class HistoryManager<T> {
  private undoItems:T[]=[];
  private redoItems:T[]=[];
  constructor(private readonly limit=20,private readonly onChange:()=>void=()=>{}){}
  push(item:T):void{this.undoItems.push(item);if(this.undoItems.length>this.limit)this.undoItems.shift();this.redoItems=[];this.onChange()}
  undo(current:T):T|null{const item=this.undoItems.pop();if(!item)return null;this.redoItems.push(current);this.onChange();return item}
  redo(current:T):T|null{const item=this.redoItems.pop();if(!item)return null;this.undoItems.push(current);this.onChange();return item}
  reset():void{this.undoItems=[];this.redoItems=[];this.onChange()}
  labels(getLabel:(item:T)=>string):string[]{return this.undoItems.map(getLabel)}
  get canUndo():boolean{return this.undoItems.length>0}
  get canRedo():boolean{return this.redoItems.length>0}
}
