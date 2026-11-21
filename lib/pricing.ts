import { business } from "@/config/business";

export type PricedLine = { price: number; qty: number };

export type Totals = {
  itemCount: number;
  subtotal: number;
  delivery: number;
  giftWrap: number;
  discount: number;
  total: number;
  /** rupees still needed for free delivery (0 when already free) */
  toFree: number;
};

export function deliveryFor(subtotal: number, opts?: { pickup?: boolean }): number {
  if (opts?.pickup || subtotal <= 0) return 0;
  return subtotal >= business.freeDeliveryThreshold ? 0 : business.deliveryCharge;
}

export function calcTotals(
  lines: PricedLine[],
  opts: { giftWrap?: boolean; pickup?: boolean; discount?: number; deliveryOverride?: number | null } = {},
): Totals {
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const subtotal = lines.reduce((s, l) => s + Math.round(l.price) * l.qty, 0);
  const delivery =
    opts.deliveryOverride != null ? Math.max(0, Math.round(opts.deliveryOverride)) : deliveryFor(subtotal, opts);
  const giftWrap = opts.giftWrap && subtotal > 0 ? business.giftWrapPrice : 0;
  const discount = Math.min(Math.max(0, Math.round(opts.discount || 0)), subtotal);
  const total = subtotal + delivery + giftWrap - discount;
  const toFree = subtotal > 0 && !opts.pickup ? Math.max(0, business.freeDeliveryThreshold - subtotal) : 0;
  return { itemCount, subtotal, delivery, giftWrap, discount, total, toFree };
}
