import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { LayoutGrid, Grid3X3, Sparkles, SlidersHorizontal, Leaf } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import FilterSidebar from '../components/product/FilterSidebar';
import apiClient from '../services/apiClient';

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategoryPill, setSelectedCategoryPill] = useState(
    searchParams.get('category') || 'All Aromatics'
  );
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceTier, setPriceTier] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [gridCols, setGridCols] = useState(3); // 3 or 4 columns on desktop
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync category from URL if changed
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategoryPill(cat);
    }
  }, [searchParams]);

  // Fetch products from API
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/products');
        setProducts(res.data || []);
      } catch (err) {
        console.warn('API error, using cached formulations:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []);

  const categoryPills = [
    'All Aromatics',
    'Woody & Earthy',
    'Floral & Botanical',
    'Fresh & Citrus',
    'Warm Vanilla',
    'Limited Atelier Editions',
  ];

  const handlePillSelect = (pill) => {
    setSelectedCategoryPill(pill);
    if (pill === 'All Aromatics') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', pill);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategoryPill('All Aromatics');
    setSelectedFamily(null);
    setSelectedIntensity(null);
    setInStockOnly(false);
    setPriceTier(null);
    setSortBy('featured');
    searchParams.delete('category');
    setSearchParams(searchParams);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Pill Filter
        if (selectedCategoryPill && selectedCategoryPill !== 'All Aromatics') {
          if (selectedCategoryPill === 'Woody & Earthy') {
            if (product.fragranceFamily !== 'Woody & Resinous') return false;
          } else if (selectedCategoryPill === 'Floral & Botanical') {
            if (product.fragranceFamily !== 'Floral & Botanical') return false;
          } else if (selectedCategoryPill === 'Fresh & Citrus') {
            if (product.fragranceFamily !== 'Fresh & Herbaceous') return false;
          } else if (selectedCategoryPill === 'Warm Vanilla') {
            if (product.fragranceFamily !== 'Gourmand & Sweet') return false;
          } else if (selectedCategoryPill === 'Limited Atelier Editions') {
            if (product.badge !== 'Limited Harvest' && !product.isNewArrival) return false;
          } else if (
            product.category?.toLowerCase() !== selectedCategoryPill.toLowerCase() &&
            product.fragranceFamily?.toLowerCase() !== selectedCategoryPill.toLowerCase()
          ) {
            return false;
          }
        }

        // Fragrance Family Checkbox
        if (selectedFamily && product.fragranceFamily !== selectedFamily) {
          return false;
        }

        // Intensity Radio
        if (selectedIntensity && product.olfactoryIntensity !== selectedIntensity) {
          return false;
        }

        // In Stock Only Toggle
        if (inStockOnly && !product.inStock) {
          return false;
        }

        // Price Tier
        if (priceTier) {
          if (product.price < priceTier.min || product.price > priceTier.max) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'best-rated') return (b.rating || 0) - (a.rating || 0);
        if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
      });
  }, [
    products,
    selectedCategoryPill,
    selectedFamily,
    selectedIntensity,
    inStockOnly,
    priceTier,
    sortBy,
  ]);

  const activeFilterCount =
    (selectedCategoryPill !== 'All Aromatics' ? 1 : 0) +
    (selectedFamily ? 1 : 0) +
    (selectedIntensity ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceTier ? 1 : 0);

  return (
    <div className="w-full flex flex-col bg-[#FBF9F5]">
      {/* 1. EDITORIAL BREADCRUMB & CATALOG HEADER */}
      <section className="w-full bg-[#F5F0E8]/70 py-10 px-4 sm:px-6 lg:px-8 border-b border-[#EAE5DE]">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#4A4731] font-medium">
            <Link to="/" className="hover:text-[#1B1C1A] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#1B1C1A] font-semibold">Shop / All Candles</span>
          </nav>

          {/* Editorial Title & Manifesto */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.25em] uppercase text-[#7B5800]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7B5800]" />
                Olfactory Catalogue • Series IV
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1B1C1A] leading-tight font-normal">
                All Handcrafted Candles
              </h1>
              <p className="text-xs sm:text-sm text-[#4A4731] leading-relaxed font-light">
                Poured with 100% botanical soy wax and artisanal botanical extracts in small batches. Slow-burning sanctuaries poured deliberately by master perfumers in Old Pondicherry.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#4A4731] bg-[#FFFFFF] px-4 py-2.5 rounded-sm border border-[#EAE5DE] shadow-xs">
              <Leaf className="w-4 h-4 text-[#7B5800]" />
              <span>100% Vegan &amp; Non-Toxic Botanicals</span>
            </div>
          </div>

          {/* Quick Category Filter Pills (Horizontal Scroll) */}
          <div className="pt-2 flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth">
            {categoryPills.map((pill) => {
              const isActive = selectedCategoryPill === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => handlePillSelect(pill)}
                  className={`shrink-0 px-4 py-2 rounded-sm text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FAB507] text-[#1B1C1A] font-semibold shadow-xs'
                      : 'bg-[#FFFFFF] text-[#4A4731] hover:text-[#1B1C1A] hover:bg-[#EFEEEA] border border-[#EAE5DE] font-medium'
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. MAIN CATALOG BODY (2-Column Responsive Layout) */}
      <section className="w-full py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
          {/* Mobile Filter Toggle Button */}
          <div className="lg:hidden w-full flex items-center justify-between pb-4 border-b border-[#EAE5DE]">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFFFFF] border border-[#EAE5DE] text-xs font-semibold uppercase tracking-wider text-[#1B1C1A] rounded-sm"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#7B5800]" />
              <span>{isMobileFilterOpen ? 'Hide Filters' : 'Refine Scent Filters'}</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#FAB507] text-[#1B1C1A] text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-xs text-[#7B785F]">
              {filteredProducts.length} Blends
            </span>
          </div>

          {/* Left Filter Sidebar */}
          <div className={`${isMobileFilterOpen ? 'block' : 'hidden'} lg:block w-full lg:w-72 shrink-0`}>
            <FilterSidebar
              selectedFamily={selectedFamily}
              onSelectFamily={setSelectedFamily}
              selectedIntensity={selectedIntensity}
              onSelectIntensity={setSelectedIntensity}
              inStockOnly={inStockOnly}
              onToggleInStock={() => setInStockOnly(!inStockOnly)}
              priceTier={priceTier}
              onSelectPriceTier={setPriceTier}
              onResetFilters={handleResetFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Right Catalog Content Area */}
          <main className="flex-1 w-full flex flex-col gap-6">
            {/* Catalog Toolbar */}
            <div className="bg-[#FFFFFF] px-5 py-3.5 rounded-sm border border-[#EAE5DE] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#1B1C1A] font-semibold">
                  Showing {filteredProducts.length} of {products.length}
                </span>
                <span className="text-xs text-[#4A4731] font-light hidden sm:inline">
                  handcrafted botanical candles
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label htmlFor="catalogSort" className="text-xs uppercase tracking-wider text-[#7B785F] hidden sm:inline">
                    Sort by:
                  </label>
                  <select
                    id="catalogSort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs bg-[#F5F0E8] text-[#1B1C1A] px-3 py-2 rounded-sm border border-[#EAE5DE] focus:outline-none focus:ring-1 focus:ring-[#FAB507] cursor-pointer font-medium"
                  >
                    <option value="featured">Featured Blend</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="best-rated">Highest Customer Rating</option>
                    <option value="newest">Newest Atelier Batches</option>
                  </select>
                </div>

                {/* Grid Layout Toggle Buttons */}
                <div className="hidden md:flex items-center bg-[#F5F0E8] p-1 rounded-sm border border-[#EAE5DE]">
                  <button
                    type="button"
                    onClick={() => setGridCols(3)}
                    aria-label="3 Columns View"
                    className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                      gridCols === 3
                        ? 'bg-[#FFFFFF] text-[#1B1C1A] shadow-xs font-bold'
                        : 'text-[#7B785F] hover:text-[#1B1C1A]'
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setGridCols(4)}
                    aria-label="4 Columns View"
                    className={`p-1.5 rounded-sm transition-all cursor-pointer ${
                      gridCols === 4
                        ? 'bg-[#FFFFFF] text-[#1B1C1A] shadow-xs font-bold'
                        : 'text-[#7B785F] hover:text-[#1B1C1A]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="p-12 text-center bg-[#FFFFFF] border border-[#EAE5DE] rounded-sm space-y-4">
                <Sparkles className="w-8 h-8 text-[#FAB507] mx-auto" />
                <h3 className="font-serif text-2xl text-[#1B1C1A]">
                  No formulations matched your filters
                </h3>
                <p className="text-xs text-[#4A4731] max-w-md mx-auto">
                  Try clearing some filter criteria or selecting a different fragrance family to view our available candle batches.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 bg-[#FAB507] text-[#1B1C1A] px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 ${
                  gridCols === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
                } gap-6 transition-all`}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </section>
    </div>
  );
}

