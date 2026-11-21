import type { MetadataRoute } from "next";
import { business } from "@/config/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${business.name} Candles`,
    short_name: business.name,
    description: `${business.name} – scented jar, votive, pillar, advent and diya candles from Chennai.`,
    start_url: "/?source=pwa",
    scope: "/",
    display: "standalone",
    background_color: "#fffdf5",
    theme_color: "#fab507",
    orientation: "portrait",
    categories: ["shopping"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Shop", url: "/shop" },
      { name: "Track order", url: "/track" },
    ],
  };
}
