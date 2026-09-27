import type { Currency } from "./types.ts";

/**
 * Brand configuration. Change these values to re-skin the whole storefront.
 * Colours here are also exposed as CSS variables in the root layout.
 */
export const brand = {
  name: "PEAKfreq",
  wordmark: { strong: "PEAK", light: "freq" },
  tagline: "Find your frequency.",
  mission:
    "Your body runs on rhythm. We make evidence-graded supplements and technical apparel that help it hold the right one.",
  legalEntity: "PEAKfreq Ltd",
  email: "hello@peakfreq.com",
  supportEmail: "support@peakfreq.com",
  social: {
    instagram: "https://instagram.com/peakfreq",
    strava: "https://www.strava.com/clubs/peakfreq",
    youtube: "https://youtube.com/@peakfreq",
  },
  defaultCurrency: "GBP" as Currency,
  currencies: ["GBP", "USD", "EUR"] as Currency[],
  locales: { GBP: "en-GB", USD: "en-US", EUR: "en-IE" } as Record<Currency, string>,
  /** Minor units per currency. */
  freeShippingThreshold: { GBP: 5000, USD: 6000, EUR: 5500 },
  flatShipping: { GBP: 395, USD: 695, EUR: 495 },
  /** Subscribe & save discount, 0–1. */
  subscriptionDiscount: 0.15,
  shippingCountries: [
    "GB", "IE", "US", "CA", "AU", "NZ", "DE", "FR", "NL", "BE", "ES", "IT", "PT", "AT",
    "CH", "SE", "NO", "DK", "FI", "PL",
  ],
  colors: {
    ink: "#0E0F0F",
    bone: "#F3F1EC",
    stone: "#D8D3C8",
    signal: "#FF5B24",
    glacier: "#A9CBDD",
    moss: "#3E5641",
  },
} as const;

export type Brand = typeof brand;
