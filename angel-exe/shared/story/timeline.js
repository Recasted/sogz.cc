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
          "music", "blog" (Starlit homepages), "forum" (nightshift),
          "mystery" (the hidden site) (list as many as apply)
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
    { "date": "2007-06-12", "who": ["theo"], "event": "Theo makes his Starlit homepage, the quiet hours", "seenOn": ["blog"], "type": "fact" },
    { "date": "2007-09-30", "who": ["mara", "theo"], "event": "The Lantern Kids webcomic forum dies; regulars move to OrbitSpace (nightshift archive)", "seenOn": ["forum"], "type": "fact" },
    { "date": "2007-11-03", "who": ["theo", "angel"], "event": "Theo's profile says he and 'a' will make a comic over winter break; angel is his top friend", "seenOn": ["orbitspace"], "type": "clue" },
    { "date": "2007-11-05 23:59", "who": ["angel", "theo"], "event": "'a.' opens the Glass Wings collab thread on nightshift. Every post by a. is stamped 11:59 pm", "seenOn": ["forum"], "type": "clue" },
    { "date": "2007-12-28", "who": ["theo", "angel"], "event": "Theo finishes page 11 of Glass Wings. a. says the last page happens at midnight on New Year's", "seenOn": ["blog", "forum"], "type": "clue" },
    { "date": "2007-12-29 23:59", "who": ["angel"], "event": "a. signs Theo's guestbook: 'page twelve is the best one'", "seenOn": ["blog"], "type": "clue" },
    { "date": "2007-12-30", "who": ["angel"], "event": "Someone signing as 'a.' asks LowLight for 'We Will Become Silhouettes', 'for the comic we're never going to finish'", "seenOn": ["music"], "type": "clue" },
    { "date": "2007-12-31 23:59", "who": ["angel"], "event": "angel is last seen. The hub's 'most users ever online' record (5) is set at the same minute", "seenOn": ["orbitspace", "hub"], "type": "clue" },
    { "date": "2007-12-31 23:59", "who": ["angel"], "event": "a. leaves a password-protected post in the Glass Wings thread asking Theo to finish the last page", "seenOn": ["forum"], "type": "clue" },
    { "date": "2008-01-01", "who": ["angel", "theo"], "event": "a. never signs on for the last page. a.'s Starlit site, glasswings, is removed", "seenOn": ["blog"], "type": "clue" },
    { "date": "2008-01-01", "who": ["angel"], "event": "A mirror service keeps a cached copy of a.'s deleted site ~glasswings (the hidden site at angel-exe/1159/). Its last login is a. at 23:59 on Dec 31", "seenOn": ["mystery"], "type": "clue" },
    { "date": "2008-01-15", "who": ["theo"], "event": "Theo notices angel's profile is gone", "seenOn": ["blog"], "type": "fact" },
    { "date": "2008-01-20", "who": [], "event": "Kestrel edits the LowLight request post: a.'s link, starlit.net/~glasswings, says 'removed' now", "seenOn": ["music"], "type": "clue" },
    { "date": "2008-02-14", "who": ["mara"], "event": "Mara's profile thanks a secret valentine", "seenOn": ["orbitspace"], "type": "hint" },
    { "date": "2008-03-01", "who": ["mara", "june"], "event": "Paper Hearts Club gets a Starlit site; June made the layout", "seenOn": ["blog"], "type": "fact" },
    { "date": "2008-04-09", "who": ["june"], "event": "June joins OrbitSpace under her new name and hides her old profile version", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-04-09", "who": ["june"], "event": "June starts junebug.exe on Starlit and deletes her old site", "seenOn": ["blog"], "type": "fact" },
    { "date": "2008-05-02", "who": ["june", "mara"], "event": "June and Mara share coming out stories on nightshift", "seenOn": ["forum"], "type": "fact" },
    { "date": "2008-09-30", "who": ["mara", "theo"], "event": "Mara and Theo become OrbitSpace friends", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-10-01", "who": ["ori"], "event": "Ori announces the server move. 'Profile archives are saved automatically'", "seenOn": ["orbitspace"], "type": "hint" },
    { "date": "2008-10-03 09:12", "who": [], "event": "nightshift: an anonymous poster explains Starlit's mirror service for removed sites ('like someone is still logged in')", "seenOn": ["forum"], "type": "clue" },
    { "date": "2008-10-15", "who": ["theo"], "event": "Theo sends LowLight his playlist 'songs for not sleeping'", "seenOn": ["music"], "type": "fact" },
    { "date": "2008-10-16 23:59", "who": [], "event": "An anonymous nightshift thread: IMs from an old account, always stamped 11:59 pm, using the reader's screen name", "seenOn": ["forum"], "type": "clue" },
    { "date": "2008-10-17", "who": ["june"], "event": "June sends LowLight her playlist '3am html'", "seenOn": ["music"], "type": "fact" },
    { "date": "2008-10-17", "who": ["june"], "event": "June posts a survey at 3:33am. 'do you believe in ghosts: only the internet kind'", "seenOn": ["orbitspace"], "type": "hint" },
    { "date": "2008-10-19", "who": ["mara"], "event": "Mara writes the song 'february' (her secret valentine)", "seenOn": ["blog"], "type": "hint" },
    { "date": "2008-10-20", "who": ["mara"], "event": "Mara sends LowLight the 'PAPER HEARTS CLUB PREGAME' playlist", "seenOn": ["music"], "type": "fact" },
    { "date": "2008-10-20", "who": ["mara"], "event": "Mara announces the Paper Hearts Club show at the Larkfield rec center on Oct 31", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-10-21", "who": ["theo", "mara"], "event": "Theo leaves his sketchbook in the band room; Mara finds it", "seenOn": ["orbitspace"], "type": "fact" },
    { "date": "2008-10-22 02:47", "who": ["theo"], "event": "Theo's journal: eleven pages, there were supposed to be twelve", "seenOn": ["blog"], "type": "hint" },
    { "date": "2008-10-22 23:59", "who": [], "event": "'angel' replies in the 11:59 thread, using the player's own name", "seenOn": ["forum"], "type": "clue" },
    { "date": "2008-10-22 23:59", "who": ["angel"], "event": "The deleted account 'angel' shows up in OrbitSpace's friend activity: viewed theo's profile", "seenOn": ["orbitspace"], "type": "clue" },
    { "date": "2008-10-23 00:20", "who": ["june"], "event": "June's diary: Starlit keeps mirrors of removed sites. She didn't click", "seenOn": ["blog"], "type": "clue" },
    { "date": "2008-10-23", "who": ["theo", "mara", "june"], "event": "Present day: the game begins", "seenOn": ["messenger"], "type": "fact" },
    { "date": "2008-10-31", "who": ["mara"], "event": "Paper Hearts Club Halloween show (after the present day, not happened yet)", "seenOn": [], "type": "fact" }
  ]
}
;
