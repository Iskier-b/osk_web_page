# Live keyed page copy — Plan Brief

> Full plan: `context/changes/live-keyed-page-copy/plan.md`

## What & Why

Wire all 25 public pages to the F-01 content store so the owner can change copy and gallery images without a redeploy — the roadmap north star (S-01). Missing stored text must show the lookup key inline (US-03), never an error page or invented wording. This proves live copy before nav (S-02) and blog (S-03) expand the surface.

## Starting Point

F-01 is done: Supabase schema, 221 keyed copy rows, page registry, gallery media, and DTOs exist; the public site still reads nine Markdown files, hardcoded stub titles, and static gallery frontmatter. Eleven routes prerender at build time. `src/lib/supabase.ts` is auth-only — no content queries yet.

## Desired End State

Every public URL loads copy from Supabase on each request. Editing a value in Studio updates the page on refresh. Missing or unreachable copy shows the raw `osk.*` key. Hidden pages 404. Home and `/galeria` gallery grids use `media` rows. Nav and article teasers stay on current sources until later slices.

## Key Decisions Made

| Decision         | Choice                               | Why                                                      | Source |
| ---------------- | ------------------------------------ | -------------------------------------------------------- | ------ |
| Page scope       | All 25 public routes                 | North star requires full page surface, not a demo subset | Plan   |
| Body rendering   | Markdown → HTML in ProseSection      | Matches current Markdown body appearance                 | Plan   |
| DB failure       | Show lookup keys in every slot       | Same contract as missing keys — owner can still diagnose | Plan   |
| Hidden pages     | HTTP 404                             | Clear visitor signal; visibility checked before copy     | Plan   |
| Missing key UX   | Raw key string, no styling           | US-03 — key is the diagnostic                            | Plan   |
| Empty body       | Render nothing                       | Empty string is valid stored content, not “missing”      | Plan   |
| News teasers     | Keep Markdown until S-03             | Articles are out of S-01 scope                           | Plan   |
| Fetch strategy   | Batched `IN` query per page          | Avoid N+1 and full-table scans on Workers                | Plan   |
| Gallery gaps     | URL from media; alt from copy or key | Owner can spot unfilled alt keys                         | Plan   |
| Section headings | Stay hardcoded                       | Not in F-01 catalog — avoid scope creep                  | Plan   |
| Hero image src   | Static paths                         | PRD parked non-gallery images                            | Plan   |

## Scope

**In scope:** Content read layer, page view-model mappers, all 25 public routes, gallery on home + galeria, visibility 404, missing-key fallback, markdown body rendering, owner verification doc.

**Out of scope:** Nav from store (S-02), blog articles/list (S-03), CMS UI, form labels, new catalog keys, hero src in store, Markdown fallback on DB failure, automated tests.

## Architecture / Approach

```
Request → Astro route (SSR, no prerender)
       → loadPublicPage(slug)
           → pages visibility check (404 if hidden)
           → site_copy batch IN query (keys from page-key-registry)
           → media query (home/galeria only)
           → resolveCopy per slot (value | key)
           → map to existing section component props
       → render (ProseSection + Hero + …)
```

Slug `nasza-auto-szkola` maps to area `nasza_auto_szkola` for key prefix `osk.nasza_auto_szkola.*`. Markdown `getNewsTeasers` remains only for home/artykuly.

## Phases at a Glance

| Phase                 | What it delivers                                      | Key risk                                              |
| --------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| 1. Content read layer | resolveCopy, store loaders, markdown body, 404 helper | Markdown renderer choice without new heavy deps       |
| 2. Page view-models   | loadPublicPage + mappers for content/stub/form shapes | Home/cennik structured field mapping drift vs catalog |
| 3. Route wiring       | 25 pages off Markdown/prerender                       | Large diff; easy to miss a prerender export           |
| 4. Verification       | Owner checklist + north-star manual proof             | Requires local/hosted seed applied                    |

**Prerequisites:** F-01 migration + seed applied (`supabase/APPLY.md`); `SUPABASE_URL` / `SUPABASE_KEY` in `.dev.vars`.
**Estimated effort:** ~2–3 focused sessions across 4 phases.

## Open Risks & Assumptions

- Owner has applied seed — without it, all slots show keys (valid but looks broken until filled)
- `site_copy` RLS allows anon read of all keys regardless of page visibility — app must gate via `pages` table
- No caching — acceptable for prototype traffic; every request hits Supabase
- Markdown files kept as seed input only — dual live sources would drift

## Success Criteria (Summary)

- Stored-text edit visible on next request without rebuild (US-01)
- Missing copy shows the lookup key, never 500 or invented text (US-03)
- Gallery images on home and galeria load from `media` table
- Hidden pages return 404; mobile layout preserved at 375px
