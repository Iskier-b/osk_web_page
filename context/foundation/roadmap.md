---
project: "OSK Juszczak redesign"
version: 1
status: draft
created: 2026-08-08
updated: 2026-08-08
prd_version: 1
main_goal: market-feedback
top_blocker: capacity
---

# Roadmap: OSK Juszczak redesign

> Derived from `context/foundation/prd.md` (v1) + auto-researched codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.

## Vision recap

The OSK owner's current site looks outdated and does not drive candidate inflow; they lack a concrete modern presentation of their own offer to evaluate. The MVP proves a redesign with authentic content from https://www.autojuszczak.com.pl/ in a clearer information hierarchy — the owner commits only after seeing *their* content, not an abstract mockup.

## North star

**F-01 + F-02: structure map documented and visual style locked** — chosen so authentic top-level content is never built against an unlocked hierarchy or style; this is the gate before the market-feedback moment (owner recognition on a public URL).

> Here, **north star** means the smallest end-to-end milestone whose successful delivery unlocks proving the core product hypothesis — placed as early as Prerequisites allow because later content and publish work only matter once structure and style are locked.

## At a glance

| ID | Change ID | Outcome (user can …) | Prerequisites | PRD refs | Status |
|---|---|---|---|---|---|
| F-01 | site-structure-map | (foundation) reusable source-site structure documentation exists | — | FR-001 | ready |
| F-02 | visual-style-lock | (foundation) visual style locked after owner/PO conversation | — | FR-002 | ready |
| S-01 | nav-structure-stubs | visitor can browse full nav; missing bodies are title-only stubs | F-01, F-02 | US-01, FR-003 | proposed |
| S-02 | top-level-authentic-content | visitor can read source-faithful top-level content in a clearer modern layout on mobile and desktop | S-01 | US-01, FR-004, FR-007, FR-008 | proposed |
| S-03 | public-review-url | owner can open the modernized site at a public free-hosting URL | S-02 | US-01, FR-009 | proposed |
| S-04 | representative-deep-path | visitor can follow one representative deeper path with real copied content | S-02 | US-01, FR-005 | proposed |
| S-05 | inert-forms-ui | visitor can see forms as ready UI with submit clearly disabled (no data sent) | S-02 | US-01, FR-006 | proposed |

## Streams

Navigation aid — groups items that share a Prerequisites chain. Canonical ordering still lives in the dependency graph below; this table is the proposed reading order across parallel tracks.

| Stream | Theme | Chain | Note |
|---|---|---|---|
| A | Structure & public review | `F-01` → `S-01` → `S-02` → `S-03` | Primary market-feedback path; `F-02` joins at `S-01` |
| B | Style gate | `F-02` | Parallel with `F-01`; joins Stream A at `S-01` |
| C | Deep journey | `S-04` | After top-level content; parallel with `S-05` |
| D | Inert forms | `S-05` | Parallel with `S-04` under capacity bias |

## Baseline

What's already in place in the codebase as of `2026-08-08` (auto-researched + user-confirmed).
Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** present — Astro + React + TypeScript (per `tech-stack.md`); product intent is a public static-content presentation site
- **Backend / API:** present in starter (SSR auth API routes) — **unused for this MVP** (no product API)
- **Data:** partial — Supabase client wired for auth only; **not needed** for static MVP content (no migrations/seeds required)
- **Auth:** present in starter (Supabase cookie SSR, protected `/dashboard`) — **explicitly out of scope**; public site, no login
- **Deploy / infra:** present — Cloudflare Pages + GitHub Actions (per `tech-stack.md`); covers free public-URL hosting
- **Observability:** absent — acceptable for a client-demo prototype; no MVP NFR requires it

## Foundations

### F-01: Site structure map

- **Outcome:** (foundation) reusable structure documentation of the source client site exists and can drive navigation parity on the new site.
- **Change ID:** site-structure-map
- **PRD refs:** FR-001
- **Unlocks:** S-01, S-02, S-04; reduces unknown “what is the full nav tree?”
- **Prerequisites:** —
- **Parallel with:** F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sequenced first (with F-02) because building content without a complete map recreates the overload problem the Vision rejects; incomplete mapping would force rework of stubs and deep-path choice.
- **Status:** ready

### F-02: Visual style lock

- **Outcome:** (foundation) visual style is chosen and locked after a conversation with the site owner or project PO — before MVP page build starts.
- **Change ID:** visual-style-lock
- **PRD refs:** FR-002
- **Unlocks:** S-01, S-02, S-04, S-05; verification path for layout consistency (FR-008)
- **Prerequisites:** —
- **Parallel with:** F-01
- **Blockers:** —
- **Unknowns:**
  - Which style direction wins after the owner/PO conversation? — Owner: user. Block: no. (FR-002 allows PO proxy; lock can proceed once that talk happens.)
