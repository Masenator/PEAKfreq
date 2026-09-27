import { brand } from "@/data/brand";

export function PeakIcon({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.5} viewBox="0 0 64 32" aria-hidden="true">
      <path
        d="M0 22 H14 L20 14 L26 28 L34 2 L42 30 L48 18 L52 22 H64"
        fill="none"
        stroke={color}
        strokeWidth={3.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ accent = "var(--signal)" }: { accent?: string }) {
  return (
    <span className="logo">
      <PeakIcon color={accent} />
      <span className="logo__word">
        <b>{brand.wordmark.strong}</b>
        <i>{brand.wordmark.light}</i>
      </span>
    </span>
  );
}
