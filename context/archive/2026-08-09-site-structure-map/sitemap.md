# Sitemap & menus

Source information architecture for https://www.autojuszczak.com.pl/ (HTML nav / footer / Strefa hub / inline offer siblings). Seed statuses from [`crawl-inventory.md`](./crawl-inventory.md). Blog depth = listing `/artykuly` only.

**Hierarchy depth legend**

| Depth | Meaning                                                                                |
| ----- | -------------------------------------------------------------------------------------- |
| 0     | Site root / chrome CTAs                                                                |
| 1     | Primary nav destinations                                                               |
| 2     | Cluster children (Strefa hub) or offer/location siblings linked from homepage/`/kursy` |
| asset | Non-HTML PDF (not a page stub target)                                                  |

**Status note:** As of the Phase 1 crawl seed, every HTML destination below is `ok`. No `unreachable` rows to flag; if a later crawl marks one, treat inventory status as source of truth.

---

## Primary nav

Ordered left-to-right as on source navbar (`ul.nav.navbar-nav`).

| Order | PL label        | Path                   | Depth | Inventory status | Proposed Astro slug    |
| ----- | --------------- | ---------------------- | ----- | ---------------- | ---------------------- |
| —     | (logo home)     | `/`                    | 0     | ok               | `/`                    |
| 1     | O nas           | `/nasza-auto-szkola`   | 1     | ok               | `/nasza-auto-szkola`   |
| 2     | Aktualności     | `/artykuly`            | 1     | ok               | `/artykuly`            |
| 3     | Oferta          | `/kursy`               | 1     | ok               | `/kursy`               |
| 4     | Cennik          | `/cennik`              | 1     | ok               | `/cennik`              |
| 5     | Galeria         | `/galeria`             | 1     | ok               | `/galeria`             |
| 6     | Strefa kursanta | `/porady-dla-kursanta` | 1     | ok               | `/porady-dla-kursanta` |
| 7     | Kontakt         | `/kontakt`             | 1     | ok               | `/kontakt`             |

### Top-bar CTAs (chrome, not primary-nav list items)

| PL label / control  | Path or target        | Depth | Inventory status | Notes                                                                        |
| ------------------- | --------------------- | ----- | ---------------- | ---------------------------------------------------------------------------- |
| 510 285 635         | `tel:510285635`       | 0     | —                | Phone CTA                                                                    |
| Zapisy na kurs      | `/zapisy-na-kurs`     | 0–1   | ok               | Top-bar success button; also homepage CTA                                    |
| Kursy Zgierz        | `/auto-szkola-zgierz` | 2     | ok               | Top-bar link HTML-commented; URL still linked elsewhere — see offer siblings |
| Facebook / You tube | external              | —     | —                | Social chrome; not IA destinations (Phase 3)                                 |

### Tree (depth)

```
/ (0)
├── /nasza-auto-szkola — O nas (1)
├── /artykuly — Aktualności (1) [blog listing only]
├── /kursy — Oferta (1)
├── /cennik — Cennik (1)
├── /galeria — Galeria (1)
├── /porady-dla-kursanta — Strefa kursanta (1)
│   └── [Strefa children — see Strefa cluster]
├── /kontakt — Kontakt (1)
└── /zapisy-na-kurs — Zapisy na kurs (top-bar CTA)
```

---

## Footer / secondary menus

Footer chrome lives in `#sitemap` (four columns) plus legal strip `#footer`. Cookie notice is `#cookies` (sitewide chrome; see `sections.md`).

### Footer columns (`#sitemap`)

| Column (PL heading) | Role              | Links / content                                                                                         |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------------------- |
| O Auto Szkole       | Blurb + address   | Short school copy; `ul. Rydzowa 2, 91-211 Łódź`; share tile “Pobierz i prześlij dalej” → `/kontakt`     |
| Kontakt             | Contact shortcuts | Email/phone/hours pointing at `/kontakt` and `tel:`                                                     |
| Aktualności         | News teaser list  | Truncated titles → individual `artykul-*` posts (**not inventoried**; listing node remains `/artykuly`) |
| Mapa strony         | Secondary menu    | Ordered link list below                                                                                 |

