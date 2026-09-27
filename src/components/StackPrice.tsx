"use client";

import { formatMoney, stackPrice } from "@/lib/pricing";
import { useStore } from "./StoreProvider";

export function StackPrice({ stackId }: { stackId: string }) {
  const { currency } = useStore();
  const { full, bundle } = stackPrice(stackId, currency);
  return (
    <>
      <span className="price-strike">{formatMoney(full, currency)}</span>
      {formatMoney(bundle, currency)}
    </>
  );
}
