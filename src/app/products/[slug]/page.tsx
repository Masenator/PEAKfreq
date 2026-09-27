import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Evidence } from "@/components/Evidence";
import { ArrowRight, Check } from "@/components/icons";
import { ProductArt, artBackground } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { PurchasePanel } from "@/components/Purchase";
import { StackCard } from "@/components/StackCard";
import { brand } from "@/data/brand";
import { getProduct, getProductBySlug, liveProducts } from "@/data/products";
import { referenceUrl } from "@/data/science";
import { stacks } from "@/data/stacks";
import { evidence } from "@/data/taxonomy";
import type { Product } from "@/data/types";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return liveProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProductBySlug((await params).slug);
  if (!p) return {};
  return { title: `${p.name} ${p.descriptor}`, description: p.headline };
}

function jsonLd(p: Product) {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${brand.name} ${p.name} ${p.descriptor}`,
    description: p.description,
    brand: { "@type": "Brand", name: brand.name },
    sku: p.variants[0]?.sku,
    offers: brand.currencies.map((c) => ({
      "@type": "Offer",
      priceCurrency: c,
      price: (p.price[c] / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${site}/products/${p.slug}`,
    })),
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const product = getProductBySlug((await params).slug);
  if (!product || product.status !== "live") notFound();
  const p = product;

  const inStacks = stacks.filter((s) => s.items.some((i) => i.productId === p.id));
  const related = liveProducts
    .filter((x) => x.id !== p.id && x.goals.some((g) => p.goals.includes(g)))
    .sort((a, b) => Number(b.kind === p.kind) - Number(a.kind === p.kind))
    .slice(0, 4);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(p)).replace(/</g, "\\u003c") }} />
      <div className="wrap" style={{ paddingBlock: "20px 0" }}>
        <nav aria-label="Breadcrumb" className="mono muted" style={{ fontSize: 11 }}>
          <Link href="/shop">Shop</Link> / <Link href={`/shop?category=${p.category}`}>{p.line}</Link> / {p.name}
        </nav>
      </div>

      <section className="wrap section--tight" style={{ paddingTop: 20 }}>
        <div className="pdp">
          <div className="pdp__gallery">
            <div className="pdp__stage" style={{ background: artBackground(p) }}>
              <ProductArt product={p} />
              {p.evidence && (
                <div style={{ position: "absolute", top: 16, left: 16 }}>
                  <Evidence grade={p.evidence} compact />
                </div>
              )}
            </div>
            <div className="pdp__thumbs" aria-hidden="true">
              <div className="pdp__thumb" style={{ background: p.art.color, color: p.art.ink }}>
                <div className="stack-v" style={{ "--gap": "6px", textAlign: "center" } as React.CSSProperties}>
                  <span className="mono" style={{ fontSize: 10 }}>
                    {p.line}
                  </span>
                  <span className="display" style={{ fontSize: "clamp(1.2rem, 3vw, 2.4rem)" }}>
                    {p.name}
                  </span>
                </div>
              </div>
              <div className="pdp__thumb sand" style={{ alignContent: "center", justifyItems: "start", gap: 6 }}>
                {p.benefits.slice(0, 3).map((b) => (
                  <span key={b} style={{ fontSize: 12, display: "flex", gap: 6, lineHeight: 1.3 }}>
                    <Check size={12} /> {b}
                  </span>
                ))}
              </div>
              <div className="pdp__thumb" style={{ background: "var(--ink)", color: "var(--bone)", alignContent: "center" }}>
                <div className="stack-v" style={{ "--gap": "4px", textAlign: "center" } as React.CSSProperties}>
                  <span className="display" style={{ fontSize: "clamp(2rem, 5vw, 4rem)", color: "var(--signal)" }}>
                    {p.evidence ?? "—"}
                  </span>
                  <span className="mono" style={{ fontSize: 10 }}>
                    {p.evidence ? evidence[p.evidence].label : "Field tested"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pdp__info">
            <div className="pdp__title">
              <span className="eyebrow">{p.line}</span>
              <h1 className="display display--lg">{p.name}</h1>
              <p className="h3" style={{ fontWeight: 500 }}>
                {p.descriptor} <span className="muted">· {p.size}</span>
              </p>
            </div>
            <p className="lede" style={{ fontSize: "1.15rem" }}>
              {p.headline}
            </p>
            <div className="row" style={{ "--gap": "6px" } as React.CSSProperties}>
              {p.badges.map((b) => (
                <span className="chip" key={b}>
                  {b}
                </span>
              ))}
            </div>

            <PurchasePanel product={p} />

            <div className="accordion">
              <details open>
                <summary>Overview</summary>
                <div className="accordion__body">
                  <p style={{ margin: 0 }}>{p.description}</p>
                  <ul>
                    {p.benefits.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </details>
              {p.ingredients && (
                <details>
                  <summary>Ingredients &amp; dose</summary>
                  <div className="accordion__body">
                    <table className="spec">
                      <tbody>
                        {p.ingredients.map((i) => (
                          <tr key={i.name}>
                            <th scope="row">{i.name}</th>
                            <td>
                              {i.amount}
                              {i.form && <div className="muted" style={{ fontWeight: 400, fontSize: 13 }}>{i.form}</div>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="muted" style={{ margin: 0, fontSize: 13 }}>
                      Per serving. No proprietary blends.
                    </p>
                  </div>
                </details>
              )}
              {p.specs && (
                <details>
                  <summary>Technical specs</summary>
                  <div className="accordion__body">
                    <table className="spec">
                      <tbody>
                        {p.specs.map((s) => (
                          <tr key={s.label}>
                            <th scope="row">{s.label}</th>
                            <td>{s.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>
              )}
              <details>
                <summary>How to use</summary>
                <div className="accordion__body">
                  <p style={{ margin: 0 }}>{p.howToUse}</p>
                </div>
              </details>
              <details>
                <summary>The science{p.evidence ? ` · Grade ${p.evidence}` : ""}</summary>
                <div className="accordion__body">
                  {p.evidence && <Evidence grade={p.evidence} />}
                  <p style={{ margin: 0 }}>{p.science.summary}</p>
                  {p.science.references.length > 0 && (
                    <ul className="refs">
                      {p.science.references.map((r) => (
                        <li key={r.title}>
                          {r.authors} ({r.year}).{" "}
                          <a href={referenceUrl(r)} target="_blank" rel="noopener noreferrer">
                            {r.title}
                          </a>
                          . <em>{r.journal}</em>.
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>
              {(p.claims.length > 0 || p.warnings.length > 0) && (
                <details>
                  <summary>Claims &amp; safety</summary>
                  <div className="accordion__body">
                    {p.claims.length > 0 && (
                      <ul>
                        {p.claims.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    )}
                    {p.warnings.length > 0 && (
                      <p className="muted" style={{ margin: 0, fontSize: 13.5 }}>
                        {p.warnings.join(" ")}
                      </p>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      </section>

      {inStacks.length > 0 && (
        <section className="section dark">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Part of a protocol</span>
                <h2 className="display display--md">Works better together.</h2>
              </div>
              <Link href="/protocols" className="link-arrow">
                All protocols <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid--3">
              {inStacks.slice(0, 3).map((s) => (
                <StackCard key={s.id} stack={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="section">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Pairs with</span>
                <h2 className="display display--md">Same goal. Different frequency.</h2>
              </div>
            </div>
            <div className="grid grid--4">
              {related.map((r) => (
                <ProductCard key={r.id} product={getProduct(r.id)!} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
