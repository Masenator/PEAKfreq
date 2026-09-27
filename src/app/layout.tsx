import type { Metadata, Viewport } from "next";
import { Archivo, Inter, JetBrains_Mono } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/components/StoreProvider";
import { brand } from "@/data/brand";
import { formatMoney } from "@/lib/pricing";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono-jb", weight: ["400", "500", "700"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} · ${brand.tagline}`,
    template: `%s · ${brand.name}`,
  },
  description: brand.mission,
  openGraph: {
    type: "website",
    siteName: brand.name,
    title: `${brand.name} · ${brand.tagline}`,
    description: brand.mission,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: brand.colors.ink,
  width: "device-width",
  initialScale: 1,
};

const ANNOUNCEMENTS = [
  `Free shipping over ${brand.currencies.map((c) => formatMoney(brand.freeShippingThreshold[c], c)).join(" / ")}`,
  `Subscribe & save ${Math.round(brand.subscriptionDiscount * 100)}%`,
  "Every product evidence-graded A, B or C",
  "Dose disclosed. No proprietary blends",
  "Free repairs on outerwear for life",
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <StoreProvider>
          <a href="#main" className="skip">
            Skip to content
          </a>
          <div className="announce" aria-label="Announcements">
            <div className="announce__track">
              {[...ANNOUNCEMENTS, ...ANNOUNCEMENTS].map((a, i) => (
                <span key={i} aria-hidden={i >= ANNOUNCEMENTS.length}>
                  {a}
                </span>
              ))}
            </div>
          </div>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </StoreProvider>
      </body>
    </html>
  );
}
