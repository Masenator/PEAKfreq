import type { Metadata } from "next";
import { brand } from "@/data/brand";
import { formatMoney } from "@/lib/pricing";

export const metadata: Metadata = { title: "Legal & policies" };

/*
 * TEMPLATE COPY. Have these policies reviewed by a solicitor before launch.
 */
export default function LegalPage() {
  const pct = Math.round(brand.subscriptionDiscount * 100);
  const threshold = brand.currencies.map((c) => formatMoney(brand.freeShippingThreshold[c], c)).join(" / ");
  return (
    <section className="wrap section">
      <span className="eyebrow">Legal &amp; policies</span>
      <h1 className="display display--lg" style={{ marginTop: 18, marginBottom: 40 }}>
        The small print, written plainly.
      </h1>
      <div className="prose">
        <h2 id="shipping">Shipping</h2>
        <p>
          Free standard shipping on orders over {threshold}. Orders placed before 2pm on a working day ship the same day.
          We ship to the UK, EU, North America, Australia and New Zealand.
        </p>
        <h2 id="returns">Returns &amp; repairs</h2>
        <p>
          Apparel and kit can be returned unworn within 60 days. For hygiene and safety reasons, opened supplements can&apos;t
          be returned unless faulty. Outerwear is repaired free for the life of the garment; contact{" "}
          <a href={`mailto:${brand.supportEmail}`}>{brand.supportEmail}</a> to start a repair.
        </p>
        <h2 id="subscriptions">Subscriptions</h2>
        <p>
          Subscribe &amp; save gives you {pct}% off every delivery. Subscriptions renew monthly until you cancel. You can
          skip, swap or cancel any time before your next renewal date, with no fees.
        </p>
        <h2 id="supplements">Supplement information</h2>
        <p>
          Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle. Do
          not exceed the recommended daily dose. Keep out of reach of young children. Consult a healthcare professional
          before use if you are pregnant, breastfeeding, taking medication, or have a medical condition. Evidence grades
          summarise published research and are not health claims.
        </p>
        <h2 id="terms">Terms of sale</h2>
        <p>
          {brand.legalEntity} sells products through this website. Prices include VAT where applicable. Import duties for
          orders outside the UK may apply. Full terms to be provided.
        </p>
        <h2 id="privacy">Privacy</h2>
        <p>
          We collect only what we need to fulfil your order and, with your consent, to send you our newsletter. We never
          sell your data. Payments are processed by our payment provider; we never see or store your card details. Full
          privacy policy to be provided.
        </p>
      </div>
    </section>
  );
}
