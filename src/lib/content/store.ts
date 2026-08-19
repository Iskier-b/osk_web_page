import type { SupabaseClient } from "@supabase/supabase-js";

import type { MediaRow, PageRow, SiteCopyRow } from "@/types";

export type PageVisibilityResult = { status: "ok"; row: PageRow } | { status: "missing" } | { status: "error" };

/** @deprecated Use PageVisibilityResult from loadPageVisibility instead. */
export function assertPublicPage(page: PageRow | null): page is PageRow {
  return page !== null && page.visibility !== "hidden";
}

export function should404ForVisibility(visibility: PageVisibilityResult): boolean {
  return visibility.status === "missing" || (visibility.status === "ok" && visibility.row.visibility === "hidden");
}

export async function loadPageVisibility(client: SupabaseClient | null, slug: string): Promise<PageVisibilityResult> {
  if (!client) {
    return { status: "error" };
  }

  const response = await client.from("pages").select("*").eq("slug", slug).maybeSingle();

  if (response.error) {
    return { status: "error" };
  }

  if (!response.data) {
    return { status: "missing" };
  }

  return { status: "ok", row: response.data as PageRow };
}

export async function loadCopyKeys(client: SupabaseClient | null, keys: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  if (!client || keys.length === 0) {
    return map;
  }

  const response = await client.from("site_copy").select("key,value").in("key", keys);

  if (response.error) {
    return map;
  }

  const rows = response.data as SiteCopyRow[];
  for (const row of rows) {
    map.set(row.key, row.value);
  }

  return map;
}

export async function loadGalleryMedia(client: SupabaseClient | null, pageSlug: string): Promise<MediaRow[]> {
  if (!client) {
    return [];
  }

  const response = await client
    .from("media")
    .select("*")
    .eq("page_slug", pageSlug)
    .eq("kind", "gallery")
    .order("sort_order");

  if (response.error) {
    return [];
  }

  return response.data as MediaRow[];
}
