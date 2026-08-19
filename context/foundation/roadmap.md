---
project: "OSK Juszczak — prosty CMS (live edit)"
version: 1
status: draft
created: 2026-08-19
updated: 2026-08-20
prd_version: 2
main_goal: quality
top_blocker: none
---

# Roadmap: OSK Juszczak — prosty CMS (live edit)

> Derived from `context/foundation/prd-v2.md` (v2) + auto-researched codebase baseline.
> Edit-in-place; archive when superseded.
> Slices below are listed in dependency order. The "At a glance" table is the index.
> Previous redesign roadmap: `context/foundation/archive/2026-08-19-roadmap.md`.

## Vision recap

After the owner approved the redesign direction, a new requirement landed: they must be able to change links, page copy, and blog articles without a developer deploy. Today's Markdown pages and hardcoded navigation cannot do that. This change does not ship a CMS form panel — it connects the public site to a content store so a stored-text change is visible on the next request, and missing copy shows a lookup key the owner can find and fill.

## North star

**S-01: user can read public page copy from the content store without a rebuild, and see the lookup key when a value is missing** — chosen under `quality` so the first proof is the live-copy claim plus the missing-key fallback, not a later blog surface.

> Here, **north star** means the smallest end-to-end slice whose successful delivery would prove the main product claim — stored copy appears on the public site without a rebuild, and missing copy never lies — placed as early as Prerequisites allow because later slices only matter if this works.

## At a glance

| ID   | Change ID                 | Outcome (user can …)                                                                                                                                                          | Prerequisites | PRD refs            | Status   |
| ---- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ------------------- | -------- |
| F-01 | content-store-schema-seed | (foundation) schema and keyed seed scripts exist for every current page slot, nav item, and article field                                                                     | —             | US-01, US-02, US-03 | done     |
| S-01 | live-keyed-page-copy      | user can read public page copy and gallery images from the content store; a stored-text change appears on the next request without rebuild; missing text shows the lookup key | F-01          | US-01, US-03        | proposed |
| S-02 | live-nav-from-store       | user can browse primary nav, dropdowns, footer, phone, and CTA whose labels and destinations come from the content store                                                      | F-01, S-01    | US-01               | proposed |
| S-03 | live-blog-visibility      | user can read the blog list with pinned articles first and open a full article; hidden articles are omitted; article images come from the content store                       | F-01, S-01    | US-02               | proposed |

## Baseline

What's already in place in the codebase as of `2026-08-19` (auto-researched + user-confirmed).
Foundations below assume these are present and do NOT re-scaffold them.

- **Frontend:** present — Astro 6 + React 19 islands + Tailwind 4 + shadcn; file-based routes under `src/pages/`
- **Backend / API:** present — Astro SSR (`output: "server"`) + Cloudflare adapter; API routes only starter auth (`signin` / `signup` / `signout`)
- **Data:** partial — content-store client wired (`src/lib/supabase.ts`); no product migrations, content tables, or seeds
- **Auth:** present — cookie SSR + middleware for `/dashboard`; no roles/RBAC (this change does not add a CMS login UI)
- **Deploy / infra:** partial — Cloudflare Workers + wrangler; CI lint/build only (no deploy job); public review URL already exists from the prior redesign
- **Observability:** absent — no app-level logging / error tracking / metrics (no NFR in this PRD)

## Foundations

### F-01: Content-store schema and keyed seed

- **Outcome:** (foundation) schema and keyed seed scripts exist for every current page slot, nav item, and article field (`osk.<area>.<slug>` generated from current copy), including visibility states and gallery/article image records, ready for the implementer-owner to apply.
- **Change ID:** content-store-schema-seed
- **PRD refs:** US-01, US-02, US-03
- **Unlocks:** S-01, S-02, S-03; verification path for applying the seed and confirming a keyed lookup on a public page
- **Prerequisites:** —
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** Sequenced first under `quality` because page and blog slices cannot be planned or checked for correctness without a stable key, visibility, and seed contract; a thin or invented key set would force rework on every public route. In this prototype phase the implementer and owner are the same person, so applying the scripts is not an external wait.
- **Status:** done

## Slices

### S-01: Live keyed page copy

