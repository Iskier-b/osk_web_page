---
project: "OSK Juszczak — prosty CMS (live edit)"
context_type: brownfield
created: 2026-08-18
updated: 2026-08-19
product_type: web-app
target_scale:
  users: medium
  qps: low
  data_volume: small
timeline_budget:
  delivery_weeks: 3
  hard_deadline: null
  after_hours_only: true
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: this-change scope
      decision: this repo does not build CMS UI — only wires the public site to the content store
    - topic: missing content
      decision: missing stored text shows the lookup key (e.g. osk.main.nasze_pojazdy), never an error and never invented copy
    - topic: seed
      decision: implementer writes schema + keyed seed; owner executes scripts in the store
    - topic: connection
      decision: content-store credentials never exposed to visitors; implementer helps configure connection, does not run setup scripts
    - topic: key taxonomy
      decision: implementer generates osk.<area>.<slug> for every page slot, nav item, and article field; osk.main.nasze_pojazdy is only an example
    - topic: images
      decision: gallery + article images from content store; all other images stay static files with a later retarget path
  frs_drafted: 10
  quality_check_status: accepted
---

# Seed (verbatim input)

od klienta powstała nowa funkcjonalność która wymaga aby treści na stronie były w łatwy sposób edytowalne, mozna by to zrealizować prostym widokiem w którym może on edytować treści w bazie na dedytkowanej stronie, nie robimy wersjonowania, podglądu, i innych funkcji CMSa tylko dajemy live edit na bazie, to do wszystkich linków, treści artykułów na stronach, dodatkowo w sekcji blog, prezentujemy listę artykułów z odpowiedniej tabeli, zasada wprowadzenia artykułów taka sama, prosta strona z edytowalnymi polami formularza plus upload obrazków. Właściciel może zaznaczyć artykuł jako niewyświetlany, zawsze na wieżchu, prezentowany. 
Dostęp do tej sekcji z edycją albo w osobnej alikacji (będziemy tworzyli aplikację zarządzania OSK więc może tam - będą dostępy do aplikacji dla użytkowników z odpowiednimi rolami) jedynie dla użytkownika w roli administratora/edutora strony po zalogowaniu się. 
Strona powinna być już dostosowana do działania w trybie takiego prostego CMS niezależnie od wybranego wariantu dostarczania treści.

# Addendum (verbatim, 2026-08-19)

uwzględnij nowe wymagania odkryte przez shape, uwzględnij że w tym zadaniu nie budujemy samego CMSa a jedynie podpinamy stronę do korzystania z bazy, teksty jeśli nie znalezione w bazie powinny generować klucz z bazy zamiast treści czy błędu (właściciel będzie mógł łatwo znaleźć i poprawić), agent w implementacji ma wygenerować model do Supabase do stworzebua tabel i przygotować SQL z aktualnymi danymi do szybkiego zapełnienia bazy czyli jeśli strona prezentuje treść: "nasze pojazdy" i jest on zamieniany na klucz: osk.main.nasze_pojazdy to w skrypcie pojawia się wpis pozwalający wstawić takich klucz do bazy z tesktem "nasze pojazdy". podobnie dla sekcji artykułów powinny one być już wstawione skryptu bez obrazków. Implementacja powinna zapewniac bezpieczne połączenie z bazą. Agent sam nie wykonuje skryptów pomaga jedynie założyć bazę i skonfigurować połączenie w aplikacji.

# Addendum (verbatim, 2026-08-19 — Open Questions)

1. osk.main.nasze_pojazdy - to tylko przykład, agent może go użyć lub nie, agent ma sam generować treść klucza zgdnie z zasadą: osk.<area>.<slug> for every page slot, nav item, and article field
2. pozostają jako obrazy statyczne, tylko obrazki w galeriach i artykułach przychodzą z CMS (bazy), dla innych obrazów możesz zaproponować łatwe przejście w przyszłości na nowy system z bazą.
3. Właścicile wykona skrpty w bazie danych, model stworzy odpowiednie skrypty

