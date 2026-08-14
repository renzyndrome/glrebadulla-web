# CLAUDE.md — glrebadulla.dev ("One Accent")

Rules for implementing and maintaining glrebadulla.dev.

**Design source of truth:** `design/mockups/02-monochrome-accent.html`. Its header comment holds
the full rationale (ramp, border language, accent rule, motion budget). Read it before any visual
change. The other files in `design/mockups/` are the rejected directions, kept for reference.

**Archived:** `design/Professional Portfolio Landing Page/` and `docs/PLAN.md` describe the previous
"Terminal Dark Green" design, which was replaced in August 2026 because it read as generic. Treat
both as history, not as instructions.

**Deliberate deviations from the mockup** (the live site is correct, the mockup is not; do not
"restore" these):
- **Fonts.** The mockup names Söhne and Berkeley Mono, which are commercial. The site ships
  Schibsted Grotesk and JetBrains Mono, both free and self-hosted.
- **Three text tiers, not four** (see rule 3) after a contrast audit.
- **About layout.** Prose sits in the spine's content column and the portrait takes the right column
  at 15rem. The mockup put a 120px photo on the spine, which left ~340px of dead space and rendered
  the face too small to be worth showing.
- **The work heading is "Work", not "Selected work".** Every project is listed, so "selected" would
  claim a curation that is not happening. It also matches the nav label.
- **Contact shows the real QR** (`/wa-qr.png`) on a white plate, because a QR needs a light ground
  and a quiet zone to scan. The mockup used a hairline placeholder.
- **Project chips say "LLM integration"** rather than naming the vendor, so the row reads as the
  transferable capability. `OpenAI API` still appears in the Capabilities stack list, where naming
  the actual tool is the point.

## Project conventions

- **Stack:** Astro + TypeScript, fully static output (no adapter, no backend). Deploys to
  **Cloudflare Pages** (build `npm run build`, output `dist`).
- **Scripts:** `npm run dev` / `npm run build` / `npm run preview`; `npm run cms` for the local
  Keystatic admin; type-check with `npx astro check`.
- **Structure:** one `.astro` component per page section in `src/components/` with scoped styles;
  **CV and profile data in `src/data/*.ts`** (never hardcode facts in a component); images that should
  be optimised go in `src/assets/` and through `astro:assets`, not `public/`; tokens in
  `src/styles/tokens.css`; shared primitives in `src/styles/global.css`; long-form styling in
  `src/styles/prose.css`; page chrome in `src/layouts/PageShell.astro`. Keep files small.
- **Fonts:** two families, self-hosted via `@fontsource`. Schibsted Grotesk (400/500) for prose and
  headings, JetBrains Mono (400/500) for data and metadata. `font-display: swap`.
- **Git:** the owner commits and pushes manually. Never run `git commit` or `git push`.
- **Node:** lives under nvm (`~/.nvm/versions/node/v22.17.0/bin`) and is not on the default PATH.
- **Do not touch** `astro.config.mjs`'s `vite.build.cssTarget` pin (it stops the minifier emitting
  Media Queries Level 4 range syntax that older Safari cannot parse) or the `KEYSTATIC`-gated
  integrations (they keep React out of the production build).

## Non-negotiable design rules

1. **Two fonts, split by job.** Grotesk for prose and headings, mono for every date, index, tag,
   label, table figure and button. Never introduce a third family, never mix the roles.
2. **Palette is the ramp in `tokens.css`.** Five surfaces (`--n900`…`--n700`), three text tiers
   (`--t1`/`--t2`/`--t3`), one accent. No new colors. No gradients anywhere.
3. **Three text tiers, not four.** A tier must clear WCAG AA 4.5:1 against the *lightest* surface it
   ever sits on, not against the page base. A fourth, dimmer tier was removed for exactly this
   reason. De-emphasise with size, weight and grid position, never with less contrast.
4. **Borders are layered translucency, not solid lines.** `--hair` / `--hair-2` hairlines, `--lift`
   for the top-edge highlight on raised surfaces, `--depth` for a tight negative-spread shadow.
   Never a glow, never a halo, never a colored shadow.
