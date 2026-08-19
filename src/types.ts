/** Content-store enums and row shapes (mirrors supabase content-store migration). */

export type ContentVisibility = "hidden" | "displayed" | "pinned";

export type PageKind = "content" | "stub" | "form";

export type NavPlacement = "primary" | "footer" | "chrome";

export type MediaKind = "gallery" | "article";

export interface SiteCopyRow {
  key: string;
  value: string;
  updated_at: string;
}

export interface PageRow {
  slug: string;
  path: string;
  kind: PageKind;
  visibility: ContentVisibility;
}

export interface NavSlotRow {
  id: string;
  parent_id: string | null;
  placement: NavPlacement;
  sort_order: number;
  label_key: string;
  href_key: string;
}

export interface ArticleRow {
  slug: string;
  visibility: ContentVisibility;
  published_at: string;
  sort_order: number;
  title_key: string;
  summary_key: string;
  body_key: string;
}

export interface MediaRow {
  id: string;
  kind: MediaKind;
  page_slug: string | null;
  article_slug: string | null;
  sort_order: number;
  url: string;
  alt_key: string;
}
