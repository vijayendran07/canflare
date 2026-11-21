"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useCart, useCartReady, useCartTotals } from "@/store/cart";
import CartLines from "./CartLines";
import CartSummary from "./CartSummary";
import FreeDeliveryBar from "./FreeDeliveryBar";
import { CloseIcon } from "./Icons";
import Upsell from "./Upsell";

export default function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const close = useCart((s) => s.closeDrawer);
  const items = useCart((s) => s.items);
  const ready = useCartReady();
  const t = useCartTotals();

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  if (!ready || !open) return null;
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button aria-label="Close cart" className="absolute inset-0 bg-black/50" onClick={close} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-surface flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-4 h-14 border-b border-line">
          <h2 className="font-serif text-xl">Your cart ({t.itemCount})</h2>
          <button aria-label="Close" onClick={close} className="p-2"><CloseIcon /></button>
        </div>
        {items.length === 0 ? (
          <div className="flex-1 grid place-items-center p-6 text-center">
            <div>
              <p className="text-ink-soft">Your cart is empty.</p>
              <Link href="/shop" onClick={close} className="btn btn-gold mt-4">Shop candles</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4">
              <div className="pt-4"><FreeDeliveryBar subtotal={t.subtotal} /></div>
              <CartLines onNavigate={close} />
              <Upsell />
            </div>
            <div className="border-t border-line p-4 space-y-3 bg-card">
              <CartSummary t={t} showGift={false} />
              <Link href="/checkout" onClick={close} className="btn btn-gold w-full">Checkout</Link>
              <Link href="/cart" onClick={close} className="btn btn-line w-full">View cart</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
