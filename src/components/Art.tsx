/**
 * Procedural brand art. Everything is deterministic SVG (no photography
 * dependencies), so pages render crisp at any size and in any market.
 */

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
