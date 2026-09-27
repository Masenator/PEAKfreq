/**
 * PEAKfreq catalog types.
 *
 * Every product on the site is defined once in `products.ts`. Product pages,
 * stacks, journal mentions, cart, checkout and the ops console all read from
 * that single source, so adding or re-labelling a product is a data change.
 */

export type Currency = "GBP" | "USD" | "EUR";

/** Prices in minor units (pence / cents) for each supported currency. */
export type Money = Record<Currency, number>;

export type Kind = "supplement" | "apparel" | "gear";

export type Category = "fuel" | "recover" | "sleep" | "focus" | "daily" | "apparel" | "gear";

export type Goal = "endurance" | "strength" | "recovery" | "sleep" | "focus" | "heat" | "longevity";

/** A = strong (consistent RCTs + meta-analyses), B = good, C = emerging. */
export type EvidenceGrade = "A" | "B" | "C";

/** Packaging / silhouette used to render label art when no photo is supplied. */
export type ArtFormat =
  | "pouch"
  | "tub"
  | "bottle"
  | "sticks"
  | "liquid"
  | "tee"
  | "longsleeve"
  | "tights"
  | "socks"
  | "jacket"
  | "vest"
  | "glasses"
  | "bands";

export interface Reference {
  authors: string;
  title: string;
  journal: string;
  year: number;
}

export interface Ingredient {
  name: string;
  amount: string;
  form?: string;
}

export interface Variant {
  id: string;
  label: string;
  /** Your internal SKU for this variant. */
  sku: string;
  /** Optional price difference vs the base price, in minor units. */
  priceDelta?: Partial<Money>;
}

/**
 * White-label sourcing record. Shown only in the ops console, never on the
 * storefront. Fill in once you have a contract manufacturer quote.
 */
export interface WhiteLabel {
  /** Contract manufacturer or supplier. "TBC" until contracted. */
  supplier: string;
  /** What to ask suppliers for; ingredient brands worth evaluating. */
  sourcingSpec: string;
  /** Minimum order quantity (units). */
  moq: number;
  /** Landed unit cost in GBP pence (estimate until quoted). */
  unitCostGBP: number;
  leadTimeDays: number;
  /** Compliance or quality notes for this SKU. */
  compliance: string[];
}

export interface Product {
  id: string;
  slug: string;
  /** Sub-brand line shown above the name, e.g. "FUEL". */
  line: string;
  name: string;
  /** Short descriptor, e.g. "Creatine Monohydrate". */
  descriptor: string;
  kind: Kind;
  category: Category;
  goals: Goal[];
  /** One-line promise. */
  headline: string;
  description: string;
  price: Money;
  subscribable: boolean;
  variantLabel?: string;
  variants: Variant[];
  /** e.g. "30 servings" or "Sizes XS–XXL". */
  size: string;
  evidence?: EvidenceGrade;
  benefits: string[];
  ingredients?: Ingredient[];
  specs?: { label: string; value: string }[];
  howToUse: string;
  science: { summary: string; references: Reference[] };
  /** Only authorised (UK/EU) health claims, verbatim. Empty if none apply. */
  claims: string[];
  warnings: string[];
  badges: string[];
  art: { format: ArtFormat; color: string; ink: string; accent: string };
  /** Optional real photo in /public. Overrides generated label art. */
  image?: string;
  status: "live" | "draft";
  whiteLabel: WhiteLabel;
}

export interface Stack {
  id: string;
  slug: string;
  name: string;
  goal: Goal;
  tagline: string;
  description: string;
  /** Product ids in the order the protocol is used. */
  items: { productId: string; when: string }[];
  /** Bundle discount applied at checkout, 0–1. */
  discount: number;
  color: string;
}
