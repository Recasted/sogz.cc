export class HistoryManager {
    limit;
    onChange;
    undoItems = [];
    redoItems = [];
    constructor(limit = 20, onChange = () => { }) {
        this.limit = limit;
        this.onChange = onChange;
    }
    push(item) { this.undoItems.push(item); if (this.undoItems.length > this.limit)
        this.undoItems.shift(); this.redoItems = []; this.onChange(); }
    undo(current) { const item = this.undoItems.pop(); if (!item)
        return null; this.redoItems.push(current); this.onChange(); return item; }
    redo(current) { const item = this.redoItems.pop(); if (!item)
        return null; this.undoItems.push(current); this.onChange(); return item; }
    reset() { this.undoItems = []; this.redoItems = []; this.onChange(); }
    labels(getLabel) { return this.undoItems.map(getLabel); }
    get canUndo() { return this.undoItems.length > 0; }
    get canRedo() { return this.redoItems.length > 0; }
}
//# sourceMappingURL=history.js.map