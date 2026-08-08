# Site Structure Map — Plan Brief

> Full plan: `context/changes/site-structure-map/plan.md`

## What & Why

Build a reusable FR-001 analysis pack for https://www.autojuszczak.com.pl/ so later slices can mirror navigation and scope content/forms without re-crawling. The owner only commits after seeing authentic structure and content; this pack is the documented map that makes that build possible.

## Starting Point

Astro starter only — no OSK pages. Requirements live in `page_mvp.md` §2, PRD FR-001, and roadmap F-01. Live site is a medium simplysmart/Bootstrap marketing site; `sitemap.xml` is broken (500), so HTML crawl is the source of truth.

## Desired End State

Change folder holds `README.md` + `sitemap.md` + `sections.md` + `forms-integrations.md` + `mvp-scope.md`. Downstream can open the right file for nav stubs, copy targets, inert forms, and a recommended (unlocked) deep path.

## Key Decisions Made

| Decision | Choice | Why |
| -------- | ------ | --- |
| Pack packaging | Multi-doc + README index | Slice-friendly citations; matches “documents” plural in brief |
| Blog depth | Listing only (`/artykuly`) | Low MVP value vs crawl cost |
| MVP stance | Maximal structure; copy = all primary nav (+ Zapisy if primary CTA) | Richer owner recognition without full-site copy migration |
| Deep path / forms | Recommend, do not lock | Informs S-04/S-05; roadmap still confirms later |
| Done bar | FR-001 checklist only | Fast gate; no mandatory live spot-check |
| Crawl gaps | Record unreachable / asset-only | Honest inventory despite timeouts/PDFs |
| Language | EN structure, PL labels/URLs | Fits foundation docs; preserves authenticity |

## Scope

**In scope:** HTML crawl inventory; full IA sitemap/menus; sections/components; forms/interactive; integrations; backend-needed; MVP-in/out; recommendations; README checklist.

**Out of scope:** App routes/UI; body copy migration; full blog archive; locking deep path/forms; F-02 style; auth removal; fixing source sitemap.xml.

## Architecture / Approach

Docs-only change under `context/changes/site-structure-map/`. Crawl HTML (nav/footer/hubs) → structure docs → features doc → `mvp-scope.md` classification. No `src/` changes.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Scaffold & crawl inventory | README contracts + URL inventory table | Timeouts → mark unreachable, don’t stall |
| 2. Structure & sections | `sitemap.md` + `sections.md` | Missing footer/Strefa links |
| 3. Features & integrations | `forms-integrations.md` | Over-claiming backends not evidenced |
| 4. MVP scope & handoff | `mvp-scope.md` + checklist complete | Copy-target list drifts from primary nav |

**Prerequisites:** Access to fetch https://www.autojuszczak.com.pl/ (shell curl OK if WebFetch times out).  
**Estimated effort:** ~1–2 sessions across 4 doc phases.

## Open Risks & Assumptions

- Exact URL count may stay approximate without XML sitemap.
- “Primary nav + Zapisy” copy set assumes Zapisy is treated as a top enrollment entry (confirm in Phase 4 list).
- Recon may miss a page; unreachable registry absorbs gaps rather than blocking F-01.

## Success Criteria (Summary)

- FR-001 topics all present in the multi-doc pack and checked off in README.
- Primary-nav copy targets and stub/out lists are explicit in `mvp-scope.md`.
- One deep-path + forms recommendation recorded as non-final for S-04/S-05.
