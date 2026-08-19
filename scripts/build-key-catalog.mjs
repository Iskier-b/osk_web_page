#!/usr/bin/env node
/**
 * One-shot builder: reads current Markdown / nav / stub sources and writes
 * supabase/key-catalog.json + supabase/seed.sql. Run after copy changes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const KEY_REGEX =
  /^osk\.[a-z0-9]+(_[a-z0-9]+)*(\.[a-z0-9]+(_[a-z0-9]+)*)+$/;

const STUB_PLACEHOLDER = "Treść w przygotowaniu";
const SEED_PUBLISHED_AT = "2026-08-19T00:00:00+00:00";

const transliterate = (text) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "l")
    .replace(/ą/g, "a")
    .replace(/Ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/Ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/Ę/g, "e")
    .replace(/ń/g, "n")
    .replace(/Ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/Ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/Ś/g, "s")
    .replace(/ź/g, "z")
    .replace(/Ź/g, "z")
    .replace(/ż/g, "z")
    .replace(/Ż/g, "z");

function slugify(title) {
  return transliterate(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_+/g, "_");
}

function read(path) {
  return readFileSync(join(root, path), "utf8");
}

function parseFrontmatter(filePath) {
  const raw = read(filePath);
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`No frontmatter in ${filePath}`);
  return { data: parseYamlSubset(match[1]), body: match[2].replace(/\r\n/g, "\n").replace(/\n$/, "") };
}

/** Minimal YAML parser for our content frontmatter shapes. */
function parseYamlSubset(yaml) {
  const lines = yaml.split("\n");
  const root = {};
  const stack = [{ indent: -1, obj: root }];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      i++;
      continue;
    }
    const indent = line.search(/\S/);
    const trimmed = line.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }
    const current = stack[stack.length - 1].obj;

    if (trimmed.startsWith("- ")) {
      const parent = stack[stack.length - 2]?.obj;
      const lastKey = stack[stack.length - 1].key;
      if (!parent || !lastKey) throw new Error(`Orphan list item: ${line}`);
      if (!Array.isArray(parent[lastKey])) parent[lastKey] = [];
      const rest = trimmed.slice(2);
      if (!rest.includes(": ")) {
        parent[lastKey].push(unquote(rest));
        i++;
        continue;
      }
      const item = {};
      const [k, ...vParts] = rest.split(": ");
      item[k] = unquote(vParts.join(": "));
      i++;
      while (i < lines.length) {
        const nl = lines[i];
        if (!nl.trim()) {
          i++;
          continue;
        }
        const ni = nl.search(/\S/);
        if (ni <= indent) break;
        const nt = nl.trim();
        if (nt.startsWith("- ")) break;
        const [k, ...vParts] = nt.split(": ");
        item[k] = unquote(vParts.join(": "));
        i++;
      }
      parent[lastKey].push(item);
      continue;
    }

    const colon = trimmed.indexOf(": ");
    if (colon === -1) {
      if (trimmed.endsWith(":")) {
        const key = trimmed.slice(0, -1);
        current[key] = {};
        stack.push({ indent, obj: current[key], key });
        i++;
        continue;
      }
      throw new Error(`Cannot parse line: ${line}`);
    }

    const key = trimmed.slice(0, colon);
    const value = trimmed.slice(colon + 2);
    if (value === "") {
      current[key] = {};
      stack.push({ indent, obj: current[key], key });
    } else if (value === "true") {
      current[key] = true;
    } else if (value === "false") {
      current[key] = false;
    } else {
      current[key] = unquote(value);
    }
    i++;
  }
  return root;
}

function unquote(v) {
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    return v.slice(1, -1);
  }
  return v;
}

function addCopy(copy, key, value, source) {
  if (copy.some((row) => row.key === key)) {
    throw new Error(`Duplicate key: ${key}`);
  }
  if (!KEY_REGEX.test(key)) {
    throw new Error(`Key fails regex: ${key}`);
  }
  copy.push({ key, value, source });
}

