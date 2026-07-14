# Handoff: Portfolio Landing Page — "Terminal Dark Green"

Personal landing page for **Laurence Rebadulla — Senior Software Engineer | AI Developer**.
Goal: attract employers and clients. Positions AI/LLM integration as the differentiator on top of 9 years of full-stack experience. Single page: hero → stats → about → skills → projects → experience → contact (WhatsApp QR + email + CV download).

## About the Design Files

The files in `reference/` are **design references created in HTML** — a prototype showing the intended look and behavior, **not production code to copy directly**. Your task is to **recreate this design in your target codebase's environment** (Next.js/React, Astro, plain HTML — whatever you choose) using its established patterns. If no environment exists yet, a static site (Astro or plain Vite + TS) is the best fit — this page has no server needs.

Open `reference/Landing Options.dc.html` in a browser to see the design. It is a design-exploration canvas containing multiple iterations. **The chosen design is option `3a` — "Terminal — dark green (full page)"** (the section marked `data-screen-label="3a Terminal — dark green (full page)"`). Ignore every other option (1a–1c, 2a–2b, 3b, 3c) — they are rejected explorations kept for history. `3b`/`3c` are the same design with rejected accent colors.

`reference/hero-fx.js` contains the hero particle animation (`fx-particles`) as a vanilla web component — this file IS directly reusable or portable to your framework.

## Fidelity

**High-fidelity.** Colors, typography, spacing, copy and interactions are final. Recreate pixel-faithfully at desktop width; responsive behavior below ~1024px is NOT designed and is described in "Responsive" below as guidance.

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| `bg` | `#050807` | Page background (near-black green) |
| `bg-panel` | `#0a0f0b` | Cards, window chrome bar, contact band |
| `text` | `#dbe5df` | Primary text, headings |
| `text-secondary` | `#8a988f` | Body copy, descriptions |
| `text-muted` | `#6b7a71` | Labels, captions, comment-style text |
| `text-faint` | `#4a5750` | Footer |
| `accent` | `#28c05a` | Terminal green — prompts, links, primary buttons, highlights |
| `accent-soft` | `#7fe6a3` | Text on green-tinted chips |
| `accent-border` | `rgba(40,192,90,0.35)` – `0.4` | Featured-card and chip borders |
| `accent-tint` | `rgba(40,192,90,0.12)` | Chip backgrounds |
| `hairline` | `rgba(255,255,255,0.07)` | Section/card borders (`0.06` footer, `0.12` photo frame, `0.2` secondary-button border) |
| `chrome-red / yellow / green` | `#ff5f56` / `#ffbd2e` / `#27c93f` | macOS traffic lights in window chrome |
| QR card | `#ffffff` | White card behind QR code |

Buttons with green background use `#050807` (bg color) as text color.

### Typography
One family everywhere: **JetBrains Mono** (Google Fonts), weights 400 / 500 / 600. Fallback: `monospace`.

| Style | Spec |
|---|---|
| H1 (hero) | 600 44px / 1.25, letter-spacing -0.03em |
| H2 (section) | 600 26–32px, letter-spacing -0.02em |
| Stat number | 600 28px |
| Card title | 600 14–16px |
| Body | 400 13–14.5px / 1.7–1.8 |
| Labels/captions | 400 11.5–13px |
| Nav / buttons | 500–600 13–13.5px |

### Spacing & shape
- Content max-width: 1180px design (recommend `max-width: 1240px; margin-inline: auto`), side padding **48px**
- Section vertical padding: **60–72px**
- Card padding: 22–26px; grid gaps: 16–20px
- Border radius: **6px** buttons, **8px** cards/photo, **10px** project cards, **12px** QR card, **99px** traffic-light dots
- No shadows anywhere — flat, hairline-bordered surfaces only

