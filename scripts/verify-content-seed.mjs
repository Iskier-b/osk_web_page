#!/usr/bin/env node
/**
 * Compares supabase/key-catalog.json copy/registry rows to supabase/seed.sql inserts.
 * Exit 0 when in sync; non-zero on drift. Does not require Supabase/Docker.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, "supabase/key-catalog.json");
const seedPath = join(root, "supabase/seed.sql");

const KEY_REGEX = /^osk\.[a-z0-9]+(_[a-z0-9]+)*(\.[a-z0-9]+(_[a-z0-9]+)*)+$/;

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const seedSql = readFileSync(seedPath, "utf8");

const errors = [];

/** Parse site_copy INSERT tuples from seed.sql */
function parseSiteCopyInserts(sql) {
  const match = sql.match(/insert into public\.site_copy \(key, value\) values\s*([\s\S]*?)\s*on conflict \(key\)/i);
  if (!match) {
    errors.push("seed.sql: missing site_copy INSERT block");
    return new Map();
  }
  const rows = new Map();
  const tupleRe = /\(\s*'((?:''|[^'])*)'\s*,\s*'((?:''|[^'])*)'\s*\)/g;
  let m;
  while ((m = tupleRe.exec(match[1])) !== null) {
    const key = m[1].replace(/''/g, "'");
    const value = m[2].replace(/''/g, "'");
    rows.set(key, value);
  }
  return rows;
}

/** Extract quoted first-column values from a table INSERT block */
function parseInsertBlock(sql, table) {
  const re = new RegExp(`insert into public\\.${table} \\([^)]+\\) values\\s*([\\s\\S]*?)\\s*on conflict`, "i");
  const match = sql.match(re);
  if (!match) {
    errors.push(`seed.sql: missing ${table} INSERT block`);
    return "";
  }
  return match[1];
}

function parseInsertFirstColumn(sql, table, column) {
  const block = parseInsertBlock(sql, table);
  if (!block) return new Set();
  const ids = new Set();
  const valueRe = /\(\s*'((?:''|[^'])*)'/g;
  let m;
  while ((m = valueRe.exec(block)) !== null) {
    ids.add(m[1].replace(/''/g, "'"));
  }
  return ids;
}

/** Parse comma-separated SQL literals from inside a VALUES tuple */
function parseSqlTupleValues(inner) {
  const values = [];
  let i = 0;

  function skipWs() {
    while (i < inner.length && /\s/.test(inner[i])) i++;
  }

  while (i < inner.length) {
    skipWs();
    if (i >= inner.length) break;
    if (inner[i] === ",") {
      i++;
      continue;
    }

    if (inner.slice(i, i + 4) === "null") {
      values.push(null);
      i += 4;
      continue;
    }

    if (inner[i] === "'") {
      i++;
      let s = "";
      while (i < inner.length) {
        if (inner[i] === "'") {
          if (inner[i + 1] === "'") {
            s += "'";
            i += 2;
            continue;
          }
          i++;
          break;
        }
        s += inner[i++];
      }
      skipWs();
      const castSuffix = inner.slice(i).match(/^::\w+/);
      if (castSuffix) {
        i += castSuffix[0].length;
      }
      values.push(s);
      continue;
    }

    const numMatch = inner.slice(i).match(/^-?\d+/);
    if (numMatch) {
      values.push(Number(numMatch[0]));
      i += numMatch[0].length;
      continue;
    }

    throw new Error(`unparseable SQL value near: ${inner.slice(i, i + 40)}`);
  }

  return values;
}

function parseInsertTuples(sql, table) {
  const block = parseInsertBlock(sql, table);
  if (!block) return [];
  const tuples = [];
  const tupleRe = /\(([^()]*)\)/g;
  let m;
  while ((m = tupleRe.exec(block)) !== null) {
    try {
      tuples.push(parseSqlTupleValues(m[1]));
    } catch (err) {
      errors.push(`seed.sql: ${table} tuple parse error: ${err.message}`);
    }
  }
  return tuples;
}