function addCta(copy, area, prefix, cta, sourceBase) {
  if (!cta) return;
  addCopy(copy, `osk.${area}.${prefix}label`, cta.label, `${sourceBase}.${prefix}label`);
  addCopy(copy, `osk.${area}.${prefix}href`, cta.href, `${sourceBase}.${prefix}href`);
}

const copy = [];

/** Content pages */
const contentPages = [
  { id: "home", path: "/" },
  { id: "nasza-auto-szkola", path: "/nasza-auto-szkola" },
  { id: "kursy", path: "/kursy" },
  { id: "cennik", path: "/cennik" },
  { id: "porady-dla-kursanta", path: "/porady-dla-kursanta" },
  { id: "galeria", path: "/galeria" },
  { id: "artykuly", path: "/artykuly" },
  { id: "prawo-jazdy-automat", path: "/prawo-jazdy-automat" },
  { id: "kontakt", path: "/kontakt" },
];

for (const page of contentPages) {
  const src = `src/content/pages/${page.id}.md`;
  const { data, body } = parseFrontmatter(src);
  const area = page.id.replace(/-/g, "_");
  const base = src;

  if (data.title) addCopy(copy, `osk.${area}.title`, data.title, `${base} frontmatter.title`);
  if (data.description)
    addCopy(copy, `osk.${area}.description`, data.description, `${base} frontmatter.description`);
  if (data.heroTitle)
    addCopy(copy, `osk.${area}.hero_title`, data.heroTitle, `${base} frontmatter.heroTitle`);
  if (data.heroSubtitle)
    addCopy(copy, `osk.${area}.hero_subtitle`, data.heroSubtitle, `${base} frontmatter.heroSubtitle`);
  if (data.heroImage?.alt)
    addCopy(copy, `osk.${area}.hero_image_alt`, data.heroImage.alt, `${base} frontmatter.heroImage.alt`);

  if (Array.isArray(data.heroPitches)) {
    data.heroPitches.forEach((pitch, idx) => {
      addCopy(copy, `osk.${area}.hero_pitch_${idx + 1}`, pitch, `${base} frontmatter.heroPitches[${idx}]`);
    });
  }

  addCta(copy, area, "cta_", data.cta, base);
  addCta(copy, area, "secondary_cta_", data.secondaryCta, base);

  if (Array.isArray(data.dashboardItems)) {
    data.dashboardItems.forEach((item, idx) => {
      const n = idx + 1;
      addCopy(copy, `osk.${area}.dashboard_${n}_title`, item.title, `${base} frontmatter.dashboardItems[${idx}].title`);
      addCopy(copy, `osk.${area}.dashboard_${n}_body`, item.body, `${base} frontmatter.dashboardItems[${idx}].body`);
      if (item.href)
        addCopy(copy, `osk.${area}.dashboard_${n}_href`, item.href, `${base} frontmatter.dashboardItems[${idx}].href`);
      if (item.linkLabel)
        addCopy(
          copy,
          `osk.${area}.dashboard_${n}_link_label`,
          item.linkLabel,
          `${base} frontmatter.dashboardItems[${idx}].linkLabel`,
        );
    });
  }

  if (Array.isArray(data.priceRows)) {
    data.priceRows.forEach((row, idx) => {
      const n = idx + 1;
      addCopy(copy, `osk.${area}.price_${n}_label`, row.label, `${base} frontmatter.priceRows[${idx}].label`);
      if (row.price)
        addCopy(copy, `osk.${area}.price_${n}_price`, row.price, `${base} frontmatter.priceRows[${idx}].price`);
      if (row.note)
        addCopy(copy, `osk.${area}.price_${n}_note`, row.note, `${base} frontmatter.priceRows[${idx}].note`);
    });
  }

  if (Array.isArray(data.reviewQuotes)) {
    data.reviewQuotes.forEach((row, idx) => {
      const n = idx + 1;
      addCopy(copy, `osk.${area}.review_${n}_author`, row.author, `${base} frontmatter.reviewQuotes[${idx}].author`);
      addCopy(copy, `osk.${area}.review_${n}_quote`, row.quote, `${base} frontmatter.reviewQuotes[${idx}].quote`);
    });
  }

  if (Array.isArray(data.teaserImages) && (page.id === "home" || page.id === "galeria")) {
    data.teaserImages.forEach((img, idx) => {
      if (img.src?.includes("fleet-")) {
        addCopy(
          copy,
          `osk.${area}.gallery_${idx + 1}_alt`,
          img.alt,
          `${base} frontmatter.teaserImages[${idx}].alt`,
        );
      }
    });
  }

  addCopy(copy, `osk.${area}.body`, body, `${base} body`);
}

