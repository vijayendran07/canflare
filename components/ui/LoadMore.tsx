"use client";
import { useEffect, useRef, useState } from "react";

/** Infinite load: reveals `step` more items when the sentinel scrolls into view; button fallback for no-IO / keyboard users. */
export function useInfinite<T>(items: T[], step = 8) {
  const [count, setCount] = useState(step);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => setCount(step), [items, step]);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && setCount((c) => c + step), { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, [items, count, step]);
  const shown = items.slice(0, count);
  const more = count < items.length;
  const sentinel = more ? (
    <div ref={ref} className="mt-8 flex justify-center">
      <button className="btn btn-line" onClick={() => setCount((c) => c + step)}>Show more</button>
    </div>
  ) : null;
  return { shown, more, sentinel };
}

/** Floating "Back to top" button – appears after scrolling 1.5 screens. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => {
      const f = document.getElementById("site-footer");
      const footerVisible = !!f && f.getBoundingClientRect().top < window.innerHeight - 40;
      setShow(window.scrollY > window.innerHeight * 1.5 && !footerVisible);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button aria-label="Back to top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="btn btn-dark btn-icon fixed bottom-[calc(var(--bottom-nav-h)+84px)] left-4 z-40 shadow-e3 md:bottom-6 md:left-6">↑</button>
  );
}
