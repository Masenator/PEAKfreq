import { brand } from "../data/brand.ts";
import { getProduct } from "../data/products.ts";
import { stacks } from "../data/stacks.ts";
import type { Currency, Product, Variant } from "../data/types.ts";

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
  subscribe: boolean;
  /** Set when the line was added as part of a protocol bundle. */
  stackId?: string;
}

export interface PricedLine extends CartLine {
  product: Product;
  variant: Variant;
  unit: number;
  unitAfterDiscount: number;
  total: number;
  discountLabel?: string;
}

export function formatMoney(minor: number, currency: Currency): string {
  return new Intl.NumberFormat(brand.locales[currency], {
    style: "currency",
    currency,
    minimumFractionDigits: minor % 100 === 0 ? 0 : 2,
  }).format(minor / 100);
}

export function unitPrice(product: Product, variant: Variant, currency: Currency): number {
  return product.price[currency] + (variant.priceDelta?.[currency] ?? 0);
}

/**
 * Price a single cart line from catalog data. The best available discount
 * applies; subscription and bundle discounts do not stack.
 */
export function priceLine(line: CartLine, currency: Currency): PricedLine | null {
  const product = getProduct(line.productId);
  if (!product || product.status !== "live") return null;
  const variant = product.variants.find((v) => v.id === line.variantId) ?? product.variants[0];
  if (!variant) return null;
  const qty = Math.max(1, Math.min(99, Math.floor(line.qty)));
  const unit = unitPrice(product, variant, currency);

  let discount = 0;
  let discountLabel: string | undefined;
  if (line.subscribe && product.subscribable) {
    discount = brand.subscriptionDiscount;
    discountLabel = `Subscribe −${Math.round(discount * 100)}%`;
  }
  const stack = line.stackId ? stacks.find((s) => s.id === line.stackId) : undefined;
  if (stack && stack.items.some((i) => i.productId === product.id) && stack.discount > discount) {
    discount = stack.discount;
    discountLabel = `${stack.name} −${Math.round(discount * 100)}%`;
  }
  const unitAfterDiscount = Math.round(unit * (1 - discount));
  return {
    ...line,
    qty,
    subscribe: line.subscribe && product.subscribable,
    product,
    variant,
    unit,
    unitAfterDiscount,
    total: unitAfterDiscount * qty,
    discountLabel,
  };
}

export function priceCart(lines: CartLine[], currency: Currency) {
  const priced = lines.map((l) => priceLine(l, currency)).filter((l): l is PricedLine => l !== null);
  const subtotal = priced.reduce((s, l) => s + l.total, 0);
  const full = priced.reduce((s, l) => s + l.unit * l.qty, 0);
  const threshold = brand.freeShippingThreshold[currency];
  const shipping = subtotal === 0 || subtotal >= threshold ? 0 : brand.flatShipping[currency];
  return {
    lines: priced,
    subtotal,
    savings: full - subtotal,
    shipping,
    total: subtotal + shipping,
    toFreeShipping: Math.max(0, threshold - subtotal),
    count: priced.reduce((s, l) => s + l.qty, 0),
  };
}

export function lineKey(l: Pick<CartLine, "productId" | "variantId" | "subscribe" | "stackId">): string {
  return [l.productId, l.variantId, l.subscribe ? "sub" : "once", l.stackId ?? ""].join(":");
}

export function stackPrice(stackId: string, currency: Currency) {
  const stack = stacks.find((s) => s.id === stackId);
  if (!stack) return { full: 0, bundle: 0 };
  let full = 0;
  let bundle = 0;
  for (const item of stack.items) {
    const p = getProduct(item.productId);
    if (!p) continue;
    full += p.price[currency];
    bundle += Math.round(p.price[currency] * (1 - stack.discount));
  }
  return { full, bundle };
}

export function isCurrency(v: unknown): v is Currency {
  return typeof v === "string" && (brand.currencies as readonly string[]).includes(v);
}
