import PageShell from "@/components/PageShell";
import { business } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Refund & Cancellation Policy | Canflare", description: "How cancellations, damaged items and refunds work at Canflare.", path: "/refund" });

export default function Refund() {
  return (
    <PageShell title="Refund & cancellation">
      <h2>Cancellation</h2>
      <p>You can cancel an order before it is shipped by messaging us on WhatsApp ({business.phoneDisplay}) with your order ID.</p>
      <h2>Damaged or wrong item</h2>
      <p>If your order arrives damaged or you receive the wrong item, message us on WhatsApp within {business.returnWindowDays} days of delivery with your order ID and clear photos. We will arrange a replacement or refund.</p>
      <h2>Refunds</h2>
      <p>Approved refunds are returned to the original payment method.</p>
      <h2>Not covered</h2>
      <ul>
        <li>Candles that have been burned or used.</li>
        <li>Custom or personalised orders, unless damaged or wrong on arrival.</li>
      </ul>
    </PageShell>
  );
}
