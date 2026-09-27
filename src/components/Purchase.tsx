"use client";

import { useState } from "react";
import { brand } from "@/data/brand";
import { getProduct } from "@/data/products";
import { stacks } from "@/data/stacks";
import type { Product } from "@/data/types";
import { formatMoney, unitPrice } from "@/lib/pricing";
import { ArrowRight, Check, Flask, Loop, Truck } from "./icons";
import { useStore } from "./StoreProvider";

/** Product-page purchase panel: variant, subscribe & save, quantity. */
export function PurchasePanel({ product }: { product: Product }) {
  const { add, currency } = useStore();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [subscribe, setSubscribe] = useState(product.subscribable);
  const [qty, setQty] = useState(1);
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const unit = unitPrice(product, variant, currency);
  const subUnit = Math.round(unit * (1 - brand.subscriptionDiscount));
  const pct = Math.round(brand.subscriptionDiscount * 100);
  const isSize = (product.variantLabel ?? "").toLowerCase() === "size" && product.kind !== "supplement";

  return (
    <div className="stack-v" style={{ "--gap": "22px" } as React.CSSProperties}>
      {product.variants.length > 1 && (
        <div className="option-group">
          <div className="option-group__label">
            <span>
              {product.variantLabel ?? "Option"}: <strong>{variant.label}</strong>
            </span>
            {isSize && <span className="muted">True to size</span>}
          </div>
          <div className="options" role="group" aria-label={product.variantLabel ?? "Option"}>
            {product.variants.map((v) => (
              <button key={v.id} className="option" aria-pressed={v.id === variant.id} onClick={() => setVariantId(v.id)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.subscribable ? (
        <div className="purchase-type" role="radiogroup" aria-label="Purchase type">
          <label>
            <input type="radio" name="ptype" checked={subscribe} onChange={() => setSubscribe(true)} />
            <span className="purchase-type__main">
              <span>
                <strong>Subscribe &amp; save {pct}%</strong>
              </span>
              <small>Delivered monthly. Skip, swap or cancel any time.</small>
            </span>
            <span>
              <strong>{formatMoney(subUnit, currency)}</strong>
            </span>
          </label>
          <label>
            <input type="radio" name="ptype" checked={!subscribe} onChange={() => setSubscribe(false)} />
            <span className="purchase-type__main">
              <strong>One-time purchase</strong>
            </span>
            <span>{formatMoney(unit, currency)}</span>
          </label>
        </div>
      ) : (
        <p className="display display--sm" style={{ fontSize: "1.9rem" }}>
          {formatMoney(unit, currency)}
        </p>
      )}

      <div className="buy-row">
        <div className="qty" aria-label="Quantity">
          <button aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
            −
          </button>
          <span>{qty}</span>
          <button aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(99, q + 1))}>
            +
          </button>
        </div>
        <button
          className="btn btn--signal"
          onClick={() =>
            add({ productId: product.id, variantId: variant.id, qty, subscribe: subscribe && product.subscribable })
          }
        >
          Add to bag · {formatMoney((subscribe && product.subscribable ? subUnit : unit) * qty, currency)}
        </button>
      </div>

      <div className="assurances">
        <div>
          <Truck />
          Free shipping over {formatMoney(brand.freeShippingThreshold[currency], currency)}
        </div>
        <div>
          <Loop />
          {product.kind === "supplement" ? "Skip or cancel any time" : "60-day returns"}
        </div>
        <div>
          <Flask />
          {product.evidence ? `Evidence grade ${product.evidence}` : "Field-tested"}
        </div>
      </div>
    </div>
  );
}

/** Small "Add" button for product cards and mentions. Adds the default variant. */
export function QuickAdd({ productId, label = "Quick add", className = "btn btn--sm btn--block" }: { productId: string; label?: string; className?: string }) {
  const { add } = useStore();
  const p = getProduct(productId);
  if (!p) return null;
  const needsChoice = p.variants.length > 1 && p.kind !== "supplement";
  if (needsChoice) {
    return (
      <a className={className} href={`/products/${p.slug}`}>
        Choose size <ArrowRight />
      </a>
    );
  }
  return (
    <button
      className={className}
      onClick={(e) => {
        e.preventDefault();
        add({ productId: p.id, variantId: p.variants[0].id, qty: 1, subscribe: false });
      }}
    >
      {label} <span aria-hidden="true">+</span>
    </button>
  );
}

/** Adds every item in a protocol to the bag at the bundle discount. */
export function AddStackButton({ stackId, className = "btn" }: { stackId: string; className?: string }) {
  const { addMany } = useStore();
  const [done, setDone] = useState(false);
  const stack = stacks.find((s) => s.id === stackId);
  if (!stack) return null;
  return (
    <button
      className={className}
      onClick={() => {
        addMany(
          stack.items
            .map((i) => getProduct(i.productId))
            .filter((p): p is Product => !!p)
            .map((p) => ({
              productId: p.id,
              // Apparel defaults to M where available.
              variantId: (p.variants.find((v) => v.id === "m") ?? p.variants[0]).id,
              qty: 1,
              subscribe: false,
              stackId: stack.id,
            })),
          `${stack.name} added. Adjust sizes in your bag.`,
        );
        setDone(true);
      }}
    >
      {done ? (
        <>
          <Check /> Added
        </>
      ) : (
        <>
          Add protocol −{Math.round(stack.discount * 100)}% <ArrowRight />
        </>
      )}
    </button>
  );
}
