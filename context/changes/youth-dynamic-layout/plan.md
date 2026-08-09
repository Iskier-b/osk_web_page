# Youth-oriented dynamic layout Implementation Plan

## Overview

Deliver FR-010 / S-06: a dynamic, youth-oriented public layout/template designed and applied by the agent, while freezing menu information architecture (labels, hierarchy, destinations). Keep locked Broad design tokens as the palette base; express youth energy through composition, chrome presentation, and 2–3 purposeful motions. Cover homepage, top-level filled pages, the representative deep path, shared chrome, StubPage shells, and form visuals — without inventing copy.

## Current State Analysis

- Public pages share one shell: `src/layouts/Layout.astro` → `SiteHeader` / `SiteNav` / `SiteFooter` + section kit (`Hero`, `ProseSection`, `CtaBand`, `DashboardStrip`, etc.).
- FR-002 is locked to **Broad / universal** (`context/archive/2026-08-09-nav-structure-stubs/locked-direction.md`); sky-teal / Nunito tokens live in `src/styles/global.css`.
- Menu IA is frozen in `src/lib/site-nav.ts` (S-01 baseline). Roadmap parks reopening the style chooser; FR-010 is a layout/template pass, not a second vote.
- Marketing pages have almost no motion; `tw-animate-css` is imported but unused on public surfaces. No `prefers-reduced-motion` handling exists.
- Fourteen routes still use `StubPage.astro`. Forms share `src/components/forms/fieldClasses.ts` (S-05 in progress for disabled-submit behavior).
- S-02–S-04 already shipped authentic content and a public review URL; this slice restyles that surface for young course candidates.

### Key Discoveries:

- Safe redesign surface is presentation: `SiteNav.tsx`, header/footer Astro, section components, `StubPage`, `fieldClasses` — not `site-nav.ts` arrays.
- Young-drivers proposal card (`context/archive/2026-08-09-visual-style-lock/direction-young-drivers.md`) informs motion/composition cues; Broad lock forbids treating that card as a new palette lock.
- A literal mobile bottom-tab bar cannot host seven primary items plus nested Oferta/Strefa children without harming FR-007; plan uses an enhanced full-panel / sheet mobile nav instead.
- Home Hero currently puts pitches in the first viewport (`Hero.astro` + `index.astro`); youth composition should keep first viewport leaner (title + short support + image) and defer pitch lists / enrollment strip below.

## Desired End State

A visitor (and the OSK owner on phone + desktop) experiences a cohesive youth-oriented presentation: energetic but trustworthy composition, intentional motion (with reduced-motion respect), rebuilt chrome UI over the same nav links, and consistent shells on stubs and forms. Menu labels, order, and destinations match the S-01 IA. Source-faithful copy is unchanged. Public URL still serves the site for owner review.

### Verification snapshot:

- `site-nav.ts` arrays unchanged (diff-check).
- Homepage, top-level filled routes, and deep path (e.g. oferta hub → kontakt / zapisy) show the new layout system.
- StubPage and form shells visually match the youth chrome.
- Two–three purposeful motions fire; `prefers-reduced-motion: reduce` disables them.
- 375px: no horizontal scroll; primary nav usable. Desktop readable and style-consistent.
- `npm run lint` and `npm run build` pass.

## What We're NOT Doing

- Editing `src/lib/site-nav.ts` labels, hierarchy, hrefs, or CTA destinations
- Reopening FR-002 / writing a second lock file / switching palette to full young-drivers tokens
- New copywriting, invented facts, prices, contacts, or marketing claims
- Heavy client interactivity (parallax stacks, sticky multimedia stories, new animation libraries)
- Auth / dashboard / starter purple skins as part of this pass
- Changing S-05 form submit behavior (disabled / no-send / demo notice stay as implemented)
- New hosting platform work (re-verify existing public URL only)
- Removing unused Supabase/auth paths (separate roadmap question)

## Implementation Approach

