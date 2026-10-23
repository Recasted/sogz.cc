/*
  sites.js — the ONE place where every angel.exe website is listed.

  Each page loads this file first. If you rename or move a site's
  folder, change "url" for that site here and every link updates.

  Everything lives on sogz.cc, inside the angel-exe folder:
    sogz.cc/angel-exe/             the hub (the GAMES card links here)
    sogz.cc/angel-exe/orbitspace/  the social network
    sogz.cc/angel-exe/lowlight/    the music site
    sogz.cc/angel-exe/homepages/   Starlit, the characters' personal homepages
    sogz.cc/angel-exe/forum/       nightshift, the anonymous message board
  "url" is relative to the angel-exe folder, so the same links work
  on your computer and on sogz.cc.

  "storyDomain" is a made-up web address shown INSIDE the story (for
  example on a profile's "OrbitSpace URL" line). It is never a real
  address and nothing needs to be bought.

  "status": "open"  = the site is built and linked
            "soon"  = shown on the hub as "coming soon", not clickable
*/
window.SITES = {
  hub: {
    name: "angel.exe community",
    storyDomain: "",
    url: "index.html",
    status: "open",
    blurb: "The front door. Every site in the game is linked from here."
  },
  game: {
    name: "angel.exe (official game page)",
    storyDomain: "",                     // put the Steam page address in "url" when it exists
    url: "",
    status: "soon",
    blurb: "The Steam page for the game. Coming when the game is announced."
  },
  social: {
    name: "OrbitSpace",
    storyDomain: "orbitspace.net",       // made-up, shown inside the story only
    url: "orbitspace/index.html",
    status: "open",
    blurb: "you're never alone in orbit. Profiles, friends, comments and bulletins."
  },
  music: {
    name: "LowLight",
    storyDomain: "lowlight.fm",          // made-up, shown inside the story only
    url: "lowlight/index.html",
    status: "open",
    blurb: "music for the hours after midnight. Real artists, reviews and reader playlists."
  },
  blogs: {
    name: "Starlit homepages",
    storyDomain: "starlit.net",          // made-up, shown inside the story only
    url: "homepages/index.html",
    status: "open",
    blurb: "Free personal homepages. Diaries, guestbooks, poetry, lyrics and fanfic."
  },
  forum: {
    name: "nightshift",
    storyDomain: "nightshift.org",       // made-up, shown inside the story only
    url: "forum/index.html",
    status: "open",
    blurb: "Anonymous boards for people who are awake when they shouldn't be."
  }
  // The experimental mystery site (Milestone 5) is deliberately NOT listed
  // here yet. Players should find it through clues, not the front page.
};

/*
  Helper used by every page: turns a site key into a working link.
  ROOT is set by each page (for example "../" for pages inside /social/).
*/
window.siteLink = function (key) {
  var s = window.SITES[key];
  if (!s || s.status !== "open" || !s.url) return null;
  if (/^https?:\/\//.test(s.url)) return s.url;
  return (window.ROOT || "") + s.url;
};
