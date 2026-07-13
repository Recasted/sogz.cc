# Interactive archive bio

This is a GitHub Pages-ready interactive profile inspired by the supplied black-and-white halftone references.

## Make it yours

1. Put your images inside the `assets` folder.
2. Open `config.js`.
3. Change `name`, `quote`, your social links, and the image paths.
4. Use `backgroundImage` for the large full-screen image.
5. Use `mainImage` for the central portrait.
6. Add, remove, or rename entries in `cards` for the movable archive cards.

The site automatically converts the background to a harsh monochrome/halftone look with CSS. Backgrounds fill the screen edge to edge without stretching; their outer edges may be cropped to match the screen ratio. Card images use a consistent centered crop so every source size fits the same card frame.

The **change image** button is a quick local preview. To make that image visible to everybody on GitHub Pages, copy the image into `assets` and set its path in `config.js`.

## Interactions

- Drag cards with a mouse or finger.
- Click a card to spin it into the center and play its theme.
- Click outside the open card, press Escape, or use return to close it.
- Each card has a generated ambient theme by default. To use your own music, put an MP3 in `assets` and set that card's `audio` value in `config.js`, for example `audio: "assets/song.mp3"`.
- Positions are saved in that visitor's browser.
- Use **reset** to restore the layout from `config.js`.

The image chooser remembers a compressed preview on the current device. For a background that every visitor sees, put the original image in `assets` and set `backgroundImage` in `config.js`.

## Publish

Upload everything in this directory to the root of a GitHub repository. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
