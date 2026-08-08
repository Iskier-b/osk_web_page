# Source harvest — Phase 2 core pages

Harvest date: 2026-08-09. Live source: https://www.autojuszczak.com.pl/  
Also cross-checked against F-01 pack: `context/archive/2026-08-09-site-structure-map/sections.md`.

## Source URL → target route

| Source URL | Target route | Content used |
| ---------- | ------------ | ------------ |
| https://www.autojuszczak.com.pl/ | `/` | Hero pitches; dashboard (najbliższe kursy, 3900,00 PLN → cennik, ul. Rydzowa 2 + hours); mid-page Zapisy CTA; about teaser (#about); news titles; review excerpts; gallery image refs |
| https://www.autojuszczak.com.pl/nasza-auto-szkola | `/nasza-auto-szkola` | About body (**Poznaj nas…**), blockquotes, location/transit notes, Precyzja kierowania close |
| https://www.autojuszczak.com.pl/kursy | `/kursy` | Oferta hub body (teoria, I pomoc, pierwsze jazdy, ruch drogowy, egzamin wewnętrzny) + `ofertaChildren` links from nav |
| https://www.autojuszczak.com.pl/cennik | `/cennik` | All listed prices, ratalny schedule, mBank account, plac/kurs hour notes |

## Images downloaded → `public/images/osk/`

| Local file | Source path | Used on | Alt (PL) |
| ---------- | ----------- | ------- | -------- |
| `fleet-01.webp` | `/simply/images/dynamic/gallery-images/1.webp` | Home hero | Samochód szkoleniowy Auto Szkoły Juszczak |
| `fleet-02.webp` | `/simply/images/dynamic/gallery-images/2.webp` | Home gallery teaser; O nas hero | Flota / pojazdy szkoleniowe |
| `fleet-03.webp` | `/simply/images/dynamic/gallery-images/5.webp` | Home gallery; O nas figure | Samochód nauki jazdy |
| `fleet-04.webp` | `/simply/images/dynamic/gallery-images/8.webp` | Home gallery teaser | Pojazd szkoleniowy przed zajęciami |
| `logo-osk.webp` | `/images/logos/auto-szkola-lodz.webp` | Reserved (chrome already has brand text) | — |
| `news-teaser-01.jpg` | `/simply/images/dynamic/articles/95.jpg` | Reserved for Phase 3 Aktualności | — |

## Clarity / hierarchy rewrites (no new facts)

- Source typo „Kursy **pawa** jazdy…” → „Kursy **prawa** jazdy…” on home pitch.
- Dashboard date spacing „2026-08- 8” → „2026-08-08”; en-dash separators for readability.
- CTA button label normalized to sentence case: „Zostań naszym kursantem” (source: „ZOSTAŃ NASZYM KURSANTEM”).
- About / oferta prose lightly paragraph-broken; wording kept source-faithful.
- Review teasers shortened for hierarchy; authors and claims taken from live `/nasza-auto-szkola` review list (same school site), not invented.
- Home about teaser omits ambiguous homepage phrase „Koszt 3550 zł” (conflicts with live cennik / dashboard 3900) — see Gaps.

## Gaps (not invented)

- Individual `/artykul-*` post bodies not fetched; news teasers are titles + short source summaries only, linking to `/artykuly`.
- Full Google-review carousel / Owl / Lightbox not rebuilt — static teasers only.
- Enrollment form UI deferred (CTA → stub `/zapisy-na-kurs`).
- Source cennik lists both **1350 zł** (intro „pakiet 10 godzin”) and **1300 zł** (bullet „Pakiet 10 godzin jazd”) — both recorded; table uses the bullet 1300, intro prose keeps 1350.
- Homepage about also mentions „Koszt 3550 zł” in a dense SEO block that contradicts cennik 3900 — left out of structured prices until owner clarifies.
- Second landline `42 236 61 90` appears in footer chrome source; Phase 2 pages surface mobile `510 285 635` already in site nav + O nas body.
- Hero on source is text-over-CSS background (no dedicated hero photo URL); used a gallery fleet image for recognition.
