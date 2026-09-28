"use client";

import { useEffect, useRef } from "react";
import { SUMMIT_APEX, SUMMIT_DEFS, SUMMIT_FRONT, SUMMIT_H, SUMMIT_LAND, SUMMIT_TRAIL, SUMMIT_W } from "./summit-scene";

/**
 * Animated homepage hero.
 *
 * An athlete runs up the trail leaving an orange track, jumps at the summit,
 * folds into the lotus pose, turns orange and levitates. The sun rises at the
 * same pace and finishes directly behind them. Honours prefers-reduced-motion
 * (renders the final frame) and pauses while off-screen.
 */

/* ── Timeline (seconds) ── */
const T_DELAY = 0.6;
const T_RUN = 8.8;
const T_JUMP = 0.9;
const T_LOTUS = 1.3;
const T_END = T_DELAY + T_RUN + T_JUMP + T_LOTUS;

/* ── Figure dimensions (scene units) ── */
const K = 1.18; // overall figure scale
const TORSO = 25 * K;
const THIGH = 15 * K;
const SHIN = 15 * K;
const UPPER_ARM = 12.5 * K;
const FOREARM = 11 * K;
const HEAD_R = 6.2 * K;
const NECK = 9.4 * K;
const STRIDE = 78 * K; // distance per full gait cycle (two steps)
const LEG_REACH = 27.5 * K; // hip height above the ground while running

const HOVER = 86; // hip height above the summit when levitating
const SUN_R = 74;
const SUN_START_Y = SUMMIT_APEX.y + 320;
const SUN_END_Y = SUMMIT_APEX.y - HOVER - 14;

/** Tapered sun rays, alternating long and short. */
const RAYS = Array.from({ length: 20 }, (_, i) => {
  const a = (i / 20) * Math.PI * 2;
  const r1 = SUN_R + 10;
  const r2 = i % 2 ? SUN_R + 70 : SUN_R + 118;
  const w = i % 2 ? 0.05 : 0.07;
  const p = (ang: number, r: number) => `${(Math.cos(ang) * r).toFixed(1)},${(Math.sin(ang) * r).toFixed(1)}`;
  return `M${p(a - w, r1)}L${p(a, r2)}L${p(a + w, r1)}Z`;
});

const DARK = [35, 44, 38];
const ORANGE = [219, 122, 69];

/** Joint angles in radians, measured from straight down; positive points right on screen. */
type Pose = {
  lean: number;
  thigh: [number, number];
  shin: [number, number];
  upper: [number, number];
  fore: [number, number];
};

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => 0.5 - Math.cos(Math.PI * clamp(t)) / 2;
const easeOut = (t: number) => 1 - (1 - clamp(t)) ** 3;

function blend(a: Pose, b: Pose, t: number): Pose {
  const pair = (x: [number, number], y: [number, number]): [number, number] => [lerp(x[0], y[0], t), lerp(x[1], y[1], t)];
  return {
    lean: lerp(a.lean, b.lean, t),
    thigh: pair(a.thigh, b.thigh),
    shin: pair(a.shin, b.shin),
    upper: pair(a.upper, b.upper),
    fore: pair(a.fore, b.fore),
  };
}

/** Running pose at gait phase `phi`, facing +1 (right) to −1 (left); values between turn the runner. */
function runPose(phi: number, face: number): Pose {
  // Smooth, relaxed jog: modest hip swing, knee bend peaking during the forward swing.
  const leg = (p: number) => {
    const thigh = 0.12 + 0.5 * Math.sin(p);
    const bend = 0.3 + 0.85 * (0.5 + 0.5 * Math.cos(p + 0.25));
    return [thigh, thigh - bend];
  };
  const arm = (p: number) => {
    const upper = -0.42 * Math.sin(p) + 0.12;
    return [upper, upper + 1.35];
  };
  const [t1, s1] = leg(phi);
  const [t2, s2] = leg(phi + Math.PI);
  const [u1, f1] = arm(phi);
  const [u2, f2] = arm(phi + Math.PI);
  return {
    lean: 0.22 * face,
    thigh: [t1 * face, t2 * face],
    shin: [s1 * face, s2 * face],
    upper: [u1 * face, u2 * face],
    fore: [f1 * face, f2 * face],
  };
}

/** Arms up in a V, legs split: the leap off the summit. */
const tuckPose = (face: number): Pose => ({
  lean: 0.08 * face,
  thigh: [1.15 * face, -0.75 * face],
  shin: [0.55 * face, -1.75 * face],
  upper: [2.7, -2.7],
  fore: [2.85, -2.85],
});

/** Seated lotus, facing the viewer. */
const LOTUS: Pose = {
  lean: 0,
  thigh: [-1.42, 1.42],
  shin: [1.5, -1.5],
  upper: [-0.42, 0.42],
  fore: [-0.9, 0.9],
};

function vec(angle: number, len: number): [number, number] {
  return [Math.sin(angle) * len, Math.cos(angle) * len];
}

