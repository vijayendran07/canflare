import { pageMeta } from "@/lib/seo";
import CheckoutClient from "./CheckoutClient";

export const metadata = pageMeta({ title: "Checkout – Canflare", description: "Place your Canflare order – we confirm it and share payment details.", path: "/checkout", noindex: true });

export default function CheckoutPage() {
  return <CheckoutClient />;
}
