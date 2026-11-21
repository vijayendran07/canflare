import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { business, siteUrl } from "@/config/business";

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: `${business.name} Candles – Scented Jar, Votive & Pillar Candles`, template: `%s | ${business.name}` },
  description: `Shop scented jar candles, votive candles, pillar, advent and diya candles from ${business.name}, Chennai. Order online, delivery across India.`,
  applicationName: business.name,
  openGraph: { siteName: business.name, locale: "en_IN", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#fab507" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-scroll-behavior="smooth" className={`${playfair.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <head>
        {/* decides – before first paint – whether the home intro plays (see components/intro/Intro.tsx) */}
        <script dangerouslySetInnerHTML={{ __html: "(function(){try{var d=document.documentElement;if([\"checkout\",\"order\",\"admin\",\"design-system\",\"offline\"].indexOf(location.pathname.split(\"/\")[1])>-1)return;if(matchMedia(\"(prefers-reduced-motion: reduce)\").matches)return;var n=navigator,c=n.connection||{},ua=n.userAgent||\"\";var ios=/iPad|iPhone|iPod/.test(ua)||(n.platform===\"MacIntel\"&&n.maxTouchPoints>1);var android=/Android/i.test(ua);var weak=!ios&&(c.saveData||/(^|-)2g/.test(c.effectiveType||\"\")||(android&&((n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4))));d.setAttribute(\"data-intro\",weak?\"lite\":\"full\")}catch(e){}})();" }} />
      </head>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
