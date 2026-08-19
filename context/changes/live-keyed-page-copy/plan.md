# Live keyed page copy Implementation Plan

## Overview

Deliver roadmap S-01 (north star): wire all 25 public page routes to the F-01 content store so stored copy and gallery images appear on the next request without rebuild, missing values show the lookup key inline, hidden pages return 404, and Supabase failures degrade to the same key fallback. Navigation (`site-nav.ts`) and article teasers/listing stay on their current sources until S-02/S-03.

## Current State Analysis

Public copy today comes from nine Astro Content Collection Markdown files (`src/content/pages/*.md` via `getPageEntry` in `src/lib/content/pages.ts`), hardcoded titles on fourteen stub routes and two form routes, and inline section chrome on `index.astro`. Eleven content routes export `prerender = true`, baking copy at build time.

F-01 (archived) delivered the Supabase schema, 221 keyed copy rows, 25 page registry rows, six gallery media rows, `supabase/key-catalog.json`, and DTOs in `src/types.ts`. `src/lib/supabase.ts` creates an SSR client for auth only — no `site_copy` / `pages` / `media` queries exist yet.

Per `supabase/APPLY.md`, page visibility gates `pages` rows (RLS hides `hidden` from anon SELECT) but **not** `site_copy`. S-01 must check visibility via the registry before rendering; missing copy and DB errors both surface the key string (planning decision).

### Key Discoveries:

- Area namespace = page slug with hyphens → underscores (`nasza-auto-szkola` → `osk.nasza_auto_szkola.*`) — same rule as `scripts/build-key-catalog.mjs:187`
- Structured lists are flattened in the catalog (`price_N_*`, `dashboard_N_*`, `review_N_*`, `hero_pitch_N`) — mappers rebuild arrays from the flat key map
- Gallery media rows exist only for `home` and `galeria` (`home_gallery_1` … `galeria_gallery_3`); URLs point at static `/images/osk/*.webp`
- Home/artykuly `newsTeasers` are article data (S-03); F-01 seeded them as `articles` rows, not page copy keys — S-01 keeps Markdown teasers until S-03
- Hardcoded home section headings (“Galeria”, “Opinie kursantów”, etc.) and hero image **src** paths are intentionally out of the catalog (PRD parked scope)
- `StubPage.astro:18` hardcodes “Treść w przygotowaniu” — must accept body from store
- No runtime markdown-from-string helper exists; `@astrojs/markdown-remark` is available transitively via Astro

## Desired End State

Every public page route (25 total, excluding `/dashboard` and auth) loads copy from Supabase at request time. Editing a `site_copy.value` in the store changes what visitors see on the next refresh without redeploy. Any slot whose row is absent or whose fetch fails shows the raw key (e.g. `osk.home.title`). Empty string body values render an empty prose block. Pages with `visibility: hidden` respond with HTTP 404. Gallery grids on `/` and `/galeria` load image URL + alt from `media` + `site_copy` alt keys. Markdown `newsTeasers` on home and `/artykuly` still work unchanged.

### Verification:

1. Change `osk.home.hero_title` in Supabase → home hero updates on refresh
2. Delete a copy row → page shows the key in that slot (not 500, not blank)
3. Set a page to `hidden` → that URL returns 404
4. Change a gallery `media.url` → image src updates on home/galeria
5. Stop Supabase / unset env → pages render with keys in text slots (same as missing)

## What We're NOT Doing

- Navigation chrome from store (S-02) — `site-nav.ts` stays hardcoded
- Blog article list/detail from store (S-03) — keep Markdown `newsTeasers` on home/artykuly only
- CMS form UI, auth roles UI, or write paths
- Seeding or editing form field labels (`ContactForm`, `EnrollmentForm`, etc.)
- Moving hero/decorative image **src** into the store (alt text keys exist but src stays static/hardcoded)
- Hardcoded section headings on `index.astro` (not in catalog)
- New copy keys beyond the F-01 catalog
- Markdown as a live fallback when Supabase is down (keys-only degradation)
- Automated test suite (no test runner in repo)

## Implementation Approach

1. Add a server-only content read layer under `src/lib/content/` that batches Supabase reads per page, resolves keys with a single `resolveCopy` contract, gates visibility, and renders markdown bodies to HTML.
2. Add page-shape mappers that turn flat key maps into the props existing section components already expect (Hero, PriceTable, DashboardStrip, etc.).
3. Swap all 25 public `.astro` routes: remove `prerender = true`, replace `getPageEntry` field usage with store-backed view-models; keep a narrow Markdown read only for `newsTeasers` on home and artykuly.
4. Update `StubPage` to render store body instead of a hardcoded placeholder string.

