# Content-store schema and keyed seed — Plan Brief

> Full plan: `context/changes/content-store-schema-seed/plan.md`

## What & Why

Write the content-store schema and a keyed seed of current OSK copy so the owner can apply SQL and the public site can later read live values without a rebuild. This foundation unlocks S-01 (page copy), S-02 (nav), and S-03 (blog visibility). It does not change what visitors see today.

## Starting Point

Nine Markdown pages, hardcoded `site-nav.ts` chrome, fourteen stubs, and six article teasers with no bodies. Supabase is auth-only: no migrations, no content tables, no Storage.

## Desired End State

SQL artifacts exist for a hybrid store (copy keys, pages, frozen nav slots, articles, media URLs), with RLS and an empty `osk-media` bucket. A catalog lists every `osk.*` key; seed SQL matches it; a verify script catches drift. The public site still renders from Markdown until S-01.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| Schema shape | Hybrid tables | Keyed lookup plus pinning/order/images cannot live in one EAV grid |
| Structured lists | Flatten each cell to a key | Missing copy must show that exact `osk.*` key (US-03) |
| Seed surface | Pages, bodies, stubs, nav, 6 articles, gallery records | Unlocks S-01–S-03; form labels stay in components |
| Articles | 6 teasers, empty body, displayed, no images | Matches current copy and the “bez obrazków” addendum |
| Gallery files | Media rows with today’s `/images/osk/…` URLs | Owner can apply SQL without uploading binaries |
| Access | Anon SELECT published; `site_editor` writes | Hidden articles stay off the anon key; Studio owner still bypasses RLS |
| Stub placeholder | Per-page title + body keys | Filling one stub does not rewrite every placeholder |
| Verification | Catalog + seed + sync script | Implementer can finish without touching the live project |

## Scope

**In scope:**
- Migration: `site_copy`, `pages`, `nav_slots`, `articles`, `media`, RLS, `is_site_editor()`, empty `osk-media` bucket
- `src/types.ts` row/enum contract
- `supabase/key-catalog.json` from current copy
- Idempotent `supabase/seed.sql` + `scripts/verify-content-seed.mjs` + `supabase/APPLY.md`

**Out of scope:**
- Public-site data-source swap (S-01–S-03)
- Implementer running SQL against the hosted project
- CMS UI, form-label keys, hardcoded section headings
- Hero/decorative image move; gallery binary upload
- Duplicate home/artykuly `news_*` keys (articles own those titles)

## Architecture / Approach

`site_copy` holds every string (`osk.<area>.<field>`). `pages` registers routes and visibility. `nav_slots` freeze IA (stable ids, parent, sort, placement) and point at label/href keys. `articles` hold visibility, dates, and key pointers (empty body `''`). `media` holds gallery URL+alt for home and `/galeria`. Anon reads published rows; writes require JWT `app_metadata.role = site_editor`.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Schema | Tables, RLS, empty bucket, DTOs | A thin contract forces S-01–S-03 rework |
| 2. Catalog | Every key + registry rows traced to source | Missed slot or invented form/heading keys |
| 3. Seed + verify | Idempotent SQL, sync check, owner apply note | Seed drifts from catalog; hosted apply skipped because `db push` does not load seed |

**Prerequisites:** PRD v2 + F-01 ready; current Markdown/`site-nav.ts` as seed input; Docker optional for local `db reset`
**Estimated effort:** ~2 sessions across 3 phases

## Open Risks & Assumptions

- Prototype treats implementer and owner as the same person; applying SQL is an owner-hat step, not an external wait.
- Home news strip will read the first three articles in S-01 — not separate keys — so that strip is not independently editable in the store until someone adds keys later.
- Empty article bodies will show blank (or later the key only if a row is deleted); that is accepted until the owner writes posts.

## Success Criteria (Summary)

- Owner can apply schema + seed in Studio/`db reset` and see keyed copy, nav slots, six articles, and gallery URL rows
- Catalog and seed cannot disagree (`node scripts/verify-content-seed.mjs`)
- Public site is unchanged (still Markdown) after the artifacts land
