/*
  clock.js - the story's clock. Every angel.exe site uses it instead of
  the real date, so the sites always feel like 2008.

  The date is always the story's present day (2008-10-23, the same as
  "presentDay" in story/timeline.js). Only the time of day is real, so
  a player at 2 am still sees 2 am, just in 2008.

  To move the story to a new day, change STORY_DAY below (and
  presentDay in timeline.js).

  AngelClock.stamp()    "2008-10-23 23:41" for right now
  AngelClock.date()     the same moment as a JavaScript Date
  AngelClock.fix(s)     turns any real-world stamp (like an old comment
                        saved as 2026-10-24 02:26) into a story stamp
*/
(function () {
  var STORY_DAY = "2008-10-23";

  function two(n) { return (n < 10 ? "0" : "") + n; }
  function day() {
    var t = window.ANGEL_TIMELINE;
    return (t && t.presentDay) || STORY_DAY;
  }
  function date() {
    var real = new Date(), p = day().split("-");
    return new Date(+p[0], +p[1] - 1, +p[2], real.getHours(), real.getMinutes(), real.getSeconds());
  }
  function stamp() {
    var d = date();
    return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate()) + " " + two(d.getHours()) + ":" + two(d.getMinutes());
  }
  // Anything dated after the present day gets moved onto it, keeping its time.
  function fix(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})(.*)$/.exec(String(s || ""));
    if (!m) return s;
    return (m[1] + "-" + m[2] + "-" + m[3]) > day() ? day() + m[4] : s;
  }

  window.AngelClock = { stamp: stamp, date: date, fix: fix, day: day };
})();
