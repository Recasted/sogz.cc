/*
  lowlight.js - builds every LowLight page from data/music.js and runs
  the music player at the top.

  You usually don't need to edit this file. Music, posts and playlists
  are in data/music.js. Colours and layout are in css/lowlight.css.
  Each HTML page has <body data-page="..."> and the matching function
  in PAGES below fills it in.
*/

/* ---------- things you might want to change ---------- */
var NAV = [
  { label: "Home", href: "index.html", page: "home" },
  { label: "Artists", href: "artists.html", page: "artists" },
  { label: "Playlists", href: "playlists.html", page: "playlists" },
  { label: "Blog", href: "blog.html", page: "blog" }
];
var POSTS_PER_PAGE = 5;

/* ---------- helpers ---------- */
var M = window.MUSIC;
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
var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function pretty(d) { var p = d.split("-"); return MONTHS[+p[1] - 1] + " " + (+p[2]) + ", " + p[0]; }
function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }

function artist(id) {
  for (var i = 0; i < M.artists.length; i++) if (M.artists[i].id === id) return M.artists[i];
  return null;
}
function artistByName(name) {
  var n = String(name).toLowerCase();
  for (var i = 0; i < M.artists.length; i++) if (M.artists[i].name.toLowerCase() === n) return M.artists[i];
  return null;
}
function albumById(id) {
  for (var i = 0; i < M.artists.length; i++) {
    var al = M.artists[i].albums || [];
    for (var j = 0; j < al.length; j++) if (al[j].id === id) return { album: al[j], artist: M.artists[i] };
  }
  return null;
}
function artistHref(id) { return "artist.html?a=" + encodeURIComponent(id); }
function artistLink(id) {
  var a = artist(id);
  return a ? el("a", { href: artistHref(id), text: a.name }) : el("span", { text: id });
}
// A track can be a plain song title or { title: "...", audio: "audio/file.mp3" }
function trackTitle(t) { return typeof t === "string" ? t : t.title; }
function trackAudio(t) { return typeof t === "string" ? "" : (t.audio || ""); }

// Who wrote something: a character from shared/story/characters.js or a LowLight writer.
function authorName(id) {
  var c = (window.ANGEL_CHARACTERS || {})[id];
  if (c) return c.calls || c.name || id;
  var w = (M.writers || {})[id];
  return w ? w.name : id;
}
function authorLink(id) {
  var c = (window.ANGEL_CHARACTERS || {})[id];
  var os = window.siteLink && window.siteLink("social");
  if (c && os && c.accounts && c.accounts.orbitspace) {
    return el("a", { href: os.replace(/index\.html$/, "") + "profile.html?u=" + encodeURIComponent(c.accounts.orbitspace), text: authorName(id) });
  }
  return el("b", { text: authorName(id) });
}

