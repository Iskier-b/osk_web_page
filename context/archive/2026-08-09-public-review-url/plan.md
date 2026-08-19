# Public review URL Implementation Plan

## Overview

Publish the modernized OSK Juszczak site to Cloudflare Workers so the owner can review authentic top-level content at a free public URL (FR-009 / S-03). Soft-hide starter auth from public chrome, deploy manually with Wrangler (no Supabase secrets), and verify top-level routes on phone-width and desktop.

## Current State Analysis

- S-02 is done: top-level marketing pages carry source-faithful content and are prerendered.
- Deploy scaffolding exists: `@astrojs/cloudflare` + `wrangler.jsonc` (Workers + Static Assets) + README `npx wrangler deploy`.
- CI (`.github/workflows/ci.yml`) only lint + build — no auto-deploy (accepted for this slice).
- Worker is still named `10x-astro-starter`; no live review URL is recorded in-repo.
- Foundation docs say “Cloudflare Pages” / “static hosting”; Astro 6 adapter **removed Pages support** — supported path is Workers (`*.workers.dev`).
- Public chrome exposes one auth entry: footer “Demo / konto” → `/auth/signin` via `demoKontoHref`. Header/nav do not link auth. Unused `Topbar` / `Welcome` still mention auth but are not used by current layout.

## Desired End State

The owner (or developer on their behalf) can open a stable public `*.workers.dev` URL, walk all S-02 top-level routes on ~375px and desktop, see no auth link in site chrome, and recognize OSK content without needing local preview. The URL is recorded in this change’s Notes for handoff.

### Key Discoveries:

- `wrangler.jsonc` already uses Workers Assets (`main` + `assets.directory: "./dist"`) — correct for Astro 6; do not switch to `pages_build_output_dir`.
- Soft-hide target is footer-only: `src/lib/site-nav.ts` (`demoKontoHref` / `demoKontoLabel`) + `src/components/site/SiteFooter.astro`.
- `SUPABASE_*` are optional in `astro.config.mjs`; `createClient` returns `null` without secrets — brochure deploy does not need them.
- Routes without `prerender = true` still SSR via the Worker; stubs remain reachable after publish.

## What We're NOT Doing

- Migrating to Cloudflare Pages or pure static export
- Auto-deploy on merge / GitHub Actions deploy pipeline
- Custom domain / DNS
- Setting Supabase (or other) Cloudflare secrets for this review deploy
- Removing auth routes, middleware, or API handlers (soft-hide only)
- Filling deep paths (S-04), forms (S-05), or inventing content
- Rewriting `tech-stack.md` deployment_target beyond a brief README/plan note that Workers is the live path

## Implementation Approach

Prepare a clean public surface (rename Worker, drop footer auth link, align deploy docs), then one manual Wrangler publish without secrets, then a structured top-level smoke walkthrough and record the URL. Prefer smallest code deltas; treat Cloudflare login/account as a human prerequisite for Phase 2.

## Phase 1: Prepare publish surface

### Overview

Make the Worker identity OSK-branded, remove the only public auth chrome link, and document the Workers manual deploy path clearly.

### Changes Required:

#### 1. Worker / package name

**File**: `wrangler.jsonc`

**Intent**: Replace starter Worker name so the public `*.workers.dev` subdomain is recognizable for OSK review.

**Contract**: Set `"name"` to `osk-juszczak` (kebab-case Cloudflare Worker name). Optionally align `package.json` `"name"` to the same slug for consistency (npm package name only; not required for deploy).

#### 2. Soft-hide auth chrome

**File**: `src/components/site/SiteFooter.astro`

**Intent**: Remove the footer “Demo / konto” link so the owner walkthrough never offers starter auth.

**Contract**: Delete the `<a href={demoKontoHref}>…</a>` block and unused `demoKontoHref` / `demoKontoLabel` imports. Leave copyright row intact. Do not add robots rules or middleware redirects in this phase.

**File**: `src/lib/site-nav.ts`

**Intent**: Stop exporting unused demo-auth nav constants once the footer no longer consumes them.

**Contract**: Remove `demoKontoHref` and `demoKontoLabel` exports (or leave unused only if something else still imports them — after footer change, nothing in live chrome should). Do not touch primary nav / footer sitemap links.

#### 3. Deploy docs

**File**: `README.md` (Deployment + CI sections)

**Intent**: Document the actual publish path for this MVP review URL so a future agent/human does not attempt unsupported Pages deploy.

**Contract**: Keep Cloudflare Workers + `npm run build` → `npx wrangler deploy`. Explicitly note: Astro 6 adapter targets Workers (not Pages); Supabase secrets are optional for the public brochure review; after deploy, share the printed `*.workers.dev` URL. Do not add a CI deploy job.

### Success Criteria:

#### Automated Verification:

- `npm run lint` passes
- `npm run build` passes
- Grep confirms no `demoKontoHref` / “Demo / konto” in `src/components/site/` or live layout chrome
- `wrangler.jsonc` `"name"` is `osk-juszczak`

#### Manual Verification:

- Local preview (`npm run preview` or `npm run build && npx wrangler dev`) shows footer without Demo/konto link
- Header primary nav unchanged

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Manual first publish

### Overview

Authenticate to Cloudflare, build, deploy once, and capture the public Worker URL without configuring Supabase secrets.

### Changes Required:

#### 1. Cloudflare account gate (human)

**File**: n/a (operator action)

**Intent**: Ensure Wrangler can publish under an account that can host a free `*.workers.dev` URL.

**Contract**: Human runs `npx wrangler login` (or equivalent) before deploy. Plan cannot automate account creation.

#### 2. Deploy

**File**: n/a (CLI)

**Intent**: Publish the current `master` (or working tree agreed for review) build to Cloudflare Workers.

