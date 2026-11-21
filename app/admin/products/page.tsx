"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Panel } from "@/components/admin/ui";
import ProductCard from "@/components/ProductCard";
import { categories, type Product } from "@/data/products";
import type { PriceRow } from "@/lib/catalog";
import { inr } from "@/lib/money";

type Tab = "prices" | "custom" | "form";
type Data = { base: Product[]; rows: PriceRow[]; custom: Product[] };
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

const blank = (): Product => ({
  slug: "", category: categories[0].slug, name: "", subtitle: "", shortDescription: "", description: "",
  variants: [{ label: "Standard", price: null }], details: [], images: [], active: true, inStock: true, sortOrder: 100, highlights: [],
});

export default function ProductsAdmin() {
  const [tab, setTab] = useState<Tab>("prices");
  const [data, setData] = useState<Data | null>(null);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 2500); };

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/products", { cache: "no-store" });
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Could not load");
      setData(d); setErr("");
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not load"); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const [edit, setEdit] = useState<Product>(blank());
  const startEdit = (p: Product) => { setEdit(JSON.parse(JSON.stringify(p))); setTab("form"); };

  return (
    <div className="max-w-5xl space-y-5">
      <h1 className="text-3xl">Products</h1>
      <div className="flex gap-2 overflow-x-auto" role="tablist">
        {([["prices", "Prices & stock"], ["custom", "Added by you"], ["form", edit.slug && data?.custom.some((c) => c.slug === edit.slug) ? "Edit product" : "Add product / combo"]] as [Tab, string][]).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => { if (k === "form" && tab !== "form" && !edit.name) setEdit(blank()); setTab(k); }} className={`px-4 min-h-10 rounded-full text-sm whitespace-nowrap border ${tab === k ? "bg-ink text-gold border-ink" : "bg-white border-line"}`}>{l}</button>
        ))}
      </div>
      {msg && <p role="status" className="rounded-lg bg-green-100 text-green-900 text-sm px-3 py-2">{msg}</p>}
      {err && <p role="alert" className="rounded-lg bg-red-50 text-danger text-sm px-3 py-2">{err}</p>}
      {!data ? (err ? null : <p className="text-taupe">Loading…</p>) : tab === "prices" ? (
        <PricesTab data={data} onSaved={() => { flash("Saved – live on the site now"); void load(); }} setErr={setErr} />
      ) : tab === "custom" ? (
        <CustomTab data={data} onEdit={startEdit} onChanged={(t) => { flash(t); void load(); }} setErr={setErr} onNew={() => { setEdit(blank()); setTab("form"); }} />
      ) : (
        <FormTab key={edit.slug || "new"} data={data} initial={edit} onSaved={() => { flash("Product saved – live on the site now"); setEdit(blank()); setTab("custom"); void load(); }} setErr={setErr} />
      )}
    </div>
  );
}

