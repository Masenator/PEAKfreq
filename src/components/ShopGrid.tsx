"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { liveProducts } from "@/data/products";
import { categories, goals } from "@/data/taxonomy";
import type { Category, Goal } from "@/data/types";
import { ProductCard } from "./ProductCard";

type Filter = { kind: "all" } | { kind: "category"; value: Category } | { kind: "goal"; value: Goal };

export function ShopGrid() {
  const params = useSearchParams();
  const router = useRouter();
  const cat = params.get("category") as Category | null;
  const goal = params.get("goal") as Goal | null;

  const active: Filter = cat && cat in categories ? { kind: "category", value: cat } : goal && goal in goals ? { kind: "goal", value: goal } : { kind: "all" };

  const key = active.kind === "all" ? "all" : `${active.kind}:${active.value}`;
  const items = useMemo(
    () =>
      liveProducts.filter((p) => {
        if (active.kind === "category") return p.category === active.value;
        if (active.kind === "goal") return p.goals.includes(active.value);
        return true;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  const go = (q: string) => router.replace(q ? `/shop?${q}` : "/shop", { scroll: false });

  return (
    <>
      <div className="filters">
        <div className="wrap filters__row" role="toolbar" aria-label="Filter products">
          <button className="filter" aria-pressed={active.kind === "all"} onClick={() => go("")}>
            All
          </button>
          {(Object.keys(categories) as Category[]).map((c) => (
            <button key={c} className="filter" aria-pressed={active.kind === "category" && active.value === c} onClick={() => go(`category=${c}`)}>
              {categories[c].label}
            </button>
          ))}
          <span className="filters__sep" aria-hidden="true" />
          <span className="mono muted" style={{ whiteSpace: "nowrap", paddingInline: 4 }}>
            Goal
          </span>
          {(Object.keys(goals) as Goal[]).map((g) => (
            <button key={g} className="filter" aria-pressed={active.kind === "goal" && active.value === g} onClick={() => go(`goal=${g}`)}>
              {goals[g]}
            </button>
          ))}
        </div>
      </div>
      <section className="wrap section--tight" aria-live="polite">
        <p className="mono muted" style={{ margin: "0 0 20px" }}>
          {items.length} {items.length === 1 ? "product" : "products"}
        </p>
        <div className="grid grid--4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
