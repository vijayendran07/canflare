"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { lastOrder, type SavedOrder } from "@/lib/order-client";
import { recentlyViewed } from "@/lib/profile";
import { inr } from "@/lib/money";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/ui/overlays";
import ProductImage from "./ProductImage";

type CatItem = { slug: string; name: string; category: string; inStock: boolean; image: string | null; variants: { label: string; price: number }[] };

/**
 * Personal touches (local to this device): one-tap reorder of the last order, and recently viewed products.
 * Renders nothing for first-time visitors.
 */
export default function PersonalStrip({ exclude, showReorder = true }: { exclude?: string; showReorder?: boolean }) {
  const [cat, setCat] = useState<CatItem[] | null>(null);
  const [order, setOrder] = useState<SavedOrder | undefined>();
  const [viewed, setViewed] = useState<string[]>([]);
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const toast = useToast();

  useEffect(() => {
    const o = lastOrder();
    const v = recentlyViewed().filter((s) => s !== exclude);
    setOrder(showReorder ? o : undefined);
    setViewed(v);
    if (o || v.length) fetch("/api/catalog").then((r) => r.json()).then((j) => setCat(j.products)).catch(() => {});
  }, [exclude, showReorder]);

  if (!cat) return null;
  const items = viewed.map((s) => cat.find((p) => p.slug === s)).filter(Boolean) as CatItem[];

  const reorder = () => {
    if (!order) return;
    let added = 0;
    for (const l of order.order.items) {
      const p = cat.find((x) => x.slug === l.slug);
      const v = p?.variants.find((x) => x.label === l.variant);
      if (p && v && p.inStock) { add({ slug: p.slug, variant: v.label, name: p.name, price: v.price, image: p.image ?? undefined }, l.qty); added++; }
    }
    if (added) { openDrawer(); toast(`${added} item${added > 1 ? "s" : ""} added from your last order`, "ok"); }
    else toast("Those items are no longer available", "error");
  };

  const orderOk = order && order.order.items.some((l) => cat.some((p) => p.slug === l.slug && p.inStock));
  if (!orderOk && items.length === 0) return null;

  return (
    <section className="container-x py-8" aria-label="For you">
      {orderOk && order && (
        <div className="surface-raised mb-6 flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="min-w-0">
            <p className="eyebrow">Order again</p>
            <p className="mt-1 text-sm text-ink-soft truncate">{order.order.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
          </div>
          <button onClick={reorder} className="btn btn-dark">Reorder in one tap</button>
        </div>
      )}
      {items.length > 0 && (
        <>
          <h2 className="mb-3 text-2xl">Recently viewed</h2>
          <div className="rail pb-2">
            {items.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}`} className="w-36 sm:w-44">
                <span className="relative block aspect-square overflow-hidden rounded-lg bg-oat"><ProductImage src={p.image} alt="" category={p.category} sizes="176px" /></span>
                <b className="mt-2 block truncate text-sm">{p.name}</b>
                <span className="text-sm text-gold-deep">{inr(Math.min(...p.variants.map((v) => v.price)))}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
