"use client";

import Link from "next/link";
import { CartLines, ShippingMeter, Totals, useCheckout } from "@/components/CartDrawer";
import { ArrowRight } from "@/components/icons";
import { useStore } from "@/components/StoreProvider";

export default function CartPage() {
  const { cart } = useStore();
  const { checkout, busy, error } = useCheckout();

  return (
    <section className="wrap section--tight">
      <h1 className="display display--lg" style={{ marginBottom: 32 }}>
        Your bag
      </h1>
      {cart.lines.length === 0 ? (
        <div className="empty" style={{ justifyItems: "start", textAlign: "left", padding: 0 }}>
          <p className="lede muted">Nothing here yet.</p>
          <Link href="/shop" className="btn">
            Shop the range <ArrowRight />
          </Link>
        </div>
      ) : (
        <div className="pdp" style={{ gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)" }}>
          <div>
            <CartLines />
          </div>
          <aside className="stack-v paper" style={{ "--gap": "16px", padding: 24, borderRadius: "var(--radius)", border: "1px solid var(--line)", position: "sticky", top: 90 } as React.CSSProperties}>
            <div style={{ margin: "-14px -20px 0" }}>
              <ShippingMeter />
            </div>
            <Totals />
            <button className="btn btn--signal btn--block" onClick={checkout} disabled={busy}>
              {busy ? "Opening secure checkout…" : "Checkout"} {!busy && <ArrowRight />}
            </button>
            {error && (
              <p role="alert" style={{ margin: 0, fontSize: 13, color: "#B3261E" }}>
                {error}
              </p>
            )}
            <p className="muted" style={{ margin: 0, fontSize: 12.5 }}>
              Taxes calculated at checkout. Subscriptions renew monthly and can be skipped or cancelled any time.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
}
