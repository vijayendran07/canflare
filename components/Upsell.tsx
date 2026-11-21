"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import { inr } from "@/lib/money";
import { track } from "@/lib/analytics";
import ProductImage from "./ProductImage";

type P = { slug: string; name: string; category: string; image: string | null; variants: { label: string; price: number }[] };

/** "Frequently bought together" – shown ONLY when real order data supports it (≥2 real orders). Otherwise renders nothing. */
export default function Upsell() {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const [picks, setPicks] = useState<P[]>([]);
  const key = items.map((i) => i.slug).sort().join(",");

  useEffect(() => {
    if (!key) { setPicks([]); return; }
    let live = true;
    fetch(`/api/pairs?slugs=${key}`).then((r) => r.json()).then((j) => live && setPicks(j.products ?? [])).catch(() => live && setPicks([]));
    return () => { live = false; };
  }, [key]);

  if (!picks.length) return null;
  return (
    <section aria-label="Frequently bought together" className="mt-4 rounded-2xl bg-oat p-4">
      <p className="eyebrow mb-2">Frequently bought together</p>
      <ul className="space-y-2">
        {picks.map((p) => {
          const v = p.variants[0];
          return (
            <li key={p.slug} className="flex items-center gap-3">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-card"><ProductImage src={p.image} alt="" category={p.category} sizes="56px" /></span>
              <span className="min-w-0 flex-1"><b className="block truncate text-sm">{p.name}</b><span className="text-xs text-gold-deep">{inr(v.price)}</span></span>
              <button className="btn btn-dark !min-h-9 !px-3 text-xs" onClick={() => { add({ slug: p.slug, variant: v.label, name: p.name, price: v.price, image: p.image ?? undefined }); track("add_to_cart", { value: v.price, items: [{ item_id: p.slug, item_name: p.name, price: v.price, quantity: 1 }], source: "upsell" }); }}>Add</button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
