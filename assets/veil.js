// sogz' veil — grain, vignette and the occasional whisper on every page.
// Include with: <script src="../assets/veil.js" defer></script>
// Set <html data-veil="chrome"> on editors to skip the noise over the canvas.
(() => {
  if (window.__sogzVeil) return;
  window.__sogzVeil = true;

  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const layer = (cls) => {
    const el = document.createElement("div");
    el.className = "veil-layer " + cls;
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
    return el;
  };
  layer("veil-vignette");
  layer("veil-scan");
  layer("veil-grain");

  // Small, rare messages that fade in somewhere near the edges and leave.
  const WHISPERS = [
    "are you still there", "it remembers you", "don't look back", "you were here before",
    "0x5 0x0 0x6 0x7", "nothing is deleted", "the light is lower now", "who let you in",
    "11:59", "keep scrolling", "it's quieter here", "you left something", "s o g z", "▚▞▚▞▚"
  ];
  const whisper = () => {
    if (document.hidden) return;
    const p = document.createElement("p");
    p.className = "veil-whisper";
    p.setAttribute("aria-hidden", "true");
    p.textContent = WHISPERS[Math.floor(Math.random() * WHISPERS.length)];
    const edge = Math.random();
    const x = edge < .5 ? 3 + Math.random() * 25 : 62 + Math.random() * 25;
    const y = Math.random() < .5 ? 6 + Math.random() * 18 : 70 + Math.random() * 20;
    p.style.left = x + "vw";
    p.style.top = y + "vh";
    if (Math.random() < .3) p.style.writingMode = "vertical-rl";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 4400);
  };
  if (!calm) {
    const loop = () => setTimeout(() => { whisper(); loop(); }, 22000 + Math.random() * 30000);
    setTimeout(whisper, 6000 + Math.random() * 6000);
    loop();
  }

  // The tab notices when you leave.
  let title = document.title;
  const AWAY = ["come back…", "…still here", "(っ- ‸ – ς)", "▚ sogz' ▞"];
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { title = document.title; document.title = AWAY[Math.floor(Math.random() * AWAY.length)]; }
    else document.title = title;
  });

  if (!root.dataset.veilQuiet) {
    console.log("%c sogz' %c you opened the console. it noticed.", "background:#7d0810;color:#fff;padding:2px 6px", "color:#b3121c");
    root.dataset.veilQuiet = "1";
  }
})();
