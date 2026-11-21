"use client";
import Link from "next/link";
import { useMemo } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Panel, StatusBadge, when } from "@/components/admin/ui";
import { dashboardStats } from "@/lib/admin-stats";
import { inr } from "@/lib/money";

export default function Dashboard() {
  const { orders, loading, base } = useAdmin();
  const s = useMemo(() => dashboardStats(orders), [orders]);
  const max = Math.max(1, ...s.days.map((d) => d.total));
  const href = (p: string) => base + p || "/";

  if (loading) return <p className="text-taupe">Loading…</p>;
  return (
    <div className="space-y-5 max-w-6xl">
      <div className="rounded-2xl bg-black text-white p-5 md:p-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold">Today&apos;s sales</p>
          <p className="font-serif text-5xl mt-1">{inr(s.todaySales)}</p>
          <p className="text-white/60 text-sm mt-1">{s.todayOrders} order{s.todayOrders === 1 ? "" : "s"} today</p>
        </div>
        <Link href={href("/orders/new")} className="btn btn-gold">+ New order</Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([["This month", inr(s.monthSales), `${s.monthOrders} orders`], ["Average order", inr(s.avgOrder), "excl. cancelled"], ["Customers", String(s.customers), "unique mobiles"], ["All orders", String(orders.length), "ever"]] as const).map(([k, v, sub]) => (
          <div key={k} className="card p-4"><p className="text-xs text-taupe">{k}</p><p className="font-serif text-2xl mt-1">{v}</p><p className="text-[11px] text-taupe">{sub}</p></div>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(["New", "Confirmed", "Packed", "Shipped"] as const).map((k) => (
          <Link key={k} href={href(`/orders?status=${k}`)} className={`card p-4 hover:shadow-md ${k === "New" && s.counts.New > 0 ? "border-gold ring-1 ring-gold" : ""}`}>
            <p className="text-xs text-taupe">To do · {k}</p>
            <p className="font-serif text-3xl mt-1">{s.counts[k]}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <Panel title="Last 7 days">
            <div className="flex items-end gap-2 h-44" role="img" aria-label="Sales for the last 7 days">
              {s.days.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
                  <span className="text-[10px] text-taupe">{d.total ? inr(d.total) : ""}</span>
                  <div className="w-full rounded-t bg-gold" style={{ height: `${Math.max(d.total ? 6 : 2, (d.total / max) * 100)}%`, opacity: d.total ? 1 : 0.3 }} />
                  <span className="text-[11px]">{d.label}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
        <Panel title="Best sellers">
          {s.bestSellers.length === 0 ? <p className="text-sm text-taupe">No sales yet.</p> : (
            <ol className="space-y-2.5 text-sm">
              {s.bestSellers.map((b, i) => (
                <li key={b.name} className="flex justify-between gap-2"><span><b className="text-gold-deep mr-1.5">{i + 1}</b>{b.name}</span><span className="text-taupe whitespace-nowrap">{b.qty} sold · {inr(b.revenue)}</span></li>
              ))}
            </ol>
          )}
        </Panel>
      </div>

      <Panel title="Latest orders" right={<Link href={href("/orders")} className="text-sm underline text-gold-deep">All orders</Link>}>
        {s.latest.length === 0 ? <p className="text-sm text-taupe">No orders yet.</p> : (
          <ul className="divide-y divide-line">
            {s.latest.map((o) => (
              <li key={o.id}>
                <Link href={href(`/orders/${o.id}`)} className="flex items-center justify-between gap-3 py-3 hover:bg-oat/60 -mx-2 px-2 rounded">
                  <span className="min-w-0"><b className="block text-sm">{o.id}</b><span className="text-xs text-taupe truncate block">{o.name} · {o.city} · {when(o.date)}</span></span>
                  <span className="text-right shrink-0"><b className="block text-sm">{inr(o.total)}</b><StatusBadge s={o.status} /></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}
