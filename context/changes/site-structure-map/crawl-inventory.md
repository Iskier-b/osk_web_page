# Crawl inventory seed

Working URL inventory from HTML crawl of https://www.autojuszczak.com.pl/ (2026-08-09). Seed for Phase 2+ structure docs — not a substitute for `sitemap.md`.

**Rules applied:** seed from primary nav + footer Mapa strony + Strefa hub (`/porady-dla-kursanta`) + offer siblings linked from homepage/`/kursy`. Blog = listing `/artykuly` only (no per-post rows). PDFs = `asset-only`. Statuses from `curl.exe` HTTP codes (`ok` = HTTP 200 HTML page).

## Status legend

| Status | Meaning |
| ------ | ------- |
| `ok` | HTTP 200, HTML page fetched |
| `unreachable` | Timeout, non-success HTTP, or fetch error (reason in notes) |
| `asset-only` | Non-HTML deliverable (e.g. PDF); not a page to stub as content |

## Discovery source legend

| Source | Meaning |
| ------ | ------- |
| `nav` | Primary navbar or top-bar CTA |
| `footer` | Footer / Mapa strony / legal strip |
| `hub` | Linked from Strefa hub `/porady-dla-kursanta` content |
| `inline` | Linked from homepage and/or `/kursy` body (offer siblings, location pages) |

## Inventory

| URL | PL label (if known) | Discovery source | Status | Notes |
| --- | ------------------- | ---------------- | ------ | ----- |
| `/` | — | nav | ok | Homepage; HTTP 200 |
| `/nasza-auto-szkola` | O nas | nav | ok | Also in footer Mapa strony |
| `/artykuly` | Aktualności | nav | ok | Blog **listing only**; paginated archive exists on source; individual `artykul-*` URLs not inventoried |
| `/kursy` | Oferta | nav | ok | Also in footer Mapa strony |
| `/cennik` | Cennik | nav | ok | Also in footer Mapa strony; homepage also labels “Cena za kurs” |
| `/galeria` | Galeria | nav | ok | Also in footer Mapa strony |
| `/porady-dla-kursanta` | Strefa kursanta | nav | ok | Strefa hub; also in footer Mapa strony |
| `/kontakt` | Kontakt | nav | ok | |
| `/zapisy-na-kurs` | Zapisy na kurs | nav | ok | Top-bar CTA; homepage also “ZOSTAŃ NASZYM KURSANTEM” |
| `/polityka-prywatnosci` | Polityka prywatności | footer | ok | Legal; also cookie banner / footer “Polityka prywatności serwisu” |
| `/regulamin` | Regulamin | footer | ok | Legal; footer Mapa strony |
| `/simply/files/dynamic/media/Standardy-ochrony-maloletnich-auto-szkola-juszczak.pdf` | Standardy ochrony małoletnich | footer | asset-only | HTTP 200; `Content-Type: application/pdf` |
| `/simply/files/dynamic/media/Standardy-ochrony-maloletnich-auto-szkola-juszczak-skrocona.pdf` | Standardy ochrony małoletnich wersja skrócona | footer | asset-only | HTTP 200; `Content-Type: application/pdf` |
| `/wymogi-formalne` | Wymogi formalne | hub | ok | Strefa child; homepage accordion “Wymogi formalne - numer PKK” |
| `/pytania-egzaminacyjne` | Pytania egzaminacyjne | hub | ok | Strefa child |
| `/trasy-egzaminacyjne` | Trasy egzaminacyjne | hub | ok | Strefa child |
| `/trudne-skrzyzowania` | Trudne skrzyżowania | hub | ok | Strefa child |
| `/filmy-instruktazowe` | Filmy instruktażowe | hub | ok | Strefa child |
| `/nasi-instruktorzy` | Nasi instruktorzy | hub | ok | Strefa child; also linked from homepage/`/kursy` |
| `/ranking-auto-szkol-lodz` | Ranking auto szkół Łódź | hub | ok | Strefa child (hub label “RANKING”); homepage accordion title |
| `/jazdy-doszkalajace` | Jazdy doszkalające | inline | ok | Offer sibling from homepage/`/kursy` |
| `/prawo-jazdy-automat` | Prawo jazdy w automacie | inline | ok | Offer sibling from homepage/`/kursy` |
| `/prawo-jazdy-na-motocykl` | Prawo jazdy na motocykl A i A2 | inline | ok | Offer sibling from homepage/`/kursy` |
| `/referencje` | Opinie | inline | ok | Linked from homepage/`/kursy` accordion |
| `/wspolpraca` | Współpraca | inline | ok | Linked from homepage/`/kursy` accordion |
| `/auto-szkola-zgierz` | Kursy Zgierz | inline | ok | Location/offer sibling; top-bar CTA currently HTML-commented but URL still linked on pages |
| `/auto-szkola-retkinia` | Retkinia | footer | ok | Also homepage/footer location link |

## Intentionally omitted

| Pattern | Reason |
| ------- | ------ |
| `/artykul-*` (individual posts) | Blog depth locked to listing (`/artykuly`) only |
| Static CSS/JS/images under `simply/`, `css/`, `js/`, `images/` | Build assets, not IA destinations |
| External social/maps/review URLs | Integrations — Phase 3 (`forms-integrations.md`), not page inventory |

## Crawl notes

- Fetch tool: `curl.exe -sL --max-time 25` against https://www.autojuszczak.com.pl
- All table HTML destinations above returned HTTP 200 on 2026-08-09; no `unreachable` rows in this seed
- `/sitemap.xml` returned HTTP 200 with `application/xml` during this crawl (plan recon had HTTP 500). **Not used as inventory seed** — HTML nav/footer/hub remain the source of truth for this pack
