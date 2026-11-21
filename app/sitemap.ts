import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/business";
import { categories } from "@/data/products";
import { getCatalog } from "@/lib/server-catalog";
import { isVisible } from "@/lib/catalog";
import { img } from "@/lib/img";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();
  const fixed = ["", "/shop", "/about", "/contact", "/faq", "/shipping", "/refund", "/privacy", "/terms", "/track"].map((p) => ({
    url: base + p,
    lastModified: now,
    changeFrequency: p === "" ? ("weekly" as const) : ("monthly" as const),
    priority: p === "" ? 1 : 0.6,
  }));
  const cats = categories.map((c) => ({ url: `${base}/category/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 }));
  const prods = (await getCatalog()).filter(isVisible).map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: p.images.map((i) => (i.startsWith("http") ? i : base + img(i))),
  }));
  return [...fixed, ...cats, ...prods]; // admin is never listed
}
