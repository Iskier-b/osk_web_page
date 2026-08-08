---
bootstrapped_at: 2026-08-08T20:16:00Z
starter_id: astro
starter_name: "Astro"
project_name: osk-juszczak-redesign
language_family: js
package_manager: npm
cwd_strategy: subdir-then-move
bootstrapper_confidence: verified
phase_3_status: ok
audit_command: "npm audit --json"
---

## Hand-off

Session overrides applied for this run (file on disk unchanged):

| Field | Hand-off file | This run |
| ----- | ------------- | -------- |
| starter_id | 10x-astro-starter | astro |
| deployment_target | cloudflare-pages | github-pages |

Hand-off file (`context/foundation/tech-stack.md`) as of this run:

```yaml
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
```

## Why this stack

A greenfield web-app MVP (medium audience, 5 after-hours weeks) accepted the recommended default for web + JavaScript/TypeScript: Astro + React + TypeScript with Cloudflare Pages deploy. Standard path — no auth, payments, realtime, in-product AI, or background jobs in scope (FR-001 site mapping is a build-time work step, not a product feature). Cloudflare Pages covers the public free-static URL requirement; GitHub Actions auto-deploys on merge. Scaffolding support is first-class (registered CLI, not fully battle-tested). Lean plain Astro was flagged as a fit for a static business-card site; the user kept the full recommended starter anyway.

## Pre-scaffold verification

| Signal             | Value                                         | Severity | Notes                                      |
| ------------------ | --------------------------------------------- | -------- | ------------------------------------------ |
| npm package        | create-astro v5.2.3 published 2026-07-27      | fresh    | resolved from cmd_template                 |
| GitHub repo        | not run                                       | —        | docs_url is https://docs.astro.build (not GitHub) |

## Scaffold log

**Resolved invocation**: `npm create astro@latest -- .bootstrap-scaffold --template basics --install --git --yes`
**Strategy**: subdir-then-move
**Exit code**: 0
**Notes**: create-astro reported a transient dependency-install failure inside `.bootstrap-scaffold/` (no `node_modules` / lockfile in the temp tree). Overall CLI exit was still 0; template files were present. Nested `.git/` from `--git` was deleted before move-up (cwd already has `.git/`).
**Files moved**: 0
**Conflicts (.scaffold siblings)**: `.vscode`, `public`, `src`, `AGENTS.md`, `astro.config.mjs`, `CLAUDE.md`, `package.json`, `README.md`, `tsconfig.json`
**.gitignore handling**: append-merged
**.bootstrap-scaffold cleanup**: deleted

**Outcome**: existing 10x-astro-starter tree won every conflict. Live project remains the prior starter (Supabase/Cloudflare). Plain Astro basics lives only in `*.scaffold` siblings.

## Post-scaffold audit

**Tool**: npm audit --json
**Summary**: 1 CRITICAL, 13 HIGH, 7 MODERATE, 2 LOW
**Direct vs transitive**: 0/1/2/0 direct of total 1/13/7/2 (audit ran against the winning cwd tree — prior 10x-astro-starter deps)

#### CRITICAL findings

- **tar** (transitive, `<=7.5.20`) — node-tar PAX/GNU header differentials and path-type confusion; fix available.

#### HIGH findings

- **astro** (direct, `<=7.0.9`) — reflected XSS via slot name; Host header SSRF in prerendered error page fetch; fix available.
- **brace-expansion** (transitive) — DoS via exponential-time expansion; fix available.
- **devalue** (transitive) — DoS via sparse array deserialization; fix available.
- **fast-uri** (transitive) — host confusion via backslash authority; fix available.
- **js-yaml** (transitive) — quadratic-complexity DoS in merge keys; fix available.
- **miniflare** (transitive) — advisory chain via sharp/undici; fix available.
- **nanoid** (transitive) — non-secure generators can loop with bad size; fix available.
- **postcss** (transitive) — path traversal via sourceMappingURL; fix available.
- **sharp** (transitive, `<0.35.0`) — libvips CVEs; fix available.
- **svgo** (transitive) — removeScripts leaves some scripts intact; fix available.
- **undici** (transitive) — TLS validation bypass / header injection; fix available.
- **vite** (transitive) — Windows fs.deny bypass / launch-editor NTLM; fix available.
- **ws** (transitive) — uninitialized memory disclosure / DoS; fix available.

#### MODERATE findings

- **@astrojs/language-server**, **@cloudflare/vite-plugin**, **supabase** (direct), **volar-service-yaml**, **wrangler** (direct), **yaml**, **yaml-language-server** — see `npm audit` for full advisory list. Logged only.

#### LOW / INFO findings

- **@babel/core**, **esbuild** (transitive) — logged only.

## Hints recorded but not acted on

| Hint                       | Value (hand-off file) | Session override |
| -------------------------- | --------------------- | ---------------- |
| bootstrapper_confidence    | first-class           | verified (from astro card) |
| quality_override           | false                 | — |
| path_taken                 | standard              | — |
| self_check_answers         | null                  | — |
| team_size                  | solo                  | — |
| deployment_target          | cloudflare-pages      | github-pages |
| ci_provider                | github-actions        | — |
| ci_default_flow            | auto-deploy-on-merge  | — |
| has_auth                   | false                 | — |
| has_payments               | false                 | — |
| has_realtime               | false                 | — |
| has_ai                     | false                 | — |
| has_background_jobs        | false                 | — |

## Next steps

Next: a future skill will set up agent context (CLAUDE.md, AGENTS.md). For now, your project is scaffolded and verified — happy hacking.

Useful manual steps in the meantime:
- Because the conflict policy kept the old starter as the live tree, review `*.scaffold` siblings if you want plain Astro basics instead — or clear the prior scaffold and re-run `/10x-bootstrapper` in a clean directory.
- Update `context/foundation/tech-stack.md` if the session overrides (`astro`, `github-pages`) should become the permanent hand-off.
- Address audit findings per your project's risk tolerance — the full breakdown is in this log.
- `git init` is already present; no nested starter history was imported.