**Contract**: Sequence: `npm ci` (if needed) → `npm run build` → `npx wrangler deploy`. Do **not** run `wrangler secret put` for `SUPABASE_*`. Do **not** use `wrangler pages deploy`.

#### 3. Record URL

**File**: `context/changes/public-review-url/change.md`

**Intent**: Persist the public review URL for owner handoff and later slices.

**Contract**: Append under `## Notes` a line like `Public review URL: https://osk-juszczak.<subdomain>.workers.dev` (exact host from Wrangler output). Update `updated:` date.

### Success Criteria:

#### Automated Verification:

- Local `npm run build` succeeds immediately before deploy (same tree that is published)

#### Manual Verification:

- `npx wrangler deploy` completes without error
- Returned `*.workers.dev` URL loads over HTTPS in a normal browser
- Homepage renders recognizable OSK branding/content (not Wrangler error page)
- No Supabase secrets were set for this Worker
- URL recorded in `change.md` Notes

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Owner-ready verification

### Overview

Prove the public URL is ready for market-feedback: top-level S-02 routes work on phone-width and desktop, auth stays out of chrome, then mark the slice ready to share.

### Changes Required:

#### 1. Top-level walkthrough checklist

**File**: n/a (manual on public URL) — optionally tick Progress Manual items only

**Intent**: Verify owner-facing routes at the live URL match the S-02 deliverable surface.

**Contract**: On the recorded public URL, open at ~375px width and at desktop width:

- `/` (home)
- `/nasza-auto-szkola`
- `/kursy`
- `/cennik`
- `/porady-dla-kursanta`
- `/galeria`
- `/artykuly`
  Spot-check that primary nav is usable and there is no horizontal scroll on filled top-level pages at 375px. Stubs linked from nav may remain title-only; they must not 500.
  Confirm footer/header have no Demo/konto or other auth entry points.

#### 2. Handoff note

**File**: `context/changes/public-review-url/change.md`

**Intent**: Make the Notes section sufficient for sharing with the owner.

**Contract**: Notes include the public URL plus a one-line “verified top-level walkthrough YYYY-MM-DD” stamp after Phase 3 passes.

### Success Criteria:

#### Automated Verification:

- None beyond ensuring `change.md` still contains the URL (file presence / non-empty Notes URL line)

#### Manual Verification:

- All seven top-level routes above load on phone-width (~375px) and desktop on the public URL
- No horizontal scroll on those top-level pages at 375px; primary nav reachable
- No auth link in header/footer chrome
- Developer is ready to send the URL to the owner for review

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful. S-03 is complete when Progress Manual items for Phase 3 are checked.

---

## Testing Strategy

### Unit Tests:

- None — repo has no test runner; do not invent a suite for this slice.

### Integration Tests:

- None automated for deploy. Rely on `npm run lint` / `npm run build` and live URL smoke.

### Manual Testing Steps:

1. After Phase 1: local preview — footer has no Demo/konto; nav unchanged.
2. After Phase 2: open Wrangler-printed URL — homepage OK over HTTPS.
3. After Phase 3: walk seven top-level routes at 375px and desktop; confirm no auth chrome; share URL.

## Performance Considerations

Cold starts on SSR stub routes are acceptable for a demo. No caching/CDN tuning in this slice. Prefer not expanding prerender scope here unless a live stub 500s (then fix that route only).

## Migration Notes

- First deploy may create Worker `osk-juszczak` under the logged-in Cloudflare account.
- Renaming from `10x-astro-starter` means any prior accidental deploy under the old name is abandoned — not migrated.
- Foundation `tech-stack.md` still says `cloudflare-pages`; live path is Workers. Do not block S-03 on rewriting foundation files; README carries the operator truth.

## References

- Roadmap: `context/foundation/roadmap.md` (S-03)
- PRD: `context/foundation/prd.md` (FR-009)
- Tech stack intent: `context/foundation/tech-stack.md` (Pages wording; superseded in practice by Astro 6 Workers adapter)
- Deploy docs: `README.md` Deployment section
- Soft-hide sources: `src/lib/site-nav.ts`, `src/components/site/SiteFooter.astro`
- Prior content slice: `context/archive/2026-08-09-top-level-authentic-content/`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Prepare publish surface

#### Automated

- [x] 1.1 `npm run lint` passes — 11d6da2
- [x] 1.2 `npm run build` passes — 11d6da2
- [x] 1.3 Grep confirms no `demoKontoHref` / “Demo / konto” in `src/components/site/` or live layout chrome — 11d6da2
- [x] 1.4 `wrangler.jsonc` `"name"` is `osk-juszczak` — 11d6da2

#### Manual

- [ ] 1.5 Local preview shows footer without Demo/konto link
- [ ] 1.6 Header primary nav unchanged

### Phase 2: Manual first publish

#### Automated

- [x] 2.1 Local `npm run build` succeeds immediately before deploy — 6855e27

#### Manual

- [ ] 2.2 `npx wrangler deploy` completes without error
- [ ] 2.3 Returned `*.workers.dev` URL loads over HTTPS in a normal browser
- [ ] 2.4 Homepage renders recognizable OSK branding/content
- [ ] 2.5 No Supabase secrets were set for this Worker
- [ ] 2.6 URL recorded in `change.md` Notes

### Phase 3: Owner-ready verification

#### Automated

- [x] 3.1 `change.md` Notes contain the public review URL — 4e1fb7c

#### Manual

- [ ] 3.2 All seven top-level routes load on phone-width (~375px) and desktop
- [ ] 3.3 No horizontal scroll on those top-level pages at 375px; primary nav reachable
- [ ] 3.4 No auth link in header/footer chrome
- [ ] 3.5 Developer ready to send the URL to the owner for review
