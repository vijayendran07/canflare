import { business } from "@/config/business";
import { inr } from "@/lib/money";
import { toWaNumber, waLink } from "@/lib/whatsapp";
import type { AdminOrder, Status } from "@/lib/admin-types";

/**
 * Premium WhatsApp messages to the customer. WhatsApp formatting: *bold*, _italic_.
 * Used by the admin when an order's status changes (list + order page) and by the one-tap templates.
 */
export type Template = { key: string; label: string; setStatus?: Status; text: (o: AdminOrder, upi?: string) => string };

const site = () => (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
const first = (o: AdminOrder) => o.name.trim().split(/\s+/)[0] || "there";
const line = (i: AdminOrder["items"][number]) => `• ${i.name}${i.variant && i.variant !== "Standard" ? ` (${i.variant})` : ""} × ${i.qty} — ${inr(i.price * i.qty)}`;
const itemsBlock = (o: AdminOrder) => (o.items.length ? o.items.map(line).join("\n") : o.itemsText);
const header = `✨ *${business.name.toUpperCase()}* ✨`;
const signoff = `With warmth,\n*Team ${business.name}* 🕯️\n_${business.tagline}_`;
const orderRef = (o: AdminOrder) => `🧾 Order *${o.id}*`;
const totals = (o: AdminOrder) => {
  const parts = [`Subtotal ${inr(o.subtotal)}`, `Delivery ${o.delivery ? inr(o.delivery) : "FREE"}`];
  if (o.giftWrap) parts.push(`Gift wrap ${inr(o.giftWrap)}`);
  if (o.discount) parts.push(`Discount −${inr(o.discount)}`);
  return `${parts.join(" · ")}\n💰 *Total: ${inr(o.total)}*`;
};
const address = (o: AdminOrder) => [o.address, o.city, o.state, o.pincode].filter(Boolean).join(", ");
const trackLine = (o: AdminOrder) => (site() ? `\n🔎 Track anytime: ${site()}/track\n(Order ID *${o.id}* + your mobile number)` : "");

/** The message for a status change. Returns null when no customer message makes sense (e.g. re-opening to New). */
export function statusMessage(o: AdminOrder, status: Status, upi?: string): string | null {
  switch (status) {
    case "Confirmed":
      return [
        header, "",
        `Hi ${first(o)}, thank you for choosing ${business.name}! 💛`,
        `Your order is *confirmed* ✅`, "",
        orderRef(o),
        itemsBlock(o), "",
        totals(o), "",
        `💳 *Payment*`,
        upi ? `Please pay *${inr(o.total)}* by UPI to *${upi}* and share the payment screenshot here.` : `Please complete the payment of *${inr(o.total)}* – reply here and we'll share the payment details.`,
        `We'll pack your candles as soon as the payment is received.`, "",
        `📍 Delivering to: ${address(o)}`, "",
        signoff,
      ].join("\n");
    case "Packed":
      return [
        header, "",
        `Hi ${first(o)} 📦`,
        `Your candles have been *carefully packed* and are ready to leave our studio!`, "",
        orderRef(o),
        itemsBlock(o), "",
        `We'll send you the courier and tracking details as soon as it ships.`, "",
        signoff,
      ].join("\n");
    case "Shipped":
      return [
        header, "",
        `Hi ${first(o)}, great news! 🚚`,
        `Your order is *on its way* to you.`, "",
        orderRef(o),
        o.courier ? `📮 Courier: *${o.courier}*` : "",
        o.tracking ? `🔢 Tracking no.: *${o.tracking}*` : "",
        `📍 ${address(o)}`,
        trackLine(o), "",
        `Thank you for waiting – it'll be with you soon! ✨`, "",
        signoff,
      ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");
    case "Delivered":
      return [
        header, "",
        `Hi ${first(o)} 🏡`,
        `Your order *${o.id}* has been *delivered*. We hope your candles bring warmth and light to your home! 🕯️`, "",
        `We'd love to see them glowing – share a photo and tag us *${business.instagramHandle}* 📸`,
        `Thank you for supporting a small Chennai business. 💛`, "",
        signoff,
      ].join("\n");
    case "Cancelled":
      return [
        header, "",
        `Hi ${first(o)},`,
        `Your order *${o.id}* has been *cancelled*.`,
        `If you've already made a payment, please reply here and we'll sort it out with you right away.`, "",
        `We hope to light up your space another time. 🕯️`, "",
        signoff,
      ].join("\n");
    default:
      return null;
  }
}

/** Message for the plain "WhatsApp" button: fits the order's current status (New → order received). */
export function contactMessage(o: AdminOrder, upi?: string): string {
  if (o.status === "New") {
    return [
      header, "",
      `Hi ${first(o)}, thank you for your order! 💛`,
      `We've received it and will confirm it with you shortly.`, "",
      orderRef(o),
      itemsBlock(o), "",
      totals(o), "",
      `📍 Delivering to: ${address(o)}`, "",
      signoff,
    ].join("\n");
  }
  return statusMessage(o, o.status, upi)!;
}

export const templates: Template[] = [
  { key: "confirm", label: "Confirm + payment details", setStatus: "Confirmed", text: (o, upi) => statusMessage(o, "Confirmed", upi)! },
  {
    key: "paid",
    label: "Payment received",
    text: (o) => [header, "", `Hi ${first(o)} 🙏`, `We've received your payment of *${inr(o.total)}* for order *${o.id}*. Thank you!`, `We're getting your candles ready – you'll hear from us when they're packed. ✨`, "", signoff].join("\n"),
  },
  { key: "packed", label: "Packed", setStatus: "Packed", text: (o) => statusMessage(o, "Packed")! },
  { key: "shipped", label: "Shipped + tracking", setStatus: "Shipped", text: (o) => statusMessage(o, "Shipped")! },
  { key: "delivered", label: "Delivered – thank you", setStatus: "Delivered", text: (o) => statusMessage(o, "Delivered")! },
  {
    key: "unavailable",
    label: "Item unavailable",
    text: (o) => [header, "", `Hi ${first(o)},`, `We're so sorry – an item in your order *${o.id}* is currently unavailable. 🙏`, `Would you like a replacement, or shall we adjust your order? Just reply here.`, "", signoff].join("\n"),
  },
];

export const waToCustomer = (o: AdminOrder, text?: string) => waLink(toWaNumber(o.whatsapp || o.mobile), text);

/**
 * Opens WhatsApp with the message. Must be called synchronously inside the click/change handler
 * (before any await) so the browser treats it as a user action and doesn't block the new tab.
 * Returns false if the browser blocked it.
 */
export function openWhatsApp(o: AdminOrder, text: string): boolean {
  const w = window.open(waToCustomer(o, text), "_blank");
  if (!w) return false;
  w.opener = null;
  return true;
}
