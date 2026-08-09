---

## project: "OSK Juszczak redesign"
version: 2
status: draft
created: 2026-08-08
updated: 2026-08-09
prd_version: 2
main_goal: market-feedback
top_blocker: none

# Roadmap: OSK Juszczak redesign

> Derived from `context/foundation/prd.md` (v2) + auto-researched codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.
> Regenerated 2026-08-09 for PRD v2 (FR-010 youth-oriented dynamic layout; menu IA frozen). Previous: `context/foundation/archive/2026-08-09-roadmap.md`.

## Vision recap

The OSK owner's current site looks outdated and does not drive candidate inflow; they lack a concrete modern presentation of their own offer to evaluate. The MVP proves a redesign with authentic content from [https://www.autojuszczak.com.pl/](https://www.autojuszczak.com.pl/) in a clearer information hierarchy — the owner commits only after seeing *their* content, not an abstract mockup. PRD v2 adds a youth-oriented dynamic layout/template (agent-designed) while freezing the existing menu information architecture. Character: demonstracyjny PoC, not production completeness.

## North star

**S-06: visitor experiences a dynamic, youth-oriented layout/template with menu IA unchanged** — chosen so the market-feedback moment (owner recognition on a public URL) validates the new PRD v2 hypothesis, not only the earlier content/structure work.

> Here, **north star** means the smallest end-to-end slice whose successful delivery would prove the core product hypothesis — the main claim the MVP must validate — placed as early as Prerequisites allow because later polish only matters if this works.

## At a glance


| ID   | Change ID                   | Outcome (user can …)                                                                                                    | Prerequisites | PRD refs                      | Status |
| ---- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------- | ------ |
| F-01 | site-structure-map          | (foundation) full source-site analysis pack exists (sitemap, sections, forms, integrations, backend-needed, MVP-in/out) | —             | FR-001                        | done   |
| F-02 | visual-style-lock           | (foundation) visual style locked by user choice from agent-proposed directions                                          | —             | FR-002                        | done   |
| S-01 | nav-structure-stubs         | visitor can browse full nav; missing bodies are title-only / placeholder stubs                                          | F-01, F-02    | US-01, FR-003                 | done   |
| S-02 | top-level-authentic-content | visitor can read source-faithful top-level content in a clearer modern layout on mobile and desktop                     | S-01          | US-01, FR-004, FR-007, FR-008 | done   |
| S-03 | public-review-url           | owner can open the modernized site at a public free-hosting URL                                                         | S-02          | US-01, FR-009                 | done   |
| S-04 | representative-deep-path    | visitor can follow one representative deeper path with real copied content                                              | S-02          | US-01, FR-005                 | done   |
| S-05 | inert-forms-ui              | visitor can see forms as ready UI with submit clearly disabled (no data sent; demo-only)                                | S-02          | US-01, FR-006                 | done   |
| S-06 | youth-dynamic-layout        | visitor experiences a dynamic, youth-oriented layout/template; menu IA (labels, hierarchy, destinations) unchanged      | S-02, F-02    | US-01, FR-010                 | ready  |


## Streams

Navigation aid — groups items that share a Prerequisites chain. Canonical ordering still lives in the dependency graph below; this table is the proposed reading order across parallel tracks.


| Stream | Theme                     | Chain                             | Note                                                   |
| ------ | ------------------------- | --------------------------------- | ------------------------------------------------------ |
| A      | Structure & public review | `F-01` → `S-01` → `S-02` → `S-03` | Primary early path; `F-02` joins at `S-01`             |
| B      | Style gate                | `F-02`                            | Parallel with `F-01`; joins Stream A at `S-01`         |
| C      | Deep journey              | `S-04`                            | After top-level content; parallel with `S-05` / `S-06` |
| D      | Inert forms               | `S-05`                            | Parallel with `S-04` and north-star `S-06`             |
| E      | Youth layout              | `S-06`                            | North star under market-feedback; menu IA frozen       |


## Baseline

What's already in place in the codebase as of `2026-08-09` (auto-researched + user-confirmed).
Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** present — Astro 6 + React 19 islands + Tailwind 4 + shadcn; file-based routes under `src/pages/`
- **Backend / API:** partial — SSR present; API routes only starter auth (`signin`/`signup`/`signout`) — unused for the public product site
- **Data:** partial — Supabase client wired; no product migrations/seeds for OSK content (static pages carry copy)
- **Auth:** present — Supabase cookie SSR + middleware for `/dashboard` — **explicitly out of scope** for this MVP
- **Deploy / infra:** present (CI partial) — Cloudflare Workers via wrangler + adapter; CI lint/build only (no deploy job in workflow); public review URL already shipped via S-03
- **Observability:** absent — no app-level logging/error tracking; acceptable (no MVP NFR)

