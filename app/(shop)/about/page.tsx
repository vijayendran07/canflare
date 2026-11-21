import Image from "next/image";
import Link from "next/link";
import PageShell from "@/components/PageShell";
import { business } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "About Canflare – Candles from Chennai", description: "Canflare makes candles in Kolathur, Chennai – jar, votive, pillar, advent and diya candles. Let there be light.", path: "/about" });

export default function About() {
  return (
    <PageShell title="Our story" eyebrow="About Canflare" intro="Let there be light.">
      <div className="rounded-2xl bg-white p-6 flex justify-center border-2 border-gold/60 not-prose">
        <Image src="/logo-light.png" alt="Canflare – Let there be Light" width={420} height={147} className="w-full max-w-sm h-auto" />
      </div>
      <p className="mt-6">Canflare is a candle brand based in Kolathur, Chennai. Our tagline says it all – <i>{business.tagline}</i>.</p>
      <p>We make scented jar candles, votive candles, pillar candles, advent candles, diya candles and return-gift pillars, and we take custom and bulk orders for festivals, weddings and events.</p>
      <h2>Order with us</h2>
      <p>Ordering is simple: pick your candles and place your order – we call or WhatsApp you to confirm it and share the payment details. We pack it with care and ship it anywhere in India.</p>
      <p><Link href="/shop" className="btn btn-gold no-underline">Shop candles</Link> &nbsp; <Link href="/contact" className="underline">Contact us</Link></p>
    </PageShell>
  );
}