function stars(n) { return el("span", { class: "stars", title: n + " out of 5", text: "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n) }); }

function spotifySearch(q) { return "https://open.spotify.com/search/" + encodeURIComponent(q); }
function youtubeSearch(q) { return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q); }

/* Made-up album covers, so every album has something to show until
   you add a real picture with "cover" in data/music.js. */
var COVER_COLOURS = [["#1d2b44", "#9fb4d6"], ["#5a1036", "#ff8fc7"], ["#2c2348", "#c2afff"], ["#1f3b2a", "#9be3b0"],
                     ["#3d2a14", "#f2c48a"], ["#101010", "#e0e0e0"], ["#0f3a4a", "#7fe0ff"], ["#4a1010", "#ff9a7a"]];
function coverSrc(al, ar) {
  if (al.cover) return al.cover;
  var h = 0, s = al.id + ar.id;
  for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  var c = COVER_COLOURS[h % COVER_COLOURS.length];
  function esc(t) { return String(t).replace(/[&<>"]/g, function (x) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[x]; }); }
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
    '<rect width="200" height="200" fill="' + c[0] + '"/>' +
    '<circle cx="' + (40 + h % 120) + '" cy="' + (40 + (h >> 3) % 100) + '" r="' + (30 + h % 50) + '" fill="' + c[1] + '" opacity=".35"/>' +
    '<rect x="0" y="140" width="200" height="60" fill="#000" opacity=".35"/>' +
    '<text x="12" y="166" font-family="Georgia,serif" font-size="17" fill="#fff">' + esc(al.title).slice(0, 22) + '</text>' +
    '<text x="12" y="186" font-family="Verdana,sans-serif" font-size="10" fill="' + c[1] + '">' + esc(ar.name).toUpperCase() + '</text></svg>';
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
function artistPic(ar) {
  if (ar.image) return ar.image;
  var al = (ar.albums || [])[0];
  return coverSrc(al || { id: ar.id, title: ar.name }, ar);
}

/* ================================================================== */
/*  THE PLAYER                                                         */
/* ================================================================== */
var Player = {
  queue: [], index: -1, audio: new Audio(),

  // items: [{ artist: artistId, title: "...", audio: "" }]
  load: function (items, start) {
    this.queue = items;
    this.play(start || 0);
  },
  play: function (i) {
    if (i < 0 || i >= this.queue.length) return;
    this.index = i;
    var t = this.queue[i], ar = artist(t.artist);
    var who = ar ? ar.name : t.artist;
    $("#lcdNow").textContent = t.title;
    var sub = $("#lcdSub");
    sub.innerHTML = "";
    this.audio.pause();
    if (t.audio) {
      this.audio.src = t.audio;
      this.audio.play().catch(function () { sub.textContent = who + " · couldn't play the file"; });
      sub.textContent = who;
      $("#playBtn").textContent = "❚❚";
    } else {
      // No file on this site: offer the official services instead.
      sub.appendChild(document.createTextNode(who + " · "));
      var q = who + " " + t.title;
      sub.appendChild(el("span", { class: "listen" }, [
        el("a", { href: spotifySearch(q), target: "_blank", rel: "noopener", text: "Listen on Spotify" }),
        el("a", { href: youtubeSearch(q), target: "_blank", rel: "noopener", text: "YouTube" })
      ]));
      $("#playBtn").textContent = "▶";
    }
    document.querySelectorAll("tr.playing").forEach(function (r) { r.classList.remove("playing"); });
    var row = document.querySelector('tr[data-key="' + (t.artist + "|" + t.title).replace(/"/g, "") + '"]');
    if (row) row.classList.add("playing");
  },
  toggle: function () {
    var t = this.queue[this.index];
    if (!t) { if (this.queue.length) this.play(0); return; }
    if (!t.audio) return;
    if (this.audio.paused) { this.audio.play(); $("#playBtn").textContent = "❚❚"; }
    else { this.audio.pause(); $("#playBtn").textContent = "▶"; }
  },
  stop: function () { this.audio.pause(); this.audio.currentTime = 0; $("#playBtn").textContent = "▶"; },
  next: function () { this.play(this.index + 1); },
  prev: function () { this.play(this.index - 1); }
};
Player.audio.addEventListener("timeupdate", function () {
  var a = Player.audio, bar = $("#lcdBar");
  if (bar && a.duration) bar.style.width = (100 * a.currentTime / a.duration) + "%";
});
Player.audio.addEventListener("ended", function () { Player.next(); });

function buildPlayer() {
  var vol = el("input", { type: "range", min: "0", max: "1", step: "0.05", value: "0.8", title: "volume" });
  vol.addEventListener("input", function () { Player.audio.volume = +vol.value; });
  Player.audio.volume = 0.8;
  var btn = function (id, label, title, fn, big) {
    var b = el("button", { class: "pbtn" + (big ? " big" : ""), id: id, title: title, type: "button", text: label });
    b.addEventListener("click", fn);
    return b;
  };
  return el("div", { class: "player" }, [
    el("div", { class: "controls" }, [
      btn("prevBtn", "◀◀", "previous", function () { Player.prev(); }),
      btn("playBtn", "▶", "play / pause", function () { Player.toggle(); }, true),
      btn("stopBtn", "■", "stop", function () { Player.stop(); }),
      btn("nextBtn", "▶▶", "next", function () { Player.next(); })
    ]),
    el("div", { class: "lcd" }, [
      el("div", { class: "now", id: "lcdNow", text: "LowLight Player" }),
      el("div", { class: "sub", id: "lcdSub", text: "press ▶ next to any song" }),
      el("div", { class: "bar" }, [el("span", { id: "lcdBar" })])
    ]),
    vol
  ]);
}

// A list of songs with play buttons. items: [{ artist, title, audio }]
function trackTable(items, showArtist) {
  var t = el("table", { class: "tracks" });
  var head = el("tr", {}, [el("th", { text: "" }), el("th", { text: "#" }), el("th", { text: "Name" })]);
  if (showArtist) head.appendChild(el("th", { text: "Artist" }));
  t.appendChild(head);
  items.forEach(function (it, i) {
    var play = el("button", { class: "mini", type: "button", title: "play", text: "▶" });
    play.addEventListener("click", function () { Player.load(items, i); });
    var row = el("tr", { "data-key": (it.artist + "|" + it.title).replace(/"/g, "") }, [
      el("td", { class: "play" }, [play]),
      el("td", { class: "n", text: String(i + 1) }),
      el("td", { text: it.title })
    ]);
    if (showArtist) row.appendChild(el("td", {}, [artistLink(it.artist)]));
    row.addEventListener("dblclick", function () { Player.load(items, i); });
    t.appendChild(row);
  });
  return t;
}

// Finds the audio file for a song if one is listed in data/music.js.
function findAudio(artistId, title) {
  var ar = artist(artistId);
  if (!ar) return "";
  var found = "";
  (ar.albums || []).forEach(function (al) {
    al.tracks.forEach(function (t) { if (trackTitle(t) === title && trackAudio(t)) found = trackAudio(t); });
  });
  (M.singles || []).forEach(function (s) { if (s.artist === artistId && s.title === title && s.audio) found = s.audio; });
  return found;
}
function items(list) {
  return list.map(function (t) { return { artist: t.artist, title: t.title, audio: t.audio || findAudio(t.artist, t.title) }; });
}

/* ---------- chrome ---------- */
function buildChrome(current) {
  var page = $(".page");
  var head = el("div", { class: "ll-head" }, [
    el("a", { class: "logo", href: "index.html" }, [el("img", { src: "images/logo.svg", width: "230", height: "56", alt: "LowLight" })]),
    buildPlayer()
  ]);
  var nav = el("div", { class: "ll-nav" });
  NAV.forEach(function (n) { nav.appendChild(el("a", { href: n.href, class: n.page === current ? "here" : "", text: n.label })); });
  var form = el("form", { class: "ll-search" }, [el("input", { type: "text", name: "q", placeholder: "search artists & songs" })]);
  form.setAttribute("action", "artists.html");
  nav.appendChild(form);
  page.insertBefore(nav, page.firstChild);
  page.insertBefore(head, nav);

  var foot = el("div", { class: "ll-foot" }, ["lowlight · music for the hours after midnight · no downloads, buy the records · "]);
  var hub = window.siteLink("hub"), os = window.siteLink("social");
  if (hub) foot.appendChild(el("a", { href: hub, text: "angel.exe community" }));
  if (os) { foot.appendChild(document.createTextNode(" · ")); foot.appendChild(el("a", { href: os, text: "OrbitSpace" })); }
  foot.appendChild(el("div", { class: "small", text: "A fictional website from the game angel.exe. Artists, albums and songs are real; LowLight and its writers are not." }));
  page.appendChild(foot);
}

// Left column used on most pages.
function sidebar() {
  var side = el("div", { class: "side" });
  side.appendChild(el("h3", { text: "Artists" }));
  var ul = el("ul");
  M.artists.slice().sort(function (a, b) { return a.name.localeCompare(b.name); })
    .forEach(function (a) { ul.appendChild(el("li", {}, [el("a", { href: artistHref(a.id), text: a.name })])); });
  side.appendChild(ul);

  side.appendChild(el("h3", { text: "Reader playlists" }));
  var pl = el("ul");
  M.playlists.forEach(function (p) {
    pl.appendChild(el("li", {}, [el("a", { href: "playlists.html?p=" + p.id, text: p.title }), el("span", { class: "muted small", text: " by " + authorName(p.by) })]));
  });
  side.appendChild(pl);

  side.appendChild(el("h3", { text: "Archive" }));
  var months = {};
  M.posts.forEach(function (p) { months[p.date.slice(0, 7)] = (months[p.date.slice(0, 7)] || 0) + 1; });
  var ar = el("ul");
  Object.keys(months).sort().reverse().forEach(function (m) {
    var p = m.split("-");
    ar.appendChild(el("li", {}, [el("a", { href: "blog.html?month=" + m, text: MONTHS[+p[1] - 1] + " " + p[0] }), " (" + months[m] + ")"]));
  });
  side.appendChild(ar);
  return side;
}

function postBlock(p) {
  var tags = el("div");
  (p.artists || []).forEach(function (id) { var a = artist(id); if (a) tags.appendChild(el("a", { class: "tag", href: artistHref(id), text: a.name })); });
  return el("div", { class: "post", id: "post-" + p.id }, [
    el("h3", { text: p.title }),
    el("div", { class: "meta" }, ["posted " + pretty(p.date) + " by ", authorLink(p.by)]),
    el("p", { text: p.text }),
    tags
  ]);
}

function commentsBox(thread, title) {
  if (!window.AngelComments) return null;
  var div = el("div");
  window.AngelComments.mount(div, thread);
  return el("div", {}, [el("h2", { class: "section", text: title || "Comments" }), div]);
}

/* ================================================================== */
/*  PAGES                                                              */
/* ================================================================== */
var PAGES = {};

PAGES.home = function (main) {
  main.appendChild(el("h1", { class: "title", text: "lowlight" }));
  main.appendChild(el("p", { class: "muted", text: "music for the hours after midnight. reviews, reader playlists, and whatever I can't stop playing." }));

  main.appendChild(el("h2", { class: "section", text: "Latest posts" }));
  M.posts.slice().sort(byDateDesc).slice(0, 3).forEach(function (p) { main.appendChild(postBlock(p)); });
  main.appendChild(el("a", { class: "btn", href: "blog.html", text: "more posts »" }));

  main.appendChild(el("h2", { class: "section", text: "Newest reader playlist" }));
  var p = M.playlists.slice().sort(byDateDesc)[0];
  if (p) {
    main.appendChild(el("p", {}, [el("a", { href: "playlists.html?p=" + p.id, text: p.title }), " by ", authorLink(p.by), el("span", { class: "muted", text: ' · "' + p.note + '"' })]));
    main.appendChild(trackTable(items(p.tracks), true));
  }

  main.appendChild(el("h2", { class: "section", text: "Recent reviews" }));
  M.reviews.slice().sort(byDateDesc).slice(0, 3).forEach(function (r) {
    var f = albumById(r.album);
    if (!f) return;
    main.appendChild(el("div", { class: "review" }, [
      el("div", {}, [el("a", { href: artistHref(f.artist.id) + "#" + f.album.id, text: f.album.title }), " · " + f.artist.name + " ", stars(r.rating)]),
      el("div", { text: r.text }),
      el("div", { class: "small muted", text: pretty(r.date) + " · " + authorName(r.by) })
    ]));
  });

  var c = commentsBox("lowlight:home", "Shoutbox");
  if (c) main.appendChild(c);
};

PAGES.artists = function (main) {
  var q = param("q").toLowerCase();
  main.appendChild(el("h1", { class: "title", text: q ? 'Search: "' + param("q") + '"' : "All artists" }));
  var grid = el("div", { class: "artist-grid" });
  var songHits = [];
  M.artists.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (a) {
    var match = !q || (a.name + " " + a.genres + " " + a.from).toLowerCase().indexOf(q) !== -1;
    (a.albums || []).forEach(function (al) {
      if (q && al.title.toLowerCase().indexOf(q) !== -1) match = true;
      al.tracks.forEach(function (t) { if (q && trackTitle(t).toLowerCase().indexOf(q) !== -1) songHits.push({ artist: a.id, title: trackTitle(t), audio: trackAudio(t) }); });
    });
    if (!match) return;
    grid.appendChild(el("div", { class: "artist-card" }, [
      el("a", { href: artistHref(a.id) }, [el("img", { src: artistPic(a), alt: "" })]),
      el("a", { href: artistHref(a.id), text: a.name }),
      el("div", { class: "small muted", text: a.genres })
    ]));
  });
  if (q && songHits.length) {
    main.appendChild(el("h2", { class: "section", text: "Songs" }));
    main.appendChild(trackTable(songHits, true));
    main.appendChild(el("h2", { class: "section", text: "Artists" }));
  }
  main.appendChild(grid.children.length ? grid : el("p", { class: "muted", text: "No artists found." }));
};

PAGES.artist = function (main) {
  var a = artist(param("a")) || artistByName(param("name"));
  if (!a) {
    main.appendChild(el("h1", { class: "title", text: "Artist not found" }));
    main.appendChild(el("p", {}, ["That artist isn't on LowLight yet. ", el("a", { href: "artists.html", text: "See all artists" })]));
    return;
  }
  document.title = a.name + " | LowLight";
  main.appendChild(el("h1", { class: "title", text: a.name }));
  main.appendChild(el("div", { class: "muted", text: [a.genres, a.from].filter(Boolean).join(" · ") }));
  main.appendChild(el("p", { text: a.bio }));
  var links = el("p");
  if (a.official) links.appendChild(el("a", { class: "btn", href: a.official, target: "_blank", rel: "noopener", text: "Official website" }));
  links.appendChild(document.createTextNode(" "));
  links.appendChild(el("a", { class: "btn", href: a.spotify || spotifySearch(a.name), target: "_blank", rel: "noopener", text: "Spotify" }));
  links.appendChild(document.createTextNode(" "));
  links.appendChild(el("a", { class: "btn", href: a.youtube || youtubeSearch(a.name), target: "_blank", rel: "noopener", text: "YouTube" }));
  main.appendChild(links);

  // characters who love this artist (from shared/story/characters.js)
  var fans = [];
  var chars = window.ANGEL_CHARACTERS || {};
  Object.keys(chars).forEach(function (id) {
    if ((chars[id].music || []).some(function (n) { return n.toLowerCase() === a.name.toLowerCase(); })) fans.push(id);
  });
  if (fans.length) {
    var f = el("p", { class: "small" }, ["Fans on OrbitSpace: "]);
    fans.forEach(function (id, i) { if (i) f.appendChild(document.createTextNode(", ")); f.appendChild(authorLink(id)); });
    main.appendChild(f);
  }

  if ((a.albums || []).length) main.appendChild(el("h2", { class: "section", text: "Albums" }));
  (a.albums || []).slice().sort(function (x, y) { return x.year - y.year; }).forEach(function (al) {
    var list = al.tracks.map(function (t) { return { artist: a.id, title: trackTitle(t), audio: trackAudio(t) }; });
    var info = el("div", { class: "info" }, [
      el("h3", { text: al.title }),
      el("div", { class: "muted small", text: al.year + " · " + (al.tracksNote || "selected tracks") }),
      trackTable(list, false)
    ]);
    M.reviews.filter(function (r) { return r.album === al.id; }).forEach(function (r) {
      info.appendChild(el("div", { class: "review" }, [stars(r.rating), " ", el("span", { text: r.text }), el("div", { class: "small muted", text: pretty(r.date) + " · " + authorName(r.by) })]));
    });
    main.appendChild(el("div", { class: "album", id: al.id }, [el("div", { class: "cover" }, [el("img", { src: coverSrc(al, a), alt: al.title + " cover" })]), info]));
  });

  var singles = (M.singles || []).filter(function (s) { return s.artist === a.id; });
  if (singles.length) {
    main.appendChild(el("h2", { class: "section", text: "Songs" }));
    main.appendChild(trackTable(items(singles), false));
  }

  var onLists = M.playlists.filter(function (p) { return p.tracks.some(function (t) { return t.artist === a.id; }); });
  if (onLists.length) {
    main.appendChild(el("h2", { class: "section", text: "On reader playlists" }));
    var ul = el("ul");
    onLists.forEach(function (p) { ul.appendChild(el("li", {}, [el("a", { href: "playlists.html?p=" + p.id, text: p.title }), " by ", authorLink(p.by)])); });
    main.appendChild(ul);
  }
  var posts = M.posts.filter(function (p) { return (p.artists || []).indexOf(a.id) !== -1; });
  if (posts.length) {
    main.appendChild(el("h2", { class: "section", text: "Blog posts" }));
    posts.sort(byDateDesc).forEach(function (p) { main.appendChild(el("div", {}, [el("a", { href: "blog.html#post-" + p.id, text: p.title }), el("span", { class: "muted small", text: " · " + pretty(p.date) })])); });
  }
  var c = commentsBox("lowlight:artist:" + a.id, "Comments");
  if (c) main.appendChild(c);
};

PAGES.playlists = function (main) {
  var id = param("p");
  var list = id ? M.playlists.filter(function (p) { return p.id === id; }) : M.playlists.slice().sort(byDateDesc);
  main.appendChild(el("h1", { class: "title", text: id && list[0] ? list[0].title : "Reader playlists" }));
  if (!id) main.appendChild(el("p", { class: "muted", text: "Playlists sent in by readers. Press ▶ on any song." }));
  list.forEach(function (p) {
    if (!id) main.appendChild(el("h2", { class: "section", text: p.title }));
    main.appendChild(el("p", {}, ["by ", authorLink(p.by), el("span", { class: "muted", text: " · " + pretty(p.date) + ' · "' + p.note + '"' })]));
    var all = items(p.tracks);
    var playAll = el("button", { class: "btn", type: "button", text: "▶ play all" });
    playAll.addEventListener("click", function () { Player.load(all, 0); });
    main.appendChild(playAll);
    main.appendChild(trackTable(all, true));
  });
  if (id && !list.length) main.appendChild(el("p", { class: "muted", text: "That playlist doesn't exist." }));
  if (id && list.length) { var c = commentsBox("lowlight:playlist:" + id, "Comments"); if (c) main.appendChild(c); }
};

PAGES.blog = function (main) {
  var month = param("month"), pageNo = Math.max(1, +param("page") || 1);
  var posts = M.posts.slice().sort(byDateDesc).filter(function (p) { return !month || p.date.slice(0, 7) === month; });
  main.appendChild(el("h1", { class: "title", text: month ? "Posts from " + MONTHS[+month.slice(5) - 1] + " " + month.slice(0, 4) : "Blog" }));
  var pages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  posts.slice((pageNo - 1) * POSTS_PER_PAGE, pageNo * POSTS_PER_PAGE).forEach(function (p) { main.appendChild(postBlock(p)); });
  var pager = el("div", { class: "pager" }, ["Page: "]);
  for (var i = 1; i <= pages; i++) {
    pager.appendChild(i === pageNo ? el("b", { text: String(i) }) : el("a", { href: "blog.html?page=" + i + (month ? "&month=" + month : ""), text: String(i) }));
    pager.appendChild(document.createTextNode(" "));
  }
  main.appendChild(pager);
  var c = commentsBox("lowlight:blog", "Comments");
  if (c) main.appendChild(c);
};

/* ---------- start ---------- */
document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-page");
  buildChrome(page);
  var cols = el("div", { class: "cols" });
  var main = el("div", { class: "main" });
  cols.appendChild(sidebar());
  cols.appendChild(main);
  $(".page").insertBefore(cols, $(".ll-foot"));
  if (PAGES[page]) PAGES[page](main);
  // jump to #album-id or #post-id after the page is built
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
});
