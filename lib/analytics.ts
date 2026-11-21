/**
 * Analytics events. Everything is a no-op unless NEXT_PUBLIC_ANALYTICS_ID (a GA4 measurement ID, e.g. G-XXXXXXX) is set.
 * Events: view_item, add_to_cart, begin_checkout, purchase, search, whatsapp_click, concierge_open, view_3d (3D / 360° interaction).
 */
export type AnalyticsEvent =
  | "view_item" | "add_to_cart" | "begin_checkout" | "purchase" | "search" | "whatsapp_click" | "concierge_open" | "view_3d";

export const ANALYTICS_ID = process.env.NEXT_PUBLIC_ANALYTICS_ID || "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (!ANALYTICS_ID || typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, { currency: "INR", ...params });
  } catch {
    /* analytics must never break the shop */
  }
}
