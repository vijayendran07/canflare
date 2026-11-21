"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { img } from "@/lib/img";
import { track } from "@/lib/analytics";

/**
 * 360° product spin from a sequence of photos (drag / swipe / arrow keys). Frames are preloaded only after the first interaction
 * or when scrolled into view. Only rendered when a product has `spin` frames.
 */
export default function Spin360({ frames, alt }: { frames: string[]; alt: string }) {
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; i: number } | null>(null);
  const loaded = useRef(false);
  const n = frames.length;

  const preload = useCallback(() => {
    if (loaded.current) return;
    loaded.current = true;
    frames.forEach((f) => { const im = new Image(); im.src = img(f); });
  }, [frames]);

  useEffect(() => {
    const el = box.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { preload(); io.disconnect(); } }, { rootMargin: "200px" });
    io.observe(el);
    return () => io.disconnect();
  }, [preload]);

  const wrap = (k: number) => ((k % n) + n) % n;
  const down = (e: React.PointerEvent) => { preload(); drag.current = { x: e.clientX, i }; (e.target as Element).setPointerCapture?.(e.pointerId); track("view_3d", { item: alt, kind: "360" }); };
  const move = (e: React.PointerEvent) => {
    if (!drag.current || !box.current) return;
    const step = box.current.clientWidth / n; // one full drag across the box = one full turn
    setI(wrap(drag.current.i - Math.round((e.clientX - drag.current.x) / (step * 0.9))));
  };
  const up = () => { drag.current = null; };

  return (
    <div
      ref={box}
      role="slider" tabIndex={0} aria-label={`${alt} – 360° view, drag or use arrow keys to rotate`} aria-valuemin={1} aria-valuemax={n} aria-valuenow={i + 1}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
      onKeyDown={(e) => { if (e.key === "ArrowRight") setI((k) => wrap(k + 1)); if (e.key === "ArrowLeft") setI((k) => wrap(k - 1)); }}
      className="relative aspect-square cursor-grab touch-pan-y select-none overflow-hidden rounded-3xl border border-line bg-oat active:cursor-grabbing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img(frames[i])} alt={`${alt}, view ${i + 1} of ${n}`} draggable={false} className="h-full w-full object-cover" />
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">↔ Drag to rotate 360°</span>
    </div>
  );
}
