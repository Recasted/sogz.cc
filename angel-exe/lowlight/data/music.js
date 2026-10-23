/*
  music.js - everything on LowLight: artists, albums, songs, reviews,
  playlists and blog posts.

  ONLY REAL MUSIC. Every artist, album and song here must really exist.
  Don't invent songs for real artists. If you're not sure of a track
  list, list only the songs you know and keep "tracksNote" as
  "selected tracks".

  NO MUSIC FILES YOU DON'T OWN. A song can play on the site only if you
  put an audio file you're allowed to share in lowlight/audio/ and add
  "audio": "audio/your-file.mp3" to that song. Otherwise the player
  shows "Listen on Spotify" and "YouTube" buttons, which open the
  official services.

  ADDING AN ARTIST
  Copy the TEMPLATE block at the bottom of the artists list, paste it
  above it, and fill it in. "id" is a short lowercase name with dashes
  (for example "linkin-park"). It's used in links, so don't change it
  later.

  ALBUM COVERS
  By default each album gets a simple made-up cover. To use a real
  cover, save the picture as lowlight/covers/<album id>.jpg and add
  "cover": "covers/<album id>.jpg" to the album. Only use pictures you
  have the right to use.

  Dates on reviews, playlists and posts are in the story's world
  (the present day is 2008-10-23). Artist pages have no story date, so
  newer artists fit in fine.
*/
window.MUSIC = {

  /* ================================================================ */
  /*  ARTISTS                                                         */
  /* ================================================================ */
  artists: [

    {
      id: "linkin-park",
      name: "Linkin Park",
      genres: "alternative rock, nu metal",
      from: "Agoura Hills, California",
      bio: "Rock band formed in the late 1990s. Their debut Hybrid Theory (2000) mixed heavy guitars, rapping, electronics and Chester Bennington's huge voice, and became one of the best-selling debut albums ever.",
      official: "https://www.linkinpark.com",
      albums: [
        {
          id: "hybrid-theory", title: "Hybrid Theory", year: 2000, tracksNote: "full album",
          tracks: ["Papercut", "One Step Closer", "With You", "Points of Authority", "Crawling", "Runaway", "By Myself", "In the End", "A Place for My Head", "Forgotten", "Cure for the Itch", "Pushing Me Away"]
        },
        {
          id: "meteora", title: "Meteora", year: 2003, tracksNote: "full album",
          tracks: ["Foreword", "Don't Stay", "Somewhere I Belong", "Lying from You", "Hit the Floor", "Easier to Run", "Faint", "Figure.09", "Breaking the Habit", "From the Inside", "Nobody's Listening", "Session", "Numb"]
        },
        {
          id: "minutes-to-midnight", title: "Minutes to Midnight", year: 2007, tracksNote: "selected tracks",
          tracks: ["What I've Done", "Shadow of the Day", "Bleed It Out", "Given Up", "Leave Out All the Rest"]
        }
      ]
    },

    {
      id: "snow-strippers",
      name: "Snow Strippers",
      genres: "electronic, synth-pop, witch house",
      from: "Detroit, Michigan",
      bio: "Electronic duo of Tatiana Schwaninger and Graham Perez. Hazy, blown-out synths and dreamy vocals that sound like a dance floor at 4am.",
      official: "",
      albums: []
    },

    {
      id: "paramore",
      name: "Paramore",
      genres: "pop punk, emo, rock",
      from: "Franklin, Tennessee",
      bio: "Band fronted by Hayley Williams. Riot! (2007) made them one of the biggest rock bands for teenagers everywhere.",
      official: "https://www.paramore.net",
      albums: [
        { id: "all-we-know-is-falling", title: "All We Know Is Falling", year: 2005, tracksNote: "selected tracks", tracks: ["Pressure", "Emergency", "All We Know"] },
        { id: "riot", title: "Riot!", year: 2007, tracksNote: "selected tracks", tracks: ["Misery Business", "That's What You Get", "Hallelujah", "crushcrushcrush"] }
      ]
    },

    {
      id: "tegan-and-sara",
      name: "Tegan and Sara",
      genres: "indie rock, indie pop",
      from: "Calgary, Canada",
      bio: "Identical twin sisters Tegan and Sara Quin, both openly gay. Sharp, catchy songs about love going wrong, and a huge queer fanbase.",
      official: "https://www.teganandsara.com",
      albums: [
        { id: "so-jealous", title: "So Jealous", year: 2004, tracksNote: "selected tracks", tracks: ["Walking with a Ghost", "Speak Slow", "So Jealous"] },
        { id: "the-con", title: "The Con", year: 2007, tracksNote: "selected tracks", tracks: ["The Con", "Back in Your Head", "Nineteen"] }
      ]
    },

    {
      id: "le-tigre",
      name: "Le Tigre",
      genres: "electroclash, riot grrrl",
      from: "New York City",
      bio: "Feminist electro-punk band started by Kathleen Hanna. Loud, political, and made for dancing.",
      official: "",
      albums: [
        { id: "le-tigre", title: "Le Tigre", year: 1999, tracksNote: "selected tracks", tracks: ["Deceptacon", "Hot Topic"] }
      ]
    },

    {
      id: "bright-eyes",
      name: "Bright Eyes",
      genres: "indie folk, emo",
      from: "Omaha, Nebraska",
      bio: "Conor Oberst's band. Shaky, confessional songs that feel like reading someone's diary.",
      official: "",
      albums: [
        { id: "im-wide-awake", title: "I'm Wide Awake, It's Morning", year: 2005, tracksNote: "selected tracks", tracks: ["At the Bottom of Everything", "We Are Nowhere and It's Now", "Lua", "First Day of My Life", "Road to Joy"] }
      ]
    },

    {
      id: "the-postal-service",
      name: "The Postal Service",
      genres: "indietronica, synth-pop",
      from: "Seattle, Washington",
      bio: "Ben Gibbard and Jimmy Tamborello, who made their only album by mailing tapes and CDs to each other.",
      official: "",
      albums: [
        { id: "give-up", title: "Give Up", year: 2003, tracksNote: "selected tracks", tracks: ["The District Sleeps Alone Tonight", "Such Great Heights", "Sleeping In", "Nothing Better", "We Will Become Silhouettes", "Brand New Colony"] }
      ]
    },

    {
      id: "robyn",
      name: "Robyn",
      genres: "pop, electropop",
      from: "Stockholm, Sweden",
      bio: "Swedish pop singer who started her own label and made the dance-floor-crying album Robyn (2005).",
      official: "https://www.robyn.com",
      albums: [
        { id: "robyn", title: "Robyn", year: 2005, tracksNote: "selected tracks", tracks: ["Konichiwa Bitches", "Handle Me", "Be Mine!", "With Every Heartbeat", "Who's That Girl"] }
      ]
    },

    {
      id: "antony-and-the-johnsons",
      name: "Antony and the Johnsons",
      genres: "chamber pop, art pop",
      from: "New York City",
      bio: "Led by ANOHNI, a trans woman whose voice sounds like nothing else. I Am a Bird Now (2005) is full of songs about gender, longing and becoming yourself.",
      official: "",
      albums: [
        { id: "i-am-a-bird-now", title: "I Am a Bird Now", year: 2005, tracksNote: "selected tracks", tracks: ["Hope There's Someone", "You Are My Sister", "For Today I Am a Boy", "Fistful of Love"] }
      ]
    },

    {
      id: "crystal-castles",
      name: "Crystal Castles",
      genres: "electronic, chiptune, noise",
      from: "Toronto, Canada",
      bio: "Electronic duo with screaming vocals over broken video-game synths. Their first album came out in 2008.",
      official: "",
      albums: [
        { id: "crystal-castles", title: "Crystal Castles", year: 2008, tracksNote: "selected tracks", tracks: ["Untrust Us", "Alice Practice", "Crimewave", "Courtship Dating", "Air War", "Vanished"] }
      ]
    },

    /* ---- from Viole's "emily is away vibe ish" playlist ---- */

    {
      id: "lebanon-hanover",
      name: "Lebanon Hanover",
      genres: "cold wave, post-punk, darkwave",
      from: "",
      bio: "Cold, minimal post-punk duo. Deep voices, cheap drum machines and a lot of grey.",
      official: "",
      albums: []
    },

    {
      id: "system-of-a-down",
      name: "System Of A Down",
      genres: "alternative metal",
      from: "Los Angeles, California",
      bio: "Armenian-American band with frantic, political, sometimes ridiculous songs that switch from screaming to beautiful in a second.",
      official: "",
      albums: [
        { id: "toxicity", title: "Toxicity", year: 2001, tracksNote: "selected tracks", tracks: ["Toxicity", "Chop Suey!", "Aerials"] },
        { id: "mezmerize", title: "Mezmerize", year: 2005, tracksNote: "selected tracks", tracks: ["B.Y.O.B."] },
        { id: "hypnotize", title: "Hypnotize", year: 2005, tracksNote: "selected tracks", tracks: ["Soldier Side"] }
      ]
    },

    {
      id: "gary-jules",
      name: "Gary Jules",
      genres: "singer-songwriter",
      from: "",
      bio: "Singer who recorded a slow piano cover of Tears for Fears' 'Mad World' with composer Michael Andrews for the film Donnie Darko.",
      official: "",
      albums: []
    },

    {
      id: "snow-patrol",
      name: "Snow Patrol",
      genres: "alternative rock",
      from: "Northern Ireland and Scotland",
      bio: "Band led by Gary Lightbody. Big, aching rock songs that ended up in every TV drama of the mid-2000s.",
      official: "",
      albums: [
        { id: "final-straw", title: "Final Straw", year: 2003, tracksNote: "selected tracks", tracks: ["Spitting Games", "Run"] },
        { id: "eyes-open", title: "Eyes Open", year: 2006, tracksNote: "selected tracks", tracks: ["You're All I Have", "Chasing Cars", "Open Your Eyes", "The Finish Line"] }
      ]
    },

    {
      id: "green-day",
      name: "Green Day",
      genres: "punk rock, pop punk",
      from: "Berkeley, California",
      bio: "Punk trio who made the rock opera American Idiot (2004).",
      official: "",
      albums: [
        { id: "american-idiot", title: "American Idiot", year: 2004, tracksNote: "selected tracks", tracks: ["American Idiot", "Boulevard of Broken Dreams", "Wake Me Up When September Ends"] }
      ]
    },

    {
      id: "death-cab-for-cutie",
      name: "Death Cab for Cutie",
      genres: "indie rock",
      from: "Bellingham, Washington",
      bio: "Ben Gibbard's other band (he's also half of The Postal Service). Gentle, sad songs about distance and getting older.",
      official: "",
      albums: [
        { id: "plans", title: "Plans", year: 2005, tracksNote: "selected tracks", tracks: ["Soul Meets Body", "I Will Follow You into the Dark", "Brothers on a Hotel Bed"] }
      ]
    },

    {
      id: "red-hot-chili-peppers",
      name: "Red Hot Chili Peppers",
      genres: "funk rock, alternative rock",
      from: "Los Angeles, California",
      bio: "Long-running LA band. Stadium Arcadium (2006) is a double album.",
      official: "",
      albums: [
        { id: "stadium-arcadium", title: "Stadium Arcadium", year: 2006, tracksNote: "selected tracks", tracks: ["Dani California", "Snow (Hey Oh)", "Stadium Arcadium"] }
      ]
    },

    {
      id: "muse",
      name: "Muse",
      genres: "alternative rock, space rock",
      from: "Teignmouth, England",
      bio: "English trio with huge riffs, falsetto and songs about conspiracies and the end of the world.",
      official: "",
      albums: [
        { id: "absolution", title: "Absolution", year: 2003, tracksNote: "selected tracks", tracks: ["Time Is Running Out", "Hysteria", "Falling Away with You"] },
        { id: "black-holes-and-revelations", title: "Black Holes and Revelations", year: 2006, tracksNote: "selected tracks", tracks: ["Starlight", "Supermassive Black Hole", "Knights of Cydonia"] }
      ]
    },

    {
      id: "taking-back-sunday",
      name: "Taking Back Sunday",
      genres: "emo, post-hardcore",
      from: "Long Island, New York",
      bio: "Emo band known for two singers yelling over each other.",
      official: "",
      albums: [
        { id: "louder-now", title: "Louder Now", year: 2006, tracksNote: "selected tracks", tracks: ["MakeDamnSure"] }
      ]
    },

    {
      id: "senses-fail",
      name: "Senses Fail",
      genres: "post-hardcore, emo",
      from: "New Jersey",
      bio: "Screamo-ish New Jersey band. Every song sounds like a breakup at a basement show.",
      official: "",
      albums: [
        { id: "let-it-enfold-you", title: "Let It Enfold You", year: 2004, tracksNote: "selected tracks", tracks: ["Let It Enfold You", "Rum Is for Drinking, Not for Burning", "Buried a Lie"] },
        { id: "still-searching", title: "Still Searching", year: 2006, tracksNote: "selected tracks", tracks: ["Can't Be Saved"] }
      ]
    },

    {
      id: "against-me",
      name: "Against Me!",
      genres: "punk rock, folk punk",
      from: "Gainesville, Florida",
      bio: "Punk band led by Laura Jane Grace, who later came out as a trans woman and wrote openly about it in the band's songs.",
      official: "",
      albums: [
        { id: "new-wave", title: "New Wave", year: 2007, tracksNote: "selected tracks", tracks: ["New Wave", "Thrash Unreal", "Don't Lose Touch", "Holy Shit!"] }
      ]
    },

    {
      id: "nickelback",
      name: "Nickelback",
      genres: "post-grunge, rock",
      from: "Hanna, Alberta, Canada",
      bio: "Very famous, very radio Canadian rock band. Yes, it's on the playlist. No, we don't judge.",
      official: "",
      albums: [
        { id: "all-the-right-reasons", title: "All the Right Reasons", year: 2005, tracksNote: "selected tracks", tracks: ["Photograph", "Far Away", "Rockstar"] }
      ]
    },

    {
      id: "radiohead",
      name: "Radiohead",
      genres: "alternative rock, art rock",
      from: "Abingdon, England",
      bio: "Oxfordshire band who keep reinventing themselves. Hail to the Thief (2003) is tense and paranoid.",
      official: "",
      albums: [
        { id: "hail-to-the-thief", title: "Hail to the Thief", year: 2003, tracksNote: "selected tracks", tracks: ["2 + 2 = 5", "There There"] }
      ]
    },

    {
      id: "she-wants-revenge",
      name: "She Wants Revenge",
      genres: "post-punk revival, darkwave",
      from: "Los Angeles, California",
      bio: "Dark, synthy duo that sounds like a 1983 goth club.",
      official: "",
      albums: [
        { id: "she-wants-revenge", title: "She Wants Revenge", year: 2006, tracksNote: "selected tracks", tracks: ["Tear You Apart"] }
      ]
    },

    {
      id: "fall-out-boy",
      name: "Fall Out Boy",
      genres: "pop punk, emo",
      from: "Wilmette, Illinois",
      bio: "Chicago-area band with very long song titles.",
      official: "",
      albums: [
        { id: "from-under-the-cork-tree", title: "From Under the Cork Tree", year: 2005, tracksNote: "selected tracks", tracks: ["Sugar, We're Goin Down", "Dance, Dance"] }
      ]
    },

    {
      id: "nine-inch-nails",
      name: "Nine Inch Nails",
      genres: "industrial rock",
      from: "Cleveland, Ohio",
      bio: "Trent Reznor's project. Year Zero (2007) is a concept album about a dystopian future, released with an alternate-reality game hidden in fake websites.",
      official: "",
      albums: [
        { id: "year-zero", title: "Year Zero", year: 2007, tracksNote: "selected tracks", tracks: ["Survivalism", "Capital G"] }
      ]
    },

    {
      id: "arcade-fire",
      name: "Arcade Fire",
      genres: "indie rock",
      from: "Montreal, Canada",
      bio: "Big Montreal band with lots of members and instruments. Funeral (2004) is about grief, growing up and snowy neighborhoods.",
      official: "",
      albums: [
        { id: "funeral", title: "Funeral", year: 2004, tracksNote: "selected tracks", tracks: ["Neighborhood #1 (Tunnels)", "Wake Up", "Rebellion (Lies)"] }
      ]
    }

    /* TEMPLATE: copy from { to }, paste it above this comment, put a comma
       after the block before it, and fill it in.
    ,{
      id: "artist-name",
      name: "Artist Name",
      genres: "",
      from: "",
      bio: "",
      official: "",
      albums: [
        { id: "album-name", title: "Album Name", year: 2008, tracksNote: "selected tracks", tracks: ["Song One", "Song Two"] }
      ]
    }
    */
  ],

  /* ================================================================ */
  /*  SINGLE SONGS that aren't on an album above                      */
  /*  (handy for newer artists or one-off songs from your playlist)   */
  /* ================================================================ */
  singles: [
    // { artist: "snow-strippers", title: "Song name" },
    { artist: "lebanon-hanover", title: "Gallowdance" },
    { artist: "gary-jules", title: "Mad World", note: "with Michael Andrews" }
  ],

  /* ================================================================ */
  /*  REVIEWS (written by people in the story)                        */
  /*  album = an album id from above. rating = 1 to 5 stars.          */
  /* ================================================================ */
  reviews: [
    { album: "give-up", by: "kestrel", rating: 5, date: "2008-03-02", text: "Five years old and still the best album to listen to alone in a car at night. 'We Will Become Silhouettes' sounds happy until you actually listen to the words." },
    { album: "the-con", by: "kestrel", rating: 5, date: "2007-08-19", text: "Every song is two minutes of someone trying very hard not to call someone. Perfect." },
    { album: "crystal-castles", by: "kestrel", rating: 4, date: "2008-04-28", text: "Sounds like a Game Boy having a breakdown. I mean that as a compliment." },
    { album: "minutes-to-midnight", by: "kestrel", rating: 3, date: "2007-06-02", text: "Less screaming, more space. 'Shadow of the Day' is the slowest they've ever been and it's the one I keep going back to." }
  ],

  /* ================================================================ */
  /*  PLAYLISTS                                                       */
  /*  by = a character id from shared/story/characters.js, or "kestrel" */
  /*  each track = { artist: artist id, title: song title }           */
  /* ================================================================ */
  playlists: [
    {
      /* Viole's real playlist "emily is away vibe ish", all 32 songs in order. */
      id: "after-midnight", title: "the hours after midnight", by: "kestrel", date: "2008-10-22",
      note: "the playlist this whole site is named after. 32 songs, best with headphones and the lights off",
      tracks: [
        { artist: "lebanon-hanover", title: "Gallowdance" },
        { artist: "system-of-a-down", title: "Toxicity" },
        { artist: "gary-jules", title: "Mad World" },
        { artist: "linkin-park", title: "Faint" },
        { artist: "linkin-park", title: "Numb" },
        { artist: "snow-patrol", title: "Spitting Games" },
        { artist: "green-day", title: "Wake Me Up When September Ends" },
        { artist: "system-of-a-down", title: "B.Y.O.B." },
        { artist: "system-of-a-down", title: "Soldier Side" },
        { artist: "death-cab-for-cutie", title: "Brothers on a Hotel Bed" },
        { artist: "death-cab-for-cutie", title: "I Will Follow You into the Dark" },
        { artist: "red-hot-chili-peppers", title: "Stadium Arcadium" },
        { artist: "red-hot-chili-peppers", title: "Snow (Hey Oh)" },
        { artist: "muse", title: "Time Is Running Out" },
        { artist: "muse", title: "Falling Away with You" },
        { artist: "snow-patrol", title: "Open Your Eyes" },
        { artist: "taking-back-sunday", title: "MakeDamnSure" },
        { artist: "muse", title: "Starlight" },
        { artist: "senses-fail", title: "Let It Enfold You" },
        { artist: "against-me", title: "Don't Lose Touch" },
        { artist: "nickelback", title: "Far Away" },
        { artist: "against-me", title: "Holy Shit!" },
        { artist: "snow-patrol", title: "Chasing Cars" },
        { artist: "snow-patrol", title: "The Finish Line" },
        { artist: "radiohead", title: "2 + 2 = 5" },
        { artist: "senses-fail", title: "Rum Is for Drinking, Not for Burning" },
        { artist: "senses-fail", title: "Can't Be Saved" },
        { artist: "she-wants-revenge", title: "Tear You Apart" },
        { artist: "fall-out-boy", title: "Sugar, We're Goin Down" },
        { artist: "nine-inch-nails", title: "Survivalism" },
        { artist: "arcade-fire", title: "Neighborhood #1 (Tunnels)" },
        { artist: "linkin-park", title: "Given Up" }
      ]
    },
    {
      id: "theo-4am", title: "songs for not sleeping", by: "theo", date: "2008-10-15",
      note: "don't ask",
      tracks: [
        { artist: "linkin-park", title: "Shadow of the Day" },
        { artist: "bright-eyes", title: "Lua" },
        { artist: "the-postal-service", title: "The District Sleeps Alone Tonight" },
        { artist: "linkin-park", title: "Numb" },
        { artist: "bright-eyes", title: "First Day of My Life" }
      ]
    },
    {
      id: "mara-band", title: "PAPER HEARTS CLUB PREGAME", by: "mara", date: "2008-10-20",
      note: "play LOUD before the show!!! (oct 31, be there)",
      tracks: [
        { artist: "paramore", title: "Misery Business" },
        { artist: "le-tigre", title: "Deceptacon" },
        { artist: "tegan-and-sara", title: "Walking with a Ghost" },
        { artist: "paramore", title: "crushcrushcrush" },
        { artist: "tegan-and-sara", title: "Back in Your Head" }
      ]
    },
    {
      id: "june-coding", title: "3am html ☆", by: "june", date: "2008-10-17",
      note: "for making layouts when everyone else is asleep",
      tracks: [
        { artist: "crystal-castles", title: "Alice Practice" },
        { artist: "robyn", title: "With Every Heartbeat" },
        { artist: "the-postal-service", title: "Such Great Heights" },
        { artist: "antony-and-the-johnsons", title: "Hope There's Someone" },
        { artist: "crystal-castles", title: "Vanished" }
      ]
    }
  ],

  /* ================================================================ */
  /*  BLOG POSTS (newest first is automatic)                          */
  /*  artists = artist ids the post is about (they link to each other) */
  /* ================================================================ */
  posts: [
    {
      id: "welcome", date: "2006-11-12", by: "kestrel", title: "hello, lowlight",
      artists: [],
      text: "This is a music blog for the hours after midnight. I'll post what I'm listening to, review albums, and put up playlists people send me. No downloads, sorry. Buy the records, go to the shows."
    },
    {
      id: "requests-dec07", date: "2007-12-30", by: "kestrel", title: "reader requests: end of the year",
      artists: ["the-postal-service", "bright-eyes"],
      text: "Lots of requests this week. Someone signing their email only as \"a.\" asked for 'We Will Become Silhouettes' and said \"for the comic we're never going to finish\". Hope you finish it, a. Also by popular demand: more Bright Eyes. You people are so sad and I love you."
    },
    {
      id: "crystal-castles-2008", date: "2008-04-28", by: "kestrel", title: "the loudest album of the year so far",
      artists: ["crystal-castles"],
      text: "Crystal Castles finally put out a full album. Review is up. If you only try one song, try 'Alice Practice' and turn it down first."
    },
    {
      id: "reader-playlists-oct08", date: "2008-10-21", by: "kestrel", title: "your playlists, october edition",
      artists: ["linkin-park", "paramore", "robyn"],
      text: "Three new reader playlists are up: one for not sleeping, one for a band that is apparently playing a rec center on Halloween, and one for writing HTML at 3am. You all know each other, don't you."
    }
  ],

  /* People who write on LowLight but aren't characters in the game. */
  writers: {
    kestrel: { name: "kestrel", about: "runs lowlight. 24. works at a record store. never sleeps." }
  }
};
