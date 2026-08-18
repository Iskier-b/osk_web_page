---
project: osk-juszczak
checked_at: 2026-08-19T00:38:00+02:00
health_status: critical-issues
context_type: brownfield
language_family: js
stack_assessment_available: true
checks_run:
  - lockfile
  - dependency_audit
  - outdated_deps
  - test_runner
  - ci_cd
  - configuration
audit_findings:
  critical: 1
  high: 13
  moderate: 7
  low: 2
test_runner_detected: false
ci_provider: GitHub Actions
recommended_fixes: 8
---

## Dependency Health

### Lockfile

```
Status: present (package-lock.json)
Package manager: npm
```

### Security Audit

```
Tool: npm audit --json
Summary: 1 CRITICAL, 13 HIGH, 7 MODERATE, 2 LOW
Direct vs transitive: 3 direct (astro HIGH, wrangler MODERATE, supabase MODERATE); remaining 20 are transitive
```

`npm audit` reports `fixAvailable: true` for every listed package. Review the lockfile after any fix — this report does not apply patches.

#### CRITICAL findings

- **tar** (transitive, range `<=7.5.20`) — [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw): node-tar decompression/parse DoS via unlimited input (npm labels this CRITICAL, CVSS 7.5). Related advisories in the same package: [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w) (infinite loop, HIGH), [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp), [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh), [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j), [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m). Fix: `npm audit fix` (or bump the parent that pulls `tar` until `tar@>=7.5.21`).

#### HIGH findings

