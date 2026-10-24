/*
  starlit.js - builds Starlit, the free homepage host, and every
  character's homepage from data/homepages.js.

  You usually don't need to edit this file. The homepages are in
  data/homepages.js and the colours are in css/starlit.css.
  index.html is the Starlit front page (data-page="directory") and
  site.html shows one homepage: site.html?u=quiethours&p=journal
*/

/* ---------- things you might want to change ---------- */
var HOST_NAME = "Starlit";
var HOST_DOMAIN = "starlit.net";    // made up, shown inside the story only
var ENTRIES_PER_PAGE = 5;

/* ---------- helpers ---------- */
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
// Text with \n line breaks, as paragraphs.
function paras(text, cls) {
  var box = el("div", { class: cls || "text" });
  String(text || "").split(/\n\n+/).forEach(function (p) {
    var para = el("p");
    p.split("\n").forEach(function (line, i) { if (i) para.appendChild(el("br")); para.appendChild(document.createTextNode(line)); });
    box.appendChild(para);
  });
  return box;
}
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function pretty(d, withTime) {
  var p = String(d).split(" "), ymd = p[0].split("-");
  var date = new Date(+ymd[0], +ymd[1] - 1, +ymd[2]);
  var s = DAYS[date.getDay()] + ", " + MONTHS[+ymd[1] - 1] + " " + (+ymd[2]) + ", " + ymd[0];
  if (withTime && p[1]) {
    var hm = p[1].split(":"), h = +hm[0];
    s += " · " + ((h % 12) || 12) + ":" + hm[1] + " " + (h < 12 ? "am" : "pm");
  }
  return s;
}
function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }

function homepage(id) {
  for (var i = 0; i < window.HOMEPAGES.length; i++) if (window.HOMEPAGES[i].id === id) return window.HOMEPAGES[i];
  return null;
}
function homepageOf(characterId) {
  for (var i = 0; i < window.HOMEPAGES.length; i++) if (window.HOMEPAGES[i].owner === characterId) return window.HOMEPAGES[i];
  return null;
}
function character(id) { return (window.ANGEL_CHARACTERS || {})[id] || null; }
function siteHref(id, page) { return "site.html?u=" + encodeURIComponent(id) + (page ? "&p=" + encodeURIComponent(page) : ""); }

// "Artist - Song": links the artist to LowLight when they're on it.
function musicLine(text) {
  var span = el("span", { class: "music" }, ["listening to: "]);
  var parts = String(text).split(" - ");
  var lowlight = window.siteLink && window.siteLink("music");
  if (lowlight && parts.length > 1) {
    span.appendChild(el("a", { href: lowlight.replace(/index\.html$/, "") + "artist.html?name=" + encodeURIComponent(parts[0]), text: parts[0] }));
    span.appendChild(document.createTextNode(" - " + parts.slice(1).join(" - ")));
  } else span.appendChild(document.createTextNode(text));
  return span;
}

// A name in a guestbook: a character links to their homepage.
function whoLink(from) {
  var c = character(from);
  if (!c) return el("b", { text: from });
  var hp = homepageOf(from);
  return hp ? el("a", { href: siteHref(hp.id), text: c.calls || c.name }) : el("b", { text: c.calls || c.name });
}

/* ---------- the Starlit bar on top of every homepage (like a free host ad) ---------- */
function hostBar() {
  var g = window.AngelComments && window.AngelComments.getGuest();
  return el("div", { class: "hostbar" }, [
    el("a", { class: "hostlogo", href: "index.html" }, [el("img", { src: "images/starlit.svg", width: "110", height: "24", alt: "Starlit" })]),
    el("span", { class: "hostad", text: "Free homepages! 20 MB of space, no ads* · *except this one" }),
    el("a", { href: "index.html", text: "get your own" }),
    el("a", { href: "index.html#directory", text: "next site »" }),
    g ? el("span", { class: "hostme", text: "signed in as guest: " + g.name }) : null
  ]);
}

/* ================================================================== */
/*  ONE HOMEPAGE                                                       */
/* ================================================================== */
var BUILDERS = {};

BUILDERS.intro = function (hp, page, box) {
  box.appendChild(paras(page.text));
  var c = character(hp.owner);
  if (c && c.avatar) box.insertBefore(el("img", { class: "owner-pic", src: "../shared/avatars/characters/" + c.avatar, alt: "" }), box.firstChild);
};