/** Stubs */
const stubs = [
  { slug: "jazdy-doszkalajace", path: "/jazdy-doszkalajace", title: "Jazdy doszkalające" },
  { slug: "prawo-jazdy-na-motocykl", path: "/prawo-jazdy-na-motocykl", title: "Prawo jazdy na motocykl A i A2" },
  { slug: "wspolpraca", path: "/wspolpraca", title: "Współpraca" },
  { slug: "auto-szkola-zgierz", path: "/auto-szkola-zgierz", title: "Kursy Zgierz" },
  { slug: "auto-szkola-retkinia", path: "/auto-szkola-retkinia", title: "Retkinia" },
  { slug: "wymogi-formalne", path: "/wymogi-formalne", title: "Wymogi formalne" },
  { slug: "pytania-egzaminacyjne", path: "/pytania-egzaminacyjne", title: "Pytania egzaminacyjne" },
  { slug: "trasy-egzaminacyjne", path: "/trasy-egzaminacyjne", title: "Trasy egzaminacyjne" },
  { slug: "trudne-skrzyzowania", path: "/trudne-skrzyzowania", title: "Trudne skrzyżowania" },
  { slug: "filmy-instruktazowe", path: "/filmy-instruktazowe", title: "Filmy instruktażowe" },
  { slug: "nasi-instruktorzy", path: "/nasi-instruktorzy", title: "Nasi instruktorzy" },
  { slug: "ranking-auto-szkol-lodz", path: "/ranking-auto-szkol-lodz", title: "Ranking auto szkół Łódź" },
  { slug: "regulamin", path: "/regulamin", title: "Regulamin" },
  { slug: "polityka-prywatnosci", path: "/polityka-prywatnosci", title: "Polityka prywatności" },
];

for (const stub of stubs) {
  const area = stub.slug.replace(/-/g, "_");
  addCopy(copy, `osk.${area}.title`, stub.title, `src/pages/${stub.slug}.astro title`);
  addCopy(copy, `osk.${area}.body`, STUB_PLACEHOLDER, "src/components/site/StubPage.astro placeholder");
}

/** Form pages */
addCopy(copy, "osk.zapisy_na_kurs.title", "Zapisy na kurs", "src/pages/zapisy-na-kurs.astro title");
addCopy(copy, "osk.referencje.title", "Opinie", "src/pages/referencje.astro title");
addCopy(
  copy,
  "osk.referencje.hero_subtitle",
  "Zobacz co mówią o nas kursanci",
  "src/pages/referencje.astro lead",
);

/** Chrome */
addCopy(copy, "osk.chrome.brand_name", "Auto Szkoła Juszczak", "src/lib/site-nav.ts brandName");
addCopy(copy, "osk.chrome.home_href", "/", "src/lib/site-nav.ts homeHref");
addCopy(copy, "osk.chrome.phone_label", "510 285 635", "src/lib/site-nav.ts phoneLabel");
addCopy(copy, "osk.chrome.phone_href", "tel:510285635", "src/lib/site-nav.ts phoneHref");
addCopy(copy, "osk.chrome.zapisy_cta_label", "Zapisy na kurs", "src/lib/site-nav.ts zapisyCta.label");
addCopy(copy, "osk.chrome.zapisy_cta_href", "/zapisy-na-kurs", "src/lib/site-nav.ts zapisyCta.href");

