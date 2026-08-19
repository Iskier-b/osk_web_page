# Content-store schema and keyed seed Implementation Plan

## Overview

Deliver roadmap F-01: write the Supabase content-store schema and a keyed seed of current public copy so the owner can apply SQL and later slices (S-01–S-03) can read a stable contract. This change does not wire the public site. Markdown and `site-nav.ts` stay the live source until S-01.

## Current State Analysis

Public copy lives in nine Astro Content Collection pages (`src/content/pages/*.md` via `src/content.config.ts`), hardcoded chrome in `src/lib/site-nav.ts`, fourteen `StubPage` routes with the shared placeholder “Treść w przygotowaniu”, and two form pages (`/zapisy-na-kurs`, `/referencje`) whose titles live in the `.astro` files. Blog “articles” are `newsTeasers` title+summary pairs on `artykuly.md` (and a three-item subset on `home.md`) — no slugs, bodies, dates, or `/artykul/[slug]` routes.

Supabase is auth-only: `src/lib/supabase.ts` builds an optional SSR cookie client; `astro.config.mjs` declares `SUPABASE_URL` / `SUPABASE_KEY` as server secrets. There is no `supabase/migrations/` directory, no `supabase/seed.sql` (though `supabase/config.toml` already points `sql_paths` at `./seed.sql`), no content tables, and no Storage buckets. `src/types.ts` does not exist yet (AGENTS.md still names it as the DTO home).

prd-v2 and the 2026-08-19 roadmap already locked the product rules this schema must encode: lookup keys `osk.<area>.<slug>`, missing stored text shows that key (later, in S-01), gallery/article images from the store, other images stay static files, owner runs scripts, implementer does not run them against the live project.

## Desired End State

The repo contains a migration that creates the hybrid content-store (copy keys, pages registry, frozen nav slots, articles with visibility, media URL rows), RLS (anon read of published content, `site_editor` write), and an empty public Storage bucket. A key catalog lists every seeded `osk.*` key with its source file and value. `supabase/seed.sql` inserts that catalog idempotently. A verify script proves catalog and seed cannot drift. An apply note tells the owner the exact Studio/SQL order. The public site is unchanged.

### Key Discoveries:

- Page loader is `getPageEntry` in `src/lib/content/pages.ts:16` over a fixed `PageId` union (`home` … `kontakt`); stubs are not in that union.
- Structured lists that must flatten: `priceRows` (`cennik.md`), `dashboardItems` / `heroPitches` / `reviewQuotes` (`home.md`). Optional nested fields that are absent today (e.g. a price row with no `note`) are not slots — do not invent keys for them.
- Home `newsTeasers` and `artykuly.md` `newsTeasers` are the same six posts, not independent page copy. Seed them once as articles. Do not also emit `osk.home.news_*` / `osk.artykuly.news_*` keys.
- Gallery media today: `teaserImages` on `home.md` and `galeria.md` (`/images/osk/fleet-02.webp` … `fleet-04.webp`). `news-teaser-01.jpg` on `/artykuly` and all heroes/figures stay static files.
- `config.toml` seed path is `./seed.sql` (`supabase/config.toml` `[db.seed]`). Hosted `db push` applies migrations only — seed is a separate owner step.

## What We're NOT Doing

- Wiring public routes, `getPageEntry`, or `site-nav.ts` consumers to the store (S-01 / S-02 / S-03)
- Executing schema or seed against the hosted/live project as the implementer
- CMS form UI, draft/preview/versioning, or the OSK management app
- Seeding demo form labels (`EnrollmentForm`, `ContactForm`, `OpinionForm`, `EnrollmentStrip`)
- Seeding hardcoded Astro section headings (`index.astro` “Galeria”, footer “Mapa strony”, PriceTable column chrome)
- Moving hero / decorative / `news-teaser-01.jpg` files into Storage
- Uploading gallery binaries; media rows store today’s public URL strings
- Duplicate home/artykuly teaser keys that copy article title/summary
- Creating a hidden-article fixture that is not current site copy
- Adding a test runner or CI Docker/Supabase service

## Implementation Approach

1. Add a single timestamped migration that creates the five public tables, enums, `is_site_editor()`, RLS policies, and an empty public Storage bucket.
2. Build a canonical key catalog from current Markdown, `site-nav.ts`, stub titles, form-page titles, and gallery image slots — using the naming rules below.
3. Write idempotent `supabase/seed.sql` that inserts catalog rows (copy first, then tables with FKs), plus a verify script that diffs catalog ↔ seed, plus a short owner apply note.

