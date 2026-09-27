import { shopifyCsv } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(shopifyCsv(), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="peakfreq-shopify-products.csv"',
      "cache-control": "no-store",
    },
  });
}
