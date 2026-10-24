# angel.exe companion websites

These are the fictional websites from the game **angel.exe**. They live on
sogz.cc inside the `angel-exe` folder, like your other tools:

| Address | What it is | Folder |
|---|---|---|
| sogz.cc/angel-exe/ | the **hub**, a 2008 forum front page that links every site. The GAMES card on sogz.cc opens it. | `index.html`, `hub/` |
| sogz.cc/angel-exe/orbitspace/ | **OrbitSpace**, the social network (Milestone 1) | `orbitspace/` |
| sogz.cc/angel-exe/lowlight/ | **LowLight**, the music site with real artists (Milestone 3) | `lowlight/` |
| sogz.cc/angel-exe/homepages/ | **Starlit**, the free host with the characters' homepages (Milestone 4) | `homepages/` |
| sogz.cc/angel-exe/forum/ | **nightshift**, the anonymous message board (Milestone 4) | `forum/` |

Everything is plain HTML, CSS and JavaScript. There is nothing to install
and no build step.

## How to preview

Double-click `index.html` (the hub) or `orbitspace/index.html`. It opens in
your browser and every link works straight from your computer.

After you change a file, save it and press **F5** in the browser.

If something looks wrong, press **F12** in the browser and open the
**Console** tab. Red text there names the file and line that broke, which
is usually a missing comma or quote in a data file.

## Where things are

```
angel-exe/
  index.html            the hub page (edit the text directly)
  hub/
    hub.css             hub colours and fonts
    hub.js              which sites go in which hub section, fake post counts
    logo.svg            the angel.exe wordmark
    folder*.svg         the little forum folder icons
  moderate.html         YOUR page for approving player comments (not linked anywhere)
  lowlight/
    index.html, artists.html, artist.html, playlists.html, blog.html
    css/lowlight.css    LowLight colours, fonts and sizes
    js/lowlight.js      builds the pages and runs the music player
    data/music.js       ALL the music: artists, albums, songs, reviews, playlists, blog posts
    audio/              music files you own (see audio/README.txt)
    covers/             album cover pictures (see covers/README.txt)
    images/logo.svg     the LowLight wordmark
  homepages/
    index.html          the Starlit front page (list of homepages)
    site.html           one page for every homepage (site.html?u=quiethours)
    data/homepages.js   ALL the homepages: diaries, poems, lyrics, fanfic, guestbooks
    css/starlit.css     Starlit's look, plus one look per homepage
    js/starlit.js       builds the pages (you rarely need this)
    images/             Starlit logo; put homepage pictures here too
  1159/                 the hidden mystery site (not linked from the hub)
    data/mirror.js      everything it says: files, logs, replies
    css/mirror.css, js/mirror.js
  forum/
    index.html, board.html, thread.html
    data/forum.js       ALL the boards, threads and posts
    css/forum.css       nightshift's colours
    js/nightshift.js    builds the pages (you rarely need this)
    lock.html           YOUR tool for password-protected posts (not linked anywhere)
  shared/
    sites.js            THE list of every site: name, address, coming soon or open
    comments.js         the player comment box used on every site
    comments.css        how the comment box looks
    comments-config.js  your Google Form link + the list of standard avatars
    approved-comments.js  comments you approved (everyone sees these)
    filter.js           the slur filter word lists
    story/
      characters.js     who everyone is, and their usernames on every site
      timeline.js       every date the story mentions
      check.js          the continuity check (yellow bar when testing locally)
    avatars/            the 5 standard player pictures
      characters/       the character pictures, used on every site
  orbitspace/
    index.html          home page
    profile.html        one page for every profile (profile.html?u=theo.static)
    archive.html        old saved versions of a profile
    feed.html           friend activity and bulletins
    browse.html         browse and search people
    css/social.css      all OrbitSpace colours, fonts and sizes
    js/social.js        builds the pages from the data (you rarely need this)
    data/members.js     profiles, friends, comments, music, archives
    data/activity.js    the activity feed and bulletins
    images/             logo, icons, background patterns
```

## The music site (LowLight)

Everything on LowLight comes from `lowlight/data/music.js`. The top of
that file explains every part.

**Adding an artist:** copy the TEMPLATE block near the end of the
`artists` list, paste it above the template, put a comma after the
artist before it, and fill it in. Give each album a list of `tracks`.
Only use real songs, and if you only know some of an album, set
`tracksNote` to `"selected tracks"`.

**A song without an album:** add it to `singles`, for example
`{ artist: "snow-strippers", title: "Song name" }`. Snow Strippers' songs
are all singles like this.

