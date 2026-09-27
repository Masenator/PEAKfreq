import { brand } from "@/data/brand";
import type { Product } from "@/data/types";
import { MARK_W, MarkGradient, MarkPaths } from "./LogoMark";

/**
 * Generated label art. Renders packaging or a garment silhouette from catalog
 * data (name, line, colours), so a white-label change to a product updates
 * its artwork everywhere. Set `product.image` to use a real photo instead.
 */

const DISPLAY = { fontFamily: "var(--font-display)", fontVariationSettings: "'wdth' 72", fontWeight: 800 } as const;
const MONO = { fontFamily: "var(--font-mono)", letterSpacing: "0.12em" } as const;

function fit(text: string, width: number, max: number) {
  return Math.min(max, width / (text.length * 0.5));
}

function Wordmark({ x, y, size, fill, anchor = "middle" }: { x: number; y: number; size: number; fill: string; anchor?: "middle" | "start" }) {
  return (
    <text x={x} y={y} fill={fill} textAnchor={anchor} style={{ fontFamily: "var(--font-display)", fontSize: size }}>
      <tspan style={{ fontWeight: 900, fontVariationSettings: "'wdth' 75" }}>{brand.wordmark.strong}</tspan>
      <tspan style={{ fontWeight: 300 }}>{brand.wordmark.light}</tspan>
    </text>
  );
}

/** Brand mark placed on packaging or garments. `color` = single colour (deboss); omit for the gradient (embroidery). */
function PeakMark({ x, y, w, color, gradientId }: { x: number; y: number; w: number; color?: string; gradientId?: string }) {
  const s = w / MARK_W;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <MarkPaths stroke={color ?? `url(#${gradientId})`} strokeWidth={Math.min(8, 2.4 / s)} />
    </g>
  );
}

function Label({ p, cx, top, width }: { p: Product; cx: number; top: number; width: number }) {
  const { ink, accent } = p.art;
  const nameSize = fit(p.name, width, 62);
  return (
    <g>
      <text x={cx} y={top} textAnchor="middle" fill={ink} style={{ ...MONO, fontSize: 11 }} opacity={0.85}>
        {p.line}
      </text>
      <PeakMark x={cx - 22} y={top + 14} w={44} color={accent} />
      <text x={cx} y={top + 54 + nameSize * 0.72} textAnchor="middle" fill={ink} style={{ ...DISPLAY, fontSize: nameSize }}>
        {p.name.toUpperCase()}
      </text>
      <text
        x={cx}
        y={top + 78 + nameSize * 0.72}
        textAnchor="middle"
        fill={ink}
        style={{ fontFamily: "var(--font-body)", fontSize: 11.5, fontWeight: 500 }}
        opacity={0.85}
      >
        {p.descriptor}
      </text>
    </g>
  );
}

function Shadow({ cx, y, rx }: { cx: number; y: number; rx: number }) {
  return <ellipse cx={cx} cy={y} rx={rx} ry={10} fill="#000" opacity={0.16} />;
}

function Sheen({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
      <stop offset="0.18" stopColor="#fff" stopOpacity="0.05" />
      <stop offset="0.7" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#000" stopOpacity="0.2" />
    </linearGradient>
  );
}

