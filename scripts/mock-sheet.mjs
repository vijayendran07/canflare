// Local stand-in for the Google Apps Script web app (for testing only). Run: npm run mock-sheet
// Use with .env.local: ORDER_WEBHOOK_URL=http://localhost:4010/exec  ORDER_WEBHOOK_SECRET=testsecret
// Local stand-in for the Apps Script web app: same protocol (secret, 302 redirect), in-memory data.
import http from "http";
const SECRET = "testsecret";
const orders = []; let n = 0; let rows = null; let custom = [];
const send = (res, o) => { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(o)); };
const handle = (a, b) => {
  if (b.secret !== SECRET) return { ok: false, error: "unauthorized" };
  switch (a) {
    case "products": return { ok: true, rows: rows ?? [] };
    case "custom": return { ok: true, items: custom };
    case "admin_orders": return { ok: true, orders: [...orders].reverse() };
    case "track": { const o = orders.find((x) => x.id === b.id); if (!o || o.mobile.slice(-10) !== b.mobile) return { ok: true, found: false }; return { ok: true, found: true, order: { id: o.id, date: o.date, status: o.status, itemsText: o.itemsText, itemCount: o.itemCount, total: o.total, courier: o.courier, tracking: o.tracking } }; }
    case "order": {
      const o = b.order; let id = b.orderId; const ex = orders.find((x) => x.id === id); if (ex) return { ok: true, id, duplicate: true };
      if (!id) id = `CF-2611-${String(++n).padStart(4, "0")}`;
      orders.push({ ...o, id, date: new Date().toISOString(), status: o.status || "New", courier: "", tracking: "", adminNote: "", updatedAt: "", discount: o.discount || 0,
        itemsText: o.items.map((i) => `${i.name} (${i.variant}) × ${i.qty}`).join("\n") });
      console.log("ORDER", id, o.total); return { ok: true, id };
    }
    case "admin_update": { const o = orders.find((x) => x.id === b.id); if (!o) return { ok: false, error: "not-found" }; for (const k of ["status", "courier", "tracking", "adminNote", "payment"]) if (b[k] !== undefined) o[k] = b[k]; return { ok: true }; }
    case "admin_products_save": rows = b.rows; return { ok: true };
    case "admin_custom_save": custom = [...custom.filter((c) => c.slug !== b.item.slug), b.item]; return { ok: true };
    case "admin_custom_delete": custom = custom.filter((c) => c.slug !== b.slug); return { ok: true };
  }
  return { ok: false, error: "unknown-action" };
};
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  if (u.pathname === "/exec") { // like Apps Script: 302 to an "echo" URL
    let body = ""; req.on("data", (c) => (body += c)); req.on("end", () => {
      const params = req.method === "POST" ? JSON.parse(body) : Object.fromEntries(u.searchParams);
      const k = Math.random().toString(36).slice(2); (globalThis.__p ??= {})[k] = { action: params.action, params };
      res.writeHead(302, { location: "http://localhost:4010/echo?k=" + k }); res.end();
    });
  } else if (u.pathname === "/echo") { const p = globalThis.__p[u.searchParams.get("k")]; send(res, handle(p.action, p.params)); }
  else { res.writeHead(404); res.end(); }
}).listen(4010, () => console.log("mock sheet on 4010"));
