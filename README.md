# Meme Generator

A client-side meme generator built with vanilla HTML, CSS, and JavaScript. Paste an image URL, enter top and bottom text, and generate shareable meme cards — no server required.

## Features

- Generate memes from any publicly accessible image URL
- Classic meme text style (white uppercase Impact-style with black outline)
- Responsive grid layout — new memes are added to the top
- Delete individual memes with the × button
- Transient status messages for feedback (success / error)
- Keyboard shortcut: press `Esc` anywhere in the form to clear all fields
- Accessible markup (ARIA labels, `aria-live` status region, semantic HTML)
- Graceful error handling when an image URL fails to load

## Getting Started

No build step or dependencies needed. Just open `index.html` in any modern browser:

```bash
# Option 1 — open directly
open index.html

# Option 2 — serve with a local server (avoids some CORS edge cases)
npx serve .
# or
python3 -m http.server
```

## Usage

1. Enter your **top** and **bottom** meme text.
2. Paste a direct **image URL** (e.g. `https://i.imgur.com/abc123.jpg`).
3. Click **Generate Meme** (or press `Enter`).
4. The meme card appears below — click **×** to remove it.

## Project Structure

```
├── index.html   # Markup and layout
├── styles.css   # Dark-theme styling, meme card overlays
└── script.js    # Form handling, meme card creation, event logic
```

## Technologies

- HTML5 — semantic elements, form validation attributes
- CSS3 — custom properties, CSS Grid, responsive breakpoints
- JavaScript (ES6+) — IIFE module pattern, DOM manipulation, event delegation

## License

MIT
