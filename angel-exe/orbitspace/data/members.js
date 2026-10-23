/*
  members.js — every OrbitSpace profile.

  HOW TO EDIT
  - Each member is one block between { and }.
  - Text goes between "quotes". Keep the commas at the end of lines.
  - "avatar" is a file in social/images/avatars/. Replace the .svg with
    your own picture (a .png or .jpg is fine, just change the name here).
  - "friends" and "topFriends" use usernames from this file.
  - "theme" sets the colours of that person's profile page, the way people
    customised MySpace profiles. Any CSS colour works ("#ff66cc", "black").
  - "archive" holds OLD versions of the profile. The archive page shows
    them, so a profile can say one thing now and something else in 2007.

  Dates use the format "2008-03-14 23:41" (year-month-day hour:minute).
  The story's "present day" on this site is 2008-10-23.
*/
window.MEMBERS = [

  /* ------------------------------------------------------------------ */
  {
    username: "orbit",
    displayName: "Ori from OrbitSpace",
    avatar: "orbit.svg",
    age: null,
    gender: "",
    location: "the internet",
    joined: "2005-06-01",
    lastLogin: "2008-10-23",
    online: true,
    mood: "welcoming",
    status: "Ori is happy you're here :)",
    headline: "Welcome to OrbitSpace!",
    about: "Hi! I'm Ori and I run OrbitSpace. Everyone gets me as their first friend, so you're never alone in orbit. If something on the site is broken, leave me a comment and I'll fix it (eventually!!)",
    whoToMeet: "Everyone!",
    music: [],
    interests: "Making websites, keeping the servers alive, reading every single bug report.",
    friends: ["theo.static", "marabelle", "junebug"],
    topFriends: ["theo.static", "marabelle", "junebug"],
    comments: [],
    theme: {
      background: "#e5ecf9",
      pattern: "none",
      panel: "#ffffff",
      header: "#6698cb",
      headerText: "#ffffff",
      text: "#333333",
      link: "#003399"
    },
    archive: []
  },

  /* ------------------------------------------------------------------ */
  {
    username: "theo.static",
    displayName: "theo",
    avatar: "theo.svg",
    age: 16,
    gender: "Male",
    location: "Larkfield",
    joined: "2006-09-02",
    lastLogin: "2008-10-23",
    online: true,
    mood: "blank",
    status: "theo is fine. really.",
    headline: "i draw things and then i hide them",
    about: "um hi. i'm theo. sophomore at larkfield high. i draw a lot (mostly hands, i'm bad at hands). i stay up too late and listen to the same 4 albums over and over.\n\nif you know me from school you probably don't know me.\n\nmsn me if you want, just don't be weird about it.",
    whoToMeet: "someone who gets it without me having to explain it",
    music: [
      { artist: "Linkin Park", note: "Shadow of the Day on repeat since forever" },
      { artist: "Bright Eyes", note: "Lua makes me feel like i'm 30" },
      { artist: "The Postal Service", note: "" }
    ],
    interests: "drawing, sketchbooks, rain, insomnia, staying up on msn, old video games",
    friends: ["orbit", "marabelle", "junebug"],
    topFriends: ["marabelle", "junebug", "orbit"],
    comments: [
      { from: "marabelle", date: "2008-10-21 22:14", text: "THEO. you left your sketchbook in the band room. i did NOT look in it (i looked a little) (they're really good??)" },
      { from: "junebug", date: "2008-10-19 01:52", text: "you're still awake aren't you. go to sleep!! <3" },
      { from: "marabelle", date: "2008-09-30 16:03", text: "thanks 4 the add loser" }
    ],
    theme: {
      background: "#1b1f2a",
      pattern: "rain",
      panel: "#2a3040",
      header: "#4b5670",
      headerText: "#dfe6f5",
      text: "#c9d1e3",
      link: "#9db8ff"
    },
    archive: [
      {
        date: "2007-11-03",
        note: "Profile version saved by OrbitSpace",
        mood: "hopeful",
        status: "theo is thinking about someone",
        headline: "ask me about my sketchbook",
        about: "i'm theo. i draw stuff. me and a are going to make a comic together over winter break.",
        topFriends: ["angel", "orbit"]
        /* CLUE HOOK (placeholder, change or remove freely):
           "angel" is in Theo's old top friends but no longer exists on
           the site. Visiting the profile shows "no longer available". */
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    username: "marabelle",
    displayName: "~*MaRa*~",
    avatar: "mara.svg",
    age: 17,
    gender: "Female",
    location: "Larkfield",
    joined: "2006-02-14",
    lastLogin: "2008-10-22",
    online: false,
    mood: "LOUD",
    status: "Mara is skipping gym to practice. dont tell",
    headline: "GAY AND LOUD AND IN A BAND (the band is bad)",
    about: "hiiiii i'm mara!! senior, guitar, horrible singing, worse driving.\n\nmy band is called Paper Hearts Club and we have played exactly one (1) show at my cousin's birthday. we're GOING to be famous.\n\nyes i'm a lesbian. no you can't watch. yes my mom knows. no my grandma does not.\n\nPC4PC, comment me!!!",
    whoToMeet: "Tegan AND Sara. a drummer who shows up on time. a girl who likes bad movies.",
    music: [
      { artist: "Paramore", note: "Misery Business is my personality" },
      { artist: "Tegan and Sara", note: "The Con. that's it. that's the comment." },
      { artist: "Le Tigre", note: "Deceptacon at every party, sorry not sorry" }
    ],
    interests: "guitar, bad horror movies, eyeliner, driving w/ the windows down, my friends, NOT gym class",
    friends: ["orbit", "theo.static", "junebug"],
    topFriends: ["theo.static", "junebug", "orbit"],
    comments: [
      { from: "theo.static", date: "2008-10-22 00:31", text: "you didn't look a little. i know you." },
      { from: "junebug", date: "2008-10-18 19:40", text: "the new song is SO good. send me the mp3 when you guys record it!!" },
      { from: "orbit", date: "2006-02-14 09:00", text: "Welcome to OrbitSpace, Mara! :)" }
    ],
    theme: {
      background: "#ff9bd2",
      pattern: "hearts",
      panel: "#fff0fa",
      header: "#e6007e",
      headerText: "#ffffff",
      text: "#3a0026",
      link: "#b0005f"
    },
    archive: [
      {
        date: "2008-02-14",
        note: "Profile version saved by OrbitSpace",
        mood: "in love",
        status: "Mara is ♥ ♥ ♥",
        headline: "two years on orbitspace and i finally have a valentine",
        about: "hiiiii i'm mara!! guitar, bad singing.\n\nhappy valentine's day to the girl who knows who she is ;)",
        topFriends: ["theo.static", "orbit"]
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    username: "junebug",
    displayName: "june ☆",
    avatar: "june.svg",
    age: 16,
    gender: "Female",
    location: "Fairhaven (far from you guys)",
    joined: "2008-04-09",
    lastLogin: "2008-10-23",
    online: true,
    mood: "sparkly",
    status: "june is making a new layout!!",
    headline: "new name, same me ☆",
    about: "hi!! i'm june. i'm 16, i make websites and pixel art and way too many playlists.\n\nsome of you knew me before under a different name. thank you for sticking around. it means more than i can type.\n\ni met theo and mara on a forum about a webcomic and now they're stuck with me forever. we've never met in person but that doesn't make it not real.\n\nhtml/css layouts by me, ask before you take them!!",
    whoToMeet: "people who make things. people who are kind on purpose.",
    music: [
      { artist: "Robyn", note: "With Every Heartbeat makes me cry in a good way" },
      { artist: "Antony and the Johnsons", note: "\"Hope There's Someone\". if you know you know" },
      { artist: "Crystal Castles", note: "for coding at 2am" }
    ],
    interests: "html, css, pixel art, webcomics, glitter text (ironically) (not ironically), my cat Byte",
    friends: ["orbit", "theo.static", "marabelle"],
    topFriends: ["theo.static", "marabelle", "orbit"],
    comments: [
      { from: "theo.static", date: "2008-10-19 02:10", text: "no." },
      { from: "marabelle", date: "2008-10-11 15:22", text: "JUNE UR LAYOUT IS SO CUTE. make me one. please. i will pay u in nothing" },
      { from: "orbit", date: "2008-04-09 12:00", text: "Welcome to OrbitSpace, June! :)" }
    ],
    theme: {
      background: "#d9ccff",
      pattern: "stars",
      panel: "#fbf8ff",
      header: "#8a6fd6",
      headerText: "#ffffff",
      text: "#2c2348",
      link: "#5b3fb8"
    },
    archive: [
      {
        date: "2008-04-09",
        note: "Profile version saved by OrbitSpace",
        hiddenByOwner: true,
        /* June hid her old profile version. The archive page respects
           this and never shows her old name. Keep it that way. */
        mood: "",
        status: "",
        headline: "",
        about: "",
        topFriends: []
      }
    ]
  }

];

/*
  Profiles that USED to exist. Visiting them shows a "no longer
  available" page instead of an error. Add or remove usernames freely.
*/
window.DELETED_MEMBERS = {
  "angel": { lastSeen: "2007-12-31" }
};
