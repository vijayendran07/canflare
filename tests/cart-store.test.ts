import { beforeEach, describe, expect, it, vi } from "vitest";

function fakeStorage(initial: Record<string, string> = {}, opts: { throws?: boolean } = {}) {
  const data = { ...initial };
  const writes: string[] = [];
  const s = {
    data, writes,
    getItem: (k: string) => { if (opts.throws) throw new Error("blocked"); return data[k] ?? null; },
    setItem: (k: string, v: string) => { if (opts.throws) throw new Error("blocked"); writes.push(k); data[k] = v; },
    removeItem: (k: string) => { delete data[k]; },
  };
  return s;
}

const KEY = "canflare-cart-v1";
const saved = JSON.stringify({ state: { items: [{ slug: "a", variant: "120 ml", name: "A", price: 100, qty: 2 }] }, version: 0 });

async function load(storage: ReturnType<typeof fakeStorage>) {
  vi.resetModules();
  vi.stubGlobal("localStorage", storage);
  return (await import("@/store/cart")).useCart;
}

describe("cart store", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("restores the saved cart on load", async () => {
    const use = await load(fakeStorage({ [KEY]: saved }));
    expect(use.getState().items).toHaveLength(1);
    expect(use.getState().items[0].qty).toBe(2);
  });

  it("never wipes the saved cart just by loading (no write before hydration)", async () => {
    const st = fakeStorage({ [KEY]: saved });
    await load(st);
    expect(st.data[KEY]).toBe(saved);
  });

  it("treats different variants of one product as separate lines and merges equal ones", async () => {
    const use = await load(fakeStorage());
    const { add, setQty } = use.getState();
    add({ slug: "adv", variant: "2 × 12 inch", name: "Advent", price: 300 });
    add({ slug: "adv", variant: "2 × 6 inch", name: "Advent", price: 150 });
    add({ slug: "adv", variant: "2 × 12 inch", name: "Advent", price: 300 }, 2);
    let items = use.getState().items;
    expect(items).toHaveLength(2);
    expect(items.find((i) => i.variant === "2 × 12 inch")!.qty).toBe(3);
    setQty("adv", "2 × 6 inch", 0);
    items = use.getState().items;
    expect(items).toHaveLength(1);
  });

  it("persists changes after hydration", async () => {
    const st = fakeStorage();
    const use = await load(st);
    use.getState().add({ slug: "x", variant: "v", name: "X", price: 10 });
    expect(JSON.parse(st.data[KEY]).state.items[0].slug).toBe("x");
  });

  it("survives storage that throws", async () => {
    const use = await load(fakeStorage({}, { throws: true }));
    expect(() => use.getState().add({ slug: "x", variant: "v", name: "X", price: 10 })).not.toThrow();
    expect(use.getState().items).toHaveLength(1);
  });

  it("sync updates prices and drops unavailable lines", async () => {
    const use = await load(fakeStorage());
    const s = use.getState();
    s.add({ slug: "a", variant: "v", name: "A", price: 100 });
    s.add({ slug: "b", variant: "v", name: "B", price: 50 });
    use.getState().sync([{ slug: "a", variant: "v", price: 120 }]);
    expect(use.getState().items).toEqual([expect.objectContaining({ slug: "a", price: 120 })]);
  });
});
