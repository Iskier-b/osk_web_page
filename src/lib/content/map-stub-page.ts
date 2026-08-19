import { pageKey, slugToArea } from "@/lib/content/keys";
import { isMissingKey, resolveCopy } from "@/lib/content/resolve-copy";

import type { StubPageView } from "./page-types";

export function mapStubPage(slug: string, copyMap: Map<string, string>, bodyHtml: string): StubPageView {
  const area = slugToArea(slug);
  const titleKey = pageKey(area, "title");
  const title = resolveCopy(titleKey, copyMap);

  return {
    title: isMissingKey(titleKey, title) ? titleKey : title,
    bodyHtml,
  };
}
