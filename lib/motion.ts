"use client";
import { useEffect, useState } from "react";

type Conn = { saveData?: boolean; effectiveType?: string };
type Nav = Navigator & { connection?: Conn; deviceMemory?: number };

export const prefersReducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
export const saveData = () => typeof navigator !== "undefined" && !!(navigator as Nav).connection?.saveData;
const slowNet = () => /(^|-)2g$/.test((typeof navigator !== "undefined" && (navigator as Nav).connection?.effectiveType) || "");

/** Motion (parallax, fly-to-cart, magnetic buttons…) is only used when the user hasn't asked for less. */
export const motionOK = () => !prefersReducedMotion() && !saveData();

/** Heavy visuals (WebGL / 3D) only on capable devices: enough cores & memory, no Save-Data, no 2G, no reduced motion. */
export function canRun3D(): boolean {
  if (typeof window === "undefined") return false;
  const n = navigator as Nav;
  if (!motionOK() || slowNet()) return false;
  if ((n.hardwareConcurrency ?? 2) < 6) return false;
  if (n.deviceMemory !== undefined && n.deviceMemory < 4) return false;
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Marks the page as motion-ready (enables scroll reveals) and reveals `.reveal` elements as they enter the viewport. */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!("IntersectionObserver" in window) || prefersReducedMotion()) return;
    root.classList.add("js-motion");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); root.classList.remove("js-motion"); };
  }, []);
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}
