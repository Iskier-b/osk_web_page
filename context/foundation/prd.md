---
project: "OSK Juszczak redesign"
version: 1
status: draft
created: 2026-08-08
context_type: greenfield
product_type: web-app
target_scale:
  users: medium
  qps: low
  data_volume: small
timeline_budget:
  mvp_weeks: 5
  hard_deadline: null
  after_hours_only: true
---

## Vision & Problem Statement

The OSK owner's current site looks outdated versus competitors and does not meaningfully drive candidate inflow; when inquiries and SEO rankings drop, they lack a concrete modern presentation of their own offer to evaluate. Visitors are also overloaded with information on the existing site, which weakens first impression.

Insight: the owner will commit to a redesign only after seeing *their* authentic content in a new information hierarchy — not an abstract mockup. The MVP is that proof: a modernized structure with real top-level (and one deep-path) content from https://www.autojuszczak.com.pl/. The owner's expectation for the live site is a modern look that attracts more course candidates. Target scale for live use: dozens to ~100 visitors/users (local OSK audience).

## User & Persona

**Primary — OSK owner (Auto Szkoła Juszczak / business decision-maker).** Runs the driving school; feels the gap when leads and rankings slip; needs a tangible "new quality" vision of their site before approving change. Visits the site like any other browser user — no special access.

### Secondary persona

- **Service provider (you):** uses the MVP demo to encourage the owner to adopt the redesign.
- **Course candidate (site visitor):** the audience the modernized look should attract; not the MVP decision-maker.

## Success Criteria

### Primary
- AI model maps the current client site and saves a reusable structure artifact; developer locks visual style after talking with owner/PO; ships a modernized public URL with authentic top-level content plus one representative deep path; owner reviews on mobile and desktop and recognizes their content in a clearer layout — forms visible, submit clearly disabled.

### Secondary
- (none locked beyond Primary — former desktop nice-to-have promoted into Primary via FR-008.)

### Guardrails
- Copied content is not invented; light clarity edits allowed only as the fidelity golden mean.
- Mobile meets the FR-007 metric; forms never send data and communicate that clearly.
- Site-map artifact stays structurally complete; pages without copied body show title-only, not empty dead links.

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

## Non-Functional Requirements

- Mobile: top-level pages usable at 375px width without horizontal scrolling; primary navigation reachable and usable.
- The MVP is reviewable at a public URL on free static hosting.
- Forms never transmit submitted data; the disabled-submit state is visible to the visitor.
- Full WCAG / accessibility conformance is not a target for this MVP (explicit non-target).

## Business Logic

The site reorders the OSK offer into a clear information hierarchy — what appears first versus what is deferred — so the owner and visitors are not buried under a wall of content.

Inputs: structure and copy from the source site (https://www.autojuszczak.com.pl/) plus the locked visual style. Output: a modernized hierarchy with full top-level content, one representative deep path filled, and title-only stubs elsewhere. Encountered on first mobile/desktop screens as a calmer, ordered presentation instead of information overload.

## Access Control

N/A — single public informational website. No login, no accounts, no role separation. Owner and visitors reach the same pages through a normal browser.

## Non-Goals

- Avoid: external integrations (payments, CRM, live student-zone backends, etc.) — keeps the MVP static and easy to demo.
- Avoid: CMS / owner content-edit panel — MVP is a fixed proposal site, not a management product.
- Avoid: SEO optimization as an MVP success goal — ranking decline is pain context, not something this version aims to fix.

## Open Questions

None remaining from shape-notes (quality cross-check accepted, 2026-08-08).
