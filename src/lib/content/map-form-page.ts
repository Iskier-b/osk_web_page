import { pageKey, slugToArea } from "@/lib/content/keys";
import { isMissingKey, resolveCopy } from "@/lib/content/resolve-copy";

import type { FormPageView } from "./page-types";

export function mapFormPage(slug: string, copyMap: Map<string, string>): FormPageView {
  const area = slugToArea(slug);
  const titleKey = pageKey(area, "title");
  const title = resolveCopy(titleKey, copyMap);

  const view: FormPageView = {
    title: isMissingKey(titleKey, title) ? titleKey : title,
  };

  if (slug === "referencje") {
    const subtitleKey = pageKey(area, "hero_subtitle");
    const heroSubtitle = resolveCopy(subtitleKey, copyMap);
    view.heroSubtitle = isMissingKey(subtitleKey, heroSubtitle) ? subtitleKey : heroSubtitle;
  }

  return view;
}
