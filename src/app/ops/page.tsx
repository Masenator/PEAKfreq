import type { Metadata } from "next";
import Link from "next/link";
import { Evidence } from "@/components/Evidence";
import { ProductArt, artBackground } from "@/components/ProductArt";
import { products } from "@/data/products";
import { catalogSummary, economics } from "@/lib/ops";
import { formatMoney } from "@/lib/pricing";

export const metadata: Metadata = { title: "Ops · Catalog & sourcing", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const pct = (n: number) => `${Math.round(n * 100)}%`;
const gbp = (n: number) => formatMoney(n, "GBP");

const CHECKLIST = [
  "Register the company and trademark the brand name and logo (UKIPO; EUIPO/USPTO for export markets).",
  "Register as a food business with your local authority at least 28 days before trading (UK).",
  "Get contract-manufacturer quotes for each SKU. Replace 'TBC' supplier and estimated unit costs in src/data/products.ts.",
  "Obtain certificates of analysis (CoA) per batch. Enrol supplements in Informed Sport or equivalent before targeting tested athletes.",
  "Have label artwork checked against UK/EU labelling rules (mandatory statements, allergens, NRV %, claims wording).",
  "Replace generated label art with product photography by setting `image` on each product.",
  "Add STRIPE_SECRET_KEY, set NEXT_PUBLIC_SITE_URL, and enable Stripe Tax for VAT/sales tax.",
  "Have the legal page (terms, privacy, returns) reviewed by a solicitor.",
  "Set up a 3PL or fulfilment partner and connect Stripe webhooks for order routing.",
];

export default function OpsPage() {
  const s = catalogSummary();
  return (
    <section className="wrap section--tight">
      <div className="row between" style={{ marginBottom: 32 }}>
        <div className="stack-v" style={{ "--gap": "10px" } as React.CSSProperties}>
          <span className="eyebrow">Ops console · private</span>
          <h1 className="display display--md">Catalog &amp; sourcing</h1>
          <p className="muted" style={{ margin: 0, maxWidth: "70ch" }}>
            Every product on the storefront is defined in <code>src/data/products.ts</code>. Edit a record to
            white-label, reprice or re-source it; the product page, cart, checkout, protocols, journal mentions and label
            art all update from the same record.
          </p>
        </div>
        <div className="row">
          <a className="btn btn--sm" href="/api/ops/shopify.csv">
            Export Shopify CSV
          </a>
          <a className="btn btn--sm btn--ghost" href="/api/ops/catalog.json">
            <span>Catalog JSON</span>
          </a>
        </div>
      </div>

      <div className="stat-row" style={{ marginBottom: 32 }}>
        <div className="stat">
          <span className="mono muted">Live products</span>
          <b>{s.products}</b>
        </div>
        <div className="stat">
          <span className="mono muted">SKUs</span>
          <b>{s.skus}</b>
        </div>
        <div className="stat">
          <span className="mono muted">Avg gross margin (ex VAT)</span>
          <b>{pct(s.avgMargin)}</b>
        </div>
        <div className="stat">
          <span className="mono muted">Total MOQ outlay (est.)</span>
          <b>{gbp(s.moqOutlay)}</b>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>SKUs</th>
              <th className="num">Price (GBP)</th>
              <th className="num">Net ex VAT</th>
              <th className="num">Unit cost</th>
              <th className="num">Margin</th>
              <th className="num">Sub margin</th>
              <th className="num">MOQ</th>
              <th className="num">MOQ outlay</th>
              <th className="num">Lead</th>
              <th>Supplier &amp; spec</th>
              <th>Compliance</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const e = economics(p);
              return (
                <tr key={p.id}>
                  <td style={{ minWidth: 220 }}>
                    <div className="row" style={{ "--gap": "10px", flexWrap: "nowrap" } as React.CSSProperties}>
                      <span className="line__media" style={{ width: 44, height: 54, padding: 4, background: artBackground(p) }}>
                        <ProductArt product={p} title={false} />
                      </span>
                      <span className="stack-v" style={{ "--gap": "2px" } as React.CSSProperties}>
                        <Link href={`/products/${p.slug}`} style={{ fontWeight: 600 }}>
                          {p.name}
                        </Link>
                        <span className="muted">{p.descriptor}</span>
                        <span className="mono muted" style={{ fontSize: 10 }}>
                          {p.line} · {p.status}
                        </span>
                        {p.evidence && <Evidence grade={p.evidence} compact />}
                      </span>
                    </div>
                  </td>
                  <td style={{ minWidth: 150 }}>
                    <code style={{ fontSize: 11.5, lineHeight: 1.7 }}>
                      {p.variants.map((v) => (
                        <div key={v.id}>{v.sku}</div>
                      ))}
                    </code>
                  </td>
                  <td className="num">{gbp(e.gross)}</td>
                  <td className="num">{gbp(e.net)}</td>
                  <td className="num">{gbp(e.cost)}</td>
                  <td className="num" style={{ fontWeight: 700, color: e.margin < 0.6 ? "#B3261E" : undefined }}>
                    {pct(e.margin)}
                  </td>
                  <td className="num">{p.subscribable ? pct(e.subMargin) : "—"}</td>
                  <td className="num">{p.whiteLabel.moq.toLocaleString("en-GB")}</td>
                  <td className="num">{gbp(e.moqOutlay)}</td>
                  <td className="num">{p.whiteLabel.leadTimeDays}d</td>
                  <td style={{ minWidth: 280 }}>
                    <strong style={{ color: p.whiteLabel.supplier === "TBC" ? "var(--signal)" : undefined }}>
                      {p.whiteLabel.supplier}
                    </strong>
                    <div className="muted" style={{ marginTop: 4 }}>
                      {p.whiteLabel.sourcingSpec}
                    </div>
                  </td>
                  <td style={{ minWidth: 320 }}>
                    <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 4 }}>
                      {p.whiteLabel.compliance.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                    {p.claims.length > 0 && (
                      <p className="muted" style={{ margin: "8px 0 0", fontSize: 12 }}>
                        {p.claims.length} authorised claim{p.claims.length > 1 ? "s" : ""} in use
                      </p>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="muted" style={{ fontSize: 12.5, marginTop: 12 }}>
        Unit costs are planning estimates until replaced with supplier quotes. Margins are calculated on GBP price net of
        20% UK VAT. Subscription margin applies the subscribe &amp; save discount. Rows in red are below 60% gross margin.
      </p>

      <div className="split" style={{ marginTop: 56, alignItems: "start" }}>
        <div className="stack-v">
          <h2 className="h3" style={{ fontSize: "1.6rem" }}>
            White-label a product in four steps
          </h2>
          <ol className="prose" style={{ paddingLeft: 20, margin: 0, fontSize: 15 }}>
            <li>
              Copy an existing record in <code>src/data/products.ts</code> and give it a new <code>id</code> and{" "}
              <code>slug</code>.
            </li>
            <li>Set name, line, prices (GBP/USD/EUR), variants and SKUs. Colours in <code>art</code> drive the label.</li>
            <li>
              Fill in <code>whiteLabel</code>: supplier, spec, MOQ, landed cost, lead time and compliance notes.
            </li>
            <li>
              Run <code>npm run check:catalog</code>. It&apos;s now live on the shop, sellable at checkout, and
              mentionable in the journal as <code>[[your-id]]</code>.
            </li>
          </ol>
        </div>
        <div className="stack-v">
          <h2 className="h3" style={{ fontSize: "1.6rem" }}>
            Launch checklist
          </h2>
          <ol className="prose" style={{ paddingLeft: 20, margin: 0, fontSize: 15 }}>
            {CHECKLIST.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
