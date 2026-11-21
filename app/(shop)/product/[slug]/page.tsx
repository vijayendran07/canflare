import { notFound } from "next/navigation";
import Link from "next/link";
import { getCatalog, getProduct } from "@/lib/server-catalog";
import { categoryName, fromPrice, isVisible } from "@/lib/catalog";
import { breadcrumbJsonLd, pageMeta, productJsonLd } from "@/lib/seo";
import { inr } from "@/lib/money";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";
import { siteUrl } from "@/config/business";
import ProductClient from "./ProductClient";
import PersonalLazy from "@/components/PersonalLazy";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p || !isVisible(p)) return {};
  return pageMeta({
    title: `${p.name} – Buy Online from ${inr(fromPrice(p))} | Canflare`,
    description: `${p.shortDescription} ${p.details.map((d) => d.value).slice(0, 2).join(", ")}. Order online, delivery across India.`.replace(/\s+\./g, "."),
    path: `/product/${slug}`,
    image: p.images[0],
  });
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p || !isVisible(p)) notFound();
  const related = (await getCatalog()).filter((x) => x.slug !== slug && isVisible(x) && x.category === p.category).slice(0, 4);
  const more = related.length ? related : (await getCatalog()).filter((x) => x.slug !== slug && isVisible(x)).slice(0, 4);

  return (
    <div className="section-bg bg-glow">
    <div className="container-x py-6 sm:py-8">
      <nav className="text-xs text-taupe mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Shop</Link> /{" "}
        <Link href={`/category/${p.category}`} className="hover:underline">{categoryName(p.category)}</Link> / {p.name}
      </nav>
      <ProductClient product={p} url={`${siteUrl()}/product/${p.slug}`} />
      {more.length > 0 && (
        <section className="mt-14">
          <h2 className="text-2xl mb-4">You may also like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">{more.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </section>
      )}
      <PersonalLazy exclude={slug} showReorder={false} />
      <JsonLd data={productJsonLd(p)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: categoryName(p.category), path: `/category/${p.category}` }, { name: p.name, path: `/product/${p.slug}` }])} />
    </div>
    </div>
  );
}
