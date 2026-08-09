# Representative deep path — Plan Brief

> Full plan: `context/changes/representative-deep-path/plan.md`

## What & Why

Ship one representative deeper journey with real copied content (FR-005 / S-04) so the owner can walk beyond top-level hubs: offer → automatic-license product → contact. Proves the redesign is not hub-only stubs.

## Starting Point

`/kursy` is filled (S-02). `/prawo-jazdy-automat` and `/kontakt` are still title-only stubs. F-01 recommended this path unlocked; Zapisy and other depth-2 pages stay stubs. Forms are deferred to S-05.

## Desired End State

On phone (~375px), the owner can walk `/` → `/kursy` → `/prawo-jazdy-automat` → `/kontakt`, see condensed automat copy and contact prose, and follow the product CTA into the Zapisy stub — without forms or invented facts.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| Path | `/kursy` → `/prawo-jazdy-automat` → `/kontakt` | Locks F-01’s representative offer→product→contact journey |
| Kontakt depth | Prose + address/phones; no form | Completes FR-005 without stealing S-05 form work |
| Product CTA | → `/zapisy-na-kurs` (leave stub) | Enrollment intent without filling Zapisy or forms now |
| Product depth | Condensed hero + key points | Faster than full source dump; still proves depth-2 |
| Verify both ends | Path to Kontakt **and** CTA→Zapisy | Covers FR-005 walk and the enrollment CTA |
| Fence | No other depth-2 fills | Hard “one path” scope |
| Done bar | Phone-first; desktop not required | Capacity cut for S-04; S-02 already covered top-level desktop |

## Scope

**In scope:**
- Harvest notes for automat + kontakt
- Condensed `/prawo-jazdy-automat` + CTA to Zapisy stub
- `/kontakt` prose/contact only
- 375px walkthrough stamp in Notes

**Out of scope:**
- Other depth-2 / legal fills
- Forms, maps, reCAPTCHA (S-05)
- Zapisy body copy
- S-03 deploy; desktop as S-04 gate

## Architecture / Approach

Reuse S-02 Content Collections: new MD entries, extend `PageId`, replace two stub Astro routes with `prerender` + `Hero` / `ProseSection` / `CtaBand`. No new section kit.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Harvest & fill automat | Condensed product page + CTA→Zapisy | Over-condensing until page feels empty vs source |
| 2. Fill Kontakt prose | Real path end without form | Accidentally implying submit / pulling S-05 early |
| 3. Phone walkthrough | FR-005 proof + Notes stamp | Layout regression at 375px on new pages |

**Prerequisites:** S-02 done; live source reachable for harvest  
**Estimated effort:** ~1–2 sessions across 3 phases

## Open Risks & Assumptions

- CTA lands on a Zapisy stub by design — slightly awkward until S-05
- Desktop not in S-04 done bar; owner may still open desktop and judge these pages
- Condensed automat omits some source sections — expandable later if needed

## Success Criteria (Summary)

- Three path hops show real content; Kontakt has no form
- Product CTA reaches Zapisy stub; other depth-2 pages stay stubs
- Phone (~375px) walk + Notes verification stamp complete
