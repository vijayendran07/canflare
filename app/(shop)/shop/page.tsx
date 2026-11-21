import { categories } from "@/data/products";
import { getCatalog } from "@/lib/server-catalog";
import { isVisible } from "@/lib/catalog";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import ShopList from "@/components/ShopList";

export const revalidate = 300;
export const metadata = pageMeta({
  title: "Shop Candles – Jar, Votive, Pillar & Diya",
  description: "Browse all Canflare candles: scented jar candles, votives, pillar, advent and diya candles. Order online, delivery across India.",
  path: "/shop",
});

export default async function ShopPage() {
  const list = (await getCatalog()).filter(isVisible);
  const cats = categories.filter((c) => list.some((p) => p.category === c.slug));
  return (
    <div className="section-bg bg-champagne">
    <div className="container-x py-8">
      <h1 className="text-3xl sm:text-4xl mb-6">Shop</h1>
      <ShopList products={list} categories={cats} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }])} />
      <JsonLd data={itemListJsonLd("All candles", list)} />
    </div>
    </div>
  );
}
