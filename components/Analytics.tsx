"use client";
import Script from "next/script";
import { useEffect } from "react";
import { ANALYTICS_ID, track } from "@/lib/analytics";

/** Loads GA4 lazily (after the page is idle) only when NEXT_PUBLIC_ANALYTICS_ID is set. Also tracks WhatsApp clicks. */
export default function Analytics() {
  useEffect(() => {
    if (!ANALYTICS_ID) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a[href*='wa.me'],a[href*='api.whatsapp.com']");
      if (a) track("whatsapp_click", { link_url: (a as HTMLAnchorElement).href.slice(0, 120) });
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  if (!ANALYTICS_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`} strategy="lazyOnload" />
      <Script id="ga-init" strategy="lazyOnload">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${ANALYTICS_ID}',{anonymize_ip:true});`}</Script>
    </>
  );
}
