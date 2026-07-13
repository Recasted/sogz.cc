# Interactive archive bio

This is a GitHub Pages-ready interactive profile inspired by the supplied black-and-white halftone references.

## Make it yours

1. Put your images inside the `assets` folder.
2. Open `config.js`.
3. Change `name`, `quote`, your social links, and the image paths.
4. Use `backgroundImage` for the large full-screen image.
5. Use `mainImage` for the central portrait.
6. Add, remove, or rename entries in `cards` for the movable archive cards.

The site automatically converts the background to a harsh monochrome/halftone look with CSS. For the best result, use a high-resolution portrait with a dark background.

The **change image** button is a quick local preview. To make that image visible to everybody on GitHub Pages, copy the image into `assets` and set its path in `config.js`.

## Interactions

- Drag cards with a mouse or finger.
- Double-click a card to rotate it.
- Positions are saved in that visitor's browser.
- Use **reset** to restore the layout from `config.js`.

## Publish

Upload everything in this directory to the root of a GitHub repository. In the repository, open **Settings → Pages**, choose **Deploy from a branch**, then select `main` and `/ (root)`.
