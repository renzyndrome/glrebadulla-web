# CLAUDE.md — Portfolio Landing Page (Terminal Dark Green)

Rules for implementing and maintaining glrebadulla.com. Full spec: `README.md`. Design reference: option **3a** in `reference/Landing Options.dc.html` (open in a browser; ignore all other options).

## Skills
Read the relevant skill file before working on that area:
- `skills/design-tokens.md` — palette, type scale, layout grids, accent discipline, hover states
- `skills/terminal-copy-voice.md` — how to write any copy (nav paths, `$` commands, kebab-case names)
- `skills/hero-animations.md` — particle network + rotating typed word specs

## Non-negotiable design rules
1. **One font: JetBrains Mono** (400/500/600). Never introduce a second family.
2. **Palette is fixed.** bg `#050807`, panel `#0a0f0b`, text `#dbe5df`, secondary `#8a988f`, muted `#6b7a71`, accent `#28c05a`, chip text `#7fe6a3`. Hairlines are white at 6–12% alpha. No new colors, no gradients except the hero radial overlay.
3. **Flat surfaces.** Hairline borders only — no box-shadows, no glassmorphism.
4. **Terminal voice everywhere.** Nav = `./section` paths; section headers = shell commands (`$ whoami`, `$ cat about.md`, `$ ls skills/ --featured`, `$ git log --oneline --experience`, `$ ping laurence --now`); skills = directories with `#` comments; project names = kebab-case; footer ends `exit 0`. New content must follow this metaphor.
5. **Motion budget:** hero particle canvas + rotating typed word (intelligent/scalable/secure/reliable) + blinking cursor + 150ms hover transitions. Nothing else — no scroll-reveal, no parallax. Honor `prefers-reduced-motion`.
6. **No emoji. No stock icons.** Text and hairlines carry the design.
7. Radius scale: 6px buttons / 8px cards / 10px project cards / 12px QR card.
8. Green buttons use `#050807` text. Accent green is for: prompts (`$`), links, primary buttons, one highlighted stat, featured-card border, current-role date. Don't spread it further.

## Content rules
- Positioning line is exactly: **Senior Software Engineer | AI Developer**.
- AI/LLM is always the lead differentiator (featured card first, hero copy mentions LLM integration and RAG pipelines).
- Copy tone: confident, direct, no filler, no buzzword salad. Claims must map to real CV facts.
- No em-dashes in copy. Use periods, commas, or " · " separators. Avoid stacked adjectives and AI-sounding phrasing.
- Contact must always expose: email `glrebadulla@gmail.com`, WhatsApp QR (`https://wa.me/639171477836`), CV download, github/linkedin/site links.

## Engineering rules
- Static site — no backend, no client state beyond the animation loop. Keep Lighthouse perf ≥95.
- Particle canvas: DPR-capped at 2, pause off-screen, `pointer-events:none`, mouse listener on the hero section. Port from `reference/hero-fx.js`.
- Semantic HTML (`<nav>`, `<section id>`, `<h1>`–`<h2>`), smooth-scroll anchors, alt text on QR/photo/screenshots, visible focus states (green outline), tap targets ≥44px on mobile.
- Self-host or Google-Fonts JetBrains Mono with `font-display: swap`.
- Images: lazy-load project screenshots; QR and hero stay eager.
