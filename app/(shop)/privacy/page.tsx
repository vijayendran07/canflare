import PageShell from "@/components/PageShell";
import { business } from "@/config/business";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Privacy Policy | Canflare", description: "What personal information Canflare collects when you order, and how it is used.", path: "/privacy" });

export default function Privacy() {
  return (
    <PageShell title="Privacy policy">
      <h2>What we collect</h2>
      <p>When you place an order we collect your name, mobile and WhatsApp number, delivery address and any note or gift message you enter.</p>
      <h2>How we use it</h2>
      <p>Only to process, confirm, pack, ship and track your order, and to contact you about it. We do not sell your information.</p>
      <h2>Where it is stored</h2>
      <p>Orders are stored in the business&apos;s private Google Sheet. Your cart is kept in your own browser. We do not take card or bank details on this website.</p>
      <h2>Sharing</h2>
      <p>Your name, address and phone number are shared with the courier delivering your order.</p>
      <h2>Your choices</h2>
      <p>To correct or delete your information, email {business.email} or message us on WhatsApp.</p>
    </PageShell>
  );
}