1. Add a small motion foundation on top of existing `tw-animate-css`, plus a global reduced-motion gate and a minimal scroll-reveal helper.
2. Rebuild public chrome presentation (header / nav sheet / footer) while consuming the same `site-nav.ts` exports.
3. Restyle Hero + section composition and rebalance the homepage first viewport; apply consistently across filled top-level and deep-path pages.
4. Youth-polish `StubPage` and form field/shell classes so stubs and forms inherit the same system.
5. Run the responsive + IA-freeze + owner checklist; confirm public URL reflects the pass.

## Critical Implementation Details

**Menu IA freeze is a hard contract.** Implementers may restyle consumers of `primaryNav`, `footerLinks`, `zapisyCta`, and phone/brand exports. Any rename, reorder, add, remove, or href change in `site-nav.ts` fails this slice.

**Broad tokens stay; composition moves.** Prefer class-level hierarchy, spacing, and section rhythm over rewriting `:root` palette variables. Do not introduce purple-indigo cosmic defaults or neon glow stacks.

**Mobile nav = enhanced sheet, not bottom tabs.** Seven primary items plus nested children must remain reachable at 375px with usable tap targets (FR-007).

## Phase 1: Motion foundation + reduced-motion

### Overview

Stand up the motion primitives this pass will reuse — without yet redesigning chrome or page composition — and gate all animation behind `prefers-reduced-motion`.

### Changes Required:

#### 1. Reduced-motion + motion utilities

**File**: `src/styles/global.css`

**Intent**: Keep Broad `:root` tokens; add a global reduced-motion media query and any small utility hooks needed for entrance/reveal classes built on the already-imported `tw-animate-css`.

**Contract**: Broad palette/font tokens remain the lock source. New CSS only for motion safety and optional reveal helpers — no second design-lock artifact.

#### 2. Scroll-reveal helper

**File**: `src/components/hooks/` or a tiny site helper island (new)

**Intent**: Provide a minimal IntersectionObserver-based reveal that toggles enter animation classes on selected sections; no-ops when reduced motion is preferred.

**Contract**: Reusable from Astro pages/sections via a small client island or attribute convention; must not require new animation libraries.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- Grep confirms a `prefers-reduced-motion` rule exists under `src/`

#### Manual Verification:

- With reduced motion enabled in the OS/browser, sample pages do not run entrance/scroll animations
- With motion allowed, a throwaway/test application of an enter class still builds and renders

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Chrome rebuild (nav UI, same IA)

### Overview

Rebuild header, mobile/desktop nav presentation, and footer look-and-feel for youth energy while consuming unchanged `site-nav.ts` data.

### Changes Required:

#### 1. Header chrome

**File**: `src/components/site/SiteHeader.astro`

**Intent**: Strengthen brand presence and youth-forward header styling (sticky behavior, density, contrast) without changing brand href/name source.

**Contract**: Continues to mount `SiteNav` with `currentPath`; still reads brand fields from `site-nav.ts`.

#### 2. Nav presentation rebuild

**File**: `src/components/site/SiteNav.tsx`

**Intent**: Redesign desktop nav and mobile full-panel/sheet UI (animation on open, clearer hierarchy for dropdown children, stronger CTAs) while mapping the same `primaryNav` / phone / `zapisyCta` exports.

**Contract**: No changes to imported IA arrays’ order, labels, or hrefs. Active-state matching behavior preserved. Mobile: enhanced sheet/panel — not a bottom-tab bar.

#### 3. Footer presentation

**File**: `src/components/site/SiteFooter.astro`

**Intent**: Restyle footer mapa and contact strip to match the youth chrome while iterating `footerLinks` as-is.

**Contract**: Same destinations and labels as today’s `footerLinks`.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- `git diff -- src/lib/site-nav.ts` is empty (no IA file changes)

#### Manual Verification:

- At 375px: primary nav reachable/usable; all Oferta and Strefa children reachable via the sheet
- Desktop: nav + CTAs readable; dropdowns work
- Spot-check: every primary label/href matches pre-change IA

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Hero + section composition (filled pages)

### Overview

Apply youth composition across the section kit and filled routes (home, top-level, deep path), including a leaner first viewport and wired motion reveals.

### Changes Required:

#### 1. Hero composition

**File**: `src/components/sections/Hero.astro` (+ call sites such as `src/pages/index.astro`)

