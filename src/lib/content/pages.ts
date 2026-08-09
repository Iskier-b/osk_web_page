import { getEntry, render, type CollectionEntry } from "astro:content";

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

export async function getPageEntry(id: PageId) {
  const entry = await getEntry("pages", id);

  if (!entry) {
    throw new Error(`Missing content entry: pages/${id}`);
  }

  const { Content } = await render(entry);

  return { entry, Content };
}