## Shaping decisions (session 2026-08-18)

- **Session mode:** restart — prior greenfield demo shape archived to `context/foundation/archive/shape-notes-2026-08-18-0032.md`
- **Context type:** brownfield (confirmed)
- **Change category:** new module — CMS + DB content layer
- **Admin UI location:** separate OSK management application (future); **this repo** delivers DB layer + public SSR render only. Interim editing via Supabase Studio until the management app exists.
- **This-change scope (2026-08-19):** do **not** build CMS UI in this task — only wire the public site to the content store.
- **Missing-key fallback (2026-08-19):** if stored text is missing, the page shows the lookup key (example: copy "nasze pojazdy" → key `osk.main.nasze_pojazdy`) instead of content or an error, so the owner can find and fix it.
- **Seed (2026-08-19):** implementer writes schema + keyed seed scripts; **owner** executes them in the content store. Implementer does not run the scripts.
- **Connection (2026-08-19):** content-store credentials must never be exposed to visitors.
- **Keys (2026-08-19, OQ-1):** implementer generates `osk.<area>.<slug>` for every page slot, nav item, and article field. `osk.main.nasze_pojazdy` is only an example.
- **Images (2026-08-19, OQ-2):** gallery and article images from the content store; all other images stay static files. Remaining slots should stay easy to retarget to the store later.

## Current System

**Product:** OSK Juszczak redesign — public informational website (Astro 6 SSR, React islands, Tailwind 4, Cloudflare Workers). Originally scoped as a demo/proof-of-concept for the owner to approve a modernized layout.

**Content today:**
- 9 Markdown pages via Astro Content Collections (`src/content/pages/*.md`) with typed Zod frontmatter (hero, CTAs, prices, teasers, images).
- Navigation, footer links, phone, and CTA hardcoded in `src/lib/site-nav.ts`.
- 13 stub routes with title-only placeholders.
- Blog (`/artykuly`): listing shell only — `newsTeasers` in frontmatter (title + summary); no individual article pages or DB.
- Images: static paths under `/images/osk/` in `public/`.
- Most public pages use `prerender = true` (build-time content).

**Auth today:** Supabase SSR cookie auth scaffolded; middleware protects only `/dashboard`. No roles/RBAC. Dashboard is a placeholder (welcome + email + sign-out). PRD explicitly marked auth and CMS as non-goals for the demo MVP.

**Database today:** Supabase wired for auth only — no product migrations, no content tables, no Storage bucket.

**Users today:** Public visitors (course candidates); OSK owner reviews the demo like any visitor (no edit access).

**Must preserve:**
- Existing navigation information architecture (menu labels, hierarchy, destinations) unless the owner explicitly edits links via CMS.
- Public page routes and section component kit (Hero, ProseSection, CtaBand, PriceTable, etc.).
- Mobile usability bar (375px, no horizontal scroll on top-level pages).
- SSR deployment on Cloudflare Workers.
- Visual design / youth-oriented layout already applied.

## Vision & Problem Statement

After the client approved the redesign direction, a new requirement emerged: the owner must be able to update site content themselves — links, page copy, and blog articles — without developer intervention. The current static Markdown + hardcoded-nav architecture cannot support that.

The change adds a **minimal live-edit CMS**: form-based editing that writes directly to the database (no versioning, no preview, no full CMS feature set). The public site reads from the same database at render time, so content updates are live immediately. Blog articles gain a real listing from a DB table plus individual article pages, with visibility flags (hidden / pinned-on-top / displayed) and image upload.

Insight: the site must be **CMS-ready at the rendering layer** regardless of where the admin UI lives — Supabase as single source of truth; public Astro app reads DB at SSR; edit UI deferred to future OSK management app (interim: Supabase Studio).

## User & Persona

**Primary — OSK owner / site editor (administrator lub edytor strony).** Runs the driving school; needs to keep the modernized site up to date (offers, prices, contact info, blog posts) without calling a developer. Logs in to the CMS panel, edits fields, uploads images, toggles article visibility. Expects changes to appear on the live public site immediately.

