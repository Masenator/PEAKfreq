import { brand } from "../data/brand.ts";
import { categories } from "../data/taxonomy.ts";
import { products } from "../data/products.ts";

/**
 * Shopify product CSV export. Lets you move the whole white-label catalog
 * into Shopify (or any platform that imports Shopify CSV) in one upload.
 * Prices are exported in GBP; set up other markets in Shopify Markets.
 */

const HEADERS = [
  "Handle",
  "Title",
  "Body (HTML)",
  "Vendor",
  "Type",
  "Tags",
  "Published",
  "Option1 Name",
  "Option1 Value",
  "Variant SKU",
  "Variant Inventory Tracker",
  "Variant Inventory Policy",
  "Variant Fulfillment Service",
  "Variant Price",
  "Variant Requires Shipping",
  "Variant Taxable",
  "Cost per item",
  "SEO Title",
  "SEO Description",
  "Status",
];

function cell(v: string | number | boolean): string {
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function shopifyCsv(): string {
  const rows: string[][] = [];
  for (const p of products) {
    const body = [
      `<p>${esc(p.description)}</p>`,
      `<ul>${p.benefits.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`,
      p.ingredients
        ? `<h4>Per serving</h4><ul>${p.ingredients.map((i) => `<li>${esc(i.name)}: ${esc(i.amount)}</li>`).join("")}</ul>`
        : "",
      `<h4>How to use</h4><p>${esc(p.howToUse)}</p>`,
      p.warnings.length ? `<p><small>${esc(p.warnings.join(" "))}</small></p>` : "",
    ].join("");
    const tags = [p.line, p.category, ...p.goals, p.evidence ? `evidence-${p.evidence}` : "", p.subscribable ? "subscribable" : ""]
      .filter(Boolean)
      .join(", ");

    p.variants.forEach((v, i) => {
      const price = ((p.price.GBP + (v.priceDelta?.GBP ?? 0)) / 100).toFixed(2);
      const first = i === 0;
      rows.push(
        [
          p.slug,
          first ? `${p.name} ${p.descriptor}` : "",
          first ? body : "",
          first ? brand.name : "",
          first ? categories[p.category].label : "",
          first ? tags : "",
          first ? String(p.status === "live") : "",
          first ? p.variantLabel ?? "Title" : "",
          p.variants.length > 1 ? v.label : "Default Title",
          v.sku,
          "shopify",
          "deny",
          "manual",
          price,
          "true",
          "true",
          (p.whiteLabel.unitCostGBP / 100).toFixed(2),
          first ? `${p.name} ${p.descriptor} | ${brand.name}` : "",
          first ? p.headline : "",
          first ? (p.status === "live" ? "active" : "draft") : "",
        ].map(cell),
      );
    });
  }
  return [HEADERS.map(cell).join(","), ...rows.map((r) => r.join(","))].join("\n") + "\n";
}
