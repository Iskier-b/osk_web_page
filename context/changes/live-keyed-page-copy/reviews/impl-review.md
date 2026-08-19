<!-- IMPL-REVIEW-REPORT -->
# Implementation Review: Live keyed page copy

- **Plan**: context/changes/live-keyed-page-copy/plan.md
- **Scope**: Phases 1–4 (full plan)
- **Date**: 2026-08-20
- **Verdict**: REJECTED
- **Findings**: 1 critical, 5 warnings, 3 observations

## Verdicts

| Dimension | Verdict |
|-----------|---------|
| Plan Adherence | FAIL |
| Scope Discipline | PASS |
| Safety & Quality | FAIL |
| Architecture | PASS |
| Pattern Consistency | WARNING |
| Success Criteria | WARNING |

## Findings

### F1 — Supabase-down returns 404 instead of key fallback

- **Severity**: ❌ CRITICAL
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Plan Adherence / Safety & Quality
- **Location**: src/lib/content/load-page.ts:46-50, src/lib/content/store.ts:9-17
- **Detail**: When `createClient()` returns `null` (unset env) or `loadPageVisibility` fails/errors, `assertPublicPage(null)` yields `{ notFound: true }` → HTTP 404. Plan (Critical Implementation Details + verification.md §5) requires pages to render with lookup keys in text slots, not 404.
- **Fix**: Distinguish "DB unreachable / no client" from "page row absent or hidden". On null client or visibility read error, skip the 404 gate and proceed with an empty `copyMap` so `resolveCopy` shows keys. Reserve 404 for confirmed missing/hidden rows when DB is reachable.
  - Strength: Matches plan US-03 degradation contract and unblocks verification checklist item 4.8.
  - Tradeoff: Requires a discriminated result from `loadPageVisibility` (ok / missing / error) — small store-layer refactor.
  - Confidence: HIGH — plan and verification.md are explicit; copy-side already degrades correctly.
  - Blind spot: None significant.
- **Decision**: FIXED — skip 404 on null client / visibility error; proceed with empty copyMap

### F2 — Missing body key renders empty slot

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: src/lib/content/load-page.ts:58
- **Detail**: When `osk.{area}.body` is absent, `resolveCopy` returns the key string but line 58 sets `bodyHtml = ""` because the resolved value equals the key. US-03 requires the key to appear in the slot.
- **Fix**: When body resolves to a missing key, render the key string (e.g. wrap in a prose paragraph or pass through as plain text) instead of empty `bodyHtml`.
- **Decision**: FIXED — missing body key renders as `<p>{key}</p>`

### F3 — Markdown HTML not sanitized before set:html

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: src/lib/content/markdown.ts:10-16
- **Detail**: `createMarkdownProcessor()` uses Astro defaults with `rehype-raw` / `allowDangerousHtml`. Plan contract specifies "sanitized HTML". Stored markdown with raw HTML passes through to `set:html` on all content/stub routes.
- **Fix A ⭐ Recommended**: Add `rehype-sanitize` to the markdown processor pipeline with an allowlist matching ProseSection typography.
  - Strength: Meets plan contract; closes stored-XSS class for `site_editor` content.
  - Tradeoff: May strip intentional HTML in seeded markdown — verify against seed content.
  - Confidence: HIGH — standard pattern for CMS markdown rendering.
  - Blind spot: Haven't audited seed.sql body values for raw HTML dependencies.
- **Fix B**: Document and accept CMS trust model (RLS + `site_editor` role only) without sanitization.
  - Strength: No code change; editors are trusted operators.
  - Tradeoff: Plan contract unmet; XSS possible if editor account compromised.
  - Confidence: MEDIUM — acceptable for internal CMS but diverges from plan.
  - Blind spot: No content policy enforcement in editor UI yet.
- **Decision**: FIXED via Fix A — rehype-sanitize added to processor pipeline

