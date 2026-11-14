// SogSeek — reverse image search hub.
// The image never touches sogz.cc: each button sends it straight from the
// visitor's browser to that engine (form POST for files, a link for URLs).
(() => {
  const $ = (id) => document.getElementById(id);

  /* ── engines ──────────────────────────────────────────────
     cats:  web | anime | art | adult   (used by the filter chips)
     file:  how to send an uploaded image  (null = engine needs a link)
     url:   how to send an image link      (null = engine needs a file) */
  const ENGINES = [
    { group: "web", name: "Google Lens", icon: "G", cats: ["web"],
      desc: "Best all-rounder: products, places, memes and posts. Hides adult results.",
      file: null, paste: "https://images.google.com/", // Google blocks uploads sent from other sites
      url: (u) => open(`https://lens.google.com/uploadbyurl?url=${encodeURIComponent(u)}`) },
    { group: "web", name: "Bing Visual Search", icon: "B", cats: ["web"],
      desc: "A good second opinion for photos and shopping. Hides adult results.",
      file: (img) => post("https://www.bing.com/images/search?view=detailv2&iss=sbiupload&FORM=SBIIDP", { imageBin: img.base64 }),
      url: (u) => open(`https://www.bing.com/images/search?view=detailv2&iss=sbi&FORM=SBIVSP&q=imgurl:${encodeURIComponent(u)}`) },
    { group: "web", name: "Yandex Images", icon: "Y", cats: ["web", "adult"], adult: true,
      desc: "Great at finding the same photo across the web, adult sites included.",
      file: null, paste: "https://yandex.com/images/",
      url: (u) => open(`https://yandex.com/images/search?rpt=imageview&url=${encodeURIComponent(u)}`) },
    { group: "web", name: "TinEye", icon: "T", cats: ["web"],
      desc: "Finds exact copies, edits and the oldest or biggest version of an image.",
      file: null, paste: "https://tineye.com/", // TinEye refuses uploads sent from other sites
      url: (u) => open(`https://tineye.com/search?url=${encodeURIComponent(u)}`) },

    { group: "anime", name: "SauceNAO", icon: "S", cats: ["anime", "art", "adult"], adult: true,
      desc: "Anime, manga, doujinshi, Pixiv, Twitter art and boorus. NSFW included.",
      file: (img) => post("https://saucenao.com/search.php", { file: img.file }),
      url: (u) => open(`https://saucenao.com/search.php?url=${encodeURIComponent(u)}`) },
    { group: "anime", name: "IQDB", icon: "IQ", cats: ["anime", "art", "adult"], adult: true,
      desc: "Searches Danbooru, Gelbooru, Yande.re and other boorus for the source post.",
      file: (img) => post("https://iqdb.org/", { file: img.file }),
      url: (u) => open(`https://iqdb.org/?url=${encodeURIComponent(u)}`) },
    { group: "anime", name: "ASCII2D", icon: "A2", cats: ["anime", "art"],
      desc: "Japanese art search: finds the Pixiv or Twitter artist behind an illustration.",
      file: null, paste: "https://ascii2d.net/", pasteNote: "use its file button",
      url: (u) => open(`https://ascii2d.net/search/url/${encodeURIComponent(u)}`) },
    { group: "anime", name: "trace.moe", icon: "TM", cats: ["anime"],
      desc: "Names the anime, episode and exact second from a screenshot. Also runs below.",
      file: () => traceSearch(),
      url: (u) => open(`https://trace.moe/?url=${encodeURIComponent(u)}`) },

    { group: "adult", name: "E-Hentai", icon: "EH", cats: ["anime", "adult"], adult: true,
      desc: "Finds the adult manga or doujinshi gallery a page comes from.",
      file: (img) => post("https://upld.e-hentai.org/image_lookup.php", { sfile: img.file, f_sfile: "File Search", fs_similar: "on", fs_covers: "on" }),
      url: null }
  ];
  const GROUPS = [
    { id: "web", title: "Photos & web", note: "people's posts, products, memes, wallpapers" },
    { id: "anime", title: "Anime, manga & art", note: "artists, boorus, episodes, chapters" },
    { id: "adult", title: "18+ only", note: "adult manga & doujinshi" }
  ];

  /* ── state: either a file or a link ─────────────────────── */
  let current = null; // { kind: "file", file, base64, name } | { kind: "url", url }

  const toast = (msg, ms = 2400) => {
    const t = $("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms);
  };
  const open = (href) => { window.open(href, "_blank", "noopener"); };

  // Submit a hidden multipart form in a new tab. Files go in a real <input type=file>.
  const post = (action, fields) => {
    const f = document.createElement("form");
    f.method = "POST"; f.action = action; f.target = "_blank"; f.enctype = "multipart/form-data";
    f.setAttribute("rel", "noopener noreferrer"); f.hidden = true;
    for (const [name, value] of Object.entries(fields)) {
      const input = document.createElement("input");
      input.name = name;
      if (value instanceof Blob) {
        input.type = "file";
        const dt = new DataTransfer();
        dt.items.add(value instanceof File ? value : new File([value], "image.jpg", { type: value.type || "image/jpeg" }));
        input.files = dt.files;
      } else { input.type = "hidden"; input.value = value; }
      f.appendChild(input);
    }
    document.body.appendChild(f); f.submit(); setTimeout(() => f.remove(), 1000);
  };

  // Big photos get shrunk (engines cap uploads around 8–20 MB) and re-encoded as JPEG.
  const prepare = (file) => new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => {
      const max = 2400, w = im.naturalWidth, h = im.naturalHeight;
      const tooBig = file.size > 4.5 * 1024 * 1024 || Math.max(w, h) > max || !/^image\/(jpeg|png|webp|gif)$/.test(file.type);
      let out = file;
      const c = document.createElement("canvas"), s = Math.min(1, max / Math.max(w, h));
      c.width = Math.round(w * s); c.height = Math.round(h * s);
      c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
      // Bing wants base64 of a smaller JPEG; make it from the canvas.
      const small = document.createElement("canvas"), s2 = Math.min(1, 1200 / Math.max(w, h));
      small.width = Math.round(w * s2); small.height = Math.round(h * s2);
      small.getContext("2d").drawImage(im, 0, 0, small.width, small.height);
      const base64 = small.toDataURL("image/jpeg", .88).split(",")[1];
      const finish = (blob) => resolve({ kind: "file", file: blob, base64, name: file.name || "pasted image", w, h, src: url });
      if (tooBig) c.toBlob((b) => finish(new File([b], (file.name || "image").replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" })), "image/jpeg", .9);
      else finish(out);
    };
    im.onerror = () => { URL.revokeObjectURL(url); reject(new Error("not an image")); };
    im.src = url;
  });

  const setFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return toast("That isn't an image");
    try { current = await prepare(file); } catch { return toast("That image couldn't be opened"); }
    $("preview").src = current.src; $("preview").hidden = false; $("empty").hidden = true;
    $("metaText").textContent = `${current.name} · ${current.w}×${current.h} · ${(current.file.size / 1024 / 1024).toFixed(1)} MB`;
    $("meta").hidden = false; $("url").value = "";
    refresh(); clearTrace();
  };
  const setUrl = (u) => {
    u = u.trim();
    if (!/^https?:\/\/\S+$/i.test(u)) return toast("Paste a full link that starts with http");
    current = { kind: "url", url: u };
    $("preview").src = u; $("preview").hidden = false; $("empty").hidden = true;
    $("preview").onerror = () => { $("metaText").textContent = "link set (the site blocks previews, search still works)"; };
    $("metaText").textContent = u.replace(/^https?:\/\//, "").slice(0, 60);
    $("meta").hidden = false;
    refresh(); clearTrace();
  };
  const clearAll = () => {
    current = null; $("preview").hidden = true; $("preview").removeAttribute("src"); $("empty").hidden = false;
    $("meta").hidden = true; $("url").value = ""; refresh(); clearTrace();
  };

  // Copy the current image to the clipboard as PNG (the format every browser accepts).
  const copyImage = () => {
    if (!navigator.clipboard?.write || !window.ClipboardItem) return Promise.resolve(false);
    const png = new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => {
        const c = document.createElement("canvas"); c.width = im.naturalWidth; c.height = im.naturalHeight;
        c.getContext("2d").drawImage(im, 0, 0);
        c.toBlob((b) => (b ? resolve(b) : reject()), "image/png");
      };
      im.onerror = reject;
      im.src = current.src;
    });
    // The ClipboardItem is created right away (inside the click) so Safari allows it.
    return navigator.clipboard.write([new ClipboardItem({ "image/png": png })]).then(() => true, () => false);
  };

  /* ── input wiring ──────────────────────────────────────── */
  const drop = $("drop");
  drop.addEventListener("click", () => $("file").click());
  drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); $("file").click(); } });
  $("file").addEventListener("change", (e) => { setFile(e.target.files[0]); e.target.value = ""; });
  addEventListener("dragover", (e) => { e.preventDefault(); drop.classList.add("over"); });
  addEventListener("dragleave", (e) => { if (!e.relatedTarget) drop.classList.remove("over"); });
  addEventListener("drop", (e) => {
    e.preventDefault(); drop.classList.remove("over");
    const f = [...(e.dataTransfer?.files || [])].find((x) => x.type.startsWith("image/"));
    if (f) return setFile(f);
    const link = e.dataTransfer?.getData("text/uri-list") || e.dataTransfer?.getData("text/plain");
    if (link) setUrl(link.split("\n")[0]);
  });
  addEventListener("paste", (e) => {
    if (e.target === $("url")) return;
    const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
    if (item) { e.preventDefault(); setFile(item.getAsFile()); return; }
    const text = e.clipboardData?.getData("text/plain");
    if (text && /^https?:\/\//i.test(text.trim())) { e.preventDefault(); setUrl(text); }
  });
  $("useUrl").addEventListener("click", () => setUrl($("url").value));
  $("url").addEventListener("keydown", (e) => { if (e.key === "Enter") setUrl($("url").value); });
  $("clear").addEventListener("click", (e) => { e.stopPropagation(); clearAll(); });

  /* ── engine buttons ────────────────────────────────────── */
  let filter = "all";
  const render = () => {
    const wrap = $("groups"); wrap.innerHTML = "";
    for (const g of GROUPS) {
      const shown = ENGINES.filter((e) => (filter === "all" ? e.group === g.id : e.cats.includes(filter) && e.group === g.id));
      if (!shown.length) continue;
      const sec = document.createElement("section"); sec.className = "group";
      sec.innerHTML = `<h3>${g.title} <small>${g.note}</small></h3><div class="engines"></div>`;
      const grid = sec.querySelector(".engines");
      for (const e of shown) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "engine"; b.dataset.name = e.name;
        const mode = e.file && e.url ? "file + link" : e.file ? "file only" : e.paste ? "link · or paste" : "link only";
        b.innerHTML = `<i>${e.icon}</i><strong>${e.name}</strong><span>${e.desc}</span><em class="why"></em>
          <b class="badge ${e.adult ? "adult" : ""}">${e.adult ? "18+ ok · " : ""}${mode}</b>`;
        b.addEventListener("click", () => run(e));
        grid.appendChild(b);
      }
      wrap.appendChild(sec);
    }
    refresh();
  };
  const refresh = () => {
    for (const b of document.querySelectorAll(".engine")) {
      const e = ENGINES.find((x) => x.name === b.dataset.name), why = b.querySelector(".why");
      let reason = "";
      if (current?.kind === "file" && !e.file) reason = e.pasteNote ? `copies your image, then ${e.pasteNote} there` : "copies your image — press Ctrl+V on the page that opens";
      if (current?.kind === "url" && !e.url) reason = "needs the image file — download it, then drop it here";
      why.textContent = reason;
      b.disabled = current?.kind === "url" && !e.url;
    }
  };
  const run = (e) => {
    if (!current) { toast("Drop or paste an image first"); drop.focus(); return; }
    if (current.kind === "url") return e.url(current.url);
    if (e.file) { e.file(current); if (e.name !== "trace.moe") toast(`Opening ${e.name}…`); return; }
    // Engines that refuse uploads from other sites: put the image on the clipboard,
    // open the engine, and let the visitor paste it there (Ctrl+V / ⌘V).
    copyImage().then((ok) => toast(ok
      ? (e.pasteNote ? `Image copied — on ${e.name}, ${e.pasteNote}` : `Image copied — press Ctrl+V on ${e.name}`)
      : `Couldn't copy — save the image and upload it on ${e.name}`, 5000));
    open(e.paste);
  };
  $("filters").addEventListener("click", (ev) => {
    const c = ev.target.closest(".chip"); if (!c) return;
    filter = c.dataset.f;
    for (const x of $("filters").children) x.classList.toggle("on", x === c);
    render();
  });

  /* ── trace.moe, inline ─────────────────────────────────── */
  const clearTrace = () => { $("traceStatus").textContent = ""; $("traceResults").innerHTML = ""; };
  const ts = (s) => { s = Math.max(0, Math.floor(s)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  async function traceSearch() {
    if (!current) { toast("Drop or paste an image first"); return; }
    $("trace").scrollIntoView({ behavior: "smooth", block: "nearest" });
    $("traceStatus").textContent = "Searching trace.moe…"; $("traceResults").innerHTML = "";
    const base = "https://api.trace.moe/search?anilistInfo&cutBorders";
    let res;
    try {
      res = current.kind === "url"
        ? await fetch(`${base}&url=${encodeURIComponent(current.url)}`)
        : await fetch(base, { method: "POST", body: current.file, headers: { "Content-Type": current.file.type || "image/jpeg" } });
    } catch { $("traceStatus").textContent = "Couldn't reach trace.moe. Check your connection and try again."; return; }
    if (res.status === 402 || res.status === 429) { $("traceStatus").textContent = "trace.moe's free limit is used up for now. Try again in a minute."; return; }
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.error) { $("traceStatus").textContent = `trace.moe said: ${data.error || res.status}`; return; }
    const hits = (data.result || []).slice(0, 5);
    if (!hits.length) { $("traceStatus").textContent = "No matches. This works best on screenshots of anime (not fan art or manga)."; return; }
    const best = hits[0].similarity;
    $("traceStatus").textContent = best >= .89 ? "Found it. Best match first." : "Low similarity: probably not from an anime. Try SauceNAO or Google Lens instead.";
    $("traceResults").innerHTML = hits.map((h) => {
      const a = h.anilist || {}, t = a.title || {};
      const title = t.english || t.romaji || t.native || h.filename;
      const adult = a.isAdult;
      return `<a class="hit" href="https://anilist.co/anime/${esc(a.id)}" target="_blank" rel="noopener noreferrer">
        <img src="${esc(h.image)}&size=m" alt="" loading="lazy" ${adult ? 'style="filter:blur(14px)" data-adult="1" title="18+ — click the picture to show"' : ""} />
        <span><strong>${esc(title)}</strong><em>${t.native && t.native !== title ? esc(t.native) + " · " : ""}episode ${esc(h.episode ?? "?")} · at ${ts(h.from)}${adult ? " · 18+" : ""}</em>
        <span class="sim">${(h.similarity * 100).toFixed(1)}% match</span></span></a>`;
    }).join("");
    for (const img of $("traceResults").querySelectorAll("img[data-adult]")) {
      img.addEventListener("click", (ev) => { if (img.style.filter) { ev.preventDefault(); img.style.filter = ""; } });
    }
  }
  $("traceBtn").addEventListener("click", traceSearch);

  render();
})();