**Secondary — course candidate (public visitor).** Unchanged — browses the public site; no login; sees published content only.

## Access Control

**Public site:** unchanged for visitors — no login required; published content only (articles/pages with display status ≠ hidden).

**CMS / editing (interim MVP):** no in-app edit UI in this repository or a separate app yet. Site editor role edits content directly in **Supabase Studio** (tables + Storage). Future OSK management application will provide form-based CMS UI for the same Supabase backend.

**Auth model change:** yes — introduce Supabase-backed **site editor** role (single role for MVP; full content + nav + article edit rights). RLS on all content tables: public read for published rows; write only for authenticated users with site-editor role. This app's existing auth scaffold (`middleware.ts`, `/dashboard`) is not the CMS entry point for MVP — dashboard may remain placeholder or redirect note until the OSK management app exists.

**Role separation:** flat single role (`site_editor`) for MVP. No separate admin vs editor split yet.

## Success Criteria

### Primary
- Public site renders all CMS-managed content (pages, nav links, blog list, article detail) from Supabase at SSR time; an edit in Supabase Studio is visible on the live public site without redeploy.
- Blog section lists articles from DB; individual article pages exist; visibility flags work (hidden not shown, pinned always on top of list, displayed normal).
- Image references use Supabase Storage URLs after upload via Studio.

### Secondary
- Existing Markdown content migrated/seeded into DB so the public site matches current demo content on day one.

### Guardrails
- Navigation information architecture (menu structure, hierarchy) preserved — only link targets/labels become DB-editable, not a restructure via CMS.
- Mobile bar unchanged: 375px top-level pages without horizontal scroll.
- No versioning, preview, or draft/publish workflow — live edit only.
- Public visitors never see hidden articles or unpublished page states.
- Existing section component kit and page routes reused — rendering layer swap (Markdown → DB), not a redesign.

## Timeline acknowledgment

Target: ~3 weeks after-hours for DB layer + public SSR render + blog + nav migration. Interim editing via Supabase Studio only (no CMS UI).

## MVP flow (locked)

1. Developer adds Supabase migrations: content tables (pages, nav_links, articles), Storage bucket for images, RLS policies, site_editor role.
2. Developer seeds DB from existing Markdown + `site-nav.ts` so public site parity on launch.
3. Public pages switch from `getPageEntry()` / hardcoded nav to SSR reads from Supabase.
4. Blog: `/artykuly` lists DB articles (pinned first, then by date); new `/artykul/[slug]` route for article body.
5. Site editor opens Supabase Studio, edits a page field or article → saves → public site shows change immediately (SSR, no redeploy).
6. Site editor uploads image to Storage via Studio, references URL in content.
7. Site editor toggles article visibility flag (hidden / pinned / displayed).

## Functional Requirements

### Content editing (interim — Supabase Studio)
- FR-001: Site editor can edit page content fields (hero, body sections, structured blocks matching existing page schema) directly in Supabase Studio. Priority: must-have. Change: new
  > Socrates: Counter-argument considered: Studio is too technical for a driving-school owner. Resolution: kept for MVP — interim only; form UI ships in future OSK management app.
- FR-002: Site editor can edit navigation links (primary nav, dropdowns, footer, phone, CTA) in Supabase Studio. Priority: must-have. Change: new
  > Socrates: Counter-argument considered: editable nav could break IA or create dead links. Resolution: kept — IA structure seeded and constrained in schema; only href/label editable per slot.
- FR-006: Site editor can create and edit blog articles (title, summary, body, hero image ref) and set visibility (hidden / pinned / displayed) in Supabase Studio. Priority: must-have. Change: new
  > Socrates: Counter-argument considered: live edit without preview risks broken HTML/layout on production. Resolution: kept — owner accepts live-edit tradeoff; no preview by design.
