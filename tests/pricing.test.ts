import { describe, expect, it } from "vitest";
import { business } from "@/config/business";
import { calcTotals, deliveryFor } from "@/lib/pricing";
import { inr } from "@/lib/money";

const T = business.freeDeliveryThreshold;

describe("money", () => {
  it("formats whole rupees with Indian grouping", () => {
    expect(inr(1050)).toBe("₹1,050");
    expect(inr(125000)).toBe("₹1,25,000");
    expect(inr(499.4)).toBe("₹499");
    expect(inr(0)).toBe("₹0");
  });
});

describe("cart maths", () => {
  it("sums lines and counts items", () => {
    const t = calcTotals([{ price: 499, qty: 2 }, { price: 100, qty: 1 }]);
    expect(t.subtotal).toBe(1098);
    expect(t.itemCount).toBe(3);
  });
  it("charges delivery below the free-delivery threshold", () => {
    const t = calcTotals([{ price: T - 1, qty: 1 }]);
    expect(t.delivery).toBe(business.deliveryCharge);
    expect(t.toFree).toBe(1);
    expect(t.total).toBe(T - 1 + business.deliveryCharge);
  });
  it("is free exactly at the threshold and above", () => {
    expect(calcTotals([{ price: T, qty: 1 }]).delivery).toBe(0);
    expect(calcTotals([{ price: T, qty: 2 }]).toFree).toBe(0);
  });
  it("adds gift wrap from config to the total", () => {
    const base = calcTotals([{ price: T, qty: 1 }]);
    const gift = calcTotals([{ price: T, qty: 1 }], { giftWrap: true });
    expect(gift.giftWrap).toBe(business.giftWrapPrice);
    expect(gift.total - base.total).toBe(business.giftWrapPrice);
  });
  it("has no charges for an empty cart", () => {
    const t = calcTotals([], { giftWrap: true });
    expect(t.total).toBe(0);
    expect(deliveryFor(0)).toBe(0);
  });
  it("supports pickup, delivery override and discount (manual orders)", () => {
    expect(calcTotals([{ price: 100, qty: 1 }], { pickup: true }).delivery).toBe(0);
    expect(calcTotals([{ price: 100, qty: 1 }], { deliveryOverride: 25 }).total).toBe(125);
    expect(calcTotals([{ price: 100, qty: 1 }], { pickup: true, discount: 30 }).total).toBe(70);
    expect(calcTotals([{ price: 100, qty: 1 }], { pickup: true, discount: 999 }).total).toBe(0);
  });
});
