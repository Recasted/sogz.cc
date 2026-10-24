/*
  activity.js — the "Friend Activity" feed and the site bulletins.

  The feed page sorts these by date automatically (newest first),
  so you can add new lines anywhere in the list.

  "type" picks the little icon next to each line:
    mood, status, comment, friend, photo, layout, bulletin, music
  "who" is a username from members.js.
  "text" is what appears after the person's name.
*/
window.ACTIVITY = [
  /* CLUE: a deleted account still shows up in the feed, at 11:59 pm. */
  { date: "2008-10-22 23:59", who: "angel",       type: "status",  text: "viewed theo's profile" },
  { date: "2008-10-23 01:14", who: "theo.static", type: "mood",    text: "changed their mood to: blank" },
  { date: "2008-10-23 00:58", who: "junebug",     type: "layout",  text: "updated their profile layout" },
  { date: "2008-10-22 00:31", who: "theo.static", type: "comment", text: "commented on ~*MaRa*~'s profile" },
  { date: "2008-10-21 22:14", who: "marabelle",   type: "comment", text: "commented on theo's profile" },
  { date: "2008-10-21 17:45", who: "marabelle",   type: "status",  text: "is skipping gym to practice. dont tell" },
  { date: "2008-10-19 02:10", who: "theo.static", type: "comment", text: "commented on june ☆'s profile" },
  { date: "2008-10-19 01:52", who: "junebug",     type: "comment", text: "commented on theo's profile" },
  { date: "2008-10-18 19:40", who: "junebug",     type: "comment", text: "commented on ~*MaRa*~'s profile" },
  { date: "2008-10-15 23:02", who: "theo.static", type: "music",   text: "added Bright Eyes to their favourite music" },
  { date: "2008-10-11 15:22", who: "marabelle",   type: "comment", text: "commented on june ☆'s profile" },
  { date: "2008-09-30 16:03", who: "marabelle",   type: "friend",  text: "is now friends with theo" },
  { date: "2008-04-09 12:00", who: "junebug",     type: "friend",  text: "joined OrbitSpace!" }
];

window.BULLETINS = [
  {
    date: "2008-10-20 20:11",
    who: "marabelle",
    title: "PAPER HEARTS CLUB SHOW!!!!!",
    text: "we are playing the larkfield rec center halloween thing on the 31st. it's free. there will be bad candy. COME OR I'LL KNOW."
  },
  {
    date: "2008-10-17 03:33",
    who: "junebug",
    title: "survey!! copy & repost",
    text: "1. last song you listened to: Crystal Castles - Alice Practice\n2. are you in love: ...pass\n3. who is the last person you talked to online: theo (go to sleep theo)\n4. favourite time of day: 3am\n5. do you believe in ghosts: only the internet kind"
  },
  {
    date: "2008-10-01 09:00",
    who: "orbit",
    title: "Site maintenance this weekend",
    text: "Hi everyone! OrbitSpace will be down for a few hours on Saturday while we move to new servers. Your profiles, comments and photos will all be safe. Profile archives are saved automatically. - Ori"
  }
];
