import { products } from "@/data/products";
import { stacks } from "@/data/stacks";

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(JSON.stringify({ products, stacks }, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "content-disposition": 'attachment; filename="peakfreq-catalog.json"',
      "cache-control": "no-store",
    },
  });
}
