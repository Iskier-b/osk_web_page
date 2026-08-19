import type { AstroGlobal } from "astro";

/** Canonical 404 pattern for public page routes — sets status while Astro continues rendering (empty body). */
export function setPageNotFound(astro: AstroGlobal): void {
  astro.response.status = 404;
  astro.response.statusText = "Not Found";
}

/** @deprecated Use setPageNotFound — early return in frontmatter breaks ESLint on some routes. */
export function notFoundResponse(): Response {
  return new Response(null, { status: 404, statusText: "Not Found" });
}
