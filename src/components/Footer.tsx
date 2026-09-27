import Link from "next/link";
import { brand } from "@/data/brand";
import { Logo } from "./Logo";
import { Newsletter } from "./Newsletter";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="newsletter" style={{ paddingBottom: "clamp(48px, 7vw, 88px)" }}>
          <div className="stack-v">
            <span className="eyebrow">Field notes</span>
            <h2 className="display display--md">Research, not hype. Once a fortnight.</h2>
          </div>
          <Newsletter />
        </div>
        <hr className="hr" />
        <div className="footer__cols" style={{ paddingTop: 48 }}>
          <div className="stack-v" style={{ "--gap": "18px" } as React.CSSProperties}>
            <Logo />
            <p className="muted" style={{ maxWidth: 34 + "ch", margin: 0, fontSize: 14.5 }}>
              {brand.mission}
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/shop?category=fuel">Fuel &amp; Hydrate</Link></li>
              <li><Link href="/shop?category=recover">Recover &amp; Build</Link></li>
              <li><Link href="/shop?category=sleep">Sleep</Link></li>
              <li><Link href="/shop?category=apparel">Apparel</Link></li>
              <li><Link href="/shop?category=gear">Kit</Link></li>
            </ul>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              <li><Link href="/protocols">Protocols</Link></li>
              <li><Link href="/science">Evidence library</Link></li>
              <li><Link href="/journal">Journal</Link></li>
              <li><Link href="/about">Our standard</Link></li>
            </ul>
          </div>
          <div>
            <h4>Help</h4>
            <ul>
              <li><Link href="/legal#shipping">Shipping</Link></li>
              <li><Link href="/legal#returns">Returns &amp; repairs</Link></li>
              <li><Link href="/legal#subscriptions">Subscriptions</Link></li>
              <li><a href={`mailto:${brand.supportEmail}`}>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul>
              <li><a href={brand.social.instagram} rel="noopener" target="_blank">Instagram</a></li>
              <li><a href={brand.social.strava} rel="noopener" target="_blank">Strava club</a></li>
              <li><a href={brand.social.youtube} rel="noopener" target="_blank">YouTube</a></li>
            </ul>
          </div>
        </div>
        <p className="footer__disclaimer">
          Food supplements should not be used as a substitute for a varied and balanced diet and a healthy lifestyle.
          Our products are not intended to diagnose, treat, cure or prevent any disease. Consult a qualified healthcare
          professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.
          Evidence grades are our summary of the published research and are not health claims.
        </p>
        <div className="footer__legal">
          <span>
            © {year} {brand.legalEntity}. All rights reserved.
          </span>
          <span className="row" style={{ "--gap": "20px" } as React.CSSProperties}>
            <Link href="/legal#terms">Terms</Link>
            <Link href="/legal#privacy">Privacy</Link>
            <Link href="/legal">Legal</Link>
          </span>
        </div>
      </div>
      <p className="footer__giant" aria-hidden="true">
        {brand.wordmark.strong}
        <span>{brand.wordmark.light}</span>
      </p>
    </footer>
  );
}