## Critical Implementation Details

**Seed order is load-bearing.** `nav_slots`, `articles`, and `media` reference `site_copy.key` (and `pages` / `articles` slugs). Insert `site_copy` and `pages` first, then nav, articles, media. A seed that inserts slots before keys will fail the FKs.

**Empty article body is an empty string, not a missing key.** US-03’s “show the key” applies when the row is absent. Seed `osk.article.<slug>.body` with `''` so S-03 can distinguish “not yet written” (empty stored value) from “never catalogued”.

**Hosted apply ≠ local reset.** `npx supabase db reset` will run the migration and `seed.sql` locally. Hosted/Studio apply is: run the migration SQL, then run `seed.sql`. `db push` does not load seed.

## Phase 1: Schema, RLS, and Storage bucket

### Overview

Create the hybrid content-store contract in SQL (and matching DTOs in `src/types.ts`) so later slices share one shape: keyed strings, page registry, frozen nav slots, article visibility, media URLs.

### Changes Required:

#### 1. Content-store migration

**File**: `supabase/migrations/YYYYMMDDHHmmss_content_store_schema.sql` (timestamp at implement time; name suffix exact)

**Intent**: Create the tables, constraints, helper, RLS, and empty Storage bucket. This is the contract S-01–S-03 will query.

**Contract**:

Tables (all in `public`, RLS enabled):

| Table | Role |
| ----- | ---- |
| `site_copy` | `key text` PK, `value text not null`, `updated_at timestamptz not null default now()` |
| `pages` | `slug text` PK, `path text not null unique`, `kind text not null`, `visibility text not null` |
| `nav_slots` | `id text` PK, `parent_id text` null FK → `nav_slots`, `placement text not null`, `sort_order int not null`, `label_key text not null` FK → `site_copy`, `href_key text not null` FK → `site_copy` |
| `articles` | `slug text` PK, `visibility text not null`, `published_at timestamptz not null`, `sort_order int not null`, `title_key` / `summary_key` / `body_key` each FK → `site_copy` |
| `media` | `id text` PK, `kind text not null`, `page_slug text` null FK → `pages`, `article_slug text` null FK → `articles`, `sort_order int not null`, `url text not null`, `alt_key text not null` FK → `site_copy` |

Checks:

- `site_copy.key` matches `^osk\.[a-z0-9]+(_[a-z0-9]+)*(\.[a-z0-9]+(_[a-z0-9]+)*)+$`
- `pages.kind` ∈ `content` \| `stub` \| `form`
- `visibility` on `pages` and `articles` ∈ `hidden` \| `displayed` \| `pinned`
- `nav_slots.placement` ∈ `primary` \| `footer` \| `chrome`
- `media.kind` ∈ `gallery` \| `article`
- `media`: exactly one of `page_slug` or `article_slug` is non-null
- Unique `(placement, parent_id, sort_order)` on `nav_slots` (use a unique index that treats `parent_id` nulls consistently)

Helper (JWT claim is the write gate for the future management app; Studio project-owner still bypasses RLS):

```sql
create or replace function public.is_site_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'site_editor', false);
$$;
```

RLS (per-operation, per-role):

- `anon` + `authenticated`: `SELECT` on `site_copy`, `nav_slots`; `SELECT` on `pages` where `visibility <> 'hidden'`; `SELECT` on `articles` where `visibility <> 'hidden'`; `SELECT` on `media` where `article_slug is null` or the linked article is not hidden.
- No `anon` INSERT/UPDATE/DELETE on any of these tables.
- `authenticated` AND `is_site_editor()`: INSERT, UPDATE, DELETE on all five tables.

Storage: create public bucket `osk-media` (empty). Anon may read objects; only `is_site_editor()` may insert/update/delete objects. No seed objects.

#### 2. Shared DTOs

**File**: `src/types.ts`

**Intent**: Put the TypeScript contract next to the SQL so S-01 does not reinvent enums or table shapes.

**Contract**: Export `ContentVisibility`, `PageKind`, `NavPlacement`, `MediaKind`, and row types matching the five tables (`SiteCopyRow`, `PageRow`, `NavSlotRow`, `ArticleRow`, `MediaRow`). No runtime client, no queries.

