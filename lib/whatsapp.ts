import { business } from "@/config/business";
import { inr } from "@/lib/money";
import type { Order } from "@/lib/order";

export const waLink = (number: string, text?: string) =>
  `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/** Indian 10-digit number -> wa.me international number */
export const toWaNumber = (mobile: string) => {
  const d = mobile.replace(/\D/g, "");
  return d.length === 10 ? `91${d}` : d;
};

export const ownerWaLink = (text?: string) => waLink(business.whatsapp, text);

export function itemsText(order: Pick<Order, "items">): string {
  return order.items.map((i) => `• ${i.name} (${i.variant}) × ${i.qty} — ${inr(i.price * i.qty)}`).join("\n");
}

/** The message the customer sends to the owner after placing an order. */
export function orderMessage(order: Order, id: string): string {
  const L: string[] = [];
  L.push(`🕯️ *New order – ${business.name}*`);
  L.push(`Order ID: *${id}*`);
  L.push("");
  L.push("*Items*");
  L.push(itemsText(order));
  L.push("");
  L.push(`Subtotal: ${inr(order.subtotal)}`);
  L.push(`Delivery: ${order.delivery === 0 ? "FREE" : inr(order.delivery)}`);
  if (order.giftWrap > 0) L.push(`Gift wrap: ${inr(order.giftWrap)}`);
  if (order.discount > 0) L.push(`Discount: -${inr(order.discount)}`);
  L.push(`*Total: ${inr(order.total)}*`);
  L.push("");
  L.push(`👤 ${order.name}`);
  L.push(`📞 ${order.mobile}`);
  if (order.whatsapp && order.whatsapp !== order.mobile) L.push(`💬 WhatsApp: ${order.whatsapp}`);
  L.push(`📍 ${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}`);
  if (order.giftMessage) L.push(`🎁 Gift message: ${order.giftMessage}`);
  if (order.note) L.push(`📝 Note: ${order.note}`);
  return L.join("\n");
}

/** "Buy on WhatsApp" for a single product page. */
export function productEnquiry(name: string, variant: string, qty: number, price: number, url: string): string {
  return `Hi ${business.name}! I'd like to order:\n• ${name} (${variant}) × ${qty} — ${inr(price * qty)}\n${url}`;
}
