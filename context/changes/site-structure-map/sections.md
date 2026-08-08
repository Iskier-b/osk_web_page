# Sections & components

Observed homepage blocks and recurring UI patterns on https://www.autojuszczak.com.pl/ (homepage HTML, 2026-08-09). English notes; Polish labels verbatim. **Do not invent** components not seen on source.

**Kind legend:** `content` = marketing/page body; `chrome` = sitewide frame (nav, footer, cookies, persistent CTAs).

---

## Homepage major sections

Top-to-bottom order as rendered on `/`.

| Order | Section (source id / cue) | Kind | What it contains |
| ----- | ------------------------- | ---- | ---------------- |
| 1 | Navbar + top-bar | chrome | Logo → `/`; phone `510 285 635`; **Zapisy na kurs**; Facebook / You tube; primary nav (**O nas**, **Aktualności**, **Oferta**, **Cennik**, **Galeria**, **Strefa kursanta**, **Kontakt**); mobile **MENU** collapse |
| 2 | Hero + enrollment (`#top-pictures-container`) | content + chrome form | Owl carousel (`owl-main-slaider`) with rotating H1-style pitches under “Auto Szkoła Juszczak …”; beside it form **Rejestracja na kurs** (fields: Imię i nazwisko, Adres email, Numer telefonu, Termin kursu, RODO checkbox, submit **ZAPISZ**) |
| 3 | Dashboard strip (`#dashboard`) | content | Three media tiles: **Najbliższe kursy** (upcoming term strings); price callout **3900,00 PLN** + link **Cena za kurs** → `/cennik`; address **ul. Rydzowa 2** / hours |
| 4 | News + Strefa (`#news`) | content | Left: **Z życia** / **Auto Szkoły Juszczak** — three article teaser thumbnails (links to `artykul-*`, not inventoried). Right: **Strefa kursanta** / **Nasze doświadczenia** — Bootstrap accordion (panel titles below) |
| 5 | Mid-page CTA | content | Button **ZOSTAŃ NASZYM KURSANTEM** → `/zapisy-na-kurs` (appears after accordion block) |
| 6 | Reviews (`section.lista_opinii` / `#opinie`) | content | Owl carousel (`owl-carousel-opinions`) of Google-review quotes (author, stars, `grev.webp`, links to Google Maps review URLs) |
| 7 | Gallery strip (`#gallery-slider`) | content | Owl carousel (`owl-gallery`) of fleet/school images; each opens Lightbox2 (`data-lightbox="roadtrip"`) |
| 8 | About (`#about`) | content | Long SEO/about copy (**Poznaj naszą Auto Szkołę**), price/ranking blockquotes, CTAs **WIĘCEJ** → `/nasza-auto-szkola`, **AKTUALNOŚCI** → `/artykuly` |
| 9 | Footer columns (`#sitemap`) | chrome | Four columns: **O Auto Szkole**, **Kontakt**, **Aktualności** teaser list, **Mapa strony** (see `sitemap.md`) |
| 10 | Cookies (`#cookies`) | chrome | Info alert: cookies notice + link to **polityką prywatności**; dismiss control **akceptuję** (sets `cookieAgreement` cookie) |
| 11 | Legal strip (`#footer`) | chrome | Copyright 1999–2026; **Polityka prywatności serwisu**; location mention + **Retkinia** |

### Homepage Strefa accordion panel titles (verbatim)

Observed collapse headers under **Nasze doświadczenia** (mix of Strefa + offer siblings + social):

1. Prawo jazdy w automacie  
2. Prawo jazdy na motocykl A i A2  
3. Ranking auto szkół Łódź  
4. Jazdy doszkalające  
5. Opinie (links toward `/referencje`)  
6. Wymogi formalne - numer PKK  
7. Pytania egzaminacyjne  
8. Trasy egzaminacyjne  
9. Trudne skrzyżowania  
10. Filmy instruktażowe (one accordion entry HTML-commented; still linked)  
11. Nasi instruktorzy  
12. Nasze społeczności (Facebook / You tube buttons)  
13. Współpraca → `/wspolpraca`

---

## Repeated components

Patterns reused across homepage (and typically site chrome on inner pages).

| Component | Observed where | Kind | Behavior / notes |
| --------- | -------------- | ---- | ---------------- |
| Accordion (Bootstrap `panel-group` / `data-toggle="collapse"`) | Homepage Strefa column `#accordion` | content | Expand/collapse panels; inner **WIĘCEJ** CTAs to deep paths |
| Carousel (Owl Carousel) | Hero `owl-main-slaider`; reviews `owl-carousel-opinions`; gallery `owl-gallery` | content | Auto/slide carousels; three distinct instances on homepage |
| Lightbox (Lightbox2) | `#gallery-slider` image links | content | Full-size gallery images in overlay group `roadtrip` |
| CTA phone | Top-bar; footer **Kontakt** column | chrome | `tel:510285635`, `tel:422366190` |
| CTA Zapisy | Top-bar **Zapisy na kurs**; homepage **ZOSTAŃ NASZYM KURSANTEM**; enrollment **ZAPISZ** | chrome / content | Nav CTA + mid-page CTA + form submit (forms detail → Phase 3) |
| Footer columns | `#sitemap` on homepage (and site template) | chrome | Blurb / contact / news teasers / **Mapa strony** |
| Mobile nav collapse | Navbar **MENU** → `#navbar-collapse-1` | chrome | Bootstrap collapse for primary nav on small screens |
| Cookie consent alert | `#cookies` | chrome | Accept link hides banner and sets cookie |

---

## Content vs chrome (summary)

| Kind | Examples on homepage |
| ---- | -------------------- |
| Chrome | Navbar, top-bar phone/Zapisy/social, footer `#sitemap` + `#footer`, `#cookies`, mobile MENU |
| Content | Hero pitches, enrollment form body, dashboard tiles, news teasers, Strefa accordion, reviews carousel, gallery strip, about copy, mid-page Zapisy CTA |

---

## Inner-page pattern (light)

Not a full per-page audit. From Strefa hub `/porady-dla-kursanta`: same navbar/footer chrome; hub body uses a **thumbnail tile grid** linking to Strefa children (Wymogi formalne … Nasi instruktorzy) plus a **RANKING** button — recurring card-grid pattern for cluster landing, distinct from homepage accordion.

Forms, maps, analytics, reCAPTCHA → Phase 3 (`forms-integrations.md`).
