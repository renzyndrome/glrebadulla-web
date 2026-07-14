# Skill: Design tokens & layout

Quick reference for styling any component on glrebadulla.com. Full section-by-section spec: `README.md`.

## Tokens (suggested CSS custom properties)
```css
:root {
  --bg: #050807;            /* page background */
  --bg-panel: #0a0f0b;      /* cards, chrome bar, contact band */
  --text: #dbe5df;          /* headings, primary text */
  --text-secondary: #8a988f;/* body copy */
  --text-muted: #6b7a71;    /* labels, captions, # comments */
  --text-faint: #4a5750;    /* footer */
  --accent: #28c05a;        /* terminal green */
  --accent-soft: #7fe6a3;   /* text on green chips */
  --accent-border: rgba(40,192,90,.38);
  --accent-tint: rgba(40,192,90,.12);
  --hairline: rgba(255,255,255,.07);
  --font: 'JetBrains Mono', monospace; /* the ONLY family; 400/500/600 */
}
```

## Type scale
44/1.25 h1 (-0.03em) · 26–32 h2 (-0.02em) · 28 stat · 14–16 card title · 13–14.5/1.7–1.8 body · 11.5–13 labels.

## Layout
- Container: max-width 1240px centered, 48px side padding; sections 60–72px vertical
- Grids: stats 4-col hairline-divided; skills 2-col (featured card spans full width); projects 2×2, 20px gap; about `260px 1fr`; experience rows `190px 1fr`; contact `1fr 220px`
- Radii: 6 buttons / 8 cards / 10 project cards / 12 QR card
- Borders only, never shadows

## Accent discipline
Green appears ONLY as: `$` prompts, links, primary buttons, one stat (`LLM+RAG`), featured-card border/chips, current-role date, hero word + cursor, particle highlight. Anything else stays neutral.

## Hover states (150ms ease)
Links → brighten to `--text`. Primary buttons → `filter: brightness(1.1)`. Secondary buttons → border `rgba(255,255,255,.4)`. Project cards → border `--accent-border`.