## Critical Implementation Details

**Visibility before copy.** Query `pages` (by slug) first. If the row is missing, treat as missing page (404). If `visibility === 'hidden'`, return 404 before fetching copy — do not rely on RLS alone in app code, so behavior is explicit and testable when using a service role locally.

**Empty string ≠ missing key.** A row with `value: ''` resolves to `""` and renders nothing in prose slots. US-03 key fallback applies only when the row is absent or the read fails.

**DB-down = keys everywhere.** When `createClient` returns `null`, the Supabase query throws, or the row set is empty for requested keys, `resolveCopy(key, map)` returns `key` (the lookup string). No Markdown fallback.

**Gallery alt fallback.** For each media row: `src = url` if present else `alt_key` string; `alt = resolved alt copy` if present else `alt_key` string. Omit the `<img>` only if both url and alt_key are unusable.

## Phase 1: Content read layer

### Overview

Introduce the Supabase read contract shared by all routes: slug→area mapping, batched copy fetch, visibility gate, gallery media fetch, markdown body rendering, and the missing-key resolver.

### Changes Required:

#### 1. Key helpers

**File**: `src/lib/content/keys.ts`

**Intent**: Centralize slug→area conversion and key prefix construction so routes and mappers stay aligned with `build-key-catalog.mjs`.

**Contract**: Export `slugToArea(slug: string): string` (`slug.replace(/-/g, "_")`) and `pageKey(area: string, field: string): string` → `` `osk.${area}.${field}` ``.

#### 2. Copy resolver

**File**: `src/lib/content/resolve-copy.ts`

**Intent**: Single US-03 contract for every text slot.

**Contract**: `resolveCopy(key: string, map: Map<string, string> | null | undefined): string` — returns `map.get(key)` when the key exists (including empty string); otherwise returns `key`.

#### 3. Markdown body renderer

**File**: `src/lib/content/markdown.ts`

**Intent**: Render stored `osk.{area}.body` markdown strings as HTML inside `ProseSection` typography.

**Contract**: Export `renderMarkdownBody(source: string): Promise<string>` producing sanitized HTML (headings, lists, links, paragraphs). Prefer Astro's remark stack if importable; otherwise add a minimal direct dependency. Output is injected via `set:html` in a prose wrapper div matching existing `ProseSection` inner classes.

#### 4. Store loader

**File**: `src/lib/content/store.ts`

**Intent**: Per-request Supabase reads for a page slug — visibility, copy batch, gallery media.

**Contract**:

- `loadPageVisibility(client, slug): Promise<PageRow | null>` — `from('pages').select().eq('slug', slug).maybeSingle()`; returns null on error (caller treats as 404 or key fallback per visibility rules above)
- `loadCopyKeys(client, keys: string[]): Promise<Map<string, string>>` — single `from('site_copy').select('key,value').in('key', keys)`; on error/null client return empty map (resolver shows keys)
- `loadGalleryMedia(client, pageSlug): Promise<MediaRow[]>` — `from('media').select().eq('page_slug', pageSlug).eq('kind', 'gallery').order('sort_order')`; empty array on error
- `assertPublicPage(page: PageRow | null): page is PageRow` — false when null or `visibility === 'hidden'`

Wire through `createClient(Astro.request.headers, Astro.cookies)` from `src/lib/supabase.ts`.

#### 5. 404 helper for routes

**File**: `src/lib/content/not-found.ts`

**Intent**: Consistent hidden/missing page response across Astro routes.

**Contract**: Export `notFoundResponse(): Response` returning `new Response(null, { status: 404, statusText: 'Not Found' })` and document the Astro early-return pattern (`return notFoundResponse()` in frontmatter).

### Success Criteria:

#### Automated Verification:

- Lint passes: `npm run lint`
- Production build passes: `npm run build`
- New modules typecheck under existing `tsconfig` (no `any` leaks on store rows — use `src/types.ts`)

#### Manual Verification:

- Importing `resolveCopy('osk.home.title', new Map())` in a scratch check returns `'osk.home.title'`
- Importing `resolveCopy('osk.home.title', new Map([['osk.home.title', '']]))` returns `''`
- `renderMarkdownBody('## Test\n\nParagraph')` produces expected heading + paragraph HTML

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Page view-models

### Overview

Map flat copy key maps (+ optional gallery media) into typed view-models matching existing component props, without changing section component APIs.

### Changes Required:

#### 1. Shared page view-model types