### Success Criteria:

#### Automated Verification:

- Migration file exists under `supabase/migrations/` with the `_content_store_schema.sql` suffix
- SQL creates `site_copy`, `pages`, `nav_slots`, `articles`, `media`
- SQL enables RLS on each of those tables and defines `is_site_editor()`
- SQL creates Storage bucket `osk-media`
- `src/types.ts` exports the visibility / kind unions and the five row types
- `npm run lint` passes

#### Manual Verification:

- Read the migration: hidden-article SELECT cannot see `visibility = 'hidden'` rows; anon has no write policies
- Confirm bucket is public-read and created with no objects

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 2: Key catalog from current copy

### Overview

Produce the canonical inventory of every `osk.*` key this foundation will seed, traced to a current source file, so Phase 3 cannot invent or skip slots.

### Changes Required:

#### 1. Key catalog

**File**: `supabase/key-catalog.json`

**Intent**: One machine-readable source of truth for keys, values, and provenance. Seed SQL and the verify script both read this file’s contract (seed may be handwritten as long as it matches).

**Contract**: JSON array of objects `{ "key": string, "value": string, "source": string }`. Keys unique. `source` is a repo-relative path plus a field hint (e.g. `src/content/pages/cennik.md frontmatter.priceRows[0].label`). Naming:

- Pattern `osk.<area>.<field>` in snake_case. Hyphens in slugs become underscores. Polish letters transliterate (`ł→l`, `ą→a`, `ć→c`, `ę→e`, `ń→n`, `ó→o`, `ś→s`, `ź/ż→z`). Strip other punctuation.
- Content pages: area = page slug (`osk.home.title`, `osk.cennik.price_1_label`, `osk.home.hero_pitch_1`, `osk.home.dashboard_2_href`, `osk.home.review_1_quote`, `osk.kontakt.body`, …). Markdown body is one key `osk.<page>.body` (full Markdown, not split headings). Hero `src` is not a key (static file). Hero `alt` is a key.
- Stubs: `osk.<stub_slug>.title` and `osk.<stub_slug>.body` with body value `Treść w przygotowaniu`.
- Form pages: `osk.zapisy_na_kurs.title`; `osk.referencje.title` and `osk.referencje.hero_subtitle` (lead). No form-field keys.
- Chrome: `osk.chrome.brand_name`, `home_href`, `phone_label`, `phone_href`, `zapisy_cta_label`, `zapisy_cta_href`.
- Nav: separate keys per slot for label and href, including footer duplicates (footer may later diverge from primary). Slot **ids** (for `nav_slots.id`) are stable English tokens (`primary_onas`, `oferta_jazdy_doszkalajace`, `footer_regulamin`, `chrome_phone`) — not derived from the live label.
- Articles: six rows from `artykuly.md` `newsTeasers` in file order. Slug from title via the transliteration rules. Keys `osk.article.<slug_underscored>.title|summary|body`. Body value `""`. No article image keys.
- Gallery media alts: `osk.home.gallery_1_alt` … `_3` and `osk.galeria.gallery_1_alt` … `_3` (independent page slots; URLs may start equal).

Required coverage groups (catalog must include all of these; do not add out-of-scope chrome headings or form labels):

- 9 content pages’ frontmatter string slots actually present + each page `body`
- 14 stub title+body pairs
- 2 form-page title slots + referencje lead
- chrome brand/phone/CTA
- every `primaryNav` item and child, every `footerLinks` item (label + href each)
- 6 articles (title, summary, empty body)
- 6 gallery alt keys (home 3 + galeria 3)

#### 2. Pages / nav / article / media registries in the catalog notes

**File**: `supabase/key-catalog.json` (same file; extra top-level keys allowed)

**Intent**: The catalog should also list the non-copy rows Phase 3 will insert, so seed is not freehanded.

**Contract**: Alongside the copy array, include:

- `pages`: 9 `kind=content` (paths matching current routes; `home` path `/`), 14 `kind=stub`, 2 `kind=form`; all `visibility=displayed`
- `nav_slots`: primary tree matching `site-nav.ts` order, footer list matching `footerLinks` order, chrome slots for brand/home, phone, zapisy CTA; each `label_key` / `href_key` points at a catalog copy key
- `articles`: 6 slugs, all `displayed`, `sort_order` 1–6 matching `artykuly.md`, `published_at` a single seed timestamp (same for all; `sort_order` is the stable list order)
- `media`: 6 gallery rows (`kind=gallery`) — home `fleet-02..04` sort 1–3, galeria `fleet-02..04` sort 1–3 — `url` = current `/images/osk/…` path, `alt_key` as above. Zero `kind=article` rows.

