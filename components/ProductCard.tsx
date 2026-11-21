import Link from "next/link";
import type { Product } from "@/data/products";
import { categoryName, fromPrice, pricedVariants } from "@/lib/catalog";
import { inr } from "@/lib/money";
import ProductImage from "./ProductImage";
import QuickAdd from "./QuickAdd";
import VT from "./VT";

export default function ProductCard({ p }: { p: Product }) {
  const multi = pricedVariants(p).length > 1;
  return (
    <article className="group flex flex-col rounded-2xl bg-card border border-line overflow-hidden card-glow">
      <Link href={`/product/${p.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-oat overflow-hidden">
          <VT name={`product-${p.slug}`}><div className="absolute inset-0"><ProductImage src={p.images[0]} alt={p.name} category={p.category} /></div></VT>
          {!p.inStock && <span className="absolute top-3 left-3 bg-ink text-white text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full">Out of stock</span>}
        </div>
        <div className="px-4 pt-4">
          <p className="eyebrow !text-[10px] !tracking-[0.2em] text-taupe">{categoryName(p.category)}</p>
          <h3 className="font-serif text-[17px] sm:text-lg leading-snug mt-1 line-clamp-2 min-h-[2.6em]">{p.name}</h3>
          {p.subtitle && <p className="text-xs text-taupe mt-0.5 line-clamp-1">{p.subtitle}</p>}
          <p className="mt-2 font-semibold text-lg">
            {multi && <span className="text-xs font-normal text-taupe">From </span>}
            {inr(fromPrice(p))}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-3 mt-auto"><QuickAdd p={p} /></div>
    </article>
  );
}