5. **Accent `#3ecf8e` on under 5% of pixels.** Allowed on exactly five things: `:focus-visible`
   rings, the active nav state, the one data highlight (the `LLM+RAG` stat), the AI/LLM tag marks,
   and the copy-button "Copied" state. NOT on headings, card borders, section numbers, the
   current-role date, or button fills. **There are no filled buttons on this site** — hierarchy comes
   from surface elevation, which is what keeps the accent budget affordable.
6. **Elevation is meaningful.** Only things you can act on get raised (`--n800` + `--lift` +
   `--depth`): the AI panel, the copy buttons, the contact card. The hero index card is deliberately
   flat so the raised treatment keeps its meaning.
7. **Motion budget: three state-change transitions total** — nav underline, project-row hover, copy
   button swap. Enter `ease-out` (200ms), exit `ease-in` (140ms), transform/opacity/color only, all
   interruptible. Nothing animates on load. Gate hover behind
   `(hover: hover) and (pointer: fine)`; reduce everything to opacity under
   `prefers-reduced-motion`. No scroll-reveal, no parallax, no typewriter, no blinking cursor, no
   hover scale, no pulsing dots.
8. **One vertical spine.** `--spine` + `--gutter`. Section numbers, skill labels, project indices,
   post dates, the photo column and the experience Period column all start on it. That repeated grid
   is the page's rhythm. Do not add a section that ignores it.
9. **Radius scale:** 4px chips / 6px buttons / 8px cards. Nothing larger.
10. **No emoji. No stock icons.** Type, hairlines and alignment carry the design. The only inline SVG
    is the copy-button check.
11. **Numbered sections encode a real sequence** (reading order through the page). Do not add
    numbering to content that is not ordered.

## Content rules

- Positioning line is exactly: **Senior Software Engineer | AI Developer**.
- AI/LLM is always the lead differentiator: it gets the only raised panel in Capabilities and the
  only drawn figure (the retrieval path), and the hero copy names LLM integration and RAG.
- Facts must map to `design/cv/` and live in `src/data/*.ts`. Never invent metrics, client names, or
  numbers. `src/data/` is the single source of truth; components read from it.
- **NDA rule:** most of the work is internal tooling built for employers. Descriptions are shareable;
  screenshots, client names and production data are not. The work section carries a note saying so,
  and a project detail page without an `image` shows the NDA note where a screenshot would sit. Only
  set `image` for an original, permission-cleared screenshot.
- Copy tone: confident, direct, specific. No filler, no buzzword salad. Banned:
  "empower / streamline / supercharge / world-class / seamless / cutting-edge / passionate about",
  and the aphoristic "not X, but Y" cadence.
- **No em-dashes in prose.** Use periods, commas, or " · " separators. The only exception is fixed
  date-range strings like `2024 — present` in `src/data/experience.ts`.
- Contact must always expose: email `glrebadulla@gmail.com`, the WhatsApp QR (`public/wa-qr.png`),
  CV download, and github/linkedin/site links.
- **The phone number is never rendered.** WhatsApp is reachable by scanning the QR only: no number
  as text, and no `wa.me` link, because a link puts the number in the `href` and the browser status
  bar. Do not "improve" the QR card by making it clickable.

## Engineering rules

- Static site, no backend. The only client JS is the copy-email listener
  (`src/scripts/copy-email.ts`). Keep it that way; Lighthouse perf ≥ 95.
- Semantic HTML: `<nav>`, `<section id>`, one `<h1>` per page, `<dl>` for key/value data, a real
  `<table>` for the experience data. Wide content scrolls inside its own `.scroller`, never the body.
- A table that must scroll keeps its semantics. Do not reflow it to `display: block` on mobile, which
  strips row and column relationships from the accessibility tree.
- Visible `:focus-visible` rings on every focusable element, tap targets ≥ 44px, alt text on the QR
  and photo, `aria-live` for the copy confirmation.
- Verify visual work in a browser at 1440px and 390px, and check contrast against the *actual*
  backdrop, not the page base.
