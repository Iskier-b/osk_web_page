# Representative deep path Implementation Plan

## Overview

Fill one representative owner/candidate journey with source-faithful content: `/kursy` (already done) → condensed `/prawo-jazdy-automat` → `/kontakt` prose (no form). Add a product-page CTA to the `/zapisy-na-kurs` stub. Prove the path on ~375px (homepage + path hops + CTA), leaving other depth-2 pages stubbed and forms to S-05.

## Current State Analysis

- S-02 filled top-level hubs including `/kursy`; depth-2 offer children and `/kontakt` / `/zapisy-na-kurs` remain `StubPage`.
- F-01 recommended (unlocked) path `/kursy` → `/prawo-jazdy-automat` → `/kontakt`; this plan locks that path.
- Content pattern: `src/content/pages/<id>.md` + `getPageEntry` + `Hero` / `ProseSection` / `CtaBand` + `export const prerender = true`.
- `PageId` in `src/lib/content/pages.ts` does not yet include `prawo-jazdy-automat` or `kontakt`.
- Nav already exposes Oferta → product child and primary Kontakt; product stubs have no in-page CTA.
- S-05 owns inert forms (including Kontakt and Zapisy); this slice must not ship a working or inert form UI.

## Desired End State

A visitor on phone (~375px) can open homepage, walk `/kursy` → `/prawo-jazdy-automat` → `/kontakt`, see real condensed automat copy and contact prose (address/phones), click the product CTA into the Zapisy stub, and never see invented facts or a contact form that looks production-ready.

### Key Discoveries:

- Soft pattern to clone: `src/pages/kursy.astro` / `nasza-auto-szkola.astro` + MD under `src/content/pages/`.
- Contact facts already appear elsewhere (e.g. O nas / home): `ul. Rydzowa 2, 91-211 Łódź`, phone `510 285 635` — Kontakt page must stay source-faithful to live `/kontakt`, not invent extras.
- Condensed product page: hero + key selling points only — not a full dump of every source section.
- Verification deliberately mobile-first for this slice (desktop not required for S-04 sign-off; top-level desktop already covered in S-02).

## What We're NOT Doing

- Filling any other depth-2 offer/Strefa/legal pages
- Inert or live forms, reCAPTCHA, or maps embeds on `/kontakt` or `/zapisy-na-kurs` (S-05)
- Expanding Zapisy beyond leaving it a stub destination for the CTA
- Inventing prices, contacts, claims, or new marketing copy
- Auto-deploy / public URL work (S-03)
- Requiring desktop walkthrough as an S-04 done gate
- New section components unless an existing one cannot express condensed prose + CTA

## Implementation Approach

Harvest live source for the two target URLs into a short notes file in this change folder, then add two content entries and replace two stub routes using the S-02 pipeline. Product MD `cta.href` must be `/zapisy-na-kurs`. Keep Zapisy on `StubPage`. Manual phone walkthrough covers homepage, the three path hops, and the CTA landing.

## Phase 1: Harvest & fill `/prawo-jazdy-automat`

### Overview

Capture source-faithful condensed copy for the automatic-license product page, wire it through the content collection, and point `CtaBand` at the Zapisy stub.

### Changes Required:

#### 1. Source harvest note

**File**: `context/changes/representative-deep-path/source-harvest.md` (create)

**Intent**: Record what was taken from the live source so fidelity can be reviewed without re-crawling.

**Contract**: Document URL `https://www.autojuszczak.com.pl/prawo-jazdy-automat`, the hero/key points kept, sections intentionally omitted for “condensed” scope, and any clarity-only edits (no new facts). Also note CTA label choice if adapted lightly for clarity.

#### 2. Content entry + PageId

**File**: `src/content/pages/prawo-jazdy-automat.md` (create)

**Intent**: Hold condensed, source-faithful body and frontmatter for the product page.

**Contract**: Frontmatter includes at least `title`, `heroTitle` / `heroSubtitle` as needed, and `cta: { label, href: "/zapisy-na-kurs" }`. Body is condensed (hero-supporting key points), not full source dump. No invented prices/claims.

**File**: `src/lib/content/pages.ts`

**Intent**: Allow `getPageEntry("prawo-jazdy-automat")`.

**Contract**: Extend `PageId` union with `"prawo-jazdy-automat"`.

#### 3. Route

**File**: `src/pages/prawo-jazdy-automat.astro`

**Intent**: Replace stub with filled prerendered page matching S-02 composition.

**Contract**: `export const prerender = true`; `getPageEntry("prawo-jazdy-automat")`; `Hero` + `ProseSection`/`Content` + `CtaBand` from entry `cta`. Remove `StubPage`. No requirement for product-specific new images in this condensed scope.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- Route is no longer a `StubPage` (grep/`StubPage` absent from `prawo-jazdy-automat.astro`)
- Built/content CTA href is `/zapisy-na-kurs`

#### Manual Verification:

- Local preview of `/prawo-jazdy-automat` shows condensed authentic copy (not “Treść w przygotowaniu”)
- CTA navigates to `/zapisy-na-kurs` stub
- Spot-check: no invented prices/contacts vs source harvest note

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Fill `/kontakt` prose

### Overview

Replace the Kontakt stub with source-faithful contact prose and address/phone details only — no form UI.

### Changes Required:

#### 1. Harvest append

**File**: `context/changes/representative-deep-path/source-harvest.md`

**Intent**: Record Kontakt source facts used in this slice.

**Contract**: Add section for `https://www.autojuszczak.com.pl/kontakt` listing address, phones, hours, and prose blocks copied; explicitly list form/map/reCAPTCHA as **out of this slice**.