function skeleton(hx: number, hy: number, pose: Pose) {
  const sx = hx + Math.sin(pose.lean) * TORSO;
  const sy = hy - Math.cos(pose.lean) * TORSO;
  const headX = sx + Math.sin(pose.lean) * NECK;
  const headY = sy - Math.cos(pose.lean) * NECK;
  const legs: string[] = [];
  const arms: string[] = [];
  for (const i of [0, 1] as const) {
    const [kx, ky] = vec(pose.thigh[i], THIGH);
    const [fx, fy] = vec(pose.shin[i], SHIN);
    legs.push(`M${hx.toFixed(1)} ${hy.toFixed(1)}L${(hx + kx).toFixed(1)} ${(hy + ky).toFixed(1)}L${(hx + kx + fx).toFixed(1)} ${(hy + ky + fy).toFixed(1)}`);
    const [ex, ey] = vec(pose.upper[i], UPPER_ARM);
    const [wx, wy] = vec(pose.fore[i], FOREARM);
    arms.push(`M${sx.toFixed(1)} ${sy.toFixed(1)}L${(sx + ex).toFixed(1)} ${(sy + ey).toFixed(1)}L${(sx + ex + wx).toFixed(1)} ${(sy + ey + wy).toFixed(1)}`);
  }
  return {
    legs: legs.join(""),
    arms: arms.join(""),
    torso: `M${hx.toFixed(1)} ${hy.toFixed(1)}L${sx.toFixed(1)} ${sy.toFixed(1)}`,
    head: [headX, headY] as const,
  };
}

const rgb = (c: number[]) => `rgb(${c.map((v) => Math.round(v)).join(",")})`;