- FR-007: Visitor can see gallery images and article images loaded from the content store; other page images stay as static files. Priority: must-have. Change: modified
  > Socrates: Counter-argument considered: Storage URLs vs static `/public/` paths adds complexity. Resolution (updated 2026-08-19): only gallery and article images come from the store in this change; remaining images stay files with a later retarget path.

### Public site (this repo)
- FR-003: Visitor can view all site pages with content loaded from Supabase at SSR time (replacing Markdown/hardcoded sources). Priority: must-have. Change: modified
  > Socrates: Counter-argument considered: SSR DB reads add latency vs prerendered Markdown. Resolution: kept — scale is low (local OSK); live edit outweighs build-time perf.
- FR-004: Visitor can browse the blog article list at `/artykuly` sourced from DB, with pinned articles always listed first. Priority: must-have. Change: new
  > Socrates: Counter-argument considered: pinning could stale the list if owner forgets to unpin. Resolution: kept — owner-controlled flag is the domain rule.
- FR-005: Visitor can read a full blog article at `/artykul/[slug]`. Priority: must-have. Change: new
  > Socrates: Counter-argument considered: individual article routes were explicitly out of MVP scope before. Resolution: kept — client requirement supersedes prior demo scope.

### Migration & infrastructure
- FR-008: Developer can write a keyed seed of existing Markdown pages, stub titles, nav copy, articles, and gallery/article images so the owner can fill the content store to match current site copy on launch. Priority: must-have. Change: new
  > Socrates: Counter-argument considered: one-time seed script may drift from Markdown if both coexist. Resolution: kept — Markdown deprecated after seed; DB is sole source post-migration.
- FR-009: Visitor (and owner reviewing the public site) can see the lookup key in place of missing stored text — never an error page and never invented copy — so the owner can find and correct the key. Priority: must-have. Change: new
- FR-010: Developer can write a content-store table model and keyed seed (`osk.<area>.<slug>` generated for every slot; `osk.main.nasze_pojazdy` is only an example) without executing those scripts; the **owner** runs them in the store; the developer only helps configure the application connection. Priority: must-have. Change: new

## User Stories

### US-01: Site editor updates live page content

- **Given** page content exists in Supabase (seeded from current site) and the site editor has site_editor role access in Supabase Studio
- **When** they edit a page field (e.g. cennik price table data) and save
- **Then** the public page at the corresponding URL shows the updated content on next request without redeploy

#### Acceptance Criteria
- Edit in Studio → visible on public URL within one SSR request
- Hidden page states are not shown to visitors
- Mobile layout unchanged at 375px

### US-02: Visitor reads blog with pinned articles

- **Given** articles exist in DB with mixed visibility flags
- **When** a visitor opens `/artykuly`
- **Then** they see displayed and pinned articles only (hidden omitted), pinned first, then by date; clicking an article opens `/artykul/[slug]`

#### Acceptance Criteria
- Hidden articles absent from list and direct slug access returns 404
- Pinned articles appear above non-pinned regardless of date
- Article body and hero image render from DB fields

## Business Logic

The system applies a **visibility and ordering rule** to published content: pages and articles carry a display state (hidden / displayed / pinned-for-list); public render excludes hidden items, and blog listing always surfaces pinned items first regardless of publication date.

Every piece of displayed copy is addressed by a stable lookup key (example: "nasze pojazdy" → `osk.main.nasze_pojazdy`). If the store has no value for a key, the public site shows that key instead of content or an error, so the owner can find and fill it.

Current rule (demo): all visible content is static at build time with no visibility states and no lookup keys. This change adds live visibility control and keyed lookup with missing-key display.

## Constraints & Preserved Behavior

