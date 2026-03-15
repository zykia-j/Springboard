# `script.js` — Line-by-Line Explanation

## Big Picture

All behaviour lives in a single **IIFE** (Immediately Invoked Function Expression). The module follows a clear three-phase structure:

1. **Setup** — grab DOM references once at the top (lines 1–8).
2. **Helper functions** — `setStatus`, `isFormValid`, `createMeme` (lines 10–81).
3. **Event wiring** — attach listeners for grid clicks, form submit, and keyboard shortcuts (lines 83–124).

No external libraries, no build step. Vanilla ES6+ running directly in the browser.

---

## Source + Explanation

```js
1  (function () {
```
**IIFE opener.** Wraps everything in an anonymous function that calls itself immediately. This creates a private scope so none of the variables (`form`, `grid`, `status`, etc.) leak onto `window`. An ES module (`<script type="module">`) would achieve the same isolation, but the IIFE works without any module-aware bundler or `type` attribute change.

---

```js
2    const form   = document.getElementById('memeForm');
3    const grid   = document.getElementById('memeGrid');
4    const status = document.getElementById('status');
```
Cache the three container elements. Querying the DOM is relatively slow; storing the results in `const` variables means every subsequent reference is a fast in-memory lookup instead of a new DOM traversal.

---

```js
6    const topInput    = document.getElementById('topText');
7    const bottomInput = document.getElementById('bottomText');
8    const urlInput    = document.getElementById('imageUrl');
```
Cache the three form inputs separately for convenient direct access in `isFormValid` and the submit handler.

---

```js
11   let statusTimer = null;
```
Holds the ID returned by `setTimeout`. Declared outside `setStatus` so it persists across calls — this is what lets us cancel a previous timer when a new message arrives.

---

```js
12   function setStatus(message, isError = false) {
```
Named function (not an arrow) because it is a standalone helper, not a callback. `isError` defaults to `false` using an ES6 default parameter — callers only pass it when they need the error colour.

---

```js
13     clearTimeout(statusTimer);
```
**Timer guard.** If a previous status message is still counting down to be cleared, this cancels it. Without this, a second message could be wiped prematurely by the first message's timer expiring.

---

```js
14     status.textContent = message || '';
```
`textContent` (not `innerHTML`) — prevents XSS. If `message` is falsy (empty string, `null`, `undefined`), an empty string is used instead.

---

```js
15     status.style.color = isError ? '#ffadad' : '#ffd29d';
```
Ternary: error messages get a muted red; normal messages get a warm amber. Both are soft tones that work on the dark background.

---

```js
16     if (message) {
17       statusTimer = setTimeout(() => (status.textContent = ''), 3000);
18     }
```
If there is an actual message, schedule it to self-clear after 3 seconds. The timer ID is stored in `statusTimer` so the next `clearTimeout` call on line 13 can cancel it. Arrow function is appropriate here — it's a short, single-expression callback.

---

```js
22   function isFormValid() {
23     const fields = [topInput, bottomInput, urlInput];
24     return fields.every((el) => el.value.trim().length > 0 && el.checkValidity());
25   }
```
Combines two checks with `&&`:
- `el.value.trim().length > 0` — rejects inputs that contain only whitespace (which `required` alone does not always catch in all browsers).
- `el.checkValidity()` — invokes the browser's native constraint validation (e.g., verifies `type="url"` format). Returns `true` only when all three fields pass both checks.

`Array.every` short-circuits: it stops and returns `false` as soon as the first failing field is found.

---

```js
28   function createMeme({ top, bottom, url }) {
```
Accepts a **destructured object** instead of three positional arguments — callers read as `createMeme({ top, bottom, url })`, which is self-documenting and order-independent.

---

```js
29     const wrapper = document.createElement('article');
30     wrapper.className = 'meme';
31     wrapper.setAttribute('role', 'group');
32     wrapper.setAttribute('aria-label', 'Generated meme');
```
`<article>` is semantically appropriate — each meme is a self-contained piece of content. `role="group"` + `aria-label` groups the image and delete button together for screen readers so they understand the delete button belongs to this specific meme.

---

```js
35     const del = document.createElement('button');
36     del.className = 'delete';
37     del.type = 'button';
```
`type="button"` is critical. Inside a `<form>`, a `<button>` without an explicit type defaults to `type="submit"` in some browsers, which would accidentally submit the form when the delete button is clicked.

---

```js
38     del.title = 'Delete this meme';
39     del.setAttribute('aria-label', 'Delete meme');
40     del.textContent = '×';
```
`title` provides a tooltip on hover. `aria-label` overrides the `×` character for screen readers — "×" alone would be announced as "times" or "multiplication sign". `textContent = '×'` (Unicode multiplication sign) looks like an ✕ but is a real character, not an image.

---

