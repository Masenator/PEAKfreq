import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Evidence } from "@/components/Evidence";
import { ArrowRight } from "@/components/icons";
import { Price } from "@/components/Price";
import { ProductArt, artBackground } from "@/components/ProductArt";
import { AddStackButton, QuickAdd } from "@/components/Purchase";
import { StackPrice } from "@/components/StackPrice";
import { getProduct } from "@/data/products";
import { getStack, stacks } from "@/data/stacks";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return stacks.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = getStack((await params).slug);
  return s ? { title: s.name, description: s.description } : {};
}

export default async function StackPage({ params }: { params: Params }) {
  const stack = getStack((await params).slug);
  if (!stack) notFound();
  const light = ["#EDE9E1", "#A9CBDD", "#DB7A45"].includes(stack.color);

  return (
    <>
      <section style={{ background: stack.color, color: light ? "var(--ink)" : "var(--bone)" }}>
        <div className="wrap section" style={{ paddingBottom: "clamp(40px, 6vw, 72px)" }}>
          <Link href="/protocols" className="mono" style={{ opacity: 0.8 }}>
            ← All protocols
          </Link>
          <h1 className="display display--xl" style={{ marginTop: 24 }}>
            {stack.name.replace(" Protocol", "")}
          </h1>
          <div className="hero__meta">
            <p className="lede">{stack.description}</p>
            <div className="stack-v" style={{ "--gap": "12px", justifyItems: "start" } as React.CSSProperties}>
              <strong style={{ fontSize: 24 }}>
                <StackPrice stackId={stack.id} />
              </strong>
              <AddStackButton stackId={stack.id} className={`btn ${light ? "" : "btn--light"}`} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">The protocol</span>
              <h2 className="display display--md">What, and when.</h2>
            </div>
          </div>
          <ol style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--line)" }}>
            {stack.items.map((item, i) => {
              const p = getProduct(item.productId);
              if (!p) return null;
              return (
                <li
                  key={item.productId}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 110px 1fr auto",
                    gap: "clamp(12px, 3vw, 32px)",
                    alignItems: "center",
                    padding: "20px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                  className="protocol-row"
                >
                  <span className="display" style={{ fontSize: "2.4rem", color: "var(--signal)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Link href={`/products/${p.slug}`} className="line__media" style={{ background: artBackground(p), width: 110, height: 130 }}>
                    <ProductArt product={p} title={false} />
                  </Link>
                  <div className="stack-v" style={{ "--gap": "6px" } as React.CSSProperties}>
                    <span className="mono muted">{item.when}</span>
                    <Link href={`/products/${p.slug}`} className="h3">
                      {p.name} <span className="muted" style={{ fontWeight: 500 }}>{p.descriptor}</span>
                    </Link>
                    <p className="muted" style={{ margin: 0, fontSize: 15, maxWidth: "60ch" }}>
                      {p.headline}
                    </p>
                    {p.evidence && <Evidence grade={p.evidence} />}
                  </div>
                  <div className="stack-v" style={{ "--gap": "8px", justifyItems: "end" } as React.CSSProperties}>
                    <strong>
                      <Price money={p.price} />
                    </strong>
                    <QuickAdd productId={p.id} label="Add" className="btn btn--sm btn--ghost" />
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="row" style={{ marginTop: 32, justifyContent: "flex-end" }}>
            <Link href="/science" className="link-arrow">
              How we grade evidence <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
