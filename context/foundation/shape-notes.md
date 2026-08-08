---
project: "OSK Juszczak redesign"
context_type: greenfield
created: 2026-08-08
updated: 2026-08-08
product_type: web-app
target_scale:
  users: medium
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 5
  hard_deadline: null
  after_hours_only: true
checkpoint:
  current_phase: 8
  phases_completed: [1, 2, 3, 4, 5, 6, 7]
  gray_areas_resolved:
    - topic: context type
      decision: greenfield (user override; empty repo, client site is source input only)
    - topic: pain category
      decision: missing capability — no modern business-card site to present the offer
    - topic: insight
      decision: owner buys change only after seeing their own content in a new layout
    - topic: primary persona
      decision: OSK owner (decision to adopt the redesign vision)
    - topic: pain moment
      decision: drop in inquiries / rankings → "what do we do about this?"
    - topic: auth strategy
      decision: N/A — public informational site; no login, no roles
    - topic: mvp timeline
      decision: 5 weeks; user accepted sustained-effort cost
    - topic: site mapping actor
      decision: AI model performs site mapping and writes the structure documentation
    - topic: analysis documentation depth
      decision: F-01 delivers full analysis pack (sitemap, sections, forms, integrations, backend-needed, MVP-in vs MVP-out) — not nav map alone
    - topic: style lock process
      decision: agent proposes audience-based visual directions; user chooses; chosen direction applied consistently (supersedes developer-locks-after-PO-talk)
    - topic: empty nav stubs
      decision: no empty dead links — title-only / placeholder subsection pages when content not copied (placeholder means title-only, not invented body copy)
    - topic: content fidelity
      decision: source-faithful only — no invented facts/prices/contacts; light clarity/hierarchy edits OK; no new copywriting
    - topic: deep path selection
      decision: representative owner journey, not easiest path
    - topic: inert forms UX
      decision: keep form UI; clearly communicate submit disabled so trust is not broken
    - topic: mobile metric
      decision: measurable mobile bar (375px, no horizontal scroll on top-level; primary nav usable)
    - topic: desktop priority
      decision: promoted to must-have
    - topic: public hosting
      decision: kept must-have — public URL required for real demo (FR-009 retained after page_mvp.md refresh omitted hosting; user accepted plan sync option 1)
    - topic: domain rule
      decision: information hierarchy — what comes first vs what is deferred
    - topic: wcag in mvp
      decision: full WCAG out of MVP scope (explicit non-target)
    - topic: timeline mode
      decision: after hours; no hard deadline; user de-emphasized execution-time pressure
    - topic: non-goals
      decision: no external integrations; no CMS/edit panel; SEO optimization not an MVP goal
    - topic: page_mvp refresh sync
      decision: 2026-08-08 — refined page_mvp.md deltas folded into shape/PRD/roadmap without full reshape
  frs_drafted: 9
  quality_check_status: accepted
---

# Seed (verbatim inputs)

From `context/page_mvp.md` (refreshed 2026-08-08) and session:

- Goal: demonstracyjna, zmodernizowana wersja strony OSK jako prezentacja koncepcji dla klienta biznesowego — nie produkcyjna kompletność.
- Source site (input only, not the system under change): https://www.autojuszczak.com.pl/
- Preserve information structure and key facts; redesign presentation, look, and UX.
- Analysis first: full site map + menus, sections/components, forms, external integrations, backend-needed features, MVP-in vs MVP-out — saved in agent context docs.
- Structure fully mirrored in nav; full real copy only for top pages + one thematic path; deeper pages = title-only / placeholder (no invented body).
- No invented company facts, prices, addresses, phones; no new copywriting — new presentation of existing offer.
- Visual gate: agent proposes audience-based directions → user chooses → apply consistently.
- Mobile-first (mobile, tablet, desktop); mobile readability outranks desktop polish.
- Architecture simple: no backend, DB, auth, accounts, complex business processes, heavy integrations unless user confirms.
- Out-of-scope features: document in analysis; may appear as non-production demo UI only.
- Success: working modernized demo, locked visual direction, structure parity, real top + one deep path, mobile+desktop, low complexity, out-of-scope documented, client can judge concept/UX/info architecture.
- Priority: concept → UX → look → info structure → representative content → simplicity.
- Public review URL kept as plan must-have (FR-009) even though refreshed brief omitted hosting wording.

