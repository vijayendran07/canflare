import PageShell from "@/components/PageShell";
import JsonLd from "@/components/JsonLd";
import { Accordion } from "@/components/ui/primitives";
import { faqs } from "@/data/faq";
import { faqJsonLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "FAQ – Orders, Delivery & Payment | Canflare", description: "Answers about ordering, payment, delivery across India, gift wrap, bulk orders and candle safety.", path: "/faq" });

export default function FAQ() {
  return (
    <PageShell title="Frequently asked questions" eyebrow="Help">
      <Accordion items={faqs.map((f) => ({ q: f.q, a: <p>{f.a}</p> }))} />
      <JsonLd data={faqJsonLd(faqs)} />
    </PageShell>
  );
}
