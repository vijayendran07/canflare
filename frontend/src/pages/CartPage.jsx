import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Trash2,
  Heart,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Package,
} from 'lucide-react';
import {
  removeFromCart,
  updateQuantity,
} from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { showToast, openLoginModal } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const {
    items,
    totalQuantity,
    subtotal,
  } = useSelector((state) => state.cart);

  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A]">Your Basket is Empty</h1>
        <p className="text-xs sm:text-sm text-[#4A4731] max-w-md mx-auto">
          You haven't selected any candles yet.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] px-7 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all shadow-md cursor-pointer"
        >
          <span>Explore All Candles</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-[#FBF9F5] pb-20 pt-6">
      {/* MAIN SPLIT CANVAS (7/12 + 5/12 Desktop) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT COLUMN: BASKET ITEMS (7/12) */}
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="flex items-baseline justify-between border-b border-[#EAE5DE] pb-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#7B5800]">
                  Your Selection
                </span>
                <h1 className="font-serif text-2xl sm:text-3xl text-[#1B1C1A] mt-0.5 font-normal">
                  Shopping Basket
                </h1>
              </div>
              <span className="text-xs text-[#7B785F] uppercase tracking-wider">
                {totalQuantity} Item{totalQuantity > 1 ? 's' : ''}
              </span>
            </div>

            {/* Items Stack */}
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-sm p-4 sm:p-5 border border-[#EAE5DE] shadow-xs flex flex-col sm:flex-row gap-4 sm:gap-5"
                >
                  <div className="w-full sm:w-28 h-32 rounded-sm overflow-hidden shrink-0 bg-[#F5F0E8] border border-[#EAE5DE]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7B5800]">
                            Handcrafted Candle
                          </span>
                          <h3 className="font-serif text-base sm:text-lg text-[#1B1C1A] leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base text-[#1B1C1A]">
                            {formatCurrency(item.price * item.quantity)}
                          </p>
                          <span className="text-[10px] text-[#7B785F] uppercase">
                            {formatCurrency(item.price)} / unit
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[10px] text-[#4A4731] mt-2">
                        {item.vesselSize && (
                          <span className="bg-[#EFEEEA] px-2 py-0.5 rounded-xs border border-[#EAE5DE]">
                            {item.vesselSize}
                          </span>
                        )}
                        {item.wickType && (
                          <span className="bg-[#EFEEEA] px-2 py-0.5 rounded-xs border border-[#EAE5DE]">
                            {item.wickType}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EAE5DE]">
                      <div className="flex items-center bg-[#EFEEEA] rounded-sm p-1 border border-[#EAE5DE]">
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          aria-label="Decrease quantity"
                          className="w-6 h-6 rounded-xs bg-white text-[#1B1C1A] flex items-center justify-center hover:bg-[#EAE8E4] transition-colors shadow-xs cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-[#1B1C1A]">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          aria-label="Increase quantity"
                          className="w-6 h-6 rounded-xs bg-white text-[#1B1C1A] flex items-center justify-center hover:bg-[#EAE8E4] transition-colors shadow-xs cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(toggleWishlistItem(item));
                            dispatch(showToast({ message: 'Saved to wishlist!', type: 'info' }));
                          }}
                          className="flex items-center gap-1 text-[#7B785F] hover:text-[#1B1C1A] transition-colors cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Save for later</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            dispatch(removeFromCart(item.id));
                            dispatch(showToast({ message: `${item.title} removed from basket.`, type: 'info' }));
                          }}
                          className="flex items-center gap-1 text-[#7B785F] hover:text-[#BA1A1A] transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: ORDER SUMMARY (5/12) */}
          <div className="w-full lg:w-5/12 lg:sticky lg:top-24 space-y-6">
            <div className="bg-white rounded-sm p-6 border border-[#EAE5DE] shadow-xs space-y-5">
              <h3 className="font-serif text-xl text-[#1B1C1A] pb-3 border-b border-[#EAE5DE]">
                Order Summary
              </h3>

              {/* Only Product Amount, GST, and Total Amount to be Paid */}
              <div className="space-y-3 pt-1 text-xs text-[#4A4731]">
                <div className="flex justify-between items-center">
                  <span>Product Amount ({totalQuantity} items)</span>
                  <span className="font-semibold text-sm text-[#1B1C1A]">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-sm text-[#1B1C1A]">{formatCurrency(gstAmount)}</span>
                </div>

                <div className="pt-4 border-t border-[#EAE5DE] flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-[#1B1C1A]">
                    Total Amount to be Paid
                  </span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#1B1C1A]">
                      {formatCurrency(totalAmount)}
                    </span>
                    <span className="block text-[10px] text-[#7B785F]">Inclusive of 18% GST</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated) {
                    dispatch(openLoginModal('/checkout'));
                    dispatch(showToast({ message: 'Please sign in to proceed to checkout.', type: 'info' }));
                  } else {
                    navigate('/checkout');
                  }
                }}
                className="w-full py-4 px-6 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.99] cursor-pointer"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#EAE5DE] space-y-2 text-[11px] text-[#4A4731]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7B5800] shrink-0" />
                  <span>Secure 256-Bit Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
