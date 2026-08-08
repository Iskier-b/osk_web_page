# Navigation structure with title-only stubs — Implementation Plan

## Overview

Ship the first user-visible public IA for Auto Szkoła Juszczak: lock and apply the **Broad / universal** visual direction, add public header/footer chrome (Strefa + Oferta dropdowns), and resolve every F-01 MVP-in URL to a title + honest meta stub so visitors can browse the full structure without invented body copy (FR-003 / roadmap S-01).

## Current State Analysis

- **F-01 analysis pack** (archived) defines the structure source of truth: primary nav order, Zapisy CTA, legal pages, 7 Strefa children, 7 offer/location siblings — see `context/archive/2026-08-09-site-structure-map/{sitemap,mvp-scope}.md`.
- **F-02** delivered three proposal cards only. No `locked-direction` artifact exists; `src/styles/global.css` still uses shadcn neutrals + `bg-cosmic`. Roadmap marks F-02 “done” for the proposal pack; FR-002 choice + apply remain open until this plan records Broad and applies tokens.
- **Codebase** is still the 10x Astro starter: `src/layouts/Layout.astro` has no public Header/Nav/Footer; `src/pages/` has `/`, auth, and `/dashboard` only; `Welcome.astro` + `Topbar.astro` are starter chrome, not OSK IA.
- Middleware protects only `/dashboard`; public stubs are unaffected.
- No test runner; gate on `npm run lint` and `npm run build` (per repo guidelines).

### Key Discoveries:

- Stub policy already locked in F-01: title-only placeholders, no invented body, no empty dead links (`mvp-scope.md` stub policy).
- Source paths must be preserved (`/nasza-auto-szkola`, `/kursy`, …) — proposed Astro slugs match source.
- PDF “Standardy ochrony małoletnich” entries are asset-only — not HTML stubs.
- Starter auth/dashboard is MVP-out for product surface but stays reachable via a discrete footer **Demo / konto** link (planning decision).

## Desired End State

A visitor opening the local (or later public) site sees Broad-styled chrome with brand-forward header, can walk the full F-01 MVP-in tree via primary nav (including Strefa/Oferta dropdowns), hub child lists, and footer links, and every structure URL returns a page with the correct PL title plus one fixed honest meta line — never empty 404s and never invented marketing copy. Auth routes remain but are not in the primary header.

### Verification snapshot

- Every path in `mvp-scope.md` “MVP-in (structure)” resolves HTTP 200 with PL H1 + meta line.
- Primary nav lists the 7 source items; Strefa and Oferta expose children in dropdowns; hubs also list children.
- Footer includes mapa/legal links + **Demo / konto** pointing at `/auth/signin`.
- `npm run lint` and `npm run build` pass; public shell no longer depends on cosmic Welcome as the default home.

## What We're NOT Doing

- Source-faithful body copy for top-level pages (S-02).
- Representative deep-path real content (S-04).
- Inert forms UI / disabled submit (S-05).
- Public deploy URL (S-03).
- Individual `/artykul-*` posts, live form backends, reCAPTCHA, analytics, maps embeds.
- Serving PDF bodies as Astro pages (link as static assets only if/when files are added — optional; not required to invent hosting in this slice if PDFs are omitted from footer until assets exist).
- Removing Supabase auth/dashboard routes (only hide from primary chrome).
- Full WCAG conformance, CMS, SEO as a success goal.
- Invented prices, contacts, claims, or lorem body on stubs.

## Implementation Approach

1. **Record + apply Broad** so chrome is not built on starter cosmic purple.
2. **Centralize IA data** (labels, hrefs, children) once; feed Header, Footer, hub lists, and stub titles from the same module so nav cannot drift from stubs.
3. **Public Layout chrome** — Astro layout wraps Header/Footer; use a React island only where dropdown/mobile open state needs interactivity.
4. **Shared stub presentation** — one component/pattern: PL title + fixed meta line; hubs additionally render child links from the IA module.
5. **One route file per MVP-in path** (file-based Astro routing), including replacing `/` Welcome with a stub-ready home shell.

## Critical Implementation Details