/* ───────── Prices & stock ───────── */
function PricesTab({ data, onSaved, setErr }: { data: Data; onSaved: () => void; setErr: (s: string) => void }) {
  type Row = { slug: string; variant: string; price: string; inStock: boolean };
  const init = useMemo<Row[]>(() => data.base.flatMap((p) => p.variants.map((v) => {
    const o = data.rows.find((r) => r.slug === p.slug && r.variant === v.label);
    const price = o?.price ?? v.price;
    return { slug: p.slug, variant: v.label, price: price ? String(price) : "", inStock: o ? o.inStock : p.inStock };
  })), [data]);
  const [rows, setRows] = useState<Row[]>(init);
  const [busy, setBusy] = useState(false);
  useEffect(() => setRows(init), [init]);
  const dirty = JSON.stringify(rows) !== JSON.stringify(init);

  const save = async () => {
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rows: rows.map((x) => ({ slug: x.slug, variant: x.variant, price: x.price ? Number(x.price) : null, inStock: x.inStock })) }) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Could not save");
      onSaved();
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not save"); }
    setBusy(false);
  };

  return (
    <Panel title="Edit prices and stock" right={<button onClick={save} className="btn btn-gold" disabled={!dirty || busy}>{busy ? "Saving…" : "Save changes"}</button>}>
      <p className="text-xs text-taupe mb-3">Leave a price empty to hide that size. Changes go live on the site immediately after saving.</p>
      <div className="divide-y divide-line">
        {data.base.map((p) => (
          <div key={p.slug} className="py-3">
            <p className="font-semibold text-sm">{p.name}</p>
            {rows.filter((r) => r.slug === p.slug).map((r) => (
              <div key={r.variant} className="mt-2 flex items-center gap-3 flex-wrap">
                <span className="text-sm text-ink-soft w-40 truncate">{r.variant}</span>
                <label className="flex items-center gap-1 text-sm">₹<input className="input !w-28 !min-h-10" inputMode="numeric" value={r.price} onChange={(e) => setRows((l) => l.map((x) => (x === r ? { ...x, price: e.target.value.replace(/\D/g, "") } : x)))} aria-label={`Price for ${p.name} ${r.variant}`} /></label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="w-5 h-5" checked={r.inStock} onChange={(e) => setRows((l) => l.map((x) => (x === r ? { ...x, inStock: e.target.checked } : x)))} /> In stock</label>
                {!r.price && <span className="text-[11px] text-amber-700 bg-amber-50 rounded px-2 py-0.5">hidden – no price</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ───────── Added by you ───────── */
function CustomTab({ data, onEdit, onChanged, setErr, onNew }: { data: Data; onEdit: (p: Product) => void; onChanged: (t: string) => void; setErr: (s: string) => void; onNew: () => void }) {
  const save = async (p: Product) => {
    const r = await fetch("/api/admin/custom", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    const d = await r.json();
    if (!d.ok) throw new Error(d.message || "Could not save");
  };
  const toggle = async (p: Product) => { try { await save({ ...p, active: !p.active }); onChanged(p.active ? "Hidden from store" : "Visible on store"); } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); } };
  const del = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try {
      const r = await fetch(`/api/admin/custom?slug=${encodeURIComponent(p.slug)}`, { method: "DELETE" });
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Failed");
      onChanged("Deleted");
    } catch (e) { setErr(e instanceof Error ? e.message : "Failed"); }
  };
  return (
    <Panel title="Products & combos you added" right={<button onClick={onNew} className="btn btn-gold !min-h-10">+ Add</button>}>
      {data.custom.length === 0 ? <p className="text-sm text-taupe">Nothing added yet.</p> : (
        <ul className="divide-y divide-line">
          {data.custom.map((p) => (
            <li key={p.slug} className="py-3 flex flex-wrap items-center gap-3">
              <div className="flex-1 min-w-48"><b className="text-sm">{p.name}</b>{p.comboItems?.length ? <span className="ml-2 text-[11px] bg-gold/30 rounded px-1.5">combo</span> : null}<br /><span className="text-xs text-taupe">{p.variants.map((v) => `${v.label} ${v.price ? inr(v.price) : "–"}`).join(" · ")} · {p.active ? "shown" : "hidden"} · {p.inStock ? "in stock" : "out of stock"}</span></div>
              <button onClick={() => onEdit(p)} className="btn btn-line !min-h-9 !px-3 text-xs">Edit</button>
              <button onClick={() => toggle(p)} className="btn btn-line !min-h-9 !px-3 text-xs">{p.active ? "Hide" : "Show"}</button>
              <button onClick={() => del(p)} className="btn btn-line !min-h-9 !px-3 text-xs text-danger">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ───────── Add / edit form + combo builder ───────── */
function FormTab({ data, initial, onSaved, setErr }: { data: Data; initial: Product; onSaved: () => void; setErr: (s: string) => void }) {
  const [p, setP] = useState<Product>(initial);
  const [busy, setBusy] = useState(false);
  const isEdit = data.custom.some((c) => c.slug === initial.slug);
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [pickC, setPickC] = useState("");
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));

  // every product that can go inside a combo, with its current price
  const pool = useMemo(() => {
    const out: { slug: string; variant: string; name: string; price: number }[] = [];
    for (const b of data.base) for (const v of b.variants) {
      const o = data.rows.find((r) => r.slug === b.slug && r.variant === v.label);
      const price = o?.price ?? v.price;
      if (price) out.push({ slug: b.slug, variant: v.label, name: `${b.name} – ${v.label}`, price });
    }
    for (const c of data.custom) if (c.slug !== p.slug && !c.comboItems?.length) for (const v of c.variants) if (v.price) out.push({ slug: c.slug, variant: v.label, name: `${c.name} – ${v.label}`, price: v.price });
    return out;
  }, [data, p.slug]);

  const combo = p.comboItems ?? [];
  const separately = combo.reduce((s, it) => s + (pool.find((x) => x.slug === it.slug && x.variant === it.variant)?.price ?? 0) * it.qty, 0);
  const isCombo = combo.length > 0;
  const setComboPrice = (price: number | null) => set("variants", [{ label: "Combo", price }]);

  const save = async () => {
    setErr("");
    const slug = p.slug || slugify(p.name);
    if (p.name.trim().length < 2) return setErr("Enter a product name.");
    if (!p.variants.some((v) => v.price)) return setErr("Add at least one price – products with no price stay hidden.");
    setBusy(true);
    try {
      const body = { ...p, slug, subtitle: p.subtitle || undefined, images: p.images.filter(Boolean), details: p.details.filter((d) => d.label && d.value), variants: p.variants.filter((v) => v.label), comboItems: isCombo ? combo : undefined };
      const r = await fetch("/api/admin/custom", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Could not save");
      onSaved();
    } catch (e) { setErr(e instanceof Error ? e.message : "Could not save"); }
    setBusy(false);
  };

  const preview: Product = { ...p, slug: p.slug || "preview", subtitle: p.subtitle, variants: p.variants.map((v) => ({ ...v, price: v.price || null })) };
  const previewOk = preview.variants.some((v) => v.price);

  return (
    <div className="grid lg:grid-cols-[1fr_260px] gap-5">
      <div className="space-y-5">
        <Panel title={isEdit ? "Edit product" : "Add product / combo"}>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className="label">Name</label><input className="input" value={p.name} onChange={(e) => { set("name", e.target.value); if (!slugTouched) set("slug", slugify(e.target.value)); }} /></div>
            <div><label className="label">Category</label><select className="input" value={p.category} onChange={(e) => set("category", e.target.value)}>{categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></div>
            <div><label className="label">Subtitle (optional)</label><input className="input" value={p.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} /></div>
            <div><label className="label">URL name</label><input className="input" value={p.slug} disabled={isEdit} onChange={(e) => { setSlugTouched(true); set("slug", slugify(e.target.value)); }} /></div>
            <div className="sm:col-span-2"><label className="label">Short description</label><input className="input" maxLength={300} value={p.shortDescription} onChange={(e) => set("shortDescription", e.target.value)} /></div>
            <div className="sm:col-span-2"><label className="label">Full description</label><textarea className="input" rows={3} value={p.description} onChange={(e) => set("description", e.target.value)} /></div>
          </div>
        </Panel>

        <Panel title={isCombo ? "Combo price" : "Sizes & prices"}>
          {isCombo ? (
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1 text-sm">₹<input className="input !w-32" inputMode="numeric" value={p.variants[0]?.price ?? ""} onChange={(e) => setComboPrice(Number(e.target.value.replace(/\D/g, "")) || null)} aria-label="Combo price" /></label>
              <span className="text-sm text-taupe">Bought separately: <b className="text-ink">{inr(separately)}</b></span>
              {[5, 10, 15].map((d) => <button key={d} type="button" onClick={() => setComboPrice(Math.round(separately * (1 - d / 100)))} className="btn btn-line !min-h-9 !px-3 text-xs">{d}% off</button>)}
            </div>
          ) : (
            <div className="space-y-2">
              {p.variants.map((v, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input className="input" placeholder="Size e.g. 120 ml" value={v.label} onChange={(e) => set("variants", p.variants.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} />
                  <label className="flex items-center gap-1 text-sm">₹<input className="input !w-28" inputMode="numeric" value={v.price ?? ""} onChange={(e) => set("variants", p.variants.map((x, k) => (k === i ? { ...x, price: Number(e.target.value.replace(/\D/g, "")) || null } : x)))} /></label>
                  {p.variants.length > 1 && <button onClick={() => set("variants", p.variants.filter((_, k) => k !== i))} className="text-danger text-xs underline">Remove</button>}
                </div>
              ))}
              <button onClick={() => set("variants", [...p.variants, { label: "", price: null }])} className="text-sm underline text-gold-deep">+ Add size</button>
            </div>
          )}
        </Panel>

        <Panel title="Combo builder (optional)">
          <p className="text-xs text-taupe mb-2">Pick products to bundle. The combo goes out of stock automatically if any item inside is out of stock.</p>
          <div className="flex gap-2">
            <select className="input" value={pickC} onChange={(e) => setPickC(e.target.value)} aria-label="Product to add to combo">
              <option value="">Add a product to the combo…</option>
              {pool.map((x) => <option key={x.slug + x.variant} value={`${x.slug}||${x.variant}`}>{x.name} ({inr(x.price)})</option>)}
            </select>
            <button className="btn btn-dark" disabled={!pickC} onClick={() => {
              const [slug, variant] = pickC.split("||");
              const next = combo.some((c) => c.slug === slug && c.variant === variant) ? combo.map((c) => (c.slug === slug && c.variant === variant ? { ...c, qty: c.qty + 1 } : c)) : [...combo, { slug, variant, qty: 1 }];
              setP((x) => ({ ...x, comboItems: next, variants: [{ label: "Combo", price: x.variants[0]?.label === "Combo" ? x.variants[0].price : null }] }));
              setPickC("");
            }}>Add</button>
          </div>
          {isCombo && (
            <ul className="mt-3 divide-y divide-line text-sm">
              {combo.map((c, i) => (
                <li key={i} className="py-2 flex items-center justify-between gap-2"><span>{pool.find((x) => x.slug === c.slug && x.variant === c.variant)?.name ?? c.slug}</span>
                  <span className="flex items-center gap-2">× <input className="input !w-16 !min-h-9" inputMode="numeric" value={c.qty} onChange={(e) => set("comboItems", combo.map((x, k) => (k === i ? { ...x, qty: Math.max(1, Number(e.target.value.replace(/\D/g, "")) || 1) } : x)))} />
                    <button className="text-danger text-xs underline" onClick={() => { const n = combo.filter((_, k) => k !== i); setP((x) => ({ ...x, comboItems: n.length ? n : undefined, variants: n.length ? x.variants : [{ label: "Standard", price: null }] })); }}>Remove</button></span></li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Details & photo">
          <div className="space-y-2">
            {p.details.map((d, i) => (
              <div key={i} className="flex gap-2"><input className="input !w-40" placeholder="Label" value={d.label} onChange={(e) => set("details", p.details.map((x, k) => (k === i ? { ...x, label: e.target.value } : x)))} /><input className="input" placeholder="Value" value={d.value} onChange={(e) => set("details", p.details.map((x, k) => (k === i ? { ...x, value: e.target.value } : x)))} /><button className="text-danger text-xs underline" onClick={() => set("details", p.details.filter((_, k) => k !== i))}>×</button></div>
            ))}
            <button onClick={() => set("details", [...p.details, { label: "", value: "" }])} className="text-sm underline text-gold-deep">+ Add detail (e.g. Burn time)</button>
          </div>
          <label className="label mt-4">Photo link (https://…)</label>
          <input className="input" type="url" placeholder="https://…" value={p.images[0] ?? ""} onChange={(e) => set("images", e.target.value ? [e.target.value] : [])} />
          <p className="text-[11px] text-taupe mt-1">Use a direct link to your own photo (for example one uploaded to your Google Drive / image host).</p>
        </Panel>

        <div className="flex flex-wrap items-center gap-5">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="w-5 h-5" checked={p.active} onChange={(e) => set("active", e.target.checked)} /> Show on store</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="w-5 h-5" checked={p.inStock} onChange={(e) => set("inStock", e.target.checked)} /> In stock</label>
          <button onClick={save} className="btn btn-gold" disabled={busy}>{busy ? "Saving…" : isEdit ? "Save changes" : "Add product"}</button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 h-fit">
        <p className="label">Live preview</p>
        {previewOk && p.name ? <ProductCard p={preview} /> : <div className="card p-6 text-center text-sm text-taupe">Add a name and a price to see the preview.</div>}
      </aside>
    </div>
  );
}
