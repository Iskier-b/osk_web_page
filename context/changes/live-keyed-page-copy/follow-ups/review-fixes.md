# Review follow-ups — live-keyed-page-copy

From impl-review F7 (partial). Run [verification.md](../verification.md) with local Supabase (`npx supabase db reset` + Docker).

- [ ] 2.3 `loadPublicPage('cennik')` returns seeded price rows
- [ ] 2.4 Deleted copy row surfaces key in mapped view
- [ ] 2.5 Unknown slug returns notFound
- [ ] 3.4 All 25 public URLs render with seed applied
- [ ] 3.5 Gallery on `/` and `/galeria` from store media
- [ ] 3.6 Home news teasers still from Markdown
- [ ] 3.7 Stub body editable via store
- [ ] 3.8 375px layout spot-check
- [ ] 4.4 Live edit visible without rebuild
- [ ] 4.5 Missing key shows lookup key in slot
- [ ] 4.6 Hidden page returns 404
- [ ] 4.7 Gallery URL change visible
- [ ] 4.8 Supabase-down shows keys (no 500) — code fixed in F1 triage; re-verify manually
- [ ] 4.9 Mobile 375px spot-check
