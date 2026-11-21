import type { Metadata } from "next";
import { business, fullAddress, siteUrl } from "@/config/business";
import type { Product } from "@/data/products";
import { categoryName, fromPrice, pricedVariants } from "@/lib/catalog";
import { img } from "@/lib/img";

const clip = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n - 1).trimEnd() + "…");

export function pageMeta(opts: { title: string; description: string; path: string; image?: string; noindex?: boolean }): Metadata {
  const url = siteUrl() + opts.path;
  const image = opts.image ? (opts.image.startsWith("http") ? opts.image : siteUrl() + img(opts.image)) : `${siteUrl()}/logo.jpg`;
  return {
    title: clip(opts.title, 60),
    description: clip(opts.description, 160),
    alternates: { canonical: url },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: { title: clip(opts.title, 60), description: clip(opts.description, 160), url, siteName: business.name, type: "website", images: [{ url: image }], locale: "en_IN" },
    twitter: { card: "summary_large_image", title: clip(opts.title, 60), description: clip(opts.description, 160), images: [image] },
  };
}

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": siteUrl() + "/#org",
      name: business.legalName,
      url: siteUrl(),
      logo: siteUrl() + "/logo.jpg",
      email: business.email,
      telephone: business.phoneTel,
      sameAs: [business.instagramUrl],
    },
    {
      "@type": "LocalBusiness",
      "@id": siteUrl() + "/#local",
      name: business.legalName,
      url: siteUrl(),
      image: siteUrl() + "/logo.jpg",
      telephone: business.phoneTel,
      email: business.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${business.address.line1}, ${business.address.area}`,
        addressLocality: business.address.city,
        addressRegion: business.address.state,
        postalCode: business.address.pincode,
        addressCountry: "IN",
      },
      hasMap: business.mapsUrl,
      description: `${business.name} – ${fullAddress()}`,
    },
    {
      "@type": "WebSite",
      "@id": siteUrl() + "/#site",
      url: siteUrl(),
      name: business.name,
      potentialAction: { "@type": "SearchAction", target: `${siteUrl()}/shop?q={search_term_string}`, "query-input": "required name=search_term_string" },
    },
  ],
});

export const breadcrumbJsonLd = (crumbs: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: siteUrl() + c.path })),
});

export function productJsonLd(p: Product) {
  const validUntil = new Date(Date.now() + 365 * 86400_000).toISOString().slice(0, 10);
  const validFrom = new Date().toISOString().slice(0, 10);
  const offer = (v: { label: string; price: number }) => ({
    "@type": "Offer",
    priceCurrency: "INR",
    price: v.price,
    availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    url: `${siteUrl()}/product/${p.slug}`,
    validFrom,
    priceValidUntil: validUntil,
    itemCondition: "https://schema.org/NewCondition",
    shippingDetails: {
      "@type": "OfferShippingDetails",
      shippingRate: { "@type": "MonetaryAmount", value: business.deliveryCharge, currency: "INR" },
      shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
      deliveryTime: { "@type": "ShippingDeliveryTime", handlingTime: { "@type": "QuantitativeValue", minValue: Number(business.dispatchDays.split("–")[0]), maxValue: Number(business.dispatchDays.split("–")[1]), unitCode: "DAY" }, transitTime: { "@type": "QuantitativeValue", minValue: Number(business.deliveryDays.split("–")[0]), maxValue: Number(business.deliveryDays.split("–")[1]), unitCode: "DAY" } },
    },
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy",
      applicableCountry: "IN",
      returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
      merchantReturnDays: business.returnWindowDays,
      returnMethod: "https://schema.org/ReturnByMail",
      returnFees: "https://schema.org/ReturnFeesCustomerResponsibility",
      merchantReturnLink: `${siteUrl()}/refund`,
    },
  });
  const vs = pricedVariants(p);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.shortDescription,
    sku: p.slug,
    category: categoryName(p.category),
    brand: { "@type": "Brand", name: business.name },
    image: p.images.length ? p.images.map((i) => (i.startsWith("http") ? i : siteUrl() + img(i))) : [siteUrl() + "/logo.jpg"],
    offers: vs.length > 1
      ? { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: fromPrice(p), highPrice: Math.max(...vs.map((v) => v.price)), offerCount: vs.length, offers: vs.map(offer) }
      : offer(vs[0]),
    // deliberately NO aggregateRating / review: we have no real ones
  };
}

export const itemListJsonLd = (name: string, list: Product[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${siteUrl()}/product/${p.slug}`, name: p.name })),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
