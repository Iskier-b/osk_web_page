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

---

# Source harvest — Phase 3 hub + light media

Harvest date: 2026-08-09. Live source: https://www.autojuszczak.com.pl/  
Cross-checked against F-01: `sections.md` (Strefa hub tile grid), `sitemap.md` / `mvp-scope.md` (listing-only blog; light Galeria).

## Source URL → target route

| Source URL | Target route | Content used |
| ---------- | ------------ | ------------ |
| https://www.autojuszczak.com.pl/porady-dla-kursanta | `/porady-dla-kursanta` | Hub landing: Strefa tile titles → `strefaChildren`; „Doświadczenie poparte faktami!” blurb (1999, Łódź / Aleksandrów, Hyundai) |
| https://www.autojuszczak.com.pl/galeria | `/galeria` | Headline „Zobacz naszą galerię firmową”; 1–3 fleet images from Phase 2 download (not full Lightbox album) |
| https://www.autojuszczak.com.pl/artykuly | `/artykuly` | Listing shell: first-page article titles + short summaries only; no `/artykul-*` routes |

## Images reused (Phase 2 assets)

| Local file | Used on Phase 3 | Notes |
| ---------- | --------------- | ----- |
| `fleet-02.webp` … `fleet-04.webp` | `/galeria` preview strip | Same gallery-images sources as Phase 2; no new album download |
| `news-teaser-01.jpg` | `/artykuly` teaser figure | Reserved in Phase 2 harvest; source `/simply/images/dynamic/articles/95.jpg` |

## Clarity / hierarchy rewrites (no new facts)

- Strefa hub: short intro sentence names the tile topics already present on source hub (no invented depth-2 body).
- SCREAMING article titles normalized to sentence case (same approach as home news teasers).
- Galeria page on source is mostly reviews + Lightbox; Phase 3 keeps **light blurb + 3 fleet stills** only — reviews left to Opinie/home teasers, not duplicated here.
- Aktualności listing shows titles/summaries without per-post links (posts intentionally out of scope).

## Gaps (not invented)

- Full gallery Lightbox set / pagination not migrated.
- Individual article bodies and `/artykul-*` routes not created.
- Depth-2 Strefa children remain stubs.
- `/kontakt` and `/zapisy-na-kurs` left on StubPage (`Treść w przygotowaniu`).

---

# Phase 4 — Fidelity checklist (2026-08-09)

Cross-check against live https://www.autojuszczak.com.pl/ (home, `/nasza-auto-szkola`, `/kursy`, `/cennik`, `/porady-dla-kursanta`, `/galeria`, `/artykuly`). No content invention in this pass.

| Claim type | Result | Notes |
| ---------- | ------ | ----- |
| Prices | OK | Cennik rows match source: 3900 / 3950 / 4900 / 135 / 1300 / 490 / 150 / 1450; intro **1350 zł** kept; dashboard **3900,00 PLN** kept. Ambiguous homepage **3550 zł** still omitted (Phase 2 gap). |
| Phones | OK | Filled pages surface **510 285 635** (nav + O nas). Landline **42 236 61 90** still only in source footer — not added. |
| Addresses / hours | OK | **ul. Rydzowa 2, 91-211 Łódź**; **Pon. – Pt. 10:00 – 18:00**; plac **ul. Maratońskiej (Retkinia)**; transit lines 78 / 6 on O nas. |
| Ranking claims | OK | Home pitch „W rankingu zdawalności WORD Łódź zawsze na czołowych miejscach” is source text. Homepage „2. miejsce… 2018” not added to filled stack (still deferred). |
| Course / offer names | OK | Kat. B, automat (kod 78 / Honda Jazz), ekspresowy, jazdy doszkalające, weekendowy / popołudniowy schedule cues match source. |
| Review / news blurbs | OK | Authors + shortened quotes from live review list; article titles/summaries from listing — no invented post bodies. |

## Clarity rewrites confirmed (no new facts)

- Typo fix „pawa” → „prawa”; date spacing; sentence-case CTAs / news titles (Phases 2–3).
- Cennik account number presented on its own line as monospace for narrow viewports (same digits as source).
- No unverified claims found that required removal in Phase 4.

## Regression (stubs)

- `/kontakt`, `/zapisy-na-kurs`, and all depth-2 StubPage routes still title-only with meta **Treść w przygotowaniu**.
- Oferta / Strefa hubs still link via `ofertaChildren` / `strefaChildren` only.
