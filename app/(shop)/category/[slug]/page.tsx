import { notFound } from "next/navigation";
import Link from "next/link";
import { categories } from "@/data/products";
import { getCatalog } from "@/lib/server-catalog";
import { isVisible } from "@/lib/catalog";
import { breadcrumbJsonLd, itemListJsonLd, pageMeta } from "@/lib/seo";
import ShopList from "@/components/ShopList";
import JsonLd from "@/components/JsonLd";
import { business } from "@/config/business";
import { ownerWaLink } from "@/lib/whatsapp";
import { WhatsAppIcon } from "@/components/Icons";

export const revalidate = 300;

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  if (!c) return {};
  return pageMeta({
    title: `${c.name} – Buy Online | Canflare`,
    description: `${c.blurb} Buy ${c.name.toLowerCase()} from Canflare, Chennai. Order online, delivery across India.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  if (!c) notFound();
  const list = (await getCatalog()).filter((p) => isVisible(p) && p.category === slug);
  return (
    <div className="section-bg bg-bloom">
    <div className="container-x py-8">
      <nav className="text-xs text-taupe mb-3" aria-label="Breadcrumb">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/shop" className="hover:underline">Shop</Link> / {c.name}
      </nav>
      <h1 className="text-3xl sm:text-4xl">{c.name}</h1>
      <p className="mt-2 text-ink-soft max-w-2xl">{c.blurb}</p>
      {list.length ? (
        <div className="mt-6"><ShopList products={list} categories={categories} lockCategory={slug} /></div>
      ) : (
        <div className="card mt-6 p-8 text-center text-ink-soft">
          <p>Prices for {c.name.toLowerCase()} will be listed soon. Message us to order right now.</p>
          <a href={ownerWaLink(`Hi ${business.name}! I'm interested in ${c.name}.`)} target="_blank" rel="noopener noreferrer" className="btn btn-wa mt-4"><WhatsAppIcon /> Ask on WhatsApp</a>
        </div>
      )}
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }, { name: c.name, path: `/category/${slug}` }])} />
      {list.length > 0 && <JsonLd data={itemListJsonLd(c.name, list)} />}
    </div>
    </div>
  );
}