**Playlists:** add a block to `playlists`. Each song is
`{ artist: "artist-id", title: "Song title" }`, and the song must also be
on one of that artist's albums or in `singles`. `by` can be a character
(`theo`, `mara`, `june`) or `kestrel`, LowLight's made-up owner.

**Reviews and blog posts:** add blocks to `reviews` and `posts`. They are
dated in the story's world (before 2008-10-23).

**Playing music:** every song plays as its YouTube video, in a small
video window in the bottom right corner. It uses YouTube's own player,
so nothing is copied. Next, previous, pause and volume all work, and
when a video ends the next song starts.

The videos are listed in the `videos` section of `lowlight/data/music.js`,
grouped by artist. **To add a video:** open the song on YouTube, copy
the address (`https://www.youtube.com/watch?v=...`) and add a line under
that artist, for example `"Chasing Cars": "https://www.youtube.com/watch?v=GemKqzILV4w",`.
The song title must be spelled exactly like it is on the album or in
the playlist. Use official uploads (the artist's channel, their label,
or "Artist - Topic") when you can, because fan uploads get deleted.

If a video gets removed or its owner blocks embedding, the window says
so, shows a "watch it on YouTube" link and skips to the next song after
5 seconds. Then swap its link for another upload.

Videos sometimes refuse to play when you open the page straight from
your computer (YouTube wants a real website address). On sogz.cc they
play normally.

You can still play an audio file you're allowed to share: put it in
`lowlight/audio/` and change the song from `"Song name"` to
`{ title: "Song name", audio: "audio/file.mp3" }`.

**Album covers:** each album gets a made-up cover automatically. To use
a real one, see `lowlight/covers/README.txt`.

OrbitSpace profiles link each favourite artist to their LowLight page.
Artist pages show which characters are fans, using the `music` lists in
`shared/story/characters.js`.

## The homepages (Starlit)

Everything is in `homepages/data/homepages.js`, and the top of that file
explains every part. Each character's homepage is one block:

- **Theo**: *the quiet hours* (`?u=quiethours`). Journal, the Glass Wings comic, links, guestbook.
- **Mara**: *PAPER HEARTS CLUB* (`?u=paperheartsclub`). Band news, lyrics, photos, guestbook.
- **June**: *junebug.exe* (`?u=junebug`). Diary, poems, fanfic, layouts, links, guestbook.

**Adding a diary entry:** copy one `{ date: ..., text: ... }` line in that
site's diary `entries`, paste it, and change it. Entries sort themselves
by date. `"private": true` shows a locked entry instead.

**Adding a page to someone's menu:** add a block to their `pages` list.
The types are `intro`, `diary`, `writing` (poems, lyrics, stories),
`gallery`, `links` and `guestbook`.

**Pictures:** gallery items show a grey placeholder until you put a
picture in `homepages/images/` and set `picture: "yourfile.png"`.

**Looks:** each homepage has a `theme` (`night`, `punk` or `pastel`).
The colours are in `homepages/css/starlit.css`, one section per theme.

Players can sign every guestbook with their picked name and picture.
Old guestbook entries written by the characters are in the `entries`
of each guestbook page.

`REMOVED_HOMEPAGES` at the bottom lists deleted sites. They show on the
Starlit front page and their address says "removed". Never list June's
old site: her old name is never shown.

## The forum (nightshift)

Everything is in `forum/data/forum.js`. There are 5 boards: general
talk, art, web, paranormal, and a read-only archive.

**Adding a thread:** copy a whole thread block (from `{` to `},`), paste
it, and give it a new `id`. Each post has a `name` (leave it `""` for
Anonymous), `by` (which character wrote it, or `""`), a `date` and the
`text`. Start a line with `>` to make it green, and write `>>2` to point
at post 2.

The characters' board names are in `shared/story/characters.js` under
`forum`: theo is **inkhands**, Mara is **riotgrrrl**, June is **moth**.

Write `{player}` in a post and it shows the name the player picked for
comments. angel's 11:59 post in the paranormal board uses it.

`locked: "locked by mod: inactive"` stops replies. Players can reply to
every other thread with their picked name, like comments elsewhere.

**Password-protected posts:** double-click `forum/lock.html`, type the
hint, the secret text and the password, click **make the code**, and
copy the line it gives you into the post in place of `text`. The text
is scrambled, so players can't read it with View Source. Dates work
best as digits, and players can type them with slashes or dashes.
Keep the password in your own notes, not in these files.

## The hidden mystery site

