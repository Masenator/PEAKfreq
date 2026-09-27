import { brand } from "../data/brand.ts";

/**
 * Canonical site origin, e.g. "https://www.peakfreq.co.uk" (no trailing slash).
 *
 * Order: NEXT_PUBLIC_SITE_URL if set, then the brand domain in production,
 * then the Vercel preview URL, then localhost. Tolerates common env-var
 * mistakes ("peakfreq.co.uk", trailing slashes, whitespace) instead of
 * crashing the build.
 */
function normalise(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

export function siteUrl(): string {
  const fromEnv = normalise(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromEnv) return fromEnv;
  const isProduction = process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.NODE_ENV === "production";
  if (isProduction) return brand.url;
  return normalise(process.env.VERCEL_URL) ?? "http://localhost:3000";
}
