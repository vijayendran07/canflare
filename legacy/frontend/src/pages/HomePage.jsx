import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Truck,
  Leaf,
  ShieldCheck,
  Mail,
  CheckCircle,
  Search,
} from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/product/CategoryCard';
import ReviewCard from '../components/reviews/ReviewCard';
import apiClient from '../services/apiClient';

export default function HomePage() {
  const navigate = useNavigate();
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Flipkart-style Mobile Search & Filter Tabs
  const [mobileSearchInput, setMobileSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState('For You');

  const categoryTabs = [
    'For You',
    'Scented Candles',
    'Floral Candles',
    'Luxury Candles',
    'Gift Sets',
    'All Candles',
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [bsRes, naRes, allRes] = await Promise.all([
          apiClient.get('/products/bestsellers'),
          apiClient.get('/products/new-arrivals'),
          apiClient.get('/products'),
        ]);
        setBestSellers(bsRes.data || []);
        setNewArrivals(naRes.data || []);
        setAllProducts(allRes.data || []);
      } catch (err) {
        console.warn('Using fallback data for storefront:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(mobileSearchInput.trim())}`);
    }
  };

  const filteredTabProducts = useMemo(() => {
    if (activeTab === 'For You') return null;
    if (activeTab === 'All Candles') return allProducts;
    return allProducts.filter(
      (p) =>
        p.category?.toLowerCase() === activeTab.toLowerCase() ||
        p.fragranceFamily?.toLowerCase().includes(activeTab.toLowerCase().split(' ')[0])
    );
  }, [activeTab, allProducts]);

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


      {/* If a category tab is selected on mobile/desktop, show the filtered grid directly */}
      {activeTab !== 'For You' ? (
        <section className="w-full py-6 px-3 sm:px-6 lg:px-8 bg-[#FBF9F5]">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg sm:text-2xl text-[#1B1C1A] font-bold">
                {activeTab} ({filteredTabProducts?.length || 0})
              </h2>
              <button
                onClick={() => setActiveTab('For You')}
                className="text-xs text-[#2874F0] font-semibold hover:underline cursor-pointer"
              >
                Reset to All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {(filteredTabProducts || []).map((product) => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* 1. HERO BANNER (Clean spacing, zero overlap) */}
          <section className="relative w-full overflow-hidden bg-[#1B1C1A] min-h-[280px] sm:min-h-[460px] lg:min-h-[640px] flex items-center py-6 sm:py-16">
            <div className="absolute inset-0 z-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5iYeihJOIZzqiD8r8EiRd9z0XOog-MPKB-2B_5a3cdPhEwPyuo3ZSDrMvj-NnPVkjYVVuaGSMlT5E_9GKwqPn0j5pXObhAIapaXZiq1P3JDzAlOyVj0L6kMISB4eiQH2I9G0_XelBYLO2QWrG_CdXmTLn2bIi1QrnaIkwJS2p93Ycg8x9UCChWlY-DdmqfQqXPOZC-g6MxAggljilXcqA_sVKCTtkJBqvgfGcCQ3R"
                alt="Warm glowing amber glass candle on wooden table surrounded by botanicals"
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1B1C1A] via-[#1B1C1A]/85 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1B1C1A]/70 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
              <div className="max-w-2xl space-y-3 sm:space-y-4">


                <h1 className="font-serif text-2xl sm:text-4xl lg:text-6xl text-white tracking-tight leading-tight font-normal">
                  Bring Warmth to Every Moment
                </h1>

                <p className="text-xs sm:text-base text-[#F2F0ED]/90 max-w-xl font-normal leading-relaxed">
                  Discover beautifully crafted scented candles that transform your space into a sanctuary of calm. Formulated with 100% botanical wax and fine aromatics.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/shop"
                    className="group inline-flex items-center gap-2 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>SHOP NOW</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                </div>

                {/* 3 Pillars Statistics */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-8 max-w-lg border-t border-white/10 mt-3 sm:mt-6">
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-2xl text-[#FFDEA4] font-normal">100%</span>
                    <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest">Natural Soy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-2xl text-[#FFDEA4] font-normal">55+ Hrs</span>
                    <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest">Clean Burn</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-serif text-lg sm:text-2xl text-[#FFDEA4] font-normal">IFRA</span>
                    <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest">Certified Safe</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. BEST SELLERS (2-Column Grid on Mobile, Flipkart Card Style) */}
          <section className="w-full py-6 sm:py-14 bg-[#F5F0E8]" id="bestsellers">

            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-8 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
                    Iconic Fragrances
                  </span>
                  <h2 className="font-serif text-xl sm:text-3xl text-[#1B1C1A] tracking-tight">
                    Our Best Sellers
                  </h2>
                </div>

              </div>

              {/* 2 COLUMNS ON MOBILE, 4 ON DESKTOP */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {bestSellers.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* 3. SHOP BY CATEGORY */}
          <section className="w-full py-6 sm:py-14 bg-[#FBF9F5]" id="categories">
            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
              <div className="text-center max-w-xl mx-auto space-y-1 mb-6 sm:mb-10">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
                  Curated Sanctum
                </span>
                <h2 className="font-serif text-xl sm:text-3xl text-[#1B1C1A] tracking-tight">
                  Find Your Perfect Glow
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {categories.map((cat, idx) => (
                  <CategoryCard key={idx} category={cat} />
                ))}
              </div>
            </div>
          </section>




          {/* 5. NEW ARRIVALS (2-Column Grid on Mobile) */}
          <section className="w-full py-6 sm:py-14 bg-[#FBF9F5]">
            <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-8 gap-2">
                <div className="space-y-0.5">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-[#7B5800] font-semibold">
                    Seasonal Pouring
                  </span>
                  <h2 className="font-serif text-xl sm:text-3xl text-[#1B1C1A] tracking-tight">
                    New Seasonal Arrivals
                  </h2>
                </div>
                <Link
                  to="/shop"
                  className="text-xs uppercase tracking-wider text-[#7B5800] hover:text-[#1B1C1A] font-semibold flex items-center gap-1 group"
                >
                  <span>View All Candles</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* 2 COLUMNS ON MOBILE, 4 ON DESKTOP */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {newArrivals.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* 6. BRAND STORY / EDITORIAL */}
          <section className="w-full py-10 sm:py-16 bg-[#F5F0E8] border-t border-[#EAE5DE]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto space-y-2 mb-8 sm:mb-14">
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
                  The Atelier Philosophy
                </span>
                <h2 className="font-serif text-xl sm:text-3xl text-[#1B1C1A] tracking-tight">
                  Artisanal Craftsmanship &amp; Sacred Purity
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
                <div className="p-5 sm:p-8 rounded-lg bg-[#FFFFFF] border border-[#EAE5DE] text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-serif text-base sm:text-xl text-[#1B1C1A]">100% Botanical Soy Wax</h3>
                  <p className="text-xs text-[#4A4731] leading-relaxed">
                    Free of paraffin, synthetic dye, parabens, and phthalates. Clean, slow burn with zero soot.
                  </p>
                </div>

                <div className="p-5 sm:p-8 rounded-lg bg-[#FFFFFF] border border-[#EAE5DE] text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-serif text-base sm:text-xl text-[#1B1C1A]">Mindful Slow Living</h3>
                  <p className="text-xs text-[#4A4731] leading-relaxed">
                    Engineered as tactile daily ritual anchors that signal evening calm and stillness.
                  </p>
                </div>

                <div className="p-5 sm:p-8 rounded-lg bg-[#FFFFFF] border border-[#EAE5DE] text-center space-y-3 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h3 className="font-serif text-base sm:text-xl text-[#1B1C1A]">Master Perfumery</h3>
                  <p className="text-xs text-[#4A4731] leading-relaxed">
                    Complex olfactory pyramids formulated with natural cold-pressed essential oils.
                  </p>
                </div>
              </div>
            </div>
          </section>





        </>
      )}
    </div>
  );
}
