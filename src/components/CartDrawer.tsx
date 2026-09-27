"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney, lineKey } from "@/lib/pricing";
import { ArrowRight, Check, Close } from "./icons";
import { ProductArt, artBackground } from "./ProductArt";
import { useStore } from "./StoreProvider";

export function useCheckout() {
  const { lines, currency } = useStore();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines, currency }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
      setBusy(false);
    }
  }
  return { checkout, busy, error };
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const { cart, currency, setQty, remove, setVariant } = useStore();
  return (
    <div>
      {cart.lines.map((l) => {
        const key = lineKey(l);
        return (
          <div className="line" key={key}>
            <Link href={`/products/${l.product.slug}`} className="line__media" style={{ background: artBackground(l.product) }}>
              <ProductArt product={l.product} title={false} />
            </Link>
            <div className="line__info">
              <Link href={`/products/${l.product.slug}`}>
                <strong>{l.product.name}</strong> <span className="muted">{l.product.descriptor}</span>
              </Link>
              {l.product.variants.length > 1 ? (
                <label className="row" style={{ "--gap": "6px", fontSize: 13 } as React.CSSProperties}>
                  <span className="muted">{l.product.variantLabel ?? "Option"}</span>
                  <select
                    className="currency"
                    style={{ height: 28, padding: "0 8px", fontFamily: "var(--font-body)", letterSpacing: 0 }}
                    value={l.variant.id}
                    onChange={(e) => setVariant(key, e.target.value)}
                  >
                    {l.product.variants.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <small>{l.product.size}</small>
              )}
              {l.subscribe && <small>Delivered monthly</small>}
              {l.discountLabel && <small style={{ color: "var(--ink)" }}>{l.discountLabel}</small>}
              <div className="line__controls">
                <div className="qty" aria-label="Quantity">
                  <button aria-label="Decrease quantity" onClick={() => setQty(key, l.qty - 1)}>
                    −
                  </button>
                  <span>{l.qty}</span>
                  <button aria-label="Increase quantity" onClick={() => setQty(key, l.qty + 1)}>
                    +
                  </button>
                </div>
                {!compact && (
                  <button className="line__remove" onClick={() => remove(key)}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            <div className="line__price">
              {l.unitAfterDiscount < l.unit && <s>{formatMoney(l.unit * l.qty, currency)}</s>}
              <span>{formatMoney(l.total, currency)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Totals() {
  const { cart, currency } = useStore();
  return (
    <div className="totals">
      <div>
        <span>Subtotal</span>
        <span>{formatMoney(cart.subtotal, currency)}</span>
      </div>
      {cart.savings > 0 && (
        <div>
          <span>You save</span>
          <span className="signal" style={{ color: "var(--ink)", fontWeight: 600 }}>
            −{formatMoney(cart.savings, currency)}
          </span>
        </div>
      )}
      <div>
        <span>Shipping</span>
        <span>{cart.shipping === 0 ? "Free" : formatMoney(cart.shipping, currency)}</span>
      </div>
      <div className="totals__grand">
        <span>Total</span>
        <span>{formatMoney(cart.total, currency)}</span>
      </div>
    </div>
  );
}

export function ShippingMeter() {
  const { cart, currency } = useStore();
  const pct = cart.subtotal === 0 ? 0 : Math.min(100, (cart.subtotal / (cart.subtotal + cart.toFreeShipping)) * 100);
  return (
    <div className="drawer__ship">
      <span className="row" style={{ "--gap": "8px" } as React.CSSProperties}>
        {cart.toFreeShipping > 0 ? (
          <>
            You&apos;re <strong>{formatMoney(cart.toFreeShipping, currency)}</strong> from free shipping
          </>
        ) : (
          <>
            <Check /> Free shipping unlocked
          </>
        )}
      </span>
      <div className="meter">
        <span style={{ width: `${cart.toFreeShipping > 0 ? pct : 100}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { cart, drawerOpen, setDrawerOpen, toast } = useStore();
  const { checkout, busy, error } = useCheckout();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setDrawerOpen]);

  return (
    <>
      <div className="drawer-scrim" data-open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <aside className="drawer" data-open={drawerOpen} aria-hidden={!drawerOpen} aria-label="Shopping bag">
        <div className="drawer__head">
          <span className="h3">Your bag {cart.count > 0 && <span className="muted">({cart.count})</span>}</span>
          <button className="icon-btn" aria-label="Close bag" onClick={() => setDrawerOpen(false)}>
            <Close />
          </button>
        </div>
        <ShippingMeter />
        <div className="drawer__lines">
          {cart.lines.length === 0 ? (
            <div className="empty">
              <p className="display display--sm">Your bag is empty</p>
              <p className="muted">Start with the evidence-A essentials.</p>
              <Link className="btn" href="/shop" onClick={() => setDrawerOpen(false)}>
                Shop the range <ArrowRight />
              </Link>
            </div>
          ) : (
            <CartLines />
          )}
        </div>
        {cart.lines.length > 0 && (
          <div className="drawer__foot">
            <Totals />
            <button className="btn btn--signal btn--block" onClick={checkout} disabled={busy}>
              {busy ? "Opening secure checkout…" : "Checkout"} {!busy && <ArrowRight />}
            </button>
            {error && (
              <p role="alert" style={{ margin: 0, fontSize: 13, color: "#B3261E" }}>
                {error}
              </p>
            )}
            <Link href="/cart" className="center muted" style={{ fontSize: 13 }} onClick={() => setDrawerOpen(false)}>
              View full bag
            </Link>
          </div>
        )}
      </aside>
      {toast && (
        <div className="toast" role="status">
          <Check /> {toast}
        </div>
      )}
    </>
  );
}