**Intent**: Keep full-bleed hero as the dominant first-viewport plane; tighten first-viewport content (title + short support); move pitch lists / dense strips out of the hero when they crowd the fold.

**Contract**: Existing props remain usable by all Hero consumers; no invented subtitle/pitch copy — only rearrange/reuse existing props/content.

#### 2. Section kit restyle

**Files**: `src/components/sections/DashboardStrip.astro`, `CtaBand.astro`, `ProseSection.astro`, `HubChildLinks.astro`, `MediaFigure.astro`, `PriceTable.astro` (as needed)

**Intent**: Unify vertical rhythm, type scale, and band treatments for a more dynamic youth read while staying on Broad tokens.

**Contract**: Section public props stay compatible with current page call sites; prefer class/structure changes over API churn.

#### 3. Page wiring + reveals

**Files**: filled routes under `src/pages/` for home, top-level hubs, and deep path (e.g. `kursy`, `prawo-jazdy-automat`, `kontakt`, `zapisy-na-kurs`, `referencje`, and other filled top-level pages)

**Intent**: Apply the new section composition and attach 2–3 motion moments (hero entrance + selective section reveals + optional nav already covered in Phase 2).

**Contract**: Routes and URLs unchanged; Markdown/content bodies not rewritten for tone.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Homepage first viewport reads as one youth-oriented composition (brand + headline + short support + dominant image)
- Top-level filled pages and deep path share the same layout system
- Two–three motions present; reduced-motion still respected
- No new invented claims visible in restyled sections

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 4: StubPage + forms youth polish

### Overview

Bring stub routes and form shells onto the same youth visual system without changing stub placeholder copy or form disabled-submit behavior.

### Changes Required:

#### 1. StubPage shell

**File**: `src/components/site/StubPage.astro`

**Intent**: Restyle title-only / placeholder presentation so the 14 stub routes feel on-brand under the new chrome.

**Contract**: Keep “Treść w przygotowaniu” (or existing placeholder wording); do not invent body copy per stub.

#### 2. Form visual system

**Files**: `src/components/forms/fieldClasses.ts`, `ContactForm.astro`, `EnrollmentForm.astro`, `OpinionForm.astro`, `EnrollmentStrip.astro`, `DemoFormNotice.astro`

**Intent**: Youth-polish shared field/shell classes and wrappers so forms match the new layout; preserve disabled submit and demo-only messaging from S-05.

**Contract**: No enablement of real submit/network send; `DemoFormNotice` remains honest about demo mode.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes

#### Manual Verification:

- Spot-check ≥3 stub routes: youth shell, placeholder intact, no invented body
- Kontakt / Zapisy / Referencje / home EnrollmentStrip: forms look on-system; submit still clearly disabled / non-sending

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 5: Responsive bar + owner checklist + public URL

### Overview

Close FR-010 with the agreed success checklist: responsive bar, IA freeze proof, motion/a11y spot-check, and re-verify the existing public review URL.

### Changes Required:

#### 1. Polish pass on regressions

**Files**: any touched chrome/section/form files from Phases 2–4

**Intent**: Fix 375px overflow, nav usability, or desktop consistency issues found in checklist without expanding scope into new features.

**Contract**: Still no `site-nav.ts` IA edits; still no new copywriting.

#### 2. Checklist artifact (optional but recommended)

**File**: `context/changes/youth-dynamic-layout/owner-checklist.md` (new)

**Intent**: Record the visual + IA + viewport + public-URL checks used for owner review so market-feedback is repeatable.

**Contract**: Short checklist aligned with planning decision 6A — not a second style lock.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- Confirm `src/lib/site-nav.ts` still unchanged vs branch base

#### Manual Verification:

- 375px and desktop pass on home + ≥2 top-level + deep path + ≥1 stub
- Owner-facing checklist complete (or equivalent notes in change Notes)
- Public review URL loads the youth layout (redeploy if the environment requires it for the URL to update)

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before calling the change done.

---

## Testing Strategy

### Unit Tests:

- None required (repo has no test runner for UI). Rely on lint/build + manual checks.

### Integration Tests:

