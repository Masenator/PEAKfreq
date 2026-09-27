import Link from "next/link";
import { HeroArt, Topo, Wave } from "@/components/Art";
import { Evidence } from "@/components/Evidence";
import { ArrowRight } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { ProductArt } from "@/components/ProductArt";
import { StackCard } from "@/components/StackCard";
import { brand } from "@/data/brand";
import { articles } from "@/data/journal";
import { getProduct, liveProducts } from "@/data/products";
import { stacks } from "@/data/stacks";
import { evidence, frequencies } from "@/data/taxonomy";
import type { EvidenceGrade, Product } from "@/data/types";

const pick = (ids: string[]) => ids.map(getProduct).filter((p): p is Product => !!p && p.status === "live");

export default function Home() {
  const essentials = pick(["base", "salt", "isolate", "foundation"]);
  const apparel = pick(["pulse-tights", "merino-150", "infrared-longsleeve"]);
  const shell = getProduct("ridge-shell");
  const graded = (g: EvidenceGrade) => liveProducts.filter((p) => p.evidence === g);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__art">
          <HeroArt />
        </div>
        <div className="wrap hero__content">
          <span className="eyebrow">Evidence-graded performance</span>
          <h1 className="display display--xl" style={{ marginTop: 24 }}>
            Find your
            <br />
            <span className="signal">frequency.</span>
          </h1>
          <div className="hero__meta">
            <p className="lede" style={{ opacity: 0.88 }}>
              {brand.mission}
            </p>
            <div className="hero__ctas">
              <Link href="/shop" className="btn btn--signal">
                Shop the range <ArrowRight />
              </Link>
              <Link href="/protocols" className="btn btn--ghost">
                <span>Build a protocol</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Strip ── */}
      <div className="strip" aria-hidden="true">
        <div className="strip__track">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Evidence over hype", "Dose disclosed", "Built for the long game", "Graded A · B · C", "Tested in the field"].map((t) => (
              <span key={`${k}${t}`}>{t}</span>
            )),
          )}
        </div>
      </div>

      {/* ── Five frequencies ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">The five frequencies</span>
              <h2 className="display display--lg">Your body runs on rhythm.</h2>
              <p className="lede muted">
                Heartbeat, stride, sleep, focus and repair all run on cycles. Performance means keeping each one on
                time. Every product we make is built for one of them.
              </p>
            </div>
          </div>
          <div className="freq-grid">
            {frequencies.map((f) => (
              <article className="freq" key={f.id}>
                <div className="freq__wave">
                  <Wave kind={f.id} />
                </div>
                <span className="mono muted">{f.hz}</span>
                <h3 className="freq__name">{f.name}</h3>
                <p style={{ margin: 0, fontWeight: 600 }}>{f.body}</p>
                <p className="muted" style={{ margin: 0, fontSize: 15 }}>
                  {f.copy}
                </p>
                <Link href={`/shop?category=${f.category}`} className="link-arrow">
                  Shop {f.name.toLowerCase()} <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Essentials ── */}
      <section className="section paper">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Start here</span>
              <h2 className="display display--lg">The essentials.</h2>
            </div>
            <Link href="/shop" className="link-arrow">
              Shop all {liveProducts.length} products <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid--4">
            {essentials.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocols ── */}
      <section className="section dark">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Protocols</span>
              <h2 className="display display--lg">Stacks, not guesses.</h2>
              <p className="lede muted">
                Complete systems for a single goal, with timing for every item. Bundle price is 10% below buying each
                one separately.
              </p>
            </div>
            <Link href="/protocols" className="link-arrow">
              All protocols <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid--3">
            {stacks.slice(0, 3).map((s) => (
              <StackCard key={s.id} stack={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Evidence ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Our standard</span>
              <h2 className="display display--lg">We grade everything. Including ourselves.</h2>
              <p className="lede muted">
                Every product carries an evidence grade based on the published research, with the references. When the
                science is early, we say so on the front of the page.
              </p>
            </div>
            <Link href="/science" className="link-arrow">
              Evidence library <ArrowRight size={14} />
            </Link>
          </div>
          <div className="evidence-grid">
            {(["A", "B", "C"] as EvidenceGrade[]).map((g) => (
              <div className="evidence-cell" key={g}>
                <span className="evidence-cell__grade" style={{ color: g === "A" ? "var(--signal)" : undefined }}>
                  {g}
                </span>
                <strong className="h3">{evidence[g].label}</strong>
                <p className="muted" style={{ margin: 0 }}>
                  {evidence[g].copy}
                </p>
                <div className="row" style={{ "--gap": "6px" } as React.CSSProperties}>
                  {graded(g).map((p) => (
                    <Link key={p.id} href={`/products/${p.slug}`} className="chip">
                      {p.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Apparel ── */}
      <section className="section sand">
        <div className="wrap stack-v" style={{ "--gap": "clamp(48px, 7vw, 96px)" } as React.CSSProperties}>
          <div className="split">
            {shell && (
              <Link href={`/products/${shell.slug}`} className="split__media" style={{ background: "var(--ink)" }}>
                <div style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
                  <Topo color="#0E0F0F" ink="#F3F1EC" seed={2.2} />
                </div>
                <div style={{ position: "relative", width: "70%" }}>
                  <ProductArt product={shell} />
                </div>
                <span className="chip" style={{ position: "absolute", left: 16, bottom: 16, color: "var(--bone)", borderColor: "var(--line-inv)" }}>
                  {shell.name} · 92 g
                </span>
              </Link>
            )}
            <div className="stack-v" style={{ "--gap": "24px" } as React.CSSProperties}>
              <span className="eyebrow">Engineered layers</span>
              <h2 className="display display--lg">Clothing with a job to do.</h2>
              <p className="lede">
                What you wear changes your physiology: compression for recovery, merino for thermoregulation, cooling
                for heat, bioceramic yarn for overnight recovery. Each piece is built for one job, and repaired for
                life when it&apos;s outerwear.
              </p>
              {shell?.specs && (
                <table className="spec">
                  <tbody>
                    {shell.specs.slice(0, 4).map((s) => (
                      <tr key={s.label}>
                        <th scope="row">{s.label}</th>
                        <td>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="row">
                <Link href="/shop?category=apparel" className="btn">
                  Shop apparel <ArrowRight />
                </Link>
                <Link href="/shop?category=gear" className="btn btn--ghost">
                  <span>Shop kit</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="grid grid--3">
            {apparel.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Journal ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Journal</span>
              <h2 className="display display--lg">Read the research.</h2>
            </div>
            <Link href="/journal" className="link-arrow">
              All articles <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid--3">
            {articles.slice(0, 3).map((a, i) => (
              <Link key={a.slug} href={`/journal/${a.slug}`} className="article-card">
                <div className="article-card__media">
                  <Topo color={a.color} seed={i + 1} />
                </div>
                <span className="mono muted">
                  {a.category} · {a.readMins} min read
                </span>
                <h3 className="h3" style={{ fontSize: "1.6rem" }}>
                  {a.title}
                </h3>
                <p className="muted" style={{ margin: 0 }}>
                  {a.dek}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Commitments ── */}
      <section className="section dark">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Built for the long game</span>
              <h2 className="display display--lg">Performance that doesn&apos;t cost the mountain.</h2>
            </div>
          </div>
          <div className="values">
            <div>
              <span className="values__num signal">0</span>
              <strong>Proprietary blends</strong>
              <p className="muted" style={{ margin: 0 }}>
                Every active ingredient and its dose, printed on the pack and on the page.
              </p>
            </div>
            <div>
              <span className="values__num">Algae</span>
              <strong>Not fish</strong>
              <p className="muted" style={{ margin: 0 }}>
                Our omega-3 comes from farmed microalgae, not the ocean.
              </p>
            </div>
            <div>
              <span className="values__num">Mono</span>
              <strong>Material packaging</strong>
              <p className="muted" style={{ margin: 0 }}>
                We&apos;re moving every pouch to recyclable mono-material film, and every stick to paper.
              </p>
            </div>
            <div>
              <span className="values__num">∞</span>
              <strong>Repair for life</strong>
              <p className="muted" style={{ margin: 0 }}>
                Outerwear is repaired free for the life of the garment. The most sustainable jacket is the one you keep.
              </p>
            </div>
          </div>
          <div className="row" style={{ marginTop: 40 }}>
            <Evidence grade="A" />
            <span className="muted" style={{ fontSize: 14 }}>
              {liveProducts.filter((p) => p.evidence === "A").length} products carry our highest evidence grade.
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
