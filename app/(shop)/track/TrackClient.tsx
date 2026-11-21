"use client";
import { useState } from "react";
import { inr } from "@/lib/money";
import { business } from "@/config/business";
import { ownerWaLink } from "@/lib/whatsapp";

const STEPS = ["New", "Confirmed", "Packed", "Shipped", "Delivered"] as const;
type Tracked = { id: string; date: string; status: string; itemsText: string; itemCount: number; total: number; courier?: string; tracking?: string };

export default function TrackClient() {
  const [id, setId] = useState("");
  const [mobile, setMobile] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [o, setO] = useState<Tracked | null>(null);

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setO(null); setBusy(true);
    try {
      const r = await fetch(`/api/track?id=${encodeURIComponent(id.trim())}&mobile=${mobile}`);
      const d = await r.json();
      if (d.ok) setO(d.order); else setErr(d.message || "Could not find that order.");
    } catch { setErr("Network problem. Please try again."); }
    setBusy(false);
  };

  const idx = o ? STEPS.indexOf(o.status as (typeof STEPS)[number]) : -1;
  return (
    <div className="section-bg bg-glow">
    <div className="container-x py-8 max-w-2xl">
      <h1 className="text-3xl sm:text-4xl">Track your order</h1>
      <p className="mt-2 text-ink-soft">Enter your order ID (like {business.orderPrefix}-2611-0001) and the mobile number you ordered with.</p>
      <form onSubmit={go} className="card p-5 mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="t-id">Order ID</label>
          <input id="t-id" className="input uppercase" value={id} onChange={(e) => setId(e.target.value)} placeholder={`${business.orderPrefix}-2611-0001`} required />
        </div>
        <div>
          <label className="label" htmlFor="t-mobile">Mobile number</label>
          <input id="t-mobile" className="input" inputMode="numeric" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))} required />
        </div>
        {err && <p role="alert" className="err text-sm">{err}</p>}
        <button className="btn btn-gold w-full" disabled={busy}>{busy ? "Searching…" : "Track order"}</button>
      </form>

      {o && (
        <section className="card p-5 mt-6">
          <div className="flex flex-wrap justify-between gap-2">
            <h2 className="text-xl">{o.id}</h2>
            <span className="text-sm text-taupe">{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </div>
          {o.status === "Cancelled" ? (
            <p className="mt-4 rounded-lg bg-oat p-3 text-sm">This order was cancelled. <a className="underline" href={ownerWaLink(`Hi, about my order ${o.id}`)}>Message us</a> if you have questions.</p>
          ) : (
            <ol className="mt-5 grid grid-cols-5 gap-1 text-center text-[11px] sm:text-xs">
              {STEPS.map((s, i) => (
                <li key={s}>
                  <div className={`mx-auto w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${i <= idx ? "bg-gold text-ink" : "bg-oat text-taupe"}`}>{i + 1}</div>
                  <p className={`mt-1 ${i <= idx ? "font-semibold" : "text-taupe"}`}>{s}</p>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-5 whitespace-pre-line text-sm text-ink-soft">{o.itemsText}</p>
          <p className="mt-2 font-semibold">Total: {inr(o.total)}</p>
          {(o.courier || o.tracking) && (
            <div className="mt-4 rounded-lg bg-oat p-3 text-sm">
              {o.courier && <p>Courier: <b>{o.courier}</b></p>}
              {o.tracking && <p>Tracking number: <b>{o.tracking}</b></p>}
            </div>
          )}
        </section>
      )}
    </div>
    </div>
  );
}