export function SummitHero({ label, className }: { label: string; className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const trackRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<SVGGElement>(null);
  const raysRef = useRef<SVGGElement>(null);
  const figRef = useRef<SVGGElement>(null);
  const legsRef = useRef<SVGPathElement>(null);
  const armsRef = useRef<SVGPathElement>(null);
  const torsoRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const auraRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const trail = trackRef.current;
    if (!trail) return;
    const L = trail.getTotalLength();
    const apex = SUMMIT_APEX;

    // Facing direction along the trail, smoothed so the runner turns at switchbacks.
    const faceAt = (s: number) => {
      const a = trail.getPointAtLength(Math.max(0, s - 9));
      const b = trail.getPointAtLength(Math.min(L, s + 9));
      const dx = b.x - a.x;
      const f = clamp(dx / 12, -1, 1);
      return Math.abs(f) < 0.2 ? Math.sign(dx || 1) * 0.2 : f;
    };

    // Trapezoid speed profile: ease in and out, steady pace in between.
    const runProgress = (u: number) => {
      const a = 0.08;
      const v = 1 / (1 - a);
      const x = clamp(u);
      if (x < a) return (0.5 * v * x * x) / a;
      if (x > 1 - a) return 1 - (0.5 * v * (1 - x) * (1 - x)) / a;
      return 0.5 * v * a + v * (x - a);
    };

    const render = (t: number) => {
      const run = runProgress((t - T_DELAY) / T_RUN);
      const s = run * L;
      const jumpT = clamp((t - T_DELAY - T_RUN) / T_JUMP);
      const lotusT = clamp((t - T_DELAY - T_RUN - T_JUMP) / T_LOTUS);
      const idle = Math.max(0, t - T_END);

      // Orange track follows the runner.
      const dash = `${L} ${L}`;
      const offset = `${(L - s).toFixed(1)}`;
      for (const el of [trail, glowRef.current]) {
        if (!el) continue;
        el.setAttribute("stroke-dasharray", dash);
        el.setAttribute("stroke-dashoffset", offset);
      }

      // Sun rises at the hero's pace and ends behind them.
      const sunT = easeInOut((t - T_DELAY) / (T_END - T_DELAY));
      const sunY = lerp(SUN_START_Y, SUN_END_Y, sunT);
      sunRef.current?.setAttribute("transform", `translate(${apex.x} ${sunY.toFixed(1)})`);
      sunRef.current?.setAttribute("opacity", (0.35 + 0.65 * clamp(sunT * 1.6)).toFixed(3));
      if (raysRef.current) {
        const breathe = 1 + 0.04 * Math.sin(t * 1.3);
        raysRef.current.setAttribute("transform", `rotate(${(t * 4).toFixed(2)}) scale(${breathe.toFixed(3)})`);
        raysRef.current.setAttribute("opacity", (0.2 + 0.8 * clamp(sunT * 1.4)).toFixed(3));
      }

      let hx: number;
      let hy: number;
      let pose: Pose;
      let face = 1;

      if (jumpT <= 0) {
        const p = trail.getPointAtLength(s);
        face = faceAt(s);
        const phi = (s / STRIDE) * Math.PI * 2;
        const bob = -1.6 * (0.5 - 0.5 * Math.cos(2 * phi));
        hx = p.x;
        hy = p.y - LEG_REACH + bob;
        pose = run > 0 && run < 1 ? runPose(phi, face) : blend(runPose(phi, face), runPose(Math.PI / 2, face), 0.6);
      } else {
        face = faceAt(L - 1);
        // Crouch, spring, then rise to the hover height.
        const crouch = jumpT < 0.18 ? Math.sin((jumpT / 0.18) * Math.PI) * 5 : 0;
        const rise = easeOut((jumpT - 0.12) / 0.88) * (HOVER - LEG_REACH + 22) - easeInOut(lotusT) * 22;
        const hover = idle > 0 ? Math.sin(idle * ((Math.PI * 2) / 3.4)) * 4 : 0;
        hx = apex.x;
        hy = apex.y - LEG_REACH + crouch - rise + hover;
        const tuck = tuckPose(face);
        const running = runPose(Math.PI / 2, face);
        pose = lotusT > 0 ? blend(tuck, LOTUS, easeInOut(lotusT)) : blend(running, tuck, easeOut(jumpT / 0.6));
      }

      const sk = skeleton(hx, hy, pose);
      legsRef.current?.setAttribute("d", sk.legs);
      armsRef.current?.setAttribute("d", sk.arms);
      torsoRef.current?.setAttribute("d", sk.torso);
      headRef.current?.setAttribute("cx", sk.head[0].toFixed(1));
      headRef.current?.setAttribute("cy", sk.head[1].toFixed(1));

      const colour = rgb(DARK.map((c, i) => lerp(c, ORANGE[i], easeInOut(lotusT))));
      figRef.current?.setAttribute("stroke", colour);
      headRef.current?.setAttribute("fill", colour);
      figRef.current?.setAttribute("opacity", clamp((t - T_DELAY + 0.2) / 0.4).toFixed(3));

      if (auraRef.current) {
        const pulse = idle > 0 ? 0.08 * Math.sin(idle * 1.8) : 0;
        auraRef.current.setAttribute("cx", hx.toFixed(1));
        auraRef.current.setAttribute("cy", (hy - 12).toFixed(1));
        auraRef.current.setAttribute("opacity", (easeInOut(lotusT) * (0.75 + pulse)).toFixed(3));
      }
    };

    // ?heroT=8.5 freezes the scene at that second (for stills and QA).
    const seek = Number(new URLSearchParams(window.location.search).get("heroT"));
    if (Number.isFinite(seek) && seek > 0) {
      render(seek);
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      render(T_END);
      return;
    }

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (svgRef.current) io.observe(svgRef.current);

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible && !document.hidden) {
        elapsed += dt;
        render(elapsed);
      }
      raf = requestAnimationFrame(tick);
    };
    render(0);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox={`0 0 ${SUMMIT_W} ${SUMMIT_H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={label}
    >
      <defs>
        <linearGradient id="pf-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3E7DE" />
          <stop offset="0.38" stopColor="#EDE6D6" />
          <stop offset="0.62" stopColor="#F3D9B8" />
          <stop offset="1" stopColor="#EFC9A0" />
        </linearGradient>
        <radialGradient id="pf-sunglow" cx="0" cy="0" r="340" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#FBE3C0" />
          <stop offset="0.25" stopColor="#F7D2A4" stopOpacity="0.75" />
          <stop offset="1" stopColor="#F3D9B8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pf-ray" cx="0" cy="0" r="190" gradientUnits="userSpaceOnUse">
          <stop offset="0.35" stopColor="#F6C185" stopOpacity="0.85" />
          <stop offset="1" stopColor="#F6C185" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="pf-aura">
          <stop offset="0" stopColor="#F2A36B" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F2A36B" stopOpacity="0" />
        </radialGradient>
        <g dangerouslySetInnerHTML={{ __html: SUMMIT_DEFS }} />
      </defs>

      <rect width={SUMMIT_W} height={SUMMIT_H} fill="url(#pf-sky)" />
      <g ref={sunRef} transform={`translate(${SUMMIT_APEX.x} ${SUN_START_Y})`} opacity={0.35}>
        <circle r={340} fill="url(#pf-sunglow)" />
        <g ref={raysRef} fill="url(#pf-ray)">
          {RAYS.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </g>
        <circle r={SUN_R} fill="#FAE1BD" />
      </g>

      <g dangerouslySetInnerHTML={{ __html: SUMMIT_LAND }} />

      <path
        ref={glowRef}
        d={SUMMIT_TRAIL}
        fill="none"
        stroke="#DB7A45"
        strokeOpacity={0.28}
        strokeWidth={11}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4000 4000"
        strokeDashoffset={4000}
      />
      <path
        ref={trackRef}
        d={SUMMIT_TRAIL}
        fill="none"
        stroke="#DB7A45"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4000 4000"
        strokeDashoffset={4000}
      />

      <g dangerouslySetInnerHTML={{ __html: SUMMIT_FRONT }} />

      <circle ref={auraRef} r={62} fill="url(#pf-aura)" opacity={0} />
      <g ref={figRef} fill="none" stroke="rgb(35,44,38)" strokeLinecap="round" strokeLinejoin="round" opacity={0}>
        <path ref={legsRef} strokeWidth={6.4} />
        <path ref={torsoRef} strokeWidth={11.5} />
        <path ref={armsRef} strokeWidth={5} />
        <circle ref={headRef} r={HEAD_R} stroke="none" fill="rgb(35,44,38)" />
      </g>
    </svg>
  );
}
