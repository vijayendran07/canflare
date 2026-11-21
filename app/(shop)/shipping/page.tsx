import PageShell from "@/components/PageShell";
import { business } from "@/config/business";
import { inr } from "@/lib/money";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Shipping & Delivery Policy | Canflare", description: "Canflare ships across India. Delivery charges, free-delivery threshold, dispatch and delivery times.", path: "/shipping" });

export default function Shipping() {
  return (
    <PageShell title="Shipping & delivery">
      <h2>Where we deliver</h2>
      <p>We deliver to every pincode in India.</p>
      <h2>Delivery charges</h2>
      <ul>
        <li>Orders of {inr(business.freeDeliveryThreshold)} or more: <b>FREE delivery</b>.</li>
        <li>Orders below {inr(business.freeDeliveryThreshold)}: {inr(business.deliveryCharge)} delivery charge.</li>
      </ul>
      <h2>Dispatch &amp; delivery time</h2>
      <p>Orders are packed and dispatched within {business.dispatchDays} working days of payment confirmation. Delivery usually takes {business.deliveryDays} days after dispatch, depending on your location.</p>
      <h2>Tracking</h2>
      <p>We share the courier name and tracking number on your order once it ships. You can also use the Track order page.</p>
      <h2>Questions</h2>
      <p>WhatsApp or call us on {business.phoneDisplay}.</p>
    </PageShell>
  );
}