### Voice / copy rules
Terminal metaphor is the brand:
- Nav items are `./about`, `./skills`, `./projects`, `./experience`, `./contact`
- Section headers are shell commands in muted color with green `$`: `$ whoami`, `$ cat about.md`, `$ ls skills/ --featured`, `$ ls projects/ --sort=impact`, `$ git log --oneline --experience`, `$ ping laurence --now`
- Skill categories are directories (`llm-integration/`, `backend/`, `frontend/`, `cloud-devops/`, `databases/`); descriptions are `#`-prefixed comments
- Project titles are kebab-case (`rag-analytics-assistant`)
- Buttons: `./view-projects`, `./hire-me`, `↓ download-cv.pdf`
- Footer ends with `exit 0`
- Confident, direct tone. No emoji.

## Screens / Views (single page, top to bottom)

### 1. Window chrome bar
Full-width bar, `bg-panel`, bottom hairline. 12px 20px padding, flex row, 8px gap: three 11px traffic-light dots (red/yellow/green), then `laurence@glrebadulla.com — zsh` (12px, muted). Decorative only.

### 2. Nav
Flex row, space-between, 18px 48px padding, bottom hairline. Left: `~/laurence-rebadulla$` (600 14px, green; `$` in muted). Right: links (500 13px, `#8a988f`, 26px gap); `./contact` in green. Links smooth-scroll to sections. Hover: brighten to `text` color. Recommend sticky nav with `bg` at ~90% opacity + backdrop-blur once scrolled.

### 3. Hero — 560px tall, relative, overflow hidden
- **Background layer:** interactive particle network canvas (see Animations). Accent `#28c05a`.
- **Overlay:** `radial-gradient(ellipse 70% 90% at 30% 50%, rgba(5,8,7,0.5), rgba(5,8,7,0.93))` so text stays readable, particles show through on the right.
- **Content** (left-aligned, vertically centered, max-width 840px):
  - `$ whoami` (13px muted, `$` green)
  - `laurence-rebadulla · senior software engineer | ai developer · remote, UTC+8 · open to work` (13px, `#8a988f`, 26px below)
  - H1: `I ship production software.` line-break `Then I make it {word}.` where `{word}` is a green **type-and-erase rotating word** cycling `intelligent → scalable → secure → reliable` (type 65–110ms/char, hold 2100ms, erase 38ms/char, 380ms pause; show static "intelligent" under `prefers-reduced-motion`). Period + **blinking block cursor** (22×44px green rect, steps blink 1.1s) follow the word.
  - Paragraph (max-width 660px): "9 years building web applications and backend systems in Python, Django, FastAPI, TypeScript and React. Recent focus: LLM integration and RAG pipelines. Production features on the OpenAI API, not demos."
  - Buttons (14px gap): primary `./view-projects` (green bg, dark text, 13px 26px padding, radius 6) → scrolls to projects; secondary `./hire-me` (transparent, 1px `rgba(255,255,255,0.2)` border) → `mailto:glrebadulla@gmail.com`

### 4. Stats strip
4-column grid, hairline top/bottom, columns divided by hairline right-borders. Each cell 26px 40px padding: big number (600 28px) + caption (11.5px muted).
1. `9+` — years shipping software
2. `4` — industries: media · health · gov · telecom
3. `LLM+RAG` (green) — integration & retrieval pipelines in production
4. `100%` — remote with intl teams since 2023

### 5. About
Grid `260px 1fr`, 56px gap, 68px 48px padding.
- Left: photo, 260×300, radius 8, hairline(0.12) border. Currently a placeholder — owner will supply photo.
- Right: `$ cat about.md` label → H2 `End-to-end ownership,` / `minimal supervision.` → paragraph (max 660px): "I build features end to end: database design, APIs, frontend, and deployment on AWS. I've shipped products in media, telehealth, government and telecom. These days I add LLM features through the OpenAI API and retrieval pipelines with embeddings and LangChain, so products answer from their own data instead of generic model output." → link row (12.5px): `glrebadulla.com ↗`, `github.com/renzyndrome ↗`, `linkedin/laurencerebadulla ↗` (open in new tab).