## Forward: tech-stack

- Locked downstream in `context/foundation/tech-stack.md` (Astro starter + Cloudflare Pages).

## Vision & Problem Statement

The OSK owner's current site looks outdated versus competitors and does not meaningfully drive candidate inflow; when inquiries and SEO rankings drop, they lack a concrete modern presentation of their own offer to evaluate. Visitors are also overloaded with information on the existing site, which weakens first impression.

Insight: the owner will commit to a redesign only after seeing *their* authentic content in a new information hierarchy — not an abstract mockup. The MVP is that proof: a modernized structure with real top-level (and one deep-path) content from https://www.autojuszczak.com.pl/. The owner's expectation for the live site is a modern look that attracts more course candidates. Target scale for live use: dozens to ~100 visitors/users (local OSK audience).

## User & Persona

**Primary — OSK owner (Auto Szkoła Juszczak / business decision-maker).** Runs the driving school; feels the gap when leads and rankings slip; needs a tangible "new quality" vision of their site before approving change. Visits the site like any other browser user — no special access.

### Secondary persona

- **Service provider (you):** uses the MVP demo to encourage the owner to adopt the redesign.
- **Course candidate (site visitor):** the audience the modernized look should attract; not the MVP decision-maker.

## Access Control

N/A — single public informational website. No login, no accounts, no role separation. Owner and visitors reach the same pages through a normal browser.

## Success Criteria

### Primary
- AI model maps the current client site and saves a full analysis pack (not nav-only); user locks visual style by choosing from agent-proposed audience-based directions; ships a modernized public URL with authentic top-level content plus one representative deep path; owner reviews on mobile and desktop and recognizes their content in a clearer layout — forms visible, submit clearly disabled.

### Secondary
- (none locked beyond Primary — former desktop nice-to-have promoted into Primary via FR-008.)

### Guardrails
- Copied content is source-faithful only: no invented facts, prices, contacts, or claims; light clarity/hierarchy edits OK; no new copywriting.
- Mobile meets the FR-007 metric; forms never send data and communicate that clearly.
- Analysis pack stays complete (structure + features + integrations + backend-needed + MVP-in/out); pages without copied body show title-only / placeholder, not empty dead links and not invented body copy.

## Timeline acknowledgment

Acknowledged on 2026-08-08: 5-week MVP requires sustained dedication; user accepted.

## MVP flow (locked)

1. AI model maps current site → save full analysis pack (sitemap, sections, forms, integrations, backend-needed, MVP-in vs MVP-out).
2. Gate: agent proposes audience-based visual directions; user chooses and locks one direction.
3. Publish modernized site to a public URL (free static hosting).
4. Browse top-level pages on mobile (metric) and desktop with real copied content (clarity edits OK, no invented claims / no new copywriting).
5. Walk one representative deeper path (not the easiest stub) with real copied content.
6. Forms present as ready UI; submit disabled and clearly communicated (demo-only, not production-working).
7. Pages without copied body: title-only / placeholder subsection, no empty dead links, no invented body.
8. Owner evaluates: “our content, new layout / quality.”

## Functional Requirements

### Discovery & style gate
- FR-001: AI model can map the source client site and produce a reusable analysis pack covering sitemap/menus, key sections and repeated components, forms and interactive features, external integrations, backend-or-server-needed features, and an explicit MVP-in vs MVP-out classification. Priority: must-have
  > Socrates: Counter-argument considered: AI mapping incomplete/wrong → do manually. Resolution: kept; depth expanded 2026-08-08 to match refreshed page_mvp §2 (not nav-only).
- FR-002: User can lock the visual style before the MVP build starts by choosing from agent-proposed audience-based directions (with short pros per direction); the chosen direction is then applied consistently. Priority: must-have
  > Socrates: Counter-argument considered: owner should pick style / lock too early. Resolution (updated 2026-08-08): user chooses from agent proposals — supersedes developer-locks-after-PO-talk.

### Public site
- FR-003: Visitor can browse the full navigation structure; where body content is not copied yet, the subsection shows a title-only / placeholder page (no empty dead-end links; no invented body copy). Priority: must-have
  > Socrates: Counter-argument considered: full structure with empty links misleads the owner. Resolution: title-only / placeholder stubs instead of empty links.
