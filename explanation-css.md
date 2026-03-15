# `styles.css` — Line-by-Line Explanation

## Big Picture

The stylesheet uses three modern CSS pillars with no preprocessor or framework:

1. **CSS Custom Properties** (`:root` variables) — a single source of truth for the colour palette, border radius, and shadow, making global theme changes a one-line edit.
2. **CSS Grid** — used for both the page layout and the responsive meme grid. No float or flexbox hacks needed.
3. **Modern property values** — `clamp()` for fluid typography, `aspect-ratio` for uniform card shapes, `object-fit` for image cropping, `isolation` for stacking-context control.

The visual theme is a dark UI inspired by developer tooling: deep navy backgrounds, soft accent colours, and high-contrast meme text overlays.

---

## Source + Explanation

```css
1   :root {
2     --bg:     #0f1220;
3     --panel:  #171a2b;
4     --text:   #e8eaf6;
5     --muted:  #a6accd;
6     --accent: #7c9cff;
7     --danger: #ff6b6b;
8     --radius: 14px;
9     --shadow: 0 10px 30px rgba(0,0,0,.35);
10  }
```
`:root` targets the `<html>` element and has the highest possible specificity among element selectors, making these variables truly global. Each `--name` is a **CSS custom property** (CSS variable). Using variables here means updating a colour like `--accent` in one place reflows it everywhere it's referenced. `--shadow` stores the entire box-shadow value so all cards share an identical shadow without repetition.

---

```css
12  * { box-sizing: border-box; }
```
The universal selector resets the box model for every element: padding and border are now included *inside* the declared `width`/`height` instead of added on top. Without this, a `width: 100%` element with padding would overflow its container. This is the single most important CSS reset in modern layouts.

---

```css
13  body {
14    margin: 0;
15    min-height: 100vh;
16    font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif;
17    color: var(--text);
18    background: radial-gradient(1200px 600px at 10% -10%, #20254a, transparent 60%), var(--bg);
19    display: grid;
20    grid-template-rows: auto 1fr;
21    gap: 28px;
22  }
```
- `margin: 0` — removes the browser's default 8 px body margin.
- `min-height: 100vh` — ensures the background fills at least the full viewport even on short pages.
- `font-family` — the "system font stack": uses the OS's native UI font (San Francisco on macOS, Segoe UI on Windows, Roboto on Android). Zero network requests, native-quality typography.
- `color: var(--text)` — sets the default text colour for the whole page; child elements inherit it.
- `background` — two layers separated by a comma. The radial gradient creates a soft blue glow in the top-left corner; `var(--bg)` is the solid dark fallback that fills the rest. Layered backgrounds paint from front to back (gradient is on top).
- `display: grid; grid-template-rows: auto 1fr` — turns the body into a two-row grid. The `<header>` takes only as much height as its content (`auto`); the `.wrap` div expands to fill all remaining space (`1fr`). This keeps the header compact while allowing the content area to grow.
- `gap: 28px` — space between the two rows without needing margins on children.

---

```css
24  header {
25    padding: 28px 22px 0;
26  }
```
Top and side padding pushes the header text away from the viewport edges. Bottom padding is `0` because the `gap` on `body` already handles the space between header and content.

---

```css
28  h1 {
29    margin: 0 0 10px;
30    font-size: clamp(1.4rem, 2vw + 1rem, 2rem);
31    letter-spacing: .5px;
32  }
```
- `margin: 0 0 10px` — removes top margin (avoids collapsing with parent padding); adds 10 px below.
- `clamp(1.4rem, 2vw + 1rem, 2rem)` — **fluid typography without a media query**. The font scales with the viewport: minimum `1.4rem` on narrow screens, maximum `2rem` on wide ones, with `2vw + 1rem` as the preferred scaling formula in between. `clamp(min, preferred, max)` is the modern alternative to multiple `@media` breakpoints for text sizing.
- `letter-spacing: .5px` — slight tracking makes uppercase/title text feel more refined.

---

```css
33  p.sub {
34    margin: 0;
35    color: var(--muted);
36  }
```
The subtitle paragraph uses `--muted` (a dimmer version of `--text`) to create visual hierarchy — it's clearly secondary to the `<h1>`.

---

```css
38  .wrap {
39    padding: 0 22px 30px;
40    max-width: 1200px;
41    width: 100%;
42    margin: 0 auto;
43  }
```
- `max-width: 1200px; width: 100%; margin: 0 auto` — the classic centred container pattern. `width: 100%` fills the viewport on narrow screens; `max-width` prevents it from becoming uncomfortably wide on large monitors; `margin: 0 auto` centres it horizontally.

---

