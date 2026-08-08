# Site Structure Map (Analysis Pack) Implementation Plan

## Overview

Produce a reusable FR-001 analysis pack for the source client site https://www.autojuszczak.com.pl/ as multi-document markdown under `context/changes/site-structure-map/`. The pack unlocks navigation parity (S-01), content scope (S-02/S-04), and inert-forms scope (S-05) without implementing any OSK pages yet.

## Current State Analysis

- Roadmap F-01 (`site-structure-map`) is ready; no filled analysis artifacts exist.
- Repo is still the Astro starter (auth/dashboard); no OSK IA in `src/`.
- Source site (recon): simplysmart.pl / Bootstrap 3 marketing site; ~7 flat primary-nav destinations; Strefa kursanta content cluster; blog listing with pagination; ~3 form types; maps/social/GA/reCAPTCHA; **sitemap.xml returns HTTP 500** — inventory must use HTML nav, footer “Mapa strony”, and in-page links.
- Locked product rules already define depth (full pack, not nav-only), actor (AI writes docs), and content fidelity (source-faithful later; this change is documentation only).

### Key Discoveries:

- Pack contract: `context/page_mvp.md` §2 + `context/foundation/prd.md` FR-001
- Change-folder convention: deliverables live under `context/changes/<change-id>/`, not `context/foundation/`
- Primary nav labels (PL, verbatim from source): O nas, Aktualności, Oferta, Cennik, Galeria, Strefa kursanta, Kontakt — plus CTA Zapisy na kurs
- Interactive surface is small (signup, contact+reCAPTCHA, reviews); no payment gateway or student login spotted in recon

## Desired End State

`context/changes/site-structure-map/` contains `change.md`, `README.md`, `sitemap.md`, `sections.md`, `forms-integrations.md`, and `mvp-scope.md`. Together they satisfy FR-001: sitemap/menus, key sections and repeated components, forms/interactive features, external integrations, backend-or-server-needed features, and explicit MVP-in vs MVP-out. Downstream slices can open the relevant doc without re-crawling the live site.

**Verify:** every FR-001 topic appears in the pack; `README.md` indexes files and states the done checklist; `mvp-scope.md` lists primary-nav copy targets, stubbed deep pages, recommended (unlocked) deep path + inert forms, and an unreachable/asset-only table for crawl gaps.

## What We're NOT Doing

- Implementing Astro routes, layouts, nav UI, or copying page body content into the app
- Full blog post-by-post inventory or restoring/fixing source `sitemap.xml`
- Locking FR-005 deep path or FR-006 form list as final (recommend only)
- Removing starter auth/Supabase (document as out-of-MVP only)
- Visual style work (F-02), stubs (S-01), or public deploy (S-03)
- Mandatory human spot-check of the live site against every URL (done bar is checklist-only)

## Implementation Approach

Scaffold the change folder and README contracts first, then crawl the live HTML (curl/fetch; treat WebFetch timeouts as retry-via-shell). Write structure docs, then features/integrations, then MVP classification with recommendations. English headings and notes; keep Polish labels and source URLs verbatim. Prefer tables and nested bullet trees over prose walls so S-01 can copy the nav tree mechanically.

## Critical Implementation Details

**Crawl reality:** Do not rely on `sitemap.xml` (HTTP 500). Seed from primary nav + footer map + Strefa hub links; record timeouts/404s/PDF-only as `unreachable` or `asset-only` with reason — never omit quietly. Blog stays at listing-level (`/artykuly` + note that paginated archive exists); do not expand every `artykul-*` URL.

**MVP classification rule (locked in planning):** Maximal **structure** (almost all content URLs appear in sitemap/nav for stub parity). Expand **copy targets** to all primary nav destinations (and the Zapisy CTA page if treated as primary enrollment entry). Deep children remain title-only stubs in later slices except one recommended representative path. This does **not** authorize inventing body copy during this change.

---

## Phase 1: Scaffold & crawl inventory

### Overview

Create the change identity and README index contracts, then produce a crawl inventory seed (URL list with fetch status) that later phases consume.

### Changes Required:

#### 1. Change identity

