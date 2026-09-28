import { brand } from "@/data/brand";
import { WM_ASPECT, WM_FREQ, WM_GRAD_X, WM_PEAK, WM_PULSE, WM_VIEWBOX } from "./wordmark-paths";

/** Outline widths in wordmark units (cap height ≈ 69). */
const WHITE = 8;
const OUTER = 14;
const PULSE_W = 4.2;

/** Gradient for "freq" and its pulse, in wordmark coordinates. */
export function WordmarkGradient({ id }: { id: string }) {
  const [c0, , c2, c3] = brand.logoGradient;
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={WM_GRAD_X[0]} x2={WM_GRAD_X[1]} y1={0} y2={0}>
      <stop offset="0" stopColor={c0} />
      <stop offset="0.45" stopColor={c2} />
      <stop offset="1" stopColor={c3} />
    </linearGradient>
  );
}

/**
 * Wordmark shapes for embedding in another SVG. Origin is the baseline at the left of "P".
 * Full colour: black PEAK with a white outline and green outer line; gradient freq whose
 * pulse carries on from the tail of the q.
 * Pass `mono` for single-colour use (packaging).
 */
export function WordmarkPaths({ id, mono }: { id: string; mono?: string }) {
  if (mono) {
    return (
      <g>
        <path d={WM_PEAK} fill={mono} />
        <path d={WM_FREQ} fill={mono} />
        <path d={WM_PULSE} fill="none" stroke={mono} strokeWidth={PULSE_W} strokeLinejoin="round" strokeLinecap="round" />
      </g>
    );
  }
  const grad = `url(#${id}-g)`;
  return (
    <g>
      <defs>
        <WordmarkGradient id={`${id}-g`} />
      </defs>
      <path d={WM_PEAK} fill="none" stroke={brand.logoGradient[0]} strokeWidth={OUTER} strokeLinejoin="round" />
      <path d={WM_PEAK} fill="none" stroke="#FFFFFF" strokeWidth={WHITE} strokeLinejoin="round" />
      <path d={WM_PEAK} fill="#0E0F0F" />
      <path d={WM_FREQ} fill={grad} />
      <path d={WM_PULSE} fill="none" stroke={grad} strokeWidth={PULSE_W} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

/** Standalone wordmark. */
export function Wordmark({
  height = 26,
  id = "wm",
  mono,
  className,
  title,
}: {
  height?: number;
  id?: string;
  mono?: string;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      height={height}
      width={height * WM_ASPECT}
      viewBox={WM_VIEWBOX}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <WordmarkPaths id={id} mono={mono} />
    </svg>
  );
}
