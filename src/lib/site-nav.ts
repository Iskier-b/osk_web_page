export interface NavLink {
  label: string;
  href: string;
}

export interface PrimaryNavItem extends NavLink {
  children?: NavLink[];
}

export const brandName = "Auto Szkoła Juszczak";
export const homeHref = "/";

export const phoneHref = "tel:510285635";
export const phoneLabel = "510 285 635";

export const zapisyCta: NavLink = {
  label: "Zapisy na kurs",
  href: "/zapisy-na-kurs",
};

/** Oferta dropdown — seven offer / location siblings (mvp-scope). */
export const ofertaChildren: NavLink[] = [
  { label: "Jazdy doszkalające", href: "/jazdy-doszkalajace" },
  { label: "Prawo jazdy w automacie", href: "/prawo-jazdy-automat" },
  { label: "Prawo jazdy na motocykl A i A2", href: "/prawo-jazdy-na-motocykl" },
  { label: "Opinie", href: "/referencje" },
  { label: "Współpraca", href: "/wspolpraca" },
  { label: "Kursy Zgierz", href: "/auto-szkola-zgierz" },
  { label: "Retkinia", href: "/auto-szkola-retkinia" },
];

/** Strefa kursanta dropdown — seven hub children (mvp-scope). */
export const strefaChildren: NavLink[] = [
  { label: "Wymogi formalne", href: "/wymogi-formalne" },
  { label: "Pytania egzaminacyjne", href: "/pytania-egzaminacyjne" },
  { label: "Trasy egzaminacyjne", href: "/trasy-egzaminacyjne" },
  { label: "Trudne skrzyżowania", href: "/trudne-skrzyzowania" },
  { label: "Filmy instruktażowe", href: "/filmy-instruktazowe" },
  { label: "Nasi instruktorzy", href: "/nasi-instruktorzy" },
  { label: "Ranking auto szkół Łódź", href: "/ranking-auto-szkol-lodz" },
];

/** Primary nav L→R as on source navbar. */
export const primaryNav: PrimaryNavItem[] = [
  { label: "O nas", href: "/nasza-auto-szkola" },
  { label: "Aktualności", href: "/artykuly" },
  { label: "Oferta", href: "/kursy", children: ofertaChildren },
  { label: "Cennik", href: "/cennik" },
  { label: "Galeria", href: "/galeria" },
  { label: "Strefa kursanta", href: "/porady-dla-kursanta", children: strefaChildren },
  { label: "Kontakt", href: "/kontakt" },
];

/**
 * Footer mapa / legal HTML links (PDFs omitted until assets exist).
 * Order follows source Mapa strony.
 */
export const footerLinks: NavLink[] = [
  { label: "O nas", href: "/nasza-auto-szkola" },
  { label: "Oferta", href: "/kursy" },
  { label: "Cennik", href: "/cennik" },
  { label: "Galeria", href: "/galeria" },
  { label: "Strefa kursanta", href: "/porady-dla-kursanta" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
  { label: "Regulamin", href: "/regulamin" },
];

export const siteChrome = {
  brandName,
  homeHref,
  phoneHref,
  phoneLabel,
  zapisyCta,
  primaryNav,
  ofertaChildren,
  strefaChildren,
  footerLinks,
} as const;