```js
43     const img = document.createElement('img');
44     img.alt = 'Meme background';
45     img.decoding = 'async';
46     img.loading = 'lazy';
```
- `alt` — required for accessibility; describes the image when it can't be shown or for screen readers.
- `decoding = 'async'` — tells the browser it can decode the image off the main thread, reducing jank.
- `loading = 'lazy'` — defers loading until the image is near the viewport; helpful if many memes are generated.

---

```js
49     const topLine    = document.createElement('div');
50     topLine.className = 'line top';
51     topLine.textContent = top;
52
53     const bottomLine    = document.createElement('div');
54     bottomLine.className = 'line bottom';
55     bottomLine.textContent = bottom;
```
Two overlay divs. CSS positions them absolutely at the top and bottom of the card with the classic white-text-black-outline meme style. `textContent` is used (not `innerHTML`) to avoid XSS — user-supplied text is never parsed as HTML.

---

```js
58     del.addEventListener('click', () => {
59       wrapper.remove();
60       setStatus('Meme removed.');
61     });
```
When the delete button is clicked, `wrapper.remove()` removes the entire card from the DOM in one call. Then a status message confirms the action. This listener is attached directly on the button (not on the grid) as an inner listener — the outer grid listener on line 84 is a second, complementary approach used for event delegation.

---

```js
64     img.addEventListener('error', () => {
65       wrapper.remove();
66       setStatus('Could not load that image URL. Please check the link and try again.', true);
67     });
```
Fires if the browser cannot fetch the image (broken URL, CORS block, network error). The partially-built card is removed immediately so the user doesn't see a blank card. The `true` argument flags this as an error message (red colour in `setStatus`).

---

```js
70     img.addEventListener('load', () => {
71       wrapper.appendChild(topLine);
72       wrapper.appendChild(bottomLine);
73     });
```
Text overlays are injected **only after the image loads successfully**. This ensures the overlay divs are present only when there is a real image to overlay — if we appended them unconditionally, a broken-image card would still show floating text before the error handler runs.

---

```js
76     wrapper.appendChild(del);
77     wrapper.appendChild(img);
78     img.src = url; // set src last to ensure listeners are attached
```
**Order matters here.** `img.src` is assigned *after* the `load` and `error` listeners are added. Setting `src` first could theoretically trigger the events before the listeners are registered (especially for cached images that fire `load` synchronously). Appending `del` before `img` means the delete button renders on top in DOM order, which also matches its CSS `z-index: 2`.

---

```js
80     return wrapper;
```
Returns the fully composed (but not yet image-loaded) DOM element so the caller can insert it into the page.

---

```js
84   grid.addEventListener('click', (e) => {
85     const btn = e.target.closest('.delete');
86     if (btn) {
87       btn.click();
88     }
89   });
```
**Event delegation.** One listener on the parent grid handles clicks for *all* delete buttons, present and future. `e.target.closest('.delete')` walks up the DOM from the click target — if the click landed on the `×` text *inside* the button, `closest` still finds the button element. If no `.delete` ancestor is found, `closest` returns `null` and the `if` block skips. `btn.click()` re-fires the button's own listener (defined on line 58), keeping logic in one place.

---

```js
92   form.addEventListener('submit', (e) => {
93     e.preventDefault();
```
`e.preventDefault()` stops the browser's default form submission (which would send an HTTP request and reload the page). All form handling is done in JavaScript instead.

---

```js
96     if (!isFormValid()) {
97       form.reportValidity?.();
98       setStatus('Please fill out all fields with valid values before generating.', true);
99       return;
100    }
```
Guards against empty or malformed input. `form.reportValidity?.()` uses **optional chaining** (`?.`) — it calls the method only if the browser supports it (IE doesn't). This triggers the browser's native validation tooltips as a secondary hint. Early `return` exits the handler; nothing below runs.

---

```js
103    const top    = topInput.value.trim();
104    const bottom = bottomInput.value.trim();
105    const url    = urlInput.value.trim();
```
`.trim()` strips leading/trailing whitespace from the user's input one final time before use.

---

```js
107    const card = createMeme({ top, bottom, url });
108    grid.prepend(card); // newest first
```
Creates the card element and inserts it at the **beginning** of the grid (`prepend`) so the most recently generated meme appears in the top-left, not the bottom-right. More useful UX when many memes accumulate.

---

```js
111    form.reset();
112    topInput.focus();
113    setStatus('Meme added!');
```
`form.reset()` clears all three inputs in one call. `topInput.focus()` returns keyboard focus to the first field so the user can immediately type the next meme without reaching for the mouse. Success message auto-clears after 3 seconds.

---

```js
118   form.addEventListener('keydown', (e) => {
119     if (e.key === 'Escape') {
120       form.reset();
121       setStatus('Form cleared.');
122       topInput.focus();
123     }
124   });
```
A keyboard shortcut: pressing **Escape** while focused anywhere inside the form resets it. `e.key === 'Escape'` is the modern, cross-browser way to check for the Escape key (older code used `e.keyCode === 27`).

---

```js
125  })();
```
**IIFE closer.** The `()` at the end immediately invokes the anonymous function, running everything inside without exposing any variables to global scope.
