# Top-level authentic content Implementation Plan

## Overview

Fill the seven agreed top-level content targets with source-faithful copy from https://www.autojuszczak.com.pl/ (light clarity/hierarchy rewrites allowed; no invented facts), composed through Astro Content Collections (Markdown) and shared section components in the locked Broad visual system. Leave Kontakt and Zapisy as title-only stubs until S-05. Verify readable layouts at 375px, tablet, and large desktop.

## Current State Analysis

- S-01 shipped full public chrome and 25 marketing routes as `StubPage` shells driven by `src/lib/site-nav.ts`. Automated work is done; change is archived.
- F-01 analysis pack (`context/archive/2026-08-09-site-structure-map/`) locks copy targets, homepage section inventory (`sections.md`), and stub policy.
- F-02 / S-01 locked **Broad** tokens in `src/styles/global.css` and Nunito in `Layout.astro`.
- No Content Collections, no `src/content/`, no marketing section components (hero/prose/price/gallery) yet.
- Stack is Astro 6 SSR (`output: "server"`) on Cloudflare; `@astrojs/mdx` is not installed.

### Key Discoveries:

- Explicit S-02 copy list lives in `mvp-scope.md` (nine paths); this plan narrows by planning decisions: full/representative content on five pages, light blurbs on Galeria + Aktualności, Kontakt + Zapisy remain stubs.
- Astro 6 requires `src/content.config.ts` with Content Layer `glob()` loaders; prefer plain MD + Astro composition over MDX.
- Marketing pages should `export const prerender = true` so Cloudflare serves static HTML and avoids SSR content-store pitfalls.
- Homepage form, Owl carousels, Lightbox, live reviews embeds are documented in `sections.md` but are MVP-out / S-05 territory — represent with static teasers and CTAs only.

## Desired End State

A visitor browsing primary-nav destinations (except Kontakt) reads recognizable OSK Juszczak content in a calmer Broad layout: real home stack, O nas, Oferta hub, Cennik, Strefa hub, plus short Galeria/Aktualności blurbs. Kontakt and Zapisy still show `Treść w przygotowaniu`. Depth-2 stubs unchanged. Layouts work at 375px (no horizontal scroll, usable nav), tablet, and large desktop without style drift.

### Verification snapshot:

- Seven MD entries exist and power the seven filled routes; two enrollment/contact routes still use `StubPage`.
- `npm run lint` and `npm run build` pass.
- Manual viewport checks pass on every filled page.

## What We're NOT Doing

- Kontakt (`/kontakt`) and Zapisy (`/zapisy-na-kurs`) body content or form UI (S-05)
- Full Galeria image migration or individual `/artykul-*` posts
- Legal page bodies (`/polityka-prywatnosci`, `/regulamin`)
- Depth-2 authentic copy (S-04)
- Live form POST, reCAPTCHA, analytics, maps embeds, Owl/Lightbox carousels
- Installing `@astrojs/mdx` unless a later change proves mid-document components are required
- Inventing prices, phones, addresses, rankings, or marketing claims absent from source
- Public deploy URL (S-03)
- Auth/dashboard cleanup

## Implementation Approach

1. Scaffold one `pages` Markdown collection + shared Astro section components + a small `public/` image set.
2. Harvest source copy/images; write MD entries with frontmatter for structured sections; compose existing route files (keep URLs/`site-nav.ts` stable).
3. Fill core recognition pages first (home, O nas, Oferta, Cennik), then Strefa hub + Galeria/Aktualności blurbs.
4. Finish with a responsive + fidelity pass across filled pages only.

Fidelity rule for this slice: source facts stay true; light clarity/hierarchy rewrites are allowed when source prose is messy — do not add new claims.

## Critical Implementation Details

**Prerender marketing content pages.** Every filled route (and preferably unchanged stubs that only import static chrome) should set `export const prerender = true` when loading `astro:content`, so Workers do not depend on a runtime content store for these pages. Auth API routes remain `prerender = false`.

**Home without S-05 forms.** Represent the source enrollment block as headline pitches + CTA linking to `/zapisy-na-kurs` (still a stub). Do not ship a working or fake-submitting form in this slice.

## Phase 1: Content pipeline + section kit

### Overview

Stand up Astro Content Layer for marketing pages, shared section components in Broad style, and an asset folder for a small set of source images — without filling final copy yet (scaffold + sample entry is enough to prove the pipeline).

### Changes Required:

#### 1. Content collection config

**File**: `src/content.config.ts`

