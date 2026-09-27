import Link from "next/link";
import { getProduct } from "@/data/products";
import type { Product, Stack } from "@/data/types";
import { ArrowRight } from "./icons";
import { ProductArt } from "./ProductArt";
import { AddStackButton } from "./Purchase";
import { StackPrice } from "./StackPrice";

export function StackCard({ stack }: { stack: Stack }) {
  const items = stack.items.map((i) => getProduct(i.productId)).filter((p): p is Product => !!p);
  const light = ["#EDE9E1", "#A9CBDD"].includes(stack.color);
  return (
    <article
      className="stack-card"
      style={{
        background: stack.color,
        color: light ? "var(--ink)" : "var(--bone)",
      }}
    >
      <div className="stack-v" style={{ "--gap": "14px" } as React.CSSProperties}>
        <span className="mono" style={{ opacity: 0.8 }}>
          Protocol · {items.length} items
        </span>
        <h3 className="display display--md">{stack.name.replace(" Protocol", "")}</h3>
        <p style={{ margin: 0, maxWidth: "36ch", opacity: 0.9 }}>{stack.tagline}</p>
      </div>
      <div className="stack-card__items" aria-hidden="true">
        {items.map((p) => (
          <ProductArt key={p.id} product={p} title={false} />
        ))}
      </div>
      <div className="stack-card__foot">
        <div className="stack-v" style={{ "--gap": "4px" } as React.CSSProperties}>
          <span className="mono" style={{ opacity: 0.75 }}>
            Bundle price
          </span>
          <strong style={{ fontSize: 20 }}>
            <StackPrice stackId={stack.id} />
          </strong>
        </div>
        <div className="row" style={{ "--gap": "8px" } as React.CSSProperties}>
          <Link href={`/protocols/${stack.slug}`} className="btn btn--ghost btn--sm" aria-label={`View ${stack.name}`}>
            <span>Details</span>
          </Link>
          <AddStackButton stackId={stack.id} className={`btn btn--sm ${light ? "" : "btn--light"}`} />
        </div>
      </div>
      <Link href={`/protocols/${stack.slug}`} className="sr-only">
        {stack.name} <ArrowRight />
      </Link>
    </article>
  );
}
