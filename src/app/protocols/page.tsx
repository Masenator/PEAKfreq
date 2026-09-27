import type { Metadata } from "next";
import { StackCard } from "@/components/StackCard";
import { stacks } from "@/data/stacks";

export const metadata: Metadata = {
  title: "Protocols",
  description: "Complete, evidence-graded systems for endurance, strength, sleep, heat and daily health.",
};

export default function ProtocolsPage() {
  return (
    <>
      <section className="dark">
        <div className="wrap section" style={{ paddingBottom: "clamp(40px, 6vw, 72px)" }}>
          <span className="eyebrow">Protocols</span>
          <h1 className="display display--xl" style={{ marginTop: 20 }}>
            Stacks,
            <br />
            not guesses.
          </h1>
          <p className="lede muted" style={{ marginTop: 24 }}>
            Each protocol is a complete system for one goal: what to take and wear, and when. Bundles are 10% below
            buying the items separately.
          </p>
        </div>
      </section>
      <section className="section--tight dark" style={{ paddingTop: 0 }}>
        <div className="wrap grid grid--2">
          {stacks.map((s) => (
            <StackCard key={s.id} stack={s} />
          ))}
        </div>
      </section>
    </>
  );
}
