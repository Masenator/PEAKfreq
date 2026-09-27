import { brand } from "../data/brand.ts";
import { products } from "../data/products.ts";
import type { Product } from "../data/types.ts";

/**
 * Unit economics for the ops console. VAT is stripped from the GBP shelf
 * price (supplements and apparel are standard-rated at 20% in the UK) before
 * margin is calculated.
 */
export const UK_VAT = 0.2;

export function economics(p: Product) {
  const gross = p.price.GBP;
  const net = Math.round(gross / (1 + UK_VAT));
  const cost = p.whiteLabel.unitCostGBP;
  const margin = net > 0 ? (net - cost) / net : 0;
  const subNet = Math.round(net * (1 - brand.subscriptionDiscount));
  const subMargin = subNet > 0 ? (subNet - cost) / subNet : 0;
  return {
    gross,
    net,
    cost,
    margin,
    subMargin,
    moqOutlay: cost * p.whiteLabel.moq,
    skus: p.variants.length,
  };
}

export function catalogSummary() {
  const live = products.filter((p) => p.status === "live");
  const rows = live.map((p) => economics(p));
  return {
    products: live.length,
    skus: live.reduce((s, p) => s + p.variants.length, 0),
    avgMargin: rows.reduce((s, r) => s + r.margin, 0) / Math.max(1, rows.length),
    moqOutlay: rows.reduce((s, r) => s + r.moqOutlay, 0),
    contracted: live.filter((p) => p.whiteLabel.supplier !== "TBC").length,
  };
}
