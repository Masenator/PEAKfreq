import Link from "next/link";
import { Topo, Wave } from "@/components/Art";
import { Evidence } from "@/components/Evidence";
import { ArrowRight, Check, Flask, Loop } from "@/components/icons";
import { ProductCard } from "@/components/ProductCard";
import { StackCard } from "@/components/StackCard";
import { SummitHero } from "@/components/SummitHero";
import { brand } from "@/data/brand";
import { articles } from "@/data/journal";
import { getProduct, liveProducts } from "@/data/products";
import { stacks } from "@/data/stacks";
import { evidence, frequencies } from "@/data/taxonomy";
import type { EvidenceGrade, Product } from "@/data/types";

const pick = (ids: string[]) => ids.map(getProduct).filter((p): p is Product => !!p && p.status === "live");

/** The five frequencies step through the logo's green-to-orange fade. */
const FADE = ["#5E9E6A", "#7E9A5A", "#A08C4A", "#C4834A", "#DB7A45"];

const ListIcon = () => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="4.5" cy="6" r="1.2" fill="currentColor" />
    <circle cx="4.5" cy="12" r="1.2" fill="currentColor" />
    <circle cx="4.5" cy="18" r="1.2" fill="currentColor" />
  </svg>
);

export default function Home() {
  const essentials = pick(["base", "salt", "isolate", "foundation"]);
  const graded = (g: EvidenceGrade) => liveProducts.filter((p) => p.evidence === g);
  const pct = Math.round(brand.subscriptionDiscount * 100);

  return (
    <>
      {/* ── Hero ── */}
      <section className="hero hero--summit">
        {brand.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hero__img" src={brand.heroImage} alt={brand.heroImageAlt} fetchPriority="high" />
        ) : (
          <SummitHero className="hero__img" label={brand.heroImageAlt} />
        )}
        <div className="wrap hero__content">
          <div className="hero__copy">
            <span className="eyebrow">Evidence-graded performance</span>
            <h1 className="home-display home-display--xl">
              Find your <span className="grad-text">frequency.</span>
            </h1>
            <p className="lede">{brand.mission}</p>
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

      {/* ── Trust ── */}
      <section className="paper">
        <div className="wrap trust">
          <div>
            <Flask size={22} />
            <strong>Evidence-graded</strong>
            <span>Every product rated A, B or C against the research.</span>
          </div>
          <div>
            <ListIcon />
            <strong>Every dose disclosed</strong>
            <span>No proprietary blends. Ever.</span>
          </div>
          <div>
            <Check size={22} />
            <strong>Claims we can defend</strong>
            <span>Only health claims authorised in the UK and EU.</span>
          </div>
          <div>
            <Loop size={22} />
            <strong>Subscribe &amp; save {pct}%</strong>
            <span>Skip, swap or cancel any time.</span>
          </div>
        </div>
      </section>

      {/* ── Five frequencies ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">The five frequencies</span>
              <h2 className="home-display home-display--lg">Your body runs on rhythm.</h2>
              <p className="lede muted">
                Heartbeat, stride, sleep, focus and repair all run on cycles. Performance means keeping each one on
                time. Every product we make is built for one of them.
              </p>
            </div>
          </div>
          <div className="freq-grid">
            {frequencies.map((f, i) => (
              <article className="freq" key={f.id}>
                <div className="freq__wave" style={{ color: FADE[i] }}>
                  <Wave kind={f.id} />
                </div>
                <span className="mono muted">{f.hz}</span>
                <h3 className="home-display" style={{ fontSize: "1.9rem" }}>
                  {f.name}
                </h3>
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
              <h2 className="home-display home-display--lg">The essentials.</h2>
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
      <section className="section sand">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Protocols</span>
              <h2 className="home-display home-display--lg">Stacks, not guesses.</h2>
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
              <h2 className="home-display home-display--lg">We grade everything. Including ourselves.</h2>
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
            {(["A", "B", "C"] as EvidenceGrade[]).map((g, i) => (
              <div className="evidence-cell" key={g}>
                <span className="evidence-cell__grade" style={{ color: [FADE[0], FADE[2], FADE[4]][i] }}>
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

      {/* ── Apparel (placeholder) ── */}
      <section className="section paper">
        <div className="wrap lab">
          <span className="eyebrow">Apparel</span>
          <h2 className="home-display home-display--lg">Working in the lab.</h2>
        </div>
      </section>

      {/* ── Journal ── */}
      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Journal</span>
              <h2 className="home-display home-display--lg">Read the research.</h2>
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
      <section className="section sand">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Built for the long game</span>
              <h2 className="home-display home-display--lg">Performance that doesn&apos;t cost the mountain.</h2>
            </div>
          </div>
          <div className="values values--3">
            <div>
              <span className="values__num" style={{ color: FADE[0] }}>
                0
              </span>
              <strong>Proprietary blends</strong>
              <p className="muted" style={{ margin: 0 }}>
                Every active ingredient and its dose, printed on the pack and on the page.
              </p>
            </div>
            <div>
              <span className="values__num" style={{ color: FADE[2] }}>
                Algae
              </span>
              <strong>Not fish</strong>
              <p className="muted" style={{ margin: 0 }}>
                Our omega-3 comes from farmed microalgae, not the ocean.
              </p>
            </div>
            <div>
              <span className="values__num" style={{ color: FADE[4] }}>
                Mono
              </span>
              <strong>Material packaging</strong>
              <p className="muted" style={{ margin: 0 }}>
                We&apos;re moving every pouch to recyclable mono-material film, and every stick to paper.
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