## Foundations

### F-01: Site analysis pack

- **Outcome:** (foundation) reusable analysis pack of the source client site exists — sitemap/menus, key sections and repeated components, forms/interactive features, external integrations, backend-or-server-needed features, and explicit MVP-in vs MVP-out — and can drive navigation parity plus scoped build decisions.
- **Change ID:** site-structure-map
- **PRD refs:** FR-001
- **Unlocks:** S-01, S-02, S-04, S-05; reduces unknown “what is the full nav tree?” and “what is demo-only vs out of scope?”
- **Prerequisites:** —
- **Parallel with:** F-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sequenced first (with F-02) because building content without a complete analysis recreates the overload problem the Vision rejects; incomplete mapping would force rework of stubs, deep-path choice, and inert-forms scope.
- **Status:** done

### F-02: Visual style lock

- **Outcome:** (foundation) visual style is locked before MVP page build starts — agent proposes audience-based directions with short pros; user chooses one; direction applied consistently.
- **Change ID:** visual-style-lock
- **PRD refs:** FR-002
- **Unlocks:** S-01, S-02, S-04, S-05, S-06; verification path for layout consistency (FR-008) and youth-layout pass (FR-010) against a locked direction
- **Prerequisites:** —
- **Parallel with:** F-01
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Part of the original gate; FR-010 builds on this lock rather than reopening it — S-06 is a layout/template pass with menu IA frozen, not a second style-chooser.
- **Status:** done

## Slices

### S-01: Navigation structure with title-only stubs

- **Outcome:** visitor can browse the full navigation structure; where body content is not copied yet, subsections show title-only / placeholder pages (no empty dead-end links; no invented body copy).
- **Change ID:** nav-structure-stubs
- **PRD refs:** US-01, FR-003
- **Prerequisites:** F-01, F-02
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** First user-visible chrome after the gate; keeps the site-map complete without inventing deep copy. Menu IA from this slice is the freeze baseline for S-06.
- **Status:** done

### S-02: Top-level authentic content

- **Outcome:** visitor can read source-faithful top-hierarchy content the owner will recognize, with light clarity/hierarchy edits only and no invented facts (no new copywriting), in a readable mobile-first and consistent desktop layout.
- **Change ID:** top-level-authentic-content
- **PRD refs:** US-01, FR-004, FR-007, FR-008
- **Prerequisites:** S-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Content half of owner recognition (market-feedback). Mobile (375px, no horizontal scroll, usable primary nav) and desktop consistency land here so later layout redesign (S-06) restyles real content, not stubs alone.
- **Status:** done

### S-03: Public review URL

- **Outcome:** owner can review the modernized site at a public URL on free static hosting (not only local preview).
- **Change ID:** public-review-url
- **PRD refs:** US-01, FR-009
- **Prerequisites:** S-02
- **Parallel with:** S-04, S-05, S-06
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Placed immediately after top-level content so market-feedback does not wait on deep path or forms. After S-06, re-verify the same public URL still reflects the youth layout (no new hosting slice).
- **Status:** done

### S-04: Representative deep path

- **Outcome:** visitor can follow one developer-chosen deeper path with real copied content — a representative owner/candidate journey (e.g. offer → contact), not the easiest stub.
- **Change ID:** representative-deep-path
- **PRD refs:** US-01, FR-005
- **Prerequisites:** S-02
- **Parallel with:** S-03, S-05, S-06
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sequenced after top-level so the early validation path is not delayed by deep copy; must still receive the S-06 layout treatment where that path is in scope.
- **Status:** done

### S-05: Inert forms UI

- **Outcome:** visitor can see forms as ready UI elements that perform no send/submit and clearly communicate that submission is disabled in this version (demo-only; must not imply production-working).
- **Change ID:** inert-forms-ui
- **PRD refs:** US-01, FR-006
- **Prerequisites:** S-02
- **Parallel with:** S-03, S-04, S-06
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Trust-preserving forms without integrations (Non-Goals). Parallel with north-star S-06 under top_blocker `none` so layout feedback and form honesty can advance together.
- **Status:** done

### S-06: Youth-oriented dynamic layout

- **Outcome:** visitor experiences a dynamic, youth-oriented page layout/template designed and implemented by the agent; menu information architecture (labels, hierarchy, destinations) stays unchanged — only layout and presentation adapt.
- **Change ID:** youth-dynamic-layout
- **PRD refs:** US-01, FR-010
- **Prerequisites:** S-02, F-02
- **Parallel with:** S-03, S-04, S-05
- **Blockers:** —
- **Unknowns:**
  - How “dynamic” should the youth layout be within MVP constraints (motion/scroll presence vs heavy client interactivity)? — Owner: user. Block: no. (Decide at `/10x-plan`; does not reopen Non-Goals.)
