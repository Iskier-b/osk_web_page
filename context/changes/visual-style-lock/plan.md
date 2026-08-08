# Visual Style Lock (Direction Proposals) Implementation Plan

## Overview

Produce three audience-based visual direction cards as markdown under `context/changes/visual-style-lock/` so the project user can later choose a style for the OSK redesign. This change is documentation-only: it does **not** record the lock or apply tokens in `src/`. The actual FR-002 lock remains a prerequisite before S-01.

## Current State Analysis

- Roadmap F-02 (`visual-style-lock`) is ready; no proposal artifacts exist yet.
- Product process is locked in `context/page_mvp.md` §5 and PRD FR-002: agent proposes audience-based directions with short pros → user chooses → apply consistently.
- Repo UI is still the 10x Astro starter (shadcn neutral tokens + cosmic purple hard-codes); irrelevant here because this change touches no `src/`.
- F-01 analysis pack documents IA/components, not a brand palette — and planning chose a **clean redesign** (ignore source colors).
- Planning narrowed F-02’s done bar to **proposals only**; choice and consistent application are deferred.

### Key Discoveries:

- Process contract: `context/page_mvp.md` §5 (lines 90–108) + `context/foundation/prd.md` FR-002
- Example audiences already named in page_mvp: young drivers (dynamic/energetic), business (elegant/minimal), broad (friendly/universal)
- Docs-only precedent: `context/changes/site-structure-map/` (change-folder deliverables, EN structure)
- Token application path (later, not this change): `src/styles/global.css` CSS variables + `@theme inline`

## Desired End State

`context/changes/visual-style-lock/` contains `change.md`, `README.md`, a short audience/business brief, and three direction cards that a later chooser can compare without opening the live site. README states explicitly that user lock + consistent apply happen outside this change (before/at S-01).

**Verify:** three distinct cards exist (one per page_mvp audience example), each with mood, palette keywords, type vibe, and short pros; README checklist complete; no `src/` diffs required for success.

## What We're NOT Doing

- Recording the user’s final style choice / writing `locked-direction.md` (deferred; blocks S-01 until done elsewhere)
- Editing `src/styles/global.css`, fonts, layouts, or any OSK pages
- Moodboard images, live `/style` previews, or coded mini-layouts
- Inheriting or documenting the source site’s color palette as a constraint
- Building nav stubs (S-01), content (S-02), or deploy (S-03)
- Accessibility / WCAG as a style criterion (PRD non-target)

## Implementation Approach

Scaffold the change folder and README contracts, write a one-page audience brief grounded in page_mvp’s three examples and the OSK’s local driving-school character, then author three parallel markdown cards with a shared schema so comparison is mechanical. English headings; Polish brand name “Auto Szkoła Juszczak” may appear where useful for context. Stop when proposals are reviewable — do not pause for a lock inside this change.

## Critical Implementation Details

**FR-002 gap is intentional:** This plan’s success criteria stop at proposals (planning decision 5A). Downstream S-01 must not start until a human records which direction is locked and how it will be applied (tokens/components). Call that out in README handoff so the roadmap “locked by user choice” outcome is not mistaken as complete when this change archives.

**Card schema (shared):** Each direction file uses the same sections — Audience, Mood, Palette keywords (no hex required), Typography vibe, Layout/UI cues, Pros (2–4 bullets), Anti-goals (1–2 bullets) — so the chooser compares like-with-like.

---

## Phase 1: Scaffold & audience brief

### Overview

Create the change identity and README index, plus a short business/audience brief that justifies the three page_mvp example directions for this OSK.

### Changes Required:

#### 1. Change identity

**File**: `context/changes/visual-style-lock/change.md`

**Intent**: Ensure identity exists with planning notes; keep status aligned with `/10x-implement` lifecycle (planned until implement starts).

**Contract**: Frontmatter `change_id: visual-style-lock`; Notes list the five planning decisions from 2026-08-09.

#### 2. Pack index

**File**: `context/changes/visual-style-lock/README.md`

**Intent**: Index deliverables, state the done bar (proposals only), and warn that FR-002 lock + apply are prerequisites for S-01.

**Contract**: Sections at minimum: Purpose, Source requirements (page_mvp §5 / FR-002), Documents table, Done checklist, Downstream handoff (S-01 needs recorded choice). No filled direction cards yet.

#### 3. Audience & business brief

**File**: `context/changes/visual-style-lock/audience-brief.md`

**Intent**: Ground the three directions in the client’s activity (local OSK / Auto Szkoła Juszczak) and map page_mvp’s example audiences without inventing new personas.

**Contract**: Short prose (≈½–1 page): business character; the three audiences labeled exactly as in page_mvp (young drivers, business clients, broad/universal); one sentence each on why that audience matters for a candidate-attracting demo. No palette hex; no lock recommendation that preempts user choice.

### Success Criteria:

#### Automated Verification:

- Files exist: `change.md`, `README.md`, `audience-brief.md` under `context/changes/visual-style-lock/`
- README Documents table lists the three planned direction filenames

