import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { ArrowRight } from "@/components/icons";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ demo?: string }> }) {
  const { demo } = await searchParams;
  return (
    <section className="wrap section">
      <ClearCart />
      <span className="eyebrow">{demo ? "Demo checkout" : "Order confirmed"}</span>
      <h1 className="display display--xl" style={{ marginTop: 20 }}>
        You&apos;re on
        <br />
        <span className="signal">frequency.</span>
      </h1>
      <p className="lede muted" style={{ marginTop: 24 }}>
        {demo
          ? "Payments aren't connected yet, so no charge was made. Add a Stripe secret key to take real orders."
          : "Thanks for your order. A confirmation email is on its way with tracking once it ships."}
      </p>
      <div className="row" style={{ marginTop: 32 }}>
        <Link href="/protocols" className="btn">
          Explore protocols <ArrowRight />
        </Link>
        <Link href="/journal" className="btn btn--ghost">
          <span>Read the journal</span>
        </Link>
      </div>
    </section>
  );
}
