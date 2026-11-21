"use client";
import type { Order, OrderInput } from "@/lib/order";

/** Customer-side order memory (confirmation page) and the offline retry queue. */
const ORDERS_KEY = "canflare-orders-v1";
const QUEUE_KEY = "canflare-queue-v1";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, v: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

export type SavedOrder = { id: string; order: Order; queued: boolean; at: string };

export function saveOrder(s: SavedOrder) {
  const all = read<Record<string, SavedOrder>>(ORDERS_KEY, {});
  all[s.id] = s;
  const keys = Object.keys(all);
  if (keys.length > 20) delete all[keys[0]];
  write(ORDERS_KEY, all);
}
export const lastOrder = (): SavedOrder | undefined =>
  Object.values(read<Record<string, SavedOrder>>(ORDERS_KEY, {})).sort((a, b) => b.at.localeCompare(a.at))[0];
export const loadOrder = (id: string): SavedOrder | undefined => read<Record<string, SavedOrder>>(ORDERS_KEY, {})[id];

type Queued = { id: string; input: OrderInput };
export function enqueue(id: string, input: OrderInput) {
  const q = read<Queued[]>(QUEUE_KEY, []).filter((x) => x.id !== id);
  q.push({ id, input: { ...input, fallbackId: id } });
  write(QUEUE_KEY, q);
}
export const readQueue = () => read<Queued[]>(QUEUE_KEY, []);
export function dequeue(id: string) {
  write(QUEUE_KEY, readQueue().filter((x) => x.id !== id));
}

/** Try to push queued orders to the sheet. Returns how many were delivered. */
export async function flushQueue(): Promise<number> {
  let sent = 0;
  for (const q of readQueue()) {
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q.input),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok && !data.queued) {
        dequeue(q.id);
        sent++;
      } else if (res.status >= 400 && res.status < 500 && res.status !== 408 && res.status !== 429 && data.error !== "price-mismatch") {
        dequeue(q.id); // permanently invalid, don't retry forever
      }
    } catch {
      /* offline - try later */
    }
  }
  return sent;
}