**Style lock artifact:** write `context/changes/nav-structure-stubs/locked-direction.md` that names Broad, links the archived proposal card, and states apply targets (`global.css` tokens + public chrome). This closes the FR-002 choice gap the F-02 archive explicitly left open.

**Stub meta line (fixed):** use exactly `Treść w przygotowaniu` (Polish, honest, no marketing). Do not vary per page.

**Dropdown scope:** Strefa dropdown = seven Strefa children; Oferta dropdown = seven offer/location siblings from `mvp-scope.md`. Primary items without children stay simple links.

**PDF footer entries:** if PDF files are not yet in `public/`, omit PDF links from the footer rather than linking to 404s or inventing HTML stand-ins; legal HTML stubs (`/polityka-prywatnosci`, `/regulamin`) still ship.

**Home (`/`):** replace starter `Welcome` composition with the public Layout + stub (or stub-equivalent home shell). Do not leave cosmic orbs / auth Topbar as the default first viewport.

## Phase 1: Style lock + tokens

### Overview

Record Broad as the locked direction and apply its palette/type cues to design tokens so later chrome inherits a friendly daylight look instead of the starter cosmic theme.

### Changes Required:

#### 1. Lock artifact

**File**: `context/changes/nav-structure-stubs/locked-direction.md`

**Intent**: Permanently record the user’s Broad / universal choice for FR-002, with a pointer to the archived proposal card and a short apply note for implementers.

**Contract**: Frontmatter or clear headings naming `direction: broad`, source path `context/archive/2026-08-09-visual-style-lock/direction-broad.md`, locked date `2026-08-09`, and apply targets (`src/styles/global.css`, public chrome). No second competing lock file elsewhere.

#### 2. Design tokens + document language

**File**: `src/styles/global.css`

**Intent**: Retune CSS variables to Broad cues (daylight white / soft cool gray bases, warm charcoal text, gentle sky-blue or soft teal accent for links/CTAs). Stop relying on `bg-cosmic` for the public surface.

**Contract**: Update `:root` semantic tokens (`--background`, `--foreground`, `--primary`, `--accent`, `--muted`, etc.) to a Broad-aligned light palette; keep `@theme inline` wiring intact so Tailwind utilities follow. Load an approachable open/rounded sans (e.g. via `Layout` font link or CSS `@import`) for brand/UI. Do not introduce purple-indigo or cosmic gradients as the default public background.

#### 3. Layout document defaults

**File**: `src/layouts/Layout.astro`

**Intent**: Make the HTML shell suitable for a Polish public OSK site before chrome lands.

**Contract**: `lang="pl"`; default `<title>` becomes an OSK-appropriate fallback (e.g. brand name), overridable per page via existing `title` prop. Keep config `Banner` behavior. Header/Footer slots land in Phase 2 — Phase 1 may leave chrome absent but must not require cosmic full-page backgrounds.

### Success Criteria:

#### Automated Verification:

- Lock file exists at `context/changes/nav-structure-stubs/locked-direction.md` and names Broad
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Spot-check that public pages no longer present as purple/cosmic starter by default once a simple page uses Layout
- Typography/palette reads as friendly daylight + soft teal/sky accent (Broad), not youth-neon or luxury-minimal

---

## Phase 2: Public chrome (Header / Footer / Layout)

### Overview

Add browsable site chrome driven by a single IA module: primary nav with Strefa and Oferta dropdowns, enrollment CTA, and footer with mapa/legal plus Demo / konto — wired into Layout for every public page.

### Changes Required:

#### 1. Navigation data module

**File**: `src/lib/site-nav.ts` (or equivalent under `src/lib/`)

**Intent**: Encode the F-01 MVP-in structure once (PL labels, hrefs, primary order, Strefa children, Oferta siblings, footer/legal, Zapisy CTA, phone `tel:510285635`) so Header, Footer, and stubs cannot diverge.

**Contract**: Export typed structures covering: primary items (7) with optional `children` on Strefa + Oferta; chrome CTA Zapisy → `/zapisy-na-kurs`; footer links for mapa/legal HTML pages; `demoKontoHref: "/auth/signin"`. Paths must match `mvp-scope.md` exactly. No invented slugs.

#### 2. Header + mobile/dropdown behavior

**Files**: `src/components/site/SiteHeader.astro` and/or a React island under `src/components/site/` (e.g. `SiteNav.tsx`)

