# Inert forms UI Implementation Plan

## Overview

Ship FR-006 / S-05: visible, ready-looking enrollment, contact, and opinion forms that never send data, with submit clearly disabled and a shared demo-only notice — so the owner sees conversion UI without live backends, reCAPTCHA, or invented login/payment flows.

## Current State Analysis

- Roadmap S-05 depends on S-02 (done). F-01 recommends four surfaces; field inventories live in `context/archive/2026-08-09-site-structure-map/forms-integrations.md`.
- `/kontakt` already has Hero + prose (S-04); form was explicitly deferred here. `/zapisy-na-kurs` and `/referencje` are still `StubPage` title stubs. Home uses Hero + mid-page `CtaBand` → Zapisy; no enrollment form.
- No marketing form components exist. Auth `FormField` / `SubmitButton` use cosmic/purple styling — do not reuse for Broad marketing pages.
- shadcn currently has `Button` only; section rhythm is Astro (`Hero`, `ProseSection`, `CtaBand`) with design tokens in `global.css`.

## Desired End State

Visitors see inert forms on `/` (compact strip), `/zapisy-na-kurs` (full enrollment), `/kontakt` (after prose), and `/referencje` (minimal Opinie page). Every form shows the same demo notice and a disabled submit control; submitting via click or Enter never POSTs or hits a network endpoint. Field labels match source intent (Kontakt label corrected to **Wiadomość**). Captcha widgets are omitted. Verify with lint/build plus a manual walk that no request fires on submit attempt.

### Key Discoveries:

- Four surfaces + field tables: `forms-integrations.md` (archive) L16–30; unlocked list confirmation was a planning decision (all four).
- Kontakt append point: `src/pages/kontakt.astro` after `ProseSection` — S-04 handoff forbids putting form fields in MD.
- Home strip slot: `src/pages/index.astro` between `Hero` and `DashboardStrip` (keep existing `CtaBand`).
- Prefer Astro-native forms (no React islands) — inert UI needs no client interactivity.

## What We're NOT Doing

- Live POST backends, email/CRM, or any API route for forms
- Live Google reCAPTCHA scripts, sitekeys, or server verify
- Captcha placeholders (omitted by decision)
- Maps embeds on Kontakt
- Student login / payment forms
- Invented Opinie/Zapisy marketing body beyond form chrome (Zapisy is form-only; Referencje lead only if harvestable from source)
- Reusing auth glass/purple form components
- Changing S-03 deploy or filling other depth-2 pages

## Implementation Approach

Introduce a small Astro form kit under `src/components/forms/` (or `sections/`): shared `DemoFormNotice`, full enrollment form, compact home enrollment strip, contact form, opinion form. Wire each surface into existing Layout/section patterns. Inert contract: no form `action` that POSTs; disabled submit; `onsubmit` cancelled so Enter cannot send. Style with Broad tokens / native controls (optional shadcn Input/Label only if they stay SSR-friendly and match tokens — default to native).

## Critical Implementation Details

**Inert submit contract:** Use `<form>` without a real POST `action`, a `disabled` submit control, and an `onsubmit` handler that returns `false` (or equivalent) so Enter in a text field cannot navigate or request. Do not rely on `disabled` alone.

**Home strip field set:** Compact strip shows fewer fields than full Zapisy — **Imię i nazwisko**, **Telefon**, plus a clear link/CTA to `/zapisy-na-kurs` for the full form. Omit term select and RODO checkbox on the strip.

**Referencje lead:** Harvest a short source-faithful lead from live `/referencje` if present. If none, ship title + form + notice only — do not invent Opinie prose.

**Demo notice (shared PL):** Reuse one line across all surfaces, e.g. `Wersja demonstracyjna — wysyłanie formularza jest wyłączone.` Adjust wording only if lint/copy review needs a tighter variant; keep meaning identical.

---

## Phase 1: Shared inert form kit

### Overview

Create reusable Astro form pieces and the shared demo notice so page wiring in later phases stays thin and consistent.

### Changes Required:

#### 1. Demo notice component

**File**: `src/components/forms/DemoFormNotice.astro` (path may be `sections/` if that fits existing imports better — pick one folder and stay consistent)

**Intent**: Render the shared demo-only message so every form surface communicates disabled submission the same way.

**Contract**: Presentational Astro component; accepts optional `class` for spacing. Copy is the locked shared PL notice. Visually secondary to the form (not a full-page alert banner).

#### 2. Enrollment form (full)

**File**: `src/components/forms/EnrollmentForm.astro`

**Intent**: Full Zapisy-parity inert enrollment UI for `/zapisy-na-kurs`.