```css
46  form.meme-form {
47    background: linear-gradient(180deg, #1a1e35, #15182b);
48    border: 1px solid #252a4b;
49    border-radius: var(--radius);
50    box-shadow: var(--shadow);
51    padding: 18px;
52    display: grid;
53    gap: 14px;
54    grid-template-columns: repeat(12, 1fr);
55    align-items: start;
56  }
```
The form is itself a **12-column grid** (a common design-system pattern). Child elements can occupy 1–12 columns with `grid-column: span N`. The slight gradient background (`#1a1e35` → `#15182b`) gives the form a subtle raised appearance against the page background. `align-items: start` stops tall children from stretching to match shorter siblings.

---

```css
58  .field {
59    display: grid;
60    gap: 6px;
61    grid-column: span 12;
62  }
63  .field.half { grid-column: span 6; }
```
`.field` defaults to **full width** (`span 12`). Adding `.half` narrows it to half the row (`span 6`). The two `.field.half` inputs ("Top text" and "Bottom text") share a row because `6 + 6 = 12`. Each `.field` is itself a mini-grid with `gap: 6px` so the label and input stack with a small gap between them.

---

```css
64  .field label {
65    font-size: .9rem;
66    color: var(--muted);
67  }
```
Labels are slightly smaller and dimmer than body text — they're informational scaffolding, not primary content.

---

```css
68  .field input[type="text"],
69  .field input[type="url"] {
70    width: 100%;
71    padding: 12px 14px;
72    background: #0f1230;
73    color: var(--text);
74    border: 1px solid #2a2f57;
75    border-radius: 10px;
76    outline: none;
77  }
```
Targets both input types so styling is shared. `outline: none` removes the browser's default blue focus ring — we replace it with a custom glow in the next rule. `background` is slightly darker than the form panel to create depth (input sits "inside" the form).

---

```css
78  .field input:focus {
79    border-color: var(--accent);
80    box-shadow: 0 0 0 3px rgba(124,156,255,.2);
81  }
```
When an input receives focus, the border turns accent-blue and a soft translucent glow spreads 3 px outward. The glow uses `rgba` with low opacity (`.2`) so it is visible but not overwhelming. This replaces the removed `outline` while remaining accessible — the focus state is clearly visible, satisfying WCAG 2.4.7.

---

```css
83  .actions {
84    grid-column: span 12;
85    display: flex;
86    gap: 10px;
87    align-items: center;
88    flex-wrap: wrap;
89  }
```
The actions row spans the full 12 columns. Flex layout places the button and hint text side by side with a 10 px gap. `flex-wrap: wrap` allows them to stack vertically on very narrow screens if they don't fit in one row.

---

```css
90  .actions button[type="submit"] {
91    appearance: none;
92    border: none;
93    background: linear-gradient(180deg, #7c9cff, #5679ff);
94    color: white;
95    padding: 12px 16px;
96    border-radius: 10px;
97    font-weight: 600;
98    cursor: pointer;
99    transition: transform .06s ease-in-out, filter .2s;
100 }
```
- `appearance: none` — strips OS-native button styling so our styles apply cleanly cross-browser.
- `border: none` — removes the default button border.
- The gradient goes from a lighter blue at the top to a deeper blue at the bottom, giving the button a subtle 3D feel.
- `transition` — animates `transform` (for the press-down effect) and `filter` (for hover brightness), with separate durations: the press snaps fast (`.06s`), while a potential hover filter would ease more gently (`.2s`).

---

```css
101 .actions button[type="submit"]:active { transform: translateY(1px) scale(.99); }
```
The `:active` state provides physical click feedback: the button moves 1 px down and shrinks 1% to simulate being pressed. Both changes together are imperceptible individually but combine for a satisfying tactile feel.

---

```css
102 .hint { color: var(--muted); font-size: .9rem; }
```
The Esc-key hint is styled like other secondary text — smaller and muted.

---

```css
105 .meme-grid {
106   margin-top: 22px;
107   display: grid;
108   grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
109   gap: 16px;
110 }
```
`repeat(auto-fill, minmax(240px, 1fr))` is the **responsive grid pattern that needs no media queries**:
- `minmax(240px, 1fr)` — each column is at least 240 px wide and expands equally to fill available space.
- `auto-fill` — creates as many columns as fit in the container. On a 1200 px wide container, that's roughly 4–5 columns; on a 480 px phone, 1–2 columns. The grid adapts automatically.

---

```css
112 .meme {
113   position: relative;
114   border-radius: 14px;
115   overflow: hidden;
116   background: #0c0f24;
117   border: 1px solid #252a4b;
118   box-shadow: var(--shadow);
119   isolation: isolate;
120 }
```
- `position: relative` — establishes the positioning context for the absolutely-positioned text overlays and delete button inside this card.
- `overflow: hidden` — clips the image and overlays to the card's rounded corners.
- `isolation: isolate` — creates a new **stacking context**. This confines `z-index` values to within the card, preventing child elements from accidentally overlapping content outside the card.

---

