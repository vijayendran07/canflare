import { beforeEach, describe, expect, it, vi } from "vitest";
import { dashboardStats, csvOf, ordersByPhone } from "@/lib/admin-stats";
import type { AdminOrder } from "@/lib/admin-types";

vi.mock("next/cache", () => ({ revalidateTag: vi.fn() }));

beforeEach(() => {
  process.env.ADMIN_PASSWORD = "correct horse battery";
  process.env.ADMIN_SESSION_SECRET = "test-secret";
});

describe("admin auth", () => {
  it("checks the password", async () => {
    const a = await import("@/lib/admin-auth");
    expect(a.checkPassword("correct horse battery")).toBe(true);
    expect(a.checkPassword("wrong")).toBe(false);
    expect(a.checkPassword("")).toBe(false);
  });
  it("signs and verifies a 7-day session, rejects tampering and expiry", async () => {
    const a = await import("@/lib/admin-auth");
    const now = Date.now();
    const t = a.createSession(now);
    expect(a.verifySession(t, now + 6 * 86400_000)).toBe(true);
    expect(a.verifySession(t, now + 8 * 86400_000)).toBe(false);
    const [exp, sig] = t.split(".");
    expect(a.verifySession(`${Number(exp) + 1}.${sig}`, now)).toBe(false);
    expect(a.verifySession(`${exp}.${sig.replace(/.$/, "0")}`, now) || a.verifySession(t, now)).toBe(true);
    expect(a.verifySession("garbage", now)).toBe(false);
    expect(a.verifySession(undefined, now)).toBe(false);
  });
  it("throttles repeated failures", async () => {
    const a = await import("@/lib/admin-auth");
    a._resetThrottle();
    for (let i = 0; i < 5; i++) a.recordFail("1.2.3.4");
    expect(a.throttleState("1.2.3.4").locked).toBe(true);
    expect(a.throttleState("9.9.9.9").locked).toBe(false);
  });
  it("login route: 401 on wrong password, sets an httpOnly cookie on success", async () => {
    const { POST } = await import("@/app/api/admin/login/route");
    const a = await import("@/lib/admin-auth");
    a._resetThrottle();
    const mk = (pw: string) => new Request("http://x", { method: "POST", body: JSON.stringify({ password: pw }), headers: { "x-forwarded-for": "5.5.5.5" } });
    expect((await POST(mk("nope"))).status).toBe(401);
    const ok = await POST(mk("correct horse battery"));
    expect(ok.status).toBe(200);
    const cookie = ok.headers.get("set-cookie")!;
    expect(cookie).toContain("cf_admin=");
    expect(cookie.toLowerCase()).toContain("httponly");
  });
  it("protected API routes return 401 without a session", async () => {
    const { GET } = await import("@/app/api/admin/orders/route");
    expect((await GET(new Request("http://x/api/admin/orders"))).status).toBe(401);
    const res = await GET(new Request("http://x/api/admin/orders"));
    expect(res.headers.get("x-robots-tag")).toContain("noindex");
  });
  it("accepts a valid session cookie", async () => {
    const a = await import("@/lib/admin-auth");
    const { guard } = await import("@/lib/admin-api");
    const req = new Request("http://x", { headers: { cookie: `cf_admin=${a.createSession()}` } });
    expect(guard(req)).toBeNull();
  });
});

describe("proxy", () => {
  const run = async (host: string, path: string, env: Record<string, string> = {}) => {
    Object.assign(process.env, { ADMIN_HOST: "admin.example.com", NEXT_PUBLIC_SITE_URL: "https://example.com", ...env });
    const { NextRequest } = await import("next/server");
    const { proxy } = await import("@/proxy");
    return proxy(new NextRequest(`https://${host}${path}`, { headers: { host } }));
  };
  it("hides /admin and /api/admin on the shop domain once ADMIN_HOST is set", async () => {
    expect((await run("example.com", "/admin")).status).toBe(404);
    expect((await run("example.com", "/api/admin/orders")).status).toBe(404);
  });
  it("rewrites admin host paths to /admin and marks them noindex", async () => {
    const r = await run("admin.example.com", "/orders");
    expect(r.headers.get("x-middleware-rewrite")).toContain("/admin/orders");
    expect(r.headers.get("x-robots-tag")).toContain("noindex");
    const root = await run("admin.example.com", "/");
    expect(root.headers.get("x-middleware-rewrite")).toMatch(/\/admin$/);
  });
  it("serves a Disallow-all robots.txt on the admin host", async () => {
    const r = await run("admin.example.com", "/robots.txt");
    expect(await r.text()).toContain("Disallow: /");
  });
  it("redirects www and vercel.app to the main domain with 308", async () => {
    const w = await run("www.example.com", "/shop?x=1");
    expect(w.status).toBe(308);
    expect(w.headers.get("location")).toBe("https://example.com/shop?x=1");
    expect((await run("canflare.vercel.app", "/")).status).toBe(308);
  });
  it("leaves the shop alone", async () => {
    const r = await run("example.com", "/shop");
    expect(r.status).toBe(200);
  });
});

const mkOrder = (over: Partial<AdminOrder>): AdminOrder => ({
  id: "CF-2611-0001", date: new Date().toISOString(), status: "New", itemsText: "", items: [{ name: "Jar Candle", qty: 2, price: 400 }], itemCount: 2,
  subtotal: 800, delivery: 60, giftWrap: 0, discount: 0, total: 860, payment: "Pending", name: "A", mobile: "9876543210", whatsapp: "9876543210",
  address: "x", city: "c", state: "s", district: "d", pincode: "600001", giftMessage: "", note: "", courier: "", tracking: "", source: "Website", adminNote: "", updatedAt: "", ...over,
});

describe("dashboard stats", () => {
  it("counts today, month, AOV, customers and ignores cancelled orders", () => {
    const now = new Date();
    const old = new Date(now.getTime() - 40 * 86400_000).toISOString();
    const orders = [
      mkOrder({ id: "1", total: 1000 }),
      mkOrder({ id: "2", total: 500, mobile: "9000000001" }),
      mkOrder({ id: "3", total: 9999, status: "Cancelled" }),
      mkOrder({ id: "4", total: 300, date: old, status: "Shipped" }),
    ];
    const s = dashboardStats(orders, now);
    expect(s.todaySales).toBe(1500);
    expect(s.todayOrders).toBe(2);
    expect(s.avgOrder).toBe(600);
    expect(s.customers).toBe(2);
    expect(s.counts).toMatchObject({ New: 2, Shipped: 1 });
    expect(s.days).toHaveLength(7);
    expect(s.bestSellers[0]).toMatchObject({ name: "Jar Candle", qty: 6 });
  });
  it("finds repeat customers and neutralises CSV formulas", () => {
    const a = mkOrder({ id: "A" }), b = mkOrder({ id: "B" });
    expect(ordersByPhone([a, b], "9876543210", "A").map((o) => o.id)).toEqual(["B"]);
    expect(csvOf([mkOrder({ name: '=HYPERLINK("x")' })])).toContain(`"'=HYPERLINK(""x"")"`);
  });
});
