"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart, useCartReady, useCartTotals } from "@/store/cart";
import CartLines from "@/components/CartLines";
import CartSummary from "@/components/CartSummary";
import FreeDeliveryBar from "@/components/FreeDeliveryBar";
import Upsell from "@/components/Upsell";
import { EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import CandleArt from "@/components/CandleArt";
import { inr } from "@/lib/money";

export default function CartPage() {
  const ready = useCartReady();
  const items = useCart((s) => s.items);
  const sync = useCart((s) => s.sync);
  const t = useCartTotals();

  // refresh prices / drop unavailable lines using the live catalogue
  useEffect(() => {
    if (!ready) return;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d: { products: { slug: string; inStock: boolean; variants: { label: string; price: number }[] }[] }) => {
        const fresh = d.products.filter((p) => p.inStock).flatMap((p) => p.variants.map((v) => ({ slug: p.slug, variant: v.label, price: v.price })));
        sync(fresh);
      })
      .catch(() => {});
  }, [ready, sync]);

  if (!ready) return <div className="container-x py-8" role="status" aria-label="Loading cart"><div className="skeleton mb-6 h-10 w-48" /><div className="skeleton h-[22rem]" /></div>;

  return (
    <div className="section-bg bg-ivory"><div className="container-x py-8">
      <h1 className="text-3xl sm:text-4xl mb-6">Your cart</h1>
      {items.length === 0 ? (
        <EmptyState icon={<CandleArt kind="jar" className="h-10 w-10" />} title="Your cart is empty" text="Add a candle or two and they will wait for you here." action={<Button href="/shop">Shop candles</Button>} />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div><div className="card px-4"><CartLines /></div><Upsell /></div>
          <aside className="card p-5 h-fit space-y-4 lg:sticky lg:top-24">
            <FreeDeliveryBar subtotal={t.subtotal} />
            <CartSummary t={t} showGift={false} />
            <Link href="/checkout" className="btn btn-gold w-full">Proceed to checkout</Link>
            <Link href="/shop" className="btn btn-line w-full">Continue shopping</Link>
          </aside>
        </div>
      )}
      {items.length > 0 && (
        <div className="no-print glass safe-bottom fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-30 border-x-0 px-3 py-2 lg:hidden">
          <div className="mx-auto flex max-w-xl items-center gap-3">
            <div className="min-w-0 flex-1 leading-tight"><p className="text-[11px] text-taupe">Total</p><p className="text-lg font-semibold tabular-nums">{inr(t.total)}</p></div>
            <Link href="/checkout" className="btn btn-gold btn-lg min-w-[10rem]">Checkout</Link>
          </div>
        </div>
      )}
    </div></div>
  );
}
