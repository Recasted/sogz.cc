// Home page only: the lantern that follows the cursor and the ASCII static it reveals.
(() => {
  const scene = document.querySelector("#scene");
  const canvas = document.querySelector("#staticField");
  if (!scene || !canvas) return;
  const ctx = canvas.getContext("2d");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;

  // Lantern position, eased so it drifts behind the cursor.
  let tx = innerWidth * .5, ty = innerHeight * .42, x = tx, y = ty;
  const setVars = () => {
    scene.style.setProperty("--mx", x.toFixed(1) + "px");
    scene.style.setProperty("--my", y.toFixed(1) + "px");
  };
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; }, { passive: true });
  if (touch) {
    // No hover on phones: the light wanders by itself.
    let t = 0;
    setInterval(() => { t += .006; tx = innerWidth * (.5 + Math.sin(t * 1.3) * .3); ty = innerHeight * (.45 + Math.cos(t) * .2); }, 50);
  }

  // ASCII static grid.
  const GLYPHS = "·.:;-~=+*/\\|░▒01SOGZ'#%&?¿";
  const CELL_W = 11, CELL_H = 15;
  let cols = 0, rows = 0, grid = [];
  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + "px"; canvas.style.height = innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(innerWidth / CELL_W); rows = Math.ceil(innerHeight / CELL_H);
    grid = Array.from({ length: cols * rows }, () => Math.random() < .55 ? -1 : Math.floor(Math.random() * GLYPHS.length));
    drawAll();
  };
  ctx.textBaseline = "top";
  const drawCell = (i) => {
    const cx = (i % cols) * CELL_W, cy = Math.floor(i / cols) * CELL_H;
    ctx.clearRect(cx, cy, CELL_W, CELL_H);
    const g = grid[i]; if (g < 0) return;
    const hot = (g * 7 + i) % 23 === 0;
    ctx.fillStyle = hot ? "rgba(190,22,32,.9)" : "rgba(214,207,196,.55)";
    ctx.font = "12px Consolas, 'Cascadia Mono', Menlo, monospace";
    ctx.fillText(GLYPHS[g], cx + 2, cy + 1);
  };
  const drawAll = () => { ctx.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < grid.length; i++) drawCell(i); };
  addEventListener("resize", resize);
  resize();

  let last = 0;
  const frame = (now) => {
    x += (tx - x) * .09; y += (ty - y) * .09;
    setVars();
    if (!calm && now - last > 70) {
      last = now;
      for (let k = 0; k < 40; k++) {
        const i = Math.floor(Math.random() * grid.length);
        grid[i] = Math.random() < .55 ? -1 : Math.floor(Math.random() * GLYPHS.length);
        drawCell(i);
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

  // Rarely the wordmark loses signal for a moment.
  const mark = document.querySelector(".wordmark");
  if (mark && !calm) {
    const glitch = () => {
      mark.classList.add("is-glitching");
      setTimeout(() => mark.classList.remove("is-glitching"), 160 + Math.random() * 260);
      setTimeout(glitch, 4000 + Math.random() * 9000);
    };
    setTimeout(glitch, 3000);
  }
})();
