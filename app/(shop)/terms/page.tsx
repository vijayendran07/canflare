import PageShell from "@/components/PageShell";
import { business } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Terms & Conditions | Canflare", description: "Terms for ordering from Canflare: orders, pricing, payment and safe use of candles.", path: "/terms" });

export default function Terms() {
  return (
    <PageShell title="Terms & conditions">
      <h2>Orders</h2>
      <p>An order is confirmed once we confirm it with you by phone or WhatsApp. We may decline or cancel an order if an item is unavailable.</p>
      <h2>Prices &amp; payment</h2>
      <p>All prices are in Indian rupees (₹). Payment details are shared with you after your order is confirmed. No payment is taken on this website.</p>
      <h2>Safe use</h2>
      <p>Candles must be burned following the care and safety instructions on each product page. Never leave a burning candle unattended.</p>
      <h2>Product photos</h2>
      <p>Handmade items can vary slightly in colour and finish from photos.</p>
      <h2>Contact</h2>
      <p>{business.legalName}, {business.address.line1}, {business.address.area}, {business.address.city} {business.address.pincode}. {business.email}.</p>
    </PageShell>
  );
}