`1159/` is not on the hub and not in `shared/sites.js`, on purpose. It
looks like an old terminal someone left logged in: a "mirror" of a.'s
deleted Starlit site. Players type commands (`help`, `ls`, `open`, `who`,
`whoami`, `time`), read files and logs, and can open a locked script with
the password from the forum.

**How players find it:** Theo's links page has "a's site", which goes to
the removed `~glasswings` page. That page has a small "mirror service" link.

**Page 12:** typing `open glass_wings/page12` opens a drawing window.
Players can draw the last page of Glass Wings and save it. It's kept in
their own browser, and from then on Theo's Glass Wings page on Starlit
shows their drawing in place of the missing page, "drawn by" their name.

**Editing it:** everything it says is in `1159/data/mirror.js`, and the
top of that file explains every part. Add a file to `FILES` or a reply
to `WORDS` (things players might type). `{player}` becomes the player's
picked name and `{now}` their own date and time. The locked file's
password is written in that file, so it's only a soft lock: anyone who
reads the code can see it.

It also reads the player's own comments from their browser and quotes
them back on `whoami`. Nothing leaves their computer.

## The shared story files

Two files describe the whole angel.exe world. Every site reads them, and
the Godot game can read them too:

- `shared/story/characters.js`: who everyone is. Name, pronouns, age,
  birthday, town, school, picture, and their username on every site
  (OrbitSpace, the messenger, their homepage and the forum).
- `shared/story/timeline.js`: the story calendar. Every date the sites
  mention, who was involved, where players can find it, and whether it's
  a plain fact, a hint or a mystery clue. The present day is 2008-10-23.

These two files use strict JSON (so Godot can read them). Keep every
text in "double quotes" and put commas between items but not after the
last one. The top of each file explains every field.

**Everything in these files is public.** Anyone can read them with View
Source. Keep secrets and twists in your own notes, not here.

### The continuity check

When you open a page from your own computer, `shared/story/check.js`
looks for things that don't add up: a friend who doesn't exist, a date
after the present day, an age that doesn't match a birthday, someone in
Top Friends before they were friends, and more. If it finds anything, a
yellow bar appears at the bottom of the page. Press F12 and open
**Console** to read the list. Players on sogz.cc never see the bar.

If a contradiction is deliberate (a clue), add a bit of its text to
`IGNORE` at the top of `check.js` and the bar stops mentioning it.

## The story clock

Every site shows dates from `shared/clock.js`, never the real date. The
date is always the story's present day (2008-10-23) and only the time of
day is real, so a comment posted at 2 am says "Oct 23, 2008 2:00 AM".
Old comments saved with a real date are shown on the story day too.
To move the story to another day, change STORY_DAY in clock.js and
presentDay in shared/story/timeline.js.

## Changing content

**Profiles** are in `orbitspace/data/members.js`. Each person is one block.
Each profile has a `character` that links it to `shared/story/characters.js`,
which is where their age, town and picture come from.
You can change their name, mood, status, "About me", music, friends and
comments. Keep the quotes and commas the way they are. To start a new line
inside text, type `\n`.

**Adding a character**: first add them to `shared/story/characters.js`.
Then, if they have an OrbitSpace profile, copy a whole block in
`members.js` from `{` to `},`, paste it below, and change `username` and
`character` to match. Then add that username
to other people's `friends` or `topFriends` if they should know each other.

**Activity feed and bulletins** are in `orbitspace/data/activity.js`. The
order doesn't matter, the site sorts them by date.

**Archives** (old versions of a profile) are the `archive` list inside each
profile. Use them for things a character used to say. If a version has
`hiddenByOwner: true`, the site shows "hidden" instead of the content. June
uses this so her old name is never shown.

**Deleted profiles** are in `DELETED_MEMBERS` at the bottom of
`members.js`. Linking to one shows "This profile is no longer available."

The story's "today" on OrbitSpace is **Oct 23, 2008**.

## Changing the look

- **OrbitSpace colours and fonts**: the top of `orbitspace/css/social.css`.
- **One profile's colours**: that person's `theme` in `members.js`.
  `pattern` can be `rain`, `hearts`, `stars` or `none`. You can add your
  own: make `orbitspace/images/pattern-yourname.svg` (or .png, then change
  the file ending in `js/social.js`) and set `pattern: "yourname"`.
- **Hub colours**: the top of `hub/hub.css`.

## Replacing artwork

Every picture is an SVG file you can swap. Easiest way: make your picture,
save it with the **same file name** in the same folder, and it appears
everywhere.