function parsePagesSeed(sql) {
  return parseInsertTuples(sql, "pages").map(([slug, path, kind, visibility]) => ({
    slug,
    path,
    kind,
    visibility,
  }));
}

function parseNavSlotsSeed(sql) {
  return parseInsertTuples(sql, "nav_slots").map(([id, parent_id, placement, sort_order, label_key, href_key]) => ({
    id,
    parent_id,
    placement,
    sort_order,
    label_key,
    href_key,
  }));
}

function parseArticlesSeed(sql) {
  return parseInsertTuples(sql, "articles").map(
    ([slug, visibility, published_at, sort_order, title_key, summary_key, body_key]) => ({
      slug,
      visibility,
      published_at,
      sort_order,
      title_key,
      summary_key,
      body_key,
    }),
  );
}

function parseMediaSeed(sql) {
  return parseInsertTuples(sql, "media").map(([id, kind, page_slug, article_slug, sort_order, url, alt_key]) => ({
    id,
    kind,
    page_slug,
    article_slug,
    sort_order,
    url,
    alt_key,
  }));
}

function rowSignature(row) {
  return JSON.stringify(row);
}

function assertRegistryRows(name, catalogRows, seedRows, idField) {
  const catalogById = new Map(catalogRows.map((row) => [row[idField], row]));
  const seedById = new Map(seedRows.map((row) => [row[idField], row]));

  for (const row of catalogRows) {
    const id = row[idField];
    const seedRow = seedById.get(id);
    if (!seedRow) {
      errors.push(`missing ${name} in seed: ${id}`);
      continue;
    }
    if (rowSignature(row) !== rowSignature(seedRow)) {
      errors.push(`${name} row mismatch for ${id}`);
    }
  }

  for (const row of seedRows) {
    const id = row[idField];
    if (!catalogById.has(id)) {
      errors.push(`extra ${name} in seed: ${id}`);
    }
  }
}

function assertCopyKeyRefs(label, key) {
  if (typeof key !== "string" || !key) return;
  if (!catalogKeys.has(key)) {
    errors.push(`${label}: copy key not in catalog: ${key}`);
  }
}

function assertRegistryCopyKeyRefs() {
  for (const row of catalog.nav_slots) {
    assertCopyKeyRefs(`nav_slots ${row.id} label_key`, row.label_key);
    assertCopyKeyRefs(`nav_slots ${row.id} href_key`, row.href_key);
  }
  for (const row of catalog.articles) {
    assertCopyKeyRefs(`articles ${row.slug} title_key`, row.title_key);
    assertCopyKeyRefs(`articles ${row.slug} summary_key`, row.summary_key);
    assertCopyKeyRefs(`articles ${row.slug} body_key`, row.body_key);
  }
  for (const row of catalog.media) {
    assertCopyKeyRefs(`media ${row.id} alt_key`, row.alt_key);
  }
}

const CHROME_KEY_PAIRS = [
  ["osk.chrome.brand_name", "osk.nav.chrome_brand.label"],
  ["osk.chrome.home_href", "osk.nav.chrome_brand.href"],
  ["osk.chrome.phone_label", "osk.nav.chrome_phone.label"],
  ["osk.chrome.phone_href", "osk.nav.chrome_phone.href"],
  ["osk.chrome.zapisy_cta_label", "osk.nav.chrome_zapisy.label"],
  ["osk.chrome.zapisy_cta_href", "osk.nav.chrome_zapisy.href"],
];

function assertChromeKeyParity() {
  const copyByKey = new Map(catalog.copy.map((row) => [row.key, row.value]));
  for (const [chromeKey, navKey] of CHROME_KEY_PAIRS) {
    if (!copyByKey.has(chromeKey) || !copyByKey.has(navKey)) {
      errors.push(`chrome parity: missing key pair ${chromeKey} / ${navKey}`);
      continue;
    }
    if (copyByKey.get(chromeKey) !== copyByKey.get(navKey)) {
      errors.push(`chrome parity: value mismatch ${chromeKey} vs ${navKey}`);
    }
  }
}

