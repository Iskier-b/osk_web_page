# MVP scope & handoff

Classification for later slices (S-01 stubs, S-02 copy, S-04 deep path, S-05 inert forms). Derived from `sitemap.md`, `sections.md`, `forms-integrations.md`, and `crawl-inventory.md`.

**Locked planning rule:** Maximal **structure** (almost all content URLs appear in nav/stubs). Expand **copy targets** to all primary nav destinations plus Zapisy as primary enrollment entry. Deep children stay title-only stubs except one recommended representative path. This document does **not** authorize inventing body copy.

---

## MVP-in (structure)

URLs that must appear in navigation / stub parity (S-01). Paths match source; no invented slugs.

### Depth 0–1 — chrome, primary, enrollment, legal

| Path                    | PL label             | Role                                |
| ----------------------- | -------------------- | ----------------------------------- |
| `/`                     | —                    | Homepage                            |
| `/nasza-auto-szkola`    | O nas                | Primary nav                         |
| `/artykuly`             | Aktualności          | Primary nav (blog **listing** only) |
| `/kursy`                | Oferta               | Primary nav                         |
| `/cennik`               | Cennik               | Primary nav                         |
| `/galeria`              | Galeria              | Primary nav                         |
| `/porady-dla-kursanta`  | Strefa kursanta      | Primary nav + Strefa hub            |
| `/kontakt`              | Kontakt              | Primary nav                         |
| `/zapisy-na-kurs`       | Zapisy na kurs       | Top-bar / enrollment CTA            |
| `/polityka-prywatnosci` | Polityka prywatności | Footer legal                        |
| `/regulamin`            | Regulamin            | Footer legal                        |

### Depth 2 — Strefa children (title-only stubs unless chosen as deep path)

| Path                       | PL label                |
| -------------------------- | ----------------------- |
| `/wymogi-formalne`         | Wymogi formalne         |
| `/pytania-egzaminacyjne`   | Pytania egzaminacyjne   |
| `/trasy-egzaminacyjne`     | Trasy egzaminacyjne     |
| `/trudne-skrzyzowania`     | Trudne skrzyżowania     |
| `/filmy-instruktazowe`     | Filmy instruktażowe     |
| `/nasi-instruktorzy`       | Nasi instruktorzy       |
| `/ranking-auto-szkol-lodz` | Ranking auto szkół Łódź |

### Depth 2 — offer / location siblings (title-only stubs unless on deep path)

| Path                       | PL label                       |
| -------------------------- | ------------------------------ |
| `/jazdy-doszkalajace`      | Jazdy doszkalające             |
| `/prawo-jazdy-automat`     | Prawo jazdy w automacie        |
| `/prawo-jazdy-na-motocykl` | Prawo jazdy na motocykl A i A2 |
| `/referencje`              | Opinie                         |
| `/wspolpraca`              | Współpraca                     |
| `/auto-szkola-zgierz`      | Kursy Zgierz                   |
| `/auto-szkola-retkinia`    | Retkinia                       |

PDF footer links are **not** structure stubs — see registry below (asset-only).

---

## MVP-in (copy targets)

Pages that receive source-faithful body copy in S-02 (and related content slices). Explicit list:

| Path                   | PL label                                                          |
| ---------------------- | ----------------------------------------------------------------- |
| `/`                    | Homepage                                                          |
| `/nasza-auto-szkola`   | O nas                                                             |
| `/artykuly`            | Aktualności (listing shell / teasers only — not individual posts) |
| `/kursy`               | Oferta                                                            |
| `/cennik`              | Cennik                                                            |
| `/galeria`             | Galeria                                                           |
| `/porady-dla-kursanta` | Strefa kursanta (hub)                                             |
| `/kontakt`             | Kontakt                                                           |
| `/zapisy-na-kurs`      | Zapisy na kurs                                                    |

Zapisy is included as the primary enrollment entry (top-bar CTA + homepage mid-page CTA).

Legal pages (`/polityka-prywatnosci`, `/regulamin`) remain structure-in; treat copy as later/legal follow-up unless a slice explicitly expands them — not required for the primary-nav copy set.

---

## MVP-out / document-only

Documented for awareness; **not** build targets for F-01 / early MVP slices.

