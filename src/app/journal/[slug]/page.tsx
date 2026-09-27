import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Topo } from "@/components/Art";
import { ProductCard } from "@/components/ProductCard";
import { RichText } from "@/components/RichText";
import { articles, getArticle } from "@/data/journal";
import { getProduct } from "@/data/products";
import type { Product } from "@/data/types";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return a ? { title: a.title, description: a.dek } : {};
}

export default async function ArticlePage({ params }: { params: Params }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();
  // Every product mentioned inline or in a products block becomes shoppable.
  const ids = new Set<string>();
  for (const b of article.body) {
    if (b.type === "products") b.ids.forEach((id) => ids.add(id));
    const texts = b.type === "p" ? [b.text] : b.type === "list" ? b.items : [];
    for (const t of texts) for (const m of t.matchAll(/\[\[([a-z0-9-]+)/g)) ids.add(m[1]);
  }
  const mentioned = [...ids].map(getProduct).filter((p): p is Product => !!p && p.status === "live");
  const date = new Date(article.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return (
    <article>
      <header className="wrap section" style={{ paddingBottom: 40 }}>
        <Link href="/journal" className="mono muted">
          ← Journal
        </Link>
        <div className="stack-v" style={{ "--gap": "20px", marginTop: 24, maxWidth: 980 } as React.CSSProperties}>
          <span className="mono muted">
            {article.category} · {article.readMins} min read · {date}
          </span>
          <h1 className="display display--xl" style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}>
            {article.title}
          </h1>
          <p className="lede">{article.dek}</p>
        </div>
      </header>
      <div className="wrap">
        <div style={{ aspectRatio: "21 / 8", borderRadius: "var(--radius)", overflow: "hidden" }}>
          <Topo color={article.color} seed={articles.indexOf(article) + 1} />
        </div>
      </div>
      <div className="wrap section--tight">
        <div className="prose" style={{ marginInline: "auto" }}>
          {article.body.map((b, i) => {
            switch (b.type) {
              case "p":
                return (
                  <p key={i}>
                    <RichText text={b.text} />
                  </p>
                );
              case "h":
                return <h2 key={i}>{b.text}</h2>;
              case "quote":
                return <blockquote key={i}>{b.text}</blockquote>;
              case "list":
                return (
                  <ul key={i}>
                    {b.items.map((it) => (
                      <li key={it}>
                        <RichText text={it} />
                      </li>
                    ))}
                  </ul>
                );
              case "products":
                return null;
            }
          })}
        </div>
      </div>
      {mentioned.length > 0 && (
        <section className="section paper">
          <div className="wrap">
            <div className="section-head">
              <div>
                <span className="eyebrow">Mentioned in this article</span>
                <h2 className="display display--md">Shop the story.</h2>
              </div>
            </div>
            <div className="grid grid--4">
              {mentioned.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