**File**: `src/lib/content/page-types.ts`

**Intent**: Typed shapes routes pass to layouts/sections.

**Contract**: Types for `ContentPageView`, `StubPageView`, `FormPageView` covering fields the catalog actually seeds (title, description, hero, ctas, body HTML, structured lists, gallery items `{ src, alt }[]`).

#### 2. Content-page mapper

**File**: `src/lib/content/map-content-page.ts`

**Intent**: Build view-models for the nine Markdown-backed content pages from a key map + slug.

**Contract**: Export `mapContentPage(slug, area, copyMap, bodyHtml, galleryMedia?)` returning fields per page kind:

| Slug        | Extra structured fields                                                                                                                      |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `home`      | `heroPitches[]`, `dashboardItems[]`, `reviewQuotes[]`, `secondaryCta`, gallery                                                               |
| `cennik`    | `priceRows[]`                                                                                                                                |
| All content | `title`, `description`, `heroTitle`, `heroSubtitle`, `heroImageAlt` (alt only — src from static frontmatter or hardcoded), `cta`, `bodyHtml` |

Scan numbered keys until `resolveCopy` returns a key string for the label field (optional rows stop the scan). Rebuild `cta` / `secondaryCta` objects only when both label and href resolve to non-key **or** render partial CTAs with key strings in missing half (each field resolved independently).

#### 3. Stub and form mappers

**File**: `src/lib/content/map-stub-page.ts`, `src/lib/content/map-form-page.ts`

**Intent**: Minimal mappers for stub (`title`, `body` → body HTML) and form pages (`zapisy-na-kurs`: title only; `referencje`: title + heroSubtitle).

**Contract**: Stub body uses the same markdown renderer when body is non-empty; when body is empty string, pass empty content.

#### 4. Gallery resolver

**File**: `src/lib/content/map-gallery.ts`

**Intent**: Turn `MediaRow[]` + copy map into `{ src, alt }[]` for `MediaFigure`.

**Contract**: For each row: resolve `alt_key` through `resolveCopy`; `src = row.url || resolved alt key string`; `alt = resolved alt or alt_key`.

#### 5. Orchestrator

**File**: `src/lib/content/load-page.ts`

**Intent**: Single entry point routes call from Astro frontmatter.

**Contract**: `loadPublicPage(slug, Astro): Promise<{ kind: 'content'|'stub'|'form', view: ..., notFound?: true }>` — checks visibility, collects the key list for the slug (from a static registry mirroring catalog fields), batch-fetches copy, loads gallery when slug is `home` or `galeria`, renders body markdown, delegates to the correct mapper. Export `STATIC_NEWS_SLUGS = ['home', 'artykuly']` for Phase 3 Markdown teaser retention.

#### 6. Key registry per slug

**File**: `src/lib/content/page-key-registry.ts`

**Intent**: Explicit list of copy keys fetched per page (avoids `select *` on `site_copy`).

**Contract**: Record keyed by page slug → array of key strings matching `supabase/key-catalog.json` for that page's area. Generated/maintained alongside catalog — if a key is in the catalog for a page, it must appear here.

### Success Criteria:

#### Automated Verification:

- Lint passes: `npm run lint`
- Build passes: `npm run build`

#### Manual Verification:

- With seed applied locally, `loadPublicPage('cennik', …)` returns price rows matching seeded values
- Deleting `osk.cennik.price_1_label` row causes that label slot to show the key string in the mapped view
- `loadPublicPage` for unknown slug returns `notFound`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Route wiring (25 public pages)

### Overview

Replace Markdown/hardcoded copy on every public route with `loadPublicPage`, remove static prerender, and keep Markdown only for `newsTeasers` on home and artykuly.

### Changes Required:

#### 1. StubPage component

**File**: `src/components/site/StubPage.astro`

**Intent**: Render store-provided stub body instead of a hardcoded placeholder.

**Contract**: Add optional `bodyHtml?: string` prop; when provided, render via `set:html` in place of the fixed “Treść w przygotowaniu” paragraph. When `bodyHtml` is empty, render no body paragraph (empty stub shell).

#### 2. Narrow Markdown retention helper

**File**: `src/lib/content/pages.ts`

**Intent**: Keep Astro Content Collection access only for S-03-parked teaser data.

**Contract**: Add `getNewsTeasers(id: 'home' | 'artykuly')` returning `entry.data.newsTeasers` or `undefined`; deprecate broad `getPageEntry` usage from routes (may keep export for transitional imports but routes should not call it for copy fields).

