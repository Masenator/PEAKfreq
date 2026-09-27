"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/data/brand";
import type { Currency } from "@/data/types";
import { Bag, Close, Menu } from "./icons";
import { Logo } from "./Logo";
import { useStore } from "./StoreProvider";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/protocols", label: "Protocols" },
  { href: "/science", label: "Science" },
  { href: "/journal", label: "Journal" },
  { href: "/about", label: "About" },
];

export function CurrencySelect({ className = "currency" }: { className?: string }) {
  const { currency, setCurrency } = useStore();
  return (
    <label>
      <span className="sr-only">Currency</span>
      <select className={className} value={currency} onChange={(e) => setCurrency(e.target.value as Currency)}>
        {brand.currencies.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Header() {
  const pathname = usePathname();
  const { cart, setDrawerOpen } = useStore();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header className="header">
        <div className="wrap header__inner">
          <nav className="header__nav" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} aria-current={pathname.startsWith(n.href) ? "page" : undefined}>
                {n.label}
              </Link>
            ))}
          </nav>
          <button className="icon-btn menu-btn" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <Link href="/" aria-label={`${brand.name} home`} className="logo">
            <Logo />
          </Link>
          <div className="header__actions">
            <CurrencySelect />
            <button className="icon-btn" aria-label={`Open bag, ${cart.count} items`} onClick={() => setDrawerOpen(true)}>
              <Bag />
              {cart.count > 0 && <span className="cart-count">{cart.count}</span>}
            </button>
          </div>
        </div>
      </header>

      <div className="mobile-nav" data-open={open} aria-hidden={!open}>
        <div className="row between">
          <Logo />
          <button className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)} style={{ color: "var(--bone)" }}>
            <Close />
          </button>
        </div>
        <nav className="mobile-nav__links" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} tabIndex={open ? 0 : -1}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div style={{ marginTop: "auto" }} className="row between">
          <span className="mono" style={{ color: "var(--mute-inv)" }}>
            Currency
          </span>
          <CurrencySelect className="currency" />
        </div>
      </div>
    </>
  );
}