**File**: `context/changes/site-structure-map/change.md`

**Intent**: Ensure identity exists with `status` advancing toward implementation when work starts; during this phase keep notes pointing at source URL and pack file list if missing anything from planning.

**Contract**: Frontmatter `change_id: site-structure-map` matching folder name; `status` remains `planned` until `/10x-implement` flips lifecycle.

#### 2. Pack index

**File**: `context/changes/site-structure-map/README.md`

**Intent**: Define the pack’s file map, language rule (EN structure / PL labels), FR-001 checklist, and how downstream slices should consume each doc.

**Contract**: Sections at minimum: Purpose, Source, Documents (table of pack files), Language, FR-001 completeness checklist, Downstream consumers (S-01/S-02/S-04/S-05). No filled analysis tables yet beyond placeholders pointing to sibling files.

#### 3. Crawl inventory seed

**File**: `context/changes/site-structure-map/crawl-inventory.md` (working artifact; may be folded into `sitemap.md` in Phase 2 and deleted, or kept as appendix — prefer keep if large)

**Intent**: Capture every discovered URL from HTML crawl with status (`ok` / `unreachable` / `asset-only`), HTTP or error reason, and discovery source (nav / footer / hub / inline).

**Contract**: Table columns: URL, PL label (if known), discovery source, status, notes. Must include all primary nav destinations, Zapisy CTA, footer legal links, Strefa hub children found from `/porady-dla-kursanta` (and obvious offer siblings linked from homepage/oferta), blog listing only (not each post). PDF links marked `asset-only`.

### Success Criteria:

#### Automated Verification:

- `context/changes/site-structure-map/change.md` exists with `change_id: site-structure-map`
- `README.md` exists and contains headings for Purpose, Documents, FR-001 completeness checklist
- `crawl-inventory.md` exists with a markdown table including every primary-nav path from recon (`/nasza-auto-szkola`, `/artykuly`, `/kursy`, `/cennik`, `/galeria`, `/porady-dla-kursanta`, `/kontakt`) plus `/zapisy-na-kurs`
- No row for individual blog posts is required; listing row for `/artykuly` is present

#### Manual Verification:

- Skim `crawl-inventory.md`: statuses look plausible (not all blank); unreachable rows include a reason string

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to the next phase.

---

## Phase 2: Structure & sections pack

### Overview

Turn the inventory into the durable structure documents: full sitemap/menus hierarchy and key sections/repeated components.

### Changes Required:

#### 1. Sitemap & menus

**File**: `context/changes/site-structure-map/sitemap.md`

**Intent**: Document the source information architecture so S-01 can mirror nav without inventing routes.

**Contract**: Include: primary nav (ordered, PL labels + paths); secondary/footer menus; Strefa cluster tree; offer-related siblings; legal/PDF entries; blog as listing node only. Mark hierarchy depth. Cross-link unreachable entries to the inventory status. Optional: proposed Astro route slug mapping column (same path preferred when sensible) — document-only, no files under `src/pages/`.

#### 2. Sections & components

**File**: `context/changes/site-structure-map/sections.md`

**Intent**: Capture homepage and recurring page patterns so later design/content work knows what blocks exist on the source site.

**Contract**: Cover at least: homepage major sections (hero, enrollment form, price callout, news teasers, Strefa accordion, reviews, gallery strip, cookies); repeated components (accordion, carousel, lightbox, CTA phone/Zapisy, footer columns). Note which are content vs chrome. Do not invent components not observed.

#### 3. README pointer update

**File**: `context/changes/site-structure-map/README.md`

**Intent**: Mark structure docs as filled in the Documents table / checklist.

**Contract**: Documents table status for `sitemap.md` and `sections.md` set to present/complete for structure topics.

### Success Criteria:

#### Automated Verification:

- `sitemap.md` exists and contains distinct sections for primary nav, footer/legal, and Strefa (or equivalent cluster heading)
- `sections.md` exists and mentions homepage sections plus at least two repeated component types observed on source
- Primary nav PL labels appear verbatim somewhere in `sitemap.md` (e.g. `O nas`, `Oferta`, `Kontakt`)

