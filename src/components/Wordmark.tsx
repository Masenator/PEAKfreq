import { brand } from "@/data/brand";
import { WM_ASPECT, WM_FREQ, WM_GRAD_X, WM_PEAK, WM_PULSE, WM_RIDGE_CLIP, WM_VIEWBOX } from "./wordmark-paths";

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
 * Wordmark shapes for embedding in another SVG. Origin is the baseline at the left of "P";
 * cap height is ~69 units, total width ~447.
 */
export function WordmarkPaths({ id, peak, freq }: { id: string; peak: string; freq?: string }) {
  const f = freq ?? `url(#${id}-g)`;
  return (
    <g>
      <defs>
        {!freq && <WordmarkGradient id={`${id}-g`} />}
        <clipPath id={`${id}-ridge`}>
          <path d={WM_RIDGE_CLIP} />
        </clipPath>
      </defs>
      <path d={WM_PEAK} fill={peak} clipPath={`url(#${id}-ridge)`} />
      <path d={WM_FREQ} fill={f} />
      <path d={WM_PULSE} fill="none" stroke={f} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

/** Standalone wordmark. `peak` colours PEAK; `freq` overrides the gradient on "freq". */
export function Wordmark({
  height = 26,
  id = "wm",
  peak = "currentColor",
  freq,
  className,
  title,
}: {
  height?: number;
  id?: string;
  peak?: string;
  freq?: string;
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
      <WordmarkPaths id={id} peak={peak} freq={freq} />
    </svg>
  );
}
