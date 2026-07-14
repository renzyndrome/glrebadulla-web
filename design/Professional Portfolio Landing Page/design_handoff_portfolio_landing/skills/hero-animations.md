# Skill: Hero animations

Two animations live in the hero. Source: `reference/hero-fx.js`. Port to the target framework; do not add any other motion to the page.

## 1. Particle network (`FxParticles`)
Canvas layer behind the hero copy, under a radial-gradient overlay.

- Fills hero (560px tall), `pointer-events: none`, DPR-aware (cap at 2)
- Count: `min(130, floor(w*h/11000))`; radius 0.6–2.2px; drift ±0.35px/frame; wraps at edges (±20px margin)
- Connect particles < **140px** apart: 1px lines `rgba(255,255,255,0.14)`, alpha × (1 − d/140) × 0.9
- Mouse (listener on the hero section, not the canvas) repels within **190px**: force `(1 − d/190) × 0.9` along the away-vector; particles inside that radius render in accent `#28c05a` and +0.8px larger; others `rgba(255,255,255,0.55)`
- Pause the rAF loop when the hero is off-screen (IntersectionObserver) and re-seed particles on resize (ResizeObserver)
- `prefers-reduced-motion: reduce` → draw one static frame, no loop

## 2. Rotating typed word (`FxTypeWord`)
The green word in "Then I make it {word}."

- Word list, in order: `intelligent`, `scalable`, `secure`, `reliable`
- Type 65–110ms per char (randomized) → hold **2100ms** → erase 38ms per char → **380ms** pause → next word, loop forever
- Word color: `#28c05a`. The period and the 22×44px blinking block cursor (1.1s `steps(1)` blink) sit after the word and stay static
- Layout: word is inline within the h1; line width changes while typing — this is intended, do not reserve fixed width
- `prefers-reduced-motion: reduce` → static "intelligent", no cycling
- Editing the word list: keep 3–5 one-word, lowercase, technical adjectives. No marketing compounds ("business-aligned"), no phrases.
