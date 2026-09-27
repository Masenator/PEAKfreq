"use client";

import type { Money } from "@/data/types";
import { formatMoney } from "@/lib/pricing";
import { useStore } from "./StoreProvider";

/** Renders a catalog price in the shopper's selected currency. */
export function Price({ money, discount = 0, strike }: { money: Money; discount?: number; strike?: boolean }) {
  const { currency } = useStore();
  const full = money[currency];
  if (discount > 0) {
    return (
      <>
        {strike !== false && <span className="price-strike">{formatMoney(full, currency)}</span>}
        <span>{formatMoney(Math.round(full * (1 - discount)), currency)}</span>
      </>
    );
  }
  return <>{formatMoney(full, currency)}</>;
}

export function MinorPrice({ minor }: { minor: Money }) {
  const { currency } = useStore();
  return <>{formatMoney(minor[currency], currency)}</>;
}
