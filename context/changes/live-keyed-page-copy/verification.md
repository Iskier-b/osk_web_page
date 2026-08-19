# S-01 verification checklist

Prerequisite: apply F-01 schema + seed per [supabase/APPLY.md](../../supabase/APPLY.md) (local: `npx supabase db reset`).

## Live edit (US-01)

1. Start dev server: `npm run dev`
2. Open `/` — note current hero title
3. In Supabase Studio, edit `site_copy` row `osk.home.hero_title`
4. Refresh `/` — updated text appears without rebuild

## Missing key (US-03)

1. Delete a non-critical row (e.g. `osk.cennik.price_8_price`)
2. Open `/cennik` — that slot shows the key string, not 500 or blank

## Hidden page

1. Set `pages.visibility = 'hidden'` for a stub slug (e.g. `regulamin`)
2. Open `/regulamin` — HTTP 404
3. Restore visibility to `displayed`

## Gallery from store

1. Change `media.url` for `home_gallery_1`
2. Refresh `/` — first gallery image uses new URL

## Supabase unavailable

1. Unset `SUPABASE_URL` in `.dev.vars` (or stop local Supabase)
2. Restart dev server, open `/cennik`
3. Page renders with lookup keys in text slots — no crash

## Mobile layout

1. DevTools 375px width on `/` and `/cennik`
2. No horizontal scroll; nav usable
