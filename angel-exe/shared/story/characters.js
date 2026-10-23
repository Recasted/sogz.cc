/*
  characters.js - the ONE source of truth for who every character is.

  Every angel.exe website reads this file, and the Godot game can read it
  too. If you change a name, age or username here, every site follows.

  IMPORTANT: everything in this file is public. Players can see it with
  "View Source" in their browser. Do NOT write secrets or plot twists here.
  Keep those in your own notes (for example in your Godot project).

  HOW TO EDIT
  This file uses strict JSON inside, so the game can read it as well:
  - every name and text goes in "double quotes"
  - put a comma between items, but NOT after the last item in a list
  - no comments below this header
  If a site breaks after an edit, press F12 in the browser: the Console
  tab says which line is wrong. A missing or extra comma is the usual cause.

  FIELDS
  id          short name used everywhere else (never change it once used)
  name        full name (shown only where it makes sense in the story)
  calls       what friends call them
  pronouns    pronouns
  identity    how they describe themselves, for your reference
  born        birthday, year-month-day
  age         age on the story's present day (2008-10-23)
  location    where they live
  school      school and year, or ""
  avatar      default picture, in shared/avatars/characters/
  accounts    their username on each site. "" = no account (yet)
              orbitspace = the social network
              messenger  = the instant messenger in the game
              blog       = their personal homepage (Milestone 4)
              forum      = their anonymous board name (Milestone 4)
  personality a few words to keep their voice consistent
  music       real artists they love (the music site links these later)
  publicNotes things players are allowed to know, for your reference
*/
window.ANGEL_CHARACTERS =
{
  "theo": {
    "id": "theo",
    "name": "Theo Halvorsen",
    "calls": "theo",
    "pronouns": "he/him",
    "identity": "gay, not out at school",
    "born": "1992-03-14",
    "age": 16,
    "location": "Larkfield",
    "school": "Larkfield High, sophomore",
    "avatar": "theo.svg",
    "accounts": {
      "orbitspace": "theo.static",
      "messenger": "theo_static",
      "blog": "",
      "forum": ""
    },
    "personality": "quiet, dry, lowercase, stays up too late, draws hands and hides the sketches",
    "music": ["Linkin Park", "Bright Eyes", "The Postal Service"],
    "publicNotes": "Was planning a comic with someone over winter break 2007. That friend's profile is gone."
  },

  "mara": {
    "id": "mara",
    "name": "Mara Quinlan",
    "calls": "Mara",
    "pronouns": "she/her",
    "identity": "lesbian, out to her mom, not her grandma",
    "born": "1991-07-02",
    "age": 17,
    "location": "Larkfield",
    "school": "Larkfield High, senior",
    "avatar": "mara.svg",
    "accounts": {
      "orbitspace": "marabelle",
      "messenger": "mara_hearts",
      "blog": "",
      "forum": ""
    },
    "personality": "loud, CAPS when excited, funny, protective of her friends, plays guitar in Paper Hearts Club",
    "music": ["Paramore", "Tegan and Sara", "Le Tigre"],
    "publicNotes": "Had a secret valentine in February 2008. Never says who."
  },

  "june": {
    "id": "june",
    "name": "June",
    "calls": "june",
    "pronouns": "she/her",
    "identity": "trans girl, came out online in spring 2008",
    "born": "1992-06-21",
    "age": 16,
    "location": "Fairhaven",
    "school": "",
    "avatar": "june.svg",
    "accounts": {
      "orbitspace": "junebug",
      "messenger": "junebug.exe",
      "blog": "",
      "forum": ""
    },
    "personality": "warm, sincere, lots of !! and stars, makes websites and pixel art, online friend from far away",
    "music": ["Robyn", "Antony and the Johnsons", "Crystal Castles"],
    "publicNotes": "Met theo and Mara on a webcomic forum. Has never met them in person. Her old name is never shown anywhere."
  },

  "ori": {
    "id": "ori",
    "name": "Ori",
    "calls": "Ori",
    "pronouns": "they/them",
    "identity": "",
    "born": "",
    "age": null,
    "location": "the internet",
    "school": "",
    "avatar": "orbit.svg",
    "accounts": {
      "orbitspace": "orbit",
      "messenger": "",
      "blog": "",
      "forum": ""
    },
    "personality": "cheerful site admin, everyone's first friend on OrbitSpace",
    "music": [],
    "publicNotes": "Runs OrbitSpace. Moved the servers in October 2008."
  },

  "angel": {
    "id": "angel",
    "name": "",
    "calls": "angel",
    "pronouns": "",
    "identity": "",
    "born": "",
    "age": null,
    "location": "",
    "school": "",
    "avatar": "",
    "accounts": {
      "orbitspace": "angel",
      "messenger": "",
      "blog": "",
      "forum": ""
    },
    "personality": "unknown",
    "music": [],
    "publicNotes": "Was theo's top friend in Nov 2007. OrbitSpace profile deleted, last seen 2007-12-31. Who they were is up to you."
  }
}
;
