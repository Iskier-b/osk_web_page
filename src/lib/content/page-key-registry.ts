import type { PageKind } from "@/types";

export type PublicPageSlug =
  | "home"
  | "nasza-auto-szkola"
  | "kursy"
  | "cennik"
  | "porady-dla-kursanta"
  | "galeria"
  | "artykuly"
  | "prawo-jazdy-automat"
  | "kontakt"
  | "jazdy-doszkalajace"
  | "prawo-jazdy-na-motocykl"
  | "wspolpraca"
  | "auto-szkola-zgierz"
  | "auto-szkola-retkinia"
  | "wymogi-formalne"
  | "pytania-egzaminacyjne"
  | "trasy-egzaminacyjne"
  | "trudne-skrzyzowania"
  | "filmy-instruktazowe"
  | "nasi-instruktorzy"
  | "ranking-auto-szkol-lodz"
  | "regulamin"
  | "polityka-prywatnosci"
  | "zapisy-na-kurs"
  | "referencje";

export const STATIC_NEWS_SLUGS = ["home", "artykuly"] as const;

export const PAGE_REGISTRY_KIND: Record<PublicPageSlug, PageKind> = {
  home: "content",
  "nasza-auto-szkola": "content",
  kursy: "content",
  cennik: "content",
  "porady-dla-kursanta": "content",
  galeria: "content",
  artykuly: "content",
  "prawo-jazdy-automat": "content",
  kontakt: "content",
  "jazdy-doszkalajace": "stub",
  "prawo-jazdy-na-motocykl": "stub",
  wspolpraca: "stub",
  "auto-szkola-zgierz": "stub",
  "auto-szkola-retkinia": "stub",
  "wymogi-formalne": "stub",
  "pytania-egzaminacyjne": "stub",
  "trasy-egzaminacyjne": "stub",
  "trudne-skrzyzowania": "stub",
  "filmy-instruktazowe": "stub",
  "nasi-instruktorzy": "stub",
  "ranking-auto-szkol-lodz": "stub",
  regulamin: "stub",
  "polityka-prywatnosci": "stub",
  "zapisy-na-kurs": "form",
  referencje: "form",
};

