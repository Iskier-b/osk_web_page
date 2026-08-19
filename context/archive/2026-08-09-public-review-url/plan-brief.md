# Public review URL — Plan Brief

> Full plan: `context/changes/public-review-url/plan.md`

## What & Why

Give the OSK owner a free public URL to review the modernized site with authentic top-level content (FR-009 / S-03) — not only local preview. This is the market-feedback publish step after S-02.

## Starting Point

S-02 content is done. Wrangler + `@astrojs/cloudflare` are wired for **Workers + Static Assets**, but the Worker is still named `10x-astro-starter`, CI does not deploy, and the footer still links “Demo / konto” to starter auth. Astro 6 removed Cloudflare Pages support from the adapter.

## Desired End State

A branded `*.workers.dev` URL loads the brochure site; top-level S-02 routes work on phone and desktop; auth is absent from public chrome; the URL is recorded and ready to share with the owner. No Supabase secrets required.

## Key Decisions Made

| Decision      | Choice                                         | Why (1 sentence)                                                                |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------- |
| Deploy method | Manual Wrangler only                           | Hits FR-009 without building auto-deploy pipeline                               |
| Hosting       | Cloudflare Workers `*.workers.dev` (not Pages) | Astro 6 adapter dropped Pages; current `wrangler.jsonc` already matches Workers |
| Auth surface  | Soft-hide footer Demo/konto only               | Clean owner walkthrough without removing starter auth code                      |
| Secrets       | No Supabase on the Worker                      | MVP is public brochure; auth env is unused noise                                |
| Done bar      | Top-level walkthrough on live URL              | Matches market-feedback intent beyond homepage-only smoke                       |

## Scope

**In scope:**

- Rename Worker to `osk-juszczak`
- Remove footer auth link + unused nav constants
- README deploy truth (Workers, optional secrets)
- One manual `wrangler deploy` + record URL
- Phone + desktop top-level verification

**Out of scope:**

- Pages migration / static export / custom domain
- Auto-deploy CI
- Removing auth routes; setting Supabase secrets
- S-04 deep path, S-05 forms, content inventing

## Architecture / Approach

Keep existing Astro SSR → Cloudflare Workers Assets pipeline. Soft-hide one footer entry point. Human `wrangler login` + `build` + `deploy`; verify seven top-level routes on the printed URL; stamp Notes in `change.md`.

## Phases at a Glance

| Phase                       | What it delivers                  | Key risk                                               |
| --------------------------- | --------------------------------- | ------------------------------------------------------ |
| 1. Prepare publish surface  | Rename + soft-hide + docs         | Missed auth link elsewhere in chrome                   |
| 2. Manual first publish     | Live `*.workers.dev` URL recorded | Cloudflare account / Wrangler auth gate                |
| 3. Owner-ready verification | Top-level phone+desktop sign-off  | SSR stub 500s or mobile layout regression on live host |

**Prerequisites:** S-02 done; Cloudflare account the developer can log into with Wrangler  
**Estimated effort:** ~1 session across 3 phases (Phase 2 blocked on human login)

## Open Risks & Assumptions

- `tech-stack.md` still says Pages — live path is Workers; README is the operator source of truth for this slice
- First deploy creates a new Worker name; any old `10x-astro-starter` deploy is orphaned
- Auth URLs remain typeable; soft-hide is chrome-only by design

## Success Criteria (Summary)

- Public `*.workers.dev` URL loads OSK top-level content without local preview
- No auth entry in header/footer; no Supabase secrets required
- Seven top-level routes verified at ~375px and desktop; URL recorded for owner share
