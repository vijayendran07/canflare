import { describe, expect, it } from "vitest";
import { statusMessage, templates, waToCustomer } from "@/lib/admin-wa";
import type { AdminOrder } from "@/lib/admin-types";

const o: AdminOrder = {
  id: "CF-2611-0002", date: "2026-11-21", status: "New", itemsText: "", items: [{ slug: "x", name: "Pink & White Votive Pair", variant: "Standard", qty: 3, price: 20 }],
  itemCount: 3, subtotal: 60, delivery: 60, giftWrap: 0, discount: 0, total: 120, payment: "Pending", name: "Priya Raman", mobile: "9840011122", whatsapp: "9840011122",
  address: "12 Lake Road, Adyar", city: "Chennai", state: "Tamil Nadu", district: "Chennai", pincode: "600020", giftMessage: "", note: "", courier: "DTDC", tracking: "D1234567", source: "Website", adminNote: "", updatedAt: "",
};

describe("premium status messages", () => {
  it("confirmed: greeting, items without 'Standard', total, payment with UPI, emojis, sign-off", () => {
    const t = statusMessage(o, "Confirmed", "canflare@upi")!;
    for (const s of ["✨ *CANFLARE* ✨", "Hi Priya", "*confirmed* ✅", "Order *CF-2611-0002*", "• Pink & White Votive Pair × 3 — ₹60", "*Total: ₹120*", "UPI to *canflare@upi*", "*Team Canflare* 🕯️"]) expect(t).toContain(s);
    expect(t).not.toContain("(Standard)");
  });
  it("shipped includes courier and tracking; no empty-line runs", () => {
    const t = statusMessage(o, "Shipped")!;
    expect(t).toContain("Courier: *DTDC*");
    expect(t).toContain("Tracking no.: *D1234567*");
    expect(t).not.toMatch(/\n\n\n/);
    expect(statusMessage({ ...o, courier: "", tracking: "" }, "Shipped")).not.toContain("Courier");
  });
  it("has a message for every status except New", () => {
    for (const s of ["Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"] as const) expect(statusMessage(o, s)).toBeTruthy();
    expect(statusMessage(o, "New")).toBeNull();
  });
  it("templates reuse the premium texts and the link goes to the customer's WhatsApp", () => {
    expect(templates.find((t) => t.key === "packed")!.text(o)).toBe(statusMessage(o, "Packed"));
    const link = waToCustomer(o, statusMessage(o, "Delivered")!);
    expect(link.startsWith("https://wa.me/919840011122?text=")).toBe(true);
    expect(decodeURIComponent(link.split("?text=")[1])).toContain("🏡");
  });
});

import { contactMessage } from "@/lib/admin-wa";
describe("WhatsApp button message", () => {
  it("new orders get an order-received message; others get their status message", () => {
    expect(contactMessage(o)).toContain("We've received it");
    expect(contactMessage({ ...o, status: "Packed" })).toBe(statusMessage({ ...o, status: "Packed" }, "Packed"));
  });
});
