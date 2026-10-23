/*
  social.js — builds the OrbitSpace pages from the data files.

  You usually DON'T need to edit this file. Content lives in:
    data/members.js   (profiles, friends, comments, archives)
    data/activity.js  (friend activity feed and bulletins)
  Colours and layout live in css/social.css.

  Every HTML page has <body data-page="...">. The matching function
  at the bottom of this file fills that page in.
*/

/* ---------- things you might want to change ---------- */

// The links in the blue strip under the header.
var NAV_LINKS = [
  { label: "Home",     href: "index.html",  page: "home" },
  { label: "Browse",   href: "browse.html", page: "browse" },
  { label: "Activity", href: "feed.html",   page: "feed" },
  { label: "Bulletins", href: "feed.html#bulletins", page: "" },
  { label: "Music",    site: "music" },
  { label: "Forum",    site: "forum" },
  { label: "Help",     href: "index.html#help", page: "" }
];

// The story's "today" on this site. Used for "Last Login" wording.
var TODAY = "2008-10-23";

/* ---------- small helpers ---------- */

function $(sel) { return document.querySelector(sel); }

// Make an element. Text is always inserted as plain text, so a "<" in
// a comment can never break the page.
function el(tag, attrs, children) {
  var node = document.createElement(tag);
  attrs = attrs || {};
  for (var k in attrs) {
    if (k === "text") node.textContent = attrs[k];
    else if (k === "class") node.className = attrs[k];
    else node.setAttribute(k, attrs[k]);
  }
  (children || []).forEach(function (c) {
    if (c == null) return;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  });
  return node;
}

function member(username) {
  for (var i = 0; i < window.MEMBERS.length; i++) {
    if (window.MEMBERS[i].username === username) return window.MEMBERS[i];
  }
  return null;
}

function avatarSrc(m) {
  return "images/avatars/" + ((m && m.avatar) || "default.svg");
}

function profileHref(username) {
  return "profile.html?u=" + encodeURIComponent(username);
}

function param(name) {
  var match = new RegExp("[?&]" + name + "=([^&#]*)").exec(location.search);
  return match ? decodeURIComponent(match[1]) : "";
}

// "2008-10-21 22:14" -> "Oct 21, 2008 10:14 PM"
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function prettyDate(s, withTime) {
  var p = s.split(/[- :]/);
  var out = MONTHS[+p[1] - 1] + " " + (+p[2]) + ", " + p[0];
  if (withTime && p[3] != null) {
    var h = +p[3], ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    out += " " + h + ":" + p[4] + " " + ampm;
  }
  return out;
}

// A stable, made-up "profile views" number for each member.
function viewCount(username) {
  var n = 0;
  for (var i = 0; i < username.length; i++) n = (n * 31 + username.charCodeAt(i)) % 9000;
  return 1000 + n;
}

function personCard(m, small) {
  var card = el("div", { class: "person-card" });
  var a = el("a", { href: profileHref(m.username) }, [m.displayName]);
  var img = el("img", { src: avatarSrc(m), alt: m.displayName });
  card.appendChild(a);
  card.appendChild(el("a", { href: profileHref(m.username) }, [img]));
  if (!small) {
    card.appendChild(m.online
      ? el("span", { class: "online-now" }, [el("img", { src: "images/icons/online.svg", alt: "" }), "Online Now!"])
      : el("span", { class: "small", text: "last login " + prettyDate(m.lastLogin) }));
  }
  return card;
}

function box(title, more, bodyChildren) {
  var head = el("div", { class: "box-head" }, [title]);
  if (more) head.appendChild(el("span", { class: "more" }, [more]));
  return el("div", { class: "box" }, [head, el("div", { class: "box-body" }, bodyChildren)]);
}

/* ---------- header, nav and footer (the same on every page) ---------- */

