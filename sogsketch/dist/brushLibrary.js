import { brushCategories, defaultBrushes, getBrushStamp, presetToSettings, validateBrushes } from "./brushEngine.js";
const CUSTOM_KEY = "sogsketch-brushes-v2", FAVOURITES_KEY = "sogsketch-brush-favourites", RECENT_KEY = "sogsketch-recent-brushes", OPEN_KEY = "sogsketch-brush-library-open";
const byId = (id, items) => items.find(item => item.id === id);
export class BrushLibrary {
    getSettings;
    applySettings;
    onSelect;
    custom = [];
    favourites = new Set();
    recent = [];
    activeId = "hard-round";
    filter = "All";
    favouritesOnly = false;
    recentOnly = false;
    constructor(getSettings, applySettings, onSelect) {
        this.getSettings = getSettings;
        this.applySettings = applySettings;
        this.onSelect = onSelect;
        this.load();
        this.bind();
        this.render();
        if (localStorage.getItem(OPEN_KEY) === "true")
            this.setOpen(true);
    }
    get all() { return [...defaultBrushes, ...this.custom]; }
    get active() { return byId(this.activeId, this.all); }
    selectById(id) { const preset = byId(id, this.all); if (preset)
        this.select(preset); }
    load() { try {
        this.custom = JSON.parse(localStorage.getItem(CUSTOM_KEY) ?? "[]");
    }
    catch {
        this.custom = [];
    } try {
        this.favourites = new Set(JSON.parse(localStorage.getItem(FAVOURITES_KEY) ?? "[]"));
    }
    catch {
        this.favourites = new Set();
    } try {
        this.recent = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    }
    catch {
        this.recent = [];
    } this.activeId = localStorage.getItem("sogsketch-active-brush") ?? this.activeId; }
    save() { localStorage.setItem(CUSTOM_KEY, JSON.stringify(this.custom)); localStorage.setItem(FAVOURITES_KEY, JSON.stringify([...this.favourites])); localStorage.setItem(RECENT_KEY, JSON.stringify(this.recent)); localStorage.setItem("sogsketch-active-brush", this.activeId); }
    setOpen(open) { const panel = document.querySelector("#brushLibrary"), button = document.querySelector("#openBrushLibrary"); panel.classList.toggle("open", open); panel.setAttribute("aria-hidden", String(!open)); button.setAttribute("aria-expanded", String(open)); button.textContent = open ? "Close Brush Library" : "Open Brush Library"; localStorage.setItem(OPEN_KEY, String(open)); }
    toggle() { this.setOpen(!document.querySelector("#brushLibrary")?.classList.contains("open")); }
    syncSettings() { document.querySelectorAll("[data-brush-setting]").forEach(input => { const key = input.dataset.brushSetting; const value = this.getSettings()[key]; input.value = String(value); const output = document.querySelector(`[data-brush-output="${key}"]`); if (output)
        output.value = typeof value === "number" ? `${value}${key === "size" ? "px" : key === "rotation" || key === "angle" ? "°" : "%"}` : String(value); }); this.drawMainPreview(this.active?.name ?? "Custom brush"); }
    bind() { document.querySelector("#openBrushLibrary").addEventListener("click", () => this.toggle()); document.querySelector("#closeBrushLibrary").addEventListener("click", () => this.setOpen(false)); const category = document.querySelector("#brushCategory"); for (const value of brushCategories) {
        const option = document.createElement("option");
        option.value = option.textContent = value;
        category.append(option);
    } category.addEventListener("change", () => { this.filter = category.value; this.favouritesOnly = this.recentOnly = false; this.render(); }); document.querySelector("#brushSearch").addEventListener("input", () => this.render()); document.querySelector("#showFavourites").addEventListener("click", () => { this.favouritesOnly = !this.favouritesOnly; this.recentOnly = false; this.render(); }); document.querySelector("#showRecent").addEventListener("click", () => { this.recentOnly = !this.recentOnly; this.favouritesOnly = false; this.render(); }); document.querySelectorAll("[data-brush-setting]").forEach(input => input.addEventListener("input", () => { const settings = { ...this.getSettings() }, key = input.dataset.brushSetting; settings[key] = input instanceof HTMLInputElement ? Number(input.value) : input.value; this.applySettings(settings); this.syncSettings(); })); document.querySelector("#newBrushPreset").addEventListener("click", () => this.saveCurrent()); document.querySelector("#duplicateBrushPreset").addEventListener("click", () => this.duplicate()); document.querySelector("#renameBrushPreset").addEventListener("click", () => this.rename()); document.querySelector("#deleteBrushPreset").addEventListener("click", () => this.delete()); document.querySelector("#resetBrushPresets").addEventListener("click", () => this.reset()); document.querySelector("#exportBrushPresets").addEventListener("click", () => this.export()); const input = document.querySelector("#brushPresetFileInput"); document.querySelector("#importBrushPresets").addEventListener("click", () => input.click()); input.addEventListener("change", () => { const file = input.files?.[0]; if (file)
        void this.import(file); input.value = ""; }); }
    select(preset) { this.activeId = preset.id; this.recent = [preset.id, ...this.recent.filter(id => id !== preset.id)].slice(0, 12); this.save(); this.applySettings(presetToSettings(preset, this.getSettings())); this.onSelect?.(preset); this.render(); this.syncSettings(); }
    visible() { const search = document.querySelector("#brushSearch")?.value.trim().toLowerCase() ?? ""; let result = this.all.filter(item => (this.filter === "All" || item.category === this.filter) && (!search || `${item.name} ${item.category}`.toLowerCase().includes(search))); if (this.favouritesOnly)
        result = result.filter(item => this.favourites.has(item.id)); if (this.recentOnly)
        result = this.recent.map(id => byId(id, result)).filter((item) => Boolean(item)); return result; }
    render() { const grid = document.querySelector("#brushLibraryGrid"); document.querySelector("#showFavourites")?.classList.toggle("active", this.favouritesOnly); document.querySelector("#showRecent")?.classList.toggle("active", this.recentOnly); grid.replaceChildren(...this.visible().map(preset => { const button = document.createElement("div"); button.className = `library-brush${preset.id === this.activeId ? " active" : ""}`; button.title = `${preset.name} — ${preset.category}`; button.tabIndex = 0; button.setAttribute("role", "button"); const canvas = document.createElement("canvas"); canvas.width = 108; canvas.height = 80; this.drawPreview(canvas, preset); const label = document.createElement("span"); label.innerHTML = `${preset.name}<small>${preset.category}</small>`; const star = document.createElement("button"); star.className = `favourite${this.favourites.has(preset.id) ? " active" : ""}`; star.textContent = "★"; star.title = `${this.favourites.has(preset.id) ? "Remove from" : "Add to"} favourites`; star.addEventListener("click", event => { event.stopPropagation(); this.favourites.has(preset.id) ? this.favourites.delete(preset.id) : this.favourites.add(preset.id); this.save(); this.render(); }); button.append(canvas, label, star); button.addEventListener("click", () => this.select(preset)); button.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        this.select(preset);
    } }); button.addEventListener("pointerenter", () => this.drawMainPreview(preset.name, preset)); button.addEventListener("focus", () => this.drawMainPreview(preset.name, preset)); return button; })); this.syncSettings(); }
    drawPreview(canvas, preset) { const ctx = canvas.getContext("2d"); ctx.clearRect(0, 0, canvas.width, canvas.height); const settings = presetToSettings(preset, this.getSettings()), size = Math.min(28, Math.max(3, preset.size * .28)), isEffect = ["scatter", "leaf", "grass", "cloud"].includes(preset.tip); ctx.strokeStyle = "#e6e6e6"; ctx.fillStyle = "#e6e6e6"; ctx.globalAlpha = Math.max(.32, preset.opacity / 100); if (isEffect) {
        const stamp = getBrushStamp(settings, "#e6e6e6", size);
        for (let x = 12; x < canvas.width - 8; x += Math.max(8, size * preset.spacing / 70)) {
            const y = canvas.height / 2 + Math.sin(x / 18) * 10;
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate((preset.angle + preset.rotation + x) * Math.PI / 180);
            ctx.drawImage(stamp, -stamp.width / 2, -stamp.height / 2);
            ctx.restore();
        }
        return;
    } ctx.lineCap = preset.tip === "flat" || preset.tip === "chisel" ? "square" : "round"; ctx.lineJoin = "round"; ctx.lineWidth = preset.tip === "chisel" ? size * .35 : preset.tip === "flat" ? size * .72 : size; if (preset.hardness < 35) {
        ctx.shadowColor = "#e6e6e6";
        ctx.shadowBlur = size * (1 - preset.hardness / 100) * .55;
        ctx.globalAlpha *= .55;
    } ctx.beginPath(); ctx.moveTo(8, canvas.height * .62); ctx.bezierCurveTo(canvas.width * .28, canvas.height * .12, canvas.width * .62, canvas.height * .9, canvas.width - 8, canvas.height * .35); ctx.stroke(); if (preset.tip === "bristle" || preset.texture !== "none") {
        ctx.shadowBlur = 0;
        ctx.globalAlpha = .22;
        ctx.lineWidth = Math.max(.5, size / 8);
        for (let offset = -2; offset <= 2; offset++) {
            ctx.beginPath();
            ctx.moveTo(8, canvas.height * .62 + offset * 2);
            ctx.bezierCurveTo(canvas.width * .28, canvas.height * .12 + offset * 2, canvas.width * .62, canvas.height * .9 + offset * 2, canvas.width - 8, canvas.height * .35 + offset * 2);
            ctx.stroke();
        }
    } }
    drawMainPreview(name, preset = this.active) { const canvas = document.querySelector("#libraryBrushPreview"); if (!canvas)
        return; const effective = preset ?? { ...this.getSettings(), id: "current", name, category: "Custom" }; this.drawPreview(canvas, effective); document.querySelector("#libraryPreviewName").textContent = name; }
    currentPreset(name, id = crypto.randomUUID()) { return { id, name, category: "Custom", custom: true, ...this.getSettings(), eraserMode: undefined, symmetry: undefined }; }
    saveCurrent() { const name = prompt("Brush name", "Custom Brush")?.trim(); if (!name)
        return; const preset = this.currentPreset(name); this.custom.push(preset); this.activeId = preset.id; this.save(); this.render(); }
    duplicate() { const source = this.active; const name = prompt("Duplicate brush as", `${source?.name ?? "Brush"} copy`)?.trim(); if (!name)
        return; const preset = { ...(source ?? this.currentPreset(name)), id: crypto.randomUUID(), name, category: "Custom", custom: true }; this.custom.push(preset); this.activeId = preset.id; this.save(); this.render(); }
    rename() { const preset = this.custom.find(item => item.id === this.activeId); if (!preset) {
        alert("Default brushes cannot be renamed. Duplicate it first.");
        return;
    } const name = prompt("Brush name", preset.name)?.trim(); if (name) {
        preset.name = name;
        this.save();
        this.render();
    } }
    delete() { const index = this.custom.findIndex(item => item.id === this.activeId); if (index < 0) {
        alert("Default brushes always remain available.");
        return;
    } if (!confirm(`Delete ${this.custom[index].name}?`))
        return; this.custom.splice(index, 1); this.activeId = "hard-round"; this.save(); this.selectById(this.activeId); }
    reset() { const preset = byId(this.activeId, defaultBrushes) ?? defaultBrushes.find(item => item.id === "hard-round"); this.select(preset); }
    export() { const blob = new Blob([JSON.stringify({ format: "sogsketch-brushes", version: 1, brushes: this.custom }, null, 2)], { type: "application/json" }), url = URL.createObjectURL(blob), anchor = document.createElement("a"); anchor.href = url; anchor.download = "sogsketch-brushes.json"; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    async import(file) { try {
        const parsed = JSON.parse(await file.text()), brushes = Array.isArray(parsed) ? parsed : parsed.brushes ?? [], errors = validateBrushes(brushes);
        if (errors.length)
            throw new Error(errors.join("\n"));
        this.custom.push(...brushes.map(item => ({ ...item, id: crypto.randomUUID(), category: "Custom", custom: true })));
        this.save();
        this.render();
    }
    catch (error) {
        alert(`Could not import brushes: ${String(error)}`);
    } }
}
//# sourceMappingURL=brushLibrary.js.map