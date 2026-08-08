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

A greenfield web-app MVP (medium audience, 5 after-hours weeks) accepted the recommended default for web + JavaScript/TypeScript: Astro + React + TypeScript with Cloudflare Pages deploy. Standard path — no auth, payments, realtime, in-product AI, or background jobs in scope (FR-001 site mapping is a build-time work step, not a product feature). Cloudflare Pages covers the public free-static URL requirement; GitHub Actions auto-deploys on merge. Scaffolding support is first-class (registered CLI, not fully battle-tested). Lean plain Astro was flagged as a fit for a static business-card site; the user kept the full recommended starter anyway.