#### 2. Content entry + PageId

**File**: `src/content/pages/kontakt.md` (create)

**Intent**: Hold Kontakt page copy without form fields.

**Contract**: Frontmatter `title` (+ optional hero fields). Body includes recognizable contact prose and contact details from source. Do not describe a working form or include form field labels as if interactive.

**File**: `src/lib/content/pages.ts`

**Intent**: Allow `getPageEntry("kontakt")`.

**Contract**: Extend `PageId` with `"kontakt"`.

#### 3. Route

**File**: `src/pages/kontakt.astro`

**Intent**: Ship a real Kontakt page for the path end-point.

**Contract**: Same S-02 pattern (`prerender`, `Hero`, `ProseSection`). No form components, no maps iframe, no reCAPTCHA scripts. Optional CTA is allowed only if source-faithful and does not imply submit (e.g. `tel:` / mailto) — default: omit form-like CTA.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- `kontakt.astro` does not use `StubPage`
- Grep of `src/pages/kontakt.astro` and `src/content/pages/kontakt.md` shows no form/`<form` / reCAPTCHA / maps embed markup

#### Manual Verification:

- `/kontakt` shows address/phones (and related prose) recognizable vs source
- No visible form or “WYŚLIJ” control
- Primary nav still reaches `/kontakt`

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Path walkthrough (phone)

### Overview

Prove FR-005 on ~375px: homepage spot-check, three path hops, and product CTA → Zapisy stub.

### Changes Required:

#### 1. Walkthrough stamp

**File**: `context/changes/representative-deep-path/change.md`

**Intent**: Record that the representative path was verified for owner demo readiness.

**Contract**: Under `## Notes`, append a short stamp like `Verified deep path (375px) YYYY-MM-DD: / → /kursy → /prawo-jazdy-automat → /kontakt; CTA → /zapisy-na-kurs (stub)`. Update `updated:` date. No code changes required unless a bug is found (then fix in the offending page and re-verify).

### Success Criteria:

#### Automated Verification:

- `change.md` Notes contain the verification stamp line

#### Manual Verification:

- At ~375px: homepage loads; path `/kursy` → `/prawo-jazdy-automat` → `/kontakt` all show real content (not stubs) for those three
- At ~375px: no horizontal scroll on the filled path pages (`/kursy`, `/prawo-jazdy-automat`, `/kontakt`); primary nav usable
- Product CTA reaches `/zapisy-na-kurs` stub (“Treść w przygotowaniu” acceptable)
- Other depth-2 offer children remain stubs
- Desktop walkthrough not required for this slice’s done bar

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful. S-04 is complete when Progress Manual items for Phase 3 are checked.

---

## Testing Strategy

### Unit Tests:

- None — repo has no test runner; do not invent a suite.

### Integration Tests:

- None automated beyond `lint` / `build`. Rely on phone walkthrough.

### Manual Testing Steps:

1. Phase 1: open `/prawo-jazdy-automat`; confirm condensed copy + CTA → Zapisy stub.
2. Phase 2: open `/kontakt`; confirm prose/contact only; no form.
3. Phase 3: 375px walk homepage + three hops + CTA; stamp Notes.

## Performance Considerations

Prerender both new pages like other marketing routes. No new carousels or heavy embeds.

## Migration Notes

- Zapisy and all other depth-2 stubs stay as-is for later slices.
- S-05 should add inert forms atop the Kontakt prose page without re-harvesting contact facts if possible.
- Condensed automat page may be expanded later; do not treat omitted source sections as “deleted forever.”

## References

- Roadmap: `context/foundation/roadmap.md` (S-04)
- PRD: `context/foundation/prd.md` (FR-005)
- Path recommendation: `context/archive/2026-08-09-site-structure-map/mvp-scope.md`
- Content pattern: `src/pages/kursy.astro`, `src/lib/content/pages.ts`, `src/content.config.ts`
- Prior top-level harvest: `context/archive/2026-08-09-top-level-authentic-content/source-harvest.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Harvest & fill `/prawo-jazdy-automat`

#### Automated

- [x] 1.1 `npm run lint` passes
- [x] 1.2 `npm run build` passes
- [x] 1.3 `prawo-jazdy-automat.astro` is not a StubPage
- [x] 1.4 Product CTA href is `/zapisy-na-kurs`

#### Manual

- [ ] 1.5 Local preview shows condensed authentic copy on `/prawo-jazdy-automat`
- [ ] 1.6 CTA navigates to `/zapisy-na-kurs` stub
- [ ] 1.7 Spot-check: no invented prices/contacts vs harvest note

### Phase 2: Fill `/kontakt` prose

#### Automated

- [ ] 2.1 `npm run lint` passes
- [ ] 2.2 `npm run build` passes
- [ ] 2.3 `kontakt.astro` is not a StubPage
- [ ] 2.4 No form / reCAPTCHA / maps embed in Kontakt page or MD

#### Manual

- [ ] 2.5 `/kontakt` shows recognizable address/phones and prose
- [ ] 2.6 No visible form or WYŚLIJ control
- [ ] 2.7 Primary nav still reaches `/kontakt`

### Phase 3: Path walkthrough (phone)

#### Automated

- [ ] 3.1 `change.md` Notes contain the verification stamp

#### Manual

- [ ] 3.2 At ~375px: homepage + `/kursy` → `/prawo-jazdy-automat` → `/kontakt` show real content
- [ ] 3.3 At ~375px: no horizontal scroll on filled path pages; primary nav usable
- [ ] 3.4 Product CTA reaches `/zapisy-na-kurs` stub
- [ ] 3.5 Other depth-2 offer children remain stubs
