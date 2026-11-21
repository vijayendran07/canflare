import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import StickyBars from "@/components/StickyBars";
import BottomNav from "@/components/BottomNav";
import OrderRetry from "@/components/OrderRetry";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import OfflineBanner from "@/components/OfflineBanner";
import PwaRegister from "@/components/PwaRegister";
import LazySearch from "@/components/LazySearch";
import Intro from "@/components/intro/Intro";
import { ToastProvider } from "@/components/ui/overlays";
import { BackToTop } from "@/components/ui/LoadMore";
import { orgJsonLd } from "@/lib/seo";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-sun flex min-h-screen flex-1 flex-col">
    <ToastProvider>
      <Intro />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[300] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-gold">Skip to content</a>
      <Header />
      <OfflineBanner />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <LazySearch />
      <BottomNav />
      <StickyBars concierge={!!process.env.CONCIERGE_API_KEY} />
      <BackToTop />
      <OrderRetry />
      <Analytics />
      <PwaRegister />
      <JsonLd data={orgJsonLd()} />
    </ToastProvider>
    </div>
  );
}
