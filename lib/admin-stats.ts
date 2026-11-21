import type { AdminOrder } from "@/lib/admin-types";

const IST = 5.5 * 3600_000;
/** yyyy-mm-dd in India time */
export const istDay = (d: Date | string | number) => new Date(new Date(d).getTime() + IST).toISOString().slice(0, 10);

const counted = (o: AdminOrder) => o.status !== "Cancelled";

export function dashboardStats(orders: AdminOrder[], now = new Date()) {
  const today = istDay(now);
  const month = today.slice(0, 7);
  const live = orders.filter(counted);

  const sum = (l: AdminOrder[]) => l.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const todays = live.filter((o) => istDay(o.date) === today);
  const thisMonth = live.filter((o) => istDay(o.date).startsWith(month));

  const customers = new Set(live.map((o) => String(o.mobile).slice(-10)).filter(Boolean)).size;

  const counts = { New: 0, Confirmed: 0, Packed: 0, Shipped: 0 };
  for (const o of orders) if (o.status in counts) counts[o.status as keyof typeof counts]++;

  const days: { day: string; label: string; total: number; orders: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = istDay(new Date(now.getTime() - i * 86400_000));
    const l = live.filter((o) => istDay(o.date) === d);
    days.push({ day: d, label: new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", { weekday: "short", timeZone: "UTC" }), total: sum(l), orders: l.length });
  }

  const sellers = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const o of live) for (const it of o.items ?? []) {
    const s = sellers.get(it.name) ?? { name: it.name, qty: 0, revenue: 0 };
    s.qty += it.qty;
    s.revenue += it.qty * it.price;
    sellers.set(it.name, s);
  }

  return {
    todaySales: sum(todays),
    todayOrders: todays.length,
    monthSales: sum(thisMonth),
    monthOrders: thisMonth.length,
    avgOrder: live.length ? Math.round(sum(live) / live.length) : 0,
    customers,
    counts,
    days,
    bestSellers: [...sellers.values()].sort((a, b) => b.qty - a.qty).slice(0, 5),
    latest: orders.slice(0, 6),
  };
}

export const ordersByPhone = (orders: AdminOrder[], mobile: string, exceptId?: string) =>
  orders.filter((o) => String(o.mobile).slice(-10) === String(mobile).slice(-10) && o.id !== exceptId);

export function csvOf(orders: AdminOrder[]): string {
  const cols: [string, (o: AdminOrder) => unknown][] = [
    ["Order ID", (o) => o.id], ["Date", (o) => o.date], ["Status", (o) => o.status], ["Items", (o) => o.itemsText],
    ["Item count", (o) => o.itemCount], ["Subtotal", (o) => o.subtotal], ["Delivery", (o) => o.delivery], ["Gift wrap", (o) => o.giftWrap],
    ["Discount", (o) => o.discount], ["Total", (o) => o.total], ["Payment", (o) => o.payment], ["Name", (o) => o.name], ["Mobile", (o) => o.mobile],
    ["Address", (o) => o.address], ["City", (o) => o.city], ["State", (o) => o.state], ["Pincode", (o) => o.pincode],
    ["Courier", (o) => o.courier], ["Tracking", (o) => o.tracking], ["Source", (o) => o.source], ["Note", (o) => o.note],
  ];
  // guard against CSV/spreadsheet formula injection in exported text
  const cell = (v: unknown) => {
    let s = String(v ?? "");
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [cols.map((c) => cell(c[0])).join(","), ...orders.map((o) => cols.map((c) => cell(c[1](o))).join(","))].join("\r\n");
}