const seedCopy = parseSiteCopyInserts(seedSql);

for (const row of catalog.copy) {
  if (!KEY_REGEX.test(row.key)) {
    errors.push(`catalog: key fails regex: ${row.key}`);
  }
  if (!seedCopy.has(row.key)) {
    errors.push(`missing in seed: ${row.key}`);
    continue;
  }
  if (seedCopy.get(row.key) !== row.value) {
    errors.push(`value mismatch for ${row.key}`);
  }
}

for (const [key] of seedCopy) {
  if (!catalog.copy.some((row) => row.key === key)) {
    errors.push(`extra seed key not in catalog: ${key}`);
  }
}

const catalogKeys = new Set(catalog.copy.map((r) => r.key));
if (catalogKeys.size !== catalog.copy.length) {
  errors.push("catalog: duplicate copy keys");
}

assertRegistryRows("pages", catalog.pages, parsePagesSeed(seedSql), "slug");
assertRegistryRows("nav_slots", catalog.nav_slots, parseNavSlotsSeed(seedSql), "id");
assertRegistryRows("articles", catalog.articles, parseArticlesSeed(seedSql), "slug");
assertRegistryRows("media", catalog.media, parseMediaSeed(seedSql), "id");
assertRegistryCopyKeyRefs();
assertChromeKeyParity();

/** Coverage group sanity checks */
const bodyKeys = catalog.copy.filter((r) => r.key.endsWith(".body"));
const stubBodies = catalog.copy.filter((r) => r.key.endsWith(".body") && r.value === "Treść w przygotowaniu");
const articleBodies = catalog.copy.filter((r) => r.key.startsWith("osk.article.") && r.key.endsWith(".body"));
const galleryAlts = catalog.copy.filter((r) => r.key.includes(".gallery_") && r.key.endsWith("_alt"));
const newsPageKeys = catalog.copy.filter((r) => /osk\.(home|artykuly)\.news_/.test(r.key));

if (bodyKeys.length < 9 + 14) {
  errors.push(`expected at least 23 body keys (9 content + 14 stubs), found ${bodyKeys.length}`);
}
if (stubBodies.length !== 14) {
  errors.push(`expected 14 stub bodies, found ${stubBodies.length}`);
}
if (catalog.articles.length !== 6) {
  errors.push(`expected 6 articles, found ${catalog.articles.length}`);
}
if (articleBodies.length !== 6) {
  errors.push(`expected 6 article body keys, found ${articleBodies.length}`);
}
if (galleryAlts.length !== 6) {
  errors.push(`expected 6 gallery alt keys, found ${galleryAlts.length}`);
}
if (newsPageKeys.length > 0) {
  errors.push(`found duplicate news_* page keys: ${newsPageKeys.map((r) => r.key).join(", ")}`);
}

const forbiddenSources = catalog.copy.filter(
  (r) =>
    r.source.includes("EnrollmentForm") ||
    r.source.includes("ContactForm") ||
    r.source.includes("OpinionForm") ||
    r.source.includes("EnrollmentStrip") ||
    r.source.includes("index.astro"),
);
if (forbiddenSources.length > 0) {
  errors.push(`forbidden source keys: ${forbiddenSources.map((r) => r.key).join(", ")}`);
}

if (errors.length > 0) {
  console.error("verify-content-seed: FAILED\n" + errors.map((e) => `  - ${e}`).join("\n"));
  process.exit(1);
}

console.log(
  `verify-content-seed: OK (${catalog.copy.length} copy keys, ${catalog.pages.length} pages, ${catalog.nav_slots.length} nav slots, ${catalog.articles.length} articles, ${catalog.media.length} media)`,
);
