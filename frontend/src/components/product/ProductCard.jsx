import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlistItem } from '../../redux/slices/wishlistSlice';
import { showToast, openLoginModal } from '../../redux/slices/uiSlice';
import { formatCurrency } from '../../utils/formatters';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      dispatch(openLoginModal('/cart'));
      dispatch(
        showToast({
          message: 'Please sign in to purchase or add items to your cart.',
          type: 'info',
        })
      );
      return;
    }

    setIsAdding(true);
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.url || product.image,
        vesselSize: product.vesselType,
        quantity: 1,
      })
    );

    dispatch(
      showToast({
        message: `${product.title} added to your cart!`,
        type: 'success',
      })
    );

    setTimeout(() => {
      setIsAdding(false);
    }, 800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.images?.[0]?.url || product.image,
      })
    );

    dispatch(
      showToast({
        message: isWishlisted
          ? `${product.title} removed from wishlist.`
          : `${product.title} saved to wishlist!`,
        type: 'info',
      })
    );
  };

  const primaryImage =
    product.images?.[0]?.url ||
    product.image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBBN4_KWkrKuLMXWb2_6ek6NFL4m0kCch-QKKtQVJvptbjwTIpnb6YEHFnKsPiShmYVaJbqCoYe2VHotngqdczAUs0Nu_rVkpG0HRg21i07vpk6Np6MhcQ_pl6L9X-Qb41j8CoLxioRVo2e7yBEafyhTjKUmDFq6m462W1sfwWQ4fnZgXIj8IzZTG3y2G4xnpzM_Kw0-9vgVlq28zw5KWcGT9L8U3aMLzclXvSMaEHm';

  const badgeText = product.badge && product.badge !== 'None' ? product.badge : 'Value 365';
  const originalPrice = product.originalPrice || Math.round(product.price * 1.35);
  const couponDiscount = Math.max(25, Math.round(product.price * 0.08));

  return (
    <article className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 sm:border-[#EAE5DE] shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 flex flex-col justify-between p-2 sm:p-3">
      {/* 1. Image Container with Flipkart style badges & rating */}
      <div className="relative w-full aspect-square bg-[#F6F6F6] rounded-lg sm:rounded-xl overflow-hidden">
        <Link to={`/product/${product.slug || product.id}`} className="block w-full h-full">
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Top-Left Magenta / Brand Badge (e.g. Value 365) */}
        {badgeText && (
          <span className="absolute top-2 left-2 bg-[#D81B60] text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide shadow-xs">
            {badgeText}
          </span>
        )}

        {/* Top-Right Heart Wishlist Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 shadow-xs cursor-pointer"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
              isWishlisted
                ? 'fill-[#BA1A1A] text-[#BA1A1A]'
                : 'text-gray-500 hover:text-[#BA1A1A]'
            }`}
          />
        </button>

        {/* Bottom-Left Rating Pill (e.g. 4.2 ★ (15,822)) */}
        <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-xs border border-gray-200/90 px-1.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold text-[#1B1C1A] flex items-center gap-1 shadow-xs">
          <span>{product.rating || '4.2'}</span>
          <Star className="w-2.5 h-2.5 fill-[#138808] text-[#138808]" />
          <span className="text-gray-500 font-normal text-[9px] sm:text-[10px]">
            ({product.numReviews || '120'})
          </span>
        </div>
      </div>

      {/* 2. Product Details */}
      <div className="flex flex-col flex-1 justify-between pt-2">
        <div>
          {/* Brand & Title row */}
          <Link to={`/product/${product.slug || product.id}`} className="block">
            <h3 className="text-xs sm:text-sm text-[#1B1C1A] leading-snug line-clamp-1">
              <span className="font-bold uppercase tracking-wide mr-1 text-[#1B1C1A]">
                {product.brand || 'CANFLARE'}
              </span>
              <span className="font-normal text-gray-700">{product.title}</span>
            </h3>
          </Link>

          {/* Price Row: Strikethrough MRP + Magenta Discount Pill */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-gray-400 line-through font-normal">
              {formatCurrency(originalPrice)}
            </span>
            <span className="bg-[#D81B60] text-white font-bold text-xs px-2 py-0.5 rounded-sm">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>

        {/* 3. Action Button: Compact Add to Cart */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
          className="mt-2.5 w-full py-1.5 sm:py-2 px-2 bg-[#FAB507] hover:bg-[#e0a205] active:scale-[0.98] text-[#1B1C1A] font-bold text-[10px] sm:text-xs uppercase tracking-wider rounded-md flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isAdding ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#1B1C1A]" />
              <span>ADDED</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5 text-[#1B1C1A]" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}