#### Manual Verification:

- Hierarchy in `sitemap.md` is readable enough that someone could sketch a nav tree without opening the live site

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to the next phase.

---

## Phase 3: Features & integrations pack

### Overview

Document forms, interactive behaviors, external integrations, and anything that needs backend/server — even when MVP-out.

### Changes Required:

#### 1. Forms, interactive, integrations, backend-needed

**File**: `context/changes/site-structure-map/forms-integrations.md`

**Intent**: Give S-05 and Non-Goals documentation a single source for interactive/integration scope.

**Contract**: Four subsections minimum:
  1. **Forms** — location URL, fields summary, submit target/method if visible, captcha
  2. **Interactive features** — accordions, carousels, lightbox, cookie banner, etc. (non-form)
  3. **External integrations** — social, maps embed, analytics, reCAPTCHA, third-party profile links, etc.
  4. **Backend / server-needed** — anything that requires server processing, email send, CMS admin, auth, payments, student portal, etc. (include “not observed but implied by form POST” where relevant)

Each item: short description + source URL evidence + note whether live behavior was verified or inferred from HTML.

#### 2. README pointer update

**File**: `context/changes/site-structure-map/README.md`

**Intent**: Mark features doc complete on the FR-001 checklist for forms/integrations/backend topics.

**Contract**: Checklist items for forms, interactive, integrations, backend-needed marked done when the subsections exist.

### Success Criteria:

#### Automated Verification:

- `forms-integrations.md` exists with four subsection headings covering Forms, Interactive, External integrations, Backend/server-needed (wording may vary; all four topics present)
- At least the three known form surfaces are listed: homepage/`/zapisy-na-kurs`, `/kontakt`, `/referencje` (or “opinie/referencje” equivalent if label differs)
- At least maps, social, and analytics or reCAPTCHA appear under integrations (as observed)

#### Manual Verification:

- Backend-needed list does not claim a live student login or payment gateway unless newly observed with evidence; absence should be stated explicitly if still not found

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation before proceeding to the next phase.

---

## Phase 4: MVP scope & handoff

### Overview

Classify MVP-in vs MVP-out, record recommendations for deep path and inert forms, finish the FR-001 checklist, and leave a clean handoff for S-01+.

### Changes Required:

#### 1. MVP scope document

**File**: `context/changes/site-structure-map/mvp-scope.md`

**Intent**: Make build decisions explicit so later slices do not re-litigate capacity vs recognition.

**Contract**: Required sections:
  - **MVP-in (structure)** — URLs that must appear in nav/stubs
  - **MVP-in (copy targets)** — all primary nav destinations (+ Zapisy if included as primary enrollment entry); list paths explicitly
  - **MVP-out / document-only** — blog archive posts, PDFs as content bodies, live integrations, form POST backends, starter auth, etc.
  - **Stub policy reminder** — title-only placeholders; no invented body; no empty dead links
  - **Recommendations (not locked)** — one FR-005 deep path (representative journey, with rationale) and which forms get inert UI in S-05
  - **Unreachable / asset-only registry** — consolidated from crawl (URL, status, reason)
  - **Open items for later slices** — e.g. confirm deep path at S-04 plan time

#### 2. README completion

**File**: `context/changes/site-structure-map/README.md`

**Intent**: Close the FR-001 completeness checklist and point implementers to `mvp-scope.md` first for scope questions.

**Contract**: All FR-001 checklist boxes conceptually satisfied (structure + features + integrations + backend-needed + MVP-in/out). Documents table lists all five pack files as present.

#### 3. Optional cleanup

**File**: `context/changes/site-structure-map/crawl-inventory.md`

**Intent**: Avoid duplicate sources of truth once sitemap/mvp-scope absorb status.

**Contract**: Either delete after merging unreachable registry into `mvp-scope.md`, or add a one-line note at top: “Superseded for IA — see sitemap.md / mvp-scope.md; retained as raw crawl log.” Prefer retain-with-note if useful for audit.

### Success Criteria:

#### Automated Verification:

