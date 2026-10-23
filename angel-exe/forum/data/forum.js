/*
  forum.js - everything on nightshift, the anonymous message board
  (in the story it lives at nightshift.org).

  Nobody needs an account. Most people post as "Anonymous". Some use a
  made-up name, and regulars can be recognised by their name and voice.

  BOARDS  { id: "talk", name: "general talk", desc: "..." }
          readOnly: true = the archive (old threads, no replies)

  THREADS one block per thread:
    id       short name used in the address: thread.html?t=<id>
    board    the board id
    title    the thread title
    locked   "" or a reason, for example "locked by mod: inactive".
             A locked thread can't get new replies.
    posts    the posts, oldest first. Each post:
      name     the name shown ("" = Anonymous)
      by       which character wrote it (a character id from
               shared/story/characters.js), or "" for a random poster.
               Players never see this; it's for your own reference and
               for the continuity check.
      date     "YYYY-MM-DD HH:MM"
      text     the post. Start a line with > to make it green (a quote).
               Write >>2 to point at post number 2 in the thread.
               Write {player} and it becomes the name the player picked
               for comments (or "you" if they haven't picked one).
      sealed   (optional) a password-protected post. Its text is
               scrambled so it can't be read with View Source. Make one
               with forum/lock.html (that page isn't linked anywhere).
               { hint: "shown above the password box", code: "..." }

  Nothing may be dated after the story's present day (2008-10-23).
  angel's identity is deliberately never named anywhere. Keep it that way.
*/
window.FORUM = {

  boards: [
    { id: "talk", name: "general talk", desc: "anything goes (within the rules)" },
    { id: "art", name: "art & comics", desc: "drawing, comics, sketchbooks, critique" },
    { id: "web", name: "web & layouts", desc: "html, css, layouts, hosting" },
    { id: "para", name: "paranormal", desc: "ghosts, weird stuff, things that happen at 3am" },
    { id: "archive", name: "archive", desc: "old threads. read only.", readOnly: true }
  ],

  rules: [
    "be nice. this board is for everyone.",
    "no slurs, no hate. racism, homophobia and transphobia get you banned, no warning.",
    "don't post anyone's real name, school or address. not even your own.",
    "no spam, no chain posts, no 'first'.",
    "the mods are tired. please don't make them more tired."
  ],

  threads: [

    /* ---------------- general talk ---------------- */
    {
      id: "2am-music", board: "talk", title: "what are you listening to at 2am", locked: "",
      posts: [
        { name: "", by: "", date: "2008-10-19 01:58", text: "can't sleep thread. post what's on.\n\nme: death cab, plans, on repeat since tuesday" },
        { name: "", by: "", date: "2008-10-19 02:06", text: ">death cab at 2am\nyou're going to be fine anon. probably" },
        { name: "inkhands", by: "theo", date: "2008-10-19 02:14", text: "postal service. the district sleeps alone tonight. every night.\n\nthere's a blog called lowlight that's basically this thread but with reviews" },
        { name: "", by: "", date: "2008-10-19 02:20", text: ">>3\nlowlight is good. kestrel has taste. kestrel also has nickelback on a playlist so" },
        { name: "moth", by: "june", date: "2008-10-19 02:31", text: "robyn!!! dancing alone in my room at 2am is the only exercise i get ☆" },
        { name: "inkhands", by: "theo", date: "2008-10-19 02:33", text: ">>5\ngo to sleep" },
        { name: "moth", by: "june", date: "2008-10-19 02:34", text: ">>6\nyou go to sleep" }
      ]
    },
    {
      id: "halloween-show", board: "talk", title: "LARKFIELD: halloween show at the rec center oct 31!!!", locked: "",
      posts: [
        { name: "riotgrrrl", by: "mara", date: "2008-10-20 18:02", text: "PAPER HEARTS CLUB LIVE!!! oct 31, larkfield rec center, doors at 7!!!\n\nwe are a band. we are loud. costumes mandatory. info on our starlit site" },
        { name: "", by: "", date: "2008-10-20 18:40", text: "where even is larkfield" },
        { name: "riotgrrrl", by: "mara", date: "2008-10-20 18:41", text: ">>2\nnowhere. that's why we need a band" },
        { name: "", by: "", date: "2008-10-20 19:15", text: ">no real names\n>posts the name of her town\nmods??" },
        { name: "riotgrrrl", by: "mara", date: "2008-10-20 19:16", text: ">>4\na town isn't a person!!! there are like 9000 people in larkfield. find me. i dare you. (please don't)" },
        { name: "moth", by: "june", date: "2008-10-20 20:00", text: "they're SO good. i've only heard the phone recording and they're so good ☆ someone film it please" }
      ]
    },
    {
      id: "coming-out", board: "talk", title: "coming out stories (be nice or get out)", locked: "",
      posts: [
        { name: "", by: "", date: "2008-05-02 21:10", text: "thread for coming out stories. good ones, bad ones, half ones. you don't have to be out to post. you don't have to be anything to post.\n\nmods have said they'll ban anyone who's a jerk in here so let's actually have one nice thread" },
        { name: "moth", by: "june", date: "2008-05-02 21:34", text: "i told my friends online first. i made a new site with my real name on it (my REAL real name, the one i picked) and sent them the link and then i hid under my blanket for an hour.\n\nwhen i came back one of them had made me a top friends spot and the other had written 'FINALLY' in all caps with 40 exclamation marks.\n\nso. it's possible. ☆" },
        { name: "", by: "", date: "2008-05-02 22:01", text: ">>2\nthis made me cry a little. congrats moth" },
        { name: "riotgrrrl", by: "mara", date: "2008-05-03 10:12", text: "told my mom in the car so she couldn't look at me. she said 'i know, sweetie' and turned up the radio. it was a tegan and sara song. i don't think she knew that was funny\n\ngrandma still doesn't know. one boss fight at a time" },
        { name: "", by: "", date: "2008-05-04 00:20", text: "not out. not sure i will be for a while. reading this thread helps though. thanks" },
        { name: "", by: "", date: "2008-05-04 00:41", text: ">>5\nyou're allowed to take as long as you need. this thread will still be here" }
      ]
    },

    /* ---------------- art & comics ---------------- */
    {
      id: "hands-thread", board: "art", title: "the hands thread (post your worst hands)", locked: "",
      posts: [
        { name: "", by: "", date: "2008-10-11 16:20", text: "everyone is bad at hands. prove it. post your worst hand drawings.\n\n[hand_disaster.jpg]" },
        { name: "inkhands", by: "theo", date: "2008-10-12 01:44", text: "[hands_04.jpg]\n\ni draw hands every night. this is what 300 nights gets you. it's still bad" },
        { name: "", by: "", date: "2008-10-12 09:10", text: ">>2\nthat isn't bad at all?? the second one reaching up is really nice" },
        { name: "inkhands", by: "theo", date: "2008-10-12 23:58", text: ">>3\nthanks. it's from an old comic. it was supposed to be the last page" },
        { name: "", by: "", date: "2008-10-13 14:30", text: ">supposed to be\nfinish it anon" }
      ]
    },

    /* ---------------- web & layouts ---------------- */
    {
      id: "rate-my-layout", board: "web", title: "rate my orbitspace layout", locked: "",
      posts: [
        { name: "moth", by: "june", date: "2008-09-21 22:05", text: "made a new layout!! stars, pastel, a little glitter (tasteful glitter). screenshot on my starlit site under layouts. be honest!! (be nice)" },
        { name: "", by: "", date: "2008-09-21 22:30", text: "8/10. lose the glitter" },
        { name: "", by: "", date: "2008-09-21 22:31", text: ">>2\nnever lose the glitter" },
        { name: "", by: "", date: "2008-09-22 11:00", text: "how do you get the music player to not autoplay. asking for everyone" },
        { name: "moth", by: "june", date: "2008-09-22 11:20", text: ">>4\nyou can't!! orbitspace forces it. just pick a good song ☆" }
      ]
    },
    {
      id: "server-move", board: "web", title: "orbitspace + starlit both moving servers?? back up your stuff", locked: "",
      posts: [
        { name: "", by: "", date: "2008-10-02 19:12", text: "orbitspace says they're moving servers and starlit closed sign-ups 'while we move'. back up your pages people. when hosts move, things go missing" },
        { name: "", by: "", date: "2008-10-02 19:40", text: "orbitspace says archives are saved automatically. so old versions of profiles are still around somewhere" },
        { name: "", by: "", date: "2008-10-02 20:02", text: ">>2\n>somewhere\nthat's the scary part" },
        { name: "moth", by: "june", date: "2008-10-03 00:15", text: "deleted starlit sites show up in a list on the starlit front page. the addresses stay reserved for a year. kind of sad to look at" }
      ]
    },

    /* ---------------- paranormal ---------------- */
    {
      id: "1159", board: "para", title: "messages that are always stamped 11:59", locked: "",
      posts: [
        { name: "", by: "", date: "2008-10-16 23:59", text: "weird one. every few nights i get an IM from an account that says it was last online last year. the message is always stamped 11:59 pm. not 11:58. not midnight. 11:59.\n\nand it always uses my screen name. not my real name, my screen name. like it's reading it off the window" },
        { name: "", by: "", date: "2008-10-17 00:20", text: "time zone bug. next" },
        { name: "", by: "", date: "2008-10-17 00:22", text: ">>2\n>every few nights\n>always 11:59\nthat's not how time zones work anon" },
        { name: "moth", by: "june", date: "2008-10-17 03:30", text: "ok this is the creepiest thread on the board and i'm reading it at 3:30am which is my own fault.\n\ndo you think people can stay online after they stop being online? not like ghosts. like... the internet just keeps a copy" },
        { name: "inkhands", by: "theo", date: "2008-10-17 03:45", text: ">>4\nit's a time zone thing. go to sleep." },
        { name: "", by: "", date: "2008-10-18 01:02", text: "what was the account called" },
        { name: "", by: "", date: "2008-10-18 23:59", text: ">>6\nit doesn't have a name anymore. it just says angel" },
        { name: "angel", by: "", date: "2008-10-22 23:59", text: "{player}.\n\nyou found the board.\n\nyou're up late too." }
      ]
    },

    /* ---------------- archive (read only) ---------------- */
    {
      id: "glass-wings", board: "archive", title: "glass wings - comic collab, art + writing (winter break)", locked: "locked by mod: inactive",
      posts: [
        { name: "a.", by: "angel", date: "2007-11-05 23:59", text: "writing a short comic over winter break with a friend. 12 pages. they draw, i write. it's called glass wings: someone who can only fly when nobody is looking.\n\nthis thread is so we stop losing scripts in IMs. pages go here" },
        { name: "inkhands", by: "theo", date: "2007-11-06 00:10", text: "why does it say 11:59 when you posted it at like 10" },
        { name: "a.", by: "angel", date: "2007-11-06 23:59", text: ">>2\nmy clock is broken. it's always almost tomorrow here" },
        { name: "inkhands", by: "theo", date: "2007-12-20 18:12", text: "pages 1-4 done. i'm not posting them here, the board makes them blurry. i'll put them on my starlit" },
        { name: "", by: "", date: "2007-12-21 10:00", text: "subscribing. post page 5 when it's done, the roof scene sounds cool" },
        { name: "inkhands", by: "theo", date: "2007-12-28 01:20", text: "page 11 done. where's the script for 12" },
        { name: "a.", by: "angel", date: "2007-12-28 23:59", text: ">>6\nyou'll get it on new year's. we do the last page at midnight. that's the rule" },
        { name: "a.", by: "angel", date: "2007-12-31 23:59",
          sealed: {
            hint: "for t. only. the password is the night we were going to finish it (mmddyyyy)",
            code: "fnkJRRw6Ol5XEkpeRxBRRVQSQVRTVFlZVhJHWVtDHBdYElBeR1xUWRZGE0JbV14XXlwTRV1eWVBZRh0RWxddF0JdQUNLHhBeEUVSX0ZVVBdFXRNTVxBEX1RAVhFTRBBaWFZdWFVYRBk7OENQVVUQBgMSWkISRFhSEV1dVBJHWFJDVxNCWlUQW1BcV0IcEElYRBJSXUVRSUQRWV1URRBYWEYSWkUSVV5TQh4TSF1FEF1EQUcRWlFEUhFWQVBFWV5QEVRWVEYeOj1XW11YQVgQQ1lXE11TQ0QXQVNUVBJWX0URX1YfODodF1Ac"
          }
        }
      ]
    },
    {
      id: "lantern-kids", board: "archive", title: "lantern kids forum is dying, where is everyone going?", locked: "locked by mod: moved",
      posts: [
        { name: "", by: "", date: "2007-09-30 20:00", text: "the lantern kids forum has been down for a week again. the artist hasn't updated since july. where is everyone going?" },
        { name: "riotgrrrl", by: "mara", date: "2007-09-30 20:45", text: "orbitspace!!! add me. same name as always. we can make a lantern kids group with a terrible layout" },
        { name: "inkhands", by: "theo", date: "2007-10-01 01:30", text: "i'm on orbitspace. i don't really talk. you can add me anyway" },
        { name: "", by: "", date: "2007-10-01 09:15", text: "rip lantern kids forum. you were so buggy and i loved you" }
      ]
    }
  ]
};
