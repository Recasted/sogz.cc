/*
  filter.js — blocks racist and anti-LGBT slurs and attacks in player
  names and comments, BEFORE they are sent to you for approval.

  This is a first line of defence, not a guarantee. People misspell
  words on purpose to get around filters, which is why every comment
  still waits for your approval before anyone else can see it.

  HOW TO EDIT
  - Add a word to BLOCKED_WORDS to block it as a whole word
    (and with endings like -s, -ed, -ing).
  - Add a word to BLOCKED_ANYWHERE to block it even inside other words
    or with spaces/dots between the letters. Only use this for long,
    unmistakable slurs, or it will block innocent words.
  - Add a phrase to BLOCKED_PHRASES to block that exact phrase.
  - Write everything in lowercase.

  The filter also catches common tricks: capital letters, numbers for
  letters (4 = a, 3 = e, 1 = i, 0 = o, $ = s...), repeated letters
  ("faaaag") and symbols between letters ("f.a.g").

  Note on reclaimed words: some queer people call themselves words like
  "dyke" or "queer" on purpose. "queer" is NOT blocked. "dyke" is blocked
  by default because strangers mostly use it as an insult; remove it
  from the list if you want players to be able to use it.
*/
(function () {
  var BLOCKED_ANYWHERE = [
    "nigger", "nigga", "faggot", "fagot", "tranny", "trannie",
    "shemale", "kike", "wetback", "raghead", "towelhead", "sandnigger"
  ];

  var BLOCKED_WORDS = [
    // racist slurs
    "nig", "nigg", "niggs", "coon", "chink", "gook", "spic", "spick",
    "beaner", "paki", "jap", "zipperhead", "wop", "kaffir", "kafir",
    "golliwog", "darkie", "porchmonkey", "junglebunny", "gyp", "gypo",
    // anti-LGBT slurs
    "fag", "fags", "faggy", "dyke", "dykes", "troon", "troons",
    "ladyboy", "heshe", "sodomite", "poof", "poofter", "battyboy",
    "homo", "lesbo",
    // hate group shorthand
    "1488", "88", "14words", "sieg", "heil"
  ];

  var BLOCKED_PHRASES = [
    "kill yourself", "kill urself", "kys", "go die", "neck yourself",
    "rope yourself", "you should die", "gas the", "hitler was right",
    "white power", "white pride", "gay is a sin", "trans is a mental illness",
    "groomer", "groomers", "41%", "41 percent", "god hates",
    "kill all gays", "kill the gays", "kill gays", "kill all trans", "kill trans people",
    "death to gays", "death to trans", "burn the gays", "hang the gays"
  ];

  // Real words that contain a blocked word by accident. Removed before checking.
  var ALLOWED_WORDS = ["nigeria", "nigerian", "scunthorpe", "spicy", "spicier", "spiciest", "snigger", "sniggers", "sniggered", "sniggering"];

  var SWAPS = { "4": "a", "@": "a", "3": "e", "1": "i", "!": "i", "|": "i",
                "0": "o", "5": "s", "$": "s", "7": "t", "+": "t", "8": "b",
                "9": "g", "ph": "f" };

  // lowercase, swap look-alike characters, collapse repeated letters
  function normalize(text) {
    var t = String(text).toLowerCase();
    t = t.normalize ? t.normalize("NFKD").replace(/[̀-ͯ]/g, "") : t;
    var out = "";
    for (var i = 0; i < t.length; i++) {
      var two = t.substr(i, 2);
      if (SWAPS[two]) { out += SWAPS[two]; i++; continue; }
      out += SWAPS[t[i]] || t[i];
    }
    return out;
  }

  // the same, but numbers stay numbers (for "1488" and similar)
  function plain(text) { return String(text).toLowerCase(); }

  function collapse(word) { return word.replace(/([a-z])\1+/g, "$1"); }

  var anywhere = BLOCKED_ANYWHERE.map(collapse);
  var words = {};
  BLOCKED_WORDS.forEach(function (w) { words[collapse(w)] = true; words[w] = true; });

  function hasWord(token) {
    if (words[token]) return true;
    // common endings: fags, faggy, coons, homos...
    var stems = [token.replace(/(s|es|ed|ing|y|ie|ies)$/, "")];
    return stems.some(function (s) { return s.length > 2 && words[s]; });
  }

  /*
    check("some text") returns { ok: true } or
    { ok: false, reason: "..." } with a message to show the player.
  */
  function check(text) {
    var lowered = " " + plain(text) + " ";
    ALLOWED_WORDS.forEach(function (w) { lowered = lowered.split(w).join(" "); });

    var norm = normalize(lowered);
    var letters = norm.replace(/[^a-z]/g, "");
    var squashed = collapse(letters);

    for (var i = 0; i < BLOCKED_ANYWHERE.length; i++) {
      if (letters.indexOf(BLOCKED_ANYWHERE[i]) !== -1 || squashed.indexOf(anywhere[i]) !== -1) return blocked();
    }

    var tokens = joinSingles(collapse(norm).replace(/[^a-z0-9%']+/g, " ").split(" "))
      .concat(joinSingles(lowered.replace(/[^a-z0-9%']+/g, " ").split(" ")));
    for (var j = 0; j < tokens.length; j++) {
      if (tokens[j] && hasWord(tokens[j].replace(/'/g, ""))) return blocked();
    }

    var spaced = " " + tokens.join(" ") + " ";
    for (var k = 0; k < BLOCKED_PHRASES.length; k++) {
      var p = BLOCKED_PHRASES[k];
      if (spaced.indexOf(" " + p + " ") !== -1 || spaced.indexOf(" " + collapse(normalize(p)) + " ") !== -1) return blocked();
      if (p.indexOf(" ") === -1 && squashed === collapse(normalize(p))) return blocked();
    }
    return { ok: true };
  }

  // "f a g" or "k.y.s" -> also check "fag" / "kys"
  function joinSingles(tokens) {
    var out = tokens.slice(), run = "";
    tokens.concat([""]).forEach(function (t) {
      if (t.length === 1) { run += t; return; }
      if (run.length > 1) {
        out.push(run);
        // the run may include a real one-letter word, as in "a f.a.g"
        for (var w in words) if (w.length > 2 && run.indexOf(w) !== -1) out.push(w);
      }
      run = "";
    });
    return out;
  }

  function blocked() {
    return { ok: false, reason: "That message has words that aren't allowed here. Be kind :)" };
  }

  window.AngelFilter = { check: check, normalize: normalize };
})();
