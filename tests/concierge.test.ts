import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mergeCatalog } from "@/lib/catalog";
import { buildSystemPrompt, parseReply } from "@/lib/concierge";

vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn, revalidateTag: vi.fn() }));
const catalog = mergeCatalog(
  [
    { slug: "advent-candle", variant: "2 × 12 inch", price: 400, inStock: true },
    { slug: "plain-white-pillar", variant: "Standard", price: 150, inStock: false },
  ],
  [{ slug: "unpriced-test", category: "pillar-candles", name: "Unpriced Test", shortDescription: "", description: "", variants: [{ label: "Standard", price: null }], details: [], images: [], active: true, inStock: true, sortOrder: 999, highlights: [] }],
);
vi.mock("@/lib/server-catalog", () => ({ getCatalog: async () => catalog }));

const realFetch = globalThis.fetch;
beforeEach(() => { delete process.env.CONCIERGE_API_KEY; });
afterEach(() => { globalThis.fetch = realFetch; });

const post = (messages: unknown, ip = "1.1.1.1") =>
  new Request("http://x/api/concierge", { method: "POST", body: JSON.stringify({ messages }), headers: { "content-type": "application/json", "x-forwarded-for": ip } });
const model = (text: string) => vi.fn(async () => new Response(JSON.stringify({ content: [{ type: "text", text }] }), { status: 200 })) as typeof fetch;

describe("concierge prompt grounding", () => {
  const sys = buildSystemPrompt(catalog, { path: "/product/advent-candle", title: "Jar Candle" });
  it("contains only real priced products, policies and strict rules", () => {
    expect(sys).toContain("advent-candle");
    expect(sys).toContain("₹400");
    expect(sys).not.toContain("unpriced-test"); // unpriced → hidden → never mentioned
    expect(sys).toMatch(/Never invent/);
    expect(sys).toContain("/product/advent-candle");
    expect(sys).toMatch(/No online payment|no online payment/);
  });
});

describe("concierge reply parsing", () => {
  it("drops invented, hidden and out-of-stock products", () => {
    const r = parseReply('{"reply":"Try these","products":["advent-candle","made-up","unpriced-test","plain-white-pillar","advent-candle"]}', catalog);
    expect(r.products).toEqual(["advent-candle"]);
  });
  it("tolerates prose around the JSON and non-JSON output", () => {
    expect(parseReply('Sure! {"reply":"Hello","products":[]} bye', catalog).reply).toBe("Hello");
    expect(parseReply("just text", catalog).reply).toBe("just text");
    expect(parseReply("", catalog).reply).toMatch(/WhatsApp/);
  });
});

describe("POST /api/concierge", () => {
  it("is off (501) until an API key is set", async () => {
    const { POST } = await import("@/app/api/concierge/route");
    const res = await POST(post([{ role: "user", content: "hi" }]));
    expect(res.status).toBe(501);
    expect((await res.json()).enabled).toBe(false);
  });
  it("answers from the model but only returns real products", async () => {
    process.env.CONCIERGE_API_KEY = "k";
    globalThis.fetch = model('{"reply":"The Jar Candle is ₹400.","products":["advent-candle","ghost"]}');
    const { POST, _resetLimiter } = await import("@/app/api/concierge/route");
    _resetLimiter();
    const d = await (await POST(post([{ role: "user", content: "gift under 500?" }]))).json();
    expect(d).toMatchObject({ ok: true, reply: "The Jar Candle is ₹400.", products: ["advent-candle"] });
    const sent = JSON.parse((globalThis.fetch as unknown as { mock: { calls: [string, { body: string }][] } }).mock.calls[0][1].body);
    expect(sent.system).toContain("CATALOGUE");
  });
  it("validates input and rate limits", async () => {
    process.env.CONCIERGE_API_KEY = "k";
    globalThis.fetch = model('{"reply":"ok","products":[]}');
    const { POST, _resetLimiter } = await import("@/app/api/concierge/route");
    _resetLimiter();
    expect((await POST(post([{ role: "assistant", content: "x" }]))).status).toBe(400);
    expect((await POST(post([]))).status).toBe(400);
    let last = 200;
    for (let i = 0; i < 21; i++) last = (await POST(post([{ role: "user", content: "hi" }], "9.9.9.9"))).status;
    expect(last).toBe(429);
  });
  it("fails gracefully when the model is down", async () => {
    process.env.CONCIERGE_API_KEY = "k";
    globalThis.fetch = vi.fn(async () => new Response("no", { status: 500 })) as typeof fetch;
    const { POST, _resetLimiter } = await import("@/app/api/concierge/route");
    _resetLimiter();
    const res = await POST(post([{ role: "user", content: "hi" }], "2.2.2.2"));
    expect(res.status).toBe(503);
    expect((await res.json()).reply).toMatch(/WhatsApp/);
  });
});
