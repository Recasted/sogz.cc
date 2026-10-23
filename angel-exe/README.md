# angel.exe companion websites

These are the fictional websites from the game **angel.exe**. They live on
sogz.cc inside the `angel-exe` folder, like your other tools:

| Address | What it is | Folder |
|---|---|---|
| sogz.cc/angel-exe/ | the **hub**, a 2008 forum front page that links every site. The GAMES card on sogz.cc opens it. | `index.html`, `hub/` |
| sogz.cc/angel-exe/orbitspace/ | **OrbitSpace**, the social network (Milestone 1) | `orbitspace/` |

The music site, homepages and anonymous boards come in later milestones.
They already appear on the hub as locked "coming soon" rows.

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
  shared/
    sites.js            THE list of every site: name, address, coming soon or open
    comments.js         the player comment box used on every site
    comments.css        how the comment box looks
    comments-config.js  your Google Form link + the list of standard avatars
    approved-comments.js  comments you approved (everyone sees these)
    filter.js           the slur filter word lists
    avatars/            the 5 standard player pictures
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
    images/             logo, avatars, icons, background patterns
```

## Changing content

**Profiles** are in `orbitspace/data/members.js`. Each person is one block.
You can change their name, mood, status, "About me", music, friends and
comments. Keep the quotes and commas the way they are. To start a new line
inside text, type `\n`.

**Adding a character**: copy a whole block from `{` to `},`, paste it
below, and change the `username` to something new. Then add that username
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

- Avatars: `orbitspace/images/avatars/` (theo.svg, mara.svg, june.svg,
  orbit.svg, default.svg). To use a .png instead, put `theo.png` there and
  change `avatar: "theo.svg"` to `avatar: "theo.png"` in `members.js`.
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
- None of this is fixed plot. Delete or rewrite it whenever you like.

The characters here (theo, Mara, June) are first drafts for the websites.
In Milestone 2 they'll be matched up with the characters in the Godot game
so both use the same names and history.
