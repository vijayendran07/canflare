import { pageMeta } from "@/lib/seo";
import OrderClient from "./OrderClient";

export const metadata = pageMeta({ title: "Order placed – Canflare", description: "Your Canflare order summary.", path: "/order", noindex: true });

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderClient id={decodeURIComponent(id)} />;
}