**Intent**: Brand-forward public header: Auto Szkoła Juszczak as a hero-level brand signal in chrome, primary links, Strefa/Oferta dropdowns, phone + Zapisy CTA; usable mobile primary nav (reachable, no reliance on hover-only).

**Contract**: Primary order matches sitemap L→R. Dropdowns list the seven Strefa children and seven offer/location siblings. No Sign in / Sign up in the header. Active route may be highlighted when straightforward. Use `cn()` for any React class merging. Astro-first; React only for open/close interactivity.

#### 3. Footer

**File**: `src/components/site/SiteFooter.astro`

**Intent**: Secondary discovery + legal + discrete demo escape hatch without polluting primary nav.

**Contract**: Links to structure pages needed for mapa/legal parity (`/polityka-prywatnosci`, `/regulamin`, key primary destinations as appropriate). Include **Demo / konto** → `/auth/signin`. Omit PDF links unless files exist under `public/`. No invented contact blurb beyond what chrome already needs (phone may repeat from nav data).

#### 4. Wire chrome into Layout

**File**: `src/layouts/Layout.astro`

**Intent**: Every public page using Layout gets the same Header/Footer without per-page duplication.

**Contract**: Render SiteHeader above and SiteFooter below `<slot />`. Auth pages may keep Layout (chrome OK) or stay minimal — prefer consistent Layout; do not reintroduce starter Topbar into the public header.

### Success Criteria:

#### Automated Verification:

- `src/lib/site-nav.ts` (or chosen path) exists and lists all primary + depth-2 hrefs from MVP-in structure
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Desktop: open Strefa and Oferta dropdowns; all child links present and correct
- Mobile (~375px): primary nav reachable/usable (menu control works); no horizontal scroll from chrome
- Header has no auth Sign in/up; Footer shows Demo / konto → sign-in

---

## Phase 3: Stub routes + hubs

### Overview

Replace the starter home with a public stub shell and add one resolving page per remaining MVP-in URL using a shared title + meta pattern; hubs also list children from the IA module.

### Changes Required:

#### 1. Shared stub UI

**File**: `src/components/site/StubPage.astro` (or equivalent)

**Intent**: One presentation for unfinished bodies so stubs stay consistent and non-inventive.

**Contract**: Props at least `title: string` and optional `childrenLinks?: { label: string; href: string }[]`. Renders H1 with PL title and exactly one meta line: `Treść w przygotowaniu`. When `childrenLinks` provided (Strefa hub `/porady-dla-kursanta`, Oferta hub `/kursy`), render those links. No lorem, prices, or fake sections.

#### 2. Home route

**File**: `src/pages/index.astro`

**Intent**: Public `/` uses OSK Layout + stub pattern instead of Welcome/cosmic starter.

**Contract**: Stop mounting `Welcome.astro` as the homepage. Title/branding appropriate for home stub (brand-forward; may use school name as H1). Meta line same as other stubs. S-02 will replace body later.

#### 3. MVP-in page files

**Files**: one `src/pages/<slug>.astro` per remaining MVP-in path:

- Primary/legal/CTA: `nasza-auto-szkola`, `artykuly`, `kursy`, `cennik`, `galeria`, `porady-dla-kursanta`, `kontakt`, `zapisy-na-kurs`, `polityka-prywatnosci`, `regulamin`
- Strefa children: `wymogi-formalne`, `pytania-egzaminacyjne`, `trasy-egzaminacyjne`, `trudne-skrzyzowania`, `filmy-instruktazowe`, `nasi-instruktorzy`, `ranking-auto-szkol-lodz`
- Offer/location: `jazdy-doszkalajace`, `prawo-jazdy-automat`, `prawo-jazdy-na-motocykl`, `referencje`, `wspolpraca`, `auto-szkola-zgierz`, `auto-szkola-retkinia`

**Intent**: Every structure URL resolves; PL labels match `mvp-scope.md`.

**Contract**: Each page sets `Layout` `title` (PL label + brand as suitable), renders `StubPage` with the correct title; `/kursy` and `/porady-dla-kursanta` pass child link lists from the nav module. Do not create `/artykul-*` routes. Do not create HTML pages for PDF assets.

