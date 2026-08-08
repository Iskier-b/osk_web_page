# Forms, interactive features & integrations

Observed on https://www.autojuszczak.com.pl/ (HTML fetch 2026-08-09 via `curl.exe`). English structure; Polish labels/URLs verbatim.

**Evidence legend**

| Tag | Meaning |
| --- | ------- |
| `HTML` | Inferred from fetched page markup (structure present; submit/UX not exercised) |
| `script` | Present in page `<script>` / linked third-party script tags |

Live form submits, email delivery, and CAPTCHA challenge UX were **not** exercised — all form/backend rows are `HTML` unless noted.

---

## 1. Forms

| Surface | Location | Fields (summary) | Method / action | Captcha | Evidence |
| ------- | -------- | ---------------- | --------------- | ------- | -------- |
| **Rejestracja na kurs** (hero) | `/` | `name` (Imię i nazwisko), `email` (Adres email), `phone` (Numer telefonu), `term` select (Termin kursu + dated options), `agreement` checkbox (RODO consent, default checked); submit **ZAPISZ** (`name="send"`) | `POST` → `action="index"` | None in markup | `HTML` — homepage form beside hero carousel |
| **Rejestracja / zapis** | `/zapisy-na-kurs` | Same core fields as homepage (`name`, `email`, `phone`, `term`, `agreement`) with visible labels (**Twoje dane**, **Email**, **Telefon**, **Termin kursu**); submit **ZAPISZ** | `POST` → `action="zapisy-na-kurs"` | None in markup | `HTML` — dedicated Zapisy page |
| **Kontakt** | `/kontakt` | `name` (Imię i nazwisko), `email`, `phone` (Telefon), `question` textarea (label **Widomość**, placeholder **Twoje pytanie**); submit **WYŚLIJ** | `POST` → `action="kontakt"` | Google reCAPTCHA widget (`g-recaptcha`, sitekey `6LcufnoUAAAAAGkx4Q5NvkKbnIUezWOQANzFWTCe`) + `https://www.google.com/recaptcha/api.js` | `HTML` / `script` |
| **Opinia / referencja** | `/referencje` (homepage accordion **Opinie**) | `name` (Imię i nazwisko), `phone`, `email`; rating selects `rating_offer` (**Zakres oferty** 1–5), `rating_quality` (**Samochody** 1–5), `rating_delivery` (**Ocena instruktora** 1–5); `comment` textarea (**Opis**); submit **Zapisz** (`name="wyslij"`) | `POST` → `action="referencje"` | Google reCAPTCHA widget (`g-recaptcha`, sitekey `6LdfJJcmAAAAAPUf1E6K9V0PEJz2rXnp9eDJtNOV`) + `recaptcha/api.js` | `HTML` / `script` |

### Form notes

- Homepage and `/zapisy-na-kurs` enrollment forms share the same field set; only action URL and labeling differ.
- Term `<option>` values include dated strings such as `2026-08- 8 > weekendowy - 9:00` (and sparse/blank options) — treated as CMS-fed list content, not hard-coded IA.
- Contact form label spelling **Widomość** is source-verbatim (likely typo for *Wiadomość*).
- reCAPTCHA sitekeys differ between `/kontakt` and `/referencje`.

---

## 2. Interactive features (non-form)

| Feature | Where observed | Behavior / notes | Evidence |
| ------- | -------------- | ---------------- | -------- |
| Bootstrap accordion | `/` Strefa column `#accordion` (**Nasze doświadczenia**) | Expand/collapse panels (`data-toggle="collapse"`); panel titles include offer/Strefa/social entries (see `sections.md`) | `HTML` |
| Owl Carousel — hero | `/` `.owl-main-slaider` | Rotating H1-style pitches under Auto Szkoła Juszczak | `HTML` / `script` (OwlCarousel2 assets) |
| Owl Carousel — opinions | `/` `.owl-carousel-opinions` / `#opinie` | Sliding Google-review quotes; init via `$('.owl-carousel-opinions').owlCarousel(...)` | `HTML` / `script` |
| Owl Carousel — gallery strip | `/` `#gallery-slider` `.owl-gallery` | Fleet/school image strip | `HTML` / `script` |
| Lightbox2 | `/` gallery links `data-lightbox="roadtrip"` | Full-size image overlay group; CSS/JS under `simply/resources/lightbox2/` | `HTML` / `script` |
| Cookie consent banner | Site chrome `#cookies` | Info alert + link to **polityką prywatności**; **akceptuję** sets `cookieAgreement=1` cookie and hides banner | `HTML` |
| Mobile nav collapse | Navbar **MENU** → `#navbar-collapse-1` | Bootstrap collapse for primary nav | `HTML` |
| Bootstrap tooltips | Logo, footer news, cookie accept, etc. (`data-toggle="tooltip"`) | Tooltip attributes present in markup | `HTML` (runtime not exercised) |

