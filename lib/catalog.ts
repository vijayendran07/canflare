import { products as baseProducts, categories, type Product, type Variant } from "@/data/products";

export type PriceRow = { slug: string; variant: string; price: number | null; inStock: boolean };

export function pricedVariants(p: Product): (Variant & { price: number })[] {
  return p.variants.filter((v): v is Variant & { price: number } => typeof v.price === "number" && v.price > 0);
}

/** A product is visible if active and has at least one priced variant. */
export function isVisible(p: Product): boolean {
  return p.active && pricedVariants(p).length > 0;
}

export const fromPrice = (p: Product): number => Math.min(...pricedVariants(p).map((v) => v.price));

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

/** Apply sheet overrides (price / stock per variant), add custom products, resolve combos. */
export function mergeCatalog(overrides: PriceRow[] | null, custom: Product[] | null): Product[] {
  const key = (s: string, v: string) => `${s}||${v}`;
  const ov = new Map<string, PriceRow>();
  (overrides ?? []).forEach((r) => ov.set(key(r.slug, r.variant), r));

  const apply = (p: Product): Product => {
    const variants = p.variants.map((v) => {
      const o = ov.get(key(p.slug, v.label));
      return o && o.price !== null && o.price > 0 ? { ...v, price: Math.round(o.price) } : v;
    });
    // in stock only if at least one variant is not marked out of stock in the sheet
    const rows = p.variants.map((v) => ov.get(key(p.slug, v.label))).filter(Boolean) as PriceRow[];
    const inStock = rows.length ? p.inStock && rows.some((r) => r.inStock) : p.inStock;
    return { ...p, variants, inStock };
  };

  const all = [...baseProducts, ...(custom ?? [])].map(apply);

  // combos go out of stock automatically when any item inside is out of stock
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  return all
    .map((p) => {
      if (!p.comboItems?.length) return p;
      const ok = p.comboItems.every((it) => {
        const inner = bySlug.get(it.slug);
        if (!inner || !inner.inStock) return false;
        const o = ov.get(key(it.slug, it.variant));
        return !o || o.inStock;
      });
      return ok ? p : { ...p, inStock: false };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function staticCatalog(): Product[] {
  return mergeCatalog(null, null);
}

export function findVariant(p: Product, label: string) {
  return pricedVariants(p).find((v) => v.label === label);
}