- `mvp-scope.md` exists with MVP-in structure, MVP-in copy targets, MVP-out, recommendations, and unreachable registry sections
- Copy-targets list includes each primary nav path
- Recommendations section names exactly one deep-path proposal and a non-empty forms list
- `README.md` FR-001 checklist marks all required topics complete
- Pack files present: `README.md`, `sitemap.md`, `sections.md`, `forms-integrations.md`, `mvp-scope.md`

#### Manual Verification:

- Read recommendations in `mvp-scope.md`: deep path feels like a representative owner/candidate journey (not the easiest stub); forms list matches demo needs
- Confirm no app code under `src/` was required for this change (docs-only)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation. F-01 is done when Progress Automated + Manual for Phase 4 are checked; then roadmap can advance via `/10x-implement` / archive flow.

---

## Testing Strategy

### Unit Tests:

- None — no application code; no test runner in repo for markdown packs.

### Integration Tests:

- None required. Optional shell checks: `Test-Path` / `rg` for required headings in pack files (use as Automated Verification commands during implement).

### Manual Testing Steps:

1. Open `README.md` and walk the Documents table — each linked file exists.
2. From `sitemap.md`, confirm you could brief someone on the full nav without visiting the live site.
3. From `mvp-scope.md`, confirm copy targets vs stubs vs out-of-scope match the planning rule (primary nav copy; deep stubs; integrations out).
4. Confirm recommendations are clearly labeled non-final.

## Performance Considerations

Crawl may hit LiteSpeed slowness / timeouts — retry with shell curl, back off, mark unreachable rather than blocking the pack. Do not attempt full blog archive scrape.

## Migration Notes

N/A for app/data. When this change archives, keep the pack readable under `context/archive/site-structure-map/` (or copy durable excerpts into foundation only if a future decision explicitly promotes them — out of scope here).

## References

- PRD FR-001: `context/foundation/prd.md`
- Brief checklist: `context/page_mvp.md` §2
- Roadmap F-01: `context/foundation/roadmap.md`
- Shape locked decisions: `context/foundation/shape-notes.md` (site mapping actor; analysis depth)
- Source: https://www.autojuszczak.com.pl/

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Scaffold & crawl inventory

#### Automated

- [x] 1.1 change.md exists with change_id site-structure-map — 5e136c6
- [x] 1.2 README.md exists with Purpose, Documents, FR-001 checklist headings — 5e136c6
- [x] 1.3 crawl-inventory.md table includes all primary-nav paths plus zapisy-na-kurs — 5e136c6
- [x] 1.4 Blog represented as listing-only (/artykuly); no per-post inventory required — 5e136c6

#### Manual

- [ ] 1.5 Skim crawl-inventory statuses; unreachable rows include reasons

### Phase 2: Structure & sections pack

#### Automated

- [x] 2.1 sitemap.md has primary nav, footer/legal, and Strefa sections — bd88999
- [x] 2.2 sections.md covers homepage sections and repeated components — bd88999
- [x] 2.3 Primary nav PL labels appear verbatim in sitemap.md — bd88999

#### Manual

- [ ] 2.4 sitemap.md hierarchy is readable as a nav brief without the live site

### Phase 3: Features & integrations pack

#### Automated

- [x] 3.1 forms-integrations.md covers forms, interactive, integrations, backend-needed
- [x] 3.2 Zapisy, kontakt, and referencje/opinie form surfaces are listed
- [x] 3.3 Maps, social, and analytics or reCAPTCHA appear under integrations

#### Manual

- [ ] 3.4 Backend-needed list does not invent student login/payments without evidence; absences stated

### Phase 4: MVP scope & handoff

#### Automated

- [ ] 4.1 mvp-scope.md has structure-in, copy targets, out, recommendations, unreachable registry
- [ ] 4.2 Copy targets include each primary nav path
- [ ] 4.3 Recommendations name one deep path and a non-empty forms list
- [ ] 4.4 README FR-001 checklist complete; all five pack files present

#### Manual

- [ ] 4.5 Deep-path recommendation looks representative; forms list fits demo
- [ ] 4.6 Confirm docs-only — no src/ app changes required for F-01
