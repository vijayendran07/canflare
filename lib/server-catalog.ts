import "server-only";
import { unstable_cache } from "next/cache";
import { mergeCatalog, staticCatalog, type PriceRow } from "@/lib/catalog";
import { sheetCall, sheetConfigured } from "@/lib/sheet";
import type { Product } from "@/data/products";

const load = unstable_cache(
  async (): Promise<Product[]> => {
    if (!sheetConfigured()) return staticCatalog();
    try {
      const [p, c] = await Promise.all([
        sheetCall<{ rows: PriceRow[] }>("products"),
        sheetCall<{ items: Product[] }>("custom"),
      ]);
      return mergeCatalog(p.rows ?? [], (c.items ?? []).map((x) => ({ ...x, custom: true })));
    } catch {
      return staticCatalog(); // sheet unreachable -> fall back to /data/products.ts
    }
  },
  ["catalog-v1"],
  { revalidate: 300, tags: ["products"] },
);

export const getCatalog = () => load();
export async function getProduct(slug: string) {
  return (await getCatalog()).find((p) => p.slug === slug);
}