/** Nav slots + label/href keys */
const navSlots = [];

function navSlot(id, parentId, placement, sortOrder, label, href, source) {
  const labelKey = `osk.nav.${id}.label`;
  const hrefKey = `osk.nav.${id}.href`;
  addCopy(copy, labelKey, label, `${source} label`);
  addCopy(copy, hrefKey, href, `${source} href`);
  navSlots.push({
    id,
    parent_id: parentId,
    placement,
    sort_order: sortOrder,
    label_key: labelKey,
    href_key: hrefKey,
  });
}

navSlot("primary_onas", null, "primary", 1, "O nas", "/nasza-auto-szkola", "src/lib/site-nav.ts primaryNav[0]");
navSlot("primary_aktualnosci", null, "primary", 2, "Aktualności", "/artykuly", "src/lib/site-nav.ts primaryNav[1]");
navSlot("primary_oferta", null, "primary", 3, "Oferta", "/kursy", "src/lib/site-nav.ts primaryNav[2]");
navSlot("oferta_jazdy_doszkalajace", "primary_oferta", "primary", 1, "Jazdy doszkalające", "/jazdy-doszkalajace", "src/lib/site-nav.ts ofertaChildren[0]");
navSlot("oferta_prawo_jazdy_automat", "primary_oferta", "primary", 2, "Prawo jazdy w automacie", "/prawo-jazdy-automat", "src/lib/site-nav.ts ofertaChildren[1]");
navSlot("oferta_prawo_jazdy_na_motocykl", "primary_oferta", "primary", 3, "Prawo jazdy na motocykl A i A2", "/prawo-jazdy-na-motocykl", "src/lib/site-nav.ts ofertaChildren[2]");
navSlot("oferta_opinie", "primary_oferta", "primary", 4, "Opinie", "/referencje", "src/lib/site-nav.ts ofertaChildren[3]");
navSlot("oferta_wspolpraca", "primary_oferta", "primary", 5, "Współpraca", "/wspolpraca", "src/lib/site-nav.ts ofertaChildren[4]");
navSlot("oferta_kursy_zgierz", "primary_oferta", "primary", 6, "Kursy Zgierz", "/auto-szkola-zgierz", "src/lib/site-nav.ts ofertaChildren[5]");
navSlot("oferta_retkinia", "primary_oferta", "primary", 7, "Retkinia", "/auto-szkola-retkinia", "src/lib/site-nav.ts ofertaChildren[6]");
navSlot("primary_cennik", null, "primary", 4, "Cennik", "/cennik", "src/lib/site-nav.ts primaryNav[3]");
navSlot("primary_galeria", null, "primary", 5, "Galeria", "/galeria", "src/lib/site-nav.ts primaryNav[4]");
navSlot("primary_strefa_kursanta", null, "primary", 6, "Strefa kursanta", "/porady-dla-kursanta", "src/lib/site-nav.ts primaryNav[5]");
navSlot("strefa_wymogi_formalne", "primary_strefa_kursanta", "primary", 1, "Wymogi formalne", "/wymogi-formalne", "src/lib/site-nav.ts strefaChildren[0]");
navSlot("strefa_pytania_egzaminacyjne", "primary_strefa_kursanta", "primary", 2, "Pytania egzaminacyjne", "/pytania-egzaminacyjne", "src/lib/site-nav.ts strefaChildren[1]");
navSlot("strefa_trasy_egzaminacyjne", "primary_strefa_kursanta", "primary", 3, "Trasy egzaminacyjne", "/trasy-egzaminacyjne", "src/lib/site-nav.ts strefaChildren[2]");
navSlot("strefa_trudne_skrzyzowania", "primary_strefa_kursanta", "primary", 4, "Trudne skrzyżowania", "/trudne-skrzyzowania", "src/lib/site-nav.ts strefaChildren[3]");
navSlot("strefa_filmy_instruktazowe", "primary_strefa_kursanta", "primary", 5, "Filmy instruktażowe", "/filmy-instruktazowe", "src/lib/site-nav.ts strefaChildren[4]");
navSlot("strefa_nasi_instruktorzy", "primary_strefa_kursanta", "primary", 6, "Nasi instruktorzy", "/nasi-instruktorzy", "src/lib/site-nav.ts strefaChildren[5]");
navSlot("strefa_ranking_auto_szkol_lodz", "primary_strefa_kursanta", "primary", 7, "Ranking auto szkół Łódź", "/ranking-auto-szkol-lodz", "src/lib/site-nav.ts strefaChildren[6]");
navSlot("primary_kontakt", null, "primary", 7, "Kontakt", "/kontakt", "src/lib/site-nav.ts primaryNav[6]");

