import { pageKey, slugToArea } from "@/lib/content/keys";
import { isMissingKey, resolveCopy } from "@/lib/content/resolve-copy";

import type { CtaView } from "./page-types";

function resolveCta(
  area: string,
  prefix: "cta_" | "secondary_cta_",
  copyMap: Map<string, string>,
): CtaView | undefined {
  const labelKey = pageKey(area, `${prefix}label`);
  const hrefKey = pageKey(area, `${prefix}href`);
  const label = resolveCopy(labelKey, copyMap);
  const href = resolveCopy(hrefKey, copyMap);

  if (isMissingKey(labelKey, label) && isMissingKey(hrefKey, href)) {
    return undefined;
  }

  return { label, href };
}

function collectNumberedStrings(area: string, prefix: string, copyMap: Map<string, string>, max = 20): string[] {
  const values: string[] = [];

  for (let i = 1; i <= max; i += 1) {
    const key = pageKey(area, `${prefix}${i}`);
    const value = resolveCopy(key, copyMap);
    if (isMissingKey(key, value)) {
      break;
    }
    values.push(value);
  }

  return values;
}

function collectPriceRows(area: string, copyMap: Map<string, string>): import("./page-types").PriceRowView[] {
  const rows: import("./page-types").PriceRowView[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const labelKey = pageKey(area, `price_${i}_label`);
    const label = resolveCopy(labelKey, copyMap);
    if (isMissingKey(labelKey, label)) {
      break;
    }

    const priceKey = pageKey(area, `price_${i}_price`);
    const noteKey = pageKey(area, `price_${i}_note`);
    const price = resolveCopy(priceKey, copyMap);
    const note = resolveCopy(noteKey, copyMap);

    rows.push({
      label,
      price: isMissingKey(priceKey, price) ? undefined : price,
      note: isMissingKey(noteKey, note) ? undefined : note,
    });
  }

  return rows;
}

function collectDashboardItems(area: string, copyMap: Map<string, string>): import("./page-types").DashboardItemView[] {
  const items: import("./page-types").DashboardItemView[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const titleKey = pageKey(area, `dashboard_${i}_title`);
    const title = resolveCopy(titleKey, copyMap);
    if (isMissingKey(titleKey, title)) {
      break;
    }

    const bodyKey = pageKey(area, `dashboard_${i}_body`);
    const hrefKey = pageKey(area, `dashboard_${i}_href`);
    const linkLabelKey = pageKey(area, `dashboard_${i}_link_label`);
    const body = resolveCopy(bodyKey, copyMap);
    const href = resolveCopy(hrefKey, copyMap);
    const linkLabel = resolveCopy(linkLabelKey, copyMap);

    items.push({
      title,
      body: isMissingKey(bodyKey, body) ? bodyKey : body,
      href: isMissingKey(hrefKey, href) ? undefined : href,
      linkLabel: isMissingKey(linkLabelKey, linkLabel) ? undefined : linkLabel,
    });
  }

  return items;
}

function collectReviewQuotes(area: string, copyMap: Map<string, string>): import("./page-types").ReviewQuoteView[] {
  const quotes: import("./page-types").ReviewQuoteView[] = [];

  for (let i = 1; i <= 20; i += 1) {
    const authorKey = pageKey(area, `review_${i}_author`);
    const quoteKey = pageKey(area, `review_${i}_quote`);
    const author = resolveCopy(authorKey, copyMap);
    const quote = resolveCopy(quoteKey, copyMap);

    if (isMissingKey(authorKey, author) && isMissingKey(quoteKey, quote)) {
      break;
    }

    quotes.push({
      author: isMissingKey(authorKey, author) ? authorKey : author,
      quote: isMissingKey(quoteKey, quote) ? quoteKey : quote,
    });
  }

  return quotes;
}

export function mapContentPage(
  slug: string,
  copyMap: Map<string, string>,
  bodyHtml: string,
  galleryImages?: import("./page-types").GalleryImageView[],
): import("./page-types").ContentPageView {
  const area = slugToArea(slug);

  const titleKey = pageKey(area, "title");
  const heroTitleKey = pageKey(area, "hero_title");
  const title = resolveCopy(titleKey, copyMap);
  const heroTitle = resolveCopy(heroTitleKey, copyMap);

  const descriptionKey = pageKey(area, "description");
  const heroSubtitleKey = pageKey(area, "hero_subtitle");
  const heroImageAltKey = pageKey(area, "hero_image_alt");
  const description = resolveCopy(descriptionKey, copyMap);
  const heroSubtitle = resolveCopy(heroSubtitleKey, copyMap);
  const heroImageAlt = resolveCopy(heroImageAltKey, copyMap);

  const view: import("./page-types").ContentPageView = {
    title: isMissingKey(titleKey, title) ? titleKey : title,
    description: isMissingKey(descriptionKey, description) ? undefined : description,
    heroTitle: isMissingKey(heroTitleKey, heroTitle) ? (isMissingKey(titleKey, title) ? titleKey : title) : heroTitle,
    heroSubtitle: isMissingKey(heroSubtitleKey, heroSubtitle) ? undefined : heroSubtitle,
    heroImageAlt: isMissingKey(heroImageAltKey, heroImageAlt) ? undefined : heroImageAlt,
    bodyHtml,
    cta: resolveCta(area, "cta_", copyMap),
    secondaryCta: resolveCta(area, "secondary_cta_", copyMap),
  };

  if (slug === "home") {
    view.heroPitches = collectNumberedStrings(area, "hero_pitch_", copyMap);
    view.dashboardItems = collectDashboardItems(area, copyMap);
    view.reviewQuotes = collectReviewQuotes(area, copyMap);
    view.galleryImages = galleryImages;
  }

  if (slug === "cennik") {
    view.priceRows = collectPriceRows(area, copyMap);
  }

  if (slug === "galeria") {
    view.galleryImages = galleryImages;
  }

  return view;
}
