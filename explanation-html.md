# `index.html` — Line-by-Line Explanation

## Big Picture

This file is the structural skeleton of the Meme Generator. It does three things:

1. **Declares metadata** the browser needs before it renders anything (encoding, viewport, title, stylesheet link).
2. **Provides the input surface** — a form with three fields the user fills out to generate a meme.
3. **Sets up the output surface** — an empty `<div>` that JavaScript populates dynamically, plus a status `<p>` that relays feedback to both sighted users and screen readers.

No logic lives here. HTML is kept intentionally "dumb" so that JavaScript owns behaviour and CSS owns appearance.

---

## Source + Explanation

```html
1  <!DOCTYPE html>
```
**Doctype declaration.** Tells the browser to parse the document in standards mode (not quirks mode). Without this, older browsers may misinterpret CSS box model rules.

---

```html
2  <html lang="en">
```
Opens the root element. `lang="en"` is an accessibility requirement — screen readers and translation tools use it to pick the right voice/engine. It also satisfies WCAG 2.1 criterion 3.1.1.

---

```html
3  <head>
```
Container for metadata that is not rendered directly on the page.

---

```html
4    <meta charset="UTF-8">
```
Sets the character encoding to UTF-8, which covers virtually every Unicode character. Without it, non-ASCII characters (accented letters, emoji) can display as garbled symbols.

---

```html
5    <meta name="viewport" content="width=device-width, initial-scale=1.0">
```
Instructs mobile browsers not to zoom out to fit a "desktop-width" page. `width=device-width` makes the layout width equal to the screen width; `initial-scale=1.0` prevents default zooming. Required for any responsive design.

---

```html
6    <title>Meme Generator</title>
```
Sets the browser tab title and is what screen readers announce as the page name. Appears in bookmarks and search-engine results.

---

```html
7    <link rel="stylesheet" href="styles.css">
```
Links the external stylesheet. Placed in `<head>` so the browser can download and parse CSS before it paints any content, avoiding a flash of unstyled content (FOUC).

---

```html
8  </head>
9  <body>
```
`<body>` contains everything the user actually sees and interacts with.

---

```html
10   <header>
11     <h1>Meme Generator</h1>
12     <p class="sub">Paste an image URL, add your text, and hit Generate.</p>
13   </header>
```
`<header>` is a landmark element — assistive technologies expose it as a navigation landmark. `<h1>` is the page's single top-level heading (important for SEO and screen-reader outline). The `<p class="sub">` gives a one-line usage hint; it's muted in CSS via `.sub`.

---

```html
15   <div class="wrap">
```
A layout wrapper. CSS centres it and caps its `max-width` at 1200 px so content doesn't stretch too wide on large monitors.

---

```html
16     <form class="meme-form" id="memeForm" novalidate>
```
- `id="memeForm"` — JavaScript grabs this element with `getElementById`.
- `novalidate` — **suppresses the browser's built-in validation pop-ups.** We keep the HTML5 `required`/`type` attributes for their programmatic API (`checkValidity()`, `reportValidity()`), but control the user-facing error messages ourselves for a consistent look and feel.

---

```html
17       <div class="field half">
18         <label for="topText">Top text</label>
19         <input type="text" id="topText" placeholder="e.g. One does not simply…" required>
20       </div>
```
- `.field.half` — CSS makes this span 6 of 12 grid columns (half the row width on desktop).
- `<label for="topText">` — associates the label with the input via matching `for`/`id`. Clicking the label focuses the input; screen readers announce "Top text, text field". Required for WCAG 1.3.1.
- `type="text"` — plain text input.
- `placeholder` — hint shown when empty. Does **not** replace the label.
- `required` — registers the field in the browser's constraint validation API so `checkValidity()` in JavaScript returns `false` when empty.

---

```html
21       <div class="field half">
22         <label for="bottomText">Bottom text</label>
23         <input type="text" id="bottomText" placeholder="e.g. …walk into Mordor" required>
24       </div>
```
Same pattern as the top-text field. Mirrors it in the second half of the grid row.

---

```html
27       <div class="field">
28         <label for="imageUrl">Image URL</label>
29         <input type="url" id="imageUrl" placeholder="https://example.com/image.jpg" required>
30       </div>
```
- `.field` (without `.half`) — spans all 12 columns; full width.
- `type="url"` — the browser's constraint API validates that the value looks like a URL (starts with a scheme such as `https://`). Free validation with zero JavaScript.
- `required` — combined with `type="url"`, `checkValidity()` returns `false` for both empty and malformed URLs.

---

```html
32       <div class="actions">
33         <button type="submit">Generate Meme</button>
34         <span class="hint">Press <kbd>Esc</kbd> to clear the form.</span>
35       </div>
```
- `.actions` — flexbox row for the button and hint text.
- `type="submit"` — clicking this (or pressing Enter while focused in the form) fires the `submit` event that JavaScript listens for.
- `<kbd>` — semantic element for keyboard input. Browsers typically render it in a monospace font; it signals to screen readers that this is a keyboard key, not regular text.

---

```html
36     </form>
```
Closes the form.

---

```html
38     <p id="status" class="status" aria-live="polite"></p>
```
- Starts empty; JavaScript sets its `.textContent` to transient messages like "Meme added!" or error notices.
- `aria-live="polite"` — when the text changes, screen readers announce it at the next natural pause without interrupting what the user is currently hearing. `"polite"` (not `"assertive"`) is correct here because status updates are not urgent.

---

```html
40     <div id="memeGrid" class="meme-grid"></div>
```
Empty container. JavaScript uses `grid.prepend(card)` to insert new meme `<article>` elements here. CSS applies a responsive auto-fill grid layout to it.

---

```html
42   </div>
```
Closes `.wrap`.

---

```html
43   <script src="script.js"></script>
```
Loads the JavaScript file. Placed **at the bottom of `<body>`** — by the time the browser reaches this line, the entire DOM has been parsed, so `getElementById` calls in `script.js` find their targets immediately. This avoids the need for a `DOMContentLoaded` event listener or the `defer` attribute.

---

```html
44 </body>
45 </html>
```
Standard closing tags.
