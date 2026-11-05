import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Truck,
  Trash2,
  Heart,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Package,
  Gift,
  Check,
} from 'lucide-react';
import {
  removeFromCart,
  updateQuantity,
  toggleGiftWrap,
  setGiftMessage,
  selectSampleMelt,
  addToCart,
} from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    items,
    totalQuantity,
    subtotal,
    freeShippingThreshold,
    giftWrapIncluded,
    giftMessage,
    selectedSampleMelt,
  } = useSelector((state) => state.cart);

  const [promoCode, setPromoCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);

  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shippingFee = isFreeShipping || subtotal === 0 ? 0 : 99;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const sampleMelts = [
    { id: 'lavender', title: 'Lavender Calm', desc: 'French lavender & wild chamomile' },
    { id: 'vanilla', title: 'Vanilla Dreams', desc: 'Tahitian vanilla & whipped cream' },
    { id: 'cedre', title: 'Cèdre Noir', desc: 'Atlas cedarwood & dark patchouli' },
  ];

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (code === 'WELCOME10' || code === 'ATELIER10') {
      const discount = Math.round(subtotal * 0.1);
      setDiscountAmount(discount);
      setAppliedPromo(code);
      dispatch(showToast({ message: `Voucher ${code} applied! 10% privilege unlocked.`, type: 'success' }));
    } else {
      dispatch(showToast({ message: 'Invalid or expired patron code.', type: 'error' }));
    }
  };

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  if (items.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FAB507]/20 text-[#7B5800] flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A]">Your Sensory Basket is Empty</h1>
        <p className="text-xs sm:text-sm text-[#4A4731] max-w-md mx-auto">
          You haven't selected any artisanal candle formulations for your sanctuary yet.
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
    <div className="w-full flex flex-col bg-[#FBF9F5] pb-20">
      {/* 1. FREE SHIPPING PROGRESS BAR */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        <div className="bg-[#F5F0E8] rounded-sm p-6 border border-[#EAE5DE] shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FAB507]/20 flex items-center justify-center text-[#7B5800]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs uppercase tracking-widest font-semibold text-[#7B5800]">
                  Complimentary Shipping Status
                </h2>
                <p className="text-xs text-[#1B1C1A] font-medium">
                  {isFreeShipping
                    ? `Congratulations! You have unlocked Complimentary Express Shipping with ${formatCurrency(subtotal)} in your basket.`
                    : `Add ${formatCurrency(freeShippingThreshold - subtotal)} more to unlock Complimentary Express Courier Delivery.`}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#7B5800] bg-white border border-[#EAE5DE] px-3 py-1 rounded-full self-start md:self-auto">
              {isFreeShipping ? 'Threshold Reached' : `Threshold: ₹1,499`}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#EAE8E4] h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FAB507] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-[#7B785F] mt-2 font-medium tracking-wide">
            <span>₹0</span>
            <span>Tier 1: Botanical Match Cloche (₹999)</span>
            <span className={isFreeShipping ? 'text-[#7B5800] font-bold' : ''}>
              Tier 2: Express Delivery Unlocked (₹1,499)
            </span>
          </div>
        </div>
      </section>

      {/* 2. MAIN SPLIT CANVAS (7/12 + 5/12 Desktop) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10 items-start">
          {/* LEFT COLUMN: BASKET ITEMS & ADDITIONS (7/12) */}
          <div className="w-full lg:w-7/12 space-y-8">
            <div className="flex items-baseline justify-between border-b border-[#EAE5DE] pb-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#7B5800]">
                  Artisanal Selection
                </span>
                <h1 className="font-serif text-3xl text-[#1B1C1A] mt-0.5 font-normal">
                  Your Sensory Basket
                </h1>
              </div>
              <span className="text-xs text-[#7B785F] uppercase tracking-wider">
                {totalQuantity} Curated Vessel{totalQuantity > 1 ? 's' : ''}
              </span>
            </div>

            {/* Items Stack */}
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-sm p-5 border border-[#EAE5DE] shadow-xs flex flex-col sm:flex-row gap-5"
                >
                  <div className="w-full sm:w-28 h-32 rounded-sm overflow-hidden shrink-0 bg-[#F5F0E8] border border-[#EAE5DE]">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-[10px] tracking-widest uppercase font-semibold text-[#7B5800]">
                            Small Batch Soy
                          </span>
                          <h3 className="font-serif text-lg text-[#1B1C1A] leading-snug">
                            {item.title}
                          </h3>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-base text-[#1B1C1A]">
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
                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#EAE5DE]">
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
                            dispatch(showToast({ message: 'Saved to your reserves!', type: 'info' }));
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

            {/* Complimentary Gifting Ritual */}
            <div className="bg-white rounded-sm p-6 border border-[#EAE5DE] shadow-xs space-y-3">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={giftWrapIncluded}
                  onChange={(e) => dispatch(toggleGiftWrap(e.target.checked))}
                  className="mt-1 w-4 h-4 rounded-xs accent-[#FAB507] cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#1B1C1A]">
                      Complimentary Calligraphy Note &amp; Silk Botanical Ribbon
                    </span>
                    <span className="text-[11px] font-bold text-[#7B5800] uppercase">
                      Complimentary (₹0)
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A4731] mt-1 leading-relaxed">
                    Packaged in unbleached kraft box sealed with botanical wax and tied with olive ribbon.
                  </p>
                </div>
              </label>

              {giftWrapIncluded && (
                <div className="pt-3 border-t border-[#EAE5DE]">
                  <label className="text-[10px] tracking-wider uppercase font-semibold text-[#1B1C1A] block mb-1.5">
                    Your Personal Message (Max 180 Characters)
                  </label>
                  <textarea
                    rows={3}
                    maxLength={180}
                    value={giftMessage}
                    onChange={(e) => dispatch(setGiftMessage(e.target.value))}
                    placeholder="Write your heartfelt note. Our calligrapher will hand-inscribe it onto textured cotton paper..."
                    className="w-full bg-[#F5F0E8] p-3 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] rounded-sm border border-[#CCC7AA] focus:outline-none focus:ring-1 focus:ring-[#FAB507] resize-none"
                  />
                  <span className="text-[10px] text-[#7B785F] text-right block">
                    {180 - giftMessage.length} characters remaining
                  </span>
                </div>
              )}
            </div>

            {/* Complimentary 25g Sample Melt Selector */}
            <div className="bg-white rounded-sm p-6 border border-[#EAE5DE] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#7B5800]">
                    Atelier Gift
                  </span>
                  <h3 className="font-serif text-lg text-[#1B1C1A]">Select 1 Complimentary Wax Melt Sample</h3>
                </div>
                <span className="text-[11px] text-[#7B785F]">25g Votive Melt</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {sampleMelts.map((sample) => {
                  const isChecked = selectedSampleMelt === sample.id;
                  return (
                    <label
                      key={sample.id}
                      onClick={() => dispatch(selectSampleMelt(sample.id))}
                      className={`p-3.5 rounded-sm border cursor-pointer transition-all flex flex-col justify-between ${
                        isChecked
                          ? 'border-[#FAB507] bg-[#F5F0E8] shadow-xs'
                          : 'border-[#EAE5DE] bg-white hover:bg-[#F5F0E8]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-[#1B1C1A]">{sample.title}</span>
                        <input
                          type="radio"
                          name="sampleMelt"
                          checked={isChecked}
                          onChange={() => {}}
                          className="accent-[#FAB507]"
                        />
                      </div>
                      <p className="text-[10px] text-[#4A4731] leading-relaxed">{sample.desc}</p>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY ORDER SUMMARY (5/12) */}
          <div className="w-full lg:w-5/12 sticky top-28 space-y-6">
            <div className="bg-white rounded-sm p-6 border border-[#EAE5DE] shadow-xs space-y-5">
              <h3 className="font-serif text-xl text-[#1B1C1A] pb-3 border-b border-[#EAE5DE]">
                Consignment Summary
              </h3>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter Promo Code (WELCOME10)"
                  className="flex-1 bg-[#F5F0E8] px-3.5 py-2.5 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] rounded-sm border border-[#CCC7AA] focus:outline-none focus:ring-1 focus:ring-[#FAB507] uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#1B1C1A] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#30312E] transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-sm border border-emerald-200">
                  <span>Privilege Code: <b>{appliedPromo}</b></span>
                  <span>-10%</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2.5 pt-2 text-xs text-[#4A4731]">
                <div className="flex justify-between">
                  <span>Vessel Subtotal</span>
                  <span className="font-medium text-[#1B1C1A]">{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#7B5800]">
                    <span>Atelier Patron Discount</span>
                    <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Courier Shipping</span>
                  <span className="font-medium text-[#1B1C1A]">
                    {shippingFee === 0 ? (
                      <span className="text-[#7B5800] uppercase font-bold text-[10px]">Complimentary</span>
                    ) : (
                      formatCurrency(shippingFee)
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Custom Gifting Ribbon &amp; Seal</span>
                  <span className="text-[#7B5800] uppercase font-bold text-[10px]">Included (₹0)</span>
                </div>

                <div className="pt-3 border-t border-[#EAE5DE] flex justify-between items-baseline">
                  <span className="font-serif text-lg text-[#1B1C1A]">Total Inscribed</span>
                  <div className="text-right">
                    <span className="font-serif text-2xl font-bold text-[#1B1C1A]">
                      {formatCurrency(finalTotal)}
                    </span>
                    <span className="block text-[10px] text-[#7B785F]">Inclusive of all applicable GST</span>
                  </div>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={() => dispatch(showToast({ message: 'Redirecting to 256-bit SSL Secure Checkout...', type: 'info' }))}
                className="w-full py-4 px-6 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.99] cursor-pointer"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Badges */}
              <div className="pt-4 border-t border-[#EAE5DE] space-y-2 text-[11px] text-[#4A4731]">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7B5800] shrink-0" />
                  <span>Break-Free Guaranteed Express Transit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#7B5800] shrink-0" />
                  <span>100% Botanical Soy Wax with Lead-Free Cotton Wicks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
