import type { AstroGlobal } from "astro";

import { renderMarkdownBody } from "@/lib/content/markdown";
import { mapContentPage } from "@/lib/content/map-content-page";
import { mapFormPage } from "@/lib/content/map-form-page";
import { mapGalleryImages } from "@/lib/content/map-gallery";
import { mapStubPage } from "@/lib/content/map-stub-page";
import { pageKey, slugToArea } from "@/lib/content/keys";
import {
  GALLERY_PAGE_SLUGS,
  isPublicPageSlug,
  PAGE_COPY_KEYS,
  PAGE_REGISTRY_KIND,
  type PublicPageSlug,
} from "@/lib/content/page-key-registry";
import type { ContentPageView, FormPageView, StubPageView } from "@/lib/content/page-types";
import { resolveCopy } from "@/lib/content/resolve-copy";
import { assertPublicPage, loadCopyKeys, loadGalleryMedia, loadPageVisibility } from "@/lib/content/store";
import { createClient } from "@/lib/supabase";

export type LoadPublicPageResult =
  | { notFound: true }
  | { kind: "content"; view: ContentPageView }
  | { kind: "stub"; view: StubPageView }
  | { kind: "form"; view: FormPageView };

export { STATIC_NEWS_SLUGS } from "@/lib/content/page-key-registry";

export function isContentPage(result: LoadPublicPageResult): result is { kind: "content"; view: ContentPageView } {
  return !("notFound" in result) && result.kind === "content";
}

export function isStubPage(result: LoadPublicPageResult): result is { kind: "stub"; view: StubPageView } {
  return !("notFound" in result) && result.kind === "stub";
}

export function isFormPage(result: LoadPublicPageResult): result is { kind: "form"; view: FormPageView } {
  return !("notFound" in result) && result.kind === "form";
}

export async function loadPublicPage(slug: string, astro: AstroGlobal): Promise<LoadPublicPageResult> {
  if (!isPublicPageSlug(slug)) {
    return { notFound: true };
  }

  const client = createClient(astro.request.headers, astro.cookies);
  const pageRow = await loadPageVisibility(client, slug);

  if (!assertPublicPage(pageRow)) {
    return { notFound: true };
  }

  const keys = [...PAGE_COPY_KEYS[slug]];
  const copyMap = await loadCopyKeys(client, keys);

  const area = slugToArea(slug);
  const bodyMarkdown = resolveCopy(pageKey(area, "body"), copyMap);
  const bodyHtml = bodyMarkdown && bodyMarkdown !== pageKey(area, "body") ? await renderMarkdownBody(bodyMarkdown) : "";

  const kind = PAGE_REGISTRY_KIND[slug];

  if (kind === "stub") {
    return {
      kind: "stub",
      view: mapStubPage(slug, copyMap, bodyHtml),
    };
  }

  if (kind === "form") {
    return {
      kind: "form",
      view: mapFormPage(slug, copyMap),
    };
  }

  let galleryImages;
  if (GALLERY_PAGE_SLUGS.has(slug)) {
    const mediaRows = await loadGalleryMedia(client, slug);
    galleryImages = mapGalleryImages(mediaRows, copyMap);
  }

  return {
    kind: "content",
    view: mapContentPage(slug, copyMap, bodyHtml, galleryImages),
  };
}

/** Static hero image src paths — alt comes from store; src stays a static file per PRD. */
export const STATIC_HERO_IMAGES: Partial<Record<PublicPageSlug, { src: string }>> = {
  home: { src: "/images/osk/fleet-01.webp" },
  "nasza-auto-szkola": { src: "/images/osk/fleet-01.webp" },
};

export function heroImageForPage(
  slug: PublicPageSlug,
  heroImageAlt: string | undefined,
): { src: string; alt: string } | undefined {
  const staticHero = STATIC_HERO_IMAGES[slug];
  if (!staticHero || !heroImageAlt) {
    return undefined;
  }
  return { src: staticHero.src, alt: heroImageAlt };
}
