import type { MediaRow } from "@/types";

import { resolveCopy } from "@/lib/content/resolve-copy";

import type { GalleryImageView } from "./page-types";

export function mapGalleryImages(mediaRows: MediaRow[], copyMap: Map<string, string>): GalleryImageView[] {
  const images: GalleryImageView[] = [];

  for (const row of mediaRows) {
    const alt = resolveCopy(row.alt_key, copyMap);
    const src = row.url || alt;

    if (!src && !row.alt_key) {
      continue;
    }

    images.push({
      src,
      alt: alt || row.alt_key,
    });
  }

  return images;
}
