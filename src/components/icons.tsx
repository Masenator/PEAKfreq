type P = { size?: number };

export const ArrowRight = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const Bag = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 8h16l-1.2 12.2a1 1 0 0 1-1 .8H6.2a1 1 0 0 1-1-.8L4 8Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.5 8V6.5a3.5 3.5 0 0 1 7 0V8" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const Menu = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const Close = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const Check = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="m2.5 8.5 3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

export const Truck = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M2 6h12v10H2zM14 10h4l3 3v3h-7" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="6" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="17" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const Loop = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M18 3v4h-4M6 21v-4h4" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const Flask = ({ size = 20 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 15h10" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
