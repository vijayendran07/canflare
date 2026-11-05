import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Truck, Leaf, ShieldCheck, Mail, CheckCircle } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/product/CategoryCard';
import ReviewCard from '../components/reviews/ReviewCard';
import apiClient from '../services/apiClient';

export default function HomePage() {
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [bsRes, naRes] = await Promise.all([
          apiClient.get('/products/bestsellers'),
          apiClient.get('/products/new-arrivals'),
        ]);
        setBestSellers(bsRes.data || []);
        setNewArrivals(naRes.data || []);
      } catch (err) {
        console.warn('Using fallback data for storefront:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const categories = [
    {
      title: 'Scented Candles',
      name: 'Scented Candles',
      tag: 'Aromatics',
      description: 'Aromatherapy & mood enhancers for everyday mindful rituals.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDQbpLUncXKkG8Q_wL3CQhmyFmLfazapH_Laist2XLMIjl90Z4C3Q4GiA-zT1YxxxpJr2_VJoQ5ZjLwbloY8nWEFhfwwRlXuAfvjOFch8v4feqP4thzBvnruRKmGocY16RrrN5hsyohPmJ3f3_rlVRNasxxt4lRY-5oGlfpdLXYkg6rzv3dxub1pGnUm3Xj9JjWAw-uKk9gtka3uWMdkE_GADublnQSQ4H49d8pO8DM',
    },
    {
      title: 'Floral Candles',
      name: 'Floral Candles',
      tag: 'Botanicals',
      description: 'Pressed botanicals & fresh blooms harvested at peak fragrance.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCB_Cb4kvovK_t1f4PUPT0zgvw3Ra3ab5ehYCJl-EzhS_yJYfhgMCsblupl7WNvh97B2ivnVKagB8PJnPYBUELSmOtYQOVUmiOlKbC0CSdMllR-N0FZETZe2-we0r8mDfv84Owb0jEv0xyiOHqa9ZgrqCDGQjO3eizWY17Oct2szt0wu2YWrJiDOUWBVeBT9fo2WphqJ0MGXwGqtSwaIVpJo3OqEkMLqfpby-b2rRKH',
    },
    {
      title: 'Luxury Candles',
      name: 'Luxury Candles',
      tag: 'Atelier',
      description: 'Ribbed glass & ceramic vessels made for interior statements.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVV3k-nsh9NOnZYyoGm2IeS4OqBNz6TRI-0M5gLQKEak0nOIdtxit80urNg2BspFtK7xZkL1rrnu86v9Au9oV3XOYBoLNiYvfZhVvP4EOwYzh15inm46vW4zl31H9CqxR87F5sQHWLJ95K2tni7xKvRDxY19fLLWnHXOZosPFT1i9r3sYNnoV9hKKsjdFEiT39iiaRPnOQf4wUrypfuH9dUBycc9vr80QYO7Q25gc',
    },
    {
      title: 'Gift Sets',
      name: 'Gift Sets',
      tag: 'Gifting',
      description: 'Curated trios accompanied by matches & bespoke care kit.',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDkpwxrjHxU-iz3UtaTYgZmnDirLcf11My74_t0lNvOIidcaNZEB2-I7PdVd2cWeoM6UJhga1bTsDnrz2bFonCAJ_lSKaQcuXqibCcuT4IMpkRYmQvpIw-IGZsp1VfGdx6fDbyvwR2Hf97uFrnDuflnEzrbgDQ-16xEYneIle9waBOmnC92f-asqNHPobyT8PmwYbFsNf-zZShJKRQSJK7KExJtaH_qdIupC3RBPJXh',
    },
  ];

  const reviews = [
    {
      quote:
        'The Sandalwood luxury candle is transcendent. The crackling wooden wick fills our living room with calming golden warmth without being overpowering.',
      author: 'Ananya Kapoor',
      location: 'Bengaluru',
      productPurchased: 'Sandalwood Luxury Candle',
    },
    {
      quote:
        'Pure botanical perfection. You can immediately smell the difference between pure soy and synthetic paraffin. Canflare is our permanent home fragrance atelier.',
      author: 'Vikramaditya Mehta',
      location: 'New Delhi',
      productPurchased: 'Rose Bliss Candle',
    },
    {
      quote:
        'Packaged with exquisite care—wax-sealed unbleached boxes with custom calligraphy. The heirloom brass snuffer duo is a true work of art.',
      author: 'Meera Nambiar',
      location: 'Chennai',
      productPurchased: 'Atelier Heritage Gift Box',
    },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
  };

  return (
    <div className="w-full flex flex-col">
      {/* 1. HERO BANNER */}
      <section className="relative w-full overflow-hidden bg-[#1B1C1A] min-h-[580px] lg:min-h-[680px] flex items-center -mt-28 pt-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5iYeihJOIZzqiD8r8EiRd9z0XOog-MPKB-2B_5a3cdPhEwPyuo3ZSDrMvj-NnPVkjYVVuaGSMlT5E_9GKwqPn0j5pXObhAIapaXZiq1P3JDzAlOyVj0L6kMISB4eiQH2I9G0_XelBYLO2QWrG_CdXmTLn2bIi1QrnaIkwJS2p93Ycg8x9UCChWlY-DdmqfQqXPOZC-g6MxAggljilXcqA_sVKCTtkJBqvgfGcCQ3R"
            alt="Warm glowing amber glass candle on wooden table surrounded by botanicals"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B1C1A] via-[#1B1C1A]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B1C1A]/70 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAB507]/20 backdrop-blur-sm border border-[#FAB507]/30">
              <span className="w-2 h-2 rounded-full bg-[#FFDEA4] animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest text-[#FFDEA4] font-semibold">
                LIGHT UP YOUR MOMENTS
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight font-normal">
              Bring Warmth to Every Moment
            </h1>

            <p className="text-base sm:text-lg text-[#F2F0ED]/90 max-w-xl font-normal leading-relaxed">
              Discover beautifully crafted scented candles that transform your space into a sanctuary of calm. Formulated with 100% botanical wax and fine aromatics.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-3 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/collections"
                className="text-xs uppercase tracking-wider text-[#FFDEA4] hover:text-white transition-colors py-2 flex items-center gap-2 group font-semibold"
              >
                <span>Explore Collections</span>
                <span className="w-8 h-px bg-[#FFDEA4] transition-all group-hover:w-12 group-hover:bg-white" />
              </Link>
            </div>

            {/* 3 Pillars Statistics */}
            <div className="grid grid-cols-3 gap-6 pt-8 max-w-lg border-t border-white/10 mt-6">
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#FFDEA4] font-normal">100%</span>
                <span className="text-[10px] text-white/80 uppercase tracking-widest">Natural Soy</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#FFDEA4] font-normal">55+ Hrs</span>
                <span className="text-[10px] text-white/80 uppercase tracking-widest">Clean Burn</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl text-[#FFDEA4] font-normal">IFRA</span>
                <span className="text-[10px] text-white/80 uppercase tracking-widest">Certified Safe</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY */}
      <section className="w-full py-16 bg-[#FBF9F5]" id="categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
              Curated Sanctum
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] tracking-tight">
              Find Your Perfect Glow
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4731]">
              Candles for every mood, season, and contemplative moment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section className="w-full py-16 bg-[#F5F0E8]" id="bestsellers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
                Iconic Fragrances
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] tracking-tight">
                Our Best Sellers
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4731]">
                Customer favourites, meticulously blended to brighten your everyday.
              </p>
            </div>
            <div className="flex items-center gap-4 text-[#4A4731] text-xs">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#7B5800]" /> Free Delivery ₹1,499+
              </span>
              <span className="opacity-30">•</span>
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-[#7B5800]" /> 100% Soy Wax
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. PROMOTIONAL SPLIT LAYOUT (The Atelier Reserve) */}
      <section className="w-full py-16 bg-[#1B1C1A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Showcase Image */}
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden bg-black/40 border border-white/10">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlVV3k-nsh9NOnZYyoGm2IeS4OqBNz6TRI-0M5gLQKEak0nOIdtxit80urNg2BspFtK7xZkL1rrnu86v9Au9oV3XOYBoLNiYvfZhVvP4EOwYzh15inm46vW4zl31H9CqxR87F5sQHWLJ95K2tni7xKvRDxY19fLLWnHXOZosPFT1i9r3sYNnoV9hKKsjdFEiT39iiaRPnOQf4wUrypfuH9dUBycc9vr80QYO7Q25gc"
                alt="Smoked glass vessel candle glowing on stone plinth"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-md text-[#FFDEA4] text-[10px] uppercase tracking-widest px-3 py-1 rounded-sm border border-white/20">
                Atelier Reserve • Batch 04
              </span>
            </div>

            {/* Right Story & Purchase CTA */}
            <div className="space-y-6">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#FFDEA4] font-semibold">
                Numbered Micro-Batch
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight font-normal">
                Velvet Oud &amp; Smoked Sandalwood
              </h2>
              <p className="text-sm text-[#F2F0ED]/90 leading-relaxed font-light">
                Distilled from aged Mysore heartwood, dark amber resin, and wild cardamom pods. Poured in heavy smoked-glass flacons with hand-stamped wax seals. An intense, grounding sanctuary aroma crafted for slow contemplative hours.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                  <span className="text-[10px] text-[#FFDEA4] uppercase tracking-wider block">Top Notes</span>
                  <span className="text-xs text-white font-medium">Italian Bergamot, Cardamom</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                  <span className="text-[10px] text-[#FFDEA4] uppercase tracking-wider block">Heart Notes</span>
                  <span className="text-xs text-white font-medium">Mysore Sandalwood, Cedar</span>
                </div>
                <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                  <span className="text-[10px] text-[#FFDEA4] uppercase tracking-wider block">Base Notes</span>
                  <span className="text-xs text-white font-medium">Dark Amber, Tonka Bean</span>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Link
                  to="/shop?category=Luxury%20Candles"
                  className="inline-flex items-center gap-2 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-7 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Acquire Reserve Vessel • ₹849</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="w-full py-16 bg-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
                Seasonal Pouring
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] tracking-tight">
                New Seasonal Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4731]">
                Fresh harvest extractions and artisanal vessel accessories.
              </p>
            </div>
            <Link
              to="/shop"
              className="text-xs uppercase tracking-wider text-[#7B5800] hover:text-[#1B1C1A] font-semibold flex items-center gap-1 group"
            >
              <span>View All 16 Formulations</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. BRAND STORY / EDITORIAL */}
      <section className="w-full py-16 bg-[#F5F0E8] border-t border-[#EAE5DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] tracking-tight">
              Artisanal Craftsmanship &amp; Sacred Purity
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4731] leading-relaxed">
              Every candle is hand-poured deliberately in small batches in our Old Pondicherry atelier, adhering to time-honored perfumery traditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-sm bg-[#FFFFFF] border border-[#EAE5DE] text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#1B1C1A]">100% Botanical Soy Wax</h3>
              <p className="text-xs text-[#4A4731] leading-relaxed">
                Free of paraffin, synthetic dye, parabens, and phthalates. Clean, slow burn that releases pure aromatic essences with zero soot.
              </p>
            </div>

            <div className="p-8 rounded-sm bg-[#FFFFFF] border border-[#EAE5DE] text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#1B1C1A]">Mindful Slow Living</h3>
              <p className="text-xs text-[#4A4731] leading-relaxed">
                Engineered not just as fragrance, but as tactile daily ritual anchors that signal evening calm, introspection, and stillness.
              </p>
            </div>

            <div className="p-8 rounded-sm bg-[#FFFFFF] border border-[#EAE5DE] text-center space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#1B1C1A]">Master Perfumery</h3>
              <p className="text-xs text-[#4A4731] leading-relaxed">
                Complex, multi-layered olfactory pyramids formulated with cold-pressed natural oils that develop nuances as the wax pool deepens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section className="w-full py-16 bg-[#FBF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <span className="text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
              Words from Patrons
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] tracking-tight">
              Sanctuary Impressions
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4731]">
              Shared moments from homes illuminated by our botanical blends.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev, idx) => (
              <ReviewCard key={idx} review={rev} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER SECTION */}
      <section className="w-full py-16 bg-[#F5F0E8] border-t border-[#EAE5DE]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
            Connoisseurs Circle
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] tracking-tight">
            Join the Sanctuary
          </h2>
          <p className="text-xs sm:text-sm text-[#4A4731] max-w-md mx-auto leading-relaxed">
            Receive private allocations, seasonal harvest notices, and enjoy <b>10% off</b> your inaugural order with code <span className="font-mono text-[#7B5800] bg-white px-1.5 py-0.5 rounded">WELCOME10</span>.
          </p>

          {subscribed ? (
            <div className="p-4 rounded-sm bg-white border border-[#EAE5DE] text-xs text-emerald-800 flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Thank you for joining our circle. Check your inbox soon!</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
            >
              <div className="relative w-full">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  required
                  className="w-full bg-white border border-[#CCC7AA] rounded-sm py-3 pl-4 pr-10 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-1 focus:ring-[#FAB507]"
                />
                <Mail className="w-4 h-4 text-[#7B785F] absolute right-3 top-3.5 pointer-events-none" />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all shrink-0 cursor-pointer shadow-xs"
              >
                SUBSCRIBE
              </button>
            </form>
          )}

          <p className="text-[10px] uppercase tracking-widest text-[#7B785F]">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
}

