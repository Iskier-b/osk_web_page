---
bootstrapped_at: 2026-08-08T16:32:30Z
starter_id: 10x-astro-starter
starter_name: "10x Astro Starter (Astro + Supabase + Cloudflare)"
project_name: osk-juszczak-redesign
language_family: js
package_manager: npm
cwd_strategy: git-clone
bootstrapper_confidence: first-class
phase_3_status: ok
audit_command: "npm audit --json"
---

## Hand-off

```yaml
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
```

### Why this stack

A greenfield web-app MVP (medium audience, 5 after-hours weeks) accepted the recommended default for web + JavaScript/TypeScript: Astro + React + TypeScript with Cloudflare Pages deploy. Standard path — no auth, payments, realtime, in-product AI, or background jobs in scope (FR-001 site mapping is a build-time work step, not a product feature). Cloudflare Pages covers the public free-static URL requirement; GitHub Actions auto-deploys on merge. Scaffolding support is first-class (registered CLI, not fully battle-tested). Lean plain Astro was flagged as a fit for a static business-card site; the user kept the full recommended starter anyway.

## Pre-scaffold verification

| Signal             | Value                                                              | Severity | Notes                                                                 |
| ------------------ | ------------------------------------------------------------------ | -------- | --------------------------------------------------------------------- |
| npm package        | not run                                                            | —        | cmd_template starts with `git clone`; npm recency check skipped       |
| GitHub repo        | przeprogramowani/10x-astro-starter last pushed 2026-05-17T10:33:39Z | fresh    | via GitHub API (`gh` unavailable; used REST fallback)                 |

## Scaffold log

**Resolved invocation**: `git clone https://github.com/przeprogramowani/10x-astro-starter .bootstrap-scaffold && cd .bootstrap-scaffold && npm install`
**Strategy**: git-clone
**Exit code**: 0
**Files moved**: 20
**Conflicts (.scaffold siblings)**: none
**.gitignore handling**: moved silently
**.bootstrap-scaffold cleanup**: deleted

Move log:
- MOVE: .github, .husky, .vscode, node_modules, public, src, supabase
- MOVE: .env.example, .gitignore, .nvmrc, .prettierrc.json, astro.config.mjs, CLAUDE.md, components.json, eslint.config.js, package-lock.json, package.json, README.md, tsconfig.json, wrangler.jsonc
- Cloned `.git/` deleted before move-up; cwd `.git/` preserved
- cwd `context/` preserved (no scaffold `context/` present)

## Post-scaffold audit

**Tool**: npm audit --json
**Summary**: 1 CRITICAL, 13 HIGH, 7 MODERATE, 2 LOW
**Direct vs transitive**: 0/1/2/0 direct of total 1/13/7/2

#### CRITICAL findings

- **tar** (`<=7.5.20`, transitive via `supabase`) — multiple node-tar advisories including decompression/parse DoS (GHSA-23hp-3jrh-7fpw). Fix available.

#### HIGH findings

- **astro** (`<=7.0.9`, **direct**) — reflected XSS / SSRF / related advisories (e.g. GHSA-8hv8-536x-4wqp, GHSA-2pvr-wf23-7pc7). Fix available.
- **brace-expansion** — DoS via exponential expansion (transitive). Fix available.
- **devalue** — DoS via sparse array deserialization (transitive). Fix available.
- **fast-uri** — host confusion via backslash authority (transitive). Fix available.
- **js-yaml** — quadratic CPU / merge-key DoS (transitive). Fix available.
- **miniflare** — inherits sharp/undici/ws (transitive; affects wrangler). Fix available.
- **nanoid** — infinite loop with bad size (transitive). Fix available.
- **postcss** — path traversal via sourceMappingURL (transitive). Fix available.
- **sharp** — libvips CVEs (transitive; affects astro). Fix available.
- **svgo** — removeScripts leaves executable scripts (transitive). Fix available.
- **undici** — TLS / header / WebSocket advisories (transitive). Fix available.
- **vite** — `server.fs.deny` bypass on Windows (transitive). Fix available.
- **ws** — memory exhaustion DoS (transitive). Fix available.

#### MODERATE findings

- **@astrojs/language-server**, **@cloudflare/vite-plugin**, **supabase** (direct), **volar-service-yaml**, **wrangler** (direct), **yaml**, **yaml-language-server** — see `npm audit` for full advisory list. Logged only.

#### LOW / INFO findings

- **@babel/core**, **esbuild** — fix available. Logged only.

## Hints recorded but not acted on

| Hint                       | Value                |
| -------------------------- | -------------------- |
| bootstrapper_confidence    | first-class          |
| quality_override           | false                |
| path_taken                 | standard             |
| self_check_answers         | null                 |
| team_size                  | solo                 |
| deployment_target          | cloudflare-pages     |
| ci_provider                | github-actions       |
| ci_default_flow            | auto-deploy-on-merge |
| has_auth                   | false                |
| has_payments               | false                |
| has_realtime               | false                |
| has_ai                     | false                |
| has_background_jobs        | false                |

## Next steps

Next: a future skill will set up agent context (CLAUDE.md, AGENTS.md). For now, your project is scaffolded and verified — happy hacking.

Useful manual steps in the meantime:
- `git init` (if you have not already) to start your own repo history.
- Review any `.scaffold` siblings the conflict policy created and decide which version of each file to keep.
- Address audit findings per your project's risk tolerance — the full breakdown is in this log.