#### 3. Remove prerender from content routes

**Files**: All eleven routes that export `prerender = true`:

- `src/pages/index.astro`
- `src/pages/nasza-auto-szkola.astro`
- `src/pages/kursy.astro`
- `src/pages/cennik.astro`
- `src/pages/porady-dla-kursanta.astro`
- `src/pages/galeria.astro`
- `src/pages/artykuly.astro`
- `src/pages/prawo-jazdy-automat.astro`
- `src/pages/kontakt.astro`
- `src/pages/referencje.astro`
- `src/pages/zapisy-na-kurs.astro`

**Intent**: Ensure copy is read at request time on Cloudflare SSR.

**Contract**: Delete `export const prerender = true` line from each file.

#### 4. Wire content pages (9)

**Files**: `index.astro`, `nasza-auto-szkola.astro`, `kursy.astro`, `cennik.astro`, `porady-dla-kursanta.astro`, `galeria.astro`, `artykuly.astro`, `prawo-jazdy-automat.astro`, `kontakt.astro`

**Intent**: Swap `getPageEntry` + `<Content />` for store view-models + rendered body HTML.

**Contract**: Each route calls `loadPublicPage('<slug>', Astro)`; early-return 404 when `notFound`. Pass view-model fields into existing components (`Hero`, `ProseSection`, `PriceTable`, `DashboardStrip`, `CtaBand`, `MediaFigure`). Replace `<Content />` with `<div set:html={view.bodyHtml} />` inside `ProseSection` when body non-empty.

**Per-route static image retention**:

- `index.astro` / `home`: keep hardcoded section headings; gallery grid uses store media; hero src from `home.md` frontmatter **or** existing static path for `heroImage.src`; `newsTeasers` via `getNewsTeasers('home')`
- `nasza-auto-szkola.astro`: keep hardcoded `/images/osk/fleet-03.webp` MediaFigure block; hero image src static as today
- `kursy.astro` / `porady-dla-kursanta.astro`: keep hardcoded hub H2 (“Więcej z oferty”) and `site-nav.ts` hub links unchanged
- `artykuly.astro`: `newsTeasers` via `getNewsTeasers('artykuly')`; drop Markdown body/title for store copy
- `galeria.astro`: gallery grid from store media, not frontmatter `teaserImages`

#### 5. Wire stub pages (14)

**Files**: `auto-szkola-retkinia.astro`, `auto-szkola-zgierz.astro`, `wspolpraca.astro`, `prawo-jazdy-na-motocykl.astro`, `jazdy-doszkalajace.astro`, `ranking-auto-szkol-lodz.astro`, `nasi-instruktorzy.astro`, `filmy-instruktazowe.astro`, `trudne-skrzyzowania.astro`, `trasy-egzaminacyjne.astro`, `pytania-egzaminacyjne.astro`, `wymogi-formalne.astro`, `regulamin.astro`, `polityka-prywatnosci.astro`

**Intent**: Replace inline `const title = "…"` with store-backed title/body via `StubPage`.

**Contract**: `loadPublicPage` → `<StubPage title={view.title} bodyHtml={view.bodyHtml} />`.

#### 6. Wire form pages (2)

**Files**: `zapisy-na-kurs.astro`, `referencje.astro`

**Intent**: Titles (and referencje subtitle) from store; forms unchanged.

**Contract**: `zapisy-na-kurs` — Hero title from store; `referencje` — Hero title + subtitle from `osk.referencje.title` / `osk.referencje.hero_subtitle`.

### Success Criteria:

#### Automated Verification:

- Lint passes: `npm run lint`
- Build passes: `npm run build`
- Grep confirms no `export const prerender = true` remains under `src/pages/` except auth/dashboard if any

#### Manual Verification:

- All 25 public URLs render without 500 when seed is applied (`npx supabase db reset` locally)
- `/` and `/galeria` gallery images match `media` table URLs
- Home news teaser section still shows three Markdown teasers
- Stub page body shows seeded “Treść w przygotowaniu” from store (editable without redeploy)
- Layout at 375px unchanged (spot-check home, cennik, one stub)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: End-to-end verification

### Overview

Prove the north-star claims from roadmap S-01 and US-01/US-03 with a repeatable manual checklist. Document owner-facing verification steps.

### Changes Required:

#### 1. Owner verification note

**File**: `context/changes/live-keyed-page-copy/verification.md`

**Intent**: Short checklist the owner runs after implementation (aligned with roadmap north star).

**Contract**: Steps for live edit, missing key, hidden page 404, gallery URL change, Supabase-down key fallback; references `supabase/APPLY.md` for seed apply prerequisite.

