"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, useCartReady } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CartIcon, SearchIcon } from "./Icons";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
);

/** Thumb-zone navigation on phones. Hidden on the product page (sticky buy bar) and at checkout (focused flow). */
export default function BottomNav() {
  const path = usePathname();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openDrawer = useCart((s) => s.openDrawer);
  const openSearch = useUI((s) => s.openSearch);
  const ready = useCartReady();
  if (path.startsWith("/product/") || path.startsWith("/checkout")) return null;

  const on = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  const item = (active: boolean) => `relative flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-semibold ${active ? "text-gold-deep" : "text-taupe"}`;

  return (
    <nav aria-label="Quick navigation" className="no-print fixed inset-x-0 bottom-0 z-40 md:hidden glass-dark !rounded-none border-x-0 border-b-0 shadow-[0_-6px_24px_-12px_rgb(250_181_7/.5)] pb-[env(safe-area-inset-bottom)]">
      <ul className="grid h-[var(--bottom-nav-h)] grid-cols-5">
        <li><Link href="/" className={item(on("/"))} aria-current={on("/") ? "page" : undefined}><Icon d="M3 11l9-8 9 8M5 10v10h14V10" />Home</Link></li>
        <li><Link href="/shop" className={item(on("/shop") || on("/category"))} aria-current={on("/shop") ? "page" : undefined}><Icon d="M4 7h16l-1.5 12h-13zM8 7a4 4 0 0 1 8 0" />Shop</Link></li>
        <li><button onClick={openSearch} className={`${item(false)} w-full`}><SearchIcon className="w-6 h-6" />Search</button></li>
        <li>
          <button onClick={openDrawer} data-cart-target className={`${item(false)} w-full`}>
            <span className="relative"><CartIcon className="w-6 h-6" />
              {ready && count > 0 && <span key={count} className="absolute -right-2.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink animate-pop">{count}</span>}
            </span>Cart
          </button>
        </li>
        <li><Link href="/track" className={item(on("/track") || on("/order"))}><Icon d="M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10" />Track</Link></li>
      </ul>
    </nav>
  );
}
