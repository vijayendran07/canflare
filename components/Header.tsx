"use client";
import Link from "next/link";
import Image from "next/image";
import { business } from "@/config/business";
import { inr } from "@/lib/money";
import { useCart, useCartReady } from "@/store/cart";
import { useUI } from "@/store/ui";
import { CartIcon, SearchIcon, WhatsAppIcon } from "./Icons";
import { ownerWaLink } from "@/lib/whatsapp";

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/category/votive-candles", label: "Votives" },
  { href: "/category/pillar-candles", label: "Pillars" },
  { href: "/about", label: "Our story", wide: true },
  { href: "/contact", label: "Contact" },
  { href: "/track", label: "Track order", wide: true },
];

export default function Header() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const openDrawer = useCart((s) => s.openDrawer);
  const openSearch = useUI((s) => s.openSearch);
  const ready = useCartReady();

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-gold text-ink font-semibold text-[11px] sm:text-xs tracking-[0.12em] text-center px-3 py-2 uppercase">
        Free delivery above {inr(business.freeDeliveryThreshold)} <span className="mx-2 opacity-40">|</span> Order online · Pay after we confirm
      </div>
      <div className="glass border-x-0 border-t-0">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Canflare home" className="shrink-0">
            <Image src="/logo-light.png" alt="Canflare – Let there be Light" width={148} height={52} priority className="h-9 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 whitespace-nowrap text-[12px] uppercase tracking-[0.14em] font-semibold text-ink-soft" aria-label="Main">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className={`hover:text-gold-deep transition-colors ${"wide" in n ? "hidden lg:inline" : ""}`}>{n.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <button onClick={openSearch} aria-label="Search" className="btn btn-ghost btn-icon"><SearchIcon className="w-5 h-5" /></button>
            <a href={ownerWaLink(`Hi ${business.name}!`)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp us" className="hidden sm:grid btn btn-ghost btn-icon text-[#1faa52]"><WhatsAppIcon /></a>
            <button onClick={openDrawer} data-cart-target className="btn btn-ghost btn-icon relative hidden md:inline-flex" aria-label={`Cart, ${ready ? count : 0} items`}>
              <CartIcon className="w-6 h-6" />
              {ready && count > 0 && (
                <span key={count} className="absolute top-0 right-0 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink animate-pop">{count}</span>
              )}
            </button>
            {/* phones: the cart lives in the bottom nav, but keep a cart link in the header too for discoverability */}
            <button onClick={openDrawer} className="btn btn-ghost btn-icon relative md:hidden" aria-label={`Cart, ${ready ? count : 0} items`}>
              <CartIcon className="w-6 h-6" />
              {ready && count > 0 && <span key={count} className="absolute top-0 right-0 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink animate-pop">{count}</span>}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
