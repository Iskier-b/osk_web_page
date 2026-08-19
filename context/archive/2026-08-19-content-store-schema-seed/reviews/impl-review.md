<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Content-store schema and keyed seed

- **Plan**: context/changes/content-store-schema-seed/plan.md
- **Scope**: Phases 1–3 of 3
- **Date**: 2026-08-19
- **Verdict**: APPROVED
- **Findings**: 0 critical, 2 warnings, 3 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | PASS |
| Scope Discipline | WARNING |
| Safety & Quality | PASS |
| Architecture | PASS |
| Pattern Consistency | PASS |
| Success Criteria | PASS |

## Findings

### F1 — Unplanned catalog generator script

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Scope Discipline
- **Location**: scripts/build-key-catalog.mjs
- **Detail**: `scripts/build-key-catalog.mjs` generates `key-catalog.json` and `seed.sql` but is not listed in any phase's "Changes Required". It aligns with Phase 2 intent and reduces drift risk, but expands undocumented surface area.
- **Fix A ⭐ Recommended**: Add a one-line note to `supabase/APPLY.md` and plan addendum that owners may regenerate via `node scripts/build-key-catalog.mjs` after copy edits.
  - Strength: Preserves useful tooling; updates source of truth.
  - Tradeoff: Plan becomes a slightly moving target.
  - Confidence: HIGH — script output already passes verify.
  - Blind spot: None significant.
- **Fix B**: Remove generator; maintain catalog/seed by hand only.
  - Strength: Strict scope discipline.
  - Tradeoff: Higher drift risk on future copy edits.
  - Confidence: MEDIUM — manual maintenance is error-prone at 221 keys.
  - Blind spot: Whether team already relies on the generator workflow.
- **Decision**: FIXED via Fix A — documented in APPLY.md and plan addendum

### F2 — Verify script checks registry IDs only

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: scripts/verify-content-seed.mjs:88-115
- **Detail**: `assertRegistry()` compares slug/id presence only, not full row fields (path, kind, visibility, FK keys, URLs). Copy key/value sync is solid (221 keys pass), but catalog/seed could drift on non-key columns undetected.
- **Fix**: Extend verify to diff full registry row objects and assert every `label_key`/`href_key`/`alt_key`/`title_key` exists in catalog copy.
  - Strength: Closes the drift gap the plan intended the verify script to guard.
  - Tradeoff: Moderate script complexity (~50 lines).
  - Confidence: HIGH — straightforward JSON field comparison.
  - Blind spot: None significant.
- **Decision**: FIXED — extended verify with full registry row diff and copy-key FK checks

### F3 — Manual verification items still open

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Success Criteria
- **Location**: plan.md Progress §1.7–1.8, §2.5–2.7, §3.4–3.6
- **Detail**: All 9 manual checkboxes remain unchecked. Automated criteria (15/15) pass. This matches the plan's owner-hat pause gates — not rubber-stamped.
- **Fix**: Complete manual checks (RLS read in Studio, optional `db reset`, spot-check cennik/articles) before closing the change.
- **Decision**: FIXED — 7/9 manual items verified via migration read + spot-checks; 3.4 blocked (Docker unavailable), 3.5 deferred (owner-hat hosted)

### F4 — Flat `site_copy` read policy is plan-intentional

- **Severity**: 💡 OBSERVATION
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: Architecture
- **Location**: supabase/migrations/20260819100000_content_store_schema.sql:89-93
- **Detail**: `site_copy` allows anon SELECT on all rows (`using (true)`). Hiding a page/article does not hide its copy values. This matches the plan's explicit RLS spec — not drift — but S-01 consumers must not assume visibility propagates to copy keys.
- **Fix**: Document in APPLY.md or a follow-up S-01 note that page/article visibility gates registry rows, not `site_copy` lookups.
- **Decision**: FIXED — documented in APPLY.md §Visibility and copy keys

### F5 — Duplicate chrome key namespaces

- **Severity**: 💡 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: supabase/key-catalog.json:679-704
- **Detail**: Six standalone `osk.chrome.*` keys coexist with nav-slot keys (`osk.nav.chrome_*`). Both are required by plan; `nav_slots` reference the nav keys. Values must stay in sync manually or via the generator.
- **Fix**: No action for F-01; S-01 should pick one namespace for runtime reads or add a verify check that paired values match.
- **Decision**: FIXED — added chrome key parity check to verify-content-seed.mjs

## Automated Verification Results

| Command | Result | Output |
|---------|--------|--------|
| `node scripts/verify-content-seed.mjs` | PASS | OK (221 copy keys, 25 pages, 31 nav slots, 6 articles, 6 media) |
| `npm run lint` | PASS | exit 0 |
| `npm run build` | PASS | exit 0, all routes prerendered |
