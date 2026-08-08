# Visual style lock — proposal pack

## Purpose

FR-002 / page_mvp §5 proposal pack for Auto Szkoła Juszczak. Grounds three audience-based visual directions so a human can compare them and later lock one before the MVP build.

This change’s **done bar is proposals only**: three direction cards (plus this index and the audience brief). **Choice / lock of a direction is out of this change’s done bar.** FR-002 lock and consistent apply remain prerequisites for S-01 — completing this folder does not satisfy FR-002 alone.

This change is documentation only — no Astro routes, tokens, or `src/` UI.

## Source requirements (page_mvp §5 / FR-002)

| Field | Value |
| ----- | ----- |
| Brief | `context/page_mvp.md` §5 — Koncepcja wizualna |
| PRD | FR-002 — user locks style by choosing from agent-proposed audience-based directions; chosen direction applied consistently |
| Roadmap | F-02 |
| Live site (context only) | https://www.autojuszczak.com.pl/ |
| Identity | `change.md` (`change_id: visual-style-lock`) |

Agent steps from page_mvp before implementation: analyze business character → name audiences → propose directions with short pros → ask user to choose. This pack covers the first three; the ask/lock step is deferred outside this change.

## Documents

| File | Role | Status |
| ---- | ---- | ------ |
| `change.md` | Change identity + planning notes (2026-08-09) | Present |
| `README.md` | Pack index, done bar, S-01 handoff | Present (this file) |
| `audience-brief.md` | Business character + three page_mvp audiences | Present |
| `direction-young-drivers.md` | Direction card — young drivers | Planned (Phase 2) |
| `direction-business.md` | Direction card — business clients | Planned (Phase 2) |
| `direction-broad.md` | Direction card — broad / universal | Planned (Phase 2) |
| `plan.md` / `plan-brief.md` | Implementation plan (not pack deliverables) | Planning artifacts |

Pack deliverables (when complete): `README.md`, `audience-brief.md`, and the three direction cards. No filled direction cards yet.

## Done checklist

Proposal scope for this change (check in Phase 3 handoff — not yet):

- [ ] Audience / business brief present (`audience-brief.md`)
- [ ] Three direction cards present with shared schema
- [ ] Each card has short pros suitable for comparison
- [ ] README documents that lock + apply are outside this change

**Explicitly out of done bar:** recording the user’s chosen direction, writing a lock artifact, applying tokens/components in `src/`.

## Downstream handoff

| Slice / gate | Needs | Note |
| ------------ | ----- | ---- |
| **S-01** (nav / stubs) | Recorded style choice + plan to apply it consistently | Do not start S-01 until a human locks one of the three directions (or an explicit equivalent) and FR-002 apply is planned |
| Later UI slices | Locked direction cues (mood, palette keywords, type, layout) | Apply via design tokens / chrome after lock — not in this change |

Until a direction is locked elsewhere, treat FR-002 as incomplete even if all proposal files exist.