- None automated. Treat `npm run build` as the integration gate for Astro/Cloudflare output.

### Manual Testing Steps:

1. Diff `site-nav.ts` — zero IA changes.
2. Walk primary nav on mobile sheet and desktop — all labels/destinations match pre-change.
3. Homepage first viewport: youth composition; pitches/enrollment not crowding the hero fold.
4. Toggle OS reduced-motion — animations stop.
5. Open stub + form pages — youth shell; stub text unchanged; submit disabled.
6. Open public review URL after deploy/sync — owner can review.

## Performance Considerations

Prefer CSS/`tw-animate-css` and one small observer island over new animation libraries. Avoid animating large image layers continuously; keep reveals short and few (2–3 purposeful moments).

## Migration Notes

No data migration. If the public URL is behind CI-only deploy, Phase 5 must include whatever publish step the repo already uses for S-03 so the owner sees the new layout.

## References

- Roadmap S-06: `context/foundation/roadmap.md`
- PRD FR-010 / US-01: `context/foundation/prd.md`
- Locked Broad: `context/archive/2026-08-09-nav-structure-stubs/locked-direction.md`
- Young-drivers cues (composition only): `context/archive/2026-08-09-visual-style-lock/direction-young-drivers.md`
- Prior UI plan pattern: `context/archive/2026-08-09-top-level-authentic-content/plan.md`
- IA module: `src/lib/site-nav.ts`
- Chrome: `src/components/site/SiteNav.tsx`, `SiteHeader.astro`, `SiteFooter.astro`
- Tokens: `src/styles/global.css`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Motion foundation + reduced-motion

#### Automated

- [x] 1.1 `npm run lint` passes
- [x] 1.2 `npm run build` passes
- [x] 1.3 Grep confirms a `prefers-reduced-motion` rule exists under `src/`

#### Manual

- [ ] 1.4 With reduced motion enabled in the OS/browser, sample pages do not run entrance/scroll animations
- [ ] 1.5 With motion allowed, a throwaway/test application of an enter class still builds and renders

### Phase 2: Chrome rebuild (nav UI, same IA)

#### Automated

- [ ] 2.1 `npm run lint` passes
- [ ] 2.2 `npm run build` passes
- [ ] 2.3 `git diff -- src/lib/site-nav.ts` is empty (no IA file changes)

#### Manual

- [ ] 2.4 At 375px: primary nav reachable/usable; all Oferta and Strefa children reachable via the sheet
- [ ] 2.5 Desktop: nav + CTAs readable; dropdowns work
- [ ] 2.6 Spot-check: every primary label/href matches pre-change IA

### Phase 3: Hero + section composition (filled pages)

#### Automated

- [ ] 3.1 `npm run lint` passes
- [ ] 3.2 `npm run build` passes

#### Manual

- [ ] 3.3 Homepage first viewport reads as one youth-oriented composition (brand + headline + short support + dominant image)
- [ ] 3.4 Top-level filled pages and deep path share the same layout system
- [ ] 3.5 Two–three motions present; reduced-motion still respected
- [ ] 3.6 No new invented claims visible in restyled sections

### Phase 4: StubPage + forms youth polish

#### Automated

- [ ] 4.1 `npm run lint` passes
- [ ] 4.2 `npm run build` passes

#### Manual

- [ ] 4.3 Spot-check ≥3 stub routes: youth shell, placeholder intact, no invented body
- [ ] 4.4 Kontakt / Zapisy / Referencje / home EnrollmentStrip: forms look on-system; submit still clearly disabled / non-sending

### Phase 5: Responsive bar + owner checklist + public URL

#### Automated

- [ ] 5.1 `npm run lint` passes
- [ ] 5.2 `npm run build` passes
- [ ] 5.3 Confirm `src/lib/site-nav.ts` still unchanged vs branch base

#### Manual

- [ ] 5.4 375px and desktop pass on home + ≥2 top-level + deep path + ≥1 stub
- [ ] 5.5 Owner-facing checklist complete (or equivalent notes in change Notes)
- [ ] 5.6 Public review URL loads the youth layout (redeploy if the environment requires it for the URL to update)
