"use client";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { pricedVariants } from "@/lib/catalog";
import { useCart } from "@/store/cart";
import { track } from "@/lib/analytics";
import { flyToCart } from "@/lib/fx";
import { useToast } from "@/components/ui/overlays";
import { CheckIcon } from "./Icons";

/** One-tap add for single-size products (image flies to the cart); "Choose size" for products with several sizes. */
export default function QuickAdd({ p }: { p: Product }) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const toast = useToast();
  const [done, setDone] = useState(false);
  const vs = pricedVariants(p);

  if (!p.inStock) return <span className="btn btn-line w-full opacity-60 pointer-events-none">Out of stock</span>;
  if (vs.length !== 1) return <Link href={`/product/${p.slug}`} className="btn btn-line w-full">Choose size</Link>;

  return (
    <button
      className="btn btn-dark w-full"
      onClick={(e) => {
        const card = e.currentTarget.closest("article");
        add({ slug: p.slug, variant: vs[0].label, name: p.name, price: vs[0].price, image: p.images[0] });
        track("add_to_cart", { value: vs[0].price, items: [{ item_id: p.slug, item_name: p.name, item_variant: vs[0].label, price: vs[0].price, quantity: 1 }] });
        flyToCart(card?.querySelector("a > div"));
        toast(`${p.name} added to cart`, "ok");
        setDone(true);
        setTimeout(() => setDone(false), 1400);
        if (window.matchMedia("(min-width: 768px)").matches) openDrawer();
      }}
    >
      {done ? <><CheckIcon className="w-4 h-4" /> Added</> : "Add to cart"}
    </button>
  );
}
