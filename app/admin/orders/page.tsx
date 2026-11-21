"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { StatusBadge, when } from "@/components/admin/ui";
import { csvOf, istDay } from "@/lib/admin-stats";
import { STATUSES, type AdminOrder, type Status } from "@/lib/admin-types";
import { contactMessage, openWhatsApp, statusMessage, waToCustomer } from "@/lib/admin-wa";
import { inr } from "@/lib/money";

function Orders() {
  const { orders, loading, base, update } = useAdmin();
  const sp = useSearchParams();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(sp.get("status") ?? "all");
  const [pay, setPay] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const href = (p: string) => base + p || "/";
  const [blocked, setBlocked] = useState<{ o: AdminOrder; text: string; status: Status } | null>(null);

  // change status → WhatsApp opens immediately with the premium message for that status
  const changeStatus = (o: AdminOrder, status: Status) => {
    const live = { ...o, status };
    const text = statusMessage(live, status, process.env.NEXT_PUBLIC_UPI_ID);
    if (text && !openWhatsApp(live, text)) setBlocked({ o: live, text, status });
    void update(o.id, { status });
  };

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return orders.filter((o) => {
      if (status !== "all" && o.status !== status) return false;
      if (pay !== "all" && !o.payment.toLowerCase().startsWith(pay)) return false;
      const d = istDay(o.date);
      if (from && d < from) return false;
      if (to && d > to) return false;
      if (!s) return true;
      return [o.id, o.name, o.mobile, o.whatsapp, o.city, o.pincode, o.itemsText].some((v) => String(v).toLowerCase().includes(s));
    });
  }, [orders, q, status, pay, from, to]);

  const exportCsv = () => {
    const blob = new Blob(["﻿" + csvOf(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `canflare-orders-${istDay(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="max-w-6xl space-y-4">
      {blocked && (
        <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold bg-oat p-3 text-sm">
          <span><b>{blocked.o.id}</b> marked <b>{blocked.status}</b>. Your browser blocked WhatsApp from opening automatically.</span>
          <span className="flex gap-2">
            <a href={waToCustomer(blocked.o, blocked.text)} target="_blank" rel="noopener noreferrer" onClick={() => setBlocked(null)} className="btn btn-wa !min-h-10">Send message on WhatsApp</a>
            <button onClick={() => setBlocked(null)} className="btn btn-ghost !min-h-10" aria-label="Dismiss">✕</button>
          </span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-3xl">Orders <span className="text-base text-taupe font-sans">({shown.length})</span></h1>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="btn btn-line">Export CSV</button>
          <Link href={href("/orders/new")} className="btn btn-gold">+ New</Link>
        </div>
      </div>

      <div className="card p-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5 [&>*]:min-w-0">
        <input className="input lg:col-span-2" type="search" placeholder="Search ID, name, phone, city, pincode, product" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input" value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option>
          {[...STATUSES, "Cancelled"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="input" value={pay} onChange={(e) => setPay(e.target.value)} aria-label="Payment">
          <option value="all">Any payment</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        <div className="flex flex-wrap gap-2 sm:col-span-2 lg:col-span-5 items-center text-xs text-taupe">
          From <input type="date" className="input !min-h-10 !py-1 !w-auto flex-1 min-w-32" value={from} onChange={(e) => setFrom(e.target.value)} />
          to <input type="date" className="input !min-h-10 !py-1 !w-auto flex-1 min-w-32" value={to} onChange={(e) => setTo(e.target.value)} />
          {(from || to || q || status !== "all" || pay !== "all") && <button className="underline" onClick={() => { setQ(""); setStatus("all"); setPay("all"); setFrom(""); setTo(""); }}>Clear</button>}
        </div>
      </div>

      {loading ? <p className="text-taupe">Loading…</p> : shown.length === 0 ? <p className="card p-8 text-center text-taupe">No orders match.</p> : (
        <ul className="space-y-3">
          {shown.map((o) => (
            <li key={o.id} className="card p-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href={href(`/orders/${o.id}`)} className="min-w-0 flex-1 basis-56">
                <b className="block">{o.id} <span className="font-normal text-xs text-taupe ml-1">{when(o.date)}</span></b>
                <span className="block text-sm">{o.name} · {o.city}</span>
                <span className="block text-xs text-taupe truncate">{o.itemsText.replace(/\n/g, " | ")}</span>
              </Link>
              <div className="text-right"><b>{inr(o.total)}</b><span className="block text-[11px] text-taupe">{o.payment}</span></div>
              <select aria-label={`Status of ${o.id}`} className="input !w-auto !min-h-10 !py-1 text-sm" value={o.status} onChange={(e) => changeStatus(o, e.target.value as Status)}>
                {[...STATUSES, "Cancelled"].map((s) => <option key={s}>{s}</option>)}
              </select>
              <StatusBadge s={o.status} />
              <a href={waToCustomer(o, contactMessage(o, process.env.NEXT_PUBLIC_UPI_ID))} target="_blank" rel="noopener noreferrer" className="btn btn-wa !min-h-10 !px-3 text-xs">WhatsApp</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return <Suspense fallback={null}><Orders /></Suspense>;
}
