import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { addToCart } from '../../redux/slices/cartSlice';
import { toggleWishlistItem } from '../../redux/slices/wishlistSlice';
import { showToast } from '../../redux/slices/uiSlice';
import { formatCurrency } from '../../utils/formatters';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [isAdding, setIsAdding] = useState(false);

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

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
        message: `${product.title} added to your sensory basket!`,
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
          ? `${product.title} removed from saved reserves.`
          : `${product.title} saved to your reserves!`,
        type: 'info',
      })
    );
  };

  const primaryImage =
    product.images?.[0]?.url ||
    product.image ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBBN4_KWkrKuLMXWb2_6ek6NFL4m0kCch-QKKtQVJvptbjwTIpnb6YEHFnKsPiShmYVaJbqCoYe2VHotngqdczAUs0Nu_rVkpG0HRg21i07vpk6Np6MhcQ_pl6L9X-Qb41j8CoLxioRVo2e7yBEafyhTjKUmDFq6m462W1sfwWQ4fnZgXIj8IzZTG3y2G4xnpzM_Kw0-9vgVlq28zw5KWcGT9L8U3aMLzclXvSMaEHm';

  return (
    <article className="group bg-[#FFFFFF] rounded-sm overflow-hidden border border-[#EAE5DE] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* 1. Image Container (4:5 Aspect Ratio) */}
      <div className="relative w-full aspect-[4/5] bg-[#F5F0E8] overflow-hidden">
        <Link to={`/product/${product.slug || product.id}`}>
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Floating Category/Status Badge */}
        {product.badge && product.badge !== 'None' && (
          <span className="absolute top-3 left-3 bg-[#FBF9F5]/90 backdrop-blur-sm text-[#1B1C1A] text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-xs border border-[#EAE5DE]/80">
            {product.badge}
          </span>
        )}

        {/* Interactive Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleToggleWishlist}
          aria-label="Add to Wishlist"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FBF9F5]/90 backdrop-blur-sm flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-110 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted
                ? 'fill-[#BA1A1A] text-[#BA1A1A]'
                : 'text-[#4A4731] hover:text-[#BA1A1A]'
            }`}
          />
        </button>

        {/* Discount Tag */}
        {product.discountPercentage > 0 && (
          <span className="absolute bottom-3 left-3 bg-[#FAB507] text-[#1B1C1A] text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* 2. Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div className="space-y-1.5">
          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 text-xs text-[#1B1C1A]">
            <div className="flex text-[#FAB507]">
              <Star className="w-3.5 h-3.5 fill-[#FAB507]" />
            </div>
            <span className="font-semibold text-xs">{product.rating || 4.9}</span>
            <span className="text-[#4A4731] text-[11px] font-normal">
              ({product.numReviews || 120} reviews)
            </span>
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug || product.id}`}>
            <h3 className="font-serif text-lg text-[#1B1C1A] leading-snug group-hover:text-[#7B5800] transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Fragrance Notes / Subtitle */}
          <p className="text-xs text-[#4A4731] line-clamp-1">
            {product.subtitle || 'Damask Rose & Warm Amber'}
          </p>

          {/* Price & Burn Duration */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-base font-semibold text-[#1B1C1A]">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-[#7B785F] line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
            {product.burnTime && (
              <span className="text-[10px] uppercase tracking-wider text-[#7B5800] font-medium ml-auto">
                {product.burnTime}
              </span>
            )}
          </div>
        </div>

        {/* 3. Action CTA Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdding || !product.inStock}
          className="w-full py-2.5 px-4 rounded-sm bg-[#FAB507] hover:bg-[#e0a205] active:scale-[0.99] text-[#1B1C1A] font-semibold text-xs tracking-wider uppercase transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isAdding ? (
            <>
              <Check className="w-4 h-4 text-[#1B1C1A]" />
              <span>ADDED TO BASKET</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-[#1B1C1A]" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
}