| Item                                               | Notes                                                            |
| -------------------------------------------------- | ---------------------------------------------------------------- |
| Individual blog posts (`/artykul-*`)               | Listing node `/artykuly` only; archive posts out                 |
| PDF bodies as Astro pages                          | Serve/link as static assets if needed; not content-page stubs    |
| Live form POST backends                            | Enrollment, contact, referencje processing / email / CRM         |
| Live reCAPTCHA verification                        | Widgets documented; server secrets / challenges out of early MVP |
| Live analytics (UA-77054718-1)                     | Documented; do not wire UA into rebuild without a later decision |
| Live maps / social embeds as product scope         | Documented in `forms-integrations.md`; chrome links OK later     |
| Student login / kursant portal                     | **Not observed** on source                                       |
| Payment gateway                                    | **Not observed** on source                                       |
| Starter auth / dashboard (`/auth/*`, `/dashboard`) | Astro starter residue — out of OSK MVP product surface           |
| Invented body copy for deep stubs                  | Title-only until a slice copies a chosen path                    |
| Fixing source `sitemap.xml`                        | Out of scope for this pack                                       |

---

## Stub policy reminder

- Deep / non–copy-target pages: **title-only** placeholders (PL label + path).
- **Do not invent** marketing body, fake prices, or placeholder lorem.
- **No empty dead links** in nav/footer/hub — every listed structure URL resolves to a stub or real page.
- Asset-only PDFs: link to files (or honest “document” treatment), not fake HTML pages.
- Unreachable URLs (if any appear in a later crawl): stub honestly with status/reason from the registry — do not silently drop.

---

## Recommendations (not locked)

These inform S-04 / S-05 planning. Roadmap / slice plans must **confirm** before treating as final.

### FR-005 deep path (exactly one proposal)

**Recommendation (not locked):** `/kursy` → `/prawo-jazdy-automat` → `/kontakt`

| Step | Path                   | Why in the journey                                                                                                                                                      |
| ---- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | `/kursy`               | Offer hub (primary nav) — candidate starts comparing the school’s courses                                                                                               |
| 2    | `/prawo-jazdy-automat` | Offer sibling for automatic-transmission license — distinct selling point surfaced on the homepage accordion; exercises a real depth-2 product page, not a trivial leaf |
| 3    | `/kontakt`             | Conversion / ask — closes the owner-visible journey (browse offer → specific product → contact)                                                                         |

**Rationale:** Representative owner/candidate path: primary Oferta → a concrete product child → Kontakt. Stronger demo than the easiest single stub (e.g. hub-only or a shallow legal page). Alternates considered but not recommended here: Strefa `/porady-dla-kursanta` → `/wymogi-formalne` → `/kontakt` (also strong; prefer offer product journey for S-04 unless product later prioritizes PKK formalities).

### S-05 inert forms (non-empty)

**Recommendation (not locked):** Build inert UI (visible fields, submit disabled / no live POST) for all four documented surfaces:

| Surface                    | Location          |
| -------------------------- | ----------------- |
| Rejestracja na kurs (hero) | `/`               |
| Rejestracja / zapis        | `/zapisy-na-kurs` |
| Kontakt                    | `/kontakt`        |
| Opinia / referencja        | `/referencje`     |

Mirror field labels and captcha **presence** from `forms-integrations.md`. Do not invent student login or payment forms.

---

## Unreachable / asset-only registry

Consolidated from `crawl-inventory.md` (crawl 2026-08-09).

| URL                                                                                           | Status     | Reason                                                            |
| --------------------------------------------------------------------------------------------- | ---------- | ----------------------------------------------------------------- |
| `/simply/files/dynamic/media/Standardy-ochrony-maloletnich-auto-szkola-juszczak.pdf`          | asset-only | HTTP 200; `Content-Type: application/pdf` — not an HTML page stub |
| `/simply/files/dynamic/media/Standardy-ochrony-maloletnich-auto-szkola-juszczak-skrocona.pdf` | asset-only | HTTP 200; `Content-Type: application/pdf` — not an HTML page stub |

**Unreachable:** none in the Phase 1 seed (all inventoried HTML destinations returned HTTP 200). If a later crawl marks a URL `unreachable`, append here and treat inventory status as source of truth for S-01.

---

## Open items for later slices

| Item                                        | When                        | Note                                                |
| ------------------------------------------- | --------------------------- | --------------------------------------------------- |
| Confirm FR-005 deep path                    | S-04 plan time              | Accept or replace the unlocked recommendation above |
| Confirm S-05 inert form list                | S-05 plan time              | Accept all four surfaces or narrow with rationale   |
| Legal page copy depth                       | S-02+ / legal follow-up     | Structure-in; copy not in primary-nav copy set      |
| PDF hosting strategy                        | S-01 / assets               | Static public files vs external link                |
| Analytics / maps / reCAPTCHA product choice | Post-MVP or dedicated slice | Documented only in this pack                        |
| Blog post migration                         | Explicit future decision    | Listing only unless scope expands                   |
| Re-crawl if source IA drifts                | Before S-01 if stale        | Prefer HTML nav/footer/hub over `sitemap.xml`       |