- FR-004: Visitor can read source-faithful top-hierarchy content that the owner recognizes, with light clarity/hierarchy edits allowed and no invented facts, prices, contacts, or claims (no new copywriting). Priority: must-have
  > Socrates: Counter-argument considered: raw copy vs new vision tension. Resolution: source-faithful + light clarity edits only, no invention.
- FR-005: Visitor can follow one developer-chosen deeper path with real copied content; the path must be a representative owner/candidate journey (e.g. offer → contact), not the easiest stub. Priority: must-have
  > Socrates: Counter-argument considered: cherry-picking the easiest path. Resolution: require representative journey.
- FR-006: Visitor can see forms as ready UI elements that perform no send/submit actions and clearly communicate that submission is disabled in this version (demo-only, must not imply production-working). Priority: must-have
  > Socrates: Counter-argument considered: dead forms break trust. Resolution: keep UI; explicitly label submit as disabled.
- FR-007: Visitor can use top-level pages on a 375px-wide mobile viewport without horizontal scrolling, with primary navigation reachable and usable; mobile remains priority over desktop polish. Priority: must-have
  > Socrates: Counter-argument considered: “works on mobile” unmeasurable. Resolution: added 375px / no horizontal scroll / usable primary nav metric.
- FR-008: Visitor can use a readable, stylistically consistent desktop layout. Priority: must-have
  > Socrates: Counter-argument considered: owner evaluates mainly on desktop → must-have. Resolution: promoted to must-have.
- FR-009: Developer can publish the site on free static hosting so the owner reviews a public URL (not only local preview). Priority: must-have
  > Socrates: Counter-argument considered: without public URL there is no real demo. Resolution: kept must-have after page_mvp refresh (hosting wording omitted in brief; plan retains FR-009).

## User Stories

### US-01: Owner reviews modernized site with own content

- **Given** the source analysis pack is documented, visual style is locked by user choice from agent proposals, and the site is available at a public URL
- **When** the owner opens the site on phone and desktop and walks top-level pages plus one representative deeper path
- **Then** they recognize their content in a clearer modern layout; title-only / placeholder stubs appear where deep content was not copied; forms are visible with submit clearly disabled

#### Acceptance Criteria
- Analysis pack exists (structure + features/integrations/backend-needed + MVP-in/out) and navigation matches the new site
- Top-hierarchy pages use source-faithful content (clarity edits only; no invented facts)
- One representative deep path has real copied content
- Mobile: 375px, no horizontal scroll on top-level; primary nav usable
- Desktop layout is readable and style-consistent
- No form submit sends data; disabled state is communicated
- Public URL is available for owner review

## Business Logic

The site reorders the OSK offer into a clear information hierarchy — what appears first versus what is deferred — so the owner and visitors are not buried under a wall of content.

Inputs: structure and copy from the source site (https://www.autojuszczak.com.pl/) plus the locked visual style. Output: a modernized hierarchy with full top-level content, one representative deep path filled, and title-only stubs elsewhere. Encountered on first mobile/desktop screens as a calmer, ordered presentation instead of information overload.

## Non-Functional Requirements

- Mobile: top-level pages usable at 375px width without horizontal scrolling; primary navigation reachable and usable.
- The MVP is reviewable at a public URL on free static hosting.
- Forms never transmit submitted data; the disabled-submit state is visible to the visitor.
- Full WCAG / accessibility conformance is not a target for this MVP (explicit non-target).

## Non-Goals

- Avoid: external integrations (payments, CRM, live student-zone backends, etc.) unless trivial client-side JS — keeps the MVP static and easy to demo.
- Avoid: CMS / owner content-edit panel — MVP is a fixed proposal site, not a management product.
- Avoid: SEO optimization as an MVP success goal — ranking decline is pain context, not something this version aims to fix.

## Quality cross-check

Status: **accepted** (2026-08-08). Soft-gate elements present: Access Control, Business Logic (one-sentence rule), project artifacts, timeline-cost acknowledgment (5-week sustained effort), Non-Goals. Preserved-behavior check n/a (greenfield). No gaps recorded for `/10x-prd` Open Questions from this gate.

## Sync note (page_mvp refresh)

2026-08-08: User accepted option 1 after `/10x-shape` impact review of refreshed `context/page_mvp.md`. Folded into this file + `prd.md` + `roadmap.md`: broader FR-001 analysis pack, FR-002 user-chooses-style, content/placeholder guardrails, FR-009 retained. No full reshape.
