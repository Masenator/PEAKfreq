import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Shop",
  description: "Evidence-graded supplements, technical apparel and performance kit.",
};

export default function ShopPage() {
  return (
    <>
      <section className="wrap shop-hero">
        <span className="eyebrow">The range</span>
        <h1 className="display display--lg" style={{ marginTop: 18 }}>
          Shop by frequency.
        </h1>
        <p className="lede muted" style={{ marginTop: 18 }}>
          Supplements, apparel and kit. Every product is graded on the evidence and every dose is disclosed.
        </p>
      </section>
      <Suspense>
        <ShopGrid />
      </Suspense>
    </>
  );
}
