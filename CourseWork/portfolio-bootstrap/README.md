# Responsive Interactive Portfolio — Bootstrap 5 build

A modern, fully responsive personal portfolio built for the **iCD125
"Responsive Interactive Portfolio"** assignment at the *Institute of Computer
Engineering Technology (ICET)*.

This is the **Bootstrap 5** variant (a Tailwind build lives in the sibling
`../portfolio` folder). It uses **semantic HTML5**, **Bootstrap 5.3** (CDN) and
**vanilla JavaScript** — no build step, no npm install.

---

## Quick start

```bash
# From this folder
open index.html          # macOS
# or serve locally (recommended, so the GitHub API + fonts load smoothly)
python3 -m http.server 8001
# then visit http://localhost:8001
```

### Set your GitHub username (important)

The Projects section pulls live repositories from the GitHub REST API. Edit
`js/main.js` and change one line near the top:

```js
const GITHUB_USERNAME = "your-username";   // <-- put your GitHub username here
```

Until then, the section shows clearly-labelled sample projects plus a status
message telling you to set the username.

---

## Bootstrap components used

| Component | Where |
|---|---|
| **Navbar + collapse** | Fixed-top glass navbar with a mobile hamburger menu |
| **ScrollSpy** (`data-bs-spy`) | Highlights the active section with smooth scrolling |
| **Modal** | Project details opened from any card |
| **Accordion** | Education / "learning now" expandable panels in About |
| **Progress bars** | Animated skill bars with ARIA `progressbar` roles |
| **Toast** | Success feedback after the contact form validates |
| **Buttons / grid / cards** | Layout, CTAs and the project grid (`row`, `col-md-6 col-lg-4`) |
| **Color modes** (`data-bs-theme`) | Native Bootstrap dark/light theme, remembered in `localStorage` |

---

## How the requirements are met

| Requirement | Where / how |
|---|---|
| **Semantic HTML5** | `<nav>`, `<main>`, `<section>`, `<header>`, `<figure>`, `<ol>`, `<time>`, `<footer>` in `index.html` |
| **Styling: Flexbox + Grid** | Bootstrap grid (`row`/`col-*`) + flex utilities throughout |
| **Transitions & animations** | `css/styles.css` — `fade-up`, `shimmer`, `blink`, `float`, `pulse`, hover lifts, scroll-reveal |
| **Organized, modular styles** | `styles.css` split into 10 numbered sections; accent driven by CSS variables; Bootstrap vars overridden in one place |
| **Responsive (desktop/tablet/mobile)** | Mobile-first Bootstrap breakpoints, responsive navbar, `clamp()` type, custom media queries |
| **Smooth scrolling** | `data-bs-smooth-scroll` on the body + CSS `scroll-margin-top` for the fixed navbar |
| **Modals / expandable sections** | Bootstrap **modal** (project details) and **accordion** (About) |
| **Public API integration** | GitHub REST API in `js/main.js` → `loadRepos()`, with loading status, filtering and graceful fallback |
| **Advanced styling (≥2)** | ① CSS variables ② `data-bs-theme` dark/light toggle ③ Google Fonts ④ blend modes + filters (`mix-blend-mode`, `backdrop-filter`) |
| **Accessibility** | Skip link, focus rings, ARIA (`role`, `aria-controls`, `aria-live`, `progressbar`, `aria-label`), keyboard-operable components, alt text, `prefers-reduced-motion` |
| **Code quality** | Commented, sectioned source; small single-purpose functions; `escapeHtml()` on all API text |

### Bonus challenges included
- Learning **timeline** (Element 03)
- **Theme toggle** — Bootstrap native color modes, persisted in `localStorage`
- **Sticky navigation** with **scrollspy** + scroll-progress bar
- **Microinteractions** — hover lifts, icon rotations, animated progress bars, typing effect, back-to-top

---

## File structure

```
portfolio-bootstrap/
├── index.html          # Semantic markup + Bootstrap components
├── css/
│   └── styles.css      # Accent tokens, timeline, animations, responsive
├── js/
│   └── main.js         # Theme, nav, typing, GitHub API, modal, form, reveals
├── assets/
│   └── cv-placeholder.txt   # Replace with your real CV (.pdf)
└── README.md
```

---

## Customising it

1. **Identity** — replace `Your Name`, `YN` (brand/favicon), email, LinkedIn and
   GitHub links in `index.html`.
2. **Text** — hero intro, About paragraphs, timeline entries.
3. **Skills** — edit the progress list (update `data-width` *and* `aria-valuenow`).
4. **Accent colours** — change `--accent` / `--accent-rgb` / `--accent-2` at the
   top of `css/styles.css` (`:root` for light, `[data-bs-theme="dark"]` for dark).
5. **Projects** — set `GITHUB_USERNAME` in `js/main.js`; tweak `reposToShow` and
   the filter buttons to match your languages.
6. **Favicon** — the inline SVG data-URI at the top of `index.html`.

---

## Notes for marking
- The contact form is front-end only. It uses Bootstrap's validation classes and
  shows a toast; to actually receive messages, point the `<form>` at a service
  such as Formspree or your own backend.
- Bootstrap and Bootstrap Icons are loaded from the jsDelivr CDN. For production,
  self-host or bundle them and drop the unused parts.

Built with HTML5, Bootstrap 5 and vanilla JavaScript. No frameworks, no build step.
