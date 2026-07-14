# Plan: Build glrebadulla.dev — Terminal Dark Green Portfolio (Astro + TS)

## Context

This repo implements a single-page professional portfolio for **Laurence Rebadulla — Senior Software Engineer | AI Developer**, from the design handoff in `design/`. The chosen design is option **#3a "Terminal — dark green (full page)"**: the entire page reads as a zsh terminal session (JetBrains Mono only, `#050807` background, `#28c05a` accent, no shadows, no icons/emoji, terminal copy voice). The site is fully static and deploys to Cloudflare Pages.

**Decisions (final):** Astro + TypeScript · contact email `glrebadulla@gmail.com` · deploy to Cloudflare Pages · profile photo + 4 project screenshots not yet available → ship terminal-styled placeholders that are trivially swappable.

**Source-of-truth files** (all under `design/Professional Portfolio Landing Page/design_handoff_portfolio_landing/`):
- `README.md` — master spec (sections, tokens, copy, interactions). Transcribe copy character-for-character.
- `reference/Landing Options.dc.html` — option `#3a` markup is the visual ground truth. All other options are rejected.
- `CLAUDE.md` — non-negotiable rules; adapted copy lives at repo root.
- `skills/design-tokens.md`, `skills/hero-animations.md`, `skills/terminal-copy-voice.md`
- `reference/hero-fx.js` — portable vanilla web components (`FxParticles`, `FxTypeWord`) to port. **Ignore `reference/support.js`** (prototype-only).
- `reference/assets/wa-qr.png`, `reference/uploads/latest-cv.pdf` — final assets copied into `public/`.

## Phase 0 — Project docs

- This file (`docs/PLAN.md`).
- `CLAUDE.md` at repo root: adapted from the handoff rules, paths updated, plus project conventions (Astro + TS, npm scripts, Cloudflare Pages, owner commits manually).

## Phase 1 — Scaffold & foundations (~1.5h)

```bash
npm create astro@latest . -- --template minimal --no-git --install --yes
npm install @fontsource/jetbrains-mono
```