function buildChrome(currentPage) {
  var page = $(".page");

  var search = el("form", { id: "searchForm" }, [
    el("input", { type: "text", id: "searchInput", placeholder: "search people" }),
    el("select", {}, [el("option", { text: "People" })]),
    el("button", { class: "btn", type: "submit", text: "Search" })
  ]);
  var header = el("div", { class: "site-header" }, [
    el("a", { class: "logo", href: "index.html" }, [el("img", { src: "images/logo.svg", alt: "OrbitSpace", width: "260", height: "54" })]),
    el("div", { class: "header-search" }, [
      search,
      el("a", { href: "index.html#help", text: "Help" }), " | ",
      el("a", { href: "index.html", text: "Sign Up" }), " | ",
      el("a", { href: "index.html", text: "Log In" })
    ])
  ]);

  var nav = el("div", { class: "site-nav" });
  NAV_LINKS.forEach(function (link, i) {
    if (i > 0) nav.appendChild(el("span", { class: "sep", text: "|" }));
    var href = link.href;
    if (link.site) href = window.siteLink(link.site);
    if (!href) {
      nav.appendChild(el("span", { title: "coming soon", style: "opacity:.6", text: link.label }));
    } else {
      nav.appendChild(el("a", { href: href, class: link.page === currentPage ? "here" : "", text: link.label }));
    }
  });

  page.insertBefore(nav, page.firstChild);
  page.insertBefore(header, nav);

  // Footer: links to the other companion sites (from shared/sites.js).
  var elsewhere = el("div", { class: "elsewhere" }, ["elsewhere on the web: "]);
  var first = true;
  ["hub", "music", "blogs", "forum"].forEach(function (key) {
    var s = window.SITES[key];
    if (!s) return;
    if (!first) elsewhere.appendChild(document.createTextNode(" · "));
    first = false;
    var href = window.siteLink(key);
    elsewhere.appendChild(href ? el("a", { href: href, text: s.name }) : el("span", { class: "muted", text: s.name + " (soon)" }));
  });
  page.appendChild(el("div", { class: "site-footer" }, [
    elsewhere,
    el("div", {}, [
      el("a", { href: "index.html#help", text: "About" }), " | ",
      el("a", { href: "index.html#help", text: "FAQ" }), " | ",
      el("a", { href: "index.html#help", text: "Terms" }), " | ",
      el("a", { href: "index.html#help", text: "Privacy" })
    ]),
    el("div", { text: "©2005-2008 OrbitSpace. All Rights Reserved. A fictional website from the game angel.exe." })
  ]));

  search.addEventListener("submit", function (e) {
    e.preventDefault();
    location.href = "browse.html?q=" + encodeURIComponent($("#searchInput").value);
  });
}

// Anything that would need a real account just shows a friendly notice.
function needsLogin(target) {
  var n = $(target);
  if (n) { n.classList.add("show"); }
}

/* ================================================================== */
/*  PAGES                                                              */
/* ================================================================== */

var PAGES = {};

/* ---------- index.html ---------- */
PAGES.home = function () {
  var cool = $("#coolNewPeople");
  window.MEMBERS.filter(function (m) { return m.username !== "orbit"; })
    .forEach(function (m) { cool.appendChild(personCard(m)); });

  renderFeed($("#homeFeed"), 6);

  var total = $("#memberCount");
  if (total) total.textContent = window.MEMBERS.length;

  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    needsLogin("#loginNotice");
  });
};

/* ---------- feed.html ---------- */
PAGES.feed = function () {
  renderFeed($("#fullFeed"), 999);

  var list = $("#bulletinList");
  window.BULLETINS.slice().sort(byDateDesc).forEach(function (b) {
    var m = member(b.who) || { displayName: b.who, username: b.who };
    list.appendChild(el("div", { class: "bulletin" }, [
      el("h4", {}, [el("a", { href: profileHref(m.username), text: m.displayName }), ": " + b.title]),
      el("div", { class: "small", text: prettyDate(b.date, true) }),
      el("p", { text: b.text })
    ]));
  });
};

function byDateDesc(a, b) { return a.date < b.date ? 1 : a.date > b.date ? -1 : 0; }

function renderFeed(list, limit) {
  var lastDay = "";
  window.ACTIVITY.slice().sort(byDateDesc).slice(0, limit).forEach(function (item) {
    var day = item.date.slice(0, 10);
    if (day !== lastDay) {
      list.appendChild(el("li", { class: "day", text: prettyDate(day) }));
      lastDay = day;
    }
    var m = member(item.who) || { displayName: item.who, username: item.who };
    list.appendChild(el("li", {}, [
      el("img", { class: "icon", src: "images/icons/" + item.type + ".svg", alt: "" }),
      el("span", {}, [el("a", { href: profileHref(m.username), text: m.displayName }), " " + item.text]),
      el("span", { class: "when", text: prettyDate(item.date, true).split(", ")[1].replace(/^\d{4} /, "") })
    ]));
  });
}

/* ---------- browse.html ---------- */
PAGES.browse = function () {
  var q = param("q").toLowerCase();
  var grid = $("#browseGrid");
  if (q) $("#browseTitle").textContent = 'Search results for "' + param("q") + '"';

  var found = window.MEMBERS.filter(function (m) {
    if (!q) return true;
    return (m.displayName + " " + m.username + " " + m.location + " " + m.interests).toLowerCase().indexOf(q) !== -1;
  });
  found.forEach(function (m) { grid.appendChild(personCard(m)); });
  if (!found.length) grid.appendChild(el("p", { class: "muted", text: "No people matched your search." }));
  $("#browseCount").textContent = found.length;
};

