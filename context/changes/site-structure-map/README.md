# Site structure map — analysis pack

## Purpose

Reusable FR-001 analysis pack for the source client site. Documents information architecture, sections/components, forms/integrations, and MVP-in vs MVP-out so later slices (S-01, S-02, S-04, S-05) can build without re-crawling the live site.

This change is documentation only — no Astro routes or `src/` UI.

## Source

| Field | Value |
| ----- | ----- |
| Live site | https://www.autojuszczak.com.pl/ |
| Crawl method | HTML primary nav + footer “Mapa strony” + Strefa hub + in-page offer siblings |
| Sitemap XML | Do not treat as seed source (historically HTTP 500; see `crawl-inventory.md` for crawl-time status) |
| Identity | `change.md` (`change_id: site-structure-map`) |

## Documents

| File | Role | Status |
| ---- | ---- | ------ |
| `change.md` | Change identity + planning notes | Present |
| `README.md` | Pack index, language rule, FR-001 checklist, downstream consumers | Present (this file) |
| `crawl-inventory.md` | URL fetch inventory seed (status / discovery source) | Present — working seed for later phases |
| `sitemap.md` | Primary/footer/Strefa menus & hierarchy | Present — Phase 2 complete |
| `sections.md` | Homepage sections + repeated components | Present — Phase 2 complete |
| `forms-integrations.md` | Forms, interactive features, integrations, backend-needed | Present — Phase 3 complete |
| `mvp-scope.md` | MVP-in / stubs / MVP-out + recommendations | Placeholder — filled in Phase 4 |
| `plan.md` / `plan-brief.md` | Implementation plan (not pack deliverables) | Planning artifacts |

## Language

- **English** for headings, notes, status values, and checklist wording.
- **Polish** source labels and path/URL strings kept **verbatim** from the live site (no translation, no slug invention).

## FR-001 completeness checklist

Checklist topics from PRD FR-001 / `page_mvp.md` §2. Structure topics closed in Phase 2; remaining boxes by later phases.

- [x] Sitemap / menus (`sitemap.md`)
- [x] Key sections and repeated components (`sections.md`)
- [x] Forms and interactive features (`forms-integrations.md`)
- [x] External integrations (`forms-integrations.md`)
- [x] Backend-or-server-needed features (`forms-integrations.md`)
- [ ] Explicit MVP-in vs MVP-out classification (`mvp-scope.md`)

Supporting seed (not a FR-001 topic by itself):

- [x] Crawl inventory with fetch status (`crawl-inventory.md`)

## Downstream consumers

| Slice | Consumes | How |
| ----- | -------- | --- |
| **S-01** (nav / stubs) | `sitemap.md`, `crawl-inventory.md`, `mvp-scope.md` | Mirror primary/footer/Strefa trees; stub unreachable/asset-only honestly |
| **S-02** (top-level content) | `mvp-scope.md` (copy targets), `sections.md`, `sitemap.md` | Copy source-faithful content for listed top-level destinations |
| **S-04** (deep path) | `mvp-scope.md` recommendation, `sitemap.md` | Implement one recommended (unlocked) deep path — confirm before locking |
| **S-05** (inert forms) | `forms-integrations.md`, `mvp-scope.md` | Build visible forms with submit disabled per documented list |
