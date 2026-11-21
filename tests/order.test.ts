import { describe, expect, it } from "vitest";
import { buildOrder, makeFallbackId, orderInputSchema, FALLBACK_ID, type OrderInput } from "@/lib/order";
import { mergeCatalog, isVisible } from "@/lib/catalog";
import { business } from "@/config/business";
import { calcTotals } from "@/lib/pricing";

const catalog = mergeCatalog(
  [
    { slug: "advent-candle", variant: "2 × 12 inch", price: 400, inStock: true },
    { slug: "plain-white-pillar", variant: "Standard", price: 150, inStock: false },
  ],
  [{ slug: "unpriced-test", category: "pillar-candles", name: "Unpriced Test", shortDescription: "", description: "", variants: [{ label: "Standard", price: null }], details: [], images: [], active: true, inStock: true, sortOrder: 999, highlights: [] }],
);

const input = (over: Partial<OrderInput> = {}): OrderInput => {
  const items = [{ slug: "advent-candle", variant: "2 × 12 inch", qty: 3, price: 400 }];
  return orderInputSchema.parse({
    items,
    customer: { name: "Asha K", mobile: "9876543210", whatsapp: "9876543210" },
    address: { line1: "12 MG Road", area: "Indiranagar", city: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", pincode: "560038" },
    giftWrap: false, giftMessage: "", note: "",
    total: calcTotals(items).total,
    ...over,
  });
};

describe("catalogue", () => {
  it("hides products with no price", () => {
    expect(isVisible(catalog.find((p) => p.slug === "unpriced-test")!)).toBe(false);
    expect(isVisible(catalog.find((p) => p.slug === "advent-candle")!)).toBe(true);
  });
  it("marks a product out of stock when every variant is out", () => {
    expect(catalog.find((p) => p.slug === "plain-white-pillar")!.inStock).toBe(false);
  });
  it("combos go out of stock when an item inside is out of stock", () => {
    const combo = { ...catalog[0], slug: "combo-1", comboItems: [{ slug: "advent-candle", variant: "2 × 12 inch", qty: 1 }, { slug: "plain-white-pillar", variant: "Standard", qty: 1 }], variants: [{ label: "Combo", price: 500 }], custom: true };
    const merged = mergeCatalog([{ slug: "plain-white-pillar", variant: "Standard", price: 150, inStock: false }], [combo]);
    expect(merged.find((p) => p.slug === "combo-1")!.inStock).toBe(false);
  });
});

describe("buildOrder (server-side pricing)", () => {
  it("prices from the catalogue and builds the order", () => {
    const r = buildOrder(input(), catalog);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.order.subtotal).toBe(1200);
      expect(r.order.total).toBe(1200 + (1200 >= business.freeDeliveryThreshold ? 0 : business.deliveryCharge));
      expect(r.order.state).toBe("Karnataka"); // other-state orders work
    }
  });
  it("rejects a tampered unit price", () => {
    const r = buildOrder(input({ items: [{ slug: "advent-candle", variant: "2 × 12 inch", qty: 3, price: 1 }], total: 3 }), catalog);
    expect(r).toMatchObject({ ok: false, error: "price-mismatch", status: 409 });
  });
  it("rejects a tampered total", () => {
    const r = buildOrder(input({ total: 1 }), catalog);
    expect(r).toMatchObject({ ok: false, error: "price-mismatch" });
  });
  it("rejects unknown, unpriced and out-of-stock products", () => {
    expect(buildOrder(input({ items: [{ slug: "nope", variant: "x", qty: 1, price: 1 }] }), catalog)).toMatchObject({ ok: false, error: "unknown-product" });
    expect(buildOrder(input({ items: [{ slug: "unpriced-test", variant: "Standard", qty: 1, price: 1 }] }), catalog)).toMatchObject({ ok: false, error: "unknown-product" });
    expect(buildOrder(input({ items: [{ slug: "plain-white-pillar", variant: "Standard", qty: 1, price: 150 }], total: 210 }), catalog)).toMatchObject({ ok: false, error: "out-of-stock" });
  });
  it("includes gift wrap in the server total", () => {
    const base = input();
    const t = calcTotals([{ price: 400, qty: 3 }], { giftWrap: true });
    const r = buildOrder({ ...base, giftWrap: true, total: t.total }, catalog);
    expect(r.ok && r.order.giftWrap).toBe(business.giftWrapPrice);
  });
  it("lenient retry accepts changed prices but flags the order", () => {
    const r = buildOrder(input({ items: [{ slug: "advent-candle", variant: "2 × 12 inch", qty: 3, price: 350 }], total: 1110 }), catalog, { lenient: true });
    expect(r.ok && r.order.subtotal).toBe(1200);
    expect(r.ok && r.order.note).toContain("Price changed");
  });
});

describe("validation", () => {
  const bad = (over: object) => orderInputSchema.safeParse({ ...input(), ...over }).success;
  it("checks mobile, pincode and state", () => {
    expect(bad({ customer: { name: "A B", mobile: "12345", whatsapp: "9876543210" } })).toBe(false);
    expect(bad({ address: { ...input().address, pincode: "012345" } })).toBe(false); // first digit 0 is not an Indian delivery pincode
    expect(bad({ address: { ...input().address, pincode: "9" + "12345" } })).toBe(false);
    expect(bad({ address: { ...input().address, state: "Narnia" } })).toBe(false);
    expect(bad({ items: [] })).toBe(false);
  });
  it("accepts pincodes starting 1–8", () => {
    for (const d of "12345678") expect(bad({ address: { ...input().address, pincode: d + "00001" } })).toBe(true);
  });
});

describe("fallback IDs", () => {
  it("look like CF-YYMM-R####", () => {
    const id = makeFallbackId(new Date("2026-11-20T10:00:00Z"), () => 0.4821);
    expect(id).toMatch(FALLBACK_ID);
    expect(id.startsWith(`${business.orderPrefix}-2611-R`)).toBe(true);
  });
});
