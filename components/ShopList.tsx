"use client";
import { useEffect, useMemo, useState } from "react";
import type { Category, Product } from "@/data/products";
import { fromPrice } from "@/lib/catalog";
import { searchItems } from "@/lib/search";
import { categoryName } from "@/lib/catalog";
import ProductCard from "@/components/ProductCard";
import { BottomSheet } from "@/components/ui/overlays";
import { useInfinite } from "@/components/ui/LoadMore";
import { EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import CandleArt from "@/components/CandleArt";
import { SearchIcon } from "@/components/Icons";

type Sort = "featured" | "low" | "high" | "name";
const PRICE_BANDS = [
  { id: "u500", label: "Under ₹500", test: (p: number) => p < 500 },
  { id: "500-999", label: "₹500 – ₹999", test: (p: number) => p >= 500 && p < 1000 },
  { id: "1000+", label: "₹1,000 & above", test: (p: number) => p >= 1000 },
];

/** Listing used by /shop and /category/[slug]: search, filters (sheet on phones / sidebar on desktop), removable chips, infinite load. */
export default function ShopList({ products, categories, lockCategory }: { products: Product[]; categories: Category[]; lockCategory?: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(lockCategory ?? "all");
  const [band, setBand] = useState("all");
  const [stock, setStock] = useState(false);
  const [sort, setSort] = useState<Sort>("featured");
  const [sheet, setSheet] = useState(false);

  // apply ?q= / ?cat= after hydration so the full list is still server-rendered (SEO, no layout shift)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    if (sp.get("q")) setQ(sp.get("q")!);
    if (!lockCategory && sp.get("cat")) setCat(sp.get("cat")!);
  }, [lockCategory]);

  const bands = PRICE_BANDS.filter((b) => products.some((p) => b.test(fromPrice(p))));

  const list = useMemo(() => {
    let l = products.filter((p) => (cat === "all" || p.category === cat) && (!stock || p.inStock));
    const b = PRICE_BANDS.find((x) => x.id === band);
    if (b) l = l.filter((p) => b.test(fromPrice(p)));
    if (q.trim()) {
      const hits = searchItems(l.map((p) => ({ slug: p.slug, name: p.name, subtitle: p.subtitle, category: p.category, categoryName: categoryName(p.category), keywords: p.shortDescription })), q, 50).map((x) => x.slug);
      l = hits.map((s) => l.find((p) => p.slug === s)!);
    } else if (sort === "low") l = [...l].sort((a, c) => fromPrice(a) - fromPrice(c));
    else if (sort === "high") l = [...l].sort((a, c) => fromPrice(c) - fromPrice(a));
    else if (sort === "name") l = [...l].sort((a, c) => a.name.localeCompare(c.name));
    return l;
  }, [products, q, cat, band, stock, sort]);

  const { shown, sentinel } = useInfinite(list, 8);

  const active = [
    !lockCategory && cat !== "all" ? { k: "cat", label: categories.find((c) => c.slug === cat)?.name ?? cat, clear: () => setCat("all") } : null,
    band !== "all" ? { k: "band", label: PRICE_BANDS.find((b) => b.id === band)!.label, clear: () => setBand("all") } : null,
    stock ? { k: "stock", label: "In stock", clear: () => setStock(false) } : null,
    q.trim() ? { k: "q", label: `“${q.trim()}”`, clear: () => setQ("") } : null,
  ].filter(Boolean) as { k: string; label: string; clear: () => void }[];
  const reset = () => { setQ(""); setBand("all"); setStock(false); if (!lockCategory) setCat("all"); };

  const Filters = (
    <div className="space-y-6">
      {!lockCategory && (
        <fieldset>
          <legend className="label !text-[11px] uppercase tracking-[0.18em]">Type</legend>
          <div className="flex flex-wrap gap-2">
            {[{ slug: "all", name: "All" }, ...categories].map((c) => <button key={c.slug} className="chip" aria-pressed={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</button>)}
          </div>
        </fieldset>
      )}
      {bands.length > 1 && (
        <fieldset>
          <legend className="label !text-[11px] uppercase tracking-[0.18em]">Price</legend>
          <div className="flex flex-wrap gap-2">
            <button className="chip" aria-pressed={band === "all"} onClick={() => setBand("all")}>Any</button>
            {bands.map((b) => <button key={b.id} className="chip" aria-pressed={band === b.id} onClick={() => setBand(b.id)}>{b.label}</button>)}
          </div>
        </fieldset>
      )}
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#7b5800]" checked={stock} onChange={(e) => setStock(e.target.checked)} /> In stock only</label>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[250px_1fr] lg:gap-10">
      {/* desktop: sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-32 space-y-6">
          <label className="relative block">
            <span className="sr-only">Search candles</span>
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-taupe" />
            <input className="input pl-10" type="search" placeholder="Search candles" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          {Filters}
        </div>
      </aside>

      <div>
        {/* toolbar */}
        <div className="flex items-center gap-2">
          <label className="relative min-w-0 flex-1 lg:hidden">
            <span className="sr-only">Search candles</span>
            <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-taupe" />
            <input className="input pl-10" type="search" placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <button className="btn btn-line lg:hidden" onClick={() => setSheet(true)} aria-haspopup="dialog">Filters{active.filter((a) => a.k !== "q").length ? ` (${active.filter((a) => a.k !== "q").length})` : ""}</button>
          <p className="hidden flex-1 text-sm text-taupe lg:block" aria-live="polite">{list.length} candle{list.length === 1 ? "" : "s"}</p>
          <label>
            <span className="sr-only">Sort</span>
            <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value as Sort)} disabled={!!q.trim()}>
              <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="name">Name A–Z</option>
            </select>
          </label>
        </div>

        {active.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {active.map((a) => <button key={a.k} className="chip !min-h-9 bg-oat" onClick={a.clear} aria-label={`Remove filter ${a.label}`}>{a.label} <span aria-hidden>✕</span></button>)}
            <button className="text-sm underline text-taupe" onClick={reset}>Clear all</button>
          </div>
        )}
        <p className="mt-3 text-sm text-taupe lg:hidden" aria-live="polite">{list.length} candle{list.length === 1 ? "" : "s"}</p>

        {list.length ? (
          <>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-3">{shown.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            {sentinel}
          </>
        ) : (
          <div className="mt-6">
            <EmptyState icon={<CandleArt kind="votive" className="h-9 w-9" />} title="No candles match" text="Try removing a filter or searching for something else." action={<Button variant="dark" onClick={reset}>Clear filters</Button>} />
          </div>
        )}
      </div>

      <BottomSheet open={sheet} onClose={() => setSheet(false)} title="Filters" footer={<div className="flex gap-3"><Button variant="line" className="flex-1" onClick={reset}>Clear</Button><Button className="flex-1" onClick={() => setSheet(false)}>Show {list.length} candle{list.length === 1 ? "" : "s"}</Button></div>}>
        {Filters}
      </BottomSheet>
    </div>
  );
}
