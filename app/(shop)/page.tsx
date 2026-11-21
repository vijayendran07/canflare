import Link from "next/link";
import { business } from "@/config/business";
import { categories } from "@/data/products";
import { getCatalog } from "@/lib/server-catalog";
import { isVisible } from "@/lib/catalog";
import { inr } from "@/lib/money";
import { ownerWaLink } from "@/lib/whatsapp";
import ProductCard from "@/components/ProductCard";
import CandleArt, { kindForCategory } from "@/components/CandleArt";
import JsonLd from "@/components/JsonLd";
import Image from "next/image";
import { img } from "@/lib/img";
import MagneticButton from "@/components/MagneticButton";
import RevealInit from "@/components/RevealInit";
import { Cormorant_Garamond } from "next/font/google";
import PersonalLazy from "@/components/PersonalLazy";
import { Button } from "@/components/ui/Button";
import { itemListJsonLd, pageMeta } from "@/lib/seo";
import { TruckIcon, WhatsAppIcon, FlameIcon } from "@/components/Icons";

const scripture = Cormorant_Garamond({ subsets: ["latin"], weight: ["500"], style: ["italic"], display: "swap" });

export const revalidate = 300;
export const metadata = pageMeta({
  title: "Canflare Candles – Jar, Votive & Pillar Candles",
  description: "Scented jar candles, votive candles, pillar, advent and diya candles from Canflare, Chennai. Order online, delivery across India.",
  path: "/",
});

function Head({ eyebrow, title, sub, light }: { eyebrow: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className="reveal mx-auto mb-8 max-w-2xl text-center sm:mb-12">
      <p className={`eyebrow ${light ? "eyebrow-gold" : ""}`}>{eyebrow}</p>
      <h2 className="mt-2 text-3xl sm:text-4xl">{title}</h2>
      {sub && <p className={`mt-3 ${light ? "text-on-stage-soft" : "text-ink-soft"}`}>{sub}</p>}
    </div>
  );
}

/** Bento layout: [slug, grid classes, tile style] */
const BENTO: [string, string, string][] = [
  ["votive-candles", "col-span-2 row-span-2 min-h-[22rem]", "stage text-on-stage border border-line"],
  ["diya-candles", "", "bg-gradient-to-br from-gold to-[#e69a00] text-[#3a2a00] [&_.eyebrow]:text-[#3a2a00]"],
  ["advent-candles", "row-span-2", "bg-card border border-line"],
  ["pillar-candles", "", "bg-card border border-line"],
  ["return-gift-pillars", "col-span-2", "bg-oat"],
  ["gift-sets", "col-span-2", "bg-oat"],
];