### Mapa strony (ordered)

| Order | PL label                                      | Path                    | Depth | Inventory status | Proposed Astro slug     |
| ----- | --------------------------------------------- | ----------------------- | ----- | ---------------- | ----------------------- |
| 1     | O nas                                         | `/nasza-auto-szkola`    | 1     | ok               | `/nasza-auto-szkola`    |
| 2     | Oferta                                        | `/kursy`                | 1     | ok               | `/kursy`                |
| 3     | Cennik                                        | `/cennik`               | 1     | ok               | `/cennik`               |
| 4     | Galeria                                       | `/galeria`              | 1     | ok               | `/galeria`              |
| 5     | Strefa kursanta                               | `/porady-dla-kursanta`  | 1     | ok               | `/porady-dla-kursanta`  |
| 6     | Polityka prywatności                          | `/polityka-prywatnosci` | 1     | ok               | `/polityka-prywatnosci` |
| 7     | Regulamin                                     | `/regulamin`            | 1     | ok               | `/regulamin`            |
| 8     | Standardy ochrony małoletnich                 | PDF path below          | asset | asset-only       | n/a (static asset)      |
| 9     | Standardy ochrony małoletnich wersja skrócona | PDF path below          | asset | asset-only       | n/a (static asset)      |

### Legal strip (`#footer`)

| PL label                     | Path                    | Depth | Inventory status | Notes                                |
| ---------------------------- | ----------------------- | ----- | ---------------- | ------------------------------------ |
| Polityka prywatności serwisu | `/polityka-prywatnosci` | 1     | ok               | Same legal page as Mapa strony entry |
| Retkinia                     | `/auto-szkola-retkinia` | 2     | ok               | Location sibling in copyright line   |

### Legal / PDF entries

| PL label                                      | Path                                                                                          | Depth | Inventory status | Proposed Astro slug                          |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- | ----- | ---------------- | -------------------------------------------- |
| Polityka prywatności                          | `/polityka-prywatnosci`                                                                       | 1     | ok               | `/polityka-prywatnosci`                      |
| Regulamin                                     | `/regulamin`                                                                                  | 1     | ok               | `/regulamin`                                 |
| Standardy ochrony małoletnich                 | `/simply/files/dynamic/media/Standardy-ochrony-maloletnich-auto-szkola-juszczak.pdf`          | asset | asset-only       | serve as static/PDF link — not an Astro page |
| Standardy ochrony małoletnich wersja skrócona | `/simply/files/dynamic/media/Standardy-ochrony-maloletnich-auto-szkola-juszczak-skrocona.pdf` | asset | asset-only       | serve as static/PDF link — not an Astro page |

---

## Strefa cluster

Hub: **Strefa kursanta** → `/porady-dla-kursanta` (primary nav + Mapa strony).

Children ordered as tile grid on the hub (`div.row.blocks`), then ranking CTA on hub body.

| Order | PL label (hub)          | Path                       | Depth | Inventory status | Proposed Astro slug        |
| ----- | ----------------------- | -------------------------- | ----- | ---------------- | -------------------------- |
| hub   | Strefa kursanta         | `/porady-dla-kursanta`     | 1     | ok               | `/porady-dla-kursanta`     |
| 1     | Wymogi formalne         | `/wymogi-formalne`         | 2     | ok               | `/wymogi-formalne`         |
| 2     | Pytania egzaminacyjne   | `/pytania-egzaminacyjne`   | 2     | ok               | `/pytania-egzaminacyjne`   |
| 3     | Trasy egzaminacyjne     | `/trasy-egzaminacyjne`     | 2     | ok               | `/trasy-egzaminacyjne`     |
| 4     | Trudne skrzyżowania     | `/trudne-skrzyzowania`     | 2     | ok               | `/trudne-skrzyzowania`     |
| 5     | Filmy instruktażowe     | `/filmy-instruktazowe`     | 2     | ok               | `/filmy-instruktazowe`     |
| 6     | Nasi instruktorzy       | `/nasi-instruktorzy`       | 2     | ok               | `/nasi-instruktorzy`       |
| 7     | Ranking auto szkół Łódź | `/ranking-auto-szkol-lodz` | 2     | ok               | `/ranking-auto-szkol-lodz` |

