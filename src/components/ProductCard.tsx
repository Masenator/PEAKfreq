import Link from "next/link";
import { brand } from "@/data/brand";
import type { Product } from "@/data/types";
import { Evidence } from "./Evidence";
import { Price } from "./Price";
import { ProductArt, artBackground } from "./ProductArt";
import { QuickAdd } from "./Purchase";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="card">
      <div className="card__media" style={{ background: artBackground(product) }}>
        <ProductArt product={product} title={false} />
        <div className="card__badges">
          {product.evidence ? <Evidence grade={product.evidence} compact /> : <span />}
          {product.subscribable && <span className="chip card__sub">Subscribe −{Math.round(brand.subscriptionDiscount * 100)}%</span>}
        </div>
        <div className="card__quick">
          <QuickAdd productId={product.id} />
        </div>
      </div>
      <div className="card__body">
        <div className="card__row">
          <Link href={`/products/${product.slug}`} className="card__link card__name">
            {product.name}
          </Link>
          <span className="card__price">
            <Price money={product.price} />
          </span>
        </div>
        <div className="card__desc">{product.descriptor}</div>
        <div className="mono muted" style={{ fontSize: 10.5, marginTop: 2 }}>
          {product.line} · {product.size}
        </div>
      </div>
    </article>
  );
}
