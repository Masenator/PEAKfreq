import type { MetadataRoute } from "next";
import { articles } from "@/data/journal";
import { liveProducts } from "@/data/products";
import { stacks } from "@/data/stacks";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paths = [
    "",
    "/shop",
    "/protocols",
    "/science",
    "/journal",
    "/about",
    "/legal",
    ...liveProducts.map((p) => `/products/${p.slug}`),
    ...stacks.map((s) => `/protocols/${s.slug}`),
    ...articles.map((a) => `/journal/${a.slug}`),
  ];
  return paths.map((p) => ({ url: `${base}${p}`, lastModified: new Date() }));
}
