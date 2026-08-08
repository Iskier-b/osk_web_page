# Navigation structure with title-only stubs — Plan Brief

> Full plan: `context/changes/nav-structure-stubs/plan.md`

## What & Why

Visitors (and the OSK owner) need to browse a complete modern information architecture before deep copy lands. This slice ships full-nav parity with title + honest placeholder stubs so there are no dead links and no invented body copy (FR-003 / S-01).

## Starting Point

The repo is still the Astro starter (no public Header/Nav/Footer; Welcome/cosmic home). F-01 archived the sitemap and MVP-in URL list; F-02 left three style proposals unlocked — Broad is chosen in this plan and applied with chrome.

## Desired End State

Every F-01 MVP-in URL resolves under Broad-styled public chrome. Primary nav includes Strefa and Oferta dropdowns; hubs list the same children; stubs show PL title + `Treść w przygotowaniu`. Auth stays reachable only via footer **Demo / konto**.

## Key Decisions Made

| Decision | Choice | Why (1 sentence) |
| -------- | ------ | ---------------- |
| Visual direction | Lock Broad / universal + apply tokens | Friendly mixed-audience baseline; closes FR-002 choice before chrome ships |
| Stub body | Title + fixed meta line | Honest placeholder without inventing marketing copy |
| Structure scope | Full F-01 MVP-in (~25 URLs) | Matches analysis handoff; avoids later nav drift |
| Depth-2 discovery | Dropdowns (Strefa + Oferta) + hub lists | Faster deep jumps while hubs remain authoritative |
| Auth residue | Footer Demo / konto only | Keeps starter routes reachable without polluting primary chrome |

## Scope

**In scope:** Broad lock artifact + tokens; public Header/Footer/Layout; IA data module; all MVP-in stub routes including `/`; hub child lists.

**Out of scope:** Authentic top-level copy (S-02); deep-path content (S-04); inert forms (S-05); public hosting (S-03); blog posts; live backends; PDF-as-pages; deleting auth routes.

## Architecture / Approach

Single `site-nav` data module feeds Header, Footer, and stub/hub pages. `Layout` wraps SiteHeader + slot + SiteFooter. React island only for mobile/dropdown open state. Shared `StubPage` renders H1 + meta line; hubs pass children from the same module.

## Phases at a Glance

| Phase | What it delivers | Key risk |
| ----- | ---------------- | -------- |
| 1. Style lock + tokens | Broad recorded; tokens/fonts/`lang=pl` | Wrong palette cues if Broad card skimmed |
| 2. Public chrome | Header/footer + dropdowns in Layout | Mobile nav usability / IA drift |
| 3. Stub routes + hubs | All MVP-in pages; Welcome replaced on `/` | Missing path vs mvp-scope checklist |

**Prerequisites:** F-01 pack readable; Broad choice confirmed (this plan).  
**Estimated effort:** ~2–3 sessions across 3 phases.

## Open Risks & Assumptions

- PDF footer links omitted until files exist under `public/` (avoid 404s).
- No automated test suite — gates are lint + build + manual URL walks.
- Roadmap previously marked F-02 “done” for proposals only; this plan completes choice + apply for chrome.

## Success Criteria (Summary)

- Visitor can open every MVP-in URL and see PL title + `Treść w przygotowaniu`.
- Strefa/Oferta dropdowns and hub lists expose the same depth-2 children with no dead links.
- Public chrome matches Broad; auth only via footer Demo / konto.
