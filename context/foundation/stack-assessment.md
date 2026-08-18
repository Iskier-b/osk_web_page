---
project: osk-juszczak
assessed_at: 2026-08-19T00:22:00+02:00
agent_readiness: ready
context_type: brownfield
stack_components:
  language: TypeScript
  framework: Astro 6 + React 19
  build_tool: Astro CLI (Vite 7) + @astrojs/cloudflare
  test_runner: null
  package_manager: npm
  ci_provider: GitHub Actions
  deployment_target: Cloudflare Workers
gates_passed: 7
gates_failed: 0
---

## Stack Components

**Language.** TypeScript 5.9 with Node 22.14.0 (`.nvmrc`). `tsconfig.json` extends `astro/tsconfigs/strict`. ESLint uses `typescript-eslint` `strictTypeChecked` and `stylisticTypeChecked` with `projectService: true` (`eslint.config.js`). Path alias `@/*` → `./src/*`.

**Framework.** Astro `^6.3.1` in full SSR mode (`output: "server"` in `astro.config.mjs`) with React `^19.2.6` islands (`@astrojs/react`), Tailwind CSS 4 (`@tailwindcss/vite`), and Supabase SSR (`@supabase/ssr`, `@supabase/supabase-js`). shadcn/ui ("new-york") lives under `src/components/ui/`. Auth is cookie-session via `src/lib/supabase.ts` and `src/middleware.ts`.

**Build tool.** `astro build` / `astro preview` wrapping Vite 7 (`package.json` overrides). Production adapter is `@astrojs/cloudflare` `^13.5.0`. Local and production Worker config is `wrangler.jsonc` (`compatibility_date: 2026-05-08`, `nodejs_compat`).

**Test runner.** Not present. No `test` script in `package.json`, no Jest/Vitest/Playwright config, and no `*.test.*` / `*.spec.*` files. Verification today is `npm run lint` plus `npm run build`.

**Package manager / CI / deploy.** npm (`package-lock.json`). GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci`, `npx astro sync`, `npm run lint`, and `npm run build` on push/PR to `master`. Deploy target is Cloudflare Workers via Wrangler.

**Instruction files.** `AGENTS.md` and `CLAUDE.md` already encode folder layout, auth/secret rules, Tailwind `cn()`, Zod-at-API-boundaries, Supabase RLS, and the “do not invent a test suite” rule.

## Quality Gate Assessment

| Component  | Typed | Convention | Training Data | Documented | Verdict    |
|------------|-------|------------|---------------|------------|------------|
| Language   | ✓     | —          | —             | —          | pass       |
| Framework  | —     | ✓          | ✓             | ✓          | pass       |
| Build tool | —     | ✓          | ✓             | ✓          | pass       |
| Test runner| —     | —          | —             | —          | n/a        |

Legend: ✓ = pass, ✗ = fail, ~ = partial, — = not applicable

### Gate Details

**Typed (language) — pass.** Evidence: `tsconfig.json` extends `astro/tsconfigs/strict`; `package.json` lists `typescript` `^5.9.3` and `@astrojs/check`; `eslint.config.js` extends `tseslint.configs.strictTypeChecked`. An agent can read function and module contracts from types without running the app.

**Convention-based (framework) — pass.** Astro ships file-based routing (`src/pages/`), island architecture, and a conventional `astro.config.mjs`. This project further documents layout in `AGENTS.md` / `CLAUDE.md`: Astro for static/layout, React only for interactivity, API routes under `src/pages/api/` with `prerender = false`, helpers in `src/lib/`, hooks in `src/components/hooks/`.

**Popular in training data (framework) — pass.** Assessed inside the JS/TS family. Astro is a mainstream meta-framework; React is the dominant UI library in that family. React 19 and Astro 6 are current majors of those same products, not a niche fork. Training examples may still skew toward Astro 4/5 and React 18 APIs — prefer current official docs over older blog posts when APIs diverge.

**Well-documented (framework) — pass.** Astro publishes current, versioned docs at https://docs.astro.build. React docs are at https://react.dev. The Cloudflare adapter is documented at https://docs.astro.build/en/guides/integrations-guide/cloudflare/ and https://developers.cloudflare.com/workers/. Tailwind 4 docs are at https://tailwindcss.com/docs.

**Convention-based (build tool) — pass.** Build entry is the Astro CLI (`npm run build` → `astro build`). Config lives in the conventional `astro.config.mjs`; Worker packaging is `wrangler.jsonc`. Vite is an implementation detail behind Astro, not an ad-hoc bundler setup.

**Popular in training data (build tool) — pass.** Astro CLI + Vite are standard in the JS/TS toolchain. Wrangler is the standard Cloudflare Workers CLI.

**Well-documented (build tool) — pass.** Astro build docs, Vite docs, and Wrangler docs are official and versioned. This repo pins Wrangler `^4.90.0` and records `compatibility_date` in `wrangler.jsonc`.

**Test runner — not applicable.** No runner is installed, so training-data and documentation gates have nothing to score. This is a verification gap, not a failed quality gate on an existing tool. `AGENTS.md` already tells agents not to invent a suite and to gate changes on lint + build.

## Gaps & Compensation

No quality-gate failures on the installed language, framework, or build tool. The stack is agent-friendly without extra instruction-file scaffolding.

**Non-gate observation (verification).** There is no automated test runner. That weakens agent feedback loops (an agent cannot prove a behavior change except via lint/build). Compensation is already in `AGENTS.md` under Testing. `/10x-health-check` is the right next step if you want to decide whether to add a runner.

**Non-gate observation (instruction/code drift).** `AGENTS.md` requires Zod validation on API routes, but `zod` is not listed in `package.json` dependencies. That is not a stack-quality failure; it is a convention that is not yet installed. Health-check should flag it if API routes are in active scope.

### Recommended Instruction File Additions

None required for quality-gate compensation. Existing `AGENTS.md` / `CLAUDE.md` already cover conventions, secrets, and the missing-test-runner rule.

Optional (not required) note if Astro 6 / React 19 examples start to drift from older training data — paste only if you see repeated outdated APIs:

```markdown
## Current major versions

This project uses Astro 6, React 19, and Tailwind 4. Prefer current official docs over tutorials written for Astro 4/5, React 18, or Tailwind 3. Do not add `"use client"` (Next.js). Astro islands do not use that directive. Do not introduce a test runner or `*.test.*` files unless explicitly asked; verify with `npm run lint` and `npm run build`.
```

## Summary

The OSK Juszczak stack is **ready** for agent workflows. TypeScript is strict and type-checked in ESLint; Astro is convention-based, mainstream in JS/TS, and well documented; the Astro/Vite/Cloudflare build path is equally standard. Instruction files already encode project-specific rules (SSR, Supabase secrets, islands vs React, Tailwind `cn()`).

The main gap is operational, not stack-quality: no test runner, plus a possible Zod dependency drift. Neither requires replacing the stack.

**Next step:** `/10x-health-check` — audit dependencies, secrets, CI, and the missing-test-runner / Zod drift items identified here.
