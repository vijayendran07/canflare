"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Panel, StatusBadge, when } from "@/components/admin/ui";
import { ordersByPhone } from "@/lib/admin-stats";
import { STATUSES, type Status } from "@/lib/admin-types";
import { contactMessage, openWhatsApp, statusMessage, templates, waToCustomer } from "@/lib/admin-wa";
import { business } from "@/config/business";
import { inr } from "@/lib/money";

export default function OrderDetail() {
  const { id: raw } = useParams<{ id: string }>();
  const id = decodeURIComponent(raw);
  const { orders, loading, base, update } = useAdmin();
  const o = orders.find((x) => x.id === id);
  const [courier, setCourier] = useState("");
  const [tracking, setTracking] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState(false);
  const [blocked, setBlocked] = useState<string | null>(null);

  useEffect(() => {
    if (o) { setCourier(o.courier || ""); setTracking(o.tracking || ""); setNote(o.adminNote || ""); }
    // only reset the fields when switching to another order
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [o?.id]);

  if (loading) return <p className="text-taupe">Loading…</p>;
  if (!o) return <div className="card p-8 text-center"><p>Order {id} not found.</p><Link href={base + "/orders" || "/"} className="btn btn-gold mt-4">All orders</Link></div>;

  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 2000); };
  const history = ordersByPhone(orders, o.mobile, o.id);
  const fullAddr = [o.address, o.city, o.district, o.state, o.pincode].filter(Boolean).join(", ");
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddr)}`;
  const idx = STATUSES.indexOf(o.status as (typeof STATUSES)[number]);
  const upi = process.env.NEXT_PUBLIC_UPI_ID;

  // change status → WhatsApp opens immediately with the premium message (uses the courier/tracking typed on this page)
  const setStatus = async (s: Status) => {
    const live = { ...o, status: s, courier, tracking };
    const text = statusMessage(live, s, upi);
    if (text && !openWhatsApp(live, text)) setBlocked(text);
    const extra = s === "Shipped" && (courier !== o.courier || tracking !== o.tracking) ? { courier, tracking } : {};
    if (await update(o.id, { status: s, ...extra })) flash(`Status: ${s}${text ? " – WhatsApp message ready" : ""}`);
  };
  const saveShipping = async () => { if (await update(o.id, { courier, tracking })) flash("Courier & tracking saved"); };
  const saveNote = async () => { if (await update(o.id, { adminNote: note })) flash("Note saved"); };
  const copy = async () => { try { await navigator.clipboard.writeText(`${o.name}\n${o.mobile}\n${fullAddr}`); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ } };

  const sendTemplate = async (t: (typeof templates)[number]) => {
    const live = { ...o, courier, tracking };
    const text = t.text(live, upi);
    if (!openWhatsApp(live, text)) setBlocked(text);
    if (t.key === "shipped" && (courier !== o.courier || tracking !== o.tracking)) await update(o.id, { courier, tracking });
    if (t.setStatus) await update(o.id, { status: t.setStatus });
    if (t.key === "paid") await update(o.id, { payment: "Paid" });
  };

  return (
    <>
      <div className="no-print max-w-5xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={base + "/orders" || "/"} className="text-xs underline text-taupe">← All orders</Link>
            <h1 className="text-3xl mt-1">{o.id}</h1>
            <p className="text-sm text-taupe">{when(o.date)} · {o.source} · <StatusBadge s={o.status} /></p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`tel:${o.mobile}`} className="btn btn-dark">Call</a>
            <a href={waToCustomer({ ...o, courier, tracking }, contactMessage({ ...o, courier, tracking }, upi))} target="_blank" rel="noopener noreferrer" className="btn btn-wa">WhatsApp</a>
            <button onClick={() => window.print()} className="btn btn-line">Packing slip</button>
          </div>
        </div>
        {blocked && (
          <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gold bg-oat p-3 text-sm">
            <span>Your browser blocked WhatsApp from opening automatically.</span>
            <a href={waToCustomer(o, blocked)} target="_blank" rel="noopener noreferrer" onClick={() => setBlocked(null)} className="btn btn-wa !min-h-10">Send message on WhatsApp</a>
          </div>
        )}
        {msg && <p role="status" className="rounded-lg bg-green-100 text-green-900 text-sm px-3 py-2">{msg}</p>}

        <Panel title="Status">
          {o.status === "Cancelled" ? (
            <div className="flex items-center gap-3"><p className="text-danger font-semibold">This order is cancelled.</p><button className="btn btn-line" onClick={() => setStatus("New")}>Re-open order</button></div>
          ) : (
            <>
              <ol className="grid grid-cols-5 gap-1 text-center text-[11px] sm:text-xs">
                {STATUSES.map((s, i) => (
                  <li key={s}>
                    <button onClick={() => setStatus(s)} className={`w-full py-2 rounded-lg font-semibold ${i <= idx ? "bg-gold text-ink" : "bg-oat text-taupe hover:bg-line"}`} aria-current={i === idx}>{i + 1}. {s}</button>
                  </li>
                ))}
              </ol>
              <button className="mt-3 text-xs text-danger underline" onClick={() => { if (confirm("Cancel this order?")) void setStatus("Cancelled"); }}>Cancel order</button>
            </>
          )}
        </Panel>

        <div className="grid lg:grid-cols-2 gap-5">
          <Panel title="Items">
            <ul className="divide-y divide-line text-sm">
              {(o.items.length ? o.items : []).map((i, k) => (
                <li key={k} className="flex justify-between gap-3 py-2"><span>{i.name} {i.variant && <span className="text-taupe">({i.variant})</span>} × {i.qty}</span><b>{inr(i.price * i.qty)}</b></li>
              ))}
              {!o.items.length && <li className="py-2 whitespace-pre-line">{o.itemsText}</li>}
            </ul>
            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between"><dt className="text-taupe">Subtotal</dt><dd>{inr(o.subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-taupe">Delivery</dt><dd>{o.delivery ? inr(o.delivery) : "FREE"}</dd></div>
              {o.giftWrap > 0 && <div className="flex justify-between"><dt className="text-taupe">Gift wrap</dt><dd>{inr(o.giftWrap)}</dd></div>}
              {o.discount > 0 && <div className="flex justify-between"><dt className="text-taupe">Discount</dt><dd>− {inr(o.discount)}</dd></div>}
              <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd>{inr(o.total)}</dd></div>
              <div className="flex justify-between"><dt className="text-taupe">Payment</dt><dd>{o.payment}</dd></div>
            </dl>
          </Panel>

          <Panel title="Customer">
            <p className="font-semibold">{o.name}</p>
            <p className="text-sm"><a className="underline" href={`tel:${o.mobile}`}>{o.mobile}</a>{o.whatsapp && o.whatsapp !== o.mobile && <> · WhatsApp {o.whatsapp}</>}</p>
            <p className="text-sm mt-2 text-ink-soft">{fullAddr}</p>
            <div className="mt-2 flex gap-2 text-xs">
              <button onClick={copy} className="btn btn-line !min-h-9 !px-3">{copied ? "Copied ✓" : "Copy address"}</button>
              <a href={maps} target="_blank" rel="noopener noreferrer" className="btn btn-line !min-h-9 !px-3">Open in Maps</a>
            </div>
            {o.giftMessage && <p className="mt-3 text-sm"><b>Gift message:</b> {o.giftMessage}</p>}
            {o.note && <p className="mt-3 rounded bg-amber-50 border-l-4 border-gold p-2 text-sm"><b>Customer note:</b> {o.note}</p>}
          </Panel>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          <Panel title="Courier & tracking (shown to the customer)">
            <label className="label" htmlFor="c">Courier</label>
            <input id="c" className="input" value={courier} onChange={(e) => setCourier(e.target.value)} />
            <label className="label mt-3" htmlFor="t">Tracking number</label>
            <input id="t" className="input" value={tracking} onChange={(e) => setTracking(e.target.value)} />
            <button onClick={saveShipping} className="btn btn-dark mt-3">Save</button>
          </Panel>
          <Panel title="Private admin note">
            <textarea className="input" rows={4} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Only you can see this" />
            <button onClick={saveNote} className="btn btn-dark mt-3">Save note</button>
          </Panel>
        </div>

        <Panel title="WhatsApp messages (opens WhatsApp, updates status)">
          <div className="flex flex-wrap gap-2">
            {templates.map((t) => (
              <button key={t.key} onClick={() => sendTemplate(t)} className="btn btn-wa !min-h-10 !px-3 text-xs">{t.label}{t.setStatus ? ` → ${t.setStatus}` : ""}</button>
            ))}
          </div>
          {!upi && <p className="mt-2 text-xs text-taupe">Tip: set NEXT_PUBLIC_UPI_ID to include your UPI ID in the payment message.</p>}
        </Panel>

        <Panel title={`Repeat customer (${history.length} other order${history.length === 1 ? "" : "s"})`}>
          {history.length === 0 ? <p className="text-sm text-taupe">First order from this number.</p> : (
            <ul className="divide-y divide-line text-sm">
              {history.map((h) => (
                <li key={h.id}><Link className="flex justify-between gap-3 py-2 hover:underline" href={`${base}/orders/${h.id}`}><span>{h.id} · {when(h.date)}</span><span><StatusBadge s={h.status} /> <b className="ml-2">{inr(h.total)}</b></span></Link></li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {/* Printable packing slip */}
      <div className="print-only p-6 text-black">
        <h1 style={{ fontSize: 22 }}>{business.name} – Packing slip</h1>
        <p><b>Order {o.id}</b> · {when(o.date)}</p>
        <hr style={{ margin: "10px 0" }} />
        <p><b>Ship to:</b> {o.name} · {o.mobile}</p>
        <p>{fullAddr}</p>
        <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ textAlign: "left", borderBottom: "2px solid #000" }}><th style={{ width: 30 }}></th><th>Item</th><th style={{ width: 60 }}>Qty</th></tr></thead>
          <tbody>
            {o.items.map((i, k) => (
              <tr key={k} style={{ borderBottom: "1px solid #bbb" }}><td style={{ padding: "8px 0", fontSize: 18 }}>☐</td><td>{i.name}{i.variant ? ` (${i.variant})` : ""}</td><td>× {i.qty}</td></tr>
            ))}
          </tbody>
        </table>
        {o.giftWrap > 0 && <p style={{ marginTop: 12 }}>☐ Gift wrap{o.giftMessage ? ` – message: “${o.giftMessage}”` : ""}</p>}
        {o.note && <p style={{ marginTop: 8 }}><b>Customer note:</b> {o.note}</p>}
        <p style={{ marginTop: 16 }}>☐ Packed &nbsp;&nbsp; ☐ Label stuck &nbsp;&nbsp; ☐ Courier handed over</p>
        <p style={{ marginTop: 16, fontSize: 12 }}>{business.legalName}, {business.address.line1}, {business.address.area}, {business.address.city} {business.address.pincode} · {business.phoneDisplay}</p>
      </div>
    </>
  );
}
