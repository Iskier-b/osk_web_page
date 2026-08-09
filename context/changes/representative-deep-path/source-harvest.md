# Source harvest — Phase 1 `/prawo-jazdy-automat`

Harvest date: 2026-08-09.  
Source URL: https://www.autojuszczak.com.pl/prawo-jazdy-automat  
Target route: `/prawo-jazdy-automat`

## Kept (condensed body)

| Source element | Used as |
| -------------- | ------- |
| H1 „Prawo jazdy w automacie” | `title` / `heroTitle` |
| Heading „Kurs kategorii B na automat” | `heroSubtitle` + body `###` |
| Invite to kat. B automatic course; practical training on Honda Jazz (modern, small, agile) | Opening body paragraph |
| Benefits: no clutch/gear stress; car won’t stall at intersection; smooth start; more attention for road observation | Bullet list under the course heading |
| Price **3950 zł** for basic kat. B automatic course | Body price sentence |
| Phone **510-285-635** for more info | Body contact line (spacing normalized — see clarity edits) |
| Closing „POLECAMY I ZAPRASZAMY” | Closing sentence (sentence case — see clarity edits) |

## Intentionally omitted (condensed scope)

- Sidebar / Strefa internal links
- Ranking blocks
- News teasers / article chrome
- Footer chrome (legal, social, repeated phones)
- Schedule widgets and other site-wide chrome unrelated to this product page body
- Full source dump of any SEO/sidebar fluff beyond the hero-supporting key points above

## Clarity-only edits (no new facts)

- Phone spacing: source `510-285-635` → `510 285 635` (matches O nas / site-nav style).
- Closing shout: „POLECAMY I ZAPRASZAMY” → „Polecamy i zapraszamy.” (same sentence-case approach as S-02 CTAs).
- CTA label: source page closes with invite/recommend language, not a discrete button string. Chose **„Zapisz się na kurs”** as a light clarity label (enrollment intent) with `href: /zapisy-na-kurs`. Sibling pages often use „Zapisy na kurs”; this wording stays source-faithful to the invite tone without inventing a campaign phrase.

## Gaps (not invented)

- No product-specific hero/fleet image required or added in this condensed scope.
- No schedule times, instructor names, or claims beyond the kept points above.