/* ---------- profile.html?u=username ---------- */
PAGES.profile = function () {
  var username = param("u") || "orbit";
  var m = member(username);
  var root = $("#profileRoot");

  if (!m) { renderGone(root, username); return; }
  document.title = m.displayName + "'s OrbitSpace";
  applyTheme(m.theme);

  // LEFT COLUMN
  var left = el("div", { class: "col-left" });

  var facts = el("div", { class: "facts" }, [
    el("div", { text: '"' + m.headline + '"' }),
    m.gender ? el("div", { text: m.gender }) : null,
    m.age ? el("div", { text: m.age + " years old" }) : null,
    el("div", { text: m.location }),
    el("div", {}, [m.online
      ? el("span", { class: "online-now" }, [el("img", { src: "images/icons/online.svg", alt: "" }), "Online Now!"])
      : el("span", { class: "offline-now", text: "Last Login: " + prettyDate(m.lastLogin) })])
  ]);
  left.appendChild(el("div", { class: "box" }, [
    el("div", { class: "profile-top" }, [
      el("img", { class: "avatar", src: avatarSrc(m), alt: m.displayName }),
      el("div", {}, [el("h1", { text: m.displayName }), facts])
    ]),
    el("div", { class: "mood-line" }, [el("b", { text: "Mood: " }), m.mood]),
    el("div", { class: "mood-line" }, [el("b", { text: "Status: " }), m.status]),
    el("div", { class: "mood-line small" }, ["View My: ",
      el("a", { href: "archive.html?u=" + encodeURIComponent(m.username), text: "Profile Archive" }),
      " | Profile Views: ", el("span", { class: "counter", text: String(viewCount(m.username)) })])
  ]));

  // contact box
  var actions = [
    ["Send Message", "status"], ["Forward to Friend", "friend"],
    ["Add to Friends", "friend"], ["Add to Favorites", "layout"],
    ["Instant Message", "comment"], ["Block User", "mood"]
  ];
  var ct = el("table", { class: "contact-table" });
  for (var i = 0; i < actions.length; i += 2) {
    var tr = el("tr");
    [actions[i], actions[i + 1]].forEach(function (a) {
      var link = el("a", { href: "#" }, [el("img", { src: "images/icons/" + a[1] + ".svg", alt: "" }), a[0]]);
      link.addEventListener("click", function (e) { e.preventDefault(); needsLogin("#profileNotice"); });
      tr.appendChild(el("td", {}, [link]));
    });
    ct.appendChild(tr);
  }
  left.appendChild(box("Contacting " + m.displayName, null, [ct,
    el("div", { class: "notice", id: "profileNotice", text: "You must be logged in to do that. (New sign-ups are closed right now. Sorry!)" })]));

  left.appendChild(el("div", { class: "box" }, [
    el("div", { class: "url-box" }, [el("b", { text: "OrbitSpace URL: " }),
      "http://www." + window.SITES.social.storyDomain + "/" + m.username])
  ]));

  // interests + music
  var interests = el("table", { class: "rows" }, [
    el("tr", {}, [el("td", { class: "label", text: "General" }), el("td", { text: m.interests })]),
    el("tr", {}, [el("td", { class: "label", text: "Member Since" }), el("td", { text: prettyDate(m.joined) })])
  ]);
  left.appendChild(box(m.displayName + "'s Interests", null, [interests]));

  if (m.music && m.music.length) {
    var musicList = el("ul", { class: "music-list" });
    var musicHref = window.siteLink("music");
    m.music.forEach(function (song) {
      // Artist names will link to the music site once it exists (Milestone 3).
      var name = musicHref
        ? el("a", { href: musicHref, text: song.artist })
        : el("b", { title: "music site coming soon", text: song.artist });
      musicList.appendChild(el("li", {}, [name, song.note ? " - " + song.note : ""]));
    });
    left.appendChild(box("Music", null, [musicList]));
  }

  // RIGHT COLUMN
  var right = el("div", { class: "col-right" });

  right.appendChild(box(m.displayName + "'s Blurbs", null, [el("div", { class: "blurb" }, [
    el("h3", { text: "About me:" }), el("p", { text: m.about }),
    el("h3", { text: "Who I'd like to meet:" }), el("p", { text: m.whoToMeet })
  ])]));

  // friend space
  var grid = el("div", { class: "friend-grid" });
  (m.topFriends || []).forEach(function (u) {
    var f = member(u);
    if (f) grid.appendChild(personCard(f, true));
  });
  right.appendChild(box(m.displayName + "'s Friend Space", el("a", { href: "browse.html", text: "View All of " + m.displayName + "'s Friends" }), [
    el("div", { class: "friend-space" }, [
      el("div", { class: "count" }, [m.displayName + " has ", el("span", { class: "orange", text: String(m.friends.length) }), " friends."]),
      grid
    ])
  ]));

  // comments
  var table = el("table");
  m.comments.slice().sort(byDateDesc).forEach(function (c) {
    var from = member(c.from) || { displayName: c.from, username: c.from };
    table.appendChild(el("tr", {}, [
      el("td", { class: "who" }, [
        el("a", { href: profileHref(from.username), text: from.displayName }),
        el("a", { href: profileHref(from.username) }, [el("img", { src: avatarSrc(from), alt: "" })])
      ]),
      el("td", {}, [el("div", { class: "date", text: prettyDate(c.date, true) }), el("div", { text: c.text })])
    ]));
  });
  if (!m.comments.length) table.appendChild(el("tr", {}, [el("td", { text: "No comments yet." })]));

  var form = el("form", { class: "comment-form" }, [
    el("textarea", { placeholder: "Add a comment..." }),
    el("button", { class: "btn", type: "submit", text: "Post Comment" }),
    el("div", { class: "notice", id: "commentNotice", text: "You must be logged in to leave a comment." })
  ]);
  form.addEventListener("submit", function (e) { e.preventDefault(); needsLogin("#commentNotice"); });

  right.appendChild(box(m.displayName + "'s Friends Comments", el("span", { text: "Displaying " + m.comments.length + " of " + m.comments.length + " comments" }), [
    el("div", { class: "comments" }, [table]), form
  ]));

  root.appendChild(el("div", { class: "cols" }, [left, right]));
};