/** Copy keys per page slug — mirrors supabase/key-catalog.json page areas. */
export const PAGE_COPY_KEYS: Record<PublicPageSlug, readonly string[]> = {
  home: [
    "osk.home.title",
    "osk.home.description",
    "osk.home.hero_title",
    "osk.home.hero_subtitle",
    "osk.home.hero_image_alt",
    "osk.home.hero_pitch_1",
    "osk.home.hero_pitch_2",
    "osk.home.hero_pitch_3",
    "osk.home.hero_pitch_4",
    "osk.home.hero_pitch_5",
    "osk.home.cta_label",
    "osk.home.cta_href",
    "osk.home.secondary_cta_label",
    "osk.home.secondary_cta_href",
    "osk.home.dashboard_1_title",
    "osk.home.dashboard_1_body",
    "osk.home.dashboard_2_title",
    "osk.home.dashboard_2_body",
    "osk.home.dashboard_2_href",
    "osk.home.dashboard_2_link_label",
    "osk.home.dashboard_3_title",
    "osk.home.dashboard_3_body",
    "osk.home.review_1_author",
    "osk.home.review_1_quote",
    "osk.home.review_2_author",
    "osk.home.review_2_quote",
    "osk.home.review_3_author",
    "osk.home.review_3_quote",
    "osk.home.gallery_1_alt",
    "osk.home.gallery_2_alt",
    "osk.home.gallery_3_alt",
    "osk.home.body",
  ],
  "nasza-auto-szkola": [
    "osk.nasza_auto_szkola.title",
    "osk.nasza_auto_szkola.description",
    "osk.nasza_auto_szkola.hero_title",
    "osk.nasza_auto_szkola.hero_subtitle",
    "osk.nasza_auto_szkola.hero_image_alt",
    "osk.nasza_auto_szkola.cta_label",
    "osk.nasza_auto_szkola.cta_href",
    "osk.nasza_auto_szkola.body",
  ],
  kursy: [
    "osk.kursy.title",
    "osk.kursy.description",
    "osk.kursy.hero_title",
    "osk.kursy.hero_subtitle",
    "osk.kursy.cta_label",
    "osk.kursy.cta_href",
    "osk.kursy.body",
  ],
  cennik: [
    "osk.cennik.title",
    "osk.cennik.description",
    "osk.cennik.hero_title",
    "osk.cennik.hero_subtitle",
    "osk.cennik.cta_label",
    "osk.cennik.cta_href",
    "osk.cennik.price_1_label",
    "osk.cennik.price_1_price",
    "osk.cennik.price_1_note",
    "osk.cennik.price_2_label",
    "osk.cennik.price_2_price",
    "osk.cennik.price_3_label",
    "osk.cennik.price_3_price",
    "osk.cennik.price_3_note",
    "osk.cennik.price_4_label",
    "osk.cennik.price_4_price",
    "osk.cennik.price_5_label",
    "osk.cennik.price_5_price",
    "osk.cennik.price_6_label",
    "osk.cennik.price_6_price",
    "osk.cennik.price_7_label",
    "osk.cennik.price_7_price",
    "osk.cennik.price_8_label",
    "osk.cennik.price_8_price",
    "osk.cennik.body",
  ],
  "porady-dla-kursanta": [
    "osk.porady_dla_kursanta.title",
    "osk.porady_dla_kursanta.description",
    "osk.porady_dla_kursanta.hero_title",
    "osk.porady_dla_kursanta.hero_subtitle",
    "osk.porady_dla_kursanta.cta_label",
    "osk.porady_dla_kursanta.cta_href",
    "osk.porady_dla_kursanta.body",
  ],
  galeria: [
    "osk.galeria.title",
    "osk.galeria.description",
    "osk.galeria.hero_title",
    "osk.galeria.hero_subtitle",
    "osk.galeria.gallery_1_alt",
    "osk.galeria.gallery_2_alt",
    "osk.galeria.gallery_3_alt",
    "osk.galeria.body",
  ],
  artykuly: [
    "osk.artykuly.title",
    "osk.artykuly.description",
    "osk.artykuly.hero_title",
    "osk.artykuly.hero_subtitle",
    "osk.artykuly.body",
  ],
  "prawo-jazdy-automat": [
    "osk.prawo_jazdy_automat.title",
    "osk.prawo_jazdy_automat.description",
    "osk.prawo_jazdy_automat.hero_title",
    "osk.prawo_jazdy_automat.hero_subtitle",
    "osk.prawo_jazdy_automat.cta_label",
    "osk.prawo_jazdy_automat.cta_href",
    "osk.prawo_jazdy_automat.body",
  ],
  kontakt: [
    "osk.kontakt.title",
    "osk.kontakt.description",
    "osk.kontakt.hero_title",
    "osk.kontakt.hero_subtitle",
    "osk.kontakt.body",
  ],
  "jazdy-doszkalajace": ["osk.jazdy_doszkalajace.title", "osk.jazdy_doszkalajace.body"],
  "prawo-jazdy-na-motocykl": ["osk.prawo_jazdy_na_motocykl.title", "osk.prawo_jazdy_na_motocykl.body"],
  wspolpraca: ["osk.wspolpraca.title", "osk.wspolpraca.body"],
  "auto-szkola-zgierz": ["osk.auto_szkola_zgierz.title", "osk.auto_szkola_zgierz.body"],
  "auto-szkola-retkinia": ["osk.auto_szkola_retkinia.title", "osk.auto_szkola_retkinia.body"],
  "wymogi-formalne": ["osk.wymogi_formalne.title", "osk.wymogi_formalne.body"],
  "pytania-egzaminacyjne": ["osk.pytania_egzaminacyjne.title", "osk.pytania_egzaminacyjne.body"],
  "trasy-egzaminacyjne": ["osk.trasy_egzaminacyjne.title", "osk.trasy_egzaminacyjne.body"],
  "trudne-skrzyzowania": ["osk.trudne_skrzyzowania.title", "osk.trudne_skrzyzowania.body"],
  "filmy-instruktazowe": ["osk.filmy_instruktazowe.title", "osk.filmy_instruktazowe.body"],
  "nasi-instruktorzy": ["osk.nasi_instruktorzy.title", "osk.nasi_instruktorzy.body"],
  "ranking-auto-szkol-lodz": ["osk.ranking_auto_szkol_lodz.title", "osk.ranking_auto_szkol_lodz.body"],
  regulamin: ["osk.regulamin.title", "osk.regulamin.body"],
  "polityka-prywatnosci": ["osk.polityka_prywatnosci.title", "osk.polityka_prywatnosci.body"],
  "zapisy-na-kurs": ["osk.zapisy_na_kurs.title"],
  referencje: ["osk.referencje.title", "osk.referencje.hero_subtitle"],
};

export function isPublicPageSlug(slug: string): slug is PublicPageSlug {
  return slug in PAGE_COPY_KEYS;
}

export const GALLERY_PAGE_SLUGS = new Set<PublicPageSlug>(["home", "galeria"]);
