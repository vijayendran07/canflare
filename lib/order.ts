import { z } from "zod";
import { business } from "@/config/business";
import { STATES } from "@/lib/states";
import { calcTotals } from "@/lib/pricing";
import { findVariant, isVisible } from "@/lib/catalog";
import type { Product } from "@/data/products";

const digits10 = z.string().regex(/^\d{10}$/, "Enter a 10-digit mobile number");
const clean = (max: number) => z.string().trim().max(max);

export const FALLBACK_ID = /^[A-Z]{2}-\d{4}-R\d{4}$/;

export const orderInputSchema = z.object({
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(80),
        variant: z.string().min(1).max(80),
        qty: z.number().int().min(1).max(50),
        price: z.number(),
      }),
    )
    .min(1)
    .max(30),
  customer: z.object({
    name: clean(80).min(2, "Enter your name"),
    mobile: digits10,
    whatsapp: digits10,
  }),
  address: z.object({
    line1: clean(160).min(3, "Enter house / street"),
    area: clean(80).min(2, "Enter area"),
    city: clean(60).min(2, "Enter city"),
    state: z.enum(STATES, { message: "Choose a state" }),
    district: clean(60).min(2, "Enter district"),
    pincode: z.string().regex(business.pincodePattern, "Enter a valid 6-digit pincode"),
    landmark: clean(100).optional().default(""),
  }),
  giftWrap: z.boolean().default(false),
  giftMessage: clean(240).optional().default(""),
  note: clean(400).optional().default(""),
  /** total shown to the customer - must equal the server's total */
  total: z.number(),
  /** set when a queued order is being retried */
  fallbackId: z.string().regex(FALLBACK_ID).optional(),
});
export type OrderInput = z.infer<typeof orderInputSchema>;

export type OrderLine = { slug: string; name: string; variant: string; qty: number; price: number };

export type Order = {
  id?: string;
  items: OrderLine[];
  itemCount: number;
  subtotal: number;
  delivery: number;
  giftWrap: number;
  discount: number;
  total: number;
  payment: string;
  name: string;
  mobile: string;
  whatsapp: string;
  address: string; // single line: house, area, landmark
  city: string;
  state: string;
  district: string;
  pincode: string;
  giftMessage: string;
  note: string;
  source: string;
  status?: string;
};

export type BuildResult =
  | { ok: true; order: Order }
  | { ok: false; status: number; error: string; message: string };

/** Re-prices an order from the catalogue. Client prices are never trusted. */
export function buildOrder(input: OrderInput, catalog: Product[], opts: { lenient?: boolean } = {}): BuildResult {
  let priceChanged = false;
  const lines: OrderLine[] = [];
  for (const it of input.items) {
    const p = catalog.find((x) => x.slug === it.slug);
    if (!p || !isVisible(p)) {
      return { ok: false, status: 400, error: "unknown-product", message: "A product in your cart is no longer available." };
    }
    const v = findVariant(p, it.variant);
    if (!v) return { ok: false, status: 400, error: "unknown-variant", message: `${p.name} (${it.variant}) is no longer available.` };
    if (!p.inStock) return { ok: false, status: 409, error: "out-of-stock", message: `${p.name} is out of stock.` };
    if (v.price !== it.price && opts.lenient) priceChanged = true;
    else if (v.price !== it.price) {
      return { ok: false, status: 409, error: "price-mismatch", message: "Prices have changed. Please review your cart." };
    }
    lines.push({ slug: p.slug, name: p.name, variant: v.label, qty: it.qty, price: v.price });
  }
  const t = calcTotals(lines, { giftWrap: input.giftWrap });
  if (!opts.lenient && t.total !== Math.round(input.total)) {
    return { ok: false, status: 409, error: "price-mismatch", message: "Order total does not match. Please review your cart." };
  }
  const a = input.address;
  const addressLine = [a.line1, a.area, a.landmark ? `Landmark: ${a.landmark}` : ""].filter(Boolean).join(", ");
  return {
    ok: true,
    order: {
      items: lines,
      itemCount: t.itemCount,
      subtotal: t.subtotal,
      delivery: t.delivery,
      giftWrap: t.giftWrap,
      discount: 0,
      total: t.total,
      payment: "Pending – to confirm with customer",
      name: input.customer.name,
      mobile: input.customer.mobile,
      whatsapp: input.customer.whatsapp,
      address: addressLine,
      city: a.city,
      state: a.state,
      district: a.district,
      pincode: a.pincode,
      giftMessage: input.giftMessage ?? "",
      note: [input.note ?? "", priceChanged || (opts.lenient && t.total !== Math.round(input.total)) ? `[Price changed after the customer ordered - they were shown ₹${Math.round(input.total)}]` : ""].filter(Boolean).join(" "),
      source: "Website",
    },
  };
}

/** e.g. CF-2611-R4821 - used when the sheet can't be reached */
export function makeFallbackId(now = new Date(), rand = Math.random): string {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const r = String(1000 + Math.floor(rand() * 9000));
  return `${business.orderPrefix}-${yy}${mm}-R${r}`;
}
