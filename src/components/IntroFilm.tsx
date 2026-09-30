"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Opening scene: the 15s brand film plays full-screen on a visitor's first
 * homepage visit, then fades into the site. Plays once per browser (replay
 * with /?intro=1). Skipped for reduced-motion users and still-frame links.
 *
 * Whether to play is decided by INTRO_BOOT (inline, before first paint) so the
 * homepage never flashes before the film. It sets <html data-intro="playing">.
 */

export const INTRO_KEY = "pf.intro.seen.v1";
export const INTRO_DONE_EVENT = "pf:intro-done";

export const INTRO_BOOT = `(function(){try{
var q=new URLSearchParams(location.search);
if(location.pathname!=="/"||q.has("heroT"))return;
var force=q.get("intro")==="1";
var seen=false;try{seen=localStorage.getItem("${INTRO_KEY}")==="1"}catch(e){}
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
if(force||(!seen&&!reduce))document.documentElement.setAttribute("data-intro","playing");
}catch(e){}})();`;

export function introPlaying(): boolean {
  return typeof document !== "undefined" && document.documentElement.getAttribute("data-intro") === "playing";
}

export function IntroFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!introPlaying()) return;
    setActive(true);
    const small = Math.min(window.innerWidth, window.innerHeight) < 700 || window.innerWidth < 1100;
    setSrc(small ? "/film/peakfreq-film-720.mp4" : "/film/peakfreq-film-1080.mp4");
    try {
      localStorage.setItem(INTRO_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  }, []);

  function finish() {
    if (leaving) return;
    setLeaving(true);
    ref.current?.pause();
    window.setTimeout(() => {
      document.documentElement.removeAttribute("data-intro");
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
      setActive(false);
      if (new URLSearchParams(location.search).has("intro")) history.replaceState(null, "", "/");
    }, 700);
  }

  useEffect(() => {
    const v = ref.current;
    if (!active || !v || !src) return;
    v.muted = true;
    v.play().catch(() => finish()); // autoplay blocked (e.g. low-power mode): go straight to the site
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, src]);

  if (!active) return null;

  return (
    <div className="intro" data-leaving={leaving} role="dialog" aria-label="PEAKfreq brand film">
      {src && (
        <video
          ref={ref}
          className="intro__video"
          src={src}
          poster="/film/poster.jpg"
          playsInline
          muted={muted}
          preload="auto"
          onEnded={finish}
          onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 15))}
        />
      )}
      <div className="intro__controls">
        <button
          className="intro__btn"
          onClick={() => {
            const v = ref.current;
            if (!v) return;
            const next = !muted;
            v.muted = next;
            setMuted(next);
            if (!next && v.paused) v.play().catch(() => {});
          }}
          aria-pressed={!muted}
        >
          {muted ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M17 9l4 6M21 9l-4 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Sound on
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 9h4l5-4v14l-5-4H4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Sound off
            </>
          )}
        </button>
        <button className="intro__btn intro__btn--skip" onClick={finish}>
          Enter site
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </div>
      <div className="intro__progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${progress.toFixed(4)})` }} />
      </div>
    </div>
  );
}