- `astro.config.mjs`: minimal, `site: 'https://glrebadulla.dev'`. Static output (default), no adapter needed for Cloudflare Pages.
- **Fonts: self-host** via `@fontsource/jetbrains-mono` 400/500/600 imported in the layout (no Google Fonts round trips — protects Lighthouse ≥95; `font-display: swap` built in).
- `src/styles/tokens.css`: CSS custom properties from `skills/design-tokens.md` + README (bg `#050807`, panel `#0a0f0b`, text tiers `#dbe5df/#8a988f/#6b7a71/#4a5750`, accent `#28c05a`, accent-soft `#7fe6a3`, hairlines white @6–12% alpha, chrome dots, container 1240px, `--pad-x: 48px`, radii 6/8/10/12).
- `src/styles/global.css`: reset, base type, `.container`, `.btn-primary`/`.btn-secondary`, `:focus-visible` green outline, cursor-blink keyframes, `.placeholder-hatch` (repeating 45° white/5% stripes + muted `[ your photo ]` / `[ project screenshot ]` label — the hatch is in the approved 3a markup, so it's allowed).
- `src/layouts/Layout.astro`: `<head>` meta (title `Laurence Rebadulla · Senior Software Engineer | AI Developer`, description from hero copy, canonical, `theme-color #050807`, OG tags **without** og:image for now + TODO comment), font imports, skip link → `#main`.
- Copy assets: `wa-qr.png` → `public/wa-qr.png`; `latest-cv.pdf` → `public/uploads/latest-cv.pdf`.
- `public/favicon.svg`: `#050807` rounded rect with monospace `>_` glyph in `#28c05a`. `public/robots.txt`: allow all, no sitemap (single page).

## Phase 2 — Top-half sections (~2h)

One `.astro` component per section, each with scoped `<style>`, assembled in `src/pages/index.astro`. Copy lives inside each component; repeating structures (stats, skills, projects, experience rows, contact links) as typed `const` arrays in frontmatter. Keep files ~80–120 lines.

- `ChromeBar.astro` — traffic lights (decorative, `aria-hidden`) + `laurence@glrebadulla.dev — zsh` (em-dash here is a fixed design string — keep).
- `SiteNav.astro` — sticky, 90% bg + backdrop-blur; `~/laurence-rebadulla$` prompt + `./about ./skills ./projects ./experience ./contact` links. Note: in nav the `$` is *muted* and path *green* (inverted vs section labels).
- `Hero.astro` — 560px, `<fx-particles accent="#28c05a">` as direct child (mouse listener attaches to parent), radial overlay (README's `rgba(5,8,7,…)` values — the only permitted color gradient), H1 `I ship production software. Then I make it {word}.` with `<fx-typeword words="intelligent,scalable,secure,reliable">` (SSR fallback text "intelligent"), blinking block cursor 22×44 (`aria-hidden`, CSS steps blink), buttons `./view-projects` (scroll) and `./hire-me` (`mailto:glrebadulla@gmail.com`). Green buttons use `#050807` text, never white.
- `StatsStrip.astro` — 4 cols: `9+`, `4`, `LLM+RAG` (only this one green), `100%`.

## Phase 3 — Bottom-half sections (~2.5h)

- `AboutSection.astro` — `$ cat about.md`, 260×300 photo placeholder (optional `imageSrc` prop → swap later by dropping a file in `public/images/` + one string), bio, external links (`↗`, `target="_blank" rel="noopener"`).
- `SkillsSection.astro` — `$ ls skills/ --featured`: full-width `llm-integration/` green-bordered card + 4 half cards (backend, frontend, cloud-devops, databases) with `# comment` taglines.
- `ProjectsSection.astro` — `$ ls projects/ --sort=impact`, 2×2 grid, kebab-case names, screenshot placeholders (same swappable `imageSrc` pattern, `loading="lazy"` when real). Chip discipline: AI chips = green tint bg + `#7fe6a3` text; neutral chips = white/6% bg + `#8a988f`; featured-skill chips = green *border* (three distinct styles).
- `ExperienceSection.astro` — `$ git log --oneline --experience`, 4 roles 2018→present; only the `2024 — present` date is green.
- `ContactSection.astro` — `$ ping laurence --now`: email button → `mailto:glrebadulla@gmail.com`, WhatsApp QR card (`scan → WhatsApp`, alt text), CV button `↓ download-cv.pdf` with the exact `download` filename from the 3a markup.
- `SiteFooter.astro` — `© 2026 Laurence Rebadulla · Philippines (remote, UTC+8) · exit 0`. The `#4a5750` faint color fails AA — accepted design tradeoff, do not alter palette.

Semantics: chrome+nav in `<header>`, sections in `<main id="main">` with ids `about/skills/projects/experience/contact`, one `h1` (hero), section `$ command` labels rendered as `h2`s.

## Phase 4 — Hero animations (~1.5h)

Port `reference/hero-fx.js` → `src/scripts/hero-fx.ts`:
- Keep only `FxBase`, `FxParticles`, `FxTypeWord`; **delete `FxWire`/`FxWaves`** (dead code). Light TS typing, no animation-math changes.
- **Gap to fix**: the reference handles reduced motion in `FxTypeWord` but NOT in `FxParticles` — spec requires a single static frame. Add to `FxBase.connectedCallback`: if `prefers-reduced-motion: reduce`, draw once and skip the rAF loop.
- Have `FxTypeWord` clear existing text (`this.textContent = ''`) before appending its span, so the SSR fallback word doesn't duplicate.
- Load via plain `<script>import '../scripts/hero-fx'</script>` in `Hero.astro` (no `client:` directives — those are for framework islands).
- Word cycle fixed: intelligent → scalable → secure → reliable; ~65–110ms type / 2100ms hold / 38ms erase / 380ms pause. No fixed-width reservation for the word.

## Phase 5 — Responsive + a11y pass (~1.5h)

Responsive below ~1024px is undesigned; these are the judgment calls:
- **≤1024px**: stats → 2×2 grid; about/skills/projects → 1 column; experience rows stack date-above-title; contact QR below text, centered (README explicitly says this); hero stays 560px.
- **≤640px**: `--pad-x: 24px` token override; H1 32px with cursor scaled to 16×32; nav becomes horizontal-scroll (no JS menu — on-brand); hero `min-height: 480px`, buttons wrap; stats stay 2×2 with tighter padding; tap targets ≥44px.
- A11y: skip link, landmarks, `aria-hidden` on decorative bits, green `:focus-visible`, reduced-motion covers particles/typeword/cursor-blink/smooth-scroll. No scroll-reveal/fade-in animations — the page is intentionally still.

## Phase 6 — Polish & deployment prep (~1h)

- `npx astro check` + `npm run build` clean.
- Cloudflare Pages (owner connects repo in dashboard): framework preset **Astro**, build `npm run build`, output `dist`, env `NODE_VERSION=22`. No adapter/wrangler/_headers needed. Custom domain `glrebadulla.dev` added later in Pages settings.
- Git: **owner runs `git init`, commits, and pushes manually**.

## Verification

1. `npm run dev` — side-by-side visual diff vs `Landing Options.dc.html` option `#3a` at ≥1280w: palette, accent discipline (green ONLY on `$` section prompts, links, primary buttons, `LLM+RAG`, featured card, current-role date, hero word/cursor, near-cursor particles), chip variants, exact strings (`exit 0`, `↓ download-cv.pdf`, `scan → WhatsApp`, `~/laurence-rebadulla$`).
2. Interactions: smooth-scroll nav, `mailto:` buttons, CV download filename, hovers at 150ms, particle mouse repulsion, word cycle order/timing.
3. `npm run preview` + Lighthouse (mobile & desktop): **perf ≥95** (spec requirement), a11y/BP/SEO ≥95.
4. DevTools → emulate `prefers-reduced-motion: reduce`: static word, one static particle frame, no cursor blink, instant scroll.
5. Resize pass at 1024/768/640/375px: no horizontal overflow, ≥44px tap targets.
6. Scroll hero off-screen → confirm rAF work stops (IntersectionObserver in FxBase).

## Easy-to-get-wrong details

- Em-dashes exist in fixed design strings (`— zsh`, `2024 — present`) — keep them; the "no em-dashes" rule governs prose only.
- Nav `$` muted / path green is inverted from section labels (`$` green).
- Radial overlay: README values (`rgba(5,8,7,…)`) win over the slightly different 3a markup values.
- Green buttons always use dark `#050807` text.
- No motion beyond the two hero effects + cursor blink.

## Pending owner inputs

- Profile photo (260×300) → drop into `public/images/` and set `imageSrc` in `AboutSection.astro`.
- 4 project screenshots (~2:1, ≥1200px wide) → drop into `public/images/` and set `imageSrc` per project in `ProjectsSection.astro`.
- og:image (add once photo/screenshot assets exist).
