/**
 * Canonical site origin, e.g. "https://peakfreq.com" (no trailing slash).
 *
 * Tolerates common env-var mistakes ("peakfreq.com", "https://peakfreq.com/",
 * stray whitespace) instead of crashing the build. Falls back to Vercel's
 * system URLs, then localhost.
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
  return (
    normalise(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalise(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    normalise(process.env.VERCEL_URL) ??
    "http://localhost:3000"
  );
}
