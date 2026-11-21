"use client";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { categoryName, pricedVariants } from "@/lib/catalog";
import { inr } from "@/lib/money";
import { business } from "@/config/business";
import { productEnquiry, ownerWaLink } from "@/lib/whatsapp";
import { useCart } from "@/store/cart";
import { track } from "@/lib/analytics";
import { flyToCart } from "@/lib/fx";
import { markViewed, preferredVariant, rememberVariant } from "@/lib/profile";
import { Accordion } from "@/components/ui/primitives";
import { QtyStepper } from "@/components/ui/controls";
import { useToast } from "@/components/ui/overlays";
import Gallery from "@/components/product/Gallery";
import DeliveryEstimate from "@/components/product/DeliveryEstimate";
import StickyBuyBar from "@/components/product/StickyBuyBar";
import { CheckIcon, TruckIcon, WhatsAppIcon, FlameIcon } from "@/components/Icons";

const CARE = [
  "Trim the wick to about 5 mm before every burn.",
  "Never leave a burning candle unattended, and keep it away from children, pets and anything flammable.",
  "Burn on a stable, heat-resistant surface.",
  "Let the wax melt fully across the top the first time you light it.",
  "Extinguish before the wax gets within 1 cm of the base.",
];

export default function ProductClient({ product: p, url }: { product: Product; url: string }) {
  const variants = pricedVariants(p);
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const toast = useToast();
  const gallery = useRef<HTMLDivElement>(null);
  const v = variants[vi];

  useEffect(() => {
    markViewed(p.slug);
    track("view_item", { items: [{ item_id: p.slug, item_name: p.name, price: variants[0]?.price }] });
    const pref = preferredVariant(p.slug);
    const k = pref ? variants.findIndex((x) => x.label === pref) : -1;
    if (k >= 0) setVi(k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.slug]);

  const addToCart = () => {
    add({ slug: p.slug, variant: v.label, name: p.name, price: v.price, image: p.images[0] }, qty);
    rememberVariant(p.slug, v.label);
    track("add_to_cart", { value: v.price * qty, items: [{ item_id: p.slug, item_name: p.name, item_variant: v.label, price: v.price, quantity: qty }] });
    flyToCart(gallery.current);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    toast(`${p.name} added to cart`, "ok");
    // on desktop the drawer confirms the add; on phones the fly-to-cart + toast is enough and keeps the buyer in flow
    if (window.matchMedia("(min-width: 768px)").matches) openDrawer();
  };

  const shareText = `${p.name} – ${inr(v.price)} from ${business.name}\n${url}`;
  const extra = [
    p.ingredients ? { q: "Ingredients", a: <p>{p.ingredients}</p> } : null,
    p.usage ? { q: "How to use", a: <p>{p.usage}</p> } : null,
    p.storage ? { q: "Storage", a: <p>{p.storage}</p> } : null,
  ].filter(Boolean) as { q: string; a: React.ReactNode }[];

  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
        <div ref={gallery} className="h-fit md:sticky md:top-32">
          <Gallery slug={p.slug} name={p.name} category={p.category} images={p.images} spin={p.spin} />
        </div>

        <div>
          <p className="eyebrow">{categoryName(p.category)}</p>
          <h1 className="mt-2 text-4xl leading-[1.06] sm:text-5xl">{p.name}</h1>
          {p.subtitle && <p className="mt-2 text-taupe">{p.subtitle}</p>}

          <div className="mt-5 rounded-2xl border border-line bg-oat/80 p-5">
            <p className="text-4xl font-semibold tabular-nums" aria-live="polite">{inr(v.price * qty)}</p>
            <p className="mt-1 text-xs text-taupe">{qty > 1 ? `${inr(v.price)} each · ` : ""}Delivery FREE on orders of {inr(business.freeDeliveryThreshold)}+</p>
          </div>

          <p className="mt-5 leading-relaxed text-ink-soft">{p.description}</p>
          {p.highlights.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">{p.highlights.map((h) => <li key={h} className="rounded-full border border-line bg-card px-3 py-1 text-xs">{h}</li>)}</ul>
          )}

          {variants.length > 1 && (
            <fieldset className="mt-6">
              <legend className="label !text-[11px] uppercase tracking-[0.18em]">Choose size</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {variants.map((x, i) => (
                  <button key={x.label} type="button" aria-pressed={i === vi} onClick={() => setVi(i)} className={`rounded-xl border-2 px-3 py-2.5 text-left transition-colors duration-[220ms] ${i === vi ? "border-ink bg-card shadow-e2" : "border-line bg-card hover:border-gold-deep"}`}>
                    <span className="block text-sm font-semibold">{x.label}</span>
                    <span className="block text-sm text-gold-deep">{inr(x.price)}</span>
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          {variants.length === 1 && v.label !== "Standard" && <p className="mt-4 text-sm text-ink-soft">Size: <b>{v.label}</b></p>}

          {p.inStock ? (
            <div id="buy-actions" className="mt-6">
              <div className="flex items-center gap-3">
                <QtyStepper value={qty} onChange={setQty} />
                <button onClick={addToCart} className="btn btn-gold btn-lg flex-1 whitespace-nowrap shadow-e2">
                  {added ? <><CheckIcon className="h-4 w-4" /> Added</> : `Add to cart · ${inr(v.price * qty)}`}
                </button>
              </div>
              <a href={ownerWaLink(productEnquiry(p.name, v.label, qty, v.price, url))} target="_blank" rel="noopener noreferrer" className="btn btn-line mt-3 w-full">
                <WhatsAppIcon className="h-4 w-4 text-[#1faa52]" /> Prefer WhatsApp? Order there
              </a>
            </div>
          ) : (
            <div className="mt-6">
              <p className="font-semibold text-danger">Currently out of stock</p>
              <a href={ownerWaLink(`Hi ${business.name}! When will ${p.name} be back in stock? ${url}`)} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg mt-3 w-full"><WhatsAppIcon /> Ask on WhatsApp</a>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between text-sm">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 underline decoration-line underline-offset-4 hover:text-gold-deep">
              <WhatsAppIcon className="h-4 w-4 text-[#1faa52]" /> Share on WhatsApp
            </a>
          </div>

          <div className="mt-6"><DeliveryEstimate subtotal={v.price * qty} /></div>

          <ul className="mt-4 grid grid-cols-3 gap-2 text-center text-[11px] text-ink-soft">
            <li className="rounded-xl border border-line bg-card p-3"><TruckIcon className="mx-auto h-5 w-5 text-gold-deep" /><span className="mt-1 block">Delivery across India</span></li>
            <li className="rounded-xl border border-line bg-card p-3"><WhatsAppIcon className="mx-auto h-5 w-5 text-[#1faa52]" /><span className="mt-1 block">Pay after we confirm</span></li>
            <li className="rounded-xl border border-line bg-card p-3"><FlameIcon className="mx-auto h-5 w-5 text-gold-deep" /><span className="mt-1 block">Bulk &amp; gifting orders</span></li>
          </ul>

          {p.details.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-2xl">Product details</h2>
              <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card text-sm">
                {p.details.map((d) => <div key={d.label} className="flex gap-4 px-4 py-3"><dt className="w-28 shrink-0 text-taupe">{d.label}</dt><dd>{d.value}</dd></div>)}
              </dl>
            </section>
          )}

          <section className="mt-8">
            <Accordion items={[...extra, { q: "Care & safety", a: <ul className="list-disc space-y-1.5 pl-5 text-sm">{CARE.map((c) => <li key={c}>{c}</li>)}</ul> }]} />
          </section>
        </div>
      </div>

      {p.inStock && (
        <StickyBuyBar targetId="buy-actions" name={p.name} variant={v.label} total={v.price * qty} onAdd={addToCart} whatsappHref={ownerWaLink(productEnquiry(p.name, v.label, qty, v.price, url))} />
      )}
    </>
  );
}
