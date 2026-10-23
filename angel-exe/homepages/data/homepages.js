/*
  homepages.js - every personal homepage hosted on Starlit, the free
  web host the characters use (in the story it lives at starlit.net).

  Each homepage is one block in HOMEPAGES below. The site builds every
  page from it, so you never have to touch the HTML files.

  A HOMEPAGE
    id        short name used in the address: site.html?u=<id>
              (it must match "blog" in that character's accounts in
              shared/story/characters.js)
    owner     the character id from shared/story/characters.js
    title     the name of the website
    tagline   the little line under the title
    theme     the look: "night" (theo), "punk" (mara) or "pastel" (june).
              The colours are in css/starlit.css.
    since     the date the site was made
    counter   the visitor counter number (made up)
    updated   "last updated" date shown at the bottom
    marquee   scrolling text at the top ("" for none)
    pages     the pages in the site's menu, in order. Each page has
              id, label and a type:
                "intro"     a welcome text (text)
                "diary"     dated entries (entries)
                "writing"   poems, lyrics or stories (pieces)
                "gallery"   a picture grid (items)
                "links"     links and buttons (links)
                "guestbook" the guestbook. Old entries are in (entries),
                            and players can sign it too.

  DIARY ENTRIES  { date: "2008-10-21 23:40", mood: "", music: "", title: "", text: "" }
    "music" is "Artist - Song" and links to LowLight if the artist is there.
    "private": true shows the entry as locked ("this entry is private").
  WRITING        { title: "", date: "", kind: "poem", text: "" }
  GALLERY        { title: "", caption: "", picture: "" }   picture is an
                 image file in homepages/images/. "" draws a placeholder.
  LINKS          { label: "", site: "social" } for another angel.exe site,
                 { label: "", href: "site.html?u=junebug" } for a link,
                 or { label: "", dead: true } for a link that's broken.
  GUESTBOOK      { from: "name", date: "", text: "" }

  To start a new line inside text, type \n. Keep quotes and commas as
  they are. Nothing may be dated after the story's present day
  (2008-10-23); the continuity check warns you if it is.

  angel's identity is deliberately never named anywhere. Keep it that way.
*/
window.HOMEPAGES = [

  /* ================================================================ */
  /*  THEO                                                            */
  /* ================================================================ */
  {
    id: "quiethours",
    owner: "theo",
    title: "the quiet hours",
    tagline: "nobody reads this. that's the point.",
    theme: "night",
    since: "2007-06-12",
    counter: 311,
    updated: "2008-10-22",
    marquee: "",
    pages: [
      {
        id: "home", label: "home", type: "intro",
        text: "this is where i put things i don't put on orbitspace.\n\ni'm theo. i draw. i'm bad at hands so i draw a lot of hands.\n\nif you found this from school: please just close the tab."
      },
      {
        id: "journal", label: "journal", type: "diary",
        entries: [
          { date: "2008-10-22 02:47", mood: "awake", music: "The Postal Service - The District Sleeps Alone Tonight", title: "eleven",
            text: "found the comic folder again. eleven pages. there were supposed to be twelve.\n\ni opened a blank page and drew a frame around it and then i couldn't do anything else. i don't know how it ends. a knew how it ends.\n\ngoing to bed. (not going to bed.)" },
          { date: "2008-10-21 23:10", mood: "embarrassed", music: "Linkin Park - Shadow of the Day", title: "",
            text: "left my sketchbook in the band room. mara has it. mara LOOKED IN IT.\n\nshe said they're good. she says everything is good though. she said my hands are 'less bad than you think'. that's the nicest thing anyone's said about my hands." },
          { date: "2008-10-15 03:20", mood: "", music: "Bright Eyes - Lua", title: "playlist",
            text: "sent a playlist to that lowlight blog. kestrel put it up. i called it 'songs for not sleeping' because i'm very original.\n\nlowlight is the blog a used to send me links from. i didn't think about that until after." },
          { date: "2008-09-30 16:40", mood: "surprised", music: "", title: "",
            text: "mara quinlan from band added me on orbitspace. she called me a loser in the first comment. i think that means she likes me. june says that's exactly what it means." },
          { date: "2008-01-15 21:02", mood: "", music: "", title: "",
            text: "their profile is gone. not private. gone. 'this profile is no longer available.'\n\ni don't want to write about it." },
          { date: "2008-01-01 00:31", mood: "", music: "", title: "happy new year",
            text: "a didn't sign on tonight. it's fine. probably somewhere with actual people.\n\nwe were going to do the last page at midnight. that was the whole plan. dumb plan." },
          { date: "2007-12-28 01:15", mood: "productive", music: "The Postal Service - We Will Become Silhouettes", title: "page eleven",
            text: "page eleven is done. a wrote the last page already but won't show me. 'you'll see it when you draw it.' that's not how drawing works but ok.\n\na keeps asking lowlight to play the same song. i think kestrel hates us." },
          { date: "2007-12-20 18:00", mood: "free", music: "", title: "break!!",
            text: "winter break. four pages done. a writes, i draw. we have a schedule. a made the schedule. i'm going to ignore the schedule." },
          { date: "2007-11-03 22:45", mood: "hopeful", music: "", title: "glass wings",
            text: "a and i are making a comic over winter break. it's called glass wings. it's about someone who can only fly when nobody is looking.\n\na says i'm allowed to draw the hands badly as long as i draw them." },
          { date: "2007-11-20 00:00", mood: "", music: "", title: "", private: true, text: "" }
        ]
      },
      {
        id: "comic", label: "glass wings", type: "gallery",
        intro: "a comic by a and theo. 12 pages. (11 drawn.)",
        items: [
          { title: "page 1", caption: "the roof", picture: "" },
          { title: "page 2", caption: "nobody looking", picture: "" },
          { title: "page 3", caption: "", picture: "" },
          { title: "page 4", caption: "", picture: "" },
          { title: "page 5", caption: "the fall (draft)", picture: "" },
          { title: "page 6", caption: "", picture: "" },
          { title: "page 7", caption: "", picture: "" },
          { title: "page 8", caption: "", picture: "" },
          { title: "page 9", caption: "hands (sorry)", picture: "" },
          { title: "page 10", caption: "", picture: "" },
          { title: "page 11", caption: "almost", picture: "" },
          { title: "page 12", caption: "not drawn yet", picture: "", missing: true }
        ]
      },
      {
        id: "links", label: "links", type: "links",
        links: [
          { label: "my orbitspace", site: "social" },
          { label: "lowlight (music)", site: "music" },
          { label: "june's site (it's better than mine)", href: "site.html?u=junebug" },
          { label: "paper hearts club (mara made me put this here)", href: "site.html?u=paperheartsclub" },
          { label: "a's site", href: "site.html?u=glasswings" }
        ]
      },
      {
        id: "guestbook", label: "guestbook", type: "guestbook",
        entries: [
          { from: "june", date: "2008-10-22 03:01", text: "eleven is a good number. you don't have to finish it tonight!! go to sleep theo. ☆" },
          { from: "mara", date: "2008-10-21 23:30", text: "I KNOW ABOUT THIS SITE NOW. you cannot hide from me. ur hands are fine" },
          { from: "a.", date: "2007-12-29 23:59", text: "page twelve is the best one. you'll see." }
        ]
      }
    ]
  },

  /* ================================================================ */
  /*  MARA                                                            */
  /* ================================================================ */
  {
    id: "paperheartsclub",
    owner: "mara",
    title: "PAPER HEARTS CLUB",
    tagline: "the OFFICIAL website of larkfield's 2nd best band!!!",
    theme: "punk",
    since: "2008-03-01",
    counter: 1066,
    updated: "2008-10-20",
    marquee: "★ HALLOWEEN SHOW OCT 31 @ LARKFIELD REC CENTER ★ COSTUMES MANDATORY ★ NO REALLY ★ BRING EARPLUGS ★",
    pages: [
      {
        id: "home", label: "HOME", type: "intro",
        text: "WELCOME TO THE OFFICIAL PAPER HEARTS CLUB WEBSITE!!!!\n\nwe are a band. we are from larkfield. we are LOUD and we know like 6 chords.\n\nMARA - guitar, yelling\nDEE - drums, more yelling\nPRIYA - bass, the only one who can actually play\n\nwe have played one (1) show and it was at my cousin's birthday and it RULED. show #2 is on halloween. be there or be a square (squares are also welcome)"
      },
      {
        id: "news", label: "NEWS", type: "diary",
        entries: [
          { date: "2008-10-20 17:45", mood: "PUMPED", music: "Paramore - Misery Business", title: "HALLOWEEN SHOW!!!!!",
            text: "IT'S OFFICIAL. oct 31, larkfield rec center, doors at 7. we're playing 5 songs including 1 new one.\n\nthe new one is called 'february'. no i will not explain the name.\n\nkestrel from lowlight put up our pregame playlist which means we are basically famous now." },
          { date: "2008-09-12 20:10", mood: "tired", music: "", title: "practice",
            text: "practiced in dee's garage until her dad turned the power off at the fuse box. that's how you know you're good." },
          { date: "2008-03-01 14:00", mood: "excited", music: "Le Tigre - Deceptacon", title: "WE HAVE A WEBSITE",
            text: "june made us a layout!!! june is the best. june lives like 6 hours away and is still more involved in this band than dee." }
        ]
      },
      {
        id: "lyrics", label: "LYRICS", type: "writing",
        pieces: [
          { title: "february", date: "2008-10-19", kind: "song",
            text: "you wrote your name on the window\nand breathed till it went away\nI didn't say anything\nI never say anything\n\nso here's a song about february\nthe only month short enough\nto keep a secret in\n\n(chorus: keep it, keep it, keep it\nI'll keep it till you say)" },
          { title: "rec center (we're gonna be huge)", date: "2008-05-02", kind: "song",
            text: "the floor is sticky and the mic is broke\nthe crowd is my mom and dee's little brother\nwe're gonna be HUGE\nwe're gonna be HUGE\n(this is the whole song)" },
          { title: "grandma doesn't know", date: "2008-07-14", kind: "song",
            text: "sunday dinner, pass the peas\nwho's the boy? there is no boy\nI'm not lying if I just don't answer\nI'm not lying, I'm a guitarist" }
        ]
      },
      {
        id: "pics", label: "PICS", type: "gallery",
        intro: "photos from our first show (all taken by my aunt, all blurry)",
        items: [
          { title: "the stage", caption: "it was a living room", picture: "" },
          { title: "dee", caption: "mid-yell", picture: "" },
          { title: "the crowd", caption: "all 9 of them", picture: "" },
          { title: "the cake", caption: "best part honestly", picture: "" }
        ]
      },
      {
        id: "guestbook", label: "GUESTBOOK", type: "guestbook",
        entries: [
          { from: "theo", date: "2008-10-21 00:12", text: "i'm only signing this because you said you'd stand outside my house until i did." },
          { from: "june", date: "2008-10-20 18:30", text: "FEBRUARY????? mara. MARA. ☆☆☆ (i'll be there in spirit!! someone hold a phone up)" },
          { from: "dee", date: "2008-09-13 09:00", text: "my dad says sorry about the fuse box. he isn't sorry" }
        ]
      }
    ]
  },

  /* ================================================================ */
  /*  JUNE                                                            */
  /* ================================================================ */
  {
    id: "junebug",
    owner: "june",
    title: "junebug.exe",
    tagline: "☆ layouts, pixels & feelings ☆ est. 2008 (the new me)",
    theme: "pastel",
    since: "2008-04-09",
    counter: 4127,
    updated: "2008-10-17",
    marquee: "☆ welcome to my little corner!! ☆ sign my guestbook ☆ free layouts (credit me!!) ☆",
    pages: [
      {
        id: "home", label: "☆ home", type: "intro",
        text: "hi hi!! welcome to junebug.exe ☆\n\ni'm june, 16, i make websites and pixel art and i stay up WAY too late doing it. this site is new because i'm kind of new. (long story. happy story!!)\n\nfeel free to take a layout, just link back to me. sign the guestbook before you go!!"
      },
      {
        id: "diary", label: "☆ diary", type: "diary",
        entries: [
          { date: "2008-10-17 03:33", mood: "spooky", music: "Crystal Castles - Vanished", title: "internet ghosts",
            text: "made a survey on orbitspace at 3:33am because i thought it'd be funny. it was a little less funny at 3:34.\n\ndo you think people stay online after they stop being online? like accounts that keep 'last seen'-ing. there's a thread about it on nightshift. someone said they get messages that are always stamped 11:59. probably a time zone thing!! probably." },
          { date: "2008-10-17 01:10", mood: "cozy", music: "Robyn - With Every Heartbeat", title: "playlist!!",
            text: "lowlight posted my '3am html' playlist!!!! i'm FAMOUS (to like 4 people)" },
          { date: "2008-08-02 22:00", mood: "loved", music: "Antony and the Johnsons - Hope There's Someone", title: "",
            text: "theo and mara called me at the same time from two different phones and argued about which of them gets to visit me first. nobody is visiting anybody, we are 16 and it's a 6 hour drive. but still. ☆" },
          { date: "2008-04-09 12:30", mood: "brave", music: "Antony and the Johnsons - For Today I Am a Boy", title: "hello, world",
            text: "new site. new name. same me.\n\ni deleted the old site. it wasn't me anyway.\n\nthank you to everyone who stuck around. i'm not going to say more than that today. i just wanted to put it somewhere." }
        ]
      },
      {
        id: "poems", label: "☆ poems", type: "writing",
        pieces: [
          { title: "save as", date: "2008-04-20", kind: "poem",
            text: "file > save as\nnew name\nare you sure you want to replace it?\n\nyes\nyes\nyes" },
          { title: "6 hours", date: "2008-08-03", kind: "poem",
            text: "you are a green dot\nand a sound when you sign on\nand that is enough\nthat has always been enough" },
          { title: "3:34am", date: "2008-10-17", kind: "poem",
            text: "the cursor blinks\nlike it's waiting for someone\nwho already left" }
        ]
      },
      {
        id: "fanfic", label: "☆ fanfic", type: "writing",
        intro: "fanfic for LANTERN KIDS, the webcomic where i met theo and mara (rip the lantern kids forum, you were so buggy)",
        pieces: [
          { title: "the lighthouse keeper's day off (part 1 of ???)", date: "2008-06-11", kind: "story",
            text: "Wren had never taken a day off. The lighthouse didn't let you.\n\nBut the lamp had gone quiet on Tuesday, the way lamps sometimes did in the comic before something important, and so Wren put on her good coat and walked into town for the first time in a hundred and twelve strips.\n\nNobody recognised her. That was the best part.\n\n(to be continued!! comments make me write faster ☆)" }
        ]
      },
      {
        id: "layouts", label: "☆ layouts", type: "gallery",
        intro: "free orbitspace layouts!! click to copy the code (ok you can't actually, this is a demo, ask me on msn)",
        items: [
          { title: "rainy theo", caption: "made for theo (he hasn't thanked me)", picture: "" },
          { title: "hearts on fire", caption: "made for mara obviously", picture: "" },
          { title: "starfield", caption: "mine!!", picture: "" },
          { title: "glass", caption: "unfinished. someone asked for it last december and never came back for it", picture: "" }
        ]
      },
      {
        id: "links", label: "☆ links", type: "links",
        links: [
          { label: "my orbitspace", site: "social" },
          { label: "the quiet hours (theo)", href: "site.html?u=quiethours" },
          { label: "PAPER HEARTS CLUB (mara)", href: "site.html?u=paperheartsclub" },
          { label: "lowlight", site: "music" },
          { label: "nightshift boards (spooky)", site: "forum" },
          { label: "lantern kids forum", dead: true }
        ]
      },
      {
        id: "guestbook", label: "☆ guestbook", type: "guestbook",
        entries: [
          { from: "mara", date: "2008-10-17 15:10", text: "JUNE STOP POSTING SCARY THINGS AT 3AM I READ IT AT LUNCH AND STILL GOT SCARED" },
          { from: "theo", date: "2008-10-17 03:40", text: "it's a time zone thing. go to sleep." },
          { from: "kestrel", date: "2008-10-17 12:00", text: "thanks for the playlist. your site is nicer than mine." }
        ]
      }
    ]
  }
];

/*
  Sites that were deleted. They appear on the Starlit front page under
  "Recently removed", and their address shows a "removed" page.
  Never list June's old site here: her old name is never shown.
*/
window.REMOVED_HOMEPAGES = [
  { id: "skaterboi89", removed: "2008-09-02" },
  { id: "glasswings", removed: "2008-01-01" },
  { id: "simsforever", removed: "2007-10-14" }
];