```css
122 .meme img {
123   display: block;
124   width: 100%;
125   height: 100%;
126   aspect-ratio: 1 / 1;
127   object-fit: cover;
128   filter: contrast(1.05) saturate(1.05);
129   user-select: none;
130 }
```
- `display: block` — removes the inline-element gap that appears below images by default.
- `aspect-ratio: 1 / 1` — forces a **square shape** regardless of the image's natural dimensions, keeping the grid uniform. Without this, tall portrait images would make some cards taller than others.
- `object-fit: cover` — fills the square without distortion; crops the image to fit rather than squishing it. The visual centre of the image is preserved.
- `filter: contrast(1.05) saturate(1.05)` — subtle 5% boost to contrast and saturation makes images look slightly more vivid on the dark background.
- `user-select: none` — prevents accidental text-selection behaviour when clicking rapidly.

---

```css
133 .meme .line {
134   position: absolute;
135   left: 50%;
136   transform: translateX(-50%);
137   width: 92%;
138   text-align: center;
139   font-weight: 900;
140   font-size: clamp(1rem, 5vw, 2rem);
141   letter-spacing: .5px;
142   text-transform: uppercase;
143   color: white;
144   -webkit-text-stroke: 2px black;
145   text-shadow:
146     -2px -2px 0 #000, 2px -2px 0 #000,
147     -2px  2px 0 #000, 2px  2px 0 #000,
148     0 0 12px rgba(0,0,0,.6);
149   pointer-events: none;
150 }
```
The classic meme text style:
- `position: absolute; left: 50%; transform: translateX(-50%)` — the standard "centre an absolutely-positioned element" trick: move the left edge to the midpoint, then shift left by half the element's own width.
- `width: 92%` — slightly narrower than the card so text never touches the edges.
- `text-transform: uppercase` — enforces the all-caps meme convention.
- `-webkit-text-stroke: 2px black` — WebKit/Blink vendor-prefixed property that adds an outline *inside* each letter stroke. Widely supported in modern browsers.
- `text-shadow` — four diagonal shadows at ±2 px create a full black border *around* the letters (the old-school cross-browser technique predating `text-stroke`). The fifth value adds a soft glow for extra depth. Together, `text-stroke` + `text-shadow` ensure the outline is visible on any background colour.
- `pointer-events: none` — the overlay divs sit on top of the image and delete button in the DOM. Without this, they would intercept clicks meant for the delete button underneath.

---

```css
152 .meme .line.top    { top: 8px; }
153 .meme .line.bottom { bottom: 8px; }
```
Anchors the top line 8 px from the top edge and the bottom line 8 px from the bottom edge of the card.

---

```css
156 .meme .delete {
157   position: absolute;
158   top: 10px;
159   right: 10px;
160   z-index: 2;
161   background: rgba(255, 107, 107, 0.92);
162   color: #fff;
163   border: none;
164   border-radius: 999px;
165   width: 34px;
166   height: 34px;
167   display: grid;
168   place-items: center;
169   font-weight: 800;
170   cursor: pointer;
171   box-shadow: 0 4px 12px rgba(0,0,0,.4);
172 }
```
- `position: absolute; top: 10px; right: 10px` — pins the button to the top-right corner of the card.
- `z-index: 2` — ensures the button renders above the image and text overlays so it is always clickable.
- `background: rgba(255, 107, 107, 0.92)` — uses `--danger` colour with 92% opacity; slightly translucent so a hint of the image shows through.
- `border-radius: 999px` — a very large value that always rounds any rectangle into a perfect pill/circle, regardless of dimensions. More robust than `50%` for elements that might change size.
- `display: grid; place-items: center` — the two-line centering shortcut for grid containers. `place-items` is shorthand for `align-items` + `justify-items`, centering the `×` both vertically and horizontally.
- `box-shadow: 0 4px 12px rgba(0,0,0,.4)` — lifts the button off the image visually, improving contrast against any background.

---

```css
173 .meme .delete:focus-visible {
174   outline: 3px solid white;
175   outline-offset: 2px;
176 }
```
`:focus-visible` applies the focus ring **only when the element is focused via keyboard**, not on mouse click. This is the correct modern approach: keyboard users see a clear white ring; mouse users don't see an unexpected outline after clicking. `outline-offset: 2px` gives the ring a small gap from the button edge so it is easier to see against the red background.

---

```css
179 .status {
180   margin-top: 10px;
181   min-height: 1.2em;
182   color: #ffd29d;
183   font-size: .95rem;
184 }
```
`min-height: 1.2em` — reserves vertical space even when the status text is empty. Without this, the layout would shift up and down every time a message appears or disappears, which is jarring.

---

```css
186 @media (max-width: 720px) {
187   .field.half { grid-column: span 12; }
188 }
```
The only breakpoint in the entire stylesheet. On viewports narrower than 720 px, the half-width fields ("Top text" and "Bottom text") expand to full width — stacking vertically instead of sitting side by side. The meme grid itself doesn't need a breakpoint because `auto-fill` handles that automatically.