const footerLinks = [
  ["footer_onas", "O nas", "/nasza-auto-szkola"],
  ["footer_oferta", "Oferta", "/kursy"],
  ["footer_cennik", "Cennik", "/cennik"],
  ["footer_galeria", "Galeria", "/galeria"],
  ["footer_strefa_kursanta", "Strefa kursanta", "/porady-dla-kursanta"],
  ["footer_polityka_prywatnosci", "Polityka prywatności", "/polityka-prywatnosci"],
  ["footer_regulamin", "Regulamin", "/regulamin"],
];
footerLinks.forEach(([id, label, href], idx) => {
  navSlot(id, null, "footer", idx + 1, label, href, `src/lib/site-nav.ts footerLinks[${idx}]`);
});

navSlot("chrome_brand", null, "chrome", 1, "Auto Szkoła Juszczak", "/", "src/lib/site-nav.ts brandName/homeHref");
navSlot("chrome_phone", null, "chrome", 2, "510 285 635", "tel:510285635", "src/lib/site-nav.ts phone");
navSlot("chrome_zapisy", null, "chrome", 3, "Zapisy na kurs", "/zapisy-na-kurs", "src/lib/site-nav.ts zapisyCta");

/** Articles from artykuly.md (6 teasers) */
const { data: artykulyData } = parseFrontmatter("src/content/pages/artykuly.md");
const articles = (artykulyData.newsTeasers ?? []).map((teaser, idx) => {
  const slug = slugify(teaser.title);
  const titleKey = `osk.article.${slug}.title`;
  const summaryKey = `osk.article.${slug}.summary`;
  const bodyKey = `osk.article.${slug}.body`;
  addCopy(copy, titleKey, teaser.title, `src/content/pages/artykuly.md frontmatter.newsTeasers[${idx}].title`);
  addCopy(copy, summaryKey, teaser.summary ?? "", `src/content/pages/artykuly.md frontmatter.newsTeasers[${idx}].summary`);
  addCopy(copy, bodyKey, "", `src/content/pages/artykuly.md article body (empty until S-03)`);
  return {
    slug,
    visibility: "displayed",
    published_at: SEED_PUBLISHED_AT,
    sort_order: idx + 1,
    title_key: titleKey,
    summary_key: summaryKey,
    body_key: bodyKey,
  };
});

/** Pages registry */
const pages = [
  ...contentPages.map((p) => ({ slug: p.id, path: p.path, kind: "content", visibility: "displayed" })),
  ...stubs.map((s) => ({ slug: s.slug, path: s.path, kind: "stub", visibility: "displayed" })),
  { slug: "zapisy-na-kurs", path: "/zapisy-na-kurs", kind: "form", visibility: "displayed" },
  { slug: "referencje", path: "/referencje", kind: "form", visibility: "displayed" },
];

/** Media gallery rows */
const galleryUrls = [
  "/images/osk/fleet-02.webp",
  "/images/osk/fleet-03.webp",
  "/images/osk/fleet-04.webp",
];
const media = [];
for (const pageSlug of ["home", "galeria"]) {
  galleryUrls.forEach((url, idx) => {
    const area = pageSlug.replace(/-/g, "_");
    const altKey = `osk.${area}.gallery_${idx + 1}_alt`;
    media.push({
      id: `${pageSlug}_gallery_${idx + 1}`,
      kind: "gallery",
      page_slug: pageSlug,
      article_slug: null,
      sort_order: idx + 1,
      url,
      alt_key: altKey,
    });
  });
}

