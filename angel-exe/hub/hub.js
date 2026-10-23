/*
  hub.js — fills in the forum table on the hub from shared/sites.js.
  To add a site to the hub: add it to shared/sites.js, then add its key
  to one of the lists in HUB_SECTIONS below.
*/
var HUB_SECTIONS = [
  { title: "angel.exe", keys: ["game"] },
  { title: "Around the web", keys: ["social", "music", "blogs", "forum"] }
];

// Made-up forum stats shown in the Topics / Posts / Last Post columns.
var HUB_STATS = {
  game:   { topics: 0,  posts: 0,   last: "No Posts" },
  social: { topics: 48, posts: 1203, last: "Thu Oct 23, 2008 1:14 am<br>theo.static" },
  music:  { topics: 27, posts: 214, last: "Tue Oct 21, 2008 9:12 pm<br>kestrel" },
  blogs:  { topics: 0,  posts: 0,   last: "No Posts" },
  forum:  { topics: 0,  posts: 0,   last: "No Posts" }
};

document.addEventListener("DOMContentLoaded", function () {
  var table = document.getElementById("forumTable");
  HUB_SECTIONS.forEach(function (section) {
    var cat = document.createElement("tr");
    cat.innerHTML = '<td class="cat" colspan="5"></td>';
    cat.firstChild.textContent = section.title;
    table.appendChild(cat);

    section.keys.forEach(function (key) {
      var s = window.SITES[key];
      if (!s) return;
      var href = window.siteLink(key);
      var stat = HUB_STATS[key] || { topics: 0, posts: 0, last: "No Posts" };
      var tr = document.createElement("tr");
      tr.className = "r1" + (href ? "" : " soon");

      var icon = href ? (stat.posts ? "hub/folder-new.svg" : "hub/folder.svg") : "hub/folder-locked.svg";
      tr.innerHTML =
        '<td class="icon"><img src="' + icon + '" width="32" height="26" alt=""></td>' +
        '<td><div class="forum-name"></div><div class="forum-desc"></div><div class="forum-domain"></div></td>' +
        '<td class="num">' + stat.topics + '</td>' +
        '<td class="num">' + stat.posts + '</td>' +
        '<td class="last">' + stat.last + '</td>';

      var name = tr.querySelector(".forum-name");
      if (href) {
        var a = document.createElement("a");
        a.href = href;
        a.textContent = s.name;
        name.appendChild(a);
      } else {
        name.textContent = s.name;
        var lock = document.createElement("span");
        lock.className = "lock";
        lock.textContent = "[ coming soon ]";
        name.appendChild(lock);
      }
      tr.querySelector(".forum-desc").textContent = s.blurb;
      if (href) tr.querySelector(".forum-domain").textContent = "sogz.cc/angel-exe/" + s.url.replace(/index\.html$/, "");
      table.appendChild(tr);
    });
  });
});
