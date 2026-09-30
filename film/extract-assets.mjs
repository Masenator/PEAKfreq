/**
 * Rebuilds film/assets.json from the live site and the brand source files, so the
 * film always uses the current packaging art, summit scene, wordmark and logo mark.
 *
 *   npm run build && npm start            # site on http://localhost:3000
 *   node film/extract-assets.mjs          # SITE_URL=... to point elsewhere
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const SITE = process.env.SITE_URL ?? "http://localhost:3000";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(`${SITE}/shop`, { waitUntil: "networkidle" });
const products = await page.evaluate(() => {
  const out = {};
  for (const card of document.querySelectorAll("article.card")) {
    const a = card.querySelector("a.card__link");
    const svg = card.querySelector(".card__media svg");
    if (!a || !svg) continue;
    out[a.getAttribute("href").split("/").pop()] = { svg: svg.outerHTML, name: a.textContent.trim() };
  }
  return out;
});
await browser.close();

const src = (f) => readFileSync(join(ROOT, f), "utf8");
const str = (code, name) => JSON.parse(code.match(new RegExp(`export const ${name} = ("(?:[^"\\\\]|\\\\.)*")`))[1]);
const scene = src("src/components/summit-scene.ts");
const wm = src("src/components/wordmark-paths.ts");
const mark = src("src/components/LogoMark.tsx");

const assets = {
  products,
  summit: {
    trail: str(scene, "SUMMIT_TRAIL"),
    defs: str(scene, "SUMMIT_DEFS"),
    land: str(scene, "SUMMIT_LAND"),
    front: str(scene, "SUMMIT_FRONT"),
    apex: JSON.parse(scene.match(/SUMMIT_APEX = (\{[^}]*\})/)[1].replace(/(\w+):/g, '"$1":')),
  },
  wordmark: {
    viewBox: str(wm, "WM_VIEWBOX"),
    peak: str(wm, "WM_PEAK"),
    freq: str(wm, "WM_FREQ"),
    pulse: str(wm, "WM_PULSE"),
    gradX: JSON.parse(wm.match(/WM_GRAD_X = (\[[^\]]*\])/)[1]),
  },
  mark: {
    mountain: mark.match(/const MOUNTAIN = "([^"]+)"/)[1],
    wave: mark.match(/const WAVE =\s*"([^"]+)"/)[1],
  },
};
writeFileSync(join(HERE, "assets.json"), JSON.stringify(assets));
console.log(`assets.json: ${Object.keys(products).length} products`);
