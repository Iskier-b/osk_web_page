# Applying the content store (owner hat)

These steps apply the F-01 schema and seed to a Supabase project. **The implementer does not run these against production** — switch to the owner hat when you are ready.

## Order matters

1. **Migration** — apply `supabase/migrations/*_content_store_schema.sql`
   - Hosted: Supabase Dashboard → SQL Editor → paste and run the migration file, **or** `npx supabase db push` from a linked project.
   - Local (Docker): `npx supabase start` then `npx supabase db reset` (runs migrations + seed in one step).

2. **Seed** — apply `supabase/seed.sql`
   - Required on hosted/`db push` paths: `db push` applies migrations only; seed is separate.
   - Local `db reset` already runs seed via `supabase/config.toml` `[db.seed] sql_paths`.
   - Safe to re-run: inserts use `on conflict … do update`.

3. **Optional — site_editor role** — if authenticated Studio/API users (not the project owner) should pass RLS write policies, set `app_metadata.role = site_editor` on that Auth user in Dashboard → Authentication → Users.

4. **Gallery files** — do **not** upload binaries in this change. Media rows already point at static paths such as `/images/osk/fleet-02.webp`. The `osk-media` bucket is created empty for future uploads.

## Visibility and copy keys

Page and article **visibility** (`hidden` / `displayed` / `pinned`) gates rows in `pages`, `articles`, and article-linked `media` — not `site_copy`. Anon can still `SELECT` any `site_copy` row by key. S-01 consumers must resolve visibility via the registry tables before displaying stored text; do not assume hiding a page hides its copy keys.

## Verify before apply

```bash
node scripts/verify-content-seed.mjs
```

Ensures `key-catalog.json` and `seed.sql` stay in sync.

## Regenerating catalog and seed after copy edits

After changing Markdown, `site-nav.ts`, or stub titles, regenerate the catalog and seed from repo sources:

```bash
node scripts/build-key-catalog.mjs
node scripts/verify-content-seed.mjs
```

Then re-apply `seed.sql` on hosted projects (step 2 above). Local `db reset` picks up the new seed automatically.

## Rollback

Drop the five public tables (`site_copy`, `pages`, `nav_slots`, `articles`, `media`), the `is_site_editor()` function, related RLS policies, and the `osk-media` storage bucket if you need to undo before S-01 goes live. No production content exists until the first apply.

## Note on removed keys

Re-running seed updates values but does not delete keys removed from the catalog. If a key is dropped later, add an explicit `DELETE` in that change or document cleanup here.
