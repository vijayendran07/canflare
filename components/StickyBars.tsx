"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { ownerWaLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import { WhatsAppIcon } from "./Icons";

const ConciergePanel = dynamic(() => import("./concierge/ConciergePanel"), { ssr: false });

/**
 * Floating assistant button. Sits above the phone bottom nav / product buy bar and never overlaps the footer.
 * - Concierge OFF (no CONCIERGE_API_KEY): it is a WhatsApp button with the current page pre-filled in the message.
 * - Concierge ON: it opens the shopping assistant (lazy-loaded), which can itself hand over to WhatsApp.
 */
export default function StickyBars({ concierge = false }: { concierge?: boolean }) {
  const path = usePathname();
  const [overFooter, setOverFooter] = useState(false);
  const [open, setOpen] = useState(false);
  const [href, setHref] = useState(ownerWaLink(`Hi ${business.name}!`));

  useEffect(() => {
    const f = document.getElementById("site-footer");
    if (!f || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([e]) => setOverFooter(e.isIntersecting), { threshold: 0 });
    io.observe(f);
    return () => io.disconnect();
  }, [path]);

  // pre-fill the WhatsApp message with the page the shopper is on
  useEffect(() => {
    const title = document.title.replace(/\s*\|\s*Canflare$/, "");
    setHref(ownerWaLink(path === "/" ? `Hi ${business.name}!` : `Hi ${business.name}! I'm looking at: ${title}\n${location.origin}${path}`));
  }, [path]);

  if (path.startsWith("/checkout")) return null;
  const lift = path.startsWith("/product/") ? "bottom-[88px]" : "bottom-[calc(var(--bottom-nav-h)+16px)]";
  const cls = `fixed right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#1faa52] text-white shadow-e4 transition-opacity duration-[220ms] md:right-6 md:bottom-6 ${lift} ${overFooter ? "pointer-events-none opacity-0" : "opacity-100"}`;

  if (concierge) {
    return (
      <>
        <button className={cls} aria-label="Open shopping assistant" onClick={() => { setOpen(true); track("concierge_open", { page: path }); }}>
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a8 8 0 0 1-11.5 7.2L3 21l1.8-5.5A8 8 0 1 1 21 12Z" /><path d="M8.5 11h.01M12 11h.01M15.5 11h.01" /></svg>
        </button>
        {open && <ConciergePanel onClose={() => setOpen(false)} />}
      </>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" className={cls} onClick={() => track("concierge_open", { page: path, mode: "whatsapp" })}>
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
