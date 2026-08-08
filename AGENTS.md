# Repository Guidelines

OSK Juszczak redesign: Astro 6 SSR with React 19 islands, TypeScript, Tailwind 4, Supabase, and Cloudflare Workers. Product brief: `@context/foundation/prd.md`. Deeper stack rules: `@CLAUDE.md`.

## Hard rules

- Keep `SUPABASE_URL` / `SUPABASE_KEY` server-only via `astro:env/server`; never expose them to the client.
- API routes under `src/pages/api/` must export `const prerender = false`.
- Prefer Astro for static/layout; React only for interactivity. No Next.js directives (`"use client"`).
- Merge Tailwind classes with `cn()` from `@/lib/utils` — do not concatenate class strings.
- Validate API input with zod. New DB tables: `supabase/migrations/YYYYMMDDHHmmss_short_description.sql` with RLS enabled and per-operation policies.
- Leave `@context/` chain docs intact; do not overwrite them when generating or scaffolding files.

## Project structure

- `src/pages/` routes; `src/pages/api/` endpoints; `src/pages/auth/` auth pages; `src/pages/dashboard.astro` is the protected example.
- `src/components/` Astro + React UI; `src/components/ui/` shadcn ("new-york"); layouts in `src/layouts/`; helpers in `src/lib/`; auth middleware in `src/middleware.ts`.
- Assets: `public/`, styles in `src/styles/`, Cloudflare config in `@wrangler.jsonc`, product/process docs in `context/`.
- Path alias `@/*` → `./src/*` (`@tsconfig.json`).

## Build, test, and development commands

- `npm run dev` — Cloudflare workerd local server.
- `npm run build` / `npm run preview` — production build and preview.
- `npm run lint` / `npm run lint:fix` — ESLint; `npm run format` — Prettier.
- Use Node **22.14.0** (`@.nvmrc`). Copy `@.env.example` to `.env` and `.dev.vars` before local Cloudflare/Supabase work.

## Coding style & naming

ESLint + Prettier enforce formatting (`@eslint.config.js`, `@.prettierrc.json`). Pre-commit: husky + lint-staged runs `eslint --fix` on `*.{ts,tsx,astro}` and Prettier on `*.{json,css,md}`. Put shared entity/DTO types in `src/types.ts`, React hooks in `src/components/hooks/`, and business helpers in `src/lib/` (or `src/lib/services/`). Add shadcn components with `npx shadcn@latest add <name>`.

## Testing

No test runner or `*.test.*` / `*.spec.*` files are present. Do not invent a suite unless asked; gate changes on `npm run lint` and `npm run build`.

## Commits & pull requests

Recent history uses freeform English sentences — commit style is not locked yet. PRs target `master`. CI (`.github/workflows/ci.yml`) runs `npm ci`, `npx astro sync`, `npm run lint`, and `npm run build` (build needs repo secrets `SUPABASE_URL`, `SUPABASE_KEY`). Deploy with `npx wrangler deploy` after Cloudflare auth; setup details in `@README.md`.