**Intent**: Define a single `pages` collection loaded from Markdown under `src/content/pages/`, with a Zod schema covering title, optional description, and structured fields needed by section components (hero, CTAs, blurb mode, image refs).

**Contract**: Astro 6 Content Layer — `defineCollection` + `glob({ pattern: "**/*.md", base: "./src/content/pages" })`; schema via `astro/zod`. Export `collections = { pages }`. No legacy `src/content/config.ts`.

#### 2. Placeholder MD entries

**File**: `src/content/pages/*.md` (seven ids: `home`, `nasza-auto-szkola`, `kursy`, `cennik`, `porady-dla-kursanta`, `galeria`, `artykuly`)

**Intent**: Create entry files matching route keys so `getEntry("pages", id)` works; temporary scaffold body is fine until Phases 2–3 replace with source-faithful copy.

**Contract**: Entry `id` aligns with path segment (`home` → `/` via `index.astro`; others → `/<id>`). Frontmatter validates against the collection schema.

#### 3. Shared section components

**File**: `src/components/sections/` (e.g. `Hero.astro`, `ProseSection.astro`, `DashboardStrip.astro`, `CtaBand.astro`, `HubChildLinks.astro`, `MediaFigure.astro`, `PriceTable.astro` as needed)

**Intent**: Provide Broad-styled, Astro-first building blocks for page composition so MD stays mostly prose + frontmatter rather than layout.

**Contract**: Props-driven; use `cn()` where classes merge; no invented marketing strings inside components — all copy passed from pages/MD. Prefer open stacked sections over card grids unless interaction needs a container (locked Broad direction).

#### 4. Asset folder + helper

**File**: `public/images/osk/` (or similar) and optional `src/lib/content/pages.ts`

**Intent**: Reserve a place for a small set of downloaded source images; optional helper wraps `getEntry`/`render` with a clear missing-entry error.

**Contract**: Images referenced by stable relative/public URLs from frontmatter. Helper returns typed entry + rendered `Content` for route files.

#### 5. Wire one route as pipeline proof

**File**: `src/pages/index.astro` (minimal scaffold wiring only is acceptable if full home lands in Phase 2)

**Intent**: Prove prerender + `getEntry` + section composition builds cleanly before bulk copy work.

**Contract**: `export const prerender = true`; load `pages`/`home`; do not leave a broken stub hybrid.

### Success Criteria:

#### Automated Verification:

- `src/content.config.ts` exists and `npx astro sync` succeeds
- Seven MD entry files exist under `src/content/pages/`
- At least three section components exist under `src/components/sections/`
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Dev server loads `/` without content-collection runtime errors
- Broad tokens (background/foreground/primary) still apply on the wired scaffold page

**Implementation Note**: After completing this phase and all automated verification passes, pause for human confirmation of manual checks before Phase 2.

---

## Phase 2: Core recognition pages

### Overview

Replace stubs on `/`, `/nasza-auto-szkola`, `/kursy`, and `/cennik` with source-harvested Markdown and composed sections, including a small set of real source images where they strengthen recognition.

### Changes Required:

#### 1. Source harvest notes

**File**: `context/changes/top-level-authentic-content/change.md` (`## Notes`) and/or a short `source-harvest.md` sibling

**Intent**: Record which source URLs/sections were copied, which images were taken, and any clarity rewrites — so fidelity review is auditable.

**Contract**: List source page → target route mappings; note gaps without inventing replacements.

#### 2. Homepage content + composition

**File**: `src/content/pages/home.md`, `src/pages/index.astro`, needed section components

**Intent**: Deliver a representative home stack from `sections.md`: hero pitches, key offer/price/address signals, mid-page Zapisy CTA, about teaser, light news/gallery/reviews teasers — static only, no live carousels/forms.

**Contract**: Source-faithful facts; CTA to `/zapisy-na-kurs` allowed while that route remains a stub; enrollment form UI deferred to S-05.

#### 3. O nas

**File**: `src/content/pages/nasza-auto-szkola.md`, `src/pages/nasza-auto-szkola.astro`

**Intent**: Replace `StubPage` with recognizable about copy from source (clarity edits OK).

**Contract**: `prerender = true`; title remains aligned with nav label **O nas**.

#### 4. Oferta hub

**File**: `src/content/pages/kursy.md`, `src/pages/kursy.astro`

**Intent**: Authentic Oferta hub body plus discovery links to `ofertaChildren` from `site-nav.ts` (preserve hub pattern from S-01).

**Contract**: Child links stay data-driven from `ofertaChildren`; no invented depth-2 body copy.

#### 5. Cennik

**File**: `src/content/pages/cennik.md`, `src/pages/cennik.astro`, `PriceTable` (or equivalent)

