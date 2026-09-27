import type { Metadata } from "next";
import Link from "next/link";
import { Topo, Wave } from "@/components/Art";
import { ArrowRight } from "@/components/icons";
import { brand } from "@/data/brand";
import { frequencies } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "Our standard",
  description: `Why ${brand.name} exists, and the standard every product has to meet.`,
};

const PRINCIPLES = [
  {
    t: "Evidence over hype",
    d: "If the human research isn't there, we don't sell it. If it's early, we grade it C and say so on the front of the page.",
  },
  {
    t: "Dose disclosed",
    d: "No proprietary blends, ever. Every active is printed with its amount, and it's the dose used in the research.",
  },
  {
    t: "Claims we can defend",
    d: "We only make the health claims regulators have authorised. Everything else is research, clearly labelled as research.",
  },
  {
    t: "Built to last",
    d: "Recycled and traceable fibres, mono-material packaging, and outerwear repaired for life. Performance shouldn't cost the mountain.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="hero" style={{ minHeight: "min(80vh, 820px)" }}>
        <div className="hero__art" style={{ opacity: 0.35 }}>
          <Topo color="#0E0F0F" ink="#F3F1EC" seed={4} />
        </div>
        <div className="wrap hero__content">
          <span className="eyebrow">Our standard</span>
          <h1 className="display display--xl" style={{ marginTop: 24 }}>
            Peak is a
            <br />
            <span className="signal">rhythm.</span>
          </h1>
          <p className="lede" style={{ marginTop: 28, opacity: 0.88 }}>
            Not a moment. Not a hack. A body that trains, fuels, recovers and sleeps on time, day after day.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split" style={{ alignItems: "start" }}>
          <div className="stack-v">
            <span className="eyebrow">Why we exist</span>
            <h2 className="display display--lg">The supplement aisle is loud. We&apos;d rather be right.</h2>
          </div>
          <div className="prose">
            <p>
              Performance nutrition is full of big promises, hidden doses and ingredients that were trending last month.
              Technical apparel is full of fabric names that sound like science and aren&apos;t.
            </p>
            <p>
              {brand.name} is built the other way round. We start with the research, the position stands, meta-analyses
              and randomised trials, and only make what holds up. Then we grade it, publish the references, and tell you
              when the evidence is still early.
            </p>
            <p>
              We call it frequency because physiology is rhythmic. Heart rate, stride cadence, sleep–wake cycles, neural
              focus and tissue repair all run on cycles. Performance is keeping those rhythms on time, and every product
              we make is built for one of them.
            </p>
          </div>
        </div>
      </section>

      <section className="section--tight">
        <div className="wrap">
          <div className="freq-grid">
            {frequencies.map((f) => (
              <div className="freq" key={f.id} style={{ minHeight: 0 }}>
                <div className="freq__wave">
                  <Wave kind={f.id} />
                </div>
                <h3 className="freq__name" style={{ fontSize: "1.8rem" }}>
                  {f.name}
                </h3>
                <p className="muted" style={{ margin: 0, fontSize: 14 }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section dark">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">Four principles</span>
              <h2 className="display display--lg">The standard.</h2>
            </div>
          </div>
          <div className="values">
            {PRINCIPLES.map((p, i) => (
              <div key={p.t}>
                <span className="values__num signal">{String(i + 1).padStart(2, "0")}</span>
                <strong className="h3">{p.t}</strong>
                <p className="muted" style={{ margin: 0 }}>
                  {p.d}
                </p>
              </div>
            ))}
          </div>
          <div className="row" style={{ marginTop: 48 }}>
            <Link href="/science" className="btn btn--light">
              See the evidence library <ArrowRight />
            </Link>
            <Link href="/shop" className="btn btn--ghost">
              <span>Shop the range</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
