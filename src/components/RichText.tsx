import Link from "next/link";
import { Fragment } from "react";
import { getProduct } from "@/data/products";
import { Price } from "./Price";
import { ProductArt, artBackground } from "./ProductArt";
import { QuickAdd } from "./Purchase";

/**
 * Renders text with inline product mentions: [[product-id]] or
 * [[product-id|label]]. Each mention links to the product page and shows a
 * hover card with price and a one-click add, so any product the brand talks
 * about is sellable from wherever it's mentioned.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\[\[[a-z0-9-]+(?:\|[^\]]+)?\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = part.match(/^\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]$/);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const product = getProduct(m[1]);
        if (!product) return <Fragment key={i}>{m[2] ?? m[1]}</Fragment>;
        return <ProductMention key={i} id={product.id} label={m[2]} />;
      })}
    </>
  );
}

export function ProductMention({ id, label }: { id: string; label?: string }) {
  const p = getProduct(id);
  if (!p) return null;
  return (
    <span className="mention-wrap">
      <Link className="mention" href={`/products/${p.slug}`}>
        {label ?? p.name}
      </Link>
      <span className="mention__pop" role="tooltip">
        <span className="mention__pop-media" style={{ background: artBackground(p) }}>
          <ProductArt product={p} title={false} />
        </span>
        <span style={{ display: "grid", gap: 6 }}>
          <span>
            <strong>{p.name}</strong> · <Price money={p.price} />
            <br />
            <span className="muted">{p.descriptor}</span>
          </span>
          <QuickAdd productId={p.id} label="Add to bag" className="btn btn--sm" />
        </span>
      </span>
    </span>
  );
}
