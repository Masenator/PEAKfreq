import { brand } from "@/data/brand";

/**
 * The PEAKfreq mark: a mountain outline whose base is a pulse waveform.
 * Vector trace of the brand logo. Drawn as two strokes in a 126 × 76 box.
 */
export const MARK_W = 126;
export const MARK_H = 76;
const MOUNTAIN = "M1 58 L48 14 L46.5 26 L75 2.5 L89 32";
const WAVE =
  "M1 58 C10 54 16 50 22 50 C28 50 30 53 36 52 C44 50 52 38 57 38.5 C62 39 64 69.5 69 69.5 C74 69.5 84 32 89 32 C94 32 99 62 103 62 C106 62 106 55 110 55 L119 56";

/** Gradient definition, in mark coordinates so both strokes share one sweep. */
export function MarkGradient({ id }: { id: string }) {
  const stops = brand.logoGradient;
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={-3} y1={0} x2={123} y2={0}>
      {stops.map((c, i) => (
        <stop key={i} offset={[0, 0.35, 0.5, 0.62][i] ?? i / (stops.length - 1)} stopColor={c} />
      ))}
    </linearGradient>
  );
}

/** The mark's strokes, for embedding inside another SVG (origin at the mark's top-left). */
export function MarkPaths({ stroke, strokeWidth = 4.4 }: { stroke: string; strokeWidth?: number }) {
  return (
    <g transform="translate(3 3)" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={MOUNTAIN} />
      <path d={WAVE} />
    </g>
  );
}

/** Standalone mark. `color` makes it single-colour; otherwise it uses the brand gradient. */
export function LogoMark({ height = 24, color, id = "pf-mark", strokeWidth }: { height?: number; color?: string; id?: string; strokeWidth?: number }) {
  return (
    <svg width={(height * MARK_W) / MARK_H} height={height} viewBox={`0 0 ${MARK_W} ${MARK_H}`} aria-hidden="true">
      {!color && (
        <defs>
          <MarkGradient id={id} />
        </defs>
      )}
      <MarkPaths stroke={color ?? `url(#${id})`} strokeWidth={strokeWidth} />
    </svg>
  );
}
