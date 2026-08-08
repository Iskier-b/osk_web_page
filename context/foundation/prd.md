---
project: "OSK Juszczak redesign"
version: 1
status: draft
created: 2026-08-08
updated: 2026-08-08
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

Insight: the owner will commit to a redesign only after seeing *their* authentic content in a new information hierarchy — not an abstract mockup. The MVP is that proof: a modernized structure with real top-level (and one deep-path) content from https://www.autojuszczak.com.pl/. The owner's expectation for the live site is a modern look that attracts more course candidates. Target scale for live use: dozens to ~100 visitors/users (local OSK audience). Character: proof-of-concept / demonstracyjny redesign — not a production-complete site. Priority: concept → UX → look → info structure → representative content → simplicity.

## User & Persona

**Primary — OSK owner (Auto Szkoła Juszczak / business decision-maker).** Runs the driving school; feels the gap when leads and rankings slip; needs a tangible "new quality" vision of their site before approving change. Visits the site like any other browser user — no special access.

### Secondary persona

- **Service provider (you):** uses the MVP demo to encourage the owner to adopt the redesign.
- **Course candidate (site visitor):** the audience the modernized look should attract; not the MVP decision-maker.

## Success Criteria

### Primary
- AI model maps the current client site and saves a full analysis pack (not nav-only); user locks visual style by choosing from agent-proposed audience-based directions; ships a modernized public URL with authentic top-level content plus one representative deep path; owner reviews on mobile and desktop and recognizes their content in a clearer layout — forms visible, submit clearly disabled.

### Secondary
- (none locked beyond Primary — former desktop nice-to-have promoted into Primary via FR-008.)

### Guardrails
- Copied content is source-faithful only: no invented facts, prices, contacts, or claims; light clarity/hierarchy edits OK; no new copywriting.
- Mobile meets the FR-007 metric; forms never send data and communicate that clearly.
- Analysis pack stays complete (structure + features + integrations + backend-needed + MVP-in/out); pages without copied body show title-only / placeholder, not empty dead links and not invented body copy.

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

## Non-Functional Requirements

- Mobile: top-level pages usable at 375px width without horizontal scrolling; primary navigation reachable and usable.
- The MVP is reviewable at a public URL on free static hosting.
- Forms never transmit submitted data; the disabled-submit state is visible to the visitor.
- Full WCAG / accessibility conformance is not a target for this MVP (explicit non-target).
- Architecture stays simple: no unjustified backend, database, auth, or heavy integration surface for this demo.

## Business Logic

The site reorders the OSK offer into a clear information hierarchy — what appears first versus what is deferred — so the owner and visitors are not buried under a wall of content.

Inputs: structure and copy from the source site (https://www.autojuszczak.com.pl/) plus the locked visual style. Output: a modernized hierarchy with full top-level content, one representative deep path filled, and title-only / placeholder stubs elsewhere. Encountered on first mobile/desktop screens as a calmer, ordered presentation instead of information overload.

## Access Control

N/A — single public informational website. No login, no accounts, no role separation. Owner and visitors reach the same pages through a normal browser.

## Non-Goals

- Avoid: external integrations (payments, CRM, live student-zone backends, etc.) — keeps the MVP static and easy to demo.
- Avoid: CMS / owner content-edit panel — MVP is a fixed proposal site, not a management product.
- Avoid: SEO optimization as an MVP success goal — ranking decline is pain context, not something this version aims to fix.
- Avoid: backend, database, auth, and accounts for this MVP — presentation demo only; out-of-scope source features are documented in the analysis pack and may appear only as clearly non-production demo UI.

## Open Questions

None remaining from shape-notes (quality cross-check accepted, 2026-08-08). Synced 2026-08-08 with refreshed `page_mvp.md` (FR-001 depth, FR-002 chooser, content guardrails; FR-009 retained).
