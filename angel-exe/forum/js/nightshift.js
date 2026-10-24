/*
  nightshift.js - builds the nightshift message board from data/forum.js.

  You usually don't need to edit this file. Boards, threads and posts are
  in data/forum.js and the colours are in css/forum.css.
  Pages: index.html (front page), board.html?b=<board id>,
  thread.html?t=<thread id>. lock.html makes password-protected posts.
*/

/* ---------- things you might want to change ---------- */
var BOARD_NAME = "nightshift";
var BOARD_DOMAIN = "nightshift.org";   // made up, shown inside the story only
var FIRST_POST_NUMBER = 40112;         // post numbers count up from here

/* ---------- helpers ---------- */
var F = window.FORUM;
function $(s) { return document.querySelector(s); }
function el(tag, attrs, kids) {
  var n = document.createElement(tag);
  attrs = attrs || {};
  for (var k in attrs) {
    if (k === "text") n.textContent = attrs[k];
    else if (k === "class") n.className = attrs[k];
    else n.setAttribute(k, attrs[k]);
  }
  (kids || []).forEach(function (c) { if (c != null) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
  return n;
}
function param(name) {
  var m = new RegExp("[?&]" + name + "=([^&#]*)").exec(location.search);
  return m ? decodeURIComponent(m[1].replace(/\+/g, " ")) : "";
}
var DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
// "2008-10-22 23:59" -> "10/22/08(Wed)23:59"
function stamp(d) {
  var p = String(d).split(" "), ymd = p[0].split("-");
  var day = new Date(+ymd[0], +ymd[1] - 1, +ymd[2]).getDay();
  return ymd[1] + "/" + ymd[2] + "/" + ymd[0].slice(2) + "(" + DAYS[day] + ")" + (p[1] || "00:00");
}
function board(id) { return F.boards.filter(function (b) { return b.id === id; })[0] || null; }
function thread(id) { return F.threads.filter(function (t) { return t.id === id; })[0] || null; }
function lastPost(t) { return t.posts[t.posts.length - 1]; }
function byBump(a, b) { var x = lastPost(a).date, y = lastPost(b).date; return x < y ? 1 : x > y ? -1 : 0; }
function threadsOn(boardId) { return F.threads.filter(function (t) { return t.board === boardId; }).sort(byBump); }

// Every post gets a fixed number, counted in date order across the whole board.
var POST_NO = (function () {
  var all = [];
  F.threads.forEach(function (t) { t.posts.forEach(function (p, i) { all.push({ key: t.id + "#" + i, date: p.date }); }); });
  all.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  var map = {};
  all.forEach(function (x, i) { map[x.key] = FIRST_POST_NUMBER + i * 7 + (i % 3); });
  return map;
})();

function playerName() {
  var g = window.AngelComments && window.AngelComments.getGuest();
  return g && g.name ? g.name : "you";
}

// Post text: > lines are green, >>2 links to post 2 in the same thread.
function postBody(text, t) {
  var box = el("blockquote", { class: "post-text" });
  String(text).replace(/\{player\}/g, playerName()).split("\n").forEach(function (line, i) {
    if (i) box.appendChild(el("br"));
    var holder = /^>(?!>)/.test(line) ? el("span", { class: "greentext" }) : box;
    if (holder !== box) box.appendChild(holder);
    line.split(/(>>\d+)/).forEach(function (part) {
      var m = /^>>(\d+)$/.exec(part);
      if (m && t && t.posts[+m[1] - 1]) holder.appendChild(el("a", { class: "quotelink", href: "#p" + m[1], text: ">>" + POST_NO[t.id + "#" + (+m[1] - 1)] }));
      else if (part) holder.appendChild(document.createTextNode(part));
    });
  });
  return box;
}

/* ---------- sealed (password) posts ---------- */
// The text is mixed with the password, so it can't be read with View Source.
// lock.html uses the same two functions to make new sealed posts.
// A short fingerprint of the text is sealed with it, so a password that is
// only almost right (12312006) can't "open" the post into scrambled text.
function fingerprint(text) {
  var h = 2166136261;
  for (var i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return ("0000000" + h.toString(16)).slice(-8);
}
function sealText(text, password) {
  var bytes = new TextEncoder().encode("OK:" + fingerprint(text) + ":" + text), key = new TextEncoder().encode(password), out = "";
  for (var i = 0; i < bytes.length; i++) out += String.fromCharCode(bytes[i] ^ key[i % key.length]);
  return btoa(out);
}
function unsealText(code, password) {
  try {
    var raw = atob(code), key = new TextEncoder().encode(password), bytes = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i) ^ key[i % key.length];
    var text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    var m = /^OK:([0-9a-f]{8}):([\s\S]*)$/.exec(text);
    return m && fingerprint(m[2]) === m[1] ? m[2] : null;
  } catch (e) { return null; }
}
// People type dates in different ways. Try what they typed, and the digits only.
function passwordGuesses(input) {
  var v = String(input).trim(), digits = v.replace(/\D/g, "");
  var list = [v, v.toLowerCase(), digits];
  if (digits.length === 8 && /^(19|20)/.test(digits)) list.push(digits.slice(4, 6) + digits.slice(6) + digits.slice(0, 4)); // yyyymmdd -> mmddyyyy
  return list;
}
function sealedBox(post, t) {
  var box = el("div", { class: "sealed" });
  box.appendChild(el("div", { class: "sealed-note", text: "🔒 This post is password-protected by its author." }));
  box.appendChild(el("div", { class: "sealed-hint", text: "\"" + post.sealed.hint + "\"" }));
  var input = el("input", { type: "password", maxlength: "40", placeholder: "password", "aria-label": "password" });
  var go = el("button", { type: "button", text: "unlock" });
  var msg = el("span", { class: "sealed-msg" });
  var form = el("form", { class: "sealed-form" }, [input, " ", go, " ", msg]);
  function tryIt(e) {
    if (e) e.preventDefault();
    var guesses = passwordGuesses(input.value), text = null;
    for (var i = 0; i < guesses.length && !text; i++) text = unsealText(post.sealed.code, guesses[i]);
    if (!text) { msg.textContent = "wrong password."; return; }
    box.innerHTML = "";
    box.className = "sealed open";
    box.appendChild(postBody(text, t));
  }
  form.addEventListener("submit", tryIt);
  go.addEventListener("click", tryIt);
  box.appendChild(form);
  return box;
}

/* ---------- one post ---------- */
function postBlock(p, i, t) {
  var no = POST_NO[t.id + "#" + i];
  var head = el("div", { class: "post-head" }, [
    el("span", { class: "post-n", text: String(i + 1) + " " }),
    i === 0 ? el("span", { class: "subject", text: t.title + " " }) : null,
    el("span", { class: "name", text: p.name || "Anonymous" }),
    " " + stamp(p.date) + " ",
    el("a", { class: "no", href: "#p" + (i + 1), text: "No." + no })
  ]);
  var body = p.sealed ? sealedBox(p, t) : postBody(p.text, t);
  return el("div", { class: i === 0 ? "post op" : "post reply", id: "p" + (i + 1) }, [head, body]);
}

/* ---------- page parts ---------- */
function header() {
  var nav = el("div", { class: "boardlist" }, ["[ "]);
  F.boards.forEach(function (b, i) {
    if (i) nav.appendChild(document.createTextNode(" / "));
    nav.appendChild(el("a", { href: "board.html?b=" + b.id, title: b.name, text: b.id }));
  });
  nav.appendChild(document.createTextNode(" ] [ "));
  nav.appendChild(el("a", { href: "index.html", text: "home" }));
  var hub = window.siteLink("hub");
  if (hub) { nav.appendChild(document.createTextNode(" / ")); nav.appendChild(el("a", { href: hub, text: "angel.exe" })); }
  nav.appendChild(document.createTextNode(" ]"));
  return nav;
}
function logo(sub) {
  return el("div", { class: "logo" }, [
    el("img", { src: "images/nightshift.svg", width: "300", height: "60", alt: BOARD_NAME }),
    sub ? el("div", { class: "logo-sub", text: sub }) : null
  ]);
}
function footer() {
  return el("div", { class: "foot" }, [
    el("div", { text: BOARD_NAME + " · " + BOARD_DOMAIN + " · all posts are the responsibility of the poster" }),
    el("div", { class: "small", text: "A fictional website from the game angel.exe." })
  ]);
}
function replyBox(t, b) {
  if (b && b.readOnly) return el("div", { class: "closed", text: "This is an archived thread. You can read it, but not reply." });
  if (t.locked) return el("div", { class: "closed", text: "Thread locked (" + t.locked + "). You can't reply." });
  var wrap = el("div", { class: "replybox" }, [el("div", { class: "replytitle", text: "Reply to this thread" })]);
  var box = el("div");
  wrap.appendChild(box);
  if (window.AngelComments) window.AngelComments.mount(box, "forum:" + t.id);
  return wrap;
}

/* ================================================================== */
/*  PAGES                                                              */
/* ================================================================== */
var PAGES = {};

PAGES.home = function (page) {
  page.appendChild(logo("anonymous boards for people who are awake when they shouldn't be"));
  var welcome = el("div", { class: "box" }, [
    el("h2", { text: "welcome to " + BOARD_NAME }),
    el("p", { text: "no accounts. no profiles. just boards. post as Anonymous or pick a name for the night." })
  ]);
  var rules = el("ol");
  F.rules.forEach(function (r) { rules.appendChild(el("li", { text: r })); });
  welcome.appendChild(el("h3", { text: "rules" }));
  welcome.appendChild(rules);
  page.appendChild(welcome);

  var boards = el("div", { class: "box" }, [el("h2", { text: "boards" })]);
  var table = el("table", { class: "boards" });
  table.appendChild(el("tr", {}, [el("th", { text: "board" }), el("th", { text: "threads" }), el("th", { text: "posts" }), el("th", { text: "last post" })]));
  F.boards.forEach(function (b) {
    var ts = threadsOn(b.id), posts = 0;
    ts.forEach(function (t) { posts += t.posts.length; });
    table.appendChild(el("tr", {}, [
      el("td", {}, [el("a", { href: "board.html?b=" + b.id, text: "/" + b.id + "/ - " + b.name }), el("div", { class: "small", text: b.desc })]),
      el("td", { class: "num", text: String(ts.length) }),
      el("td", { class: "num", text: String(posts) }),
      el("td", { class: "small", text: ts.length ? stamp(lastPost(ts[0]).date) : "-" })
    ]));
  });
  boards.appendChild(table);
  page.appendChild(boards);

  var recent = el("div", { class: "box" }, [el("h2", { text: "latest threads" })]);
  var ul = el("ul", { class: "latest" });
  F.threads.filter(function (t) { var b = board(t.board); return b && !b.readOnly; }).sort(byBump).slice(0, 6).forEach(function (t) {
    ul.appendChild(el("li", {}, [
      el("a", { href: "thread.html?t=" + t.id, text: t.title }),
      el("span", { class: "small", text: " /" + t.board + "/ · " + t.posts.length + " posts · " + stamp(lastPost(t).date) })
    ]));
  });
  recent.appendChild(ul);
  page.appendChild(recent);

  var gb = el("div");
  page.appendChild(el("div", { class: "box" }, [el("h2", { text: "say hi (front page shoutbox)" }), gb]));
  if (window.AngelComments) window.AngelComments.mount(gb, "forum:home");
};

PAGES.board = function (page) {
  var b = board(param("b"));
  if (!b) { page.appendChild(el("p", { text: "That board doesn't exist." })); return; }
  document.title = "/" + b.id + "/ - " + b.name + " | " + BOARD_NAME;
  page.appendChild(logo("/" + b.id + "/ - " + b.name));
  page.appendChild(el("div", { class: "board-desc", text: b.desc }));
  if (b.readOnly) page.appendChild(el("div", { class: "closed", text: "This board is an archive. Threads here are read only." }));
  threadsOn(b.id).forEach(function (t) {
    var op = postBlock(t.posts[0], 0, t);
    var replies = t.posts.length - 1;
    var wrap = el("div", { class: "thread-preview" }, [op]);
    var info = el("div", { class: "omitted" }, [
      replies + (replies === 1 ? " reply" : " replies") + (t.locked ? " · 🔒 " + t.locked : "") + " · ",
      el("a", { href: "thread.html?t=" + t.id, text: "[View thread]" })
    ]);
    wrap.appendChild(info);
    if (replies) wrap.appendChild(postBlock(lastPost(t), t.posts.length - 1, t));
    page.appendChild(wrap);
    page.appendChild(el("hr"));
  });
};

PAGES.thread = function (page) {
  var t = thread(param("t"));
  if (!t) { page.appendChild(el("p", { text: "That thread doesn't exist (it may have been deleted)." })); return; }
  var b = board(t.board);
  document.title = t.title + " - /" + t.board + "/ | " + BOARD_NAME;
  page.appendChild(logo("/" + t.board + "/ - " + (b ? b.name : "")));
  page.appendChild(el("div", { class: "threadnav" }, ["[", el("a", { href: "board.html?b=" + t.board, text: "return to /" + t.board + "/" }), "]"]));
  if (t.locked) page.appendChild(el("div", { class: "closed", text: "🔒 " + t.locked }));
  t.posts.forEach(function (p, i) { page.appendChild(postBlock(p, i, t)); });
  page.appendChild(el("hr"));
  page.appendChild(replyBox(t, b));
};

document.addEventListener("DOMContentLoaded", function () {
  var name = document.body.getAttribute("data-page");
  if (!PAGES[name]) return;
  var page = el("div", { class: "page" });
  document.body.appendChild(header());
  document.body.appendChild(page);
  PAGES[name](page);
  document.body.appendChild(header());
  document.body.appendChild(footer());
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
});
