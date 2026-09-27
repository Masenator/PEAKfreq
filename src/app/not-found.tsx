import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="wrap section">
      <span className="eyebrow">404 · Off route</span>
      <h1 className="display display--xl" style={{ marginTop: 20 }}>
        Wrong
        <br />
        <span className="signal">ridge.</span>
      </h1>
      <p className="lede muted" style={{ marginTop: 24 }}>
        This page doesn&apos;t exist. Head back to the trail.
      </p>
      <Link href="/shop" className="btn" style={{ marginTop: 32 }}>
        Shop the range <ArrowRight />
      </Link>
    </section>
  );
}
