/*
  mirror.js - everything on the hidden mystery site (angel-exe/1159/).

  This site is NOT listed on the hub or in shared/sites.js. Players are
  meant to find it through clues. It looks like an old computer terminal
  that someone left logged in. Players type commands, read files, and
  can draw the missing last page of Glass Wings.

  BOOT        lines shown when the page opens, one by one
  BOOT_1159   extra lines shown only when the player's own clock says 11:59 pm
  HELP        what "help" prints (keep it short and unhelpful, on purpose)
  FILES       the files players can "ls" and "open". Each file:
                path    "folder/name.txt"
                text    what "open" shows. Lines that start with "##" are
                        shown dim, like comments.
                hidden  true = not shown by "ls", but "open" still works
                sealed  a password: players must type it before the text
                        shows. Dates work as digits (12312007), slashes or
                        dashes. This one is NOT scrambled, so it's only a
                        soft lock: anyone reading this file can see it.
                hint    (with sealed) a dim line shown under "password:"
                draw    true = this "file" is the drawing page (page 12)
  WORDS       things players might type that aren't commands. The reply
              is shown. Keys are lowercase.
  WHO         the users "who" lists as logged in at 12/31/07 23:59.
              The player is always added at the end, with today's date.

  {player}  becomes the name the player picked for comments ("you" if none).
  {now}     becomes the player's own date and time.

  angel's identity is deliberately never named anywhere. Keep it that way.
  Nothing here should be dated after the story's present day (2008-10-23),
  except {now}.
*/
window.MIRROR = {

  BOOT: [
    "starlit.net mirror service (c) 2007",
    "restoring cached site: ~glasswings ... 11 of 12 pages found",
    "last login: Mon Dec 31 23:59:00 2007 from a.",
    "",
    "welcome back.",
    "",
    "...that isn't you, is it. hello, {player}.",
    "type help if you're lost. everyone here is a little lost."
  ],

  BOOT_1159: [
    "",
    "oh. it's 11:59 where you are.",
    "it's always 11:59 here."
  ],

  HELP: [
    "ls          what's here",
    "open NAME   open a file",
    "who         who was online",
    "whoami      who you are",
    "time        what time it is",
    "clear       start over",
    "",
    "there are more. there are always more."
  ],

  WHO: [
    { name: "a.", line: "tty1", when: "Dec 31 23:59" },
    { name: "?", line: "tty2", when: "Dec 31 23:59" },
    { name: "?", line: "tty3", when: "Dec 31 23:59" },
    { name: "?", line: "tty4", when: "Dec 31 23:59" },
    { name: "?", line: "tty5", when: "Dec 31 23:59" }
  ],

  FILES: [
    { path: "readme.txt",
      text: "this is a copy of a site that doesn't exist anymore.\nstarlit deleted it on january 1st. mirrors don't delete things.\n\nif you are t., the last page is in here.\nif you are not t., hello anyway." },

    { path: "glass_wings/about.txt",
      text: "GLASS WINGS\na comic in 12 pages\nstory: a.   art: t.\n\nsomeone who can only fly when nobody is looking.\n\n## page 12 is the one where she lands." },

    { path: "glass_wings/script_p11.txt",
      text: "PAGE 11\n\npanel 1: the roof again. snow now.\npanel 2: she looks down at the street. it's full of people.\npanel 3: everyone is looking up.\npanel 4: she can't fly. she knows she can't fly.\n\n## t. drew this one in two nights. the hands are good. don't tell him." },

    { path: "glass_wings/script_p12.txt", sealed: "12312007", hint: "## the night it was supposed to be finished.",
      text: "PAGE 12\n\npanel 1: \npanel 2: \npanel 3: \npanel 4: \n\n## i never wrote it down. i was going to tell you at midnight.\n## you know how it ends. you always did.\n## draw it. type: open glass_wings/page12" },

    { path: "glass_wings/page12", draw: true, text: "" },

    { path: "log/2007-12-31.txt",
      text: "## messenger log, partly recovered\n\n[23:59] a.: are you there\n[23:59] a.: it's almost midnight\n[23:59] a.: ##########################\n[23:59] a.: ######## the last page ####\n[23:59] a.: are you there\n\n## end of recovered log" },

    { path: "log/lowlight_request.txt",
      text: "to: kestrel\ndate: 2007-12-30\n\ncan you play we will become silhouettes again? for the comic we're never going to finish.\n\n- a.\n\n## kestrel played it. kestrel always plays it." },

    { path: "guestbook_backup.txt",
      text: "[2007-12-29 23:59] a.: page twelve is the best one. you'll see.\n[2008-10-22 03:01] june: eleven is a good number.\n[{now}] {player}: " },

    /* CLUE: points back out to the other sites. Uses the in-story addresses. */
    { path: "bookmarks.txt",
      text: "## bookmarks, last saved 2007-12-31 23:58\n\norbitspace.net/theo.static      ## top friends. i was first.\nstarlit.net/~quiethours         ## page 11 is up. the hands are good.\nlowlight                        ## ask kestrel for the song again\nnightshift.org /archive/        ## our thread. don't let the mods delete it.\nnightshift.org /para/           ## (new) they're talking about the clock\n\n## the last one wasn't there when i saved this." },

    { path: ".last_page", hidden: true,
      text: "you found the hidden one. nobody types ls -a anymore.\n\nwhen the last page is drawn, the comic is finished.\nwhen the comic is finished, nobody has to wait at midnight." }
  ],

  WORDS: {
    "hello": "hi {player}.",
    "hi": "hi {player}.",
    "angel": "that's what the profile says now. it isn't a name. it's what's left when a name is gone.",
    "a.": "here.",
    "who are you": "who are YOU, {player}? you're the one typing.",
    "theo": "he still draws hands every night. tell him to sleep.",
    "t.": "he still draws hands every night. tell him to sleep.",
    "mara": "loud. kind. keeps secrets in february.",
    "june": "she's right. the internet keeps a copy.",
    "kestrel": "kestrel always plays the song.",
    "glass wings": "11 of 12. open glass_wings/about.txt",
    "midnight": "it's never midnight here.",
    "sorry": "don't be.",
    "help me": "type help. or don't. i'll still be here.",
    "ls -a": "",
    "exit": "you can't log out of a mirror. (you can close the tab. that's fine too.)",
    "logout": "you can't log out of a mirror. (you can close the tab. that's fine too.)"
  }
};
