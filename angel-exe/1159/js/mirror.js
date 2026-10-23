/*
  mirror.js (page code) - runs the terminal on the hidden site.

  You usually don't need to edit this file. The words, files and logs
  are all in data/mirror.js, and the colours in css/mirror.css.
  The drawing of page 12 is saved in the player's own browser
  (localStorage "angelexe.page12"), and Theo's Glass Wings page on
  Starlit shows it in place of the missing page.
*/

var PAGE12_KEY = "angelexe.page12";
var TYPE_SPEED = 18;   // milliseconds per letter when the computer "types"

/* ---------- helpers ---------- */
var D = window.MIRROR;
function $(s) { return document.querySelector(s); }
function el(tag, cls, text) {
  var n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function load(key, fallback) {
  try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
}
function save(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
}
function guest() { return load("angelexe.guest", null); }
function playerName() { var g = guest(); return g && g.name ? g.name : "you"; }
function pad(n) { return (n < 10 ? "0" : "") + n; }
function nowText() {
  var d = new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes());
}
function fill(text) { return String(text).replace(/\{player\}/g, playerName()).replace(/\{now\}/g, nowText()); }
var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- the screen ---------- */
var screen, input, queue = [], typing = false, waitingFor = null, hurry = false;

// Adds lines to the screen, typed out one letter at a time.
function say(lines, cls) {
  (Array.isArray(lines) ? lines : String(lines).split("\n")).forEach(function (l) { queue.push({ text: fill(l), cls: cls }); });
  if (!typing) nextLine();
}
function nextLine() {
  var item = queue.shift();
  if (!item) { typing = false; hurry = false; input.focus(); return; }
  if (item.clear) { screen.innerHTML = ""; setTimeout(nextLine, 0); return; }
  typing = true;
  var cls = item.cls || (/^##/.test(item.text) ? "dim" : "");
  var line = el("div", "line " + cls);
  screen.appendChild(line);
  var text = item.text.replace(/^##\s?/, "");
  if (reducedMotion || hurry || item.instant || !text) { line.textContent = text || " "; scrollDown(); setTimeout(nextLine, 10); return; }
  var i = 0;
  (function tick() {
    i = hurry ? text.length : i + 1;
    line.textContent = text.slice(0, i);
    scrollDown();
    if (i < text.length) setTimeout(tick, TYPE_SPEED);
    else setTimeout(nextLine, 60);
  })();
}
function scrollDown() { window.scrollTo(0, document.body.scrollHeight); }
// What the player typed. It waits its turn, so it never lands in the middle of a reply.
function echo(cmd) {
  queue.push({ text: "> " + cmd, cls: "cmd", instant: true });
  if (typing) hurry = true; else nextLine();
}
function clearScreen() { queue.push({ clear: true }); if (!typing) nextLine(); }

/* ---------- files ---------- */
function findFile(name) {
  name = String(name || "").replace(/^\.\//, "").trim();
  var hits = D.FILES.filter(function (f) { return f.path === name || f.path.split("/").pop() === name; });
  return hits[0] || null;
}
function unlocked() { return load("angelexe.mirror.unlocked", []); }
function passwordMatches(typed, real) {
  var t = String(typed).trim().toLowerCase(), digits = t.replace(/\D/g, "");
  if (t === String(real).toLowerCase() || digits === String(real)) return true;
  // yyyymmdd typed for an mmddyyyy password
  return digits.length === 8 && /^(19|20)/.test(digits) && digits.slice(4) + digits.slice(0, 4) === String(real);
}
function openFile(name) {
  var f = findFile(name);
  if (!name) { say("open what?"); return; }
  if (!f) { say("no file called " + name + ". (try ls)"); return; }
  if (f.draw) { openDrawing(); return; }
  if (f.sealed && unlocked().indexOf(f.path) === -1) {
    say(["this file is locked.", "password:"]);
    waitingFor = function (typed) {
      if (passwordMatches(typed, f.sealed)) {
        var u = unlocked(); u.push(f.path); save("angelexe.mirror.unlocked", u);
        say("", ""); say(f.text);
      } else say("no. that isn't the night.");
    };
    return;
  }
  say(f.text);
}
function listFiles(all) {
  var out = D.FILES.filter(function (f) { return all || !f.hidden; }).map(function (f) {
    return (f.sealed && unlocked().indexOf(f.path) === -1 ? "[locked] " : "         ") + f.path;
  });
  say(out);
}

/* ---------- commands ---------- */
var COMMANDS = {
  help: function () { say(D.HELP); },
  ls: function (arg) { listFiles(arg === "-a" || arg === "-la"); },
  dir: function (arg) { listFiles(arg === "/a"); },
  open: openFile, cat: openFile, read: openFile, type: openFile,
  who: function () {
    var lines = D.WHO.map(function (w) { return (w.name + "        ").slice(0, 10) + w.line + "    " + w.when; });
    var d = new Date(), months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    lines.push((playerName() + "        ").slice(0, 10) + "tty6    " + months[d.getMonth()] + " " + d.getDate() + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()));
    lines.push("", "## 6 users. there were only ever 5.");
    say(lines);
  },
  whoami: function () {
    var g = guest();
    if (!g) { say(["you haven't told anyone your name yet.", "that's ok. you can pick one on any of the other sites."]); return; }
    var mine = load("angelexe.pending", []);
    var lines = [g.name + ".", ""];
    if (!mine.length) lines.push("you haven't said anything yet. you can. everywhere.");
    else {
      lines.push("you said:");
      mine.slice(-3).forEach(function (c) { lines.push("  \"" + String(c.text).slice(0, 80) + "\""); });
      lines.push("", "## the internet keeps a copy.");
    }
    say(lines);
  },
  time: function () {
    var d = new Date();
    say(["there: " + pad(d.getHours()) + ":" + pad(d.getMinutes()), "here:  23:59"]);
  },
  date: function () { COMMANDS.time(); },
  clear: clearScreen,
  cls: clearScreen
};

function run(raw) {
  var cmd = raw.trim();
  if (waitingFor) { echo(new Array(cmd.length + 1).join("*")); var w = waitingFor; waitingFor = null; w(cmd); return; }
  echo(cmd);
  if (!cmd) return;
  var lower = cmd.toLowerCase();
  if (lower === "ls -a" || lower === "ls -la") { listFiles(true); return; }
  if (Object.prototype.hasOwnProperty.call(D.WORDS, lower) && D.WORDS[lower]) { say(D.WORDS[lower]); return; }
  var parts = cmd.split(/\s+/), name = parts[0].toLowerCase(), rest = parts.slice(1).join(" ");
  if (COMMANDS[name]) { COMMANDS[name](rest); return; }
  if (findFile(cmd)) { openFile(cmd); return; }
  say(["" + cmd + ": not found", "## (try help)"]);
}

/* ---------- page 12: the drawing ---------- */
function openDrawing() {
  var box = $("#drawBox");
  box.hidden = false;
  var canvas = $("#page12"), ctx = canvas.getContext("2d");
  var saved = load(PAGE12_KEY, null);
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  if (saved && saved.image) { var img = new Image(); img.onload = function () { ctx.drawImage(img, 0, 0); }; img.src = saved.image; }
  say(saved ? ["page 12. you drew this already. you can draw it again."] : ["page 12.", "## a. never wrote it. t. never drew it.", "## you know how it ends."]);
}
function setupDrawing() {
  var canvas = $("#page12"), ctx = canvas.getContext("2d"), drawing = false, last = null, size = 3, colour = "#000";
  function pos(e) {
    var r = canvas.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * canvas.width / r.width, y: (p.clientY - r.top) * canvas.height / r.height };
  }
  function start(e) { e.preventDefault(); drawing = true; last = pos(e); }
  function move(e) {
    if (!drawing) return;
    e.preventDefault();
    var p = pos(e);
    ctx.strokeStyle = colour; ctx.lineWidth = size; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p;
  }
  function stop() { drawing = false; }
  canvas.addEventListener("mousedown", start); canvas.addEventListener("mousemove", move);
  window.addEventListener("mouseup", stop);
  canvas.addEventListener("touchstart", start, { passive: false }); canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", stop);

  $("#penBtn").addEventListener("click", function () { colour = "#000"; size = 3; });
  $("#thickBtn").addEventListener("click", function () { colour = "#000"; size = 9; });
  $("#eraseBtn").addEventListener("click", function () { colour = "#fff"; size = 16; });
  $("#wipeBtn").addEventListener("click", function () {
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000"; ctx.lineWidth = 3; ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);
  });
  $("#saveBtn").addEventListener("click", function () {
    var ok = save(PAGE12_KEY, { image: canvas.toDataURL("image/png"), by: playerName(), date: nowText() });
    $("#drawBox").hidden = true;
    say(ok ? ["saved.", "", "12 of 12.", "the comic is finished.", "", "## thank you, {player}."] : ["couldn't save. (your browser won't let this site keep things.)"]);
  });
  $("#closeBtn").addEventListener("click", function () { $("#drawBox").hidden = true; say("## page 12 is still blank."); input.focus(); });
}

/* ---------- start ---------- */
document.addEventListener("DOMContentLoaded", function () {
  screen = $("#screen"); input = $("#cmd");
  $("#prompt").addEventListener("submit", function (e) { e.preventDefault(); var v = input.value; input.value = ""; run(v); });
  document.addEventListener("click", function (e) { if (!$("#drawBox").contains(e.target)) input.focus(); });
  setupDrawing();
  var d = new Date();
  say(D.BOOT);
  if (d.getHours() === 23 && d.getMinutes() === 59) say(D.BOOT_1159);
});