BUILDERS.diary = function (hp, page, box) {
  var entries = page.entries.slice().sort(byDateDesc);
  var n = Math.max(1, +param("page") || 1), pages = Math.ceil(entries.length / ENTRIES_PER_PAGE);
  entries.slice((n - 1) * ENTRIES_PER_PAGE, n * ENTRIES_PER_PAGE).forEach(function (e) {
    var entry = el("div", { class: "entry" + (e.private ? " private" : "") }, [
      el("div", { class: "entry-date", text: pretty(e.date, true) })
    ]);
    if (e.private) {
      entry.appendChild(el("div", { class: "entry-text", text: "🔒 this entry is private." }));
    } else {
      if (e.title) entry.appendChild(el("h3", { class: "entry-title", text: e.title }));
      entry.appendChild(paras(e.text, "entry-text"));
      var meta = el("div", { class: "entry-meta" });
      if (e.mood) meta.appendChild(el("span", { class: "mood", text: "mood: " + e.mood }));
      if (e.music) meta.appendChild(musicLine(e.music));
      if (meta.childNodes.length) entry.appendChild(meta);
    }
    box.appendChild(entry);
  });
  if (pages > 1) {
    var pager = el("div", { class: "pager" }, ["pages: "]);
    for (var i = 1; i <= pages; i++) {
      pager.appendChild(i === n ? el("b", { text: "[" + i + "]" }) : el("a", { href: siteHref(hp.id, page.id) + "&page=" + i, text: "[" + i + "]" }));
      pager.appendChild(document.createTextNode(" "));
    }
    box.appendChild(pager);
  }
};

BUILDERS.writing = function (hp, page, box) {
  if (page.intro) box.appendChild(el("p", { class: "intro", text: page.intro }));
  var toc = el("ul", { class: "toc" });
  page.pieces.forEach(function (p, i) { toc.appendChild(el("li", {}, [el("a", { href: "#piece-" + i, text: p.title })])); });
  if (page.pieces.length > 1) box.appendChild(toc);
  page.pieces.forEach(function (p, i) {
    box.appendChild(el("div", { class: "piece " + (p.kind || "poem"), id: "piece-" + i }, [
      el("h3", { text: p.title }),
      el("div", { class: "piece-date", text: (p.kind || "poem") + " · " + pretty(p.date) }),
      paras(p.text, "piece-text")
    ]));
  });
};

BUILDERS.gallery = function (hp, page, box) {
  if (page.intro) box.appendChild(el("p", { class: "intro", text: page.intro }));
  var grid = el("div", { class: "gallery" });
  var drawn = null;   // a page 12 the player drew on the hidden mirror site
  try { drawn = JSON.parse(localStorage.getItem("angelexe.page12") || "null"); } catch (e) { drawn = null; }
  page.items.forEach(function (it) {
    if (it.missing && it.drawnByPlayer && drawn && drawn.image) {
      grid.appendChild(el("div", { class: "thumb drawn" }, [el("img", { src: drawn.image, alt: it.title }), el("b", { text: it.title }), el("span", { text: "drawn by " + drawn.by })]));
      return;
    }
    var pic = it.picture
      ? el("img", { src: "images/" + it.picture, alt: it.title })
      : el("div", { class: "nopic" + (it.missing ? " missing" : ""), text: it.missing ? "?" : "[ img ]" });
    grid.appendChild(el("div", { class: "thumb" + (it.missing ? " missing" : "") }, [pic, el("b", { text: it.title }), it.caption ? el("span", { text: it.caption }) : null]));
  });
  box.appendChild(grid);
};

BUILDERS.links = function (hp, page, box) {
  var ul = el("ul", { class: "linklist" });
  page.links.forEach(function (l) {
    var href = l.site ? window.siteLink(l.site) : l.href;
    if (l.dead || !href) ul.appendChild(el("li", { class: "dead" }, [el("span", { text: l.label }), el("span", { class: "small", text: " (404 - this site doesn't exist anymore)" })]));
    else ul.appendChild(el("li", {}, [el("a", { href: href, text: l.label })]));
  });
  box.appendChild(ul);
  box.appendChild(el("div", { class: "webring" }, [
    "« prev · ", el("b", { text: "the larkfield webring" }), " · random · next »"
  ]));
};

BUILDERS.guestbook = function (hp, page, box) {
  box.appendChild(el("p", { class: "intro", text: "sign my guestbook!! (be nice)" }));
  var mine = el("div", { class: "gb-player" });
  box.appendChild(mine);
  if (window.AngelComments) window.AngelComments.mount(mine, "homepages:" + hp.id + ":guestbook");
  var old = el("div", { class: "gb-old" });
  page.entries.slice().sort(byDateDesc).forEach(function (e) {
    old.appendChild(el("div", { class: "gb-entry" }, [
      el("div", { class: "gb-head" }, [whoLink(e.from), el("span", { class: "gb-date", text: " signed " + pretty(e.date, true) })]),
      paras(e.text, "gb-text")
    ]));
  });
  box.appendChild(old);
};