- Character pictures: `shared/avatars/characters/` (theo.svg, mara.svg,
  june.svg, orbit.svg, default.svg). Every site uses these. To use a .png
  instead, put `theo.png` there and change `"avatar": "theo.svg"` to
  `"avatar": "theo.png"` in `shared/story/characters.js`.
- Player pictures: `shared/avatars/` (guest-cat.svg and the others).
- Logos: `orbitspace/images/logo.svg` and `hub/logo.svg`.
- Icons: `orbitspace/images/icons/`.

SVG files are text, so you can also open them in a code editor and change
colours, or open them in Inkscape or Illustrator.

## Changing addresses and links

All links between sites come from `shared/sites.js`. When a new site is
built, its entry gets `status: "open"` and a `url`, and the hub, nav bars
and footers all link to it automatically. If you rename a folder, change
its `url` there.

`storyDomain` is a made-up address shown inside the story only (for example
"www.orbitspace.net/theo.static" on a profile). It is not a real website.

## Putting it online

The `angel-exe` folder goes into the root of the sogz.cc repository, next to
`sogsketch/` and `sog95/`. Once it is pushed, GitHub Pages serves it at
sogz.cc/angel-exe/. The GAMES card in sogz.cc's `config.js` links to
`angel-exe/`.

## Player comments

There are no accounts. A player picks a name and one of 5 standard
pictures (in `shared/avatars/`), and every angel.exe site remembers it on
their computer. They can comment in the hub guestbook, the OrbitSpace
guestbook and the "Visitor Comments" box on every profile.

How a comment travels:
1. The filter (`shared/filter.js`) blocks racist and anti-LGBT slurs and
   attacks, in names and in comments.
2. The comment is sent to **your Google Form**. Only you can see it there.
   The player sees their own comment right away, marked "waiting for
   approval".
3. You approve it with `moderate.html`. It goes into
   `shared/approved-comments.js` and everyone sees it, forever.

### One-time setup: the Google Form inbox

1. Go to forms.google.com and make a new blank form called
   "angel.exe comments".
2. Add 4 **Short answer** questions, in this order: `thread`, `name`,
   `avatar`, `text`. Make `text` a **Paragraph** question instead.
3. Click the three dots (top right) > **Get pre-filled link**. Type
   `THREAD`, `NAME`, `AVATAR` and `TEXT` (capital letters) in the four
   boxes, click **Get link**, then **Copy link**.
4. Open `shared/comments-config.js` and paste the link between the quotes
   after `googleFormPrefilledLink:`. Save, and upload the file to GitHub.

Until step 4 is done, comments only stay on the player's own computer.

### Approving comments

1. In the form, open **Responses** and click the green Sheets icon.
2. Select the new rows and copy them.
3. Double-click `moderate.html` (in `website\angel-exe`), paste, click
   **Read rows**, tick the comments to keep (flagged ones are red) and
   click **Download new approved-comments.js**.
4. On GitHub, open `angel-exe/shared/`, click **Add file > Upload files**,
   drop in the downloaded file and click **Commit changes**. The site
   updates within a minute or two.

To remove a comment later, open `moderate.html` again and untick it, or
delete its line in `approved-comments.js`.

### Editing the filter

The word lists are at the top of `shared/filter.js`, with instructions.
No filter catches everything, which is why you approve every comment.

## Story notes (placeholders, change freely)

- Theo's archived profile from Nov 2007 lists a friend called **angel**
  whose profile no longer exists. The hub's "most users ever online" date
  is Dec 31, 2007, the same day angel was last seen.
- Theo and "a." were making a 12-page comic, *Glass Wings*. Theo drew 11
  pages. The last page was meant to happen at midnight on New Year's Eve.
  Every post by a. is stamped 11:59 pm, like angel's messages in the game.
- The nightshift archive has a locked Glass Wings thread. a.'s last post
  is password-protected and asks Theo to finish the last page.
- On the paranormal board, someone gets IMs stamped 11:59 that use their
  screen name, and a poster called "angel" replies to the player by name.
- Mara's new song "february" is about her secret valentine. It never says who.
- The hidden site at `1159/` is a "mirror" of a.'s deleted site. Its
  `who` command lists 5 users online at 23:59 on Dec 31 2007 (the hub's
  record), and the player as a 6th.
- angel's identity is never named anywhere.
- None of this is fixed plot. Delete or rewrite it whenever you like.

The game uses the same characters. Their shared details are in
`shared/story/characters.js` and `shared/story/timeline.js`.
