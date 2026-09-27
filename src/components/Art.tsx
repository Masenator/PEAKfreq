/**
 * Procedural brand art. Everything is deterministic SVG (no photography
 * dependencies), so pages render crisp at any size and in any market.
 */

function noise(x: number, seed: number) {
  return (
    Math.sin(x * 0.0061 + seed) * 0.5 +
    Math.sin(x * 0.0137 + seed * 2.1) * 0.28 +
    Math.sin(x * 0.031 + seed * 3.7) * 0.14 +
    Math.sin(x * 0.071 + seed * 5.3) * 0.08
  );
}

function ridge(opts: { baseY: number; amp: number; seed: number; peakX: number; peakH: number; peakW: number; w: number; h: number }) {
  const { baseY, amp, seed, peakX, peakH, peakW, w, h } = opts;
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 16) {
    const g = Math.exp(-(((x - peakX) / peakW) ** 2));
    // Sharpen the summit into a ridge rather than a dome.
    const sharp = Math.exp(-Math.abs((x - peakX) / (peakW * 0.55)) * 1.4);
    const y = baseY - amp * noise(x, seed) - peakH * (0.45 * g + 0.55 * sharp);
    pts.push(`${x},${y.toFixed(1)}`);
  }
  return `M0,${h} L${pts.join(" L")} L${w},${h} Z`;
}

export function HeroArt() {
  const W = 1600;
  const H = 1000;
  const peakX = 1010;
  const summitY = 250;
  const layers = [
    { baseY: 640, amp: 50, seed: 1.3, peakH: 300, peakW: 260, fill: "#1b1e20" },
    { baseY: 720, amp: 60, seed: 4.2, peakH: 150, peakW: 340, fill: "#15181a", shift: -380 },
    { baseY: 800, amp: 46, seed: 2.7, peakH: 90, peakW: 420, fill: "#101213", shift: 260 },
    { baseY: 900, amp: 30, seed: 7.9, peakH: 40, peakW: 500, fill: "#0b0c0d", shift: -120 },
  ];
  const baseline = 690;
  const pulse = [
    `M0 ${baseline}`,
    `L${peakX - 250} ${baseline}`,
    `L${peakX - 200} ${baseline - 26}`,
    `L${peakX - 160} ${baseline + 18}`,
    `L${peakX - 110} ${baseline}`,
    `L${peakX - 60} ${baseline}`,
    `L${peakX} ${summitY}`,
    `L${peakX + 62} ${baseline + 150}`,
    `L${peakX + 110} ${baseline - 30}`,
    `L${peakX + 150} ${baseline}`,
    `L${W} ${baseline}`,
  ].join(" ");

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id="glow" cx={peakX / W} cy={0.3} r="0.55">
          <stop offset="0" stopColor="#FF5B24" stopOpacity="0.55" />
          <stop offset="0.35" stopColor="#FF5B24" stopOpacity="0.14" />
          <stop offset="1" stopColor="#0E0F0F" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0E0F0F" />
          <stop offset="1" stopColor="#141617" />
        </linearGradient>
        <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0.55" stopColor="#0E0F0F" stopOpacity="0" />
          <stop offset="1" stopColor="#0E0F0F" stopOpacity="0.95" />
        </linearGradient>
        <filter id="blur">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <rect width={W} height={H} fill="url(#sky)" />
      <rect width={W} height={H} fill="url(#glow)" />
      <g className="topo" opacity="0.18">
        {Array.from({ length: 9 }).map((_, i) => (
          <path
            key={i}
            d={ridge({ baseY: 380 + i * 34, amp: 40 + i * 4, seed: 0.6 + i * 0.35, peakX: peakX + 40, peakH: 180 - i * 12, peakW: 300 + i * 20, w: W, h: H })}
            fill="none"
            stroke="#F3F1EC"
            strokeWidth="0.8"
          />
        ))}
      </g>
      {layers.map((l, i) => (
        <path key={i} d={ridge({ ...l, peakX: peakX + (l.shift ?? 0), w: W, h: H })} fill={l.fill} />
      ))}
      <path d={pulse} fill="none" stroke="#FF5B24" strokeWidth="10" opacity="0.35" filter="url(#blur)" className="pulse-line" />
      <path d={pulse} fill="none" stroke="#FF5B24" strokeWidth="3" strokeLinejoin="round" className="pulse-line" />
      <circle cx={peakX} cy={summitY} r="6" fill="#FF5B24" />
      <circle cx={peakX} cy={summitY} r="16" fill="none" stroke="#FF5B24" strokeOpacity="0.5" />
      <rect width={W} height={H} fill="url(#fade)" />
    </svg>
  );
}

/** Small signature waveforms for each of the five frequencies. */
export function Wave({ kind, className }: { kind: string; className?: string }) {
  const W = 240;
  const H = 56;
  const mid = H / 2;
  let d = "";
  const sine = (cycles: number, amp: number) => {
    const pts: string[] = [];
    for (let x = 0; x <= W; x += 2) pts.push(`${x},${(mid - Math.sin((x / W) * Math.PI * 2 * cycles) * amp).toFixed(1)}`);
    return `M${pts.join(" L")}`;
  };
  switch (kind) {
    case "cadence": {
      const step = W / 8;
      d = `M0 ${mid}`;
      for (let i = 0; i < 8; i++) d += ` L${i * step + step * 0.2} ${mid} L${i * step + step * 0.35} ${mid - 20} L${i * step + step * 0.5} ${mid + 8} L${(i + 1) * step} ${mid}`;
      break;
    }
    case "cellular":
      d = sine(2, 20);
      break;
    case "circadian":
      d = sine(1, 22);
      break;
    case "neural":
      d = sine(14, 12);
      break;
    case "cardiac":
      d = `M0 ${mid}`;
      for (let i = 0; i < 3; i++) {
        const o = i * 80;
        d += ` L${o + 30} ${mid} L${o + 36} ${mid - 6} L${o + 42} ${mid} L${o + 48} ${mid + 6} L${o + 54} 2 L${o + 60} ${H - 4} L${o + 66} ${mid} L${o + 80} ${mid}`;
      }
      break;
    default:
      d = sine(3, 16);
  }
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} preserveAspectRatio="none" aria-hidden="true" style={{ width: "100%", height: "100%" }}>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Topographic contour composition used for editorial imagery. */
export function Topo({ color, seed = 1, ink = "#0E0F0F", label }: { color: string; seed?: number; ink?: string; label?: string }) {
  const W = 800;
  const H = 600;
  const cx = 420 + Math.sin(seed * 3) * 120;
  const cy = 300 + Math.cos(seed * 2) * 80;
  const rings = Array.from({ length: 16 }).map((_, i) => {
    const r = 24 + i * 34;
    const pts: string[] = [];
    for (let a = 0; a <= 360; a += 6) {
      const t = (a * Math.PI) / 180;
      const rr = r * (1 + 0.16 * Math.sin(t * 3 + seed + i * 0.2) + 0.08 * Math.sin(t * 5 + seed * 2));
      pts.push(`${(cx + Math.cos(t) * rr * 1.25).toFixed(1)},${(cy + Math.sin(t) * rr).toFixed(1)}`);
    }
    return `M${pts.join(" L")} Z`;
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      <rect width={W} height={H} fill={color} />
      {rings.map((d, i) => (
        <path key={i} d={d} fill="none" stroke={ink} strokeOpacity={i % 4 === 0 ? 0.5 : 0.2} strokeWidth={i % 4 === 0 ? 1.6 : 1} />
      ))}
      <circle cx={cx} cy={cy} r={6} fill={ink} />
    </svg>
  );
}