- **Risk:** Part of the north-star gate; unlocking style before content avoids polishing the wrong look. Delay here blocks every visual slice — schedule the conversation early under capacity pressure.
- **Status:** ready

## Slices

### S-01: Navigation structure with title-only stubs

- **Outcome:** visitor can browse the full navigation structure; where body content is not copied yet, subsections show title-only pages (no empty dead-end links).
- **Change ID:** nav-structure-stubs
- **PRD refs:** US-01, FR-003
- **Prerequisites:** F-01, F-02
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** First user-visible chrome after the gate; keeps the site-map complete without inventing deep copy. Doing stubs after top-level content would risk nav drift.
- **Status:** proposed

### S-02: Top-level authentic content

- **Outcome:** visitor can read source-faithful top-hierarchy content the owner will recognize, with light clarity/hierarchy edits only, in a readable mobile-first and consistent desktop layout.
- **Change ID:** top-level-authentic-content
- **PRD refs:** US-01, FR-004, FR-007, FR-008
- **Prerequisites:** S-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** This is the content half of owner recognition (market-feedback). Mobile (375px, no horizontal scroll, usable primary nav) and desktop consistency land here on top-level pages so S-03 has something real to publish.
- **Status:** proposed

### S-03: Public review URL

- **Outcome:** owner can review the modernized site at a public URL on free static hosting (not only local preview).
- **Change ID:** public-review-url
- **PRD refs:** US-01, FR-009
- **Prerequisites:** S-02
- **Parallel with:** S-04, S-05
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Placed immediately after top-level content so market-feedback does not wait on deep path or forms. Deploy scaffolding already exists; this slice is publish-and-verify, not re-platforming.
- **Status:** proposed

### S-04: Representative deep path

- **Outcome:** visitor can follow one developer-chosen deeper path with real copied content — a representative owner/candidate journey (e.g. offer → contact), not the easiest stub.
- **Change ID:** representative-deep-path
- **PRD refs:** US-01, FR-005
- **Prerequisites:** S-02
- **Parallel with:** S-03, S-05
- **Blockers:** —
- **Unknowns:**
  - Which single deeper path is the representative journey? — Owner: user. Block: no. (PRD allows developer choice; decide at plan time.)
- **Risk:** Sequenced after top-level so the validation milestone is not delayed by deep copy; still must-have before calling US-01 fully done.
- **Status:** proposed

### S-05: Inert forms UI

- **Outcome:** visitor can see forms as ready UI elements that perform no send/submit and clearly communicate that submission is disabled in this version.
- **Change ID:** inert-forms-ui
- **PRD refs:** US-01, FR-006
- **Prerequisites:** S-02
- **Parallel with:** S-03, S-04
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Trust-preserving forms without integrations (Non-Goals). Parallel with deep path under capacity so publish feedback is not blocked by form polish.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID | Suggested issue title | Ready for `/10x-plan` | Notes |
|---|---|---|---|---|
| F-01 | site-structure-map | Map source OSK site into reusable structure docs | yes | North-star gate (with F-02); run `/10x-plan site-structure-map` |
| F-02 | visual-style-lock | Lock visual style after owner/PO conversation | yes | Parallel with F-01 |
| S-01 | nav-structure-stubs | Full nav with title-only stubs | no | Needs F-01 + F-02 |
| S-02 | top-level-authentic-content | Top-level authentic content + mobile/desktop bar | no | Needs S-01 |
| S-03 | public-review-url | Publish public free-hosting review URL | no | Needs S-02 |
| S-04 | representative-deep-path | One representative deep path with real copy | no | Needs S-02; parallel with S-03/S-05 |
| S-05 | inert-forms-ui | Forms visible with submit disabled | no | Needs S-02; parallel with S-03/S-04 |

## Open Roadmap Questions

1. **Should the unused starter auth/Supabase paths be removed or ignored while building the public static prototype?** — Owner: user. Block: roadmap-wide (capacity only; does not block planning F-01/F-02). Slimming may free after-hours capacity; ignoring avoids a refactor detour.
2. **Which deeper path is the representative journey for FR-005?** — Owner: user. Block: S-04. Not required to start F-01/F-02/S-01/S-02.

## Parked

- **External integrations (payments, CRM, live student-zone backends, etc.)** — Why parked: PRD §Non-Goals; keeps MVP static and easy to demo.
- **CMS / owner content-edit panel** — Why parked: PRD §Non-Goals; MVP is a fixed proposal site, not a management product.
- **SEO optimization as an MVP success goal** — Why parked: PRD §Non-Goals; ranking decline is pain context, not this version’s target.
- **Auth / accounts / role separation** — Why parked: PRD §Access Control N/A; user-confirmed public prototype only.
- **Observability stack (error tracking, metrics)** — Why parked: no MVP NFR; capacity bias keeps infra light.

## Done

(Empty on first generation. `/10x-archive` appends entries here when matching Change IDs are archived.)