Hub button label for #7 is **RANKING** (verbatim on hub CTA); inventory / homepage accordion title: **Ranking auto szkół Łódź**.

### Tree (depth)

```
/porady-dla-kursanta — Strefa kursanta (1)
├── /wymogi-formalne — Wymogi formalne (2)
├── /pytania-egzaminacyjne — Pytania egzaminacyjne (2)
├── /trasy-egzaminacyjne — Trasy egzaminacyjne (2)
├── /trudne-skrzyzowania — Trudne skrzyżowania (2)
├── /filmy-instruktazowe — Filmy instruktażowe (2)
├── /nasi-instruktorzy — Nasi instruktorzy (2)
└── /ranking-auto-szkol-lodz — Ranking auto szkół Łódź (2)
```

Homepage accordion (`#news` / Strefa panel) also surfaces several of these titles plus offer siblings — see Offer-related siblings and `sections.md`.

---

## Offer-related siblings

Linked from homepage accordion and/or `/kursy` body (discovery source `inline` in inventory). Not primary-nav items.

| PL label                       | Path                       | Depth | Inventory status | Proposed Astro slug        |
| ------------------------------ | -------------------------- | ----- | ---------------- | -------------------------- |
| Jazdy doszkalające             | `/jazdy-doszkalajace`      | 2     | ok               | `/jazdy-doszkalajace`      |
| Prawo jazdy w automacie        | `/prawo-jazdy-automat`     | 2     | ok               | `/prawo-jazdy-automat`     |
| Prawo jazdy na motocykl A i A2 | `/prawo-jazdy-na-motocykl` | 2     | ok               | `/prawo-jazdy-na-motocykl` |
| Opinie                         | `/referencje`              | 2     | ok               | `/referencje`              |
| Współpraca                     | `/wspolpraca`              | 2     | ok               | `/wspolpraca`              |
| Kursy Zgierz                   | `/auto-szkola-zgierz`      | 2     | ok               | `/auto-szkola-zgierz`      |
| Retkinia                       | `/auto-szkola-retkinia`    | 2     | ok               | `/auto-szkola-retkinia`    |

---

## Blog

| PL label    | Path        | Depth | Inventory status | Notes                                                                                                                         |
| ----------- | ----------- | ----- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Aktualności | `/artykuly` | 1     | ok               | **Listing node only**; paginated archive exists on source; individual `/artykul-*` posts intentionally omitted from this pack |

---

## Full IA outline (for S-01 briefing)

```
Depth 0 — chrome
  /  ·  tel CTAs  ·  Zapisy na kurs  ·  social (external)

Depth 1 — primary + legal pages
  O nas → /nasza-auto-szkola
  Aktualności → /artykuly          ← blog listing only
  Oferta → /kursy
  Cennik → /cennik
  Galeria → /galeria
  Strefa kursanta → /porady-dla-kursanta
  Kontakt → /kontakt
  Zapisy na kurs → /zapisy-na-kurs
  Polityka prywatności → /polityka-prywatnosci
  Regulamin → /regulamin

Depth 2 — Strefa children
  → /wymogi-formalne
  → /pytania-egzaminacyjne
  → /trasy-egzaminacyjne
  → /trudne-skrzyzowania
  → /filmy-instruktazowe
  → /nasi-instruktorzy
  → /ranking-auto-szkol-lodz

Depth 2 — offer / location siblings
  → /jazdy-doszkalajace
  → /prawo-jazdy-automat
  → /prawo-jazdy-na-motocykl
  → /referencje
  → /wspolpraca
  → /auto-szkola-zgierz
  → /auto-szkola-retkinia

Asset-only (not pages)
  → Standardy … .pdf
  → Standardy … skrócona.pdf
```

Proposed Astro routes prefer **same path as source** (document-only mapping; no `src/pages/` created in this change).
