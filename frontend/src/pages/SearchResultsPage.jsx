import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import apiClient from '../services/apiClient';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Amber & Sandalwood';

  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/products');
        const all = res.data || res.products || [];
        setProducts(all);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const quickTags = ['Soy Wax', 'Wood Wick', 'Sandalwood', 'Vanilla Dreams', 'Rose Bliss'];

  const filtered = products.filter((p) => {
    const qLower = query.toLowerCase();
    const matchesQuery =
      !query ||
      p.title?.toLowerCase().includes(qLower) ||
      p.subtitle?.toLowerCase().includes(qLower) ||
      p.fragranceFamily?.toLowerCase().includes(qLower) ||
      p.description?.toLowerCase().includes(qLower);

    const matchesTag =
      selectedTag === 'All' ||
      p.title?.toLowerCase().includes(selectedTag.toLowerCase()) ||
      p.description?.toLowerCase().includes(selectedTag.toLowerCase());

    return matchesQuery && matchesTag;
  });

  return (
    <div className="w-full bg-[#FBF9F5] text-[#1B1C1A] min-h-screen pb-16">
      {/* Header Search Section */}
      <section className="w-full bg-[#F5F3EF] px-4 sm:px-6 lg:px-8 py-10 border-b border-[#EAE8E4]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#7B785F] mb-3">
            <Link to="/shop" className="hover:text-[#1B1C1A]">Atelier Catalog</Link>
            <span>/</span>
            <span className="text-[#1B1C1A] font-semibold">Olfactory Search</span>
          </div>

          <form onSubmit={handleSearchSubmit} className="w-full relative shadow-sm rounded-xl overflow-hidden bg-white border border-[#EAE8E4]">
            <div className="flex items-center px-4 py-3">
              <Search className="w-5 h-5 text-[#FAB507] mr-3 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search scents, notes, vessel styles (e.g. Amber, Sandalwood, Soy)..."
                className="w-full bg-transparent text-sm text-[#1B1C1A] outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-[#7B785F] hover:text-[#1B1C1A]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Quick tags */}
          <div className="flex items-center flex-wrap justify-center gap-2 mt-4 text-xs">
            <span className="text-[#7B785F] font-medium text-[11px] uppercase tracking-wider">Quick Inquiries:</span>
            {quickTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setSelectedTag(tag);
                  setQuery(tag);
                  setSearchParams({ q: tag });
                }}
                className={`px-3 py-1 rounded-full text-xs transition-all border ${
                  selectedTag === tag
                    ? 'bg-[#FAB507] text-[#1B1C1A] border-[#FAB507] font-semibold'
                    : 'bg-white text-[#4A4731] border-[#EAE8E4] hover:bg-[#F5F3EF]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-6">
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1B1C1A]">
              Search results for <span className="italic text-[#7B5800]">"{query || 'All Candles'}"</span>
            </h1>
            <p className="text-xs uppercase tracking-[0.2em] text-[#7B785F] mt-1">
              {filtered.length} Handcrafted Creations Discovered across botanical archives
            </p>
          </div>
        </div>
      </section>

      {/* Results Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="text-center py-20 text-xs text-[#7B785F]">Consulting Atelier Archives...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 space-y-3">
            <p className="font-serif text-xl text-[#1B1C1A]">No botanical resonance found</p>
            <p className="text-xs text-[#7B785F]">Try searching for "Rose", "Sandalwood", or "Vanilla"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

