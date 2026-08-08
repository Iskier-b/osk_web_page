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
    - topic: style lock process
      decision: developer locks style after conversation with owner or project PO
    - topic: empty nav stubs
      decision: no empty dead links — title-only subsection pages when content not copied
    - topic: content fidelity
      decision: golden mean — recognizeable source content; light clarity edits OK; no invented claims
    - topic: deep path selection
      decision: representative owner journey, not easiest path
    - topic: inert forms UX
      decision: keep form UI; clearly communicate submit disabled so trust is not broken
    - topic: mobile metric
      decision: measurable mobile bar (375px, no horizontal scroll on top-level; primary nav usable)
    - topic: desktop priority
      decision: promoted to must-have
    - topic: public hosting
      decision: promoted to must-have — public URL required for real demo
    - topic: domain rule
      decision: information hierarchy — what comes first vs what is deferred
    - topic: wcag in mvp
      decision: full WCAG out of MVP scope (explicit non-target)
    - topic: timeline mode
      decision: after hours; no hard deadline; user de-emphasized execution-time pressure
    - topic: non-goals
      decision: no external integrations; no CMS/edit panel; SEO optimization not an MVP goal
  frs_drafted: 9
  quality_check_status: accepted
---

# Seed (verbatim inputs)

From `context/page_mvp.md` and session:

- Goal: present a potential business client a modernized business-card site for their driving school, using authentic content copied from their current site.
- Source site (input only, not the system under change): https://www.autojuszczak.com.pl/
- Repo is brand-new; nothing built yet.
- MVP: map full structure of current site; rebuild structure in a refreshed template; copy content only for top-hierarchy pages plus one chosen path (e.g. contact / about); mobile-first; deployable on free static hosting (e.g. GitHub Pages — tech detail deferred).
- Out of scope: full content clone; server integrations unless trivial JS; complex forms/apps (document them when mapping).
- Always ask about visual style (propose styles by audience type).

## Forward: tech-stack

- User preference (not locked): free static hosting suitable for GitHub Pages–class deploy.

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
- AI model maps the current client site and saves a reusable structure artifact; developer locks visual style after talking with owner/PO; ships a modernized public URL with authentic top-level content plus one representative deep path; owner reviews on mobile and desktop and recognizes their content in a clearer layout — forms visible, submit clearly disabled.

### Secondary
- (none locked beyond Primary — former desktop nice-to-have promoted into Primary via FR-008.)

### Guardrails
- Copied content is not invented; light clarity edits allowed only as the fidelity golden mean.
- Mobile meets the FR-007 metric; forms never send data and communicate that clearly.
- Site-map artifact stays structurally complete; pages without copied body show title-only, not empty dead links.

## Timeline acknowledgment

Acknowledged on 2026-08-08: 5-week MVP requires sustained dedication; user accepted.

## MVP flow (locked)

1. AI model maps current site → save structure documentation artifact (reusable).
2. Gate: developer locks visual style after conversation with owner or project PO.
3. Publish modernized site to a public URL (free static hosting).
4. Browse top-level pages on mobile (metric) and desktop with real copied content (clarity edits OK, no invented claims).
5. Walk one representative deeper path (not the easiest stub) with real copied content.
6. Forms present as ready UI; submit disabled and clearly communicated.
7. Pages without copied body: title-only subsection, no empty dead links.
8. Owner evaluates: “our content, new layout / quality.”

## Functional Requirements

### Discovery & style gate
- FR-001: AI model can map the source client site and produce reusable structure documentation. Priority: must-have
  > Socrates: Counter-argument considered: AI mapping incomplete/wrong → do manually. Resolution: kept as written.
- FR-002: Developer can choose and lock the visual style before the MVP build starts, after a conversation with the site owner or project PO. Priority: must-have
  > Socrates: Counter-argument considered: owner should pick style / lock too early. Resolution: kept; developer locks style after owner/PO conversation.

### Public site
- FR-003: Visitor can browse the full navigation structure; where body content is not copied yet, the subsection shows a title-only page (no empty dead-end links). Priority: must-have
  > Socrates: Counter-argument considered: full structure with empty links misleads the owner. Resolution: title-only stubs instead of empty links.
- FR-004: Visitor can read source-faithful top-hierarchy content that the owner recognizes, with a golden mean of light clarity/hierarchy edits allowed and no invented facts or claims. Priority: must-have
  > Socrates: Counter-argument considered: raw copy vs new vision tension. Resolution: golden mean — recognizable + light clarity edits, no invention.
- FR-005: Visitor can follow one developer-chosen deeper path with real copied content; the path must be a representative owner/candidate journey (e.g. offer → contact), not the easiest stub. Priority: must-have
  > Socrates: Counter-argument considered: cherry-picking the easiest path. Resolution: require representative journey.
- FR-006: Visitor can see forms as ready UI elements that perform no send/submit actions and clearly communicate that submission is disabled in this version. Priority: must-have
  > Socrates: Counter-argument considered: dead forms break trust. Resolution: keep UI; explicitly label submit as disabled.
- FR-007: Visitor can use top-level pages on a 375px-wide mobile viewport without horizontal scrolling, with primary navigation reachable and usable; mobile remains priority over desktop polish. Priority: must-have
  > Socrates: Counter-argument considered: “works on mobile” unmeasurable. Resolution: added 375px / no horizontal scroll / usable primary nav metric.
- FR-008: Visitor can use a readable, stylistically consistent desktop layout. Priority: must-have
  > Socrates: Counter-argument considered: owner evaluates mainly on desktop → must-have. Resolution: promoted to must-have.
- FR-009: Developer can publish the site on free static hosting so the owner reviews a public URL (not only local preview). Priority: must-have
  > Socrates: Counter-argument considered: without public URL there is no real demo. Resolution: promoted to must-have.

## User Stories

### US-01: Owner reviews modernized site with own content

- **Given** the source site map is documented, visual style is locked after owner/PO discussion, and the site is available at a public URL
- **When** the owner opens the site on phone and desktop and walks top-level pages plus one representative deeper path
- **Then** they recognize their content in a clearer modern layout; title-only stubs appear where deep content was not copied; forms are visible with submit clearly disabled

#### Acceptance Criteria
- Structure documentation artifact exists and matches navigation on the new site
- Top-hierarchy pages use source-faithful content (golden mean edits only)
- One representative deep path has real copied content
- Mobile: 375px, no horizontal scroll on top-level; primary nav usable
- Desktop layout is readable and style-consistent
- No form submit sends data; disabled state is communicated

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
