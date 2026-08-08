---
change_id: site-structure-map
title: Map source OSK site into full analysis pack
status: implementing
created: 2026-08-09
updated: 2026-08-09
archived_at: null
---

## Notes

Roadmap F-01 / PRD FR-001. Source site (input only): https://www.autojuszczak.com.pl/

Planning decisions (2026-08-09):
- Multi-doc pack under this change folder (`README.md` index + `sitemap.md`, `sections.md`, `forms-integrations.md`, `mvp-scope.md`)
- Blog: top-level listing inventory only (no post-by-post crawl)
- MVP stance: maximal structure; expand top-level copy targets to all primary nav destinations; deep children stubs except one recommended path
- Recommend (do not lock) FR-005 deep path + inert forms list
- Done bar: FR-001 section checklist only (no mandatory live-site spot-check)
- Crawl gaps: record as unreachable / asset-only with URL + reason
- Language: English structure; Polish source labels/URLs verbatim

Phase 1 notes (2026-08-09):
- Working crawl seed: `crawl-inventory.md` (HTML nav + footer Mapa strony + Strefa hub + offer siblings from homepage/`/kursy`)
- Pack files (planned): `README.md`, `crawl-inventory.md`, `sitemap.md`, `sections.md`, `forms-integrations.md`, `mvp-scope.md`
- `sitemap.xml` returned HTTP 200 during this crawl (XML present); inventory still seeded from HTML per plan (do not rely on sitemap)