### Success Criteria:

#### Automated Verification:

- `supabase/key-catalog.json` parses as JSON
- Copy keys are unique and match the `site_copy.key` regex
- Every coverage group listed above is present (9 content bodies, 14 stub bodies, 6 articles, 6 gallery alts, full nav+footer+chrome)
- No keys whose `source` is a form component or `index.astro` section heading

#### Manual Verification:

- Spot-check `cennik` price keys against `cennik.md` (8 rows; only existing `price`/`note` fields)
- Spot-check article slugs/titles against the six `artykuly.md` teasers
- Confirm home/artykuly teaser titles are not duplicated as page-level `news_*` keys

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Phase 3: Seed SQL, sync check, owner apply note

### Overview

Turn the catalog into SQL the owner can run, prove it cannot drift from the catalog, and document apply order without the implementer touching the live project.

### Changes Required:

#### 1. Seed SQL

**File**: `supabase/seed.sql`

**Intent**: Idempotent INSERT of every catalog row so local `db reset` and hosted SQL editor both converge on the same store.

**Contract**: Must be safe to re-run (`on conflict … do update` on primary keys). Insert order: `site_copy`, `pages`, `nav_slots`, `articles`, `media`. Copy inserts use this shape so the verify script can parse them:

```sql
insert into public.site_copy (key, value) values
  ('osk.home.title', 'Auto Szkoła Juszczak')
on conflict (key) do update
set value = excluded.value, updated_at = now();
```

Values must match the catalog exactly (including empty article bodies and the stub placeholder). Do not insert Storage objects. `config.toml` `[db.seed] sql_paths` already includes `./seed.sql` — keep that path; do not rename the file.

#### 2. Catalog ↔ seed verify script

**File**: `scripts/verify-content-seed.mjs` (or equivalent `.ts` wired in `package.json` if the repo already runs TS scripts that way — default to a Node ESM `.mjs` so no new test runner is needed)

**Intent**: Fail CI-locally when a key exists in only one of catalog or seed, or when values differ.

**Contract**: Runnable as `node scripts/verify-content-seed.mjs` (and listed in `package.json` `scripts` as `verify:content-seed`). Compares every catalog copy `key`/`value` to `site_copy` inserts in `supabase/seed.sql`. Also asserts catalog `pages` / `nav_slots` / `articles` / `media` ids/slugs appear in the corresponding seed INSERTs. Exit 0 on match, non-zero on drift. Do not start Supabase or Docker.

#### 3. Owner apply note

**File**: `supabase/APPLY.md`

**Intent**: Tell the owner (same person as the implementer in this prototype, but wearing the owner hat) how to apply artifacts without guessing.

**Contract**: Short steps only: (1) hosted SQL editor or `supabase db push` for the migration, (2) run `seed.sql`, (3) optional: set `app_metadata.role = site_editor` on an Auth user if Studio-as-authenticated-role should pass RLS, (4) do not upload gallery files in this change — URLs already point at `/images/osk/…`. Explicit: the implementer hat does not run these against production.

### Success Criteria:

#### Automated Verification:

- `node scripts/verify-content-seed.mjs` exits 0
- `npm run lint` passes
- `npm run build` passes (site still Markdown-backed; no route changes)

#### Manual Verification:

- Owner-hat local path (optional if Docker is unavailable): `npx supabase start` then `npx supabase db reset`; Studio shows `site_copy` / `pages` / `nav_slots` / `articles` / `media` populated; gallery `url` values are `/images/osk/fleet-02.webp` etc.; article bodies are empty strings
- Owner-hat hosted path: follow `supabase/APPLY.md` against the real project when ready — not as part of the implementer commit
- Public site still renders from Markdown; no visual change required

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase. Phase blocks use plain bullets — the corresponding `- [ ]` checkboxes for these items live in the `## Progress` section at the bottom of the plan.

---

## Testing Strategy

### Unit Tests:

- No test runner in this repo; do not add one. The verify script is the deterministic check (catalog ↔ seed).

### Integration Tests:

