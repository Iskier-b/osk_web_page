# Youth-oriented dynamic layout — Plan Brief

> Full plan: `context/changes/youth-dynamic-layout/plan.md`

## What & Why

Ship FR-010 / S-06: a dynamic, youth-oriented layout/template so the owner can review their authentic content in a presentation aimed at young course candidates. Menu information architecture stays frozen — only layout and presentation change.

## Starting Point

The public site already has Broad tokens, shared chrome, filled top-level/deep-path content, StubPage shells, and demo forms. Motion is almost absent; nav UI is functional but calm; FR-002 Broad lock remains in force.

## Desired End State

Visitors experience a cohesive youth-forward shell (chrome + sections + stubs + forms) with 2–3 purposeful motions, a leaner homepage first viewport, and unchanged nav labels/destinations — ready for owner review on the existing public URL.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| Dynamic depth | 2–3 motion/scroll reveals | Matches young-drivers energy inside MVP without heavy interactivity |
| Style lock | Broad tokens + youth composition | FR-002 stays locked; FR-010 is not a second chooser |
| Page scope | Home + top-level + deep path + chrome | Covers US-01 owner walk |
| Nav rebuild | Enhanced mobile sheet (same IA) | Literal bottom tabs cannot host 7 items + nested children safely |
| Copy | Zero new copywriting | PRD fidelity guardrails |
| Success | Visual checklist + owner review | Market-feedback north star |
| Stubs/forms | Full visual youth polish | Avoid mixed old/new shells; S-05 behavior untouched |
| Time pressure | No scope cuts | Ship the agreed surface completely |

## Scope

**In scope:**
- Motion foundation + `prefers-reduced-motion`
- Chrome presentation rebuild over frozen `site-nav.ts`
- Hero/section composition on filled home, top-level, deep path
- StubPage + form visual polish
- Responsive / IA / public-URL checklist

**Out of scope:**
- IA edits in `site-nav.ts`
- New palette lock / young-drivers token swap
- New copy, invented claims
- New animation libraries / heavy interactivity
- Auth cleanup; enabling real form submit

## Architecture / Approach

Keep Broad CSS variables. Restyle Astro/React presentation components and section kit; add CSS/`tw-animate-css` entrances plus a tiny IntersectionObserver reveal island. Mobile nav becomes a youth full-panel/sheet while still mapping the same nav arrays.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Motion foundation | Utilities + reduced-motion + reveal helper | Motion ships without a11y gate |
| 2. Chrome rebuild | Youth header/nav/footer, same IA | Accidental IA drift or unusable mobile nav |
| 3. Hero + sections | Lean first viewport + filled-page system | Overcrowded hero or invented copy creep |
| 4. Stubs + forms | On-system placeholders and form shells | Touching S-05 submit semantics |
| 5. Bar + owner checklist | 375/desktop + public URL verify | Declaring done before owner can see URL |

**Prerequisites:** S-02 content + S-03 public URL + Broad lock in place; `site-nav.ts` freeze baseline  
**Estimated effort:** ~3–5 sessions across 5 phases

## Open Risks & Assumptions

- Youth energy vs Broad calm can feel inconsistent if composition goes too far without palette support — stick to composition/motion, not neon token swaps.
- Enhanced sheet must still pass FR-007 at 375px with nested Oferta/Strefa children.
- Public URL may need an explicit redeploy before owner review reflects local work.

## Success Criteria (Summary)

- Menu IA unchanged; youth layout on home, top-level, deep path, stubs, and forms
- 2–3 motions with reduced-motion respect; mobile + desktop bar met
- Owner can review the result on the public URL against the checklist
