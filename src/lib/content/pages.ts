import { getEntry, type CollectionEntry } from "astro:content";

export type PageId =
  | "home"
  | "nasza-auto-szkola"
  | "kursy"
  | "cennik"
  | "porady-dla-kursanta"
  | "galeria"
  | "artykuly"
  | "prawo-jazdy-automat"
  | "kontakt";

export type PageEntry = CollectionEntry<"pages">;

export interface NewsTeaser {
  title: string;
  summary?: string;
}

/** S-03-parked: Markdown news teasers only — not live page copy. */
export async function getNewsTeasers(id: "home" | "artykuly"): Promise<NewsTeaser[] | undefined> {
  const entry = await getEntry("pages", id);
  if (!entry) {
    return undefined;
  }
  return entry.data.newsTeasers;
}
