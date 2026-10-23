/*
  comments.js — the player comment box used on every angel.exe site.

  No accounts and no login. A player picks a name and one of the
  standard avatars once, and every angel.exe site remembers it.

  A new comment is checked by filter.js, then sent to your Google Form
  (see comments-config.js) and waits there until you approve it. The
  player sees their own comment right away, marked "waiting for
  approval". Approved comments live in approved-comments.js and are
  shown to everyone.

  To put a comment box on a page:
    1. load these files (after shared/sites.js):
         shared/comments-config.js, shared/approved-comments.js,
         shared/filter.js, shared/comments.js
       and the stylesheet shared/comments.css
    2. add an empty element, for example <div id="visitorComments"></div>
    3. call  AngelComments.mount("#visitorComments", "some:thread:name");
  The thread name decides which comments appear in that box.
*/
(function () {
  var GUEST_KEY = "angelexe.guest";      // the player's name and avatar
  var PENDING_KEY = "angelexe.pending";  // their comments waiting for approval
  var LAST_POST_KEY = "angelexe.lastPost";

  /* ---------- browser storage (can fail in private windows) ---------- */
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  /* ---------- the player's identity ---------- */
  function getGuest() { return load(GUEST_KEY, null); }

  function avatarUrl(id) {
    var list = window.GUEST_AVATARS || [];
    for (var i = 0; i < list.length; i++) {
      if (list[i].id === id) return (window.ROOT || "") + "shared/avatars/" + list[i].file;
    }
    return (window.ROOT || "") + "shared/avatars/" + (list[0] ? list[0].file : "guest-cat.svg");
  }

  function checkName(name) {
    name = String(name || "").trim();
    if (name.length < 2 || name.length > 20) return "Pick a name between 2 and 20 characters.";
    if (!/^[A-Za-z0-9 ._~*\-]+$/.test(name)) return "Use letters, numbers, spaces and . _ - ~ * only.";
    var f = window.AngelFilter.check(name);
    if (!f.ok) return "That name isn't allowed. Pick another one :)";
    return "";
  }

  /* ---------- sending to the Google Form ---------- */
  function formTarget() {
    var link = (window.COMMENTS_CONFIG || {}).googleFormPrefilledLink || "";
    if (!link) return null;
    var match = /forms\/d\/e\/([^/]+)\//.exec(link);
    if (!match) return null;
    var fields = {};
    var re = /entry\.(\d+)=([^&]*)/g, m;
    while ((m = re.exec(link))) fields[decodeURIComponent(m[2]).toUpperCase()] = "entry." + m[1];
    if (!fields.THREAD || !fields.NAME || !fields.AVATAR || !fields.TEXT) return null;
    return { url: "https://docs.google.com/forms/d/e/" + match[1] + "/formResponse", fields: fields };
  }

  function send(comment) {
    var target = formTarget();
    if (!target) return Promise.resolve(false);
    var body = new URLSearchParams();
    body.append(target.fields.THREAD, comment.thread);
    body.append(target.fields.NAME, comment.name);
    body.append(target.fields.AVATAR, comment.avatar);
    body.append(target.fields.TEXT, comment.text);
    // Google Forms doesn't let pages read its reply ("no-cors"), so we
    // can't confirm it arrived. Network errors still reject.
    return fetch(target.url, { method: "POST", mode: "no-cors", body: body })
      .then(function () { return true; });
  }

  /* ---------- dates ---------- */
  function now() {
    var d = new Date();
    function two(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate()) + " " + two(d.getHours()) + ":" + two(d.getMinutes());
  }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function pretty(s) {
    var p = String(s).split(/[- :]/);
    if (p.length < 3) return s;
    var h = +(p[3] || 0), ampm = h >= 12 ? "PM" : "AM";
    return MONTHS[+p[1] - 1] + " " + (+p[2]) + ", " + p[0] + (p[3] != null ? " " + (h % 12 || 12) + ":" + p[4] + " " + ampm : "");
  }

  /* ---------- building the box ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderIdentity(wrap, onDone) {
    wrap.innerHTML = "";
    var guest = getGuest() || { name: "", avatar: (window.GUEST_AVATARS[0] || {}).id };
    var box = el("div", "ac-identity");
    box.appendChild(el("div", "ac-title", "Pick a name and a picture"));
    box.appendChild(el("div", "ac-hint", "No sign-up needed. Every angel.exe site will remember you on this computer."));

    var input = el("input", "ac-name");
    input.type = "text"; input.maxLength = 20; input.value = guest.name; input.placeholder = "your name";
    box.appendChild(input);

    var pics = el("div", "ac-avatars");
    var chosen = guest.avatar;
    (window.GUEST_AVATARS || []).forEach(function (a) {
      var b = el("button", "ac-avatar" + (a.id === chosen ? " on" : ""));
      b.type = "button"; b.title = a.label;
      var img = el("img"); img.src = avatarUrl(a.id); img.alt = a.label;
      b.appendChild(img);
      b.addEventListener("click", function () {
        chosen = a.id;
        Array.prototype.forEach.call(pics.children, function (c) { c.classList.remove("on"); });
        b.classList.add("on");
      });
      pics.appendChild(b);
    });
    box.appendChild(pics);

    var err = el("div", "ac-error");
    var ok = el("button", "ac-btn", "Save");
    ok.type = "button";
    ok.addEventListener("click", function () {
      var problem = checkName(input.value);
      if (problem) { err.textContent = problem; return; }
      save(GUEST_KEY, { name: input.value.trim(), avatar: chosen });
      onDone();
    });
    box.appendChild(ok);
    box.appendChild(err);
    wrap.appendChild(box);
  }

  function commentRow(c, pending) {
    var row = el("div", "ac-comment" + (pending ? " ac-pending" : ""));
    var pic = el("img", "ac-pic"); pic.src = avatarUrl(c.avatar); pic.alt = "";
    var body = el("div", "ac-body");
    var head = el("div", "ac-head");
    head.appendChild(el("b", null, c.name));
    head.appendChild(document.createTextNode(" · " + pretty(c.date)));
    if (pending) head.appendChild(el("span", "ac-wait", " waiting for approval (only you can see this)"));
    body.appendChild(head);
    body.appendChild(el("div", "ac-text", c.text));
    row.appendChild(pic); row.appendChild(body);
    return row;
  }

  function mount(selector, thread) {
    var root = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!root) return;
    root.classList.add("angel-comments");

    function draw() {
      root.innerHTML = "";
      var approved = (window.APPROVED_COMMENTS || []).filter(function (c) { return c.thread === thread; });
      var pending = load(PENDING_KEY, []).filter(function (c) { return c.thread === thread; });
      // once you approve a comment, stop showing the player's local copy
      pending = pending.filter(function (p) {
        return !approved.some(function (a) { return a.name === p.name && a.text === p.text; });
      });

      var list = el("div", "ac-list");
      var all = approved.map(function (c) { return [c, false]; })
        .concat(pending.map(function (c) { return [c, true]; }))
        .sort(function (a, b) { return a[0].date < b[0].date ? 1 : -1; });
      if (!all.length) list.appendChild(el("div", "ac-empty", "No visitor comments yet. Be the first!"));
      all.forEach(function (pair) { list.appendChild(commentRow(pair[0], pair[1])); });

      var formWrap = el("div", "ac-form");
      var guest = getGuest();
      if (!guest) {
        renderIdentity(formWrap, draw);
      } else {
        var who = el("div", "ac-who");
        var me = el("img", "ac-pic small"); me.src = avatarUrl(guest.avatar); me.alt = "";
        who.appendChild(me);
        who.appendChild(document.createTextNode(" Posting as "));
        who.appendChild(el("b", null, guest.name));
        var change = el("a", "ac-change", "change");
        change.href = "#";
        change.addEventListener("click", function (e) { e.preventDefault(); renderIdentity(formWrap, draw); });
        who.appendChild(document.createTextNode(" ("));
        who.appendChild(change);
        who.appendChild(document.createTextNode(")"));
        formWrap.appendChild(who);

        var area = el("textarea", "ac-input");
        var max = (window.COMMENTS_CONFIG || {}).maxLength || 500;
        area.maxLength = max;
        area.placeholder = "Leave a comment...";
        formWrap.appendChild(area);

        var status = el("div", "ac-status");
        var post = el("button", "ac-btn", "Post Comment");
        post.type = "button";
        post.addEventListener("click", function () {
          var text = area.value.trim();
          if (!text) { status.textContent = "Write something first :)"; return; }
          var f = window.AngelFilter.check(text);
          if (!f.ok) { status.textContent = f.reason; return; }
          var wait = ((window.COMMENTS_CONFIG || {}).secondsBetweenPosts || 30) * 1000;
          var last = load(LAST_POST_KEY, 0);
          if (Date.now() - last < wait) { status.textContent = "Slow down a little! Try again in a few seconds."; return; }

          var comment = { thread: thread, name: guest.name, avatar: guest.avatar, date: now(), text: text };
          post.disabled = true;
          status.textContent = "Sending...";
          send(comment).then(function (sent) {
            var mine = load(PENDING_KEY, []);
            mine.push(comment);
            save(PENDING_KEY, mine);
            save(LAST_POST_KEY, Date.now());
            draw();
            var s = root.querySelector(".ac-status");
            if (s) s.textContent = sent
              ? "Thanks! Your comment will show up for everyone once it's approved."
              : "Saved on this computer. (The comment inbox isn't connected yet, so nobody else will see it.)";
          }).catch(function () {
            post.disabled = false;
            status.textContent = "Couldn't send your comment. Check your internet and try again.";
          });
        });
        formWrap.appendChild(post);
        formWrap.appendChild(status);
      }

      root.appendChild(list);
      root.appendChild(formWrap);
    }
    draw();
  }

  window.AngelComments = { mount: mount, getGuest: getGuest, avatarUrl: avatarUrl, editIdentity: renderIdentity };
})();