#### Manual Verification:

- Audience brief uses the three page_mvp example audiences without adding a fourth competing frame
- README clearly states choice/lock is out of this change’s done bar

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Direction cards

### Overview

Write three parallel markdown direction cards for the page_mvp audiences, as a clean redesign (no source-palette continuity).

### Changes Required:

#### 1. Young drivers direction

**File**: `context/changes/visual-style-lock/direction-young-drivers.md`

**Intent**: Propose a dynamic, modern, energetic visual direction aimed at younger course candidates.

**Contract**: Shared card schema (Audience, Mood, Palette keywords, Typography vibe, Layout/UI cues, Pros, Anti-goals). Palette as keywords/mood (e.g. high-contrast accent, energetic neutrals) — not copied from the live Bootstrap site. Pros: 2–4 short bullets.

#### 2. Business clients direction

**File**: `context/changes/visual-style-lock/direction-business.md`

**Intent**: Propose an elegant, minimal, professional visual direction aimed at business / formal clients.

**Contract**: Same shared schema as the young-drivers card; distinct mood and palette keywords so it is not a rewording of another card.

#### 3. Broad / universal direction

**File**: `context/changes/visual-style-lock/direction-broad.md`

**Intent**: Propose a friendly, clear, universal visual direction for a wide local audience.

**Contract**: Same shared schema; emphasize clarity and calm hierarchy over energy or luxury.

### Success Criteria:

#### Automated Verification:

- Three files exist: `direction-young-drivers.md`, `direction-business.md`, `direction-broad.md`
- Each file contains the shared section headings from the card schema

#### Manual Verification:

- Cards are distinguishable at a glance (different mood + palette keywords)
- None require or reference source-site hex/palette continuity
- Pros are concrete enough to choose between, not generic filler

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Handoff

### Overview

Close the README checklist and leave an explicit S-01 gate note so “proposals done” is not confused with “style locked.”

### Changes Required:

#### 1. README completion

**File**: `context/changes/visual-style-lock/README.md`

**Intent**: Mark the proposal checklist complete and list next human step: pick a direction and record the lock before S-01.

**Contract**: Done checklist items checked or listed as satisfied; Downstream section names the three card paths and states that applying the chosen direction (tokens in `global.css`, component chrome) belongs to later slices after the lock is recorded.

#### 2. Change notes stamp

**File**: `context/changes/visual-style-lock/change.md`

**Intent**: Note that proposal artifacts are complete and choice remains open.

**Contract**: Notes (or a short Phase 3 note) state proposals ready; no `locked-direction` artifact claimed.

### Success Criteria:

#### Automated Verification:

- README references all three direction files by path
- `audience-brief.md` + three direction files still present

#### Manual Verification:

- A new reader can open README alone and know: (1) proposals are ready, (2) they must choose, (3) S-01 waits on that choice
- No implication that FR-002 is fully satisfied by this folder alone

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests:

- None — docs-only change; no test runner in repo for markdown

### Integration Tests:

- None

### Manual Testing Steps:

1. Open `README.md` and confirm the Documents table matches files on disk.
2. Skim all three direction cards and confirm you could pick one without asking for more structure.
3. Confirm nothing in the folder claims the style is already locked.

## Performance Considerations

N/A — documentation artifacts only.

## Migration Notes

N/A — no runtime or data migration. When a direction is later locked, S-01+ should prefer semantic tokens in `src/styles/global.css` over hard-coded cosmic purple on starter pages.

## References

- `context/page_mvp.md` §5 (Koncepcja wizualna)
- `context/foundation/prd.md` FR-002
- `context/foundation/roadmap.md` F-02
- Docs-only precedent: `context/changes/site-structure-map/plan.md`
- Future apply surface: `src/styles/global.css`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Scaffold & audience brief

#### Automated

- [x] 1.1 Files exist: `change.md`, `README.md`, `audience-brief.md` under `context/changes/visual-style-lock/`
- [x] 1.2 README Documents table lists the three planned direction filenames

#### Manual

- [ ] 1.3 Audience brief uses the three page_mvp example audiences without adding a fourth competing frame
- [ ] 1.4 README clearly states choice/lock is out of this change’s done bar

### Phase 2: Direction cards

#### Automated

- [ ] 2.1 Three files exist: `direction-young-drivers.md`, `direction-business.md`, `direction-broad.md`
- [ ] 2.2 Each file contains the shared section headings from the card schema

#### Manual

- [ ] 2.3 Cards are distinguishable at a glance (different mood + palette keywords)
- [ ] 2.4 None require or reference source-site hex/palette continuity
- [ ] 2.5 Pros are concrete enough to choose between, not generic filler

### Phase 3: Handoff

#### Automated

- [ ] 3.1 README references all three direction files by path
- [ ] 3.2 `audience-brief.md` + three direction files still present

#### Manual

- [ ] 3.3 A new reader can open README alone and know: (1) proposals are ready, (2) they must choose, (3) S-01 waits on that choice
- [ ] 3.4 No implication that FR-002 is fully satisfied by this folder alone