export function ProductArt({ product, className, title = true }: { product: Product; className?: string; title?: boolean }) {
  const p = product;
  if (p.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={p.image} alt={`${p.name} ${p.descriptor}`} className={className} />;
  }
  const { color, ink, accent } = p.art;
  const sheen = `sheen-${p.id}`;
  const label = `${p.name} ${p.descriptor}`;

  const svg = (children: React.ReactNode) => (
    <svg viewBox="0 0 400 500" className={className} role="img" aria-label={title ? label : undefined} aria-hidden={title ? undefined : true}>
      <defs>
        <Sheen id={sheen} />
        <MarkGradient id={`mark-${p.id}`} />
      </defs>
      {children}
    </svg>
  );

  switch (p.art.format) {
    case "pouch":
      return svg(
        <>
          <Shadow cx={200} y={462} rx={130} />
          <path d="M82 70 Q200 58 318 70 L330 440 Q200 470 70 440 Z" fill={color} />
          <path d="M82 70 Q200 58 318 70 L320 108 Q200 96 80 108 Z" fill="#000" opacity={0.14} />
          <path d="M92 84 H308" stroke="#000" strokeOpacity={0.18} strokeDasharray="3 5" />
          <path d="M82 70 Q200 58 318 70 L330 440 Q200 470 70 440 Z" fill={`url(#${sheen})`} />
          <Label p={p} cx={200} top={150} width={220} />
          <line x1={120} x2={280} y1={360} y2={360} stroke={ink} strokeOpacity={0.35} />
          <text x={200} y={384} textAnchor="middle" fill={ink} style={{ ...MONO, fontSize: 10 }} opacity={0.8}>
            {p.size.toUpperCase()}
          </text>
          <Wordmark x={200} y={420} size={20} fill={ink} />
        </>,
      );
    case "tub":
      return svg(
        <>
          <Shadow cx={200} y={462} rx={140} />
          <rect x={68} y={96} width={264} height={356} rx={22} fill={color} />
          <rect x={68} y={96} width={264} height={356} rx={22} fill={`url(#${sheen})`} />
          <rect x={60} y={50} width={280} height={64} rx={10} fill={ink === "#F3F1EC" ? "#111" : "#0E0F0F"} />
          {Array.from({ length: 22 }).map((_, i) => (
            <line key={i} x1={72 + i * 12} x2={72 + i * 12} y1={56} y2={108} stroke="#fff" strokeOpacity={0.08} />
          ))}
          <rect x={60} y={50} width={280} height={64} rx={10} fill={`url(#${sheen})`} />
          <Label p={p} cx={200} top={160} width={230} />
          <rect x={68} y={380} width={264} height={30} fill={accent} opacity={0.9} />
          <text x={200} y={400} textAnchor="middle" fill={color} style={{ ...MONO, fontSize: 10 }}>
            {p.size.toUpperCase()}
          </text>
          <Wordmark x={200} y={438} size={18} fill={ink} />
        </>,
      );
    case "bottle":
      return svg(
        <>
          <Shadow cx={200} y={462} rx={110} />
          <rect x={138} y={40} width={124} height={62} rx={8} fill="#0E0F0F" />
          {Array.from({ length: 14 }).map((_, i) => (
            <line key={i} x1={146 + i * 8.4} x2={146 + i * 8.4} y1={46} y2={96} stroke="#fff" strokeOpacity={0.1} />
          ))}
          <path d="M150 100 H250 V118 Q300 126 300 170 V428 Q300 452 276 452 H124 Q100 452 100 428 V170 Q100 126 150 118 Z" fill={color} />
          <path d="M150 100 H250 V118 Q300 126 300 170 V428 Q300 452 276 452 H124 Q100 452 100 428 V170 Q100 126 150 118 Z" fill={`url(#${sheen})`} />
          <Label p={p} cx={200} top={190} width={170} />
          <line x1={130} x2={270} y1={376} y2={376} stroke={ink} strokeOpacity={0.35} />
          <text x={200} y={396} textAnchor="middle" fill={ink} style={{ ...MONO, fontSize: 9.5 }} opacity={0.8}>
            {p.size.toUpperCase()}
          </text>
          <Wordmark x={200} y={430} size={17} fill={ink} />
        </>,
      );
    case "sticks":
      return svg(
        <>
          <Shadow cx={200} y={462} rx={140} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${118 + i * 44} ${40 + (i % 2) * 14}) rotate(${-6 + i * 4})`}>
              <rect width={34} height={130} rx={4} fill={i % 2 ? accent : color} stroke="#000" strokeOpacity={0.1} />
              <rect width={34} height={14} fill="#000" opacity={0.15} />
            </g>
          ))}
          <path d="M70 140 L330 140 L330 452 L70 452 Z" fill={color} />
          <path d="M70 140 L330 140 L330 176 L70 176 Z" fill="#000" opacity={0.1} />
          <path d="M70 140 L330 140 L330 452 L70 452 Z" fill={`url(#${sheen})`} />
          <Label p={p} cx={200} top={214} width={220} />
          <text x={200} y={395} textAnchor="middle" fill={ink} style={{ ...MONO, fontSize: 10 }} opacity={0.8}>
            {p.size.toUpperCase()}
          </text>
          <Wordmark x={200} y={432} size={19} fill={ink} />
        </>,
      );
    case "liquid":
      return svg(
        <>
          <Shadow cx={200} y={462} rx={100} />
          <rect x={170} y={30} width={60} height={42} rx={6} fill="#0E0F0F" />
          <path d="M176 72 H224 V120 Q290 150 290 210 V430 Q290 452 268 452 H132 Q110 452 110 430 V210 Q110 150 176 120 Z" fill={color} />
          <path d="M176 72 H224 V120 Q290 150 290 210 V430 Q290 452 268 452 H132 Q110 452 110 430 V210 Q110 150 176 120 Z" fill={`url(#${sheen})`} />
          <rect x={110} y={220} width={180} height={190} fill={p.art.ink === "#F3F1EC" ? "#F3F1EC" : "#0E0F0F"} opacity={0.08} />
          <Label p={p} cx={200} top={240} width={150} />
          <Wordmark x={200} y={434} size={16} fill={ink} />
        </>,
      );
    case "tee":
    case "longsleeve":
    case "jacket": {
      const long = p.art.format !== "tee";
      const body = long
        ? "M140 70 L104 82 L72 112 L44 300 L34 424 L78 430 L98 304 L114 204 L114 446 L286 446 L286 204 L302 304 L322 430 L366 424 L356 300 L328 112 L296 82 L260 70 C250 96 226 110 200 110 C174 110 150 96 140 70 Z"
        : "M140 70 L104 82 L40 134 L72 206 L112 186 L112 446 L288 446 L288 186 L328 206 L360 134 L296 82 L260 70 C250 96 226 110 200 110 C174 110 150 96 140 70 Z";
      return svg(
        <>
          <Shadow cx={200} y={466} rx={120} />
          {p.art.format === "jacket" && (
            <>
              <path d="M136 80 C128 14 272 14 264 80 L252 96 C240 104 222 110 200 110 C178 110 160 104 148 96 Z" fill={color} />
              <path d="M136 80 C128 14 272 14 264 80 L252 96 C240 104 222 110 200 110 C178 110 160 104 148 96 Z" fill={`url(#${sheen})`} />
              <path d="M160 86 C156 40 244 40 240 86 C230 100 216 106 200 106 C184 106 170 100 160 86 Z" fill="#000" opacity={0.45} />
              <path d="M136 80 C128 14 272 14 264 80" fill="none" stroke={accent} strokeOpacity={0.9} strokeWidth={2.5} />
            </>
          )}
          <path d={body} fill={color} />
          <path d={body} fill={`url(#${sheen})`} />
          <path d="M140 70 C150 96 174 110 200 110 C226 110 250 96 260 70" fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={2} />
          {p.art.format === "jacket" && (
            <>
              <line x1={200} y1={108} x2={200} y2={446} stroke="#000" strokeOpacity={0.45} strokeWidth={2} />
              <rect x={214} y={150} width={50} height={6} rx={3} fill={accent} />
            </>
          )}
          <PeakMark x={p.art.format === "jacket" ? 146 : 176} y={146} w={44} gradientId={`mark-${p.id}`} />
          <text
            x={200}
            y={410}
            textAnchor="middle"
            fill={ink}
            style={{ ...MONO, fontSize: 11 }}
            opacity={0.55}
          >
            {p.name.toUpperCase()}
          </text>
        </>,
      );
    }
    case "tights":
      return svg(
        <>
          <Shadow cx={200} y={470} rx={110} />
          <path d="M120 52 H280 L292 210 L270 460 H222 L206 226 H194 L178 460 H130 L108 210 Z" fill={color} />
          <path d="M120 52 H280 L292 210 L270 460 H222 L206 226 H194 L178 460 H130 L108 210 Z" fill={`url(#${sheen})`} />
          <rect x={120} y={52} width={160} height={26} fill="#000" opacity={0.25} />
          <path d="M112 260 L128 440" stroke={accent} strokeWidth={4} />
          <path d="M288 260 L272 440" stroke={accent} strokeWidth={4} opacity={0.4} />
          <PeakMark x={136} y={96} w={38} gradientId={`mark-${p.id}`} />
          <text x={200} y={70} textAnchor="middle" fill={ink} style={{ ...MONO, fontSize: 10 }} opacity={0.6}>
            {brand.name.toUpperCase()}
          </text>
        </>,
      );
    case "socks":
      return svg(
        <>
          <Shadow cx={210} y={466} rx={130} />
          {[{ dx: 50, o: 0.55 }, { dx: 0, o: 1 }].map(({ dx, o }, i) => (
            <g key={i} transform={`translate(${dx} ${i ? 0 : -14})`} opacity={o}>
              <path d="M130 50 H210 V318 L282 382 C308 404 298 452 262 452 H168 C142 452 130 434 130 404 Z" fill={color} />
              <path d="M130 50 H210 V318 L282 382 C308 404 298 452 262 452 H168 C142 452 130 434 130 404 Z" fill={`url(#${sheen})`} />
              <rect x={130} y={50} width={80} height={36} fill="#000" opacity={0.25} />
              <rect x={130} y={96} width={80} height={6} fill={accent} />
              <path d="M242 452 C262 452 292 440 282 400" fill="none" stroke={accent} strokeWidth={10} opacity={0.9} />
            </g>
          ))}
        </>,
      );
    case "vest":
      return svg(
        <>
          <Shadow cx={200} y={466} rx={120} />
          <path d="M128 56 H168 C174 92 226 92 232 56 H272 L304 150 V446 H96 V150 Z" fill={color} />
          <path d="M128 56 H168 C174 92 226 92 232 56 H272 L304 150 V446 H96 V150 Z" fill={`url(#${sheen})`} />
          {[0, 1, 2].map((r) =>
            [0, 1].map((c) => (
              <rect key={`${r}${c}`} x={116 + c * 90} y={170 + r * 88} width={78} height={74} rx={10} fill="#fff" opacity={0.35} stroke="#000" strokeOpacity={0.15} />
            )),
          )}
          <line x1={200} y1={90} x2={200} y2={446} stroke="#000" strokeOpacity={0.4} strokeWidth={2} />
          <PeakMark x={120} y={118} w={36} color={ink} />
        </>,
      );
    case "glasses":
      return svg(
        <>
          <defs>
            <linearGradient id={`lens-${p.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#F7B64A" />
              <stop offset="1" stopColor="#E0741C" />
            </linearGradient>
          </defs>
          <Shadow cx={200} y={380} rx={150} />
          <path d="M40 200 L20 186" stroke={color} strokeWidth={10} strokeLinecap="round" />
          <path d="M360 200 L380 186" stroke={color} strokeWidth={10} strokeLinecap="round" />
          <rect x={40} y={190} width={146} height={110} rx={34} fill={`url(#lens-${p.id})`} stroke={color} strokeWidth={12} />
          <rect x={214} y={190} width={146} height={110} rx={34} fill={`url(#lens-${p.id})`} stroke={color} strokeWidth={12} />
          <path d="M186 214 Q200 200 214 214" fill="none" stroke={color} strokeWidth={10} />
          <path d="M62 210 L100 250" stroke="#fff" strokeOpacity={0.45} strokeWidth={6} strokeLinecap="round" />
          <path d="M236 210 L274 250" stroke="#fff" strokeOpacity={0.45} strokeWidth={6} strokeLinecap="round" />
          <Wordmark x={200} y={352} size={22} fill="#0E0F0F" />
        </>,
      );
    case "bands":
      return svg(
        <>
          <Shadow cx={200} y={452} rx={140} />
          <g transform="rotate(-10 200 200)">
            <rect x={70} y={120} width={260} height={64} rx={12} fill={color} />
            <rect x={70} y={120} width={260} height={64} rx={12} fill={`url(#${sheen})`} />
            <rect x={70} y={120} width={60} height={64} rx={12} fill={accent} />
            <text x={220} y={160} textAnchor="middle" fill={ink} style={{ ...MONO, fontSize: 12 }}>
              {p.name.toUpperCase()}
            </text>
          </g>
          <g transform="rotate(6 200 300)">
            <rect x={70} y={260} width={260} height={64} rx={12} fill={color} opacity={0.9} />
            <rect x={70} y={260} width={60} height={64} rx={12} fill={accent} />
          </g>
          <path d="M200 330 C200 370 250 360 262 392" stroke="#0E0F0F" strokeWidth={5} fill="none" />
          <circle cx={290} cy={410} r={42} fill="#F3F1EC" stroke="#0E0F0F" strokeWidth={6} />
          <path d="M290 410 L312 392" stroke={accent} strokeWidth={4} strokeLinecap="round" />
          <circle cx={290} cy={410} r={4} fill="#0E0F0F" />
        </>,
      );
  }
}

/** Tinted background for the art stage, derived from the product colour. */
export function artBackground(p: Product): string {
  return `color-mix(in srgb, ${p.art.color} 16%, var(--sand))`;
}