function buildHomepage(hp) {
  var pageId = param("p") || hp.pages[0].id;
  var page = hp.pages.filter(function (p) { return p.id === pageId; })[0] || hp.pages[0];
  document.title = hp.title + (page.id !== hp.pages[0].id ? " - " + page.label : "");
  document.body.className = "home theme-" + hp.theme;

  var wrap = el("div", { class: "hp" });
  if (hp.marquee) wrap.appendChild(el("div", { class: "marquee" }, [el("span", { text: hp.marquee })]));
  wrap.appendChild(el("div", { class: "hp-head" }, [
    el("h1", { text: hp.title }),
    el("div", { class: "tagline", text: hp.tagline })
  ]));
  var menu = el("div", { class: "hp-menu" });
  hp.pages.forEach(function (p) { menu.appendChild(el("a", { href: siteHref(hp.id, p.id), class: p.id === page.id ? "here" : "", text: p.label })); });
  var content = el("div", { class: "hp-content" });
  if (page.id !== hp.pages[0].id) content.appendChild(el("h2", { class: "page-title", text: page.label }));
  (BUILDERS[page.type] || BUILDERS.intro)(hp, page, content);
  wrap.appendChild(el("div", { class: "hp-body" }, [menu, content]));

  var digits = String(hp.counter + 1);
  while (digits.length < 6) digits = "0" + digits;
  wrap.appendChild(el("div", { class: "hp-foot" }, [
    el("div", {}, ["you are visitor ", el("span", { class: "counter", text: digits })]),
    el("div", { class: "small", text: "online since " + pretty(hp.since) + " · last updated " + pretty(hp.updated) }),
    el("div", { class: "small", text: HOST_DOMAIN + "/~" + hp.id })
  ]));
  document.body.appendChild(hostBar());
  document.body.appendChild(wrap);
}

/* ================================================================== */
/*  THE STARLIT FRONT PAGE                                             */
/* ================================================================== */
function buildDirectory() {
  document.body.className = "host";
  var page = el("div", { class: "host-page" });
  page.appendChild(el("div", { class: "host-head" }, [
    el("img", { src: "images/starlit.svg", width: "220", height: "48", alt: "Starlit" }),
    el("div", { class: "host-tag", text: "free homepages for everyone · your own little piece of the web" })
  ]));
  var nav = el("div", { class: "host-nav" });
  [["Home", "index.html"], ["Directory", "#directory"], ["Sign up", "#signup"], ["Help", "#help"]].forEach(function (n) { nav.appendChild(el("a", { href: n[1], text: n[0] })); });
  var hub = window.siteLink("hub");
  if (hub) nav.appendChild(el("a", { href: hub, text: "angel.exe community" }));
  page.appendChild(nav);

  var main = el("div", { class: "host-main" });
  main.appendChild(el("h2", { text: "Featured homepages" }));
  var dir = el("div", { class: "directory", id: "directory" });
  window.HOMEPAGES.forEach(function (hp) {
    var c = character(hp.owner);
    dir.appendChild(el("div", { class: "site-card theme-" + hp.theme }, [
      el("a", { class: "site-name", href: siteHref(hp.id), text: hp.title }),
      el("div", { class: "site-tag", text: hp.tagline }),
      el("div", { class: "site-url", text: HOST_DOMAIN + "/~" + hp.id }),
      el("div", { class: "small", text: "updated " + pretty(hp.updated) + (c ? " · by " + (c.calls || c.name) : "") })
    ]));
  });
  main.appendChild(dir);

  main.appendChild(el("h2", { text: "Recently removed" }));
  main.appendChild(el("p", { class: "small", text: "Sites deleted by their owners or for inactivity. Their addresses can't be claimed for 12 months." }));
  var gone = el("ul", { class: "removed" });
  (window.REMOVED_HOMEPAGES || []).forEach(function (r) { gone.appendChild(el("li", {}, [el("a", { href: "site.html?u=" + r.id, text: HOST_DOMAIN + "/~" + r.id }), "  (removed " + pretty(r.removed) + ")"])); });
  main.appendChild(gone);

  main.appendChild(el("h2", { id: "signup", text: "Get your own homepage" }));
  main.appendChild(el("p", { text: "Sign-ups are closed while we move to new servers. Sorry! Check back soon." }));
  main.appendChild(el("h2", { id: "help", text: "Help" }));
  main.appendChild(el("p", { text: "Every site gets 20 MB, a visitor counter and a guestbook. Please don't hotlink other people's pictures. Be nice in guestbooks." }));

  var c = el("div");
  main.appendChild(el("h2", { text: "Starlit guestbook" }));
  main.appendChild(c);
  if (window.AngelComments) window.AngelComments.mount(c, "homepages:host");
  page.appendChild(main);
  page.appendChild(el("div", { class: "host-foot", text: "Starlit · " + HOST_DOMAIN + " · a fictional website from the game angel.exe" }));
  document.body.appendChild(page);
}

document.addEventListener("DOMContentLoaded", function () {
  if (document.body.getAttribute("data-page") === "directory") { buildDirectory(); return; }
  var hp = homepage(param("u"));
  if (hp) { buildHomepage(hp); return; }
  var removed = (window.REMOVED_HOMEPAGES || []).filter(function (r) { return r.id === param("u"); })[0];
  document.body.className = "host";
  document.body.appendChild(el("div", { class: "host-page notfound" }, [
    el("h1", { text: "404 Not Found" }),
    el("p", { text: removed ? "The site " + HOST_DOMAIN + "/~" + removed.id + " was removed by its owner." : "There's no Starlit homepage at this address." }),
    removed && removed.mirror ? el("p", { class: "small mirror-note" }, ["a cached copy may still exist on the ", el("a", { href: removed.mirror, text: "mirror service" }), "."]) : null,
    el("a", { href: "index.html", text: "Back to Starlit" })
  ]));
});
