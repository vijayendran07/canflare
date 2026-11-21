import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  Gift,
} from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { removeWishlistItem, clearWishlist } from '../redux/slices/wishlistSlice';
import { showToast, openLoginModal } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const handleMoveToCart = (item) => {
    if (!isAuthenticated) {
      dispatch(openLoginModal('/cart'));
      dispatch(showToast({ message: 'Please sign in to add items to your basket.', type: 'info' }));
      return;
    }
    dispatch(
      addToCart({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image,
        quantity: 1,
      })
    );
    dispatch(removeWishlistItem(item.id));
    dispatch(showToast({ message: `${item.title} moved to your sensory basket!`, type: 'success' }));
  };

  const handleMoveAllToCart = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal('/cart'));
      dispatch(showToast({ message: 'Please sign in to add items to your basket.', type: 'info' }));
      return;
    }
    wishlistItems.forEach((item) => {
      dispatch(
        addToCart({
          id: item.id,
          title: item.title,
          price: item.price,
          image: item.image,
          quantity: 1,
        })
      );
    });
    dispatch(clearWishlist());
    dispatch(showToast({ message: 'All saved reserves moved to your basket!', type: 'success' }));
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A]">No Saved Reserves Yet</h1>
        <p className="text-xs sm:text-sm text-[#4A4731] max-w-md mx-auto">
          Tap the heart icon on any candle formulation to curate your personal olfactory sanctuary wishlist.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-7 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <span>Discover Sanctuary Blends</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[#FBF9F5] pb-20">
      {/* 1. HERO HEADER */}
      <section className="w-full bg-[#F5F0E8]/70 py-10 px-4 sm:px-6 lg:px-8 border-b border-[#EAE5DE]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
              Curated Private Archives
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] leading-tight font-normal">
              Your Saved Reserves
            </h1>
            <p className="text-xs text-[#4A4731]">
              {wishlistItems.length} Fragrance{wishlistItems.length > 1 ? 's' : ''} saved for future meditative rituals.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleMoveAllToCart}
              className="bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Move All to Basket</span>
            </button>
            <button
              type="button"
              onClick={() => dispatch(clearWishlist())}
              className="bg-white border border-[#EAE5DE] text-[#4A4731] hover:text-[#BA1A1A] px-4 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>
      </section>

      {/* 2. WISHLIST ITEMS GRID */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-sm border border-[#EAE5DE] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] bg-[#F5F0E8] overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => dispatch(removeWishlistItem(item.id))}
                  aria-label="Remove item"
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#4A4731] hover:text-[#BA1A1A] transition-colors shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-serif text-lg text-[#1B1C1A] leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#7B5800] font-medium">
                    {formatCurrency(item.price)}
                  </p>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs inline-block">
                    In Stock • Ready to pour
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleMoveToCart(item)}
                  className="w-full py-2.5 px-4 rounded-sm bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>MOVE TO BASKET</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. ATELIER GUARANTEES */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-[#EAE5DE]">
          <div className="p-6 bg-white rounded-sm border border-[#EAE5DE] flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-[#7B5800] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
                Pure Botanical Wax Guarantee
              </h4>
              <p className="text-xs text-[#4A4731] mt-1">
                Zero paraffin, 100% natural soy and plant waxes with lead-free wicks.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-sm border border-[#EAE5DE] flex items-start gap-4">
            <Truck className="w-6 h-6 text-[#7B5800] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
                Break-Free Express Transit
              </h4>
              <p className="text-xs text-[#4A4731] mt-1">
                Triple-corrugated cushioned craft boxes. Instant complimentary replacement if damaged.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-sm border border-[#EAE5DE] flex items-start gap-4">
            <Gift className="w-6 h-6 text-[#7B5800] shrink-0" />
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
                Custom Gifting Inscription
              </h4>
              <p className="text-xs text-[#4A4731] mt-1">
                Every vessel arrives packaged with plant-dyed ribbon and optional handwritten calligraphy note.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
