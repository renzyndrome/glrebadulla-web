---
name: cms-architecture
description: How projects/blog content and the Keystatic CMS are wired (local mode, static prod)
metadata:
  type: project
---

Projects and blog are **Astro content collections** read at build time; the deployed
site stays 100% static. See also [[build-environment]].

- **Content:** `src/content/projects/*.yaml` (data) + `src/content/blog/*.mdoc` (Markdoc
  frontmatter + body). Astro reads them via `src/content.config.ts` (glob loaders + zod).
  `ProjectsSection.astro` reads the `projects` collection; `/blog` + `/blog/[slug]` pages
  read `posts`.
- **Keystatic** (`keystatic.config.ts`) is **local storage mode**. Admin UI runs ONLY in
  `npm run cms` (= `KEYSTATIC=true astro dev`) at `/keystatic`. `astro.config.mjs` gates
  the keystatic/react/node-adapter integrations behind `process.env.KEYSTATIC === 'true'`,
  so `npm run build` (flag unset) is pure static — no adapter, no server routes.
- **Gotchas:** import `z` from `zod` (direct dep), NOT `astro:content`/`astro:schema`
  (deprecated). `build.format: 'file'` → clean extensionless `/blog/<slug>` URLs on
  Cloudflare Pages (verified with `wrangler pages dev`). YAML/frontmatter values with a
  colon must be quoted.
- **Upgrade path:** hosted admin = switch Keystatic storage to `github` mode + add
  `@astrojs/cloudflare` adapter + a GitHub App (needs owner credentials).
