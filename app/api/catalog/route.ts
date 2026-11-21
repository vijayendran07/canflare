import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/server-catalog";
import { categoryName, isVisible, pricedVariants } from "@/lib/catalog";

/** Lean, public catalogue used by search, the cart (price refresh), reorder, the concierge and the admin picker. */
export async function GET() {
  const list = (await getCatalog()).filter(isVisible).map((p) => ({
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle ?? "",
    category: p.category,
    categoryName: categoryName(p.category),
    keywords: [p.shortDescription, ...p.highlights].join(" "),
    inStock: p.inStock,
    image: p.images[0] ?? null,
    variants: pricedVariants(p),
  }));
  return NextResponse.json({ products: list }, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
}
