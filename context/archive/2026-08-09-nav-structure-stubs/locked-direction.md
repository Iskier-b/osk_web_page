---
direction: broad
source: context/archive/2026-08-09-visual-style-lock/direction-broad.md
locked: 2026-08-09
apply_targets:
  - src/styles/global.css
  - public chrome
---

# Locked direction: Broad / universal

## Choice

FR-002 is locked to **Broad / universal** (`direction: broad`).

## Source

Proposal card: [`context/archive/2026-08-09-visual-style-lock/direction-broad.md`](../../archive/2026-08-09-visual-style-lock/direction-broad.md)

Locked date: `2026-08-09`

## Apply targets

| Target | Role |
| --- | --- |
| `src/styles/global.css` | Semantic design tokens (palette) + approachable sans for brand/UI |
| Public chrome | Header / footer / nav inherit Broad daylight look from tokens (Phase 2+) |

## Apply note for implementers

Use daylight white / soft cool gray bases, warm charcoal text, and a gentle sky-blue or soft teal accent for links and CTAs. Prefer an open or rounded sans; keep hierarchy calm and approachable. Do not reintroduce cosmic/purple-indigo gradients as the default public background. This file is the sole lock artifact — do not add a second competing lock elsewhere.
