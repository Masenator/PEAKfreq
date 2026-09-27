/**
 * Writes the catalog as a Shopify product CSV to exports/.
 *   npm run export:shopify
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { shopifyCsv } from "../src/lib/shopify.ts";

mkdirSync("exports", { recursive: true });
const path = "exports/shopify-products.csv";
writeFileSync(path, shopifyCsv());
console.log(`Wrote ${path}`);
