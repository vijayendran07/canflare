"use client";
import { useEffect, useRef, useState } from "react";
import ProductImage from "@/components/ProductImage";
import VT from "@/components/VT";
import { img } from "@/lib/img";
import Spin360 from "./Spin360";

/**
 * Product gallery: swipeable (scroll-snap) on phones with dots, thumbnails on desktop, hover-zoom on desktop,
 * tap-to-zoom lightbox with native pinch-zoom on touch devices, optional 360° spin when frames exist.
 */
export default function Gallery({ slug, name, category, images, spin }: { slug: string; name: string; category: string; images: string[]; spin?: string[] }) {
  const slides: (string | null)[] = images.length ? images : [null];
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<"photos" | "spin">("photos");
  const [zoom, setZoom] = useState<string | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const dlg = useRef<HTMLDialogElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const has360 = !!spin && spin.length >= 12;

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const on = () => setI(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (zoom && !d.open) d.showModal();
    if (!zoom && d.open) d.close();
  }, [zoom]);

  const go = (k: number) => rail.current?.scrollTo({ left: k * rail.current.clientWidth, behavior: "smooth" });

  return (
    <div className="flicker">
      {has360 && (
        <div role="tablist" aria-label="Media" className="mb-3 flex gap-2">
          <button role="tab" aria-selected={mode === "photos"} className="chip !min-h-9" onClick={() => setMode("photos")}>Photos</button>
          <button role="tab" aria-selected={mode === "spin"} className="chip !min-h-9" onClick={() => setMode("spin")}>360° view</button>
        </div>
      )}

      {mode === "spin" && has360 ? (
        <Spin360 frames={spin!} alt={name} />
      ) : (
        <>
          <div
            ref={rail}
            className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-3xl border border-line bg-oat"
            aria-roledescription="carousel" aria-label={`${name} photos`}
          >
            {slides.map((src, k) => (
              <div
                key={src ?? "placeholder"}
                className="relative aspect-square w-full shrink-0 snap-center cursor-zoom-in overflow-hidden"
                role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${slides.length}`}
                onClick={() => src && setZoom(src)}
                onPointerMove={(e) => {
                  if (e.pointerType !== "mouse" || !src) return;
                  const r = e.currentTarget.getBoundingClientRect();
                  setHover({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
                }}
                onPointerLeave={() => setHover(null)}
              >
                {k === 0 ? <VT name={`product-${slug}`}><div className="absolute inset-0"><ProductImage src={src} alt={name} category={category} sizes="(max-width: 768px) 100vw, 50vw" priority /></div></VT> : <ProductImage src={src} alt={`${name} – photo ${k + 1}`} category={category} sizes="(max-width: 768px) 100vw, 50vw" />}
                {src && hover && i === k && (
                  <div aria-hidden className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block" style={{ backgroundImage: `url(${img(src)})`, backgroundSize: "220%", backgroundPosition: `${hover.x}% ${hover.y}%` }} />
                )}
              </div>
            ))}
          </div>
          {slides.length > 1 && (
            <>
              <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
                {slides.map((_, k) => <span key={k} className={`h-1.5 rounded-full transition-all duration-[220ms] ${k === i ? "w-5 bg-gold-deep" : "w-1.5 bg-line"}`} />)}
              </div>
              <div className="mt-3 hidden gap-2 md:flex">
                {slides.map((src, k) => (
                  <button key={src ?? k} onClick={() => go(k)} aria-label={`Show photo ${k + 1}`} aria-current={k === i} className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 ${k === i ? "border-gold-deep" : "border-transparent"}`}>
                    <ProductImage src={src} alt="" category={category} sizes="64px" />
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <dialog ref={dlg} onClose={() => setZoom(null)} onClick={(e) => { if (e.target === dlg.current) setZoom(null); }} className="m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-white/95 p-0" aria-label={`${name} – zoomed photo`}>
        <button onClick={() => setZoom(null)} aria-label="Close zoom" className="btn btn-glass btn-icon absolute right-3 top-3 z-10">✕</button>
        {/* native pinch-zoom + scroll panning inside the viewer */}
        <div className="h-full w-full overflow-auto [touch-action:pinch-zoom_pan-x_pan-y]">
          {zoom && /* eslint-disable-next-line @next/next/no-img-element */ <img src={img(zoom)} alt={name} className="mx-auto h-full w-auto max-w-none object-contain md:h-auto md:max-h-full md:w-auto" />}
        </div>
      </dialog>
    </div>
  );
}