### 6. Skills — `$ ls skills/ --featured`
Below label: `languages: Python · TypeScript · JavaScript · SQL` (12.5px; values in `text`).
2-column grid, 16px gap:
- **Featured card, full width** (`grid-column: 1/-1`): `bg-panel`, **green border** `accent-border`. Title `llm-integration/` (green) + `# the differentiator` comment. Paragraph: "RAG pipelines and OpenAI features that answer from your data instead of guessing. Already running in tools a content team uses every day." Chips (8px gap, wrap): `OpenAI API`, `embeddings + retrieval (RAG)`, `LangChain`, `prompt engineering`, `Claude Code` — 12px, 6px 12px padding, radius 4, green border + `accent-soft` text.
- **Four half-width cards** (hairline border): title `dir/`, one-line `#` comment, muted tech list:
  - `backend/` — # APIs that hold up under real load — Django · DRF · FastAPI · Flask · Node.js · Celery · Redis · REST design
  - `frontend/` — # typed React interfaces that load fast — React · Next.js · TanStack (Start · Router · Query) · Vite
  - `cloud-devops/` — # deployed, monitored and scaled — AWS (EC2 · S3 · Lambda · RDS · API Gateway · CloudWatch) · Docker · Linux · CI/CD · Cloudflare Workers + R2
  - `databases/` — # the right store for the job — PostgreSQL · MySQL · MongoDB · Firebase · Supabase

### 7. Projects — `$ ls projects/ --sort=impact`
H2: `AI in production, not in demos.` 2×2 grid, 20px gap. Card: `bg-panel`, hairline border, radius 10, overflow hidden; 200px screenshot area (placeholder now — owner will supply screenshots), hairline divider, 24px padding body: kebab-case title (600 16px), description (13px/1.7 secondary), tag chips (11px, radius 4; AI tags use `accent-tint` bg + `accent-soft` text, neutral tags `rgba(255,255,255,0.06)` bg + `#8a988f` text).
1. **rag-analytics-assistant** — "Plain-language search over company analytics. Retrieval pipelines with OpenAI embeddings + LangChain ground every answer in real company data." — LangChain · OpenAI · FastAPI
2. **llm-content-tools** — "LLM features in internal tools via the OpenAI API: content suggestions, automated reports, and plain-language search that cut manual work for the content team." — OpenAI API · prompt eng. · Python
3. **creator-analytics-dashboard** — "Real-time revenue, engagement and growth tracking with automated Telegram & Discord alerts. The content team uses it daily instead of pulling reports by hand." — Python · AWS · Telegram · Discord API
4. **telehealth-platform** — "Employees book and meet mental-health practitioners over live chat, voice and video. Built with Python, Django REST, React and Next.js on AWS." — Django REST · Next.js · AWS

Card hover (recommended): border-color → `accent-border`, 150ms ease.

