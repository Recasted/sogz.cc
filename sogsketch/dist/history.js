export class HistoryManager {
    onChange;
    undoItems = [];
    redoItems = [];
    constructor(onChange = () => { }) {
        this.onChange = onChange;
    }
    push(item) { this.undoItems.push(item); this.redoItems = []; this.onChange(); }
    undo(current) { const item = this.undoItems.pop(); if (item === undefined)
        return null; this.redoItems.push(current); this.onChange(); return item; }
    redo(current) { const item = this.redoItems.pop(); if (item === undefined)
        return null; this.undoItems.push(current); this.onChange(); return item; }
    reset() { this.undoItems = []; this.redoItems = []; this.onChange(); }
    labels(getLabel) { return this.undoItems.map(getLabel); }
    get canUndo() { return this.undoItems.length > 0; }
    get canRedo() { return this.redoItems.length > 0; }
    get undoCount() { return this.undoItems.length; }
    get redoCount() { return this.redoItems.length; }
}
//# sourceMappingURL=history.js.map