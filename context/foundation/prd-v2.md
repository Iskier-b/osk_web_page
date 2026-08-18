---
project: "OSK Juszczak — prosty CMS (live edit)"
version: 2
status: draft
created: 2026-08-19
context_type: brownfield
product_type: web-app
target_scale:
  users: medium
  qps: low
  data_volume: small
timeline_budget:
  delivery_weeks: 3
  hard_deadline: null
  after_hours_only: true
---

## Current System Overview

Public informational website for Auto Szkoła Juszczak — a modernized redesign demo so the owner can evaluate look, UX, and information architecture against https://www.autojuszczak.com.pl/.

Key architecture: single Astro 6 SSR app with React 19 islands, Tailwind 4, deployed to Cloudflare Workers. Most public pages are prerendered at build time.

Tech stack today: Astro Content Collections (Markdown + Zod frontmatter) for nine pages; hardcoded navigation/footer/phone/CTA in TypeScript; static images under `/images/osk/`; Supabase wired for cookie auth only (no content tables, no Storage, no product migrations). Dashboard is a placeholder; only `/dashboard` is auth-gated. No roles.

Current user base: public visitors (course candidates, local OSK scale — dozens to ~100). The owner reviews the site like any visitor; no edit access.

Core functionality today: browse nav (full IA; title-only stubs where body was not copied); read source-faithful top-level plus one deep path; see demo forms with submit disabled; listing-only blog teasers at `/artykuly` (no article detail pages).

## Problem Statement & Motivation

After the client approved the redesign direction, a new requirement emerged: the owner must be able to update site content themselves — links, page copy, and blog articles — without calling a developer. The current static Markdown + hardcoded-nav architecture cannot support that.

Why now: the demo is no longer enough; the live site must be CMS-ready at the rendering layer so a future management app (or a table editor) can change copy and the public site reflects it immediately. This change does **not** build that CMS — it only connects the public site to a content store.

Current workaround: a developer edits files and redeploys. Cost: every text change waits on a deploy cycle; the owner cannot find or fix missing copy themselves.

## User & Persona

**Primary — OSK owner / site editor (administrator lub edytor strony).** Runs the driving school; needs to keep the modernized site up to date (offers, prices, contact info, blog posts) without calling a developer. For this change they apply prepared schema and seed artifacts, then correct missing keys they see on the public site. Expects stored changes to appear on the live public site immediately, without rebuild.

### Secondary persona

- **Course candidate (public visitor).** Unchanged — browses the public site; no login; sees published content only. Experience change: pages and blog come from the content store; missing copy shows a lookup key instead of a broken page.

## Success Criteria

### Primary
- Public site renders pages, nav links, blog list, and article detail from the content store; a stored-text change is visible on the live public site without rebuild or redeploy.
- Every displayed string is addressed by a lookup key in the form `osk.<area>.<slug>` (one key per page slot, nav item, and article field). The implementer generates the keys from current copy; `osk.main.nasze_pojazdy` is only an illustration, not a required key. If the store has no value, the page shows that key — never an error and never invented copy — so the owner can find and fill it.
- Blog lists articles from the store (pinned first, then by date); individual article pages exist; visibility flags work (hidden not shown, pinned always on top, displayed normal). Gallery images and article images come from the content store; all other images stay as today’s static files.
- Implementer writes the schema and seed scripts; the owner executes them in the content store. The implementer helps configure the application connection and does **not** run those scripts.

### Secondary
- After the owner runs the seed scripts, the public site matches current demo copy on day one (pages, stubs, nav, articles, gallery images).

### Guardrails
- Navigation information architecture (menu structure, hierarchy) preserved — only link targets/labels become store-editable, not a restructure.
- Mobile bar unchanged: 375px top-level pages without horizontal scroll.
- No versioning, preview, or draft/publish workflow — live store values only.
- Public visitors never see hidden articles.
- Existing section components and public page routes reused — data-source swap, not a redesign.
- Content-store credentials are never exposed to visitors.
- This change does not ship a CMS form UI.

## User Stories

### US-01: Owner sees stored copy on the public site without rebuild

- **Given** current site copy has been applied to the content store from the prepared keyed seed, and the public site is connected to that store
- **When** the owner (or anyone with store write access) changes a stored text value for a key and the visitor opens the corresponding public URL
- **Then** the page shows the updated text on the next request without a site rebuild
- **Before:** copy lived in Markdown / hardcoded nav and changed only after a developer edit and deploy

#### Acceptance Criteria
- Stored-text change is visible on the public URL without redeploy
- Hidden articles are not shown to visitors
- Mobile layout unchanged at 375px

### US-02: Visitor reads blog with pinned articles

- **Given** articles exist in the content store with mixed visibility flags
- **When** a visitor opens `/artykuly`
- **Then** they see displayed and pinned articles only (hidden omitted), pinned first, then by date; clicking an article opens `/artykul/[slug]`
- **Before:** `/artykuly` was a listing shell of teasers only; no article detail pages

#### Acceptance Criteria
- Hidden articles absent from list and direct slug access is not a public article
- Pinned articles appear above non-pinned regardless of date
- Article body and article images render from the content store

### US-03: Owner finds missing copy by the lookup key on the page

- **Given** a page slot is bound to a generated key (`osk.<area>.<slug>`) and the store has no value for that key
- **When** anyone opens the public page
- **Then** they see the key itself in that slot — not an error, not blank-without-trace, and not invented wording — so the owner can locate and fill the key
- **Before:** missing files either broke the build or showed a placeholder page title

