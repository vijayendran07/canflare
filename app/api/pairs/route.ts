import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { sheetCall, sheetConfigured } from "@/lib/sheet";
import { coBought } from "@/lib/pairs";
import { getCatalog } from "@/lib/server-catalog";
import { isVisible, pricedVariants } from "@/lib/catalog";

export const dynamic = "force-dynamic";

// Orders are read server-side only; the response contains product slugs and prices – never customer data.
const orders = unstable_cache(
  async () => (await sheetCall<{ orders: { status?: string; items?: { slug?: string }[] }[] }>("admin_orders")).orders ?? [],
  ["pairs-orders-v1"],
  { revalidate: 3600 },
);

export async function GET(req: Request) {
  const slugs = (new URL(req.url).searchParams.get("slugs") ?? "").split(",").filter((s) => /^[a-z0-9-]{2,80}$/.test(s)).slice(0, 20);
  if (!slugs.length || !sheetConfigured()) return NextResponse.json({ products: [] });
  try {
    const picks = coBought(await orders(), slugs);
    const cat = await getCatalog();
    const products = picks
      .map((s) => cat.find((p) => p.slug === s))
      .filter((p): p is NonNullable<typeof p> => !!p && isVisible(p) && p.inStock)
      .map((p) => ({ slug: p.slug, name: p.name, category: p.category, image: p.images[0] ?? null, variants: pricedVariants(p) }));
    return NextResponse.json({ products }, { headers: { "Cache-Control": "public, s-maxage=600" } });
  } catch {
    return NextResponse.json({ products: [] }); // no data → no upsell
  }
}
