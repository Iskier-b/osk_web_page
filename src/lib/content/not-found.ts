import type { AstroGlobal } from "astro";

export function setPageNotFound(astro: AstroGlobal): void {
  astro.response.status = 404;
  astro.response.statusText = "Not Found";
}

/** @deprecated Use setPageNotFound — early return in frontmatter breaks ESLint on some routes. */
export function notFoundResponse(): Response {
  return new Response(null, { status: 404, statusText: "Not Found" });
}