export default async function Home() {
  const all = (await getCatalog()).filter(isVisible);
  const picks = all.filter((p) => p.bestSeller);
  // a real photo for each category tile (first product in that category that has one)
  const photo: Record<string, string | undefined> = Object.fromEntries(categories.map((c) => [c.slug, (() => { const p = all.find((x) => x.category === c.slug && x.images[0]); return p ? p.images[1] ?? p.images[0] : undefined; })()]));
  const featured = (picks.length ? picks : all).slice(0, 8);
  const heading = picks.length ? { e: "Best sellers", t: "Customer favourites", s: "Hand-picked by us." } : { e: "The collection", t: "Our candles", s: "Add to cart and place your order – we confirm it and share payment details." };

  return (
    <>
      <RevealInit />

      {/* ───── HERO – owner's lit-candle photo, text over the dark left side (all screen sizes) ───── */}
      <section className="relative isolate overflow-hidden bg-[#2b2520]">
        <Image src={img("/products/hero-dark.jpg")} alt="Canflare candles glowing on a wooden table" fill priority sizes="100vw" className="-z-10 object-cover object-[78%_60%] lg:object-[70%_50%]" />
        {/* dark fade behind the text: stronger on phones where text covers more of the photo */}
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(30_24_18/.92)_0%,rgb(30_24_18/.75)_45%,rgb(30_24_18/.25)_80%,transparent_100%)] sm:bg-[linear-gradient(90deg,rgb(30_24_18/.88)_0%,rgb(30_24_18/.6)_38%,transparent_65%)]" aria-hidden />
        <div className="container-x flex min-h-[34rem] items-center py-12 sm:min-h-[36rem] lg:min-h-[min(46rem,calc(100svh-7rem))] lg:py-16">
          <div className="hero-copy max-w-[19rem] sm:max-w-md lg:max-w-xl">
            <p className="eyebrow !text-gold animate-rise">Candles from Chennai</p>
            <h1 className="mt-3 text-[clamp(2.3rem,8.5vw,3.4rem)] leading-[1.03] font-normal !text-[#fffaf0] animate-rise [animation-delay:80ms] lg:text-display">
              Let there be <em className="not-italic !text-gold">light</em>
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-[#f3e9d6] animate-rise [animation-delay:160ms] sm:text-[17px]">
              Votive, pillar, advent, diya and return-gift candles – made in Chennai, delivered across India.
            </p>
            <div className="mt-6 flex flex-col items-start gap-3 animate-rise [animation-delay:240ms] sm:flex-row sm:flex-wrap">
              <MagneticButton href="/shop" className="!px-7 sm:!px-8">Shop candles →</MagneticButton>
              <Button size="lg" variant="glass" className="!border-white/50 !bg-white/10 !px-6 !text-white hover:!bg-white/20" href={ownerWaLink(`Hi ${business.name}! I'd like to order candles.`)} target="_blank"><WhatsAppIcon /> Chat with us</Button>
            </div>
            <ul className="mt-7 grid max-w-md grid-cols-3 gap-3 text-xs animate-rise [animation-delay:320ms] sm:gap-4">
              {[["All-India", "delivery"], [`Free ≥ ${inr(business.freeDeliveryThreshold)}`, "delivery"], ["Pay later", "after we confirm"]].map(([x, y]) => (
                <li key={x} className="border-l-2 border-gold pl-2.5 sm:pl-3"><b className="block text-[13px] text-[#fffaf0] sm:text-sm">{x}</b><span className="text-[10px] uppercase tracking-wider text-[#e6d9bf]">{y}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PersonalLazy />
      <div className="hairline-gold" aria-hidden />

      {/* ───── BENTO CATEGORIES ───── */}
      <div className="section-bg bg-bloom"><section className="container-x py-14 sm:py-20">
        <Head eyebrow="Shop by type" title="Find your perfect glow" sub="Candles for every room, mood and occasion." />
        <div className="grid auto-rows-[10.5rem] grid-cols-2 gap-3 sm:auto-rows-[12rem] sm:gap-4 md:grid-cols-4">
          {BENTO.map(([slug, span, style], i) => {
            const c = categories.find((x) => x.slug === slug)!;
            return (
              <Link key={slug} href={`/category/${slug}`} style={{ transitionDelay: `${i * 60}ms` }} className={`tile reveal isolate flex flex-col justify-between overflow-hidden p-4 sm:p-5 ${span} ${style}`}>
                <div>
                  <h3 className="text-lg leading-tight sm:text-2xl">{c.name}</h3>
                  <p className="mt-1 hidden text-xs opacity-75 sm:block">{c.blurb}</p>
                </div>
                {photo[slug] ? (
                  <>
                    <Image src={img(photo[slug]!)} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="tile-art -z-10 object-cover" />
                    <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(255_253_245/.9)_0%,rgb(255_253_245/.4)_30%,transparent_50%,transparent_75%,rgb(255_253_245/.7)_100%)]" aria-hidden />
                  </>
                ) : (
                  <CandleArt kind={kindForCategory(slug)} className="tile-art pointer-events-none absolute -bottom-3 -right-3 h-[78%] w-[62%] opacity-95" />
                )}
                <span className="relative text-[11px] font-bold uppercase tracking-[0.2em]">Explore →</span>
              </Link>
            );
          })}
        </div>
      </section></div>

      {/* ───── STATEMENT ───── */}
      <div className="section-bg bg-glow"><section className="container-x py-14 sm:py-24" aria-label="Genesis 1:3">
        <figure className="reveal mx-auto max-w-3xl text-center">
          <FlameIcon className="mx-auto h-8 w-8 text-gold" />
          <blockquote className={`${scripture.className} mt-5 text-[clamp(2rem,6vw,3.75rem)] font-medium italic leading-[1.15] text-ink`}>
            “And God said, <span className="text-gold-deep">Let there be light:</span> and there was light.”
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-gold-deep">
            <span className="h-px w-10 bg-gold" aria-hidden /> Genesis 1:3 <span className="h-px w-10 bg-gold" aria-hidden />
          </figcaption>
        </figure>
      </section></div>

      {/* ───── PRODUCTS ───── */}
      <section className="section-bg bg-champagne border-y border-[rgb(201_150_20/.25)]">
        <div className="container-x py-14 sm:py-20">
          <Head eyebrow={heading.e} title={heading.t} sub={heading.s} />
          {featured.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">{featured.map((p) => <div key={p.slug} className="reveal"><ProductCard p={p} /></div>)}</div>
              <div className="mt-10 text-center"><Button href="/shop" variant="line" size="lg">View all candles</Button></div>
            </>
          ) : (
            <div className="card mx-auto max-w-xl p-8 text-center text-ink-soft">
              <p>Our full price list is on the way. Message us on WhatsApp to order today.</p>
              <Button variant="wa" className="mt-4" href={ownerWaLink(`Hi ${business.name}!`)} target="_blank"><WhatsAppIcon /> Chat on WhatsApp</Button>
            </div>
          )}
        </div>
      </section>

      {/* ───── STORY (stage) ───── */}
      <section className="stage on-stage">
        <div className="container-x grid items-center gap-10 py-16 sm:py-24 md:grid-cols-2">
          <div className="reveal">
            <p className="eyebrow eyebrow-gold">Our story</p>
            <h2 className="mt-3 text-3xl sm:text-5xl">Made in Kolathur, Chennai</h2>
            <p className="mt-5 max-w-md leading-relaxed text-on-stage-soft">
              Canflare is a small candle brand from Chennai. The name says it all – <i>let there be light</i>. We make jar, votive, pillar, advent and diya candles, scented or non-scented, and we welcome custom wedding and bulk gifting orders.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/about" variant="glass">Read our story</Button>
              <Button href={ownerWaLink(`Hi ${business.name}! I'd like to enquire about a bulk / custom order.`)} target="_blank" variant="gold"><WhatsAppIcon /> Bulk &amp; custom orders</Button>
            </div>
          </div>
          <div className="reveal relative mx-auto aspect-[16/10] w-full max-w-xl overflow-hidden rounded-2xl border border-line shadow-e3">
            <Image src={img("/products/hero-unlit.jpg")} alt="Canflare candle collection" fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          </div>
        </div>
      </section>

      {/* ───── TRUST (real facts only) ───── */}
      <div className="section-bg bg-corners"><section className="container-x py-14 sm:py-20">
        <Head eyebrow="Ordering made easy" title="From cart to doorstep" />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [<TruckIcon key="a" className="h-6 w-6" />, "Delivery across India", `Every pincode. FREE above ${inr(business.freeDeliveryThreshold)}, otherwise ${inr(business.deliveryCharge)}.`],
            [<WhatsAppIcon key="b" className="h-6 w-6" />, "Order online, pay after confirming", "Place your order in a few taps. We call or WhatsApp you to confirm it and share the payment details."],
            [<FlameIcon key="c" className="h-6 w-6" />, "Gifts, weddings, bulk", "Return-gift pillars and custom quantities – just message us."],
            [<TruckIcon key="d" className="h-6 w-6" />, "Track every order", "Courier and tracking number shared once shipped. Track anytime with your order ID."],
          ].map(([icon, t, d], i) => (
            <li key={i} className="reveal card p-5" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="grid h-11 w-11 place-items-center rounded-full bg-oat text-gold-deep">{icon}</span>
              <h3 className="mt-4 text-xl">{t as string}</h3>
              <p className="mt-1 text-sm text-ink-soft">{d as string}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-center text-sm text-taupe">
          <Link href="/shipping" className="underline">Shipping</Link> · <Link href="/refund" className="underline">Refund &amp; cancellation</Link> · <Link href="/privacy" className="underline">Privacy</Link> · <Link href="/faq" className="underline">FAQ</Link>
        </p>
      </section></div>
      {featured.length > 0 && <JsonLd data={itemListJsonLd("Canflare candles", featured)} />}
    </>
  );
}
