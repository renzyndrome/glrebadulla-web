# glrebadulla.dev

Personal portfolio landing page for **Laurence Rebadulla — Senior Software Engineer | AI Developer**.

A single, fully static page styled as a dark-green terminal session (the "Terminal Dark Green" design, option **3a** from the design handoff). One typeface, a fixed palette, flat hairline-bordered surfaces, and an interactive particle-network hero. Built with Astro + TypeScript and deployed to Cloudflare Pages.

---

## Tech stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) `^7` — static production output, no adapter, no backend |
| Language | TypeScript (strict) |
| Content | Astro content collections — `projects` (YAML) + blog `posts` (Markdoc), read at build time |
| CMS | [Keystatic](https://keystatic.com) in **local mode** — a git-based admin UI at `/keystatic`, dev-only (see [Content & CMS](#content--cms-keystatic)) |
| Font | JetBrains Mono, self-hosted via [`@fontsource/jetbrains-mono`](https://fontsource.org) (latin subset, weights 400/500/600, `font-display: swap`) |
| Styling | Plain CSS — design tokens in `src/styles/tokens.css`, primitives in `src/styles/global.css`, scoped `<style>` per component |
| Hero animation | Vanilla custom elements (`<fx-particles>`, `<fx-typeword>`) in `src/scripts/hero-fx.ts`, no framework runtime |
| Hosting | Cloudflare Pages (static) |

The **deployed site is fully static** — content is rendered from git-committed files at build time. The Keystatic admin only runs locally (see below), so production ships no adapter, no server routes, and no React runtime. No client state beyond the hero animation loop.

---

## Prerequisites

- **Node.js ≥ 22.12** (Astro 7 engine requirement). Cloudflare Pages uses `NODE_VERSION=22`.

> In this workspace, `node`/`npm` are not on `PATH` — Node is installed via nvm. Prefix commands with:
> ```bash
> export PATH="$HOME/.nvm/versions/node/v22.17.0/bin:$PATH"
> ```

## Getting started

```bash
npm install          # install dependencies

npm run dev          # start the dev server (http://localhost:4321)
npm run cms          # dev server WITH the Keystatic admin at /keystatic (local editing)
npm run build        # production build → dist/ (fully static)
npm run preview      # serve the built dist/ locally
npm run check        # astro check (type + template diagnostics)
```

---

## Project structure

```
.
├── astro.config.mjs          # static prod / gated Keystatic dev; cssTarget + format:'file' (see Notes)
├── keystatic.config.ts       # CMS schema: projects + blog posts, local storage
├── tsconfig.json             # extends astro/tsconfigs/strict
├── public/                   # copied verbatim to the site root
│   ├── favicon.svg           # terminal-prompt ">_" glyph
│   ├── robots.txt
│   ├── wa-qr.png             # WhatsApp QR (https://wa.me/639171477836)
│   ├── uploads/latest-cv.pdf # CV download target
│   └── images/               # profile photo, project screenshots (/projects), blog images (/blog)
├── src/
│   ├── content.config.ts     # Astro content collections: projects + posts (glob loaders + zod)
│   ├── content/              # CMS-managed content (edited via Keystatic or by hand)
│   │   ├── projects/*.mdoc         # per project: frontmatter (card fields) + Markdoc detail body
│   │   └── blog/*.mdoc             # per post: frontmatter + Markdoc body
│   ├── lib/projectGlyphs.ts  # centered `$` command banners for project cards
│   ├── layouts/Layout.astro  # <head>, meta/OG tags, font + global CSS imports
│   ├── pages/
│   │   ├── index.astro            # homepage (header / main / footer)
│   │   ├── projects/[slug].astro  # $ cat projects/<slug>.md (project detail page)
│   │   └── blog/
│   │       ├── index.astro        # $ ls blog/ --recent (post list)
│   │       └── [slug].astro       # $ cat blog/<slug>.md (renders Markdoc)
│   ├── components/           # one .astro file per homepage section, scoped styles
│   │   ├── ChromeBar.astro        # macOS window title bar
│   │   ├── SiteNav.astro          # sticky nav, ./section paths + ./blog
│   │   ├── Hero.astro             # particle canvas + rotating typed word
│   │   ├── StatsStrip.astro       # 4-column stats
│   │   ├── AboutSection.astro     # $ cat about.md
│   │   ├── SkillsSection.astro    # $ ls skills/ --featured
│   │   ├── ProjectsSection.astro  # $ ls projects/ --sort=impact (reads the projects collection)
│   │   ├── ExperienceSection.astro# $ git log --oneline --experience
│   │   ├── ContactSection.astro   # $ ping laurence --now (email · CV · QR)
│   │   └── SiteFooter.astro       # exit 0
│   ├── scripts/hero-fx.ts    # FxParticles + FxTypeWord custom elements
│   └── styles/
│       ├── tokens.css        # palette, layout, radii, type tokens
│       ├── global.css        # reset, buttons, hatch, skip link, focus, motion
│       └── prose.css         # shared Markdoc prose styles (blog + project detail)
├── docs/PLAN.md              # phase-by-phase build roadmap
├── CLAUDE.md                 # non-negotiable design/content/engineering rules
└── design/                   # design handoff (spec, 3a reference, skills, assets)
```

The design source of truth lives under `design/Professional Portfolio Landing Page/design_handoff_portfolio_landing/` — the `README.md` there is the master spec and option **3a** in `reference/Landing Options.dc.html` is the visual ground truth.

---

## Design & content rules

The look is deliberately fixed. Before changing anything visual or textual, read [CLAUDE.md](CLAUDE.md) — it is authoritative. Highlights:

- **One font** (JetBrains Mono) and a **fixed palette** (bg `#050807`, panel `#0a0f0b`, text `#dbe5df`, accent `#28c05a`, …). No new colors, no gradients except the hero radial overlay, no shadows.
- **Accent green is rationed** to: `$` prompts, links, primary buttons, the single `LLM+RAG` stat, the featured card border/chips, the current-role date, and the hero word + cursor.
- **Terminal voice everywhere**: nav is `./section`, section headers are shell commands, skills are directories with `#` comments, project names are kebab-case, the footer ends `exit 0`.
- **Motion budget**: hero particle canvas + rotating typed word + blinking cursor + 150ms hovers. Nothing else. `prefers-reduced-motion` is honored (static particle frame, static word, no blink, instant scroll).
- **No emoji, no icons, no em-dashes in prose** (em-dashes survive only in the fixed strings `— zsh` and the experience date ranges).

---

## Content & CMS (Keystatic)

Projects and blog posts are **content collections** — plain files in `src/content/`, read at build time. You can edit them two ways:

**A. Keystatic admin (recommended)**
```bash
npm run cms        # = KEYSTATIC=true astro dev
```
Open **http://localhost:4321/keystatic**, edit projects / posts in the UI, and save. Keystatic writes the files in `src/content/`. Then commit + push and Cloudflare rebuilds the static site.

**B. Edit the files directly** in `src/content/projects/*.yaml` and `src/content/blog/*.mdoc`.

Notes:
- The `/keystatic` admin runs **only** in `npm run cms`; the deployed site never includes it (the Keystatic/React/adapter integrations are gated behind the `KEYSTATIC` env flag in `astro.config.mjs`, so `npm run build` stays 100% static).
- **Blog:** posts are Markdoc (`.mdoc`); set `draft: true` to keep a post out of the production build (drafts still show in dev). Posts appear at `/blog` and `/blog/<slug>`.
- **Projects:** each project is a Markdoc file (`.mdoc`) — frontmatter holds the card fields (`order` sorts, `chips[].ai: true` = green AI chip, `icon` picks the card's centered `$` command banner), and the **Markdoc body is the detail-page content**. Each homepage card links to `/projects/<slug>`, which renders that body. An optional `image` overrides the panel.

### Upgrading to a hosted admin (GitHub mode)

Local mode edits only work on your machine. To edit from any browser on the live site, switch `keystatic.config.ts` storage to `{ kind: 'github', repo: 'renzyndrome/glrebadulla-web' }`, add the `@astrojs/cloudflare` adapter, and create a GitHub App for auth. That gives the deployed site a small serverless backend for the admin route (reader pages stay static). See the [Keystatic GitHub-mode docs](https://keystatic.com/docs/github-mode).

---

## Pending assets

- **Project cards** use an **original, centered `$` command banner** (`src/lib/projectGlyphs.ts`) — the owner's own illustrative one-liners, no third-party or former-employer imagery/data. Pick the command per project with the Keystatic `icon` field. If you have an original, permission-cleared screenshot, drop it in `public/images/projects/` and set that project's `image` to `/images/projects/<file>` — it overrides the banner and renders lazily.
- **Profile photo** (260×300) → drop into `public/images/` and set `imageSrc` on `<AboutSection />` in `src/pages/index.astro` (e.g. `imageSrc="/images/laurence.jpg"`). Still a placeholder.
- **og:image** → once real imagery exists, add an `og:image` `<meta>` in `Layout.astro` (there is a `TODO` marking the spot).

---

## Deployment (Cloudflare Pages)

Connect the repo in the Cloudflare Pages dashboard with:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION=22` |

No adapter, `wrangler`, or `_headers` file is required — the production build (`KEYSTATIC` unset) is plain static files. The custom domain `glrebadulla.dev` is added later in the Pages settings. Clean URLs (`/blog/<slug>`) work out of the box: the build emits `blog/<slug>.html` and Cloudflare Pages serves it extensionless (verified with `wrangler pages dev`).

> Git is managed manually by the owner. This project does not run `git commit` / `git push`.

---

## Accessibility & performance

- Semantic landmarks (`<header>`, `<nav>`, `<main id="main">`, `<footer>`), a skip link, one `<h1>`, and a valid heading outline.
- Visible green `:focus-visible` outlines; tap targets ≥ 44px on mobile.
- Self-hosted fonts (no Google Fonts round trip), lazy-loaded screenshots, eager QR, and a target of Lighthouse performance ≥ 95.

## Notes

- **CSS browser compatibility.** `astro.config.mjs` pins `vite.build.cssTarget` so the CSS minifier emits classic `@media (max-width: …)` queries instead of Media Queries Level 4 range syntax (`(width <= …)`), which is unsupported on Safari < 16.4. Keep this pin.
- **URL format.** `build.format: 'file'` emits `blog/<slug>.html` so extensionless URLs match the internal links exactly (no trailing-slash redirects on Cloudflare Pages).
- **Static/CMS split.** `astro.config.mjs` only loads the Keystatic + React + Node-adapter integrations when `KEYSTATIC=true`. Production builds leave them out entirely, so the deployed site has no server routes. `zod` is a direct dependency (imported in `src/content.config.ts`) to avoid the deprecated `astro:content` / `astro:schema` `z` re-export.
