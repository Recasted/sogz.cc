const config = window.ARCHIVE_CONFIG;
const scene = document.querySelector("#scene");
const field = document.querySelector("#cardField");
const picker = document.querySelector("#backgroundPicker");
const storageKey = "interactive-archive-layout-v1";
let savedLayout = readLayout();
let topLayer = 20;
const cardStates = [];

document.title = `${config.name} — archive`;
document.querySelector("[data-name]").textContent = config.name;
document.querySelector("[data-quote]").textContent = config.quote;
document.querySelector("[data-main-image]").src = config.mainImage;
document.querySelector("#backgroundImage").style.setProperty("--scene-image", `url("${config.backgroundImage}")`);

document.querySelector("#profileLinks").innerHTML = config.links.map((link) =>
  `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label}</a>`
).join("");

config.cards.forEach((card, index) => createCard(card, index));

function createCard(card, index) {
  const saved = savedLayout[index];
  const state = saved || { x: card.x, y: card.y, rotation: card.rotation };
  cardStates[index] = state;
  const element = document.createElement("article");
  element.className = "profile-card";
  element.dataset.index = index;
  element.style.setProperty("--x", `${state.x}%`);
  element.style.setProperty("--y", `${state.y}%`);
  element.style.setProperty("--rotation", `${state.rotation}deg`);
  element.innerHTML = `
    <span class="card-index">0${index + 1}</span>
    <div class="card-photo"><img src="${card.image}" alt="${card.title}" draggable="false"></div>
    <strong class="card-title">${card.title}</strong>
    <span class="card-subtitle">${card.subtitle}</span>
  `;
  field.appendChild(element);
  makeDraggable(element, state);
}

function makeDraggable(element, state) {
  let pointerId;
  let startX;
  let startY;
  let originX;
  let originY;
  let moved = false;

  element.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    originX = state.x;
    originY = state.y;
    moved = false;
    element.setPointerCapture(pointerId);
    element.classList.add("is-dragging");
    element.style.zIndex = ++topLayer;
  });

  element.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId || !element.hasPointerCapture(pointerId)) return;
    const rect = field.getBoundingClientRect();
    const dx = (event.clientX - startX) / rect.width * 100;
    const dy = (event.clientY - startY) / rect.height * 100;
    if (Math.abs(dx) + Math.abs(dy) > .3) moved = true;
    state.x = clamp(originX + dx, 4, 96);
    state.y = clamp(originY + dy, 7, 93);
    renderCard(element, state);
  });

  const finishDrag = (event) => {
    if (event.pointerId !== pointerId) return;
    element.classList.remove("is-dragging");
    if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId);
    pointerId = undefined;
    if (moved) {
      saveLayout();
      document.querySelector("#help").classList.add("hidden");
    }
  };

  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);
  element.addEventListener("dblclick", () => {
    state.rotation = state.rotation >= 10 ? -12 : state.rotation + 5;
    renderCard(element, state);
    saveLayout();
  });
}

function renderCard(element, state) {
  element.style.setProperty("--x", `${state.x}%`);
  element.style.setProperty("--y", `${state.y}%`);
  element.style.setProperty("--rotation", `${state.rotation}deg`);
}

function currentLayout() {
  return [...document.querySelectorAll(".profile-card")].map((element) => ({
    x: parseFloat(element.style.getPropertyValue("--x")),
    y: parseFloat(element.style.getPropertyValue("--y")),
    rotation: parseFloat(element.style.getPropertyValue("--rotation"))
  }));
}

function saveLayout() {
  localStorage.setItem(storageKey, JSON.stringify(currentLayout()));
}

function readLayout() {
  try { return JSON.parse(localStorage.getItem(storageKey)) || {}; }
  catch { return {}; }
}

function resetLayout() {
  localStorage.removeItem(storageKey);
  [...document.querySelectorAll(".profile-card")].forEach((element, index) => {
    const card = config.cards[index];
    cardStates[index].x = card.x;
    cardStates[index].y = card.y;
    cardStates[index].rotation = card.rotation;
    renderCard(element, cardStates[index]);
  });
  showToast("layout reset");
}

function applyBackground(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    document.querySelector("#backgroundImage").style.setProperty("--scene-image", `url("${reader.result}")`);
    showToast("local background preview changed");
  };
  reader.readAsDataURL(file);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.archiveToast);
  window.archiveToast = setTimeout(() => toast.classList.remove("show"), 1800);
}

function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

document.querySelector("#imageButton").addEventListener("click", () => picker.click());
picker.addEventListener("change", () => applyBackground(picker.files[0]));
document.querySelector("#resetButton").addEventListener("click", resetLayout);
document.querySelector("#returnButton").addEventListener("click", () => history.length > 1 ? history.back() : showToast("this is the beginning"));
document.querySelector("#archiveButton").addEventListener("click", () => showToast("drag the archive cards"));
document.querySelector("#soundButton").addEventListener("click", (event) => {
  event.currentTarget.textContent = event.currentTarget.textContent.includes("off") ? "ambient: unavailable" : "ambient: off";
  showToast("add an audio file in config when ready");
});