- **astro** `6.3.1` (direct) — [GHSA-2pvr-wf23-7pc7](https://github.com/advisories/GHSA-2pvr-wf23-7pc7): Host header SSRF in prerendered error page fetch (HIGH, CVSS 7.5, fixed in `>=6.4.6`). [GHSA-8hv8-536x-4wqp](https://github.com/advisories/GHSA-8hv8-536x-4wqp): reflected XSS via unescaped slot name (HIGH, CVSS 7.1, fixed in `>=6.3.3`). Additional MODERATE XSS advisories remain until later 6.x / 7.x. Fix without jumping majors: `npm update astro` (wanted `6.4.8` under `^6.3.1`).
- **brace-expansion** (transitive) — [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) / [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895): ReDoS / OOM via unbounded expansion. Fix: `npm audit fix`.
- **devalue** (transitive) — [GHSA-77vg-94rm-hx3p](https://github.com/advisories/GHSA-77vg-94rm-hx3p): DoS via sparse array deserialization. Fix: `npm audit fix`.
- **fast-uri** (transitive) — [GHSA-v2hh-gcrm-f6hx](https://github.com/advisories/GHSA-v2hh-gcrm-f6hx) and related host-confusion advisories. Fix: `npm audit fix`.
- **js-yaml** (transitive) — [GHSA-52cp-r559-cp3m](https://github.com/advisories/GHSA-52cp-r559-cp3m): quadratic CPU via YAML merge keys. Fix: `npm audit fix`.
- **miniflare** (transitive, via wrangler) — inherits HIGH issues from `undici` / `ws`. Fix: bump `wrangler` (`4.90.0` → wanted `4.124.0`) then `npm audit`.
- **nanoid** (transitive) — [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8): infinite loop on zero/negative size. Fix: `npm audit fix`.
- **postcss** (transitive) — [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849): path traversal via sourceMappingURL. Fix: `npm audit fix`.
- **sharp** (transitive, via astro) — [GHSA-f88m-g3jw-g9cj](https://github.com/advisories/GHSA-f88m-g3jw-g9cj): inherited libvips CVEs. Fix: `npm audit fix` / astro bump.
- **svgo** (transitive) — [GHSA-2p49-hgcm-8545](https://github.com/advisories/GHSA-2p49-hgcm-8545): `removeScripts` leaves executable scripts. Fix: `npm audit fix`.
- **undici** (transitive, via miniflare/wrangler) — [GHSA-vmh5-mc38-953g](https://github.com/advisories/GHSA-vmh5-mc38-953g) TLS bypass plus additional HIGH cache/DoS issues; many fixed in `>=7.29.0`. Fix: bump wrangler / `npm audit fix`.
- **vite** (transitive; also pinned via `overrides.vite: ^7.3.2`, installed `7.3.3`) — [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff): `server.fs.deny` bypass on Windows (HIGH, CVSS 7.5, range through `7.3.4`). Fix: raise the Vite override above `7.3.4` after checking Astro compatibility.
- **ws** (transitive, including `@supabase/realtime-js`) — [GHSA-96hv-2xvq-fx4p](https://github.com/advisories/GHSA-96hv-2xvq-fx4p): memory-exhaustion DoS. Fix: `npm audit fix`.

MODERATE (7): **@astrojs/language-server** (via yaml stack); **@cloudflare/vite-plugin** (via wrangler); **supabase** CLI (direct); **volar-service-yaml**; **wrangler** (direct, via esbuild/miniflare); **yaml** ([GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) nested collection overflow); **yaml-language-server**.

LOW (2): **@babel/core** arbitrary file read via sourceMappingURL ([GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8)); **esbuild** Windows dev-server file read ([GHSA-g7r4-m6w7-qqqr](https://github.com/advisories/GHSA-g7r4-m6w7-qqqr)).

### Outdated Dependencies

```
Packages with major version gaps: 7
```

Direct dependencies whose latest major is ahead of installed (informational — do not jump majors just to clear this list):

- **typescript**: `5.9.3` → `7.0.2` (2 major versions behind). Stay on TypeScript 5 unless you plan a dedicated migration; ESLint `typescript-eslint@8` and Astro 6 target TS 5.
- **astro**: `6.3.1` → latest `7.2.3` (1 major). Prefer `npm update astro` to wanted `6.4.8` first — that closes the in-line HIGH SSRF/`<6.3.3` XSS without an Astro 7 migration.
- **@astrojs/cloudflare**: `13.5.0` → `14.2.2` (1 major; wanted within current range is `13.7.0`).
- **@astrojs/react**: `5.0.4` → `6.0.3` (1 major; wanted `5.0.7`).
- **eslint** / **@eslint/js**: `9.x` → `10.x` (1 major).
- **lint-staged**: `16.4.0` → `17.3.0` (1 major).

Minor/patch drift (not listed in detail): `@astrojs/check`, `@astrojs/sitemap`, `@radix-ui/react-slot`, `@supabase/supabase-js`, Tailwind 4.2 → 4.3, `wrangler` 4.90.0 → 4.124.0 (the wrangler bump is still worth doing because it pulls miniflare/undici fixes).

## Test Suite

```
Test runner: not detected
Tests found: not applicable
Test execution: not attempted
```

No `test` script in `package.json`, no Vitest/Jest/Playwright/Cypress config, and no `*.test.*` / `*.spec.*` files.

⚠ No test runner detected. The agent cannot verify its own changes.
Recommended: add Vitest (same Vite toolchain as Astro). From the project root:

```bash
npm init vitest@latest
```

Accept the Vitest defaults, then add a `test` script if the initializer does not (`"test": "vitest run"`). For Astro component tests, follow https://docs.astro.build/en/guides/testing/. Do not introduce a runner in a drive-by change — `AGENTS.md` currently forbids inventing a suite unless asked; update that section once Vitest is installed.

## CI/CD

```
Provider: GitHub Actions
Configuration: .github/workflows/ci.yml
```

| Stage      | Status | Notes                                      |
|------------|--------|--------------------------------------------|
| Lint       | ✓      | `npm run lint` (ESLint 9, type-checked rules) |
| Test       | ✗      | not configured — no test runner            |
| Build      | ✓      | `npx astro sync` then `npm run build`      |
| Type check | ✗      | no dedicated `astro check` / `tsc --noEmit`; type-aware ESLint runs in lint |
| Security   | ✗      | no `npm audit`, CodeQL, Dependabot, or Snyk |

Workflow triggers only on branch `master`. The local git branch observed at check time was `main`. If GitHub’s default branch is `main`, this workflow never runs.

`@astrojs/check` is a dependency but is not invoked in CI.

## Configuration

### High severity

None. `tsconfig.json` extends `astro/tsconfigs/strict`. `.gitignore` excludes `node_modules/`, `dist/`, `.env`, `.dev.vars`, and `.wrangler/`.

### Medium severity

- **zod (declared in AGENTS.md, not installed)** — `AGENTS.md` requires Zod validation on API routes, but `zod` is absent from `package.json` and there are no `from "zod"` imports. `src/pages/api/auth/{signin,signup}.ts` read `email`/`password` from `FormData` with unchecked `as string` casts. An agent following AGENTS.md will import a missing package; an agent following the existing files will skip validation. Fix: `npm install zod` and validate those handlers, or remove the Zod rule from AGENTS.md until APIs need it.

### Low severity

- **`.editorconfig`** — missing. Editors and agents may disagree on indent/charset outside Prettier’s reach. Fix: add a root `.editorconfig` with `root = true`, `indent_size = 2`, `end_of_line = lf`, `charset = utf-8`, `insert_final_newline = true`.

Present and adequate: `.prettierrc.json`, `eslint.config.js`, `tsconfig.json` (strict), `.gitignore`, `.env.example` (`SUPABASE_URL`, `SUPABASE_KEY`), `AGENTS.md`, `CLAUDE.md`.

## Stack Assessment Cross-Reference

```
Stack assessment: context/foundation/stack-assessment.md
Agent readiness (from stack-assess): ready
```

Stack-assess scored the *choice* of TypeScript + Astro + Vite/Cloudflare as agent-friendly. Health-check scores *operational* state. No quality-gate failures to reinforce.

| Quality Gate Gap | Health-Check Finding | Status |
|------------------|----------------------|--------|
| (none — all scored gates passed) | — | — |
| Non-gate: no test runner | Confirmed: no runner, no test CI stage. AGENTS.md already says do not invent tests. | Reinforced (operational, not a stack-choice fail) |
| Non-gate: Zod instruction/code drift | Confirmed: Zod not in package.json; auth API routes unvalidated. | Reinforced |
| Typed: pass | `tsconfig` strict; ESLint `strictTypeChecked` in the lint CI job. No dedicated `astro check` step. | Mitigated locally; CI type-check still incomplete |
| Compensation entries | Stack-assess recommended none. AGENTS.md / CLAUDE.md already present with routing, secrets, and lint/build gates. | Mitigated |

## Recommended Fixes

### Fix before agent work (Category A)

### 1. Patch the CRITICAL `tar` advisory (and apply available audit fixes)

**Impact**: A CRITICAL transitive advisory plus 13 HIGH findings mean agents will keep regenerating vulnerable lockfile state, and production/dev tooling may be exploitable (especially Astro XSS/SSRF and Vite’s Windows `fs.deny` bypass on this machine).
**Severity**: critical
**Effort**: moderate (15–30 min)
**Fix**:

```bash
npm audit fix
npm update astro wrangler
```

Then re-run `npm audit`. If `tar` remains, `npm ls tar` and bump the parent, or `npm audit fix --force` only after reading what it would major-bump. Afterward, `npm run lint` and `npm run build`. Do not jump Astro 6 → 7 in this pass.

### 2. Upgrade Astro within 6.x (direct HIGH)

**Impact**: Installed `astro@6.3.1` is below `6.3.3` (slot XSS) and `6.4.6` (Host-header SSRF). This is the only HIGH finding on a direct runtime framework dependency.
**Severity**: high
**Effort**: quick (< 5 min) if grouped with item 1
**Fix**:

```bash
npm update astro
```

Confirm `node_modules/astro/package.json` reports `>=6.4.6` (wanted at check time: `6.4.8`). Stay on the 6.x line until you schedule an Astro 7 migration.

### 3. Raise the Vite override past the Windows `fs.deny` advisory

**Impact**: `package.json` pins `"vite": "^7.3.2"`; installed `7.3.3` is still in the HIGH range through `7.3.4` ([GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff)). Local development is on Windows.
**Severity**: high
**Effort**: quick (< 5 min)
**Fix**:

Change the override to a release newer than `7.3.4` once compatible with `@astrojs/cloudflare` / Vite 7, e.g. `"vite": "^7.3.5"` (or whatever `npm view vite version` reports as current 7.x), then `npm install`.

### 4. Install a test runner (Vitest)

**Impact**: Without tests, an agent can only gate on lint and build. Regressions in auth handlers, middleware, or components will not be caught. This is the largest agent-workflow gap after security.
**Severity**: high
**Effort**: significant (> 1 hour)
**Fix**:

```bash
npm init vitest@latest
```

Add `"test": "vitest run"` if missing. Add one smoke test (for example, a Zod schema or a pure helper in `src/lib/`). Then add a CI step `npm test` next to lint. Update `AGENTS.md` Testing from “do not invent a suite” to “run `npm test` after behavior changes.”

### 5. Resolve the Zod instruction/code drift

**Impact**: Agents will either import a package that is not installed or skip the documented validation rule. Auth POST handlers currently cast form fields without schema checks.
**Severity**: medium
**Effort**: moderate (15–30 min)
**Fix**:

```bash
npm install zod
```

Validate `email` and `password` in `src/pages/api/auth/signin.ts` and `signup.ts` with a shared schema (for example in `src/lib/`). Keep the rule in AGENTS.md once the dependency exists.

### 6. Align CI with the default branch and add test / `astro check`

**Impact**: `.github/workflows/ci.yml` listens to `master` only; the repo was on `main` at check time. Type-aware lint is not a substitute for `astro check`. There is no test or audit job.
**Severity**: medium
**Effort**: moderate (15–30 min)
**Fix**:

- Trigger on `main` as well as `master` (or only the real default branch).
- Add `npx astro check` after `astro sync` (you already depend on `@astrojs/check`).
- After Vitest exists, add `npm test`.
- Optional: `npm audit --audit-level=high` (may fail the job until item 1 is done).

### 7. Do not jump TypeScript 5 → 7 opportunistically

**Impact**: Two major versions behind looks stale, but TS 7 plus `typescript-eslint` 8 and Astro 6 is a migration, not a health patch. An agent “helpfully” upgrading TypeScript will break the lint pipeline.
**Severity**: low
**Effort**: significant (> 1 hour) if done at all
**Fix**:

Leave `typescript@^5.9.3`. If you later migrate, treat it as its own change with ESLint and Astro compatibility research — not part of the audit-fix pass.

### 8. Add `.editorconfig`

**Impact**: Convenience only; Prettier already formats JS/TS/Astro/JSON/CSS/MD.
**Severity**: low
**Effort**: quick (< 5 min)
**Fix**:

Create `.editorconfig`:

```
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

### Addressed in upcoming lessons (Category B)

CI, instruction files, and Wrangler deploy config are already in the repo — they are not missing “course gaps.” Remaining Category B items are optional hardening, not blockers to start agent work after Category A security + tests.

### Dependabot / CI security scanning

**Lesson**: [Sprint Zero z Agentem: infrastruktura, walking skeleton i pierwszy deploy (M1L5)](https://platforma.przeprogramowani.pl/external/10xdevs-3/m1-l5)
**What you'll do there**: Add Dependabot or a scheduled audit so HIGH/CRITICAL advisories do not sit until the next manual `npm audit`.

### Agent instruction files

**Lesson**: [Agent Onboarding: Agents.md, AI Rules i feedback loops (M1L4)](https://platforma.przeprogramowani.pl/external/10xdevs-3/m1-l4)
**What you'll do there**: You already have `AGENTS.md` and `CLAUDE.md`. Onboarding is a review/tighten pass (especially the Testing section after Vitest, and the Zod rule after the install) rather than creating stubs from scratch.

## Summary

Health status: critical-issues

The stack choice is sound (see `stack-assessment.md`), and local toolchain quality is high: lockfile, strict TypeScript, ESLint, Prettier, GitHub Actions lint+build, Wrangler, and instruction files are all present. Operational health is not: `npm audit` reports 1 CRITICAL (`tar`) and 13 HIGH (including direct `astro@6.3.1` XSS/SSRF), there is no test runner, CI does not run tests or `astro check` and may be pointed at the wrong branch, and AGENTS.md requires Zod that is not installed.

Next step: apply Category A items 1–3 (audit fix + Astro 6.4.x + Vite override) before more feature work; then add Vitest and close the Zod drift. After that, agent onboarding is a review of existing instruction files, not a cold start.
