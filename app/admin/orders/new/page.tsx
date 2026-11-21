"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAdmin } from "@/components/admin/AdminProvider";
import { Panel } from "@/components/admin/ui";
import { STATES } from "@/lib/states";
import { calcTotals } from "@/lib/pricing";
import { inr } from "@/lib/money";
import { templates, waToCustomer } from "@/lib/admin-wa";
import type { AdminOrder } from "@/lib/admin-types";

type CatProduct = { slug: string; name: string; inStock: boolean; variants: { label: string; price: number }[] };
type Line = { slug: string; name: string; variant: string; qty: number; price: number };

export default function NewOrder() {
  const router = useRouter();
  const { base, refresh } = useAdmin();
  const [cat, setCat] = useState<CatProduct[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [pick, setPick] = useState("");
  const [c, setC] = useState({ name: "", mobile: "", whatsapp: "" });
  const [a, setA] = useState({ line1: "", city: "", district: "", state: "Tamil Nadu", pincode: "" });
  const [pickup, setPickup] = useState(false);
  const [delOverride, setDelOverride] = useState("");
  const [discount, setDiscount] = useState("");
  const [giftWrap, setGiftWrap] = useState(false);
  const [payment, setPayment] = useState("Pending");
  const [status, setStatus] = useState("New");
  const [source, setSource] = useState("WhatsApp");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => { fetch("/api/catalog").then((r) => r.json()).then((d) => setCat(d.products ?? [])).catch(() => {}); }, []);

  const t = useMemo(() => calcTotals(lines, { giftWrap, pickup, discount: Number(discount) || 0, deliveryOverride: delOverride === "" ? null : Number(delOverride) }), [lines, giftWrap, pickup, discount, delOverride]);

  const addPick = () => {
    const [slug, variant] = pick.split("||");
    const p = cat.find((x) => x.slug === slug);
    const v = p?.variants.find((x) => x.label === variant);
    if (!p || !v) return;
    setLines((l) => {
      const i = l.findIndex((x) => x.slug === slug && x.variant === variant);
      return i >= 0 ? l.map((x, k) => (k === i ? { ...x, qty: x.qty + 1 } : x)) : [...l, { slug, name: p.name, variant, qty: 1, price: v.price }];
    });
    setPick("");
  };
  const patch = (i: number, p: Partial<Line>) => setLines((l) => l.map((x, k) => (k === i ? { ...x, ...p } : x)));

  const save = async (andWhatsApp: boolean) => {
    setErr("");
    if (!lines.length) return setErr("Add at least one item.");
    if (!c.name.trim()) return setErr("Enter the customer name.");
    if (!/^\d{10}$/.test(c.mobile)) return setErr("Mobile must be 10 digits.");
    if (c.whatsapp && !/^\d{10}$/.test(c.whatsapp)) return setErr("WhatsApp must be 10 digits.");
    if (!pickup && a.pincode && !/^\d{6}$/.test(a.pincode)) return setErr("Pincode must be 6 digits.");
    setBusy(true);
    try {
      const body = {
        items: lines, customer: { name: c.name.trim(), mobile: c.mobile, whatsapp: c.whatsapp || c.mobile },
        address: a, pickup, deliveryOverride: delOverride === "" ? null : Number(delOverride), discount: Number(discount) || 0,
        giftWrap, payment, status, source, note,
      };
      const r = await fetch("/api/admin/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Could not save");
      void refresh();
      if (andWhatsApp) {
        const o = d.order;
        const asAdmin = { ...o, id: d.id, items: o.items, courier: "", tracking: "" } as AdminOrder;
        window.open(waToCustomer(asAdmin, templates[0].text(asAdmin, process.env.NEXT_PUBLIC_UPI_ID)), "_blank", "noopener");
      }
      router.push(`${base}/orders/${d.id}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not save");
      setBusy(false);
    }
  };

  const num = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => set(e.target.value.replace(/\D/g, ""));

  return (
    <div className="max-w-4xl space-y-5">
      <h1 className="text-3xl">New order</h1>
      <p className="text-sm text-taupe -mt-3">For phone, WhatsApp, Instagram and walk-in orders.</p>

      <Panel title="Items">
        <div className="flex gap-2">
          <select className="input" value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Product">
            <option value="">Choose product…</option>
            {cat.map((p) => p.variants.map((v) => <option key={p.slug + v.label} value={`${p.slug}||${v.label}`}>{p.name} – {v.label} ({inr(v.price)}){p.inStock ? "" : " – out of stock"}</option>))}
          </select>
          <button onClick={addPick} className="btn btn-dark" disabled={!pick}>Add</button>
          <button onClick={() => setLines((l) => [...l, { slug: "custom", name: "Custom item", variant: "", qty: 1, price: 0 }])} className="btn btn-line whitespace-nowrap">+ Custom</button>
        </div>
        {lines.length > 0 && (
          <ul className="mt-3 divide-y divide-line">
            {lines.map((l, i) => (
              <li key={i} className="py-3 grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_90px_100px_auto] gap-2 items-center">
                {l.slug === "custom" ? <input className="input" value={l.name} onChange={(e) => patch(i, { name: e.target.value })} aria-label="Item name" /> : <span className="text-sm">{l.name} <span className="text-taupe">{l.variant}</span></span>}
                <button className="text-danger text-xs underline sm:order-last" onClick={() => setLines((x) => x.filter((_, k) => k !== i))}>Remove</button>
                <input className="input" inputMode="numeric" value={l.qty} onChange={(e) => patch(i, { qty: Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1) })} aria-label="Quantity" />
                <input className="input" inputMode="numeric" value={l.price} onChange={(e) => patch(i, { price: Number(e.target.value.replace(/\D/g, "")) || 0 })} aria-label="Price each" />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel title="Customer">
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className="label">Name</label><input className="input" value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} /></div>
          <div><label className="label">Mobile</label><input className="input" inputMode="numeric" maxLength={10} value={c.mobile} onChange={num((v) => setC({ ...c, mobile: v }))} /></div>
          <div><label className="label">WhatsApp (if different)</label><input className="input" inputMode="numeric" maxLength={10} value={c.whatsapp} onChange={num((v) => setC({ ...c, whatsapp: v }))} /></div>
        </div>
        <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} className="w-4 h-4" /> Pickup from store (no delivery)</label>
        {!pickup && (
          <div className="mt-3 grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><label className="label">Address</label><input className="input" value={a.line1} onChange={(e) => setA({ ...a, line1: e.target.value })} /></div>
            <div><label className="label">City</label><input className="input" value={a.city} onChange={(e) => setA({ ...a, city: e.target.value })} /></div>
            <div><label className="label">District</label><input className="input" value={a.district} onChange={(e) => setA({ ...a, district: e.target.value })} /></div>
            <div><label className="label">State</label><select className="input" value={a.state} onChange={(e) => setA({ ...a, state: e.target.value })}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
            <div><label className="label">Pincode</label><input className="input" inputMode="numeric" maxLength={6} value={a.pincode} onChange={num((v) => setA({ ...a, pincode: v }))} /></div>
          </div>
        )}
      </Panel>

      <Panel title="Charges & payment">
        <div className="grid sm:grid-cols-3 gap-3">
          <div><label className="label">Delivery override (₹) – blank = automatic</label><input className="input" inputMode="numeric" value={delOverride} onChange={num(setDelOverride)} disabled={pickup} placeholder={pickup ? "Pickup" : `Auto: ${inr(t.delivery)}`} /></div>
          <div><label className="label">Discount (₹)</label><input className="input" inputMode="numeric" value={discount} onChange={num(setDiscount)} /></div>
          <label className="flex items-end gap-2 text-sm pb-3"><input type="checkbox" checked={giftWrap} onChange={(e) => setGiftWrap(e.target.checked)} className="w-4 h-4" /> Gift wrap</label>
          <div><label className="label">Payment</label><select className="input" value={payment} onChange={(e) => setPayment(e.target.value)}>{["Pending", "Paid cash", "Paid UPI"].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div><label className="label">Starting status</label><select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>{["New", "Confirmed", "Packed", "Shipped", "Delivered"].map((s) => <option key={s}>{s}</option>)}</select></div>
          <div><label className="label">Source</label><select className="input" value={source} onChange={(e) => setSource(e.target.value)}>{["Phone", "WhatsApp", "Instagram", "Walk-in", "Other"].map((s) => <option key={s}>{s}</option>)}</select></div>
        </div>
        <label className="label mt-3">Notes</label>
        <textarea className="input" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        <dl className="mt-4 space-y-1 text-sm max-w-xs ml-auto">
          <div className="flex justify-between"><dt className="text-taupe">Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
          <div className="flex justify-between"><dt className="text-taupe">Delivery</dt><dd>{t.delivery ? inr(t.delivery) : "FREE"}</dd></div>
          {t.giftWrap > 0 && <div className="flex justify-between"><dt className="text-taupe">Gift wrap</dt><dd>{inr(t.giftWrap)}</dd></div>}
          {t.discount > 0 && <div className="flex justify-between"><dt className="text-taupe">Discount</dt><dd>− {inr(t.discount)}</dd></div>}
          <div className="flex justify-between border-t border-line pt-2 text-lg font-semibold"><dt>Total</dt><dd>{inr(t.total)}</dd></div>
        </dl>
      </Panel>

      {err && <p role="alert" className="err text-sm">{err}</p>}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => save(false)} className="btn btn-dark" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
        <button onClick={() => save(true)} className="btn btn-wa" disabled={busy}>Save &amp; WhatsApp customer</button>
      </div>
    </div>
  );
}
