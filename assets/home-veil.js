// Home page only: the lantern that follows the cursor, the ASCII static it reveals,
// plus the small page behaviours (nav background, fade-ins, card glow).
(() => {
  const scene = document.querySelector("#scene");
  const canvas = document.querySelector("#staticField");
  const lens = document.querySelector("#staticLens");
  const lantern = scene && scene.querySelector(".lantern");
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touch = matchMedia("(pointer: coarse)").matches;

  /* ── page bits ─────────────────────────────────────────── */
  const nav = document.querySelector("#siteNav");
  const onScroll = () => nav && nav.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Sections fade up as they come into view.
  const reveals = document.querySelectorAll(".reveal");
  if (calm || !("IntersectionObserver" in window)) reveals.forEach((el) => el.classList.add("shown"));
  else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
    }, { rootMargin: "0px 0px -8% 0px" });
    reveals.forEach((el) => io.observe(el));
  }

  // A soft red light follows the mouse inside project cards (only the hovered card changes).
  document.querySelectorAll(".work-card, .service").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--px", `${e.clientX - r.left}px`);
      card.style.setProperty("--py", `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  // The plus cursor only belongs to the hero; below it you get your normal cursor.
  const plus = document.querySelector("#plusCursor");
  addEventListener("pointermove", (e) => {
    if (!plus) return;
    const inHero = !!e.target.closest?.("#scene") && !e.target.closest?.("#siteNav");
    plus.classList.toggle("off", !inHero);
  }, { passive: true });

  if (!scene || !canvas || !lens || !lantern) return;
  const ctx = canvas.getContext("2d");

  /* ── lantern + static (hero) ──────────────────────────── */
  // Positions are in scene coordinates (the hero starts at the top of the page).
  let W = scene.clientWidth, H = scene.clientHeight;
  let tx = W * .7, ty = H * .45, x = tx, y = ty;
  // Only transforms change here: no style recalc, no repaint, just the GPU sliding layers.
  const LENS = 240;
  let drawnX = NaN, drawnY = NaN;
  const place = () => {
    if (Math.abs(x - drawnX) < .25 && Math.abs(y - drawnY) < .25) return; // settled: do nothing
    drawnX = x; drawnY = y;
    lantern.style.transform = `translate3d(${x - W}px, ${y - H}px, 0)`;
    lens.style.transform = `translate3d(${x - LENS}px, ${y - LENS}px, 0)`;
    canvas.style.transform = `translate3d(${LENS - x}px, ${LENS - y}px, 0)`;
  };
  addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY + scrollY; }, { passive: true });
  if (touch) {
    // No hover on phones: the light wanders by itself.
    let t = 0;
    setInterval(() => { if (!heroVisible) return; t += .006; tx = W * (.5 + Math.sin(t * 1.3) * .3); ty = H * (.5 + Math.cos(t) * .25); }, 50);
  }

  // ASCII static grid.
  const GLYPHS = "·.:;-~=+*/\\|░▒01SOGZ'#%&?¿";
  const CELL_W = 11, CELL_H = 15;
  let cols = 0, rows = 0, grid = [];
  const resize = () => {
    W = scene.clientWidth; H = scene.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = "12px Consolas, 'Cascadia Mono', Menlo, monospace"; // set once; resizing the canvas resets it
    ctx.textBaseline = "top";
    drawnX = NaN;
    cols = Math.ceil(W / CELL_W); rows = Math.ceil(H / CELL_H);
    grid = Array.from({ length: cols * rows }, () => Math.random() < .55 ? -1 : Math.floor(Math.random() * GLYPHS.length));
    drawAll();
  };
  const drawCell = (i) => {
    const cx = (i % cols) * CELL_W, cy = Math.floor(i / cols) * CELL_H;
    ctx.clearRect(cx, cy, CELL_W, CELL_H);
    const g = grid[i]; if (g < 0) return;
    const hot = (g * 7 + i) % 23 === 0;
    ctx.fillStyle = hot ? "rgba(190,22,32,.9)" : "rgba(214,207,196,.55)";
    ctx.fillText(GLYPHS[g], cx + 2, cy + 1);
  };
  const drawAll = () => { ctx.clearRect(0, 0, W, H); for (let i = 0; i < grid.length; i++) drawCell(i); };
  addEventListener("resize", resize);
  resize();

  // Stop all hero work once it has scrolled out of view.
  let heroVisible = true, running = false;
  let last = 0;
  const frame = (now) => {
    if (!heroVisible) { running = false; return; }
    x += (tx - x) * .09; y += (ty - y) * .09;
    place();
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
  const start = () => { if (!running) { running = true; requestAnimationFrame(frame); } };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; if (heroVisible) start(); }).observe(scene);
  }
  start();

  // Now and then the headline loses signal for a moment.
  const mark = document.querySelector(".hero-title");
  if (mark && !calm) {
    const glitch = () => {
      if (heroVisible) {
        mark.classList.add("is-glitching");
        setTimeout(() => mark.classList.remove("is-glitching"), 140 + Math.random() * 200);
      }
      setTimeout(glitch, 6000 + Math.random() * 10000);
    };
    setTimeout(glitch, 4000);
  }
})();
