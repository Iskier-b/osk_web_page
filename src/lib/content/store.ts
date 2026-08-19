import type { SupabaseClient } from "@supabase/supabase-js";

import type { MediaRow, PageRow, SiteCopyRow } from "@/types";

export function assertPublicPage(page: PageRow | null): page is PageRow {
  return page !== null && page.visibility !== "hidden";
}

export async function loadPageVisibility(client: SupabaseClient | null, slug: string): Promise<PageRow | null> {
  if (!client) {
    return null;
  }

  const response = await client.from("pages").select("*").eq("slug", slug).maybeSingle();

  if (response.error) {
    return null;
  }

  return (response.data as PageRow | null) ?? null;
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
