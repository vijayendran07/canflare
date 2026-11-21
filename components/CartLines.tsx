"use client";
import Link from "next/link";
import { useCart } from "@/store/cart";
import { inr } from "@/lib/money";
import ProductImage from "./ProductImage";

export default function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  return (
    <ul className="divide-y divide-line">
      {items.map((it) => (
        <li key={it.slug + it.variant} className="flex gap-3 py-4">
          <Link href={`/product/${it.slug}`} onClick={onNavigate} className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-oat">
            <ProductImage src={it.image} alt={it.name} sizes="80px" />
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/product/${it.slug}`} onClick={onNavigate} className="font-serif text-base leading-snug line-clamp-2">
              {it.name}
            </Link>
            <p className="text-xs text-taupe">{it.variant}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="inline-flex items-center border border-line rounded-lg bg-card">
                <button aria-label="Decrease quantity" className="w-9 h-9 text-lg" onClick={() => setQty(it.slug, it.variant, it.qty - 1)}>
                  −
                </button>
                <span className="w-8 text-center text-sm font-semibold" aria-live="polite">{it.qty}</span>
                <button aria-label="Increase quantity" className="w-9 h-9 text-lg" onClick={() => setQty(it.slug, it.variant, it.qty + 1)}>
                  +
                </button>
              </div>
              <p className="font-semibold">{inr(it.price * it.qty)}</p>
            </div>
            <button onClick={() => remove(it.slug, it.variant)} className="mt-1 text-xs text-danger underline">
              Remove
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