---

## 3. External integrations

| Integration | Detail | Source URL / evidence | Evidence |
| ----------- | ------ | --------------------- | -------- |
| Facebook | Top-bar / accordion social buttons → school page | `https://www.facebook.com/auto.szkola.juszczak/` (links on `/` and shared chrome) | `HTML` |
| YouTube | Top-bar / accordion **You tube** button → channel | `https://www.youtube.com/channel/UCW9QdhjGGCJwwgnveq7DJag` | `HTML` |
| Google Analytics (Universal Analytics) | Classic `analytics.js` snippet; property `UA-77054718-1`; `ga('send', 'pageview')` | Script on `/` (and other fetched pages): `https://www.google-analytics.com/analytics.js` | `script` |
| Google Maps embed | Contact page map iframe for **Auto Szkoła Juszczak** | `/kontakt` — `iframe` `src` `https://www.google.com/maps/embed?pb=...` (place id / Auto+Szkoła+Juszczak) | `HTML` |
| Google review profile links | Homepage opinions carousel cards link out to Google Maps / Knowledge Graph review URLs | e.g. `https://maps.app.goo.gl/...`, `https://g.co/kgs/...` on `/` `#opinie` | `HTML` |
| Google reCAPTCHA | Contact + referencje forms load API + widget (see Forms) | `https://www.google.com/recaptcha/api.js` on `/kontakt`, `/referencje` | `script` / `HTML` |
| CMS vendor meta | Page meta author string | `meta name='author' content='simplysmart.pl'` on fetched pages; dynamic assets under `/simply/...` | `HTML` |

**Not observed on fetched pages:** Google Tag Manager / `gtag` GA4 snippet; maps `<iframe>` on `/`, `/zapisy-na-kurs`, or `/referencje` (embed only on `/kontakt`).

---

## 4. Backend / server-needed

| Capability | Status | Notes | Evidence |
| ---------- | ------ | ----- | -------- |
| Enrollment form processing | Implied by `POST` | Server must accept `POST` to `/` (`action="index"`) and `/zapisy-na-kurs` with name/email/phone/term/agreement; likely email or CRM hand-off — **not verified live** | `HTML` — form actions |
| Contact form processing + email | Implied by `POST` | `POST` to `/kontakt` with message body; typical mail/notify pipeline; reCAPTCHA verification on server implied | `HTML` |
| Review / referencje storage | Implied by `POST` | `POST` to `/referencje` with ratings + comment; persistence or moderation assumed, not observed | `HTML` |
| reCAPTCHA server verify | Implied | Widgets present; successful bot check normally needs server-side secret validation | `HTML` / `script` |
| CMS / dynamic content | Inferred | `simplysmart.pl` author, `/simply/files/dynamic/...` and `/simply/images/dynamic/...` paths, dated course terms in selects, article teasers | `HTML` |
| Analytics account | Client + vendor | UA property loaded in browser; no first-party analytics backend observed | `script` |
| **Student login / kursant portal auth** | **Not observed** | No login/zaloguj/panel-kursanta controls or auth forms in fetched HTML for `/`, `/zapisy-na-kurs`, `/kontakt`, `/referencje` | Absence — `HTML` scan |
| **Payment gateway** | **Not observed** | No PayU / Przelewy24 / PayPal / Stripe / checkout / koszyk markup on those pages | Absence — `HTML` scan |

---

## Downstream note (S-05)

For inert-form rebuilds, mirror the four surfaces above (field names/labels and captcha presence). Do not invent student login or payment flows — they remain undocumented here because they were not found in source HTML.
