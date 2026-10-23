/*
  check.js - an automatic continuity check.

  Every time you open a page ON YOUR OWN COMPUTER, this looks for things
  that don't add up: a friend who doesn't exist, a comment dated after
  the present day, an age that doesn't match a birthday, and so on.
  Problems are listed in the browser console (press F12) and a small
  yellow bar appears at the bottom of the page. Players on sogz.cc never
  see the bar.

  It only warns. It never changes anything. If something is deliberate
  (a planned contradiction for the mystery), add its text to IGNORE below.
*/
(function () {
  var IGNORE = [
    // example: "comment on theo.static from angel"
  ];

  var warnings = [];
  function warn(msg) {
    for (var i = 0; i < IGNORE.length; i++) if (msg.indexOf(IGNORE[i]) !== -1) return;
    warnings.push(msg);
  }

  var chars = window.ANGEL_CHARACTERS || {};
  var timeline = window.ANGEL_TIMELINE || { events: [] };
  var today = timeline.presentDay || "9999-12-31";
  var members = window.MEMBERS || [];
  var deleted = window.DELETED_MEMBERS || {};
  var byName = {};
  members.forEach(function (m) { byName[m.username] = m; });

  function day(d) { return String(d || "").slice(0, 10); }
  function exists(u) { return byName[u] || deleted[u]; }
  function future(d, what) { if (d && day(d) > today) warn(what + " is dated " + d + ", after the present day " + today); }

  // characters
  Object.keys(chars).forEach(function (id) {
    var c = chars[id];
    if (c.id !== id) warn("character " + id + " has id \"" + c.id + "\" (they should match)");
    if (c.born && c.age != null) {
      var b = c.born.split("-"), t = today.split("-");
      var age = t[0] - b[0] - ((t[1] + t[2]) < (b[1] + b[2]) ? 1 : 0);
      if (age !== c.age) warn(id + " is " + c.age + " but born " + c.born + " makes them " + age + " on " + today);
    }
    var os = c.accounts && c.accounts.orbitspace;
    if (os && window.MEMBERS && !exists(os)) warn(id + "'s OrbitSpace username \"" + os + "\" has no profile in members.js");
  });

  // timeline
  timeline.events.forEach(function (e) {
    (e.who || []).forEach(function (w) { if (!chars[w]) warn("timeline event \"" + e.event + "\" names unknown character \"" + w + "\""); });
  });

  // OrbitSpace profiles
  members.forEach(function (m) {
    var c = chars[m.character];
    if (m.character && !c) warn(m.username + " points to unknown character \"" + m.character + "\"");
    if (c && c.accounts && c.accounts.orbitspace !== m.username) warn(m.username + " is linked to " + m.character + ", whose OrbitSpace username is \"" + c.accounts.orbitspace + "\"");
    future(m.joined, m.username + " joined");
    future(m.lastLogin, m.username + "'s last login");

    (m.friends || []).forEach(function (f) {
      if (!exists(f)) warn(m.username + " has friend \"" + f + "\" who doesn't exist");
      else if (byName[f] && (byName[f].friends || []).indexOf(m.username) === -1) warn(m.username + " lists " + f + " as a friend, but not the other way round");
    });
    (m.topFriends || []).forEach(function (f) {
      if ((m.friends || []).indexOf(f) === -1) warn(m.username + " has " + f + " in Top Friends but not in friends");
    });
    (m.comments || []).forEach(function (cm) {
      var from = byName[cm.from];
      if (!exists(cm.from)) warn("comment on " + m.username + " from unknown user \"" + cm.from + "\"");
      future(cm.date, "comment on " + m.username + " from " + cm.from);
      if (day(cm.date) < day(m.joined)) warn("comment on " + m.username + " from " + cm.from + " is dated before " + m.username + " joined");
      if (from && day(cm.date) < day(from.joined)) warn("comment on " + m.username + " from " + cm.from + " is dated before " + cm.from + " joined");
    });
    (m.archive || []).forEach(function (a) {
      future(a.date, m.username + "'s archived version");
      if (day(a.date) < day(m.joined)) warn(m.username + "'s archive from " + a.date + " is before they joined");
      (a.topFriends || []).forEach(function (f) {
        var fm = byName[f];
        if (!exists(f)) warn(m.username + "'s archive lists unknown friend \"" + f + "\"");
        if (fm && day(a.date) < day(fm.joined)) warn(m.username + "'s archive from " + a.date + " lists " + f + ", who hadn't joined yet");
      });
    });
  });

  // friendships that start later than an archive shows them
  (window.ACTIVITY || []).forEach(function (act) {
    future(act.date, "activity \"" + act.text + "\" by " + act.who);
    if (!exists(act.who)) warn("activity by unknown user \"" + act.who + "\"");
    if (act.type === "friend" && /is now friends with/.test(act.text)) {
      var who = byName[act.who];
      members.forEach(function (other) {
        if (act.text.indexOf(other.displayName) === -1 || !who) return;
        [[who, other], [other, who]].forEach(function (pair) {
          (pair[0].archive || []).forEach(function (a) {
            if (day(a.date) < day(act.date) && (a.topFriends || []).indexOf(pair[1].username) !== -1) {
              warn(pair[0].username + "'s archive from " + a.date + " shows " + pair[1].username + " as a top friend, but they only became friends on " + day(act.date));
            }
          });
        });
      });
    }
  });
  (window.BULLETINS || []).forEach(function (b) { future(b.date, "bulletin \"" + b.title + "\""); });

  window.ANGEL_CONTINUITY_WARNINGS = warnings;
  if (!warnings.length) return;
  warnings.forEach(function (w) { console.warn("[angel.exe continuity] " + w); });

  // the yellow bar, only when previewing from your own computer
  if (location.protocol !== "file:") return;
  function showBar() {
    var bar = document.createElement("div");
    bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#ffffe1;border-top:1px solid #c9b440;color:#000;font:12px Verdana,sans-serif;padding:4px 8px";
    bar.textContent = "continuity check: " + warnings.length + " thing(s) don't add up. Press F12 and open Console to see them. (Only you see this bar.)";
    document.body.appendChild(bar);
  }
  if (document.body) showBar(); else document.addEventListener("DOMContentLoaded", showBar);
})();
