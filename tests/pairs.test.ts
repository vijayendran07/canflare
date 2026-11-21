import { describe, expect, it } from "vitest";
import { coBought } from "@/lib/pairs";

const o = (slugs: string[], status = "Delivered") => ({ status, items: slugs.map((slug) => ({ slug })) });

describe("frequently bought together (real orders only)", () => {
  it("returns nothing without enough real data", () => {
    expect(coBought([], ["a"])).toEqual([]);
    expect(coBought([o(["a", "b"])], ["a"])).toEqual([]); // only 1 order
    expect(coBought([o(["a", "b"]), o(["a", "b"])], [])).toEqual([]);
  });
  it("suggests items that co-occur in ≥2 orders, most frequent first, excluding the cart", () => {
    const orders = [o(["a", "b"]), o(["a", "b", "c"]), o(["a", "c"]), o(["a", "b"]), o(["x", "y"])];
    expect(coBought(orders, ["a"])).toEqual(["b", "c"]);
    expect(coBought(orders, ["a", "b"])).toEqual(["c"]); // c appears in 2 orders that contain a cart item
  });
  it("ignores cancelled orders and custom lines", () => {
    expect(coBought([o(["a", "b"], "Cancelled"), o(["a", "b"], "Cancelled")], ["a"])).toEqual([]);
    expect(coBought([o(["a", "custom"]), o(["a", "custom"])], ["a"])).toEqual([]);
  });
});
