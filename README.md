# glrebadulla.dev

Personal portfolio landing page for **Laurence Rebadulla — Senior Software Engineer | AI Developer**.

A fully static page in the **"One Accent"** design: a near-monochrome dark surface where the craft lives in the border language and the interaction states rather than in decoration. A five-step neutral ramp, two typefaces split strictly by job, one accent green spent on under 5% of pixels, and no filled buttons anywhere (hierarchy comes from surface elevation). Built with Astro + TypeScript and deployed to Cloudflare Pages.

The design source of truth is `design/mockups/02-monochrome-accent.html`, whose header comment documents the full system. The sibling files there are the rejected directions, kept for reference. The earlier "Terminal Dark Green" design was replaced in August 2026; `design/Professional Portfolio Landing Page/` and `docs/PLAN.md` describe it and are now history.

---

## Tech stack

| | |
|---|---|
| Framework | [Astro](https://astro.build) `^7` — static production output, no adapter, no backend |
| Language | TypeScript (strict) |
| Content | Astro content collections — `projects` (YAML) + blog `posts` (Markdoc), read at build time |
| CMS | [Keystatic](https://keystatic.com) in **local mode** — a git-based admin UI at `/keystatic`, dev-only (see [Content & CMS](#content--cms-keystatic)) |
| Fonts | Two, self-hosted via [fontsource](https://fontsource.org): Schibsted Grotesk (400/500) for prose and headings, JetBrains Mono (400/500) for data and metadata. `font-display: swap` |
| Content data | CV and profile facts in `src/data/*.ts` — components never hardcode facts |
| Styling | Plain CSS — design tokens in `src/styles/tokens.css`, primitives in `src/styles/global.css`, long-form in `src/styles/prose.css`, scoped `<style>` per component |
| Client JS | One file: `src/scripts/copy-email.ts` (the copy-to-clipboard state swap). Nothing else |
| Hosting | Cloudflare Pages (static) |

The **deployed site is fully static** — content is rendered from git-committed files at build time. The Keystatic admin only runs locally (see below), so production ships no adapter, no server routes, and no React runtime. The only client-side JavaScript is the copy-email listener.

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
│   ├── favicon.svg           # dark plate, "L" mark, one accent dot
│   ├── robots.txt
│   ├── wa-qr.png             # WhatsApp QR (the number is never rendered as text)
│   ├── uploads/latest-cv.pdf # CV download target
│   └── images/               # project screenshots (/projects), blog images (/blog)
├── src/
│   ├── assets/               # images processed by astro:assets (profile photo)
│   ├── content.config.ts     # Astro content collections: projects + posts (glob loaders + zod)
│   ├── content/              # CMS-managed content (edited via Keystatic or by hand)
│   │   ├── projects/*.mdoc         # per project: frontmatter (row fields) + Markdoc detail body
│   │   └── blog/*.mdoc             # per post: frontmatter + Markdoc body
│   ├── data/                 # CV facts, the single source of truth for copy
│   │   ├── profile.ts             # name, title, status, contact, links, hero facts
│   │   ├── experience.ts          # roles + education
│   │   ├── skills.ts              # AI/LLM group (the panel) + the flat groups
│   │   └── stats.ts               # the 4-cell strip
│   ├── layouts/
│   │   ├── Layout.astro           # <head>, meta/OG, canonical, font + global CSS
│   │   └── PageShell.astro        # skip link, masthead, main, footer, copy listener
│   ├── pages/
│   │   ├── index.astro            # homepage (composes the sections)
│   │   ├── projects/[slug].astro  # project detail (NDA note when no image)
│   │   └── blog/
│   │       ├── index.astro        # post list
│   │       └── [slug].astro       # post (renders Markdoc)
│   ├── components/           # one .astro file per section, scoped styles
│   │   ├── SiteNav.astro          # sticky masthead, sliding underline
│   │   ├── Hero.astro             # headline, actions, flat index card
│   │   ├── StatsStrip.astro       # 4-cell strip, one accent highlight
│   │   ├── AboutSection.astro     # photo on the spine + bio
│   │   ├── SkillsSection.astro    # raised AI panel + retrieval path, then flat groups
│   │   ├── ProjectsSection.astro  # dense rows from the collection + NDA note
│   │   ├── ExperienceSection.astro# real <table>, scrolls on mobile, education row
│   │   ├── WritingSection.astro   # latest posts
│   │   ├── ContactSection.astro   # copy email · CV · WhatsApp QR
│   │   ├── CopyEmailButton.astro  # shared two-face state swap button
│   │   └── SiteFooter.astro
│   ├── scripts/copy-email.ts # the only client JS: clipboard + aria-live
│   └── styles/
│       ├── tokens.css        # the system: ramp, text tiers, borders, type scale, spacing
│       ├── global.css        # reset, section frame, buttons, tags, scroller, motion
│       └── prose.css         # shared Markdoc prose styles (blog + project detail)
├── CLAUDE.md                 # non-negotiable design/content/engineering rules
├── docs/PLAN.md              # ARCHIVED: roadmap for the previous terminal design
└── design/
    ├── mockups/              # the 4 explored directions; 02 is the live design
    ├── cv/                   # source CV (ground truth for all claims)
    └── Professional Portfolio Landing Page/  # ARCHIVED: previous design handoff
```

The design source of truth is **`design/mockups/02-monochrome-accent.html`** — its header comment documents the whole system (ramp, border language, accent rule, spine, motion budget). Its siblings in that folder are the three rejected directions, kept for reference.

---

## Design & content rules

The look is deliberately fixed. Before changing anything visual or textual, read [CLAUDE.md](CLAUDE.md) — it is authoritative. Highlights:

- **Two fonts split by job**: grotesk for prose and headings, mono for every date, index, tag, label and table figure. Never a third family.
- **A five-step neutral ramp and three text tiers.** A text tier must clear WCAG AA against the *lightest* surface it sits on, not the page base. No new colors, no gradients.
- **Borders are layered translucency**, not solid lines: hairlines, a top-edge inset highlight on raised surfaces, and a tight negative-spread shadow. Never a glow.
- **Accent `#3ecf8e` on under 5% of pixels** — focus rings, active nav, the one `LLM+RAG` stat, AI/LLM tags, and the "Copied" state. Nothing else. There are **no filled buttons**; elevation carries hierarchy.
- **Motion budget: three state transitions** (nav underline, project-row hover, copy-button swap). Nothing animates on load. `prefers-reduced-motion` reduces all of it to opacity.
- **One vertical spine** (`--spine`) that section numbers, skill labels, project indices, post dates and the experience Period column all start on.
- **No emoji, no stock icons, no em-dashes in prose** (em-dashes survive only in fixed date ranges like `2024 — present`).
- **NDA**: most work is internal, so descriptions are shareable but screenshots and client data are not. The work section says so, and project pages without an `image` show the NDA note.

---

## Content & CMS (Keystatic)

Projects and blog posts are **content collections** — plain files in `src/content/`, read at build time. You can edit them two ways:

**A. Keystatic admin (recommended)**
```bash
npm run cms        # = KEYSTATIC=true astro dev
```
Open **http://localhost:4321/keystatic**, edit projects / posts in the UI, and save. Keystatic writes the files in `src/content/`. Then commit + push and Cloudflare rebuilds the static site.

**B. Edit the files directly** in `src/content/projects/*.mdoc` and `src/content/blog/*.mdoc`.

Notes:
- The `/keystatic` admin runs **only** in `npm run cms`; the deployed site never includes it (the Keystatic/React/adapter integrations are gated behind the `KEYSTATIC` env flag in `astro.config.mjs`, so `npm run build` stays 100% static).
- **Blog:** posts are Markdoc (`.mdoc`); set `draft: true` to keep a post out of the production build (drafts still show in dev). Posts appear at `/blog` and `/blog/<slug>`.
- **Projects:** each project is a Markdoc file (`.mdoc`) — frontmatter holds the row fields (`order` sorts by impact, `chips[].ai: true` marks a chip as AI/LLM so it takes the accent), and the **Markdoc body is the detail-page content**. Each homepage row links to `/projects/<slug>`, which renders that body. Set `image` only for an original, permission-cleared screenshot; leaving it empty shows the NDA note instead.
- **CV facts** (roles, skills, stats, contact) live in `src/data/*.ts`, not in components. Update them there.

### Upgrading to a hosted admin (GitHub mode)

Local mode edits only work on your machine. To edit from any browser on the live site, switch `keystatic.config.ts` storage to `{ kind: 'github', repo: 'renzyndrome/glrebadulla-web' }`, add the `@astrojs/cloudflare` adapter, and create a GitHub App for auth. That gives the deployed site a small serverless backend for the admin route (reader pages stay static). See the [Keystatic GitHub-mode docs](https://keystatic.com/docs/github-mode).

---

## Images and pending assets

- **Profile photo:** `src/assets/laurence-rebadulla.jpg`, imported by `AboutSection.astro` and run through **`astro:assets`**, so the build emits a resized, compressed WebP rather than shipping the original. To swap it, replace that file and keep the import name. To resize the frame, change the single `width` on `.photo` in that component; the CSS crops to 4:5 with `object-fit: cover`, so any reasonably centred source works.
- **Project screenshots:** none exist, and most of the work is under NDA. A project without an `image` shows the NDA note where a screenshot would sit, which is the intended default. Only set `image` for an original, permission-cleared screenshot: put it in `public/images/projects/` and set the project's `image` to `/images/projects/<file>`.
- **og:image:** still missing, so link previews are text-only. There is a `TODO` marking the spot in `Layout.astro`. This is the highest-value remaining asset, since the audience is recruiters on LinkedIn.

---

## Deployment (Cloudflare Pages)

Connect the repo in the Cloudflare Pages dashboard with:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `pnpm build` (the repo is pnpm-only: `packageManager` is pinned and `pnpm-lock.yaml` is the sole lockfile) |
| Output directory | `dist` |
| Environment variable | `NODE_VERSION=22` (Astro 7 needs ≥ 22.12) |

> **`sharp` is a direct dependency on purpose.** `astro:assets` optimises the portrait at build
> time and needs sharp. Locally it resolved through pnpm's hoisting even when it was only a
> transitive dep of Astro, so builds passed; on a clean `pnpm install --frozen-lockfile` (what
> Cloudflare runs) pnpm's isolated `node_modules` makes a transitive dep unreachable from the
> project root and the build fails with `MissingSharp`. Keep it in `dependencies`. To check a
> deploy will work before pushing, reproduce the clean install:
> `git ls-files -co --exclude-standard | tar -cf - -T - | (cd /tmp/x && tar -xf -) && cd /tmp/x && pnpm install --frozen-lockfile && pnpm build`

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