- **Outcome:** user can read public page copy and gallery images from the content store; a stored-text change appears on the next request without rebuild; missing text shows the lookup key (never an error page and never invented wording).
- **Change ID:** live-keyed-page-copy
- **PRD refs:** US-01, US-03
- **Prerequisites:** F-01
- **Parallel with:** —
- **Blockers:** —
- **Unknowns:** —
- **Risk:** North star — proves live copy and the missing-key fallback on real pages before nav chrome or blog routes expand the surface. Non-gallery, non-article images stay as static files (Parked). Hidden page states, if present in the seed, must not appear to visitors.
- **Status:** proposed

### S-02: Live navigation from the store

- **Outcome:** user can browse primary nav, dropdowns, footer, phone, and CTA whose labels and destinations come from the content store.
- **Change ID:** live-nav-from-store
- **PRD refs:** US-01
- **Prerequisites:** F-01, S-01
- **Parallel with:** S-03
- **Blockers:** —
- **Unknowns:** —
- **Risk:** After S-01 so navigation reuses the same keyed read instead of a second lookup path. Slot structure stays frozen — labels and hrefs per seeded slot, not a tree restructure.
- **Status:** proposed

### S-03: Live blog with visibility

- **Outcome:** user can read the blog list with pinned articles first and open a full article; hidden articles are omitted from the list and are not a public article at the slug; article images come from the content store.
- **Change ID:** live-blog-visibility
- **PRD refs:** US-02
- **Prerequisites:** F-01, S-01
- **Parallel with:** S-02
- **Blockers:** —
- **Unknowns:** —
- **Risk:** After S-01 so listing, pinning, and the new article route reuse keyed reads and the missing-key fallback. Sequenced beside S-02, not before S-01, so visibility rules are checked on a working live-copy path rather than as the first proof.
- **Status:** proposed

## Backlog Handoff

| Roadmap ID | Change ID                 | Suggested issue title                                          | Ready for `/10x-plan` | Notes                                                               |
| ---------- | ------------------------- | -------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- |
| F-01       | content-store-schema-seed | Write content-store schema and keyed seed artifacts            | yes                   | Run `/10x-plan content-store-schema-seed` — unlocks north star S-01 |
| S-01       | live-keyed-page-copy      | Render public pages from keyed store with missing-key fallback | no                    | North star — becomes ready after F-01                               |
| S-02       | live-nav-from-store       | Load navigation chrome from the content store                  | no                    | Parallel with S-03 after S-01                                       |
| S-03       | live-blog-visibility      | List and show blog articles with visibility flags              | no                    | Parallel with S-02 after S-01                                       |

This table is the clean handoff to Jira/Linear or any MCP-backed backlog. Include one row for every `F-NN` and `S-NN`. It should be compact enough to copy into issues, but it must not duplicate the detailed roadmap body.

## Open Roadmap Questions

None remaining. PRD Open Questions were resolved 2026-08-19 (key taxonomy, image split, who runs scripts). This prototype phase treats implementer and owner as the same person, so script application is not an external wait.

## Parked

- **CMS form UI in this change** — Why parked: PRD §Non-Goals; this task only wires the public site to the content store; form UI belongs in a future OSK management app.
- **Versioning, preview, draft/publish workflow, revision history** — Why parked: PRD §Non-Goals; live store values only.
- **OSK management application** — Why parked: PRD §Non-Goals; separate project, same content-store contract.
- **Restructuring navigation information architecture via a CMS** — Why parked: PRD §Non-Goals; slot structure frozen; labels/hrefs only.
- **Moving non-gallery, non-article images into the content store** — Why parked: PRD §Non-Goals; heroes, icons, and decorative photos stay as static files; a later pass can retarget those slots.
- **Image-upload UI** — Why parked: PRD §Non-Goals; gallery and article images live in the store; the owner manages them there.
- **Implementer executing schema/seed scripts as a product step** — Why parked: PRD §Non-Goals; scripts are artifacts. In this prototype the same person applies them, which does not add a slice.
- **Full WCAG conformance push** — Why parked: PRD §Non-Goals.
- **SEO tooling, sitemap generation, or analytics** — Why parked: PRD §Non-Goals.
- **Observability stack (error tracking, metrics)** — Why parked: absent in baseline; no NFR in this PRD.
- **CMS login / role UI in the public app** — Why parked: PRD §Access Control Changes; write access is out of this change’s product surface.

## Done

- **F-01: (foundation) schema and keyed seed scripts exist for every current page slot, nav item, and article field** — Archived 2026-08-20 → `context/archive/2026-08-19-content-store-schema-seed/`. Lesson: —.