**Intent**: Present source prices/offer lines in a readable table/stacked layout without inventing amounts.

**Contract**: Every price/string must trace to source harvest notes; responsive stacking at narrow widths.

#### 6. Selected source images

**File**: `public/images/osk/*`

**Intent**: Download a small set of clearly public client-site images for hero/about/home teasers used in this phase.

**Contract**: Filenames stable; alt text from source or neutral descriptive PL/EN consistent with nearby copy; no stock photos passed off as OSK fleet.

### Success Criteria:

#### Automated Verification:

- Routes `/`, `/nasza-auto-szkola`, `/kursy`, `/cennik` no longer render the stub meta line `Treść w przygotowaniu`
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Owner-recognizable facts appear on all four pages (name, offer cues, prices, address/phone as present in source)
- Home has multiple stacked sections (not a single prose dump) and no working enrollment form
- Oferta hub still lists all `ofertaChildren` links
- Images used on these pages load and look acceptable (not broken)

**Implementation Note**: Pause for manual confirmation before Phase 3.

---

## Phase 3: Hub + light media pages

### Overview

Fill Strefa kursanta hub with authentic hub content + child links; give Galeria and Aktualności short source-faithful blurbs (not full gallery/blog).

### Changes Required:

#### 1. Strefa hub

**File**: `src/content/pages/porady-dla-kursanta.md`, `src/pages/porady-dla-kursanta.astro`

**Intent**: Replace stub with hub body inspired by source tile/grid landing; keep `strefaChildren` discovery links.

**Contract**: `prerender = true`; children from `strefaChildren`; depth-2 targets remain stubs.

#### 2. Galeria light blurb

**File**: `src/content/pages/galeria.md`, `src/pages/galeria.astro`

**Intent**: Title + short source-derived blurb and optionally 1–3 representative images — not a full gallery migration.

**Contract**: No fake album of stock images; if images are insufficient, keep blurb-only honestly.

#### 3. Aktualności light blurb

**File**: `src/content/pages/artykuly.md`, `src/pages/artykuly.astro`

**Intent**: Listing shell / short teaser copy from source only — no individual post pages.

**Contract**: Do not invent article bodies; do not add `/artykul-*` routes.

#### 4. Explicit non-touch reminder

**File**: `src/pages/kontakt.astro`, `src/pages/zapisy-na-kurs.astro`

**Intent**: Leave both on `StubPage` for S-05; do not partially fill.

**Contract**: Still show exactly `Treść w przygotowaniu` as stub meta.

### Success Criteria:

#### Automated Verification:

- `/porady-dla-kursanta`, `/galeria`, `/artykuly` no longer show stub meta `Treść w przygotowaniu`
- `/kontakt` and `/zapisy-na-kurs` still show stub meta `Treść w przygotowaniu`
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Strefa hub lists all `strefaChildren` and reads as a real landing, not a title-only stub
- Galeria and Aktualności feel intentionally light (blurb), not abandoned empty pages
- No new blog post routes appeared

**Implementation Note**: Pause for manual confirmation before Phase 4.

---

## Phase 4: Responsive + fidelity bar

### Overview

Polish filled pages across 375px, tablet, and large desktop; run a fidelity pass so clarity rewrites did not invent facts; confirm depth-2 and Kontakt/Zapisy stubs untouched.

### Changes Required:

#### 1. Responsive fixes on filled pages

**File**: filled route files + `src/components/sections/*` + any Cennik table markup

**Intent**: Eliminate horizontal scroll at 375px; keep primary nav usable; improve tablet and large-desktop readability/spacing consistency with Broad tokens.

**Contract**: FR-007 metric on filled top-level pages; FR-008 readable desktop; no new purple/cosmic backgrounds.

#### 2. Fidelity audit

**File**: `context/changes/top-level-authentic-content/change.md` Notes (or `source-harvest.md`)

**Intent**: Cross-check prices, phones, addresses, ranking claims, and course names against source; mark any clarity rewrite.

**Contract**: Any unverified claim is removed or replaced with source text — not “improved” into new marketing.

#### 3. Regression sweep stubs

**File**: depth-2 routes + Kontakt + Zapisy (read-only verify)

**Intent**: Confirm stubs still title-only; hubs still link without dead ends.

**Contract**: No empty nav targets; stub meta line unchanged on non-filled pages.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- Grep/spot-check: stub meta `Treść w przygotowaniu` remains on `/kontakt`, `/zapisy-na-kurs`, and depth-2 stubs; absent on the seven filled targets

#### Manual Verification:

