export interface CtaView {
  label: string;
  href: string;
}

export interface GalleryImageView {
  src: string;
  alt: string;
}

export interface DashboardItemView {
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
}

export interface PriceRowView {
  label: string;
  price?: string;
  note?: string;
}

export interface ReviewQuoteView {
  author: string;
  quote: string;
}

export interface ContentPageView {
  title: string;
  description?: string;
  heroTitle: string;
  heroSubtitle?: string;
  heroImageAlt?: string;
  heroPitches?: string[];
  cta?: CtaView;
  secondaryCta?: CtaView;
  bodyHtml: string;
  dashboardItems?: DashboardItemView[];
  priceRows?: PriceRowView[];
  reviewQuotes?: ReviewQuoteView[];
  galleryImages?: GalleryImageView[];
}

export interface StubPageView {
  title: string;
  bodyHtml: string;
}

export interface FormPageView {
  title: string;
  heroSubtitle?: string;
}
