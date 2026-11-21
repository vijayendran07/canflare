"use client";
import { useEffect, useState } from "react";
import { inr } from "@/lib/money";
import { WhatsAppIcon } from "@/components/Icons";

/** Phones: a sticky Add-to-cart / Buy-now bar that appears once the main buy buttons scroll out of view. */
export default function StickyBuyBar({ targetId, name, variant, total, onAdd, whatsappHref, disabled }: { targetId: string; name: string; variant?: string; total: number; onAdd: () => void; whatsappHref: string; disabled?: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || !("IntersectionObserver" in window)) { setShow(true); return; }
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  return (
    <div
      role="region" aria-label="Quick buy"
      className={`no-print glass fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 px-3 pt-2 pb-[max(8px,env(safe-area-inset-bottom))] transition-transform duration-[400ms] ease-emphasized md:hidden ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="mx-auto flex max-w-xl items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{name}</p>
          <p className="truncate text-xs text-taupe">{variant && variant !== "Standard" ? `${variant} · ` : ""}{inr(total)}</p>
        </div>
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" aria-label="Buy on WhatsApp" className="btn btn-wa btn-icon"><WhatsAppIcon /></a>
        <button onClick={onAdd} disabled={disabled} className="btn btn-gold min-w-[9.5rem]">Add to cart</button>
      </div>
    </div>
  );
}
