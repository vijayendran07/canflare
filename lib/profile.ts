"use client";
/**
 * Small, local-only personalisation (nothing leaves the device):
 *  - recently viewed products
 *  - saved delivery details + preferred pack size per product  (ONLY after the customer opts in at checkout)
 *  - last order (already stored by lib/order-client) for one-tap reorder
 */
const VIEWED = "canflare-viewed-v1";
const PROFILE = "canflare-profile-v1";

const read = <T,>(k: string, d: T): T => { try { const r = localStorage.getItem(k); return r ? (JSON.parse(r) as T) : d; } catch { return d; } };
const write = (k: string, v: unknown) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } };

export const recentlyViewed = (): string[] => read<string[]>(VIEWED, []);
export function markViewed(slug: string) {
  write(VIEWED, [slug, ...recentlyViewed().filter((s) => s !== slug)].slice(0, 12));
}

export type Profile = {
  name: string; mobile: string; whatsapp: string; sameWhatsapp: boolean;
  line1: string; area: string; city: string; state: string; district: string; pincode: string; landmark: string;
  variants: Record<string, string>;
};
export const loadProfile = (): Profile | null => read<Profile | null>(PROFILE, null);
export const saveProfile = (p: Profile) => write(PROFILE, p);
export function forgetProfile() { try { localStorage.removeItem(PROFILE); } catch { /* ignore */ } }
export function rememberVariant(slug: string, label: string) {
  const p = loadProfile();
  if (!p) return; // only when the customer has opted in
  write(PROFILE, { ...p, variants: { ...p.variants, [slug]: label } });
}
export const preferredVariant = (slug: string): string | undefined => loadProfile()?.variants?.[slug];
