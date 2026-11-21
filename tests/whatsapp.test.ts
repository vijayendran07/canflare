import { describe, expect, it } from "vitest";
import { orderMessage, ownerWaLink, toWaNumber, waLink } from "@/lib/whatsapp";
import type { Order } from "@/lib/order";
import { business } from "@/config/business";

const order: Order = {
  items: [{ slug: "jar-candle", name: "Jar Candle", variant: "120 ml", qty: 2, price: 525 }],
  itemCount: 2, subtotal: 1050, delivery: 0, giftWrap: 49, discount: 0, total: 1099, payment: "Pending",
  name: "Asha K", mobile: "9876543210", whatsapp: "9876543211", address: "12 MG Road, Indiranagar", city: "Bengaluru",
  state: "Karnataka", district: "Bengaluru Urban", pincode: "560038", giftMessage: "Happy birthday! 🎂", note: "Call first\nplease", source: "Website",
};

describe("WhatsApp message", () => {
  const msg = orderMessage(order, "CF-2611-0001");
  it("contains every required field", () => {
    for (const s of ["CF-2611-0001", "Jar Candle (120 ml) × 2 — ₹1,050", "Subtotal: ₹1,050", "Delivery: FREE", "Gift wrap: ₹49", "Total: ₹1,099", "Asha K", "9876543210", "9876543211", "Karnataka", "560038", "Happy birthday! 🎂", "Call first"]) {
      expect(msg).toContain(s);
    }
  });
  it("encodes ₹, emoji and line breaks and round-trips", () => {
    const link = ownerWaLink(msg);
    expect(link.startsWith(`https://wa.me/${business.whatsapp}?text=`)).toBe(true);
    const text = decodeURIComponent(link.split("?text=")[1]);
    expect(text).toBe(msg);
    expect(link).toContain("%E2%82%B9"); // ₹
    expect(link).toContain("%0A"); // newline
    expect(link).not.toMatch(/\s/);
  });
  it("normalises Indian numbers", () => {
    expect(toWaNumber("9876543210")).toBe("919876543210");
    expect(waLink("919876543210")).toBe("https://wa.me/919876543210");
  });
});
