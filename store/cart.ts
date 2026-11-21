"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";
import { calcTotals } from "@/lib/pricing";

export type CartItem = {
  slug: string;
  variant: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
};

type CartState = {
  items: CartItem[];
  drawerOpen: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, variant: string, qty: number) => void;
  remove: (slug: string, variant: string) => void;
  clear: () => void;
  /** replace prices / drop unavailable lines using fresh catalogue data */
  sync: (fresh: { slug: string; variant: string; price: number }[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

/** Storage writes are blocked until the saved cart has been read, so a reload can never wipe it. */
let hydrated = false;
const safeStorage = {
  getItem: (name: string) => {
    try {
      return typeof localStorage === "undefined" ? null : localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string) => {
    if (!hydrated) return;
    try {
      localStorage.setItem(name, value);
    } catch {
      /* storage full / blocked */
    }
  },
  removeItem: (name: string) => {
    if (!hydrated) return;
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
};

const MAX_QTY = 50;
const same = (a: CartItem, slug: string, variant: string) => a.slug === slug && a.variant === variant;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      drawerOpen: false,
      add: (item, qty = 1) =>
        set((s) => {
          const i = s.items.findIndex((x) => same(x, item.slug, item.variant));
          if (i >= 0) {
            const items = s.items.slice();
            items[i] = { ...items[i], price: item.price, qty: Math.min(MAX_QTY, items[i].qty + qty) };
            return { items };
          }
          return { items: [...s.items, { ...item, qty: Math.min(MAX_QTY, qty) }] };
        }),
      setQty: (slug, variant, qty) =>
        set((s) => ({
          items:
            qty <= 0
              ? s.items.filter((x) => !same(x, slug, variant))
              : s.items.map((x) => (same(x, slug, variant) ? { ...x, qty: Math.min(MAX_QTY, qty) } : x)),
        })),
      remove: (slug, variant) => set((s) => ({ items: s.items.filter((x) => !same(x, slug, variant)) })),
      clear: () => set({ items: [] }),
      sync: (fresh) =>
        set((s) => ({
          items: s.items
            .map((x) => {
              const f = fresh.find((y) => y.slug === x.slug && y.variant === x.variant);
              return f ? { ...x, price: f.price } : null;
            })
            .filter(Boolean) as CartItem[],
        })),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
    }),
    {
      name: "canflare-cart-v1",
      storage: createJSONStorage(() => safeStorage),
      partialize: (s) => ({ items: s.items }),
      onRehydrateStorage: () => () => {
        hydrated = true;
      },
    },
  ),
);

/** true once the client has mounted (avoids hydration mismatches for cart-dependent UI) */
export function useCartReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

export function useCartTotals(opts: { giftWrap?: boolean } = {}) {
  const items = useCart((s) => s.items);
  return calcTotals(items, opts);
}