- **Deployment:** Cloudflare Workers — no runtime filesystem writes; all content changes go through Supabase.
- **Rendering:** reuse existing Astro page routes and section components; swap data source from Content Collections / hardcoded nav to Supabase queries.
- **Nav IA:** menu hierarchy and slot structure preserved in schema seed — CMS edits href/label per slot, not tree restructuring.
- **Prerender:** CMS-managed pages must use SSR (`prerender = false`) or equivalent live fetch — remove build-time bake for DB-backed routes.
- **Auth scaffold:** existing Supabase auth in this app remains; CMS UI not in scope — RLS + site_editor role gates writes at DB layer.
- **Backward compatibility:** public URLs unchanged; no breaking route changes.
- **Future OSK management app:** must use same Supabase project, tables, Storage bucket, and RLS policies — this repo defines the contract.

## Non-Functional Requirements

- Public pages remain usable at 375px width without horizontal scrolling on top-level routes (no regression).
- Content edits visible on public site without redeploy or rebuild (SSR read from Supabase).
- Hidden content never exposed to anonymous visitors (RLS + application filter).
- No draft/preview/version history — single live state per record.
- Response time: visitor-perceived page load remains acceptable for local OSK traffic (no hard ms target; no regression vs current SSR demo).

## Non-Goals

- Avoid: building CMS form UI in this change — this task only wires the public site to the content store; form UI belongs in a future OSK management app.
- Avoid: versioning, preview, draft/publish workflow, revision history — explicit live-edit-only scope.
- Avoid: building the OSK management application in this change — separate project, same content-store backend.
- Avoid: restructuring navigation IA via CMS — slot structure frozen; labels/hrefs only.
- Avoid: moving non-gallery, non-article images into the content store in this change — they stay as static files.
- Avoid: building an image-upload UI — gallery and article images live in the store; owner manages them there.
- Avoid: the implementer executing schema/seed scripts against the live store — implementer writes the scripts; the owner runs them.
- Avoid: full WCAG conformance push — not a goal of this change.
- Avoid: SEO tooling, sitemap generation, or analytics — out of scope.

## Forward: technical-roadmap

Recommended implementation layers in **this repo** (in order):

1. **Supabase schema artifact (owner applies)** — SQL to create tables: keyed copy (`key` + `text`, convention `osk.<area>.<slug>` generated per slot), `nav_links`, `articles` (visibility: hidden | displayed | pinned), gallery/article image records; RLS (public read published, site_editor write). Implementer writes the SQL; **owner executes it**.
2. **Keyed seed SQL (owner applies)** — INSERT for every current displayed string (Markdown + nav + stubs) and for gallery/article images. Implementer generates each key as `osk.<area>.<slug>`; `osk.main.nasze_pojazdy` is only an example of the pattern.
3. **Content service** (`src/lib/services/content.ts`) — typed reads replacing `getPageEntry()` and `site-nav.ts`; missing key → render the key string, never throw, never invent copy. Image helper: gallery/article URLs from store; other images from `/images/osk/` (same slot API so later retarget is a source swap).
4. **Secure connection** — `SUPABASE_URL` / `SUPABASE_KEY` remain server-only via `astro:env/server`; never expose to the client. Implementer helps configure `.dev.vars` / secrets; does not run CLI against production.
5. **Page route updates** — remove `prerender = true` on DB-backed routes; inject keyed copy into existing section components.
6. **Blog + gallery** — update `artykuly.astro`; add `src/pages/artykul/[slug].astro`; gallery grid reads store image URLs.

**Later image retarget (not this change):** keep one image-slot helper (`src` URL). Today non-gallery/non-article `src` is a static path. A future change copies those files into Storage, seeds URL rows, and switches the helper — no page-layout rewrite.

Future **OSK management app** (separate repo): form-based editors for pages/articles/nav, image upload widget, role-gated access — consumes same Supabase API; no changes to public render contract.

## Quality cross-check

Status: **accepted** (2026-08-18).

| Element | Status |
|---------|--------|
| Access Control | present — site_editor role, RLS, Studio interim |
| Business Logic | present — visibility/ordering rule |
| Project artifacts | present |
| Timeline-cost ack | present — 3 weeks after-hours |
| Non-Goals | present — 6 entries |
| Preserved behavior | present — Constraints & Preserved Behavior section |

No gaps recorded.
