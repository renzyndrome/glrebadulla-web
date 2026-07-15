// @ts-check
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';

import cloudflare from '@astrojs/cloudflare';

// Keystatic runs ONLY in local authoring mode: `KEYSTATIC=true npm run dev`
// (see `npm run cms`). Production builds leave the flag unset, so the deployed
// site stays 100% static — no adapter, no server routes, no React runtime —
// honoring the "static, no backend" rule. The reader pages render Keystatic's
// content at build time via Astro content collections either way.
const KEYSTATIC = process.env.KEYSTATIC === 'true';

const cms = KEYSTATIC
  ? await (async () => {
      const [{ default: react }, { default: keystatic }, { default: node }] =
        await Promise.all([
          import('@astrojs/react'),
          import('@keystatic/astro'),
          import('@astrojs/node'),
        ]);
      return {
        integrations: [react(), keystatic()],
        adapter: node({ mode: 'standalone' }),
        output: /** @type {const} */ ('server'),
      };
    })()
  : null;

export default defineConfig({
  site: 'https://glrebadulla.dev',

  // markdoc is always on so blog .mdoc content renders in the static build.
  integrations: [markdoc(), ...(cms?.integrations ?? [])],

  ...(cms ? { adapter: cms.adapter, output: cms.output } : {}),

  build: {
    // Inline small stylesheets to cut render-blocking requests (Lighthouse ≥95).
    inlineStylesheets: 'auto',
    // Emit extensionless files (blog/foo.html) so URLs match the extensionless
    // internal links exactly — no trailing-slash redirects on any host.
    format: 'file',
  },

  vite: {
    build: {
      // Keep CSS compatible with browsers lacking Media Queries Level 4 range
      // syntax (Safari < 16.4): emit `(max-width: …)` not `(width <= …)`.
      cssTarget: ['chrome90', 'edge90', 'firefox90', 'safari14'],
    },
  },

  adapter: cloudflare(),
});