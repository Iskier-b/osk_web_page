# Visual Style Lock — Plan Brief

> Full plan: `context/changes/visual-style-lock/plan.md`

## What & Why

Produce three audience-based visual direction cards (markdown) so the project user can later lock a look for the OSK redesign. FR-002 / page_mvp §5 require proposals with short pros before MVP page build; this change delivers the proposals only.

## Starting Point

No style artifacts yet. Repo is still the Astro starter (cosmic/shadcn). F-01 analysis pack covers IA, not brand palette. Planning chose docs-only, markdown cards, page_mvp’s three example audiences, and a clean redesign (ignore source colors).

## Desired End State

Change folder holds `README.md`, `audience-brief.md`, and three direction cards. A chooser can compare them and pick later. Style is **not** locked in this change; S-01 waits on an explicit choice + apply.

## Key Decisions Made

| Decision | Choice | Why |
| -------- | ------ | --- |
| Deliverable depth | Doc proposals only (no `src/`) | Matches narrowed done bar; keeps F-02 parallel with F-01 |
| Proposal format | Markdown cards | Fastest FR-002-compatible format |
| Audiences | page_mvp trio (young / business / broad) | Zero new persona inventing |
| Source brand | Clean redesign | Escapes outdated Bootstrap feel |
| Done bar | Proposals exist; choice deferred | Explicit planning pick; lock is S-01 gate |

## Scope

**In scope:** Change scaffold; audience brief; three parallel direction cards; README handoff stating lock is deferred.

**Out of scope:** Recording the lock; CSS tokens/fonts; moodboards/previews; OSK pages; source-palette continuity; WCAG as a style bar.

## Architecture / Approach

Docs-only under `context/changes/visual-style-lock/`. Shared card schema → three files → README marks proposals ready and points S-01 at the missing lock step.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Scaffold & audience brief | README + audience-brief.md | Brief invents a fourth audience frame |
| 2. Direction cards | Three comparable markdown cards | Cards too similar to choose |
| 3. Handoff | Checklist + S-01 gate note | Readers think FR-002 is fully done |

**Prerequisites:** None beyond product docs (`page_mvp` §5, FR-002).  
**Estimated effort:** ~1 short session across 3 doc phases.

## Open Risks & Assumptions

- Roadmap F-02 outcome wording says “locked by user choice”; this change intentionally stops earlier — full FR-002 needs a follow-up lock before S-01.
- Without visuals, choice quality depends on clear card differentiation.

## Success Criteria (Summary)

- Three distinct page_mvp-audience direction cards exist with shared schema and short pros.
- README states proposals are ready and that lock/apply remain before S-01.
- No `src/` changes required for this change to succeed.
