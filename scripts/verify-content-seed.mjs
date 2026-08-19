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

const KEY_REGEX =
  /^osk\.[a-z0-9]+(_[a-z0-9]+)*(\.[a-z0-9]+(_[a-z0-9]+)*)+$/;

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const seedSql = readFileSync(seedPath, "utf8");

const errors = [];

/** Parse site_copy INSERT tuples from seed.sql */
function parseSiteCopyInserts(sql) {
  const match = sql.match(
    /insert into public\.site_copy \(key, value\) values\s*([\s\S]*?)\s*on conflict \(key\)/i,
  );
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
function parseInsertFirstColumn(sql, table, column) {
  const re = new RegExp(
    `insert into public\\.${table} \\(${column}[^)]*\\) values\\s*([\\s\\S]*?)\\s*on conflict`,
    "i",
  );
  const match = sql.match(re);
  if (!match) {
    errors.push(`seed.sql: missing ${table} INSERT block`);
    return new Set();
  }
  const ids = new Set();
  const valueRe = /\(\s*'((?:''|[^'])*)'/g;
  let m;
  while ((m = valueRe.exec(match[1])) !== null) {
    ids.add(m[1].replace(/''/g, "'"));
  }
  return ids;
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

function assertRegistry(name, catalogRows, idField, seedIds) {
  for (const row of catalogRows) {
    const id = row[idField];
    if (!seedIds.has(id)) {
      errors.push(`missing ${name} in seed: ${id}`);
    }
  }
  for (const id of seedIds) {
    if (!catalogRows.some((row) => row[idField] === id)) {
      errors.push(`extra ${name} in seed: ${id}`);
    }
  }
}

assertRegistry("pages", catalog.pages, "slug", parseInsertFirstColumn(seedSql, "pages", "slug"));
assertRegistry(
  "nav_slots",
  catalog.nav_slots,
  "id",
  parseInsertFirstColumn(seedSql, "nav_slots", "id"),
);
assertRegistry(
  "articles",
  catalog.articles,
  "slug",
  parseInsertFirstColumn(seedSql, "articles", "slug"),
);
assertRegistry("media", catalog.media, "id", parseInsertFirstColumn(seedSql, "media", "id"));

/** Coverage group sanity checks */
const bodyKeys = catalog.copy.filter((r) => r.key.endsWith(".body"));
const stubBodies = catalog.copy.filter(
  (r) => r.key.endsWith(".body") && r.value === "Treść w przygotowaniu",
);
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