#### 4. Starter Welcome decoupling

**Files**: `src/pages/index.astro` (primary); leave `Welcome.astro` / `Topbar.astro` unused by public home (delete only if nothing references them — optional cleanup, not required).

**Intent**: Public first paint is OSK stubs, not “10x Astro Starter”.

**Contract**: Homepage and stub routes must not depend on Welcome. Auth pages may remain as-is.

### Success Criteria:

#### Automated Verification:

- All MVP-in structure paths from `mvp-scope.md` have a corresponding `src/pages/...` file (including `index.astro` for `/`)
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Spot-check ≥5 stub URLs: correct PL H1 + `Treść w przygotowaniu`
- From `/porady-dla-kursanta` and `/kursy`, child links reach depth-2 stubs
- Walk primary nav end-to-end: no dead links in header dropdowns or footer HTML links
- Confirm `/auth/signin` still opens via Footer Demo / konto

---

## Testing Strategy

### Unit Tests:

- None required — repository has no test runner; do not invent a suite for this slice.

### Integration Tests:

- None automated beyond `lint` + `build`. Optional local smoke: `npm run dev` and hit stub URLs.

### Manual Testing Steps:

1. Open `/` — Broad-styled chrome, stub home, no cosmic Welcome.
2. Open Strefa and Oferta dropdowns; visit one child each.
3. Open `/porady-dla-kursanta` and `/kursy` hub lists; confirm same children.
4. Resize to ~375px; open mobile nav; confirm usable, no horizontal scroll from chrome.
5. Footer → Demo / konto → `/auth/signin`; confirm header has no auth CTAs.
6. Hit `/polityka-prywatnosci` and `/regulamin` stubs.

## Performance Considerations

Static/SSR Astro pages with minimal React islands for nav only — keep dropdown/mobile JS small; no image-heavy heroes required in this stub slice.

## Migration Notes

No data migration. Starter home/auth remain in repo; public IA supersedes Welcome for `/` only. Later S-02 replaces stub bodies on copy-target pages without changing hrefs.

## References

- Roadmap S-01: `context/foundation/roadmap.md`
- PRD FR-003 / US-01: `context/foundation/prd.md`
- F-01 pack: `context/archive/2026-08-09-site-structure-map/{sitemap,mvp-scope}.md`
- F-02 Broad card: `context/archive/2026-08-09-visual-style-lock/direction-broad.md`
- page_mvp §3 structure / stubs: `context/page_mvp.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Style lock + tokens

#### Automated

- [x] 1.1 Lock file exists at context/changes/nav-structure-stubs/locked-direction.md and names Broad — 29a6042
- [x] 1.2 npm run lint passes — 29a6042
- [x] 1.3 npm run build passes — 29a6042

#### Manual

- [ ] 1.4 Spot-check public pages no longer present as purple/cosmic starter by default
- [ ] 1.5 Typography/palette reads as Broad (daylight + soft teal/sky), not youth-neon or luxury-minimal

### Phase 2: Public chrome (Header / Footer / Layout)

#### Automated

- [x] 2.1 site-nav module exists and lists all primary + depth-2 hrefs from MVP-in structure — c6da124
- [x] 2.2 npm run lint passes — c6da124
- [x] 2.3 npm run build passes — c6da124

#### Manual

- [ ] 2.4 Desktop: Strefa and Oferta dropdowns show all child links correctly
- [ ] 2.5 Mobile (~375px): primary nav reachable/usable; no horizontal scroll from chrome
- [ ] 2.6 Header has no auth Sign in/up; Footer shows Demo / konto → sign-in

### Phase 3: Stub routes + hubs

#### Automated

- [x] 3.1 All MVP-in structure paths have corresponding src/pages files — b95a6f8
- [x] 3.2 npm run lint passes — b95a6f8
- [x] 3.3 npm run build passes — b95a6f8

#### Manual

- [ ] 3.4 Spot-check ≥5 stubs: correct PL H1 + Treść w przygotowaniu
- [ ] 3.5 Hub child links from Strefa and Oferta reach depth-2 stubs
- [ ] 3.6 Primary nav + footer HTML links have no dead ends
- [ ] 3.7 Footer Demo / konto still opens /auth/signin
