// SogText — Image tab.
// Turns a picture into glyphs, pixels or shade blocks, with tone + 4-color grading,
// dithering and atmosphere (glow, grain, static, vignette, scanlines, split color).
// Everything runs in the browser; the picture never leaves the device.
(() => {
  const $ = (id) => document.getElementById(id);
  const MONO = '"Cascadia Mono","Consolas","DejaVu Sans Mono","Menlo","Courier New",monospace';
  const STORE = "sogtext-image-v1";

  /* ── controls ─────────────────────────────────────────── */
  const ranges = ["imgCols", "imgExposure", "imgContrast", "imgGamma", "imgBlack", "imgWhite", "imgLevels",
    "imgOrig", "imgSat", "imgGlow", "imgGrain", "imgStatic", "imgVignette", "imgScan", "imgSplit", "imgTextSize", "imgTextAlpha"];
  const others = ["imgCharset", "imgCustom", "imgDither", "imgInvert", "imgEdges", "imgC0", "imgC1", "imgC2", "imgC3",
    "imgBg", "imgTextPos", "imgTextColor"];
  const ctl = Object.fromEntries([...ranges, ...others].map((id) => [id, $(id)]));
  let renderMode = "glyphs";

  const DEFAULTS = {
    mode: "glyphs", imgCols: 160, imgExposure: 0, imgContrast: 0, imgGamma: 1, imgBlack: 0, imgWhite: 1, imgLevels: 12,
    imgOrig: 0, imgSat: 1, imgGlow: .25, imgGrain: .15, imgStatic: 0, imgVignette: .35, imgScan: 0, imgSplit: 0,
    imgTextSize: .6, imgTextAlpha: .9, imgCharset: " .:-=+*#%@", imgCustom: " .sogz'#", imgDither: "none",
    imgInvert: false, imgEdges: false, imgC0: "#000000", imgC1: "#3a0509", imgC2: "#b3121c", imgC3: "#f1e6dc",
    imgBg: "#000000", imgTextPos: "off", imgTextColor: "#e9e2d8"
  };
  const DENSE = " .'`^,:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
  const PRESETS = [
    { name: "Night blue", mode: "pixels", imgCols: 150, imgDither: "bayer", imgLevels: 6, imgContrast: .45, imgGamma: 1.1, imgBlack: .1,
      imgC0: "#000000", imgC1: "#0b1440", imgC2: "#8d9cd8", imgC3: "#f4f6ff", imgBg: "#000000", imgGlow: .22, imgGrain: .12,
      imgStatic: .35, imgVignette: .3, imgScan: 0, imgSplit: 0, imgOrig: 0 },
    { name: "Dense ink", mode: "glyphs", imgCols: 190, imgCharset: DENSE, imgDither: "none", imgLevels: 32, imgContrast: .35, imgGamma: 1,
      imgBlack: .05, imgC0: "#000000", imgC1: "#262626", imgC2: "#9b9b9b", imgC3: "#f2f2f2", imgBg: "#000000", imgGlow: .1,
      imgGrain: .1, imgStatic: 0, imgVignette: .5, imgScan: .15, imgSplit: 0, imgOrig: 0 },
    { name: "Blood", mode: "glyphs", imgCols: 150, imgCharset: " .:-=+*#%@", imgDither: "bayer", imgLevels: 12, imgContrast: .5,
      imgGamma: 1.1, imgBlack: .08, imgC0: "#000000", imgC1: "#3a0509", imgC2: "#b3121c", imgC3: "#f1e6dc", imgBg: "#000000",
      imgGlow: .45, imgGrain: .15, imgStatic: .2, imgVignette: .45, imgScan: 0, imgSplit: 0, imgOrig: 0 },
    { name: "Ghost", mode: "pixels", imgCols: 120, imgDither: "bayer", imgLevels: 3, imgContrast: .3, imgGamma: 1.3, imgBlack: 0,
      imgC0: "#050505", imgC1: "#1d1b1f", imgC2: "#6c6a7a", imgC3: "#e9e6f5", imgBg: "#050505", imgGlow: .5, imgGrain: .28,
      imgStatic: .1, imgVignette: .5, imgScan: 0, imgSplit: 3, imgOrig: 0 },
    { name: "Bleed", mode: "blocks", imgCols: 110, imgDither: "floyd", imgLevels: 5, imgContrast: .4, imgGamma: 1, imgBlack: .05,
      imgC0: "#000000", imgC1: "#1a0002", imgC2: "#8a0a13", imgC3: "#ff6b5a", imgBg: "#000000", imgGlow: .35, imgGrain: .15,
      imgStatic: 0, imgVignette: .4, imgScan: .35, imgSplit: 4, imgOrig: 0 },
    { name: "True color", mode: "glyphs", imgCols: 160, imgCharset: " .:-=+*#%@", imgDither: "none", imgLevels: 24, imgContrast: .2,
      imgGamma: 1, imgBlack: .02, imgOrig: 1, imgSat: 1.25, imgBg: "#000000", imgGlow: .2, imgGrain: .08, imgStatic: 0,
      imgVignette: .3, imgScan: 0, imgSplit: 0 }
  ];

  const get = () => {
    const s = { mode: renderMode };
    for (const id of ranges) s[id] = +ctl[id].value;
    for (const id of others) s[id] = ctl[id].type === "checkbox" ? ctl[id].checked : ctl[id].value;
    return s;
  };
  const set = (s) => {
    if (s.mode) setMode(s.mode, false);
    for (const [k, v] of Object.entries(s)) {
      const el = ctl[k]; if (!el) continue;
      if (el.type === "checkbox") el.checked = !!v;
      else if (el.tagName === "SELECT" && ![...el.options].some((o) => o.value === String(v))) el.value = "custom", ctl.imgCustom.value = v;
      else el.value = v;
    }
    syncOutputs();
  };
  const syncOutputs = () => {
    for (const id of ranges) {
      const o = ctl[id].parentElement.querySelector("output");
      if (o) { const v = +ctl[id].value; o.textContent = Number.isInteger(v) ? v : v.toFixed(2); }
    }
    $("customRow").hidden = ctl.imgCharset.value !== "custom";
    $("charsetRow").hidden = renderMode !== "glyphs";
  };
  const setMode = (m, go = true) => {
    renderMode = m;
    for (const b of $("imgMode").children) b.classList.toggle("on", b.dataset.v === m);
    syncOutputs();
    if (go) schedule();
  };

  /* ── tabs: Text / Image ───────────────────────────────── */
  const setTab = (tab) => {
    document.body.dataset.mode = tab;
    for (const b of $("modeTabs").children) b.classList.toggle("on", b.dataset.mode === tab);
    history.replaceState(null, "", tab === "image" ? "#image" : location.pathname + location.search);
    if (tab === "image") schedule();
  };
  $("modeTabs").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setTab(b.dataset.mode); });

  /* ── source image ─────────────────────────────────────── */
  let source = null, sourceName = "";
  const load = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { source = img; sourceName = file.name || "pasted image"; setTab("image"); showCanvas(); schedule(); };
    img.onerror = () => toast("That image couldn't be opened");
    img.src = url;
  };
  const loadUrl = (url, name) => {
    const img = new Image();
    img.onload = () => { source = img; sourceName = name; showCanvas(); schedule(); };
    img.src = url;
  };
  const showCanvas = () => { $("imgDrop").hidden = true; out.hidden = false; $("compareWrap").hidden = false; };
  $("imgOpen").addEventListener("click", () => $("imgFile").click());
  $("imgFile").addEventListener("change", (e) => { load(e.target.files[0]); e.target.value = ""; });
  const sample = document.createElement("button");
  sample.type = "button"; sample.className = "btn"; sample.textContent = "try a sample";
  sample.addEventListener("click", () => loadUrl("../assets/card-01.jpg", "sample"));
  $("imgDrop").appendChild(sample);

  addEventListener("dragover", (e) => { if ([...e.dataTransfer.types].includes("Files")) { e.preventDefault(); $("imgStage").classList.add("over"); } });
  addEventListener("dragleave", (e) => { if (!e.relatedTarget) $("imgStage").classList.remove("over"); });
  addEventListener("drop", (e) => {
    const f = [...(e.dataTransfer?.files || [])].find((x) => x.type.startsWith("image/"));
    $("imgStage").classList.remove("over");
    if (f) { e.preventDefault(); load(f); }
  });
  addEventListener("paste", (e) => {
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (item) { e.preventDefault(); load(item.getAsFile()); }
  });

  /* ── helpers ──────────────────────────────────────────── */
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + .5) / 16);
  const gradient = (stops) => {
    const c = stops.map(hex);
    return (t) => {
      const x = clamp(t) * 3, i = Math.min(2, Math.floor(x)), f = x - i, a = c[i], b = c[i + 1];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
    };
  };
  const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  /* ── analyse: image → grid of tone values + colors ────── */
  const analyse = (s, cols, rows) => {
    const c = document.createElement("canvas"); c.width = cols; c.height = rows;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.imageSmoothingQuality = "high";
    x.drawImage(source, 0, 0, cols, rows);
    const d = x.getImageData(0, 0, cols, rows).data;
    const n = cols * rows, L = new Float32Array(n), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = d[i * 4] / 255, g = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255;
      L[i] = .2126 * r + .7152 * g + .0722 * b;
      col[i * 3] = r; col[i * 3 + 1] = g; col[i * 3 + 2] = b;
    }
    if (s.imgEdges) {
      const E = new Float32Array(n);
      for (let y = 1; y < rows - 1; y++) for (let xx = 1; xx < cols - 1; xx++) {
        const i = y * cols + xx;
        const gx = L[i - cols + 1] + 2 * L[i + 1] + L[i + cols + 1] - L[i - cols - 1] - 2 * L[i - 1] - L[i + cols - 1];
        const gy = L[i + cols - 1] + 2 * L[i + cols] + L[i + cols + 1] - L[i - cols - 1] - 2 * L[i - cols] - L[i - cols + 1];
        E[i] = Math.min(1, Math.hypot(gx, gy));
      }
      for (let i = 0; i < n; i++) L[i] = clamp(L[i] + E[i] * .6);
    }
    // tone curve
    const ex = 2 ** s.imgExposure, k = 1 + s.imgContrast, lo = s.imgBlack, hi = Math.max(lo + .02, s.imgWhite), g = 1 / s.imgGamma;
    const T = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      let v = L[i] * ex;
      v = (v - .5) * k + .5;
      v = clamp((v - lo) / (hi - lo));
      v = v ** g;
      if (s.imgInvert) v = 1 - v;
      T[i] = v;
    }
    // quantize + dither
    const N = Math.max(2, s.imgLevels | 0), steps = N - 1, Q = new Float32Array(n);
    if (s.imgDither === "floyd") {
      const buf = Float32Array.from(T);
      for (let y = 0; y < rows; y++) for (let xx = 0; xx < cols; xx++) {
        const i = y * cols + xx, old = buf[i], q = Math.round(clamp(old) * steps) / steps, e = old - q;
        Q[i] = q;
        if (xx + 1 < cols) buf[i + 1] += e * 7 / 16;
        if (y + 1 < rows) {
          if (xx > 0) buf[i + cols - 1] += e * 3 / 16;
          buf[i + cols] += e * 5 / 16;
          if (xx + 1 < cols) buf[i + cols + 1] += e / 16;
        }
      }
    } else {
      const r = rng(1159);
      for (let y = 0; y < rows; y++) for (let xx = 0; xx < cols; xx++) {
        const i = y * cols + xx;
        const t = s.imgDither === "bayer" ? BAYER[(y & 3) * 4 + (xx & 3)] : s.imgDither === "noise" ? r() : .5;
        Q[i] = clamp(Math.floor(T[i] * steps + t) / steps);
      }
    }
    return { L, col, Q };
  };

  /* ── render ───────────────────────────────────────────── */
  const out = $("imgOut"), octx = out.getContext("2d");
  let lastGrid = null;

  const render = (s, scale, target = out) => {
    const ctx = target.getContext("2d");
    const mode = s.mode;
    const glyphy = mode !== "pixels";
    // Cell geometry. Preview aims for ~1200px wide; export multiplies.
    const cols = Math.round(s.imgCols);
    const base = 1200 / cols;
    let cw, ch, fs;
    if (glyphy) {
      fs = Math.max(4, base / .6) * scale;
      ctx.font = `${fs}px ${MONO}`;
      cw = ctx.measureText("M").width || fs * .6;
      ch = fs * 1.0;
    } else { cw = ch = Math.max(2, base) * scale; }
    const aspect = source.naturalHeight / source.naturalWidth;
    const rows = Math.max(1, Math.round(cols * aspect * (cw / ch)));
    const W = Math.round(cols * cw), H = Math.round(rows * ch);
    target.width = W; target.height = H;

    const { col, Q } = analyse(s, cols, rows);
    const grad = gradient([s.imgC0, s.imgC1, s.imgC2, s.imgC3]);
    const mix = s.imgOrig, sat = s.imgSat;
    const colorAt = (i) => {
      const q = Q[i], gc = grad(q);
      if (mix <= 0) return gc;
      let r = col[i * 3], g = col[i * 3 + 1], b = col[i * 3 + 2];
      const l = .2126 * r + .7152 * g + .0722 * b;
      r = l + (r - l) * sat; g = l + (g - l) * sat; b = l + (b - l) * sat;
      const m = Math.max(r, g, b, 1e-3), f = Math.max(q, .08) / m; // keep graded brightness, take the hue
      const oc = [clamp(r * f) * 255, clamp(g * f) * 255, clamp(b * f) * 255];
      return [gc[0] + (oc[0] - gc[0]) * mix, gc[1] + (oc[1] - gc[1]) * mix, gc[2] + (oc[2] - gc[2]) * mix];
    };

    ctx.fillStyle = s.imgBg; ctx.fillRect(0, 0, W, H);
    const chars = mode === "blocks" ? " ░▒▓█" : (s.imgCharset === "custom" ? (s.imgCustom || " #") : s.imgCharset);
    const text = [];
    if (glyphy) {
      ctx.font = `${fs}px ${MONO}`; ctx.textBaseline = "top";
      const top = chars.length - 1;
      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x, ch1 = chars[Math.round(Q[i] * top)] || " ";
          line += ch1;
          if (ch1 === " ") continue;
          ctx.fillStyle = rgb(colorAt(i));
          if (ch1 === "█") ctx.fillRect(x * cw, y * ch, cw + .5, ch + .5); // solid cells tile without gaps
          else ctx.fillText(ch1, x * cw, y * ch);
        }
        text.push(line.replace(/\s+$/, ""));
      }
    } else {
      const dense = " .:-=+*#%@";
      for (let y = 0; y < rows; y++) {
        let line = "";
        for (let x = 0; x < cols; x++) {
          const i = y * cols + x;
          ctx.fillStyle = rgb(colorAt(i));
          ctx.fillRect(Math.floor(x * cw), Math.floor(y * ch), Math.ceil(cw) + 1, Math.ceil(ch) + 1);
          line += dense[Math.round(Q[i] * 9)];
        }
        text.push(line.replace(/\s+$/, ""));
      }
    }
    lastGrid = text.join("\n");

    // static: specks in the dark like stars / dust (stable between renders)
    if (s.imgStatic > 0) {
      const r = rng(77), light = hex(s.imgC3), mid = hex(s.imgC2), specks = "·.'*+:";
      ctx.font = `${Math.max(6, ch * .9)}px ${MONO}`; ctx.textBaseline = "top";
      for (let i = 0; i < cols * rows; i++) {
        const p = r(), dark = Q[i] < .3;
        if (!dark || p > s.imgStatic * .09) continue;
        const x = (i % cols) * cw, y = Math.floor(i / cols) * ch;
        ctx.fillStyle = rgb(r() < .7 ? light : mid, .35 + r() * .6);
        if (glyphy) ctx.fillText(specks[Math.floor(r() * specks.length)], x, y);
        else { const z = Math.max(1, cw * (r() < .8 ? .5 : 1)); ctx.fillRect(x, y, z, z); }
      }
    }

    // text from the Text tab
    const art = window.SOGTEXT_ART;
    if (s.imgTextPos !== "off" && art) {
      const lines = art.split("\n"), maxCols = Math.max(1, ...lines.map((l) => [...l].length));
      const tfs = (W * s.imgTextSize) / (maxCols * .6);
      ctx.font = `${tfs}px ${MONO}`; ctx.textBaseline = "top";
      const tcw = ctx.measureText("M").width, lh = tfs * 1.08, blockW = tcw * maxCols, blockH = lh * lines.length;
      const ox = (W - blockW) / 2, pad = H * .06;
      const oy = s.imgTextPos === "top" ? pad : s.imgTextPos === "bottom" ? H - blockH - pad : (H - blockH) / 2;
      ctx.save();
      ctx.globalAlpha = s.imgTextAlpha; ctx.fillStyle = s.imgTextColor;
      ctx.shadowColor = s.imgTextColor; ctx.shadowBlur = 14 * scale * s.imgGlow;
      lines.forEach((l, y) => [...l].forEach((c, x) => { if (c !== " ") ctx.fillText(c, ox + x * tcw, oy + y * lh); }));
      ctx.restore();
    }

    post(ctx, W, H, s, scale);
    return { W, H, cols, rows };
  };

  /* ── atmosphere ───────────────────────────────────────── */
  let grainTile = null;
  const grain = () => {
    if (grainTile) return grainTile;
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const x = c.getContext("2d"), d = x.createImageData(256, 256), r = rng(9);
    for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0);
    return grainTile = c;
  };
  const post = (ctx, W, H, s, scale) => {
    if (s.imgGlow > 0) {
      const copy = document.createElement("canvas"); copy.width = W; copy.height = H;
      copy.getContext("2d").drawImage(ctx.canvas, 0, 0);
      ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.imageSmoothingEnabled = true;
      for (const [div, a] of [[6, .55], [18, .45]]) {
        const sm = document.createElement("canvas"); sm.width = Math.max(1, W / div | 0); sm.height = Math.max(1, H / div | 0);
        const sx = sm.getContext("2d"); sx.imageSmoothingQuality = "high"; sx.drawImage(copy, 0, 0, sm.width, sm.height);
        ctx.globalAlpha = s.imgGlow * a; ctx.drawImage(sm, 0, 0, W, H);
      }
      ctx.restore();
    }
    if (s.imgSplit > 0) {
      const off = Math.round(s.imgSplit * scale), img = ctx.getImageData(0, 0, W, H), src = new Uint8ClampedArray(img.data), d = img.data;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const xr = Math.min(W - 1, x + off), xb = Math.max(0, x - off);
        d[i] = src[(y * W + xr) * 4];
        d[i + 2] = src[(y * W + xb) * 4 + 2];
      }
      ctx.putImageData(img, 0, 0);
    }
    if (s.imgScan > 0) {
      ctx.save(); ctx.fillStyle = `rgba(0,0,0,${s.imgScan * .55})`;
      const step = Math.max(2, 3 * scale), h = Math.max(1, scale);
      for (let y = 0; y < H; y += step) ctx.fillRect(0, y, W, h);
      ctx.restore();
    }
    if (s.imgGrain > 0) {
      ctx.save();
      const p = ctx.createPattern(grain(), "repeat");
      p.setTransform?.(new DOMMatrix().scale(Math.max(1, scale * .75)));
      ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = s.imgGrain * .55; ctx.fillStyle = p; ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
    if (s.imgVignette > 0) {
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .25, W / 2, H / 2, Math.hypot(W, H) / 2);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${s.imgVignette * .9})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  };

  /* ── scheduling / persistence ─────────────────────────── */
  let queued = false;
  const schedule = () => {
    if (queued) return; queued = true;
    setTimeout(() => {
      queued = false;
      const s = get();
      try { localStorage.setItem(STORE, JSON.stringify(s)); } catch {}
      if (!source || document.body.dataset.mode !== "image") return;
      const t0 = performance.now();
      const r = render(s, 1);
      out.classList.toggle("pixelated", s.mode === "pixels");
      $("imgMeta").textContent = `${sourceName} · ${r.cols}×${r.rows} cells · ${Math.round(performance.now() - t0)}ms`;
    }, 16);
  };
  for (const el of Object.values(ctl)) el.addEventListener("input", () => { syncOutputs(); markPreset(null); schedule(); });
  $("imgMode").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { setMode(b.dataset.v); markPreset(null); } });
  addEventListener("sogtext:art", () => { if (ctl.imgTextPos.value !== "off") schedule(); });

  // presets
  const presetBox = $("imgPresets");
  PRESETS.forEach((p, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "preset"; b.dataset.i = i;
    const stops = [p.imgC0, p.imgC1, p.imgC2, p.imgC3].filter(Boolean);
    const sw = stops.length ? `linear-gradient(90deg,${stops.join(",")})` : "linear-gradient(90deg,#c0141f,#d6a019,#1f8a52,#2a5bd7)";
    b.innerHTML = `<i style="background:${sw}"></i>${p.name}`;
    b.addEventListener("click", () => { set({ ...DEFAULTS, ...p }); markPreset(i); schedule(); });
    presetBox.appendChild(b);
  });
  const markPreset = (i) => { for (const b of presetBox.children) b.classList.toggle("on", String(i) === b.dataset.i); };

  $("imgReset").addEventListener("click", () => { set(DEFAULTS); markPreset(null); schedule(); });

  // hold to compare with the original
  const showOriginal = () => { if (!source) return; octx.drawImage(source, 0, 0, out.width, out.height); };
  $("imgCompare").addEventListener("pointerdown", showOriginal);
  for (const ev of ["pointerup", "pointerleave", "pointercancel"]) $("imgCompare").addEventListener(ev, schedule);

  /* ── export ───────────────────────────────────────────── */
  const toast = (msg) => {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1600);
  };
  $("imgSave").addEventListener("click", () => {
    if (!source) return toast("Open an image first");
    const s = get();
    let scale = +$("imgScale").value;
    // keep exports under ~7000px on the long side so phones don't run out of memory
    while (scale > 1 && 1200 * scale * Math.max(1, source.naturalHeight / source.naturalWidth) > 7000) scale--;
    toast("Rendering…");
    setTimeout(() => {
      const c = document.createElement("canvas");
      render(s, scale, c);
      c.toBlob((b) => {
        const a = document.createElement("a"); a.href = URL.createObjectURL(b);
        a.download = "sogtext-" + (sourceName.replace(/\.[^.]+$/, "").replace(/[^\w-]/g, "").slice(0, 24) || "image") + ".png";
        a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
        toast("Saved");
      }, "image/png");
    }, 30);
  });
  $("imgCopyTxt").addEventListener("click", async () => {
    if (!lastGrid) return toast("Open an image first");
    try { await navigator.clipboard.writeText(lastGrid); toast("Copied as text"); }
    catch { toast("Couldn't copy"); }
  });

  /* ── start ────────────────────────────────────────────── */
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || "{}"); } catch {}
  set({ ...DEFAULTS, ...saved });
  if (location.hash === "#image") setTab("image");
})();
