import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mergeCatalog } from "@/lib/catalog";
import { calcTotals } from "@/lib/pricing";

vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn, revalidateTag: vi.fn() }));
const catalog = mergeCatalog([{ slug: "advent-candle", variant: "2 × 12 inch", price: 400, inStock: true }], null);
vi.mock("@/lib/server-catalog", () => ({ getCatalog: async () => catalog }));

const body = (over: object = {}) => {
  const items = [{ slug: "advent-candle", variant: "2 × 12 inch", qty: 3, price: 400 }];
  return {
    items,
    customer: { name: "Asha K", mobile: "9876543210", whatsapp: "9876543210" },
    address: { line1: "12 MG Road", area: "Indiranagar", city: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", pincode: "560038" },
    giftWrap: false, giftMessage: "", note: "", total: calcTotals(items).total, ...over,
  };
};
const post = (b: unknown) => new Request("http://x/api/order", { method: "POST", body: JSON.stringify(b), headers: { "content-type": "application/json" } });

const realFetch = globalThis.fetch;
beforeEach(() => { delete process.env.ORDER_WEBHOOK_URL; delete process.env.ORDER_WEBHOOK_SECRET; });
afterEach(() => { globalThis.fetch = realFetch; });

describe("POST /api/order", () => {
  it("works without the sheet: fallback ID + queued", async () => {
    const { POST } = await import("@/app/api/order/route");
    const res = await POST(post(body()));
    const d = await res.json();
    expect(res.status).toBe(200);
    expect(d).toMatchObject({ ok: true, queued: true });
    expect(d.id).toMatch(/^CF-\d{4}-R\d{4}$/);
    expect(d.order.total).toBe(1200);
  });

  it("with the sheet: follows Apps Script's 302 redirect and returns the sequential ID", async () => {
    process.env.ORDER_WEBHOOK_URL = "https://script.google.com/macros/s/abc/exec";
    process.env.ORDER_WEBHOOK_SECRET = "s3cret";
    const calls: { url: string; method?: string; body?: string }[] = [];
    globalThis.fetch = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
      calls.push({ url: String(url), method: init?.method, body: init?.body as string });
      if (String(url).startsWith("https://script.google.com")) {
        return new Response(null, { status: 302, headers: { location: "https://script.googleusercontent.com/macros/echo?x=1" } });
      }
      return new Response(JSON.stringify({ ok: true, id: "CF-2611-0007" }), { status: 200 });
    }) as typeof fetch;
    const { POST } = await import("@/app/api/order/route");
    const d = await (await POST(post(body()))).json();
    expect(d).toMatchObject({ ok: true, id: "CF-2611-0007", queued: false });
    expect(calls).toHaveLength(2);
    expect(calls[1].url).toContain("googleusercontent");
    const sent = JSON.parse(calls[0].body!);
    expect(sent.secret).toBe("s3cret");
    expect(sent.action).toBe("order");
    expect(sent.order.total).toBe(1200); // server-computed
  });

  it("falls back when the sheet errors or times out", async () => {
    process.env.ORDER_WEBHOOK_URL = "https://script.google.com/macros/s/abc/exec";
    process.env.ORDER_WEBHOOK_SECRET = "s";
    globalThis.fetch = vi.fn(async () => { throw new Error("network"); }) as typeof fetch;
    const { POST } = await import("@/app/api/order/route");
    const d = await (await POST(post(body()))).json();
    expect(d).toMatchObject({ ok: true, queued: true });
  });

  it("keeps the queued ID when a retry reaches the sheet", async () => {
    process.env.ORDER_WEBHOOK_URL = "https://script.google.com/x/exec";
    process.env.ORDER_WEBHOOK_SECRET = "s";
    let sent: { orderId?: string } = {};
    globalThis.fetch = vi.fn(async (_u: string | URL | Request, init?: RequestInit) => {
      if (init?.body) sent = JSON.parse(init.body as string);
      return new Response(JSON.stringify({ ok: true, id: sent.orderId }), { status: 200 });
    }) as typeof fetch;
    const { POST } = await import("@/app/api/order/route");
    const d = await (await POST(post(body({ fallbackId: "CF-2611-R4821" })))).json();
    expect(d).toMatchObject({ ok: true, id: "CF-2611-R4821", queued: false });
  });

  it("rejects tampered prices with 409 and never reaches the sheet", async () => {
    globalThis.fetch = vi.fn() as typeof fetch;
    const { POST } = await import("@/app/api/order/route");
    const res = await POST(post(body({ items: [{ slug: "advent-candle", variant: "2 × 12 inch", qty: 3, price: 1 }], total: 3 })));
    expect(res.status).toBe(409);
    expect((await res.json()).error).toBe("price-mismatch");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("rejects invalid input with 400", async () => {
    const { POST } = await import("@/app/api/order/route");
    expect((await POST(post(body({ customer: { name: "A", mobile: "1", whatsapp: "1" } })))).status).toBe(400);
    expect((await POST(new Request("http://x", { method: "POST", body: "not json" }))).status).toBe(400);
  });
});

describe("GET /api/track", () => {
  const get = (q: string) => new Request(`http://x/api/track?${q}`);
  it("validates input", async () => {
    const { GET } = await import("@/app/api/track/route");
    expect((await GET(get("id=bad&mobile=1"))).status).toBe(400);
  });
  it("is unavailable without the sheet", async () => {
    const { GET } = await import("@/app/api/track/route");
    expect((await GET(get("id=CF-2611-0001&mobile=9876543210"))).status).toBe(503);
  });
  it("returns the order, or 404 when not found", async () => {
    process.env.ORDER_WEBHOOK_URL = "https://script.google.com/x/exec";
    process.env.ORDER_WEBHOOK_SECRET = "s";
    const { GET } = await import("@/app/api/track/route");
    globalThis.fetch = vi.fn(async (u: string | URL | Request) => {
      expect(String(u)).toContain("action=track");
      return new Response(JSON.stringify({ ok: true, found: true, order: { id: "CF-2611-0001", status: "Shipped", courier: "DTDC", tracking: "D123", total: 1200, itemsText: "x", itemCount: 1, date: "2026-11-20" } }));
    }) as typeof fetch;
    const ok = await (await GET(get("id=cf-2611-0001&mobile=9876543210"))).json();
    expect(ok.order).toMatchObject({ status: "Shipped", courier: "DTDC", tracking: "D123" });
    globalThis.fetch = vi.fn(async () => new Response(JSON.stringify({ ok: true, found: false }))) as typeof fetch;
    expect((await GET(get("id=CF-2611-0002&mobile=9876543210"))).status).toBe(404);
  });
});