- Each filled page at ~375px width: no horizontal scroll; SiteNav usable
- Same pages acceptable on tablet and large desktop (readable measure, consistent sections)
- Spot-check against live source: no invented prices/contacts/claims on filled pages
- Owner-demo path works: Home → O nas → Oferta → Cennik → Strefa; Galeria/Aktualności show blurbs; Kontakt/Zapisy still stubbed

**Implementation Note**: After Phase 4 manual confirmation, slice is ready for S-03 planning/publish.

---

## Testing Strategy

### Unit Tests:

- None required (repo has no test runner). Rely on lint/build and content schema validation via `astro sync` / build.

### Integration Tests:

- None automated. Build must resolve all seven content entries and prerender filled routes.

### Manual Testing Steps:

1. Walk primary nav left-to-right; confirm filled vs stub expectations above.
2. Resize to 375px, tablet, and wide desktop on each filled page.
3. Compare Cennik and contact facts on home/O nas against https://www.autojuszczak.com.pl/.
4. Confirm Zapisy CTA from home lands on stub Zapisy page (expected until S-05).
5. Confirm Oferta/Strefa child links open stubs without 404.

## Performance Considerations

Prerender filled marketing pages so Cloudflare serves static HTML. Keep image set small; compress reasonably. Avoid shipping carousel libraries for teasers.

## Migration Notes

No database migration. Content moves from live source HTML into repo Markdown/assets. Stub routes remain until later slices replace them.

## References

- Roadmap S-02: `context/foundation/roadmap.md`
- PRD FR-004 / FR-007 / FR-008: `context/foundation/prd.md`
- Copy targets + stub policy: `context/archive/2026-08-09-site-structure-map/mvp-scope.md`
- Homepage sections: `context/archive/2026-08-09-site-structure-map/sections.md`
- Sitemap/IA: `context/archive/2026-08-09-site-structure-map/sitemap.md`
- Locked Broad direction: `context/archive/2026-08-09-nav-structure-stubs/locked-direction.md`
- Nav source of truth: `src/lib/site-nav.ts`
- Stub contract: `src/components/site/StubPage.astro`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Content pipeline + section kit

#### Automated

- [x] 1.1 `src/content.config.ts` exists and `npx astro sync` succeeds
- [x] 1.2 Seven MD entry files exist under `src/content/pages/`
- [x] 1.3 At least three section components exist under `src/components/sections/`
- [x] 1.4 `npm run lint` passes
- [x] 1.5 `npm run build` passes

#### Manual

- [ ] 1.6 Dev server loads `/` without content-collection runtime errors
- [ ] 1.7 Broad tokens still apply on the wired scaffold page

### Phase 2: Core recognition pages

#### Automated

- [ ] 2.1 Routes `/`, `/nasza-auto-szkola`, `/kursy`, `/cennik` no longer render stub meta `Treść w przygotowaniu`
- [ ] 2.2 `npm run lint` passes
- [ ] 2.3 `npm run build` passes

#### Manual

- [ ] 2.4 Owner-recognizable facts appear on all four core pages
- [ ] 2.5 Home has stacked sections and no working enrollment form
- [ ] 2.6 Oferta hub still lists all `ofertaChildren` links
- [ ] 2.7 Images on core pages load and look acceptable

### Phase 3: Hub + light media pages

#### Automated

- [ ] 3.1 `/porady-dla-kursanta`, `/galeria`, `/artykuly` no longer show stub meta `Treść w przygotowaniu`
- [ ] 3.2 `/kontakt` and `/zapisy-na-kurs` still show stub meta `Treść w przygotowaniu`
- [ ] 3.3 `npm run lint` passes
- [ ] 3.4 `npm run build` passes

#### Manual

- [ ] 3.5 Strefa hub lists all `strefaChildren` and reads as a real landing
- [ ] 3.6 Galeria and Aktualności feel intentionally light (blurb), not abandoned
- [ ] 3.7 No new blog post routes appeared

### Phase 4: Responsive + fidelity bar

#### Automated

- [ ] 4.1 `npm run lint` passes
- [ ] 4.2 `npm run build` passes
- [ ] 4.3 Stub meta remains on Kontakt, Zapisy, and depth-2 stubs; absent on seven filled targets

#### Manual

- [ ] 4.4 Filled pages at ~375px: no horizontal scroll; SiteNav usable
- [ ] 4.5 Filled pages acceptable on tablet and large desktop
- [ ] 4.6 Spot-check vs live source: no invented prices/contacts/claims
- [ ] 4.7 Owner-demo path works with expected filled vs stub stops
