const config = window.ARCHIVE_CONFIG;
const scene = document.querySelector("#scene");
const field = document.querySelector("#cardField");
const picker = document.querySelector("#backgroundPicker");
const audio = document.querySelector("#cardAudio");
const storageKey = "interactive-archive-layout-v4";
const backgroundKey = "interactive-archive-background-v2";
const cardStates = [];
let savedLayout = readLayout();
let topLayer = 20;
let openIndex = null;
let muted = false;
let synth = { context: null, timer: null, nodes: [] };

document.title = "sogz' — archive";
const rememberedBackground = localStorage.getItem(backgroundKey);
setBackground(rememberedBackground || config.backgroundImage);
document.querySelector("#backgroundImage").style.setProperty("--scene-position", config.backgroundPosition || "center");
config.cards.forEach((card, index) => createCard(card, index));

function createCard(card, index) {
  const saved = savedLayout[index];
  const state = saved || { x: card.x, y: card.y, rotation: card.rotation };
  cardStates[index] = state;
  const element = document.createElement("article");
  element.className = "profile-card";
  element.dataset.index = index;
  element.setAttribute("role", "button");
  element.setAttribute("tabindex", "0");
  element.setAttribute("aria-label", `Open ${card.title} card and play its theme`);
  element.style.setProperty("--float-delay", `${index * -.85}s`);
  renderCard(element, state);
  const cardLinks = card.links?.length ? `<nav class="card-socials" aria-label="${card.title} profile links">
    ${card.links.map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`).join("")}
  </nav>` : "";
  element.innerHTML = `<div class="card-inner">
    <span class="card-index">0${index + 1}</span>
    <div class="card-photo"><img src="${card.image}" alt="${card.title}" draggable="false"></div>
    <strong class="card-title">${card.title}</strong>
    <span class="card-subtitle">${card.subtitle}</span>
  </div>${cardLinks}`;
  field.appendChild(element);
  makeInteractive(element, state, card, index);
}

function makeInteractive(element, state, card, index) {
  let pointerId, startX, startY, originX, originY, moved;
  element.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || openIndex !== null) return;
    pointerId = event.pointerId;
    startX = event.clientX; startY = event.clientY;
    originX = state.x; originY = state.y; moved = false;
    element.setPointerCapture(pointerId);
    element.classList.add("is-dragging");
    element.style.zIndex = nextCardLayer();
  });
  element.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId || !element.hasPointerCapture(pointerId)) return;
    const rect = field.getBoundingClientRect();
    const dx = (event.clientX - startX) / rect.width * 100;
    const dy = (event.clientY - startY) / rect.height * 100;
    if (Math.abs(dx) + Math.abs(dy) > .35) moved = true;
    state.x = clamp(originX + dx, 4, 96); state.y = clamp(originY + dy, 7, 93);
    renderCard(element, state);
  });
  const finish = (event) => {
    if (event.pointerId !== pointerId) return;
    element.classList.remove("is-dragging");
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
    pointerId = undefined;
    if (moved) { saveLayout(); document.querySelector("#help").classList.add("hidden"); }
    else openCard(index, card);
  };
  element.addEventListener("pointerup", finish);
  element.addEventListener("pointercancel", finish);
  element.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && openIndex === null) { event.preventDefault(); openCard(index, card); }
  });
}

function openCard(index, card) {
  if (openIndex !== null) return;
  openIndex = index;
  const element = document.querySelector(`.profile-card[data-index="${index}"]`);
  element.style.zIndex = "100";
  element.classList.add("is-open");
  scene.classList.add("card-open");
  playCardMusic(card);
  showToast(`${card.title.toLowerCase()} is playing · click outside to close`);
}

function closeCard() {
  if (openIndex === null) return;
  const element = document.querySelector(`.profile-card[data-index="${openIndex}"]`);
  element.classList.remove("is-open");
  element.style.zIndex = nextCardLayer();
  scene.classList.remove("card-open");
  openIndex = null;
}

async function playCardMusic(card) {
  stopSound();
  if (card.audio) {
    audio.src = card.audio; audio.volume = muted ? 0 : .55;
    try { await audio.play(); } catch { showToast("tap once more to allow audio"); }
  } else {
    playSynthTheme(card.theme);
  }
  updateSoundLabel();
}

function playSynthTheme(name) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const themes = {
    pulse: [110, 138.59, 164.81, 138.59, 196, 164.81],
    glass: [261.63, 329.63, 392, 523.25, 392, 329.63],
    void: [82.41, 98, 123.47, 92.5, 110, 73.42],
    dream: [174.61, 220, 261.63, 329.63, 293.66, 220]
  };
  const notes = themes[name] || themes.dream;
  synth.context = new AudioCtx();
  let step = 0;
  const tick = () => {
    if (!synth.context || muted) return;
    const now = synth.context.currentTime;
    const osc = synth.context.createOscillator();
    const gain = synth.context.createGain();
    osc.type = name === "pulse" ? "triangle" : "sine";
    osc.frequency.value = notes[step++ % notes.length];
    gain.gain.setValueAtTime(.0001, now);
    gain.gain.exponentialRampToValueAtTime(.055, now + .08);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .72);
    osc.connect(gain).connect(synth.context.destination);
    osc.start(now); osc.stop(now + .75);
    synth.nodes.push(osc);
  };
  tick(); synth.timer = setInterval(tick, 520);
}

function stopSound() {
  audio.pause(); audio.removeAttribute("src");
  clearInterval(synth.timer); synth.timer = null;
  synth.nodes.forEach((node) => { try { node.stop(); } catch {} }); synth.nodes = [];
  if (synth.context) { synth.context.close(); synth.context = null; }
}

function toggleMute() {
  muted = !muted; audio.volume = muted ? 0 : .55;
  if (synth.context) muted ? synth.context.suspend() : synth.context.resume();
  updateSoundLabel();
}

function updateSoundLabel() {
  document.querySelector("#soundButton").textContent = muted ? "music: muted" : (openIndex === null ? "music: choose a card" : "music: playing");
}

function renderCard(element, state) {
  element.style.setProperty("--x", `${state.x}%`); element.style.setProperty("--y", `${state.y}%`);
  element.style.setProperty("--rotation", `${state.rotation}deg`);
}

function currentLayout() {
  return [...document.querySelectorAll(".profile-card")].map((element) => ({
    x: parseFloat(element.style.getPropertyValue("--x")), y: parseFloat(element.style.getPropertyValue("--y")),
    rotation: parseFloat(element.style.getPropertyValue("--rotation"))
  }));
}
function saveLayout() { localStorage.setItem(storageKey, JSON.stringify(currentLayout())); }
function readLayout() { try { return JSON.parse(localStorage.getItem(storageKey)) || {}; } catch { return {}; } }
function resetLayout() {
  localStorage.removeItem(storageKey);
  [...document.querySelectorAll(".profile-card")].forEach((element, index) => {
    Object.assign(cardStates[index], { x: config.cards[index].x, y: config.cards[index].y, rotation: config.cards[index].rotation });
    renderCard(element, cardStates[index]);
  });
  showToast("layout reset");
}

function setBackground(value) {
  const image = value.startsWith("data:") ? value : value;
  document.querySelector("#backgroundImage").style.setProperty("--scene-image", `url("${image}")`);
}

function applyBackground(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1800 / image.width, 1800 / image.height);
      canvas.width = Math.round(image.width * scale); canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      const data = canvas.toDataURL("image/jpeg", .78);
      setBackground(data);
      try { localStorage.setItem(backgroundKey, data); showToast("background remembered on this device"); }
      catch { showToast("background changed, but was too large to remember"); }
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function showToast(message) {
  const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.add("show");
  clearTimeout(window.archiveToast); window.archiveToast = setTimeout(() => toast.classList.remove("show"), 2200);
}
function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
function nextCardLayer() {
  topLayer = topLayer >= 60 ? 21 : topLayer + 1;
  return String(topLayer);
}

document.addEventListener("pointermove", (event) => {
  const cursor = document.querySelector("#plusCursor"); cursor.style.left = `${event.clientX}px`; cursor.style.top = `${event.clientY}px`;
});
document.querySelector("#focusOverlay").addEventListener("click", closeCard);
document.querySelector("#imageButton").addEventListener("click", () => picker.click());
picker.addEventListener("change", () => applyBackground(picker.files[0]));
document.querySelector("#resetButton").addEventListener("click", resetLayout);
document.querySelector("#returnButton").addEventListener("click", closeCard);
document.querySelector("#archiveButton").addEventListener("click", () => showToast("four playable archive cards"));
document.querySelector("#soundButton").addEventListener("click", toggleMute);
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeCard(); });
