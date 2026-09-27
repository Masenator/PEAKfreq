import type { Metadata } from "next";
import Link from "next/link";
import { Evidence } from "@/components/Evidence";
import { Price } from "@/components/Price";
import { ProductArt, artBackground } from "@/components/ProductArt";
import { QuickAdd } from "@/components/Purchase";
import { liveProducts } from "@/data/products";
import { referenceUrl, watchlist } from "@/data/science";
import { evidence } from "@/data/taxonomy";
import type { EvidenceGrade } from "@/data/types";

export const metadata: Metadata = {
  title: "Evidence library",
  description: "Every product graded on the published research, with references, and the ingredients we're watching but won't sell yet.",
};

export default function SciencePage() {
  const grades: EvidenceGrade[] = ["A", "B", "C"];
  return (
    <>
      <section className="wrap section" style={{ paddingBottom: 40 }}>
        <span className="eyebrow">Evidence library</span>
        <h1 className="display display--xl" style={{ marginTop: 20 }}>
          Show your
          <br />
          working.
        </h1>
        <p className="lede muted" style={{ marginTop: 24 }}>
          We grade every product on the strength of the human research behind it, and link the studies. Grades describe
          the evidence. They are not health claims.
        </p>
      </section>

      <section className="wrap">
        <div className="evidence-grid">
          {grades.map((g) => (
            <div className="evidence-cell" key={g}>
              <span className="evidence-cell__grade" style={{ color: g === "A" ? "var(--signal)" : undefined }}>
                {g}
              </span>
              <strong className="h3">{evidence[g].label}</strong>
              <p className="muted" style={{ margin: 0 }}>
                {evidence[g].copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      {grades.map((g) => (
        <section key={g} className="section--tight" id={`grade-${g}`}>
          <div className="wrap">
            <div className="row" style={{ marginBottom: 24 }}>
              <Evidence grade={g} />
            </div>
            <div className="stack-v" style={{ "--gap": "0px", borderTop: "1px solid var(--line)" } as React.CSSProperties}>
              {liveProducts
                .filter((p) => p.evidence === g)
                .map((p) => (
                  <article
                    key={p.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "96px minmax(0, 1fr) minmax(0, 1.4fr)",
                      gap: "clamp(16px, 3vw, 40px)",
                      padding: "24px 0",
                      borderBottom: "1px solid var(--line)",
                    }}
                    className="science-row"
                  >
                    <Link href={`/products/${p.slug}`} className="line__media" style={{ background: artBackground(p), width: 96, height: 120 }}>
                      <ProductArt product={p} title={false} />
                    </Link>
                    <div className="stack-v" style={{ "--gap": "8px", alignContent: "start" } as React.CSSProperties}>
                      <span className="mono muted">{p.line}</span>
                      <Link href={`/products/${p.slug}`} className="h3">
                        {p.name}
                      </Link>
                      <span className="muted">{p.descriptor}</span>
                      <div className="row" style={{ "--gap": "10px", marginTop: 6 } as React.CSSProperties}>
                        <strong>
                          <Price money={p.price} />
                        </strong>
                        <QuickAdd productId={p.id} label="Add" className="btn btn--sm" />
                      </div>
                    </div>
                    <div className="stack-v" style={{ "--gap": "12px", alignContent: "start" } as React.CSSProperties}>
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
                  </article>
                ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section dark" id="watchlist">
        <div className="wrap">
          <div className="section-head">
            <div>
              <span className="eyebrow">On our radar</span>
              <h2 className="display display--lg">What we&apos;re not selling. Yet.</h2>
              <p className="lede muted">
                Hype moves faster than evidence. These are the ingredients we&apos;re tracking, and why they&apos;re not on
                our shelf.
              </p>
            </div>
          </div>
          <div className="grid grid--3">
            {watchlist.map((w) => (
              <article key={w.name} className="stack-v" style={{ "--gap": "12px", borderTop: "1px solid var(--line)", paddingTop: 20 } as React.CSSProperties}>
                <span className="chip" style={{ justifySelf: "start", color: w.status === "Not selling" ? "var(--signal)" : undefined }}>
                  {w.status}
                </span>
                <h3 className="h3" style={{ fontSize: "1.6rem" }}>
                  {w.name}
                </h3>
                <p className="muted" style={{ margin: 0 }}>
                  {w.why}
                </p>
                <p style={{ margin: 0, fontSize: 13 }}>
                  <a href={referenceUrl(w.reference)} target="_blank" rel="noopener noreferrer" style={{ borderBottom: "1px solid var(--line)" }}>
                    {w.reference.authors} ({w.reference.year}), <em>{w.reference.journal}</em>
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