### Success Criteria:

#### Automated Verification:

- Lint passes: `npm run lint`
- Build passes: `npm run build`
- `npm run verify:content-seed` still passes (catalog unchanged)

#### Manual Verification:

- Edit `osk.home.hero_title` in Supabase Studio → visible on `/` after refresh without rebuild
- Delete a non-critical copy row → page shows that key in the slot
- Set `pages.visibility = 'hidden'` for a stub slug → 404 at that path
- Change `media.url` for `home_gallery_1` → home gallery first image updates
- Unset `SUPABASE_URL` in `.dev.vars` → page renders with keys in text slots (no crash)
- Mobile spot-check at 375px: no horizontal scroll on home and cennik

**Implementation Note**: This is the final phase — manual sign-off completes S-01.

---

## Testing Strategy

### Unit Tests:

- Not in scope — no test runner configured. Resolver and mapper behavior verified via manual checks in Phases 1–2.

### Integration Tests:

- Local Supabase + dev server: full request cycle per verification.md

### Manual Testing Steps:

1. Apply seed locally (`npx supabase db reset` or Studio per `supabase/APPLY.md`)
2. `npm run dev` — open `/`, `/cennik`, `/galeria`, one stub, `/referencje`
3. Live-edit one key in Studio — confirm refresh shows new text
4. Delete one key row — confirm key string appears in slot
5. Hide one page — confirm 404
6. Break Supabase env — confirm key fallback, not 500

## Performance Considerations

Per-page batched `site_copy` fetch (one `IN` query per page plus one `pages` lookup plus optional one `media` query) keeps request count low on Cloudflare Workers. Avoid fetching the full 221-key table per request. No caching layer in S-01 — store edits must appear on the next request.

## Migration Notes

- Owner must apply F-01 migration + seed before S-01 pages show real copy (otherwise all slots show keys — valid US-03 state)
- Markdown files remain in repo as seed input for `build-key-catalog.mjs`; they are no longer the live source after S-01 ships
- Do not delete Markdown until owner confirms store parity

## References

- Roadmap S-01: `context/foundation/roadmap.md`
- PRD US-01, US-03: `context/foundation/prd-v2.md`
- F-01 plan (schema contract): `context/archive/2026-08-19-content-store-schema-seed/plan.md`
- Key catalog: `supabase/key-catalog.json`
- Visibility consumer note: `supabase/APPLY.md`
- Current page loader: `src/lib/content/pages.ts:16`
- Supabase client: `src/lib/supabase.ts:5`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Content read layer

#### Automated

- [x] 1.1 Lint passes: `npm run lint` — 11cd226
- [x] 1.2 Production build passes: `npm run build` — 11cd226
- [x] 1.3 New modules typecheck under existing `tsconfig` — 11cd226

#### Manual

- [ ] 1.4 `resolveCopy` missing-key and empty-string behavior verified
- [ ] 1.5 `renderMarkdownBody` produces expected HTML

### Phase 2: Page view-models

#### Automated

- [x] 2.1 Lint passes: `npm run lint` — bc31df1
- [x] 2.2 Build passes: `npm run build` — bc31df1

#### Manual

- [ ] 2.3 `loadPublicPage('cennik')` returns seeded price rows
- [ ] 2.4 Deleted copy row surfaces key in mapped view
- [ ] 2.5 Unknown slug returns notFound

### Phase 3: Route wiring (25 public pages)

#### Automated

- [x] 3.1 Lint passes: `npm run lint`
- [x] 3.2 Build passes: `npm run build`
- [x] 3.3 No `prerender = true` on wired public content routes

#### Manual

- [ ] 3.4 All 25 public URLs render with seed applied
- [ ] 3.5 Gallery on `/` and `/galeria` from store media
- [ ] 3.6 Home news teasers still from Markdown
- [ ] 3.7 Stub body editable via store
- [ ] 3.8 375px layout spot-check

### Phase 4: End-to-end verification

#### Automated

- [x] 4.1 Lint passes: `npm run lint`
- [x] 4.2 Build passes: `npm run build`
- [x] 4.3 `npm run verify:content-seed` passes

#### Manual

- [ ] 4.4 Live edit visible without rebuild
- [ ] 4.5 Missing key shows lookup key in slot
- [ ] 4.6 Hidden page returns 404
- [ ] 4.7 Gallery URL change visible
- [ ] 4.8 Supabase-down shows keys (no 500)
- [ ] 4.9 Mobile 375px spot-check