const catalog = { copy, pages, nav_slots: navSlots, articles, media };

writeFileSync(join(root, "supabase/key-catalog.json"), `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

/** Generate seed.sql */
function sqlLiteral(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

const seedParts = [];

seedParts.push("-- Idempotent content-store seed (generated from key-catalog.json)\n");

const copyValues = copy
  .map((row) => `  (${sqlLiteral(row.key)}, ${sqlLiteral(row.value)})`)
  .join(",\n");
seedParts.push(`insert into public.site_copy (key, value) values\n${copyValues}\non conflict (key) do update\nset value = excluded.value, updated_at = now();\n`);

const pageValues = pages
  .map(
    (p) =>
      `  (${sqlLiteral(p.slug)}, ${sqlLiteral(p.path)}, ${sqlLiteral(p.kind)}, ${sqlLiteral(p.visibility)})`,
  )
  .join(",\n");
seedParts.push(`insert into public.pages (slug, path, kind, visibility) values\n${pageValues}\non conflict (slug) do update\nset path = excluded.path, kind = excluded.kind, visibility = excluded.visibility;\n`);

const navValues = navSlots
  .map(
    (s) =>
      `  (${sqlLiteral(s.id)}, ${s.parent_id ? sqlLiteral(s.parent_id) : "null"}, ${sqlLiteral(s.placement)}, ${s.sort_order}, ${sqlLiteral(s.label_key)}, ${sqlLiteral(s.href_key)})`,
  )
  .join(",\n");
seedParts.push(`insert into public.nav_slots (id, parent_id, placement, sort_order, label_key, href_key) values\n${navValues}\non conflict (id) do update\nset parent_id = excluded.parent_id, placement = excluded.placement, sort_order = excluded.sort_order, label_key = excluded.label_key, href_key = excluded.href_key;\n`);

const articleValues = articles
  .map(
    (a) =>
      `  (${sqlLiteral(a.slug)}, ${sqlLiteral(a.visibility)}, ${sqlLiteral(a.published_at)}::timestamptz, ${a.sort_order}, ${sqlLiteral(a.title_key)}, ${sqlLiteral(a.summary_key)}, ${sqlLiteral(a.body_key)})`,
  )
  .join(",\n");
seedParts.push(`insert into public.articles (slug, visibility, published_at, sort_order, title_key, summary_key, body_key) values\n${articleValues}\non conflict (slug) do update\nset visibility = excluded.visibility, published_at = excluded.published_at, sort_order = excluded.sort_order, title_key = excluded.title_key, summary_key = excluded.summary_key, body_key = excluded.body_key;\n`);

const mediaValues = media
  .map(
    (m) =>
      `  (${sqlLiteral(m.id)}, ${sqlLiteral(m.kind)}, ${m.page_slug ? sqlLiteral(m.page_slug) : "null"}, ${m.article_slug ? sqlLiteral(m.article_slug) : "null"}, ${m.sort_order}, ${sqlLiteral(m.url)}, ${sqlLiteral(m.alt_key)})`,
  )
  .join(",\n");
seedParts.push(`insert into public.media (id, kind, page_slug, article_slug, sort_order, url, alt_key) values\n${mediaValues}\non conflict (id) do update\nset kind = excluded.kind, page_slug = excluded.page_slug, article_slug = excluded.article_slug, sort_order = excluded.sort_order, url = excluded.url, alt_key = excluded.alt_key;\n`);

writeFileSync(join(root, "supabase/seed.sql"), seedParts.join("\n"), "utf8");

console.log(`Wrote ${copy.length} copy keys, ${pages.length} pages, ${navSlots.length} nav slots, ${articles.length} articles, ${media.length} media rows.`);