- **Risk:** North star under market-feedback — proves the PRD v2 claim without reshuffling nav. Sequencing after S-02 ensures authentic content is what gets restyled; freezing menu IA prevents IA churn that would invalidate owner recognition of “their” site structure.
- **Status:** ready

## Backlog Handoff


| Roadmap ID | Change ID                   | Suggested issue title                            | Ready for `/10x-plan` | Notes                                             |
| ---------- | --------------------------- | ------------------------------------------------ | --------------------- | ------------------------------------------------- |
| F-01       | site-structure-map          | Map source OSK site into full analysis pack      | no                    | Archived / done                                   |
| F-02       | visual-style-lock           | Propose visual directions; user locks one        | no                    | Archived / done                                   |
| S-01       | nav-structure-stubs         | Full nav with title-only / placeholder stubs     | no                    | Archived / done                                   |
| S-02       | top-level-authentic-content | Top-level authentic content + mobile/desktop bar | no                    | Archived / done                                   |
| S-03       | public-review-url           | Publish public free-hosting review URL           | no                    | Archived / done                                   |
| S-04       | representative-deep-path    | One representative deep path with real copy      | no                    | Archived / done                                   |
| S-05       | inert-forms-ui              | Forms visible with submit disabled (demo-only)   | no                    | Archived / done                                   |
| S-06       | youth-dynamic-layout        | Youth-oriented dynamic layout; menu IA frozen    | yes                   | North star — run `/10x-plan youth-dynamic-layout` |


## Open Roadmap Questions

1. **How “dynamic” should the youth layout be within MVP constraints?** (e.g. motion/scroll presence and hierarchy vs heavy client interactivity) — Owner: user. Block: S-06 (planning can proceed; scope decided in `/10x-plan`).
2. **Should the unused starter auth/Supabase paths be removed or ignored while building the public static prototype?** — Owner: user. Block: roadmap-wide (capacity only; does not block planning S-05/S-06). Slimming may free after-hours capacity; ignoring avoids a refactor detour.

## Parked

- **External integrations (payments, CRM, live student-zone backends, etc.)** — Why parked: PRD §Non-Goals; keeps MVP static and easy to demo.
- **CMS / owner content-edit panel** — Why parked: PRD §Non-Goals; MVP is a fixed proposal site, not a management product.
- **SEO optimization as an MVP success goal** — Why parked: PRD §Non-Goals; ranking decline is pain context, not this version’s target.
- **Auth / accounts / role separation** — Why parked: PRD §Access Control N/A; user-confirmed public prototype only.
- **Observability stack (error tracking, metrics)** — Why parked: no MVP NFR; keep infra light.
- **Reopening FR-002 style-chooser** — Why parked: FR-002 already done; FR-010 is an explicit post-build layout/template pass with menu IA frozen, not a second direction vote.

## Done

- **F-01: (foundation) reusable analysis pack of the source client site exists — sitemap/menus, key sections and repeated components, forms/interactive features, external integrations, backend-or-server-needed features, and explicit MVP-in vs MVP-out — and can drive navigation parity plus scoped build decisions.** — Archived 2026-08-08 → `context/archive/2026-08-09-site-structure-map/`. Lesson: —.
- **F-02: (foundation) visual style is locked before MVP page build starts — agent proposes audience-based directions with short pros; user chooses one; direction applied consistently.** — Archived 2026-08-08 → `context/archive/2026-08-09-visual-style-lock/`. Lesson: —.
- **S-01: visitor can browse the full navigation structure; where body content is not copied yet, subsections show title-only / placeholder stubs (no empty dead-end links; no invented body copy).** — Archived 2026-08-09 → `context/archive/2026-08-09-nav-structure-stubs/`. Lesson: —.
- **S-02: visitor can read source-faithful top-hierarchy content the owner will recognize, with light clarity/hierarchy edits only and no invented facts (no new copywriting), in a readable mobile-first and consistent desktop layout.** — Archived 2026-08-09 → `context/archive/2026-08-09-top-level-authentic-content/`. Lesson: —.
- **S-03: owner can review the modernized site at a public URL on free static hosting (not only local preview).** — Archived 2026-08-09 → `context/archive/2026-08-09-public-review-url/`. Lesson: —.
- **S-04: visitor can follow one developer-chosen deeper path with real copied content — a representative owner/candidate journey (e.g. offer → contact), not the easiest stub.** — Archived 2026-08-09 → `context/archive/2026-08-09-representative-deep-path/`. Lesson: —.
- **S-05: visitor can see forms as ready UI elements that perform no send/submit and clearly communicate that submission is disabled in this version (demo-only; must not imply production-working).** — Archived 2026-08-09 → `context/archive/2026-08-09-inert-forms-ui/`. Lesson: —.