#### Acceptance Criteria
- Missing key never produces an error page
- Displayed fallback is the lookup key (pattern `osk.<area>.<slug>`)
- Filling the key in the store replaces the fallback with the stored text on the next request

## Scope of Change

- [new] Public site loads page copy, navigation labels/hrefs, and blog articles from a content store at request time.
- [new] Every displayed string, nav item, and article field is a keyed lookup `osk.<area>.<slug>` generated by the implementer from current copy; missing stored text renders that key instead of content or an error.
- [new] Blog list at `/artykuly` from stored articles, pinned items always first; full article at `/artykul/[slug]`.
- [new] Article visibility: hidden / displayed / pinned — public list and detail omit hidden; pinned always on top of the list.
- [new] Gallery images and article images load from the content store; other images stay as static files.
- [new] Implementer-written schema and keyed seed scripts (pages, nav, stubs, articles, gallery and article images) that the **owner** executes in the content store.
- [new] Implementer helps configure the application connection; does not execute schema or seed scripts.
- [modified] Content source — was Markdown collections plus hardcoded nav baked at build; now live keyed reads from the content store (no rebuild to change copy).
- [modified] `/artykuly` — was teaser titles/summaries in page frontmatter; now a real article list from the store.
- [preserved] Public URL paths and menu information architecture (labels, hierarchy, destinations as seeded slots).
- [preserved] Visual design / youth-oriented layout and existing section components (hero, prose, price table, etc.).
- [preserved] Mobile usability bar: 375px top-level pages without horizontal scroll; primary nav usable.
- [preserved] Demo forms remain non-submitting unless separately scoped later.
- [preserved] Non-gallery, non-article images remain today’s static files (heroes, icons, decorative photos). Slots stay swappable later: the same image place can point at a stored file without a layout rewrite.
- [removed] Markdown files and hardcoded nav as the live source of truth after the owner applies the seed (files may remain as the seed input only).

## Constraints & Compatibility

- Public URLs unchanged; no breaking route changes.
- Menu hierarchy and slot structure preserved in the seed — store edits are per-slot href/label, not tree restructuring.
- Current copy is delivered as schema + seed scripts the owner runs in the content store; the implementer writes the scripts and does not run them.
- Gallery and article images come from the content store. All other images stay as static files. Those remaining slots should keep a single image source (file path today) so a later change can point them at the store without rewriting page layout.
- Existing public page routes and section components stay; only the data source changes.
- Content-store credentials never reach the visitor. The public site uses a connection configured in the application with implementer help — the owner runs the store scripts.
- Future OSK management app must use the same content store and the same key/article contracts this change defines.
- After the seed is applied, Markdown is no longer the live source; keeping both as live sources would drift.

## Business Logic Changes

The system applies a **visibility and ordering rule** to published content: pages and articles carry a display state (hidden / displayed / pinned-for-list); public render excludes hidden items, and blog listing always surfaces pinned items first regardless of publication date.

Every piece of displayed copy, every nav item, and every article field is addressed by a lookup key `osk.<area>.<slug>` generated from current copy (the string `osk.main.nasze_pojazdy` is only an example of the pattern). If the store has no value for a key, the public site shows that key instead of content or an error, so the owner can find and fill it.

Current rule (demo): all visible content is static at build time with no visibility states and no lookup keys. This change adds live visibility control and keyed lookup with missing-key display.

Inputs: keyed stored text (and article visibility flags) plus the page slot that requests a key. Output: either the stored string or the key itself. Encountered on every public page and on `/artykuly` / `/artykul/[slug]`.

## Access Control Changes

Public site: no access control changes — visitors still need no login; they see displayed and pinned content only (hidden omitted).

This change does not add a CMS login or role UI in the public application. Write access to stored copy is out of this change’s product surface (no form panel). A future management app — or the content store’s own table editor — may grant a single **site editor** role full edit rights; that UI is not in this change.

## Non-Goals

- Avoid: building CMS form UI in this change — this task only wires the public site to the content store; form UI belongs in a future OSK management app.
- Avoid: versioning, preview, draft/publish workflow, revision history — explicit live-store-only scope.
- Avoid: building the OSK management application in this change — separate project, same content-store contract.
- Avoid: restructuring navigation IA via a CMS — slot structure frozen; labels/hrefs only.
- Avoid: moving non-gallery, non-article images into the content store in this change — heroes, icons, and decorative photos stay as static files; a later pass can retarget those slots.
- Avoid: building an image-upload UI in this change — gallery and article images live in the store; the owner manages them there (or via a future management app).
- Avoid: the implementer executing schema/seed scripts against the live store — the implementer writes the scripts; the owner runs them.
- Avoid: full WCAG conformance push — not a goal of this change.
- Avoid: SEO tooling, sitemap generation, or analytics — out of scope.

## Open Questions

None remaining. Resolved 2026-08-19:

1. **Key taxonomy** — `osk.main.nasze_pojazdy` is only an example; the implementer may use it or not. The implementer generates every key as `osk.<area>.<slug>` for each page slot, nav item, and article field.
2. **Images** — Non-gallery, non-article images stay as static files. Gallery images and article images come from the content store. Remaining static image slots should stay easy to retarget to the store later without a layout rewrite.
3. **Who runs scripts** — The owner executes the scripts in the content store. The implementer writes the schema and seed scripts and does not run them.
