# Top-level authentic content — Plan Brief

> Full plan: `context/changes/top-level-authentic-content/plan.md`

## What & Why

Fill agreed top-level routes with source-faithful OSK Juszczak copy in the locked Broad layout so the owner recognizes *their* content in a clearer hierarchy. This is the content half of market-feedback before a public review URL (S-03).

## Starting Point

S-01 left all marketing routes as title-only `StubPage` shells under shared chrome and `site-nav.ts`. F-01 already listed copy targets and homepage sections; no Content Collections or section components exist yet.

## Desired End State

Visitors can read authentic content on home, O nas, Oferta, Cennik, and Strefa hub, plus short Galeria/Aktualności blurbs. Kontakt and Zapisy stay stubs for S-05. Layouts work at 375px, tablet, and large desktop without invented facts.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| Page scope | Seven targets: five fuller pages + Galeria/Aktualności blurbs; Kontakt/Zapisy stay stubs | Balances primary-nav coverage with deferring forms (S-05) and heavy media |
| Homepage depth | Representative stack from `sections.md`, static teasers only | Owner recognition without rebuilding carousels/forms |
| Media | Small set of real source images | Authentic look without full gallery migration |
| Content system | Astro Content Collections with Markdown + Astro section composition (no MDX) | Matches “MD bodies + shells” with less pipeline risk on Cloudflare |
| Fidelity | Light clarity rewrites OK; no new claims | Readable demo without breaking FR-004 guardrails |
| Responsive bar | 375px + tablet + large desktop on filled pages | Exceeds mobile must-have; prepares owner review on any device |
| Time pressure | No cuts from agreed scope | Ship complete slice or slip — don’t silently shrink |

## Scope

**In scope:**
- Content pipeline (`src/content.config.ts`, `src/content/pages/*.md`)
- Shared Broad section components
- Fill `/`, `/nasza-auto-szkola`, `/kursy`, `/cennik`, `/porady-dla-kursanta`
- Light blurbs on `/galeria`, `/artykuly`
- Small source image set under `public/`
- Responsive + fidelity pass on filled pages

**Out of scope:**
- `/kontakt`, `/zapisy-na-kurs` bodies/forms (S-05)
- Depth-2 copy (S-04), legal pages, blog posts
- Live integrations, carousels libraries, public deploy (S-03)
- Invented prices/contacts/claims

## Architecture / Approach

Markdown entries in one `pages` collection hold copy + frontmatter; existing Astro routes prerender and compose shared section components. Nav/hub child links stay driven by `site-nav.ts`. Home CTAs may point at stub Zapisy without implementing forms.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Content pipeline + section kit | Collections, section components, asset folder, build-proof wiring | Astro 6 Content Layer / prerender misconfig on Cloudflare |
| 2. Core recognition pages | Home, O nas, Oferta, Cennik + images | Source harvest misses or accidental invention on prices |
| 3. Hub + light media pages | Strefa hub; Galeria/Aktualności blurbs | Blurbs feel unfinished or scope creeps into full gallery/blog |
| 4. Responsive + fidelity bar | 375/tablet/desktop polish; fact check | Table overflow on Cennik; rewrite drift from source |

**Prerequisites:** S-01 chrome + stubs in place; F-01 pack + Broad tokens available; access to https://www.autojuszczak.com.pl/ for harvest  
**Estimated effort:** ~3–4 sessions across 4 phases

## Open Risks & Assumptions

- Source pages may change vs the 2026-08-09 crawl — harvest notes must pin what was copied.
- Clarity rewrites can accidentally invent tone/claims — Phase 4 fidelity audit is mandatory.
- Home Zapisy CTA lands on a stub until S-05 — acceptable per planning decision, may confuse a hasty reviewer.

## Success Criteria (Summary)

- Seven filled routes show authentic (or intentionally light) content; Kontakt/Zapisy remain stubs
- No invented facts/prices/contacts on filled pages
- Filled pages usable at 375px and acceptable on tablet/large desktop; lint + build green
