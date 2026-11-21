"use client";
import { useEffect } from "react";

/**
 * Cinematic logo intro – plays on every full page load (first open and every refresh) of the shop.
 * Client-side navigation between pages does not replay it. Not shown on checkout, order confirmation or admin.
 * Whether it plays is decided by an inline script in <head> BEFORE first paint (sets html[data-intro="full"|"lite"]),
 * so there is never a flash of the page or of the intro. Pure CSS animation (transform/opacity only).
 *  - reduced motion → never plays
 *  - weak Android (≤2 GB RAM, ≤4 cores, Save-Data, 2G) → "lite" (logo fade only)
 *  - iPhone / iPad → always "full"
 * Skip: button, click anywhere, or Esc. The overlay also ends by itself in pure CSS if JS fails.
 */
const TAGLINE = "HANDMADE IN CHENNAI";
const THUMBS = Array.from({ length: 41 }, (_, i) => `/intro/${i + 1}.jpg`);
const ROWS = [0, 1, 2, 3].map((r) => THUMBS.filter((_, i) => i % 4 === r));
const EMBERS = [
  [8, 0.2, 3], [16, 1.1, 2], [24, 0.6, 4], [31, 1.5, 2], [39, 0.3, 3], [46, 1.2, 2], [53, 0.8, 3],
  [60, 0.1, 2], [67, 1.4, 4], [74, 0.5, 2], [81, 1.0, 3], [88, 0.4, 2], [94, 1.3, 3], [3, 0.9, 2],
] as const;

export default function Intro() {
  useEffect(() => {
    const root = document.documentElement;
    const mode = root.dataset.intro;
    if (!mode) return;
    let done = false;
    const end = () => {
      if (done) return;
      done = true;
      delete root.dataset.intro;
      root.classList.remove("intro-skip");
      window.removeEventListener("keydown", onKey);
    };
    const skip = () => {
      if (done) return;
      root.classList.add("intro-skip");
      setTimeout(end, 380);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip(); };
    window.addEventListener("keydown", onKey);
    (window as unknown as { __cfSkipIntro?: () => void }).__cfSkipIntro = skip;
    // time from page start (not from hydration), so slow devices never see a stale overlay
    const total = mode === "lite" ? 1800 : 3000;
    const t = setTimeout(end, Math.max(0, total - performance.now()));
    return () => { clearTimeout(t); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <div className="intro" onClick={() => (window as unknown as { __cfSkipIntro?: () => void }).__cfSkipIntro?.()}>
      {/* drifting wall of every product photo, tilted, behind a warm dark veil */}
      <div className="intro-wall" aria-hidden="true">
        {ROWS.map((row, r) => (
          <div key={r} className={`intro-row ${r % 2 ? "rev" : ""}`}>
            {[...row, ...row].map((src, i) => <span key={i} className="intro-tile" style={{ backgroundImage: `url(${src})` }} />)}
          </div>
        ))}
      </div>
      <div className="intro-veil" aria-hidden="true" />
      <div className="intro-deco" aria-hidden="true">

      {/* light */}
      <span className="intro-core" />
      <span className="intro-scan" />
      {EMBERS.map(([left, delay, size], i) => (
        <span key={i} className="intro-ember" style={{ left: `${left}%`, width: size, height: size, animationDelay: `${0.5 + delay}s` }} />
      ))}

      </div>
      {/* logo + tagline */}
      <div className="intro-brand" aria-hidden="true">
        <div className="intro-logo">
          {/* transparent-background logo (generated from /logo.jpg), so the glow shows through */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-transparent.png" alt="" width={592} height={207} decoding="async" fetchPriority="high" />
          <span className="intro-shine" />
        </div>
        <span className="intro-beam" aria-hidden="true"><i /><i /></span>
        <p className="intro-tag">
          {TAGLINE.split("").map((ch, i) => (
            <span key={i} style={{ animationDelay: `${1.15 + i * 0.035}s` }}>{ch === " " ? " " : ch}</span>
          ))}
        </p>
      </div>

      <span className="intro-progress" aria-hidden="true" />
      <button type="button" className="intro-skip-btn" onClick={(e) => { e.stopPropagation(); (window as unknown as { __cfSkipIntro?: () => void }).__cfSkipIntro?.(); }}>
        Skip intro
      </button>
    </div>
  );
}
