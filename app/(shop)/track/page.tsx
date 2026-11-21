import { pageMeta } from "@/lib/seo";
import TrackClient from "./TrackClient";

export const metadata = pageMeta({
  title: "Track Your Order – Canflare",
  description: "Track your Canflare order with your order ID and mobile number: confirmed, packed, shipped, delivered.",
  path: "/track",
});

export default function TrackPage() {
  return <TrackClient />;
}