function applyTheme(t) {
  if (!t) return;
  var s = document.body.style;
  document.body.classList.add("profile-page");
  s.setProperty("--p-bg", t.background);
  s.setProperty("--p-panel", t.panel);
  s.setProperty("--p-header", t.header);
  s.setProperty("--p-head-text", t.headerText);
  s.setProperty("--p-text", t.text);
  s.setProperty("--p-link", t.link);
  if (t.pattern && t.pattern !== "none") {
    // The path starts with ../ because it is read from inside css/social.css.
    s.setProperty("--p-pattern", 'url("../images/pattern-' + t.pattern + '.svg")');
  }
}

function renderGone(root, username) {
  var deleted = window.DELETED_MEMBERS && window.DELETED_MEMBERS[username];
  root.appendChild(el("div", { class: "gone" }, [
    el("img", { src: "images/avatars/default.svg", alt: "" }),
    el("h2", { text: deleted ? "This profile is no longer available." : "Invalid Friend ID." }),
    el("p", { text: deleted
      ? "The user may have deleted their account."
      : "This user has either cancelled their membership, or their account has been deleted." }),
    el("p", {}, [el("a", { href: "index.html", text: "« Back to OrbitSpace Home" })])
  ]));
}

/* ---------- archive.html?u=username ---------- */
PAGES.archive = function () {
  var username = param("u") || "orbit";
  var m = member(username);
  var root = $("#archiveRoot");
  if (!m) { renderGone(root, username); return; }

  document.title = m.displayName + "'s Profile Archive";
  $("#archiveTitle").textContent = m.displayName + "'s Profile Archive";
  $("#archiveBack").setAttribute("href", profileHref(m.username));

  if (!m.archive || !m.archive.length) {
    root.appendChild(el("p", { class: "muted", text: "No saved versions of this profile." }));
    return;
  }

  m.archive.slice().sort(byDateDesc).forEach(function (v) {
    var entry = el("div", { class: "archive-entry" }, [
      el("div", { class: "stamp", text: "SAVED " + prettyDate(v.date) + " · " + v.note })
    ]);
    if (v.hiddenByOwner) {
      entry.appendChild(el("p", { class: "hidden-version", text: "The owner of this profile has hidden this version." }));
      root.appendChild(entry);
      return;
    }
    var friends = el("span");
    (v.topFriends || []).forEach(function (u, i) {
      if (i > 0) friends.appendChild(document.createTextNode(", "));
      var f = member(u);
      friends.appendChild(el("a", { href: profileHref(u), text: f ? f.displayName : u }));
    });
    entry.appendChild(el("table", { class: "rows" }, [
      el("tr", {}, [el("td", { class: "label", text: "Headline" }), el("td", { text: v.headline })]),
      el("tr", {}, [el("td", { class: "label", text: "Mood" }), el("td", { text: v.mood })]),
      el("tr", {}, [el("td", { class: "label", text: "Status" }), el("td", { text: v.status })]),
      el("tr", {}, [el("td", { class: "label", text: "About me" }), el("td", {}, [el("p", { text: v.about })])]),
      el("tr", {}, [el("td", { class: "label", text: "Top Friends" }), el("td", {}, [friends])])
    ]));
    root.appendChild(entry);
  });
};

/* ---------- start ---------- */
document.addEventListener("DOMContentLoaded", function () {
  var page = document.body.getAttribute("data-page");
  buildChrome(page);
  if (PAGES[page]) PAGES[page]();
});
