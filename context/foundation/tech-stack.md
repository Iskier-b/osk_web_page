---
starter_id: 10x-astro-starter
package_manager: npm
project_name: osk-juszczak-redesign
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: first-class
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: false
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
---

## Why this stack

Solo after-hours MVP (5 weeks) for a static public OSK business site with no auth, payments, realtime, AI, or background jobs. Standard path locked `10x-astro-starter` — Astro + React + TypeScript with Cloudflare Pages as the free public URL for owner review (FR-009). Supabase and starter auth routes stay unused noise, not MVP work. CI is GitHub Actions with auto-deploy-on-merge. Scaffolding confidence is first-class; the tradeoff versus lean Astro is extra unused starter surface in exchange for the already-bootstrapped, agent-friendly stack.
