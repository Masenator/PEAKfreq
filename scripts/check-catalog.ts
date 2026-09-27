/**
 * Validates the catalog before you ship a change.
 *   npm run check:catalog
 */
import { brand } from "../src/data/brand.ts";
import { articles } from "../src/data/journal.ts";
import { products } from "../src/data/products.ts";
import { stacks } from "../src/data/stacks.ts";
import { economics } from "../src/lib/ops.ts";

const errors: string[] = [];
const warnings: string[] = [];

const ids = new Set<string>();
const slugs = new Set<string>();
const skus = new Set<string>();

for (const p of products) {
  if (ids.has(p.id)) errors.push(`Duplicate product id: ${p.id}`);
  if (slugs.has(p.slug)) errors.push(`Duplicate slug: ${p.slug}`);
  ids.add(p.id);
  slugs.add(p.slug);
  if (!/^[a-z0-9-]+$/.test(p.id)) errors.push(`${p.id}: id must be lowercase letters, numbers and dashes`);
  if (!/^[a-z0-9-]+$/.test(p.slug)) errors.push(`${p.id}: slug must be lowercase letters, numbers and dashes`);
  for (const c of brand.currencies) {
    if (!Number.isInteger(p.price[c]) || p.price[c] <= 0) errors.push(`${p.id}: missing or invalid ${c} price`);
  }
  if (p.variants.length === 0) errors.push(`${p.id}: needs at least one variant`);
  for (const v of p.variants) {
    if (skus.has(v.sku)) errors.push(`Duplicate SKU: ${v.sku}`);
    skus.add(v.sku);
  }
  if (p.kind === "supplement" && !p.ingredients?.length) errors.push(`${p.id}: supplements must list ingredients`);
  if (p.kind === "supplement" && p.warnings.length === 0) warnings.push(`${p.id}: supplement has no warnings`);
  if (p.whiteLabel.supplier === "TBC") warnings.push(`${p.id}: supplier not contracted (TBC)`);
  const e = economics(p);
  if (e.margin < 0.5) warnings.push(`${p.id}: gross margin ${(e.margin * 100).toFixed(0)}% is below 50%`);
}

for (const s of stacks) {
  for (const i of s.items) if (!ids.has(i.productId)) errors.push(`Stack ${s.id} references unknown product ${i.productId}`);
}

for (const a of articles) {
  for (const b of a.body) {
    const texts = b.type === "p" ? [b.text] : b.type === "list" ? b.items : [];
    for (const t of texts) {
      for (const m of t.matchAll(/\[\[([a-z0-9-]+)/g)) {
        if (!ids.has(m[1])) errors.push(`Article ${a.slug} mentions unknown product [[${m[1]}]]`);
      }
    }
    if (b.type === "products") for (const id of b.ids) if (!ids.has(id)) errors.push(`Article ${a.slug} lists unknown product ${id}`);
  }
}

const suppliersPending = warnings.filter((w) => w.includes("TBC")).length;
for (const w of warnings.filter((w) => !w.includes("TBC"))) console.warn(`warn  ${w}`);
if (suppliersPending) console.warn(`warn  ${suppliersPending} products have no contracted supplier yet (TBC)`);
for (const e of errors) console.error(`error ${e}`);
console.log(`\n${products.length} products, ${skus.size} SKUs, ${stacks.length} protocols, ${articles.length} articles checked.`);
if (errors.length) {
  console.error(`${errors.length} error(s).`);
  process.exit(1);
}
console.log("Catalog OK.");
