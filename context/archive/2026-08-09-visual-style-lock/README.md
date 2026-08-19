# Visual style lock — proposal pack

## Purpose

FR-002 / page_mvp §5 proposal pack for Auto Szkoła Juszczak. Grounds three audience-based visual directions so a human can compare them and later lock one before the MVP build.

**Proposals are ready.** This change’s **done bar is proposals only**: three direction cards (plus this index and the audience brief). **You must still choose one direction** and record that lock elsewhere before S-01. **Choice / lock of a direction is out of this change’s done bar.** Completing this folder does **not** satisfy FR-002 alone — FR-002 also requires a recorded user choice and consistent apply (tokens / chrome), which remain open.

This change is documentation only — no Astro routes, tokens, or `src/` UI.

## Source requirements (page_mvp §5 / FR-002)

| Field                    | Value                                                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Brief                    | `context/page_mvp.md` §5 — Koncepcja wizualna                                                                              |
| PRD                      | FR-002 — user locks style by choosing from agent-proposed audience-based directions; chosen direction applied consistently |
| Roadmap                  | F-02                                                                                                                       |
| Live site (context only) | https://www.autojuszczak.com.pl/                                                                                           |
| Identity                 | `change.md` (`change_id: visual-style-lock`)                                                                               |

Agent steps from page_mvp before implementation: analyze business character → name audiences → propose directions with short pros → ask user to choose. This pack covers the first three; the ask/lock step is deferred outside this change.

## Documents

| File                           | Role                                          | Status              |
| ------------------------------ | --------------------------------------------- | ------------------- |
| `change.md`                    | Change identity + planning notes (2026-08-09) | Present             |
| `README.md`                    | Pack index, done bar, S-01 handoff            | Present (this file) |
| `audience-brief.md`            | Business character + three page_mvp audiences | Present             |
| `./direction-young-drivers.md` | Direction card — young drivers                | Present             |
| `./direction-business.md`      | Direction card — business clients             | Present             |
| `./direction-broad.md`         | Direction card — broad / universal            | Present             |
| `plan.md` / `plan-brief.md`    | Implementation plan (not pack deliverables)   | Planning artifacts  |

Pack deliverables (complete): `README.md`, `audience-brief.md`, and the three direction cards above. No `locked-direction` artifact in this folder — choice remains open.

## Done checklist

Proposal scope for this change — satisfied:

- [x] Audience / business brief present (`audience-brief.md`)
- [x] Three direction cards present with shared schema (`./direction-young-drivers.md`, `./direction-business.md`, `./direction-broad.md`)
- [x] Each card has short pros suitable for comparison
- [x] README documents that lock + apply are outside this change

**Explicitly out of done bar:** recording the user’s chosen direction, writing a lock artifact, applying tokens/components in `src/`.

## Downstream handoff

**Next human step:** compare the three cards, pick one direction, and record the lock (outside this change) before S-01. Until that happens, treat style as unlocked and do not start S-01.

| Slice / gate           | Needs                                                        | Note                                                                                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S-01** (nav / stubs) | Recorded style choice + plan to apply it consistently        | **S-01 waits on that choice.** Do not start until a human locks one of `./direction-young-drivers.md`, `./direction-business.md`, or `./direction-broad.md` (or an explicit equivalent) and FR-002 apply is planned |
| Later UI slices        | Locked direction cues (mood, palette keywords, type, layout) | Applying the chosen direction — design tokens in `src/styles/global.css` and component chrome — belongs to later slices **after** the lock is recorded; not in this change                                          |

Until a direction is locked elsewhere, treat FR-002 as incomplete even though all proposal files exist. This folder alone does not mean the style is locked.