- None in CI. Local `supabase db reset` is a manual owner-hat proof, not a GitHub Actions job.

### Manual Testing Steps:

1. Open `supabase/key-catalog.json` and confirm cennik / nav / six articles look like the live site.
2. Run `node scripts/verify-content-seed.mjs`.
3. If Docker is available, `npx supabase db reset` and inspect tables in Studio.
4. Load `/` and `/artykuly` in the app and confirm they still come from Markdown.

## Performance Considerations

Seed size is small (tens to low hundreds of keys, local OSK copy). No indexes beyond PKs/uniques are required in this slice. Anon SELECT of `site_copy` by primary key is the S-01 access pattern — PK is enough.

## Migration Notes

- First product migration in this repo; no existing data to migrate.
- Re-running `seed.sql` updates values to match the catalog (`on conflict do update`). It will not delete keys removed from the catalog — if a key is dropped, add a follow-up DELETE in that change or document it in APPLY.md.
- After the owner applies the seed, Markdown remains live until S-01. Applying SQL early is safe; it does not change the public site.
- Rollback: `drop` the five tables, helper, policies, and `osk-media` bucket in a reverse migration if needed. No production content exists before the first apply.

## References

- PRD: `context/foundation/prd-v2.md` (US-01, US-02, US-03; FR-008, FR-010)
- Roadmap F-01: `context/foundation/roadmap.md`
- Shape decisions: `context/foundation/shape-notes.md` (key taxonomy, who runs scripts, image split)
- Content schema: `src/content.config.ts`
- Page loader: `src/lib/content/pages.ts`
- Nav chrome: `src/lib/site-nav.ts`
- Copy sources: `src/content/pages/*.md`, stub `.astro` titles, `StubPage.astro` placeholder
- Supabase client (untouched): `src/lib/supabase.ts`
- CLI seed path: `supabase/config.toml` `[db.seed]`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles. See `references/progress-format.md`.

### Phase 1: Schema, RLS, and Storage bucket

#### Automated

- [x] 1.1 Migration file exists under `supabase/migrations/` with the `_content_store_schema.sql` suffix
- [x] 1.2 SQL creates `site_copy`, `pages`, `nav_slots`, `articles`, `media`
- [x] 1.3 SQL enables RLS on each of those tables and defines `is_site_editor()`
- [x] 1.4 SQL creates Storage bucket `osk-media`
- [x] 1.5 `src/types.ts` exports the visibility / kind unions and the five row types
- [x] 1.6 `npm run lint` passes

#### Manual

- [ ] 1.7 Read the migration: hidden-article SELECT cannot see `visibility = 'hidden'` rows; anon has no write policies
- [ ] 1.8 Confirm bucket is public-read and created with no objects

### Phase 2: Key catalog from current copy

#### Automated

- [ ] 2.1 `supabase/key-catalog.json` parses as JSON
- [ ] 2.2 Copy keys are unique and match the `site_copy.key` regex
- [ ] 2.3 Every coverage group listed above is present (9 content bodies, 14 stub bodies, 6 articles, 6 gallery alts, full nav+footer+chrome)
- [ ] 2.4 No keys whose `source` is a form component or `index.astro` section heading

#### Manual

- [ ] 2.5 Spot-check `cennik` price keys against `cennik.md` (8 rows; only existing `price`/`note` fields)
- [ ] 2.6 Spot-check article slugs/titles against the six `artykuly.md` teasers
- [ ] 2.7 Confirm home/artykuly teaser titles are not duplicated as page-level `news_*` keys

### Phase 3: Seed SQL, sync check, owner apply note

#### Automated

- [ ] 3.1 `node scripts/verify-content-seed.mjs` exits 0
- [ ] 3.2 `npm run lint` passes
- [ ] 3.3 `npm run build` passes (site still Markdown-backed; no route changes)

#### Manual

- [ ] 3.4 Owner-hat local path (optional if Docker is unavailable): `npx supabase start` then `npx supabase db reset`; Studio shows `site_copy` / `pages` / `nav_slots` / `articles` / `media` populated; gallery `url` values are `/images/osk/fleet-02.webp` etc.; article bodies are empty strings
- [ ] 3.5 Owner-hat hosted path: follow `supabase/APPLY.md` against the real project when ready — not as part of the implementer commit
- [ ] 3.6 Public site still renders from Markdown; no visual change required