**Contract**: Fields — `name` (Imię i nazwisko / Twoje dane labeling as on Zapisy), `email`, `phone`, `term` select with a **single disabled option** whose label communicates unavailable in demo (e.g. `niedostępne w demo`), `agreement` RODO checkbox (may default checked like source, but non-submitting). Submit label **ZAPISZ**, disabled. Includes `DemoFormNotice`. No captcha. Inert submit contract from Critical Details.

#### 3. Compact home enrollment strip

**File**: `src/components/forms/EnrollmentStrip.astro`

**Intent**: Compact under-hero enrollment cue with fewer fields and a path to the full form.

**Contract**: Fields — name + phone only; disabled mini-submit or no submit (prefer disabled **ZAPISZ** for visual readiness); prominent link to `/zapisy-na-kurs` (e.g. “Pełny formularz zapisu”); includes `DemoFormNotice`. Layout fits `max-w-6xl` section rhythm; not a card-heavy dashboard.

#### 4. Contact form

**File**: `src/components/forms/ContactForm.astro`

**Intent**: Inert Kontakt form matching source fields with clarity-fixed message label.

**Contract**: Fields — name, email, phone, `question` textarea with label **Wiadomość** (not `Widomość`), placeholder **Twoje pytanie**. Submit **WYŚLIJ**, disabled. No captcha. Includes `DemoFormNotice`. Inert submit contract.

#### 5. Opinion / referencje form

**File**: `src/components/forms/OpinionForm.astro`

**Intent**: Inert opinion form for `/referencje`.

**Contract**: Fields — name, phone, email; rating selects `rating_offer` (**Zakres oferty** 1–5), `rating_quality` (**Samochody** 1–5), `rating_delivery` (**Ocena instruktora** 1–5); `comment` textarea (**Opis**). Submit **Zapisz**, disabled. No captcha. Includes `DemoFormNotice`. Inert submit contract.

### Success Criteria:

#### Automated Verification:

- New form components exist under the chosen `forms/` (or `sections/`) folder and import cleanly
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Spot-check each form component in isolation or via a temporary page mount if needed: notice visible, submit disabled, no network on Enter/click

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Home compact strip + Zapisy form page

### Overview

Wire enrollment surfaces: compact strip on home; replace Zapisy stub with form-only page.

### Changes Required:

#### 1. Homepage strip

**File**: `src/pages/index.astro`

**Intent**: Surface inert enrollment on the first viewport journey without restoring the full source hero form.

**Contract**: Import and render `EnrollmentStrip` between `<Hero />` and `DashboardStrip`. Keep existing mid-page `CtaBand` to `/zapisy-na-kurs`. Do not put form fields into `home.md`.

#### 2. Zapisy page (form-only)

**File**: `src/pages/zapisy-na-kurs.astro`

**Intent**: Replace title-only stub with a dedicated enrollment form page (no harvested body copy in this slice).

**Contract**: `export const prerender = true`. Drop `StubPage`. Render page title (Hero or simple H1 consistent with peers) + `EnrollmentForm` + shared notice (via form). No invented marketing sections. No Content Collection entry required unless needed for title consistency — prefer simple Astro title **Zapisy na kurs**.

### Success Criteria:

#### Automated Verification:

- `/` and `/zapisy-na-kurs` build as prerendered routes
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Home shows compact strip with notice, name/phone, disabled control, and working link to Zapisy
- `/zapisy-na-kurs` shows full enrollment fields including disabled term option and RODO checkbox; submit disabled; no POST/network
- Existing home `CtaBand` still reaches Zapisy

---

## Phase 3: Kontakt + Referencje forms

### Overview

Append contact form after existing Kontakt prose; promote Referencje from stub to minimal Opinie page with opinion form.

### Changes Required:

#### 1. Kontakt form append

**File**: `src/pages/kontakt.astro`

**Intent**: Layer inert contact form on top of S-04 prose without re-harvesting address/phone facts.

**Contract**: Keep Hero + `ProseSection`/`Content` unchanged. Append `ContactForm` as a sibling section after prose. Do not add form field labels to `kontakt.md`. No maps, no captcha.

#### 2. Referencje / Opinie page

**File**: `src/pages/referencje.astro` (title remains **Opinie** in chrome if that is current stub title)

**Intent**: Ship inert opinion form with minimal honest page chrome.

**Contract**: `prerender = true`. Replace `StubPage`. Title + optional short source-faithful lead (harvest from live `/referencje` only if real lead exists) + `OpinionForm`. If harvest finds no lead, omit lead — title + form + notice only. No invented testimonials body; homepage review quotes stay on home.

### Success Criteria:

#### Automated Verification:

- `/kontakt` and `/referencje` build as prerendered routes
- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Kontakt: prose still present; form below with **Wiadomość** label; submit disabled; no captcha; no POST
- Referencje: form with three rating selects + comment; demo notice; no invented long body if source had none
- Mobile (~375px) and desktop: forms usable (scroll OK, no horizontal overflow on fields)

---

## Phase 4: Polish & verify FR-006

### Overview

Cross-surface consistency pass and explicit “no data sent” verification for acceptance.

### Changes Required:

#### 1. Consistency pass

**File**: form components + the four routes above

**Intent**: Ensure shared notice wording, disabled submit affordance, and section spacing match Broad marketing (not auth theme).

**Contract**: One notice string; primary/disabled button styling via tokens; no purple/glass auth classes. Term select remains single disabled demo option on full enrollment only.

#### 2. Verification notes

**File**: `context/changes/inert-forms-ui/change.md` (`## Notes`)

**Intent**: Record a short manual verification stamp for FR-006.

**Contract**: Note date + that all four surfaces show disabled submit, shared demo notice, and no network on submit attempt (DevTools or equivalent).

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Walk all four surfaces on ~375px and desktop width
- Confirm Enter/click never fires a form navigation or XHR/fetch to a form endpoint
- Owner-facing read: forms look ready but clearly demo-only (FR-006 trust bar)

---

## Testing Strategy

### Unit Tests:

- None required (repo has no test runner; do not invent a suite)

### Integration Tests:

- None required beyond `npm run build` proving routes compile

### Manual Testing Steps:

1. Open `/` — compact strip + notice; follow link to Zapisy
2. On `/zapisy-na-kurs` — fill fields, try Enter and click ZAPISZ — no send; term option disabled
3. On `/kontakt` — confirm prose + form; WYŚLIJ disabled; label **Wiadomość**
4. On `/referencje` — ratings + Zapisz disabled
5. DevTools Network: no form POST on submit attempts
6. Resize to ~375px and a desktop width — no horizontal scroll on form rows

## Performance Considerations

Astro-static forms only — no client islands, no reCAPTCHA script. Avoid heavy JS for inert UI.

## Migration Notes

Not applicable (no data/backends). If S-04 Kontakt prose is mid-flight on another branch, rebase so form appends after prose, not onto `StubPage`.

## References

- PRD FR-006: `context/foundation/prd.md`
- Roadmap S-05: `context/foundation/roadmap.md`
- Field inventory: `context/archive/2026-08-09-site-structure-map/forms-integrations.md`
- Scope recommendation: `context/archive/2026-08-09-site-structure-map/mvp-scope.md` (S-05 section)
- S-04 Kontakt handoff: `context/changes/representative-deep-path/plan.md`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Shared inert form kit

#### Automated

- [x] 1.1 New form components exist under the chosen forms/ (or sections/) folder and import cleanly — 1734005
- [x] 1.2 npm run lint passes — 1734005
- [x] 1.3 npm run build passes — 1734005

#### Manual

- [ ] 1.4 Spot-check each form component: notice visible, submit disabled, no network on Enter/click

### Phase 2: Home compact strip + Zapisy form page

#### Automated

- [x] 2.1 `/` and `/zapisy-na-kurs` build as prerendered routes — 2b6bdb8
- [x] 2.2 npm run lint passes — 2b6bdb8
- [x] 2.3 npm run build passes — 2b6bdb8

#### Manual

- [ ] 2.4 Home shows compact strip with notice, name/phone, disabled control, and working link to Zapisy
- [ ] 2.5 `/zapisy-na-kurs` shows full enrollment fields including disabled term option and RODO checkbox; submit disabled; no POST/network
- [ ] 2.6 Existing home CtaBand still reaches Zapisy

### Phase 3: Kontakt + Referencje forms

#### Automated

- [x] 3.1 `/kontakt` and `/referencje` build as prerendered routes — 0031a18
- [x] 3.2 npm run lint passes — 0031a18
- [x] 3.3 npm run build passes — 0031a18

#### Manual

- [ ] 3.4 Kontakt: prose still present; form below with Wiadomość label; submit disabled; no captcha; no POST
- [ ] 3.5 Referencje: form with three rating selects + comment; demo notice; no invented long body if source had none
- [ ] 3.6 Mobile (~375px) and desktop: forms usable (scroll OK, no horizontal overflow on fields)

### Phase 4: Polish & verify FR-006

#### Automated

- [x] 4.1 npm run lint passes — 4764cd7
- [x] 4.2 npm run build passes — 4764cd7

#### Manual

- [ ] 4.3 Walk all four surfaces on ~375px and desktop width
- [ ] 4.4 Confirm Enter/click never fires a form navigation or XHR/fetch to a form endpoint
- [ ] 4.5 Owner-facing read: forms look ready but clearly demo-only (FR-006 trust bar)
