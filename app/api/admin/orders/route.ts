import { z } from "zod";
import { guard, json, needSheet } from "@/lib/admin-api";
import { sheetCall } from "@/lib/sheet";
import { calcTotals } from "@/lib/pricing";
import { STATES } from "@/lib/states";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const g = guard(req) || needSheet();
  if (g) return g;
  try {
    const res = await sheetCall<{ orders: unknown[] }>("admin_orders");
    return json({ ok: true, orders: res.orders ?? [] });
  } catch (e) {
    return json({ ok: false, error: "sheet", message: "Could not read the Orders sheet." }, 502);
  }
}

const manual = z.object({
  items: z
    .array(z.object({ slug: z.string().max(80).default("custom"), name: z.string().min(1).max(120), variant: z.string().max(80).default(""), qty: z.number().int().min(1).max(500), price: z.number().min(0).max(1_000_000) }))
    .min(1)
    .max(50),
  customer: z.object({ name: z.string().trim().min(1).max(80), mobile: z.string().regex(/^\d{10}$/), whatsapp: z.string().regex(/^\d{10}$/).optional() }),
  address: z.object({
    line1: z.string().max(200).default(""), city: z.string().max(60).default(""), district: z.string().max(60).default(""),
    state: z.string().max(60).default(""), pincode: z.string().regex(/^(\d{6})?$/).default(""),
  }),
  pickup: z.boolean().default(false),
  deliveryOverride: z.number().min(0).max(100000).nullable().default(null),
  discount: z.number().min(0).max(1_000_000).default(0),
  giftWrap: z.boolean().default(false),
  payment: z.enum(["Pending", "Paid cash", "Paid UPI"]).default("Pending"),
  status: z.enum(["New", "Confirmed", "Packed", "Shipped", "Delivered"]).default("New"),
  source: z.enum(["Phone", "WhatsApp", "Instagram", "Walk-in", "Other"]).default("WhatsApp"),
  note: z.string().max(400).default(""),
  giftMessage: z.string().max(240).default(""),
});

/** Manual order (phone / WhatsApp / Instagram / walk-in). Admin sets the prices. */
export async function POST(req: Request) {
  const g = guard(req) || needSheet();
  if (g) return g;
  const p = manual.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ ok: false, error: "invalid", message: p.error.issues[0]?.path.join(".") + ": " + p.error.issues[0]?.message }, 400);
  const d = p.data;
  const t = calcTotals(d.items, { giftWrap: d.giftWrap, pickup: d.pickup, discount: d.discount, deliveryOverride: d.deliveryOverride });
  const order = {
    items: d.items,
    itemCount: t.itemCount, subtotal: t.subtotal, delivery: t.delivery, giftWrap: t.giftWrap, discount: t.discount, total: t.total,
    payment: d.pickup ? `${d.payment} (pickup)` : d.payment,
    name: d.customer.name, mobile: d.customer.mobile, whatsapp: d.customer.whatsapp ?? d.customer.mobile,
    address: d.pickup ? "Pickup from store" : d.address.line1, city: d.address.city, state: STATES.includes(d.address.state as never) ? d.address.state : d.address.state,
    district: d.address.district, pincode: d.address.pincode, giftMessage: d.giftMessage, note: d.note,
    source: d.source, status: d.status,
  };
  try {
    const res = await sheetCall<{ id: string }>("order", { method: "POST", body: { order } });
    return json({ ok: true, id: res.id, order: { ...order, id: res.id } });
  } catch {
    return json({ ok: false, error: "sheet", message: "Could not save to the sheet. Try again." }, 502);
  }
}