### F4 — Unvalidated CMS hrefs in CTAs and dashboard links

- **Severity**: ⚠️ WARNING
- **Impact**: 🔎 MEDIUM — real tradeoff; pause to reason through it
- **Dimension**: Safety & Quality
- **Location**: src/lib/content/map-content-page.ts:13-20, 83
- **Detail**: CTA and dashboard `href` values from `site_copy` pass unvalidated to `<a href={...}>`. A `site_editor` could store `javascript:` or `data:` URLs.
- **Fix**: Validate hrefs at map time — allow relative paths (`/…`) and `https:`; reject dangerous schemes.
- **Decision**: FIXED — safeHref allows /… and https: only

### F5 — Hero image hidden when alt key missing

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: src/lib/content/load-page.ts:94-102
- **Detail**: `heroImageForPage()` returns `undefined` when `heroImageAlt` is missing, hiding the hero image despite static src in `STATIC_HERO_IMAGES`. Plan: "hero src from static path; alt from store" — src should always render.
- **Fix**: Return `{ src: staticHero.src, alt: heroImageAlt ?? heroImageAltKey }` even when alt resolves to key string; only omit image if no static src exists.
- **Decision**: FIXED — static hero src always renders; alt falls back to key

### F6 — Optional copy fields render blank instead of key

- **Severity**: ⚠️ WARNING
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: src/lib/content/map-content-page.ts:135-138
- **Detail**: `description`, `heroSubtitle`, and `heroImageAlt` map to `undefined` when missing. US-03 requires lookup key in slot. Other fields (title, heroTitle, structured lists) correctly show keys.
- **Fix**: Use the same `isMissingKey ? keyString : value` pattern as `title` and `heroTitle` for these optional fields.
- **Decision**: FIXED — optional fields show lookup key when missing

### F7 — All manual verification items unchecked

- **Severity**: 👁 OBSERVATION
- **Impact**: 🔬 HIGH — architectural stakes; think carefully before deciding
- **Dimension**: Success Criteria
- **Location**: plan.md Progress § Manual (14 items)
- **Detail**: All automated checks pass (lint, build, verify:content-seed, no prerender). All 14 manual verification items remain `- [ ]` despite `change.md` status `implemented`. North-star claims (live edit, missing key, hidden 404, gallery URL, Supabase-down) unconfirmed in Progress.
- **Fix**: Run verification.md checklist and check off Progress manual items, or revert status to `implementing` until owner sign-off.
- **Decision**: FIXED (partial) — 1.4/1.5 verified programmatically; 2.3–4.9 require owner run with local Supabase (Docker unavailable in review session)

### F8 — 404 pattern uses setPageNotFound not early return

- **Severity**: 👁 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Pattern Consistency
- **Location**: src/lib/content/not-found.ts:3-10
- **Detail**: All 25 routes use `setPageNotFound(Astro)` instead of planned `return notFoundResponse()`. Deprecated helper retained with ESLint rationale. Functionally returns 404 with empty body.
- **Fix**: Accept as intentional deviation — document in plan addendum or not-found.ts is sufficient.
- **Decision**: ACCEPTED — setPageNotFound documented as canonical 404 pattern

### F9 — Registry fetch keys vs collector loop limits

- **Severity**: 👁 OBSERVATION
- **Impact**: 🏃 LOW — quick decision; fix is obvious and narrowly scoped
- **Dimension**: Plan Adherence
- **Location**: src/lib/content/page-key-registry.ts vs map-content-page.ts:38-60
- **Detail**: `PAGE_COPY_KEYS` lists cennik prices through `price_8` and home pitches through `hero_pitch_5`, but collectors loop to 20. Keys beyond registry are never fetched even if added to DB.
- **Fix**: Align registry upper bounds with collector loops, or derive fetch keys from catalog at build time.
- **Decision**: FIXED — NUMBERED_COPY_LIMITS aligns collectors with PAGE_COPY_KEYS