### 8. Experience — `$ git log --oneline --experience`
Rows: grid `190px 1fr`, 32px gap, 22px vertical padding, hairline top border (bottom border on last). Date (12.5px; current role's date in green, rest muted) + role title (600 15px) + one-line summary (13px/1.7 muted).
1. `2024 — present` — Senior Full Stack Developer · US-based Media Company (remote) — LLM features via OpenAI API, retrieval pipelines, real-time analytics, social automation. Python, FastAPI, React, AWS.
2. `2023 — 2024` — Senior Full Stack Developer · Connect Psych Services (remote) — Telehealth platform with live chat, voice and video. Django REST, React, Next.js on AWS.
3. `2020 — 2023` — Software Developer → Senior · LITS — Led E-Legislative System for local government; Odoo CRM/Website/HRIS. Promoted for technical leadership.
4. `2018 — 2019` — Junior Software Engineer · Infoshift Inc. — Public developer APIs for one of the largest PH telecoms. Flask, Node.js, AWS microservices.

### 9. Contact — `$ ping laurence --now`
Full-width band, `bg-panel`, hairline top border, 60px 48px padding. Grid `1fr 220px`, 56px gap, center-aligned.
- Left: H2 `Let's build something.` → "Available for senior full-stack and AI integration work. Email me, or scan the code to open a WhatsApp chat directly." → buttons: primary `glrebadulla@gmail.com` (green, mailto) + secondary `↓ download-cv.pdf` (downloads the CV PDF) → muted link row: `glrebadulla.com ↗ · github ↗ · linkedin ↗`
- Right: white card (14px padding, radius 12) with 180×180 QR image (`assets/wa-qr.png`, encodes `https://wa.me/639171477836`), caption `scan → WhatsApp` (12px muted).

### 10. Footer
18px 48px padding, hairline(0.06) top border: `© 2026 Laurence Rebadulla · Philippines (remote, UTC+8) · exit 0` (12px, `#4a5750`).

## Interactions & Behavior

- **Nav / hero buttons:** smooth-scroll to anchored sections; `./hire-me` and email button = `mailto:glrebadulla@gmail.com`; CV button = download attribute on PDF link; external links `target="_blank" rel="noopener"`.
- **Blinking cursor:** `@keyframes blink { 0%,49% {opacity:1} 50%,100% {opacity:0} }`, 1.1s `steps(1)` infinite.
- **Hover states:** links brighten; primary buttons brighten ~8% (e.g. `filter: brightness(1.1)`); secondary buttons border → `rgba(255,255,255,0.4)`; project cards border → green. 150ms ease.
- **Rotating hero word:** see H1 spec above; source in `reference/hero-fx.js` (`FxTypeWord` class).
- **Hero particle animation** (port from `reference/hero-fx.js`, `FxParticles` class):
  - Canvas fills hero, `pointer-events: none`, DPR-aware (cap 2), pauses when off-screen (IntersectionObserver)
  - Particle count: `min(130, floor(width*height/11000))`; each dot r 0.6–2.2px, drift velocity ±0.35px/frame, wraps at edges
  - Lines drawn between particles closer than **140px**, `rgba(255,255,255,0.14)`, alpha ∝ proximity
  - Mouse (tracked on hero, not canvas) **repels** particles within **190px** (force ∝ 1 − d/190, ×0.9); particles near cursor render in **accent green**, slightly larger; others `rgba(255,255,255,0.55)`
  - Respect `prefers-reduced-motion: reduce` → render static frame, no loop
- **No other scroll animations.** Do not add parallax, fade-ins, or reveal-on-scroll — the page is intentionally still except the hero and cursor.

## State Management
None. Fully static page — no forms, no data fetching, no client state beyond the animation loop.

## Responsive (guidance, not designed)
- ≤1024px: stats 2×2; skills, projects, about, contact collapse to 1 column (QR below text, centered); experience rows stack date-over-title
- ≤640px: side padding 24px; H1 32px/1.3; nav links collapse to `./menu` or horizontal scroll
- Keep tap targets ≥44px

## Assets
| Asset | Status |
|---|---|
| `reference/assets/wa-qr.png` | ✅ Final — QR for `https://wa.me/639171477836` (regenerate at higher res if needed) |
| `reference/uploads/latest-cv.pdf` | ✅ Final CV for the download button |
| Profile photo (260×300) | ⛔ Placeholder — owner supplies |
| 4 project screenshots (~2:1, ≥1200px wide) | ⛔ Placeholders — owner supplies |
| JetBrains Mono | Google Fonts (or self-host, weights 400/500/600) |

## Files
- `reference/Landing Options.dc.html` — design canvas; **option 3a is the spec** (open in browser)
- `reference/hero-fx.js` — particle animation source (portable)
- `reference/support.js` — prototype runtime only; ignore
- `CLAUDE.md` — drop-in rules file for the implementation repo
- `skills/design-tokens.md` — token/layout quick reference
- `skills/terminal-copy-voice.md` — copywriting rules for the terminal metaphor
- `skills/hero-animations.md` — animation implementation specs
