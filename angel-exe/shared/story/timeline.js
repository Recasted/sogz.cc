/*
  timeline.js - the shared story calendar.

  Every date that any angel.exe site (or the game) mentions should be
  here, so nothing contradicts by accident. When you write a new post,
  comment or chat that mentions an event, add the event here first.

  Same rules as characters.js: strict JSON below this header, double
  quotes, commas between items but not after the last one, no comments.
  Everything here is public, so no secrets.

  FIELDS
  date    "YYYY-MM-DD" (add " HH:MM" if the time matters)
  who     list of character ids from characters.js
  event   what happened, in one line
  seenOn  where players can find it: "orbitspace", "messenger", "hub",
          "music", "blog", "forum" (list as many as apply)
  type    "fact"   = plainly shown
          "hint"   = only hinted at, players have to notice it
          "clue"   = deliberately placed for the mystery

  The story's present day is set by "presentDay". Nothing on the sites
  should be dated after it, and the continuity check warns if it is.
*/
window.ANGEL_TIMELINE =
{
  "presentDay": "2008-10-23",
  "events": [
    { "date": "2005-06-01", "who": ["ori"], "event": "OrbitSpace launches", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2006-02-14", "who": ["mara"], "event": "Mara joins OrbitSpace", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2006-09-02", "who": ["theo"], "event": "Theo joins OrbitSpace", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2007-11-03", "who": ["theo", "angel"], "event": "Theo's profile says he and 'a' will make a comic over winter break; angel is his top friend", "seenOn": ["orbitspace"], "type": "clue" },
    { "date": "2007-12-31 23:59", "who": ["angel"], "event": "angel is last seen. The hub's 'most users ever online' record (5) is set at the same minute", "seenOn": ["orbitspace", "hub"], "type": "clue" },
    { "date": "2008-02-14", "who": ["mara"], "event": "Mara's profile thanks a secret valentine", "seenOn": ["orbitspace"], "type": "hint" },
    { "date": "2008-04-09", "who": ["june"], "event": "June joins OrbitSpace under her new name and hides her old profile version", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-09-30", "who": ["mara", "theo"], "event": "Mara and Theo become OrbitSpace friends", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-10-01", "who": ["ori"], "event": "Ori announces the server move. 'Profile archives are saved automatically'", "seenOn": ["orbitspace"], "type": "hint" },
    { "date": "2008-10-17", "who": ["june"], "event": "June posts a survey at 3:33am. 'do you believe in ghosts: only the internet kind'", "seenOn": ["orbitspace"], "type": "hint" },
    { "date": "2008-10-20", "who": ["mara"], "event": "Mara announces the Paper Hearts Club show at the Larkfield rec center on Oct 31", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-10-21", "who": ["theo", "mara"], "event": "Theo leaves his sketchbook in the band room; Mara finds it", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-10-23", "who": ["theo", "mara", "june"], "event": "Present day: the game begins", "seenOn": ["messenger"], "type": "fact" },
    { "date": "2008-10-31", "who": ["mara"], "event": "Paper Hearts Club Halloween show (after the present day, not happened yet)", "seenOn": [], "type": "fact" }
  ]
}
;
