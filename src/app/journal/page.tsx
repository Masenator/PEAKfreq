import type { Metadata } from "next";
import Link from "next/link";
import { Topo } from "@/components/Art";
import { articles } from "@/data/journal";

export const metadata: Metadata = {
  title: "Journal",
  description: "Research, protocols and field notes on performance physiology.",
};

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <section className="wrap section" style={{ paddingBottom: 40 }}>
        <span className="eyebrow">Journal</span>
        <h1 className="display display--xl" style={{ marginTop: 20 }}>
          Read the
          <br />
          research.
        </h1>
      </section>
      <section className="wrap section--tight" style={{ paddingTop: 0 }}>
        <Link href={`/journal/${lead.slug}`} className="split article-card" style={{ alignItems: "end" }}>
          <div className="article-card__media" style={{ aspectRatio: "16 / 10" }}>
            <Topo color={lead.color} seed={1} />
          </div>
          <div className="stack-v" style={{ "--gap": "16px" } as React.CSSProperties}>
            <span className="mono muted">
              {lead.category} · {lead.readMins} min read
            </span>
            <h2 className="display display--lg">{lead.title}</h2>
            <p className="lede muted">{lead.dek}</p>
            <span className="link-arrow" style={{ justifySelf: "start" }}>
              Read article
            </span>
          </div>
        </Link>
      </section>
      <section className="wrap section" style={{ paddingTop: 40 }}>
        <div className="grid grid--3">
          {rest.map((a, i) => (
            <Link key={a.slug} href={`/journal/${a.slug}`} className="article-card">
              <div className="article-card__media">
                <Topo color={a.color} seed={i + 2} />
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
      </section>
    </>
  );
}
