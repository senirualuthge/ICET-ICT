# Responsive Interactive Portfolio

A modern, fully responsive personal portfolio website built for the **iCD125
"Responsive Interactive Portfolio"** assignment at the *Institute of Computer
Engineering Technology (ICET)*.

The site uses **semantic HTML5**, **Tailwind CSS** (via CDN) and **vanilla
JavaScript** — no build step, no npm install. Just open `index.html`.

---

## Quick start

```bash
# From the portfolio folder
open index.html          # macOS
# or serve it locally (recommended, so the GitHub API + fonts load smoothly)
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Set your GitHub username (important)

The Projects section pulls live repositories from the GitHub REST API. Open
`js/main.js` and change one line near the top:

```js
const GITHUB_USERNAME = "your-username";   // <-- put your GitHub username here
```

Until you do, the section shows clearly-labelled sample projects and a status
message telling you to set the username.

---

## How the requirements are met

| Requirement | Where / how |
|---|---|
| **Semantic HTML5** | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<figure>`, `<ol>`, `<time>`, `<footer>` in `index.html` (one `<h1>`, logical heading order) |
| **Styling: Flexbox + Grid** | Tailwind utilities (`grid`, `md:grid-cols-2`, `flex`, `gap-*`) across hero, about, projects, contact |
| **Transitions & animations** | `css/styles.css` — `fade-up`, `shimmer`, `blink`, `float`, typed cursor, hover lifts, scroll-reveal |
| **Organized, modular styles** | `styles.css` split into 11 numbered sections; design system driven by CSS variables; Tailwind config in `index.html` |
| **Responsive (desktop/tablet/mobile)** | Mobile-first Tailwind classes + `md:`/`lg:` breakpoints, `clamp()` type, media queries in CSS, accessible mobile menu |
| **Smooth scrolling** | `scroll-behavior: smooth` **and** JS `scrollTo({ behavior: "smooth" })` with header offset |
| **Modals / lightbox / expandable** | Native `<dialog>` project modal (Esc, focus trapping, click-outside) + accordion in About |
| **Public API integration** | GitHub REST API in `js/main.js` → `loadRepos()`, with loading status, filtering and graceful fallback |
| **Advanced styling (≥2)** | ① CSS variables ② dark/light theme toggle ③ Google Fonts ④ blend modes + filters (`mix-blend-mode`, `backdrop-filter`) |
| **Accessibility** | Skip link, visible focus rings, ARIA (`aria-expanded`, `aria-controls`, `aria-live`, `role="dialog"`, `aria-current`, `progressbar`), keyboard-operable everything, alt text, `prefers-reduced-motion` support |
| **Code quality** | Commented, sectioned source; small single-purpose functions; `escapeHtml()` on all API text |

### Bonus challenges included
- Learning **timeline** (Element 03)
- **Theme toggle** (dark / light, remembered in `localStorage`)
- **Sticky navigation** with **scrollspy** highlighting + scroll-progress bar
- **Microinteractions**: hover lifts, icon rotations, animated skill bars, typing effect, back-to-top

---

## File structure

```
portfolio/
├── index.html          # Semantic markup, Tailwind config, sections
├── css/
│   └── styles.css      # Design tokens, components, animations, responsive
├── js/
│   └── main.js         # Theme, nav, scrollspy, accordion, GitHub API, modal, form
├── assets/
│   └── cv-placeholder.txt   # Replace with your real CV (.pdf)
└── README.md
```

---

## Customising it

1. **Identity** — replace `Your Name`, `YN` (logo/favicon), email, LinkedIn and
   GitHub links in `index.html`.
2. **Text** — hero intro, About paragraphs, timeline entries.
3. **Skills** — edit the `.bar` list (update `data-width` *and* `aria-valuenow`).
4. **Theme colors** — change `--accent` / `--accent-2` in `css/styles.css`
   (`:root` for light, `html.dark` for dark).
5. **Projects** — set `GITHUB_USERNAME` in `js/main.js`; tweak `reposToShow`
   and the filter buttons to match your languages.
6. **Favicon** — the inline SVG data-URI at the top of `index.html`.

---

## Notes for marking
- The contact form is front-end only (validated with JavaScript). To actually
  receive messages, point the `<form>` at a service such as Formspree or your own
  backend — the validation logic stays the same.
- Tailwind is loaded from the Play CDN, which is intended for development and
  prototypes. For a production deployment, build Tailwind and serve a compiled,
  purged stylesheet instead.

Built with HTML5, Tailwind CSS and vanilla JavaScript. No frameworks, no build step.
