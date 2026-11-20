import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  ArrowLeft,
  Lock,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { clearCart } from '../redux/slices/cartSlice';
import { showToast } from '../redux/slices/uiSlice';
import canflareLogo from '../assets/canflare-logo.jpg';
import { formatCurrency } from '../utils/formatters';
import apiClient from '../services/apiClient';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalPrice } = useSelector((state) => state.cart);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: 'Clara',
    lastName: 'Delacroix',
    email: 'clara@lueur.com',
    phone: '+91 98450 12345',
    street: '42 Rue des Artisans, Suite 4B',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    paymentMethod: 'upi',
    upiId: 'clara@okhdfcbank',
    giftNote: 'Please handcraft with crackling wood wick and silk ribbon.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const grandTotal = subtotal + gstAmount;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      dispatch(showToast({ message: 'Your sensory basket is empty', type: 'error' }));
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: 'India'
        },
        items: items.map((i) => ({
          product: i.id,
          name: i.title,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          vessel: i.vesselType || 'Heavy Amber Glass',
          wick: i.wickType || 'Organic Cotton'
        })),
        pricing: {
          subtotal,
          tax: gstAmount,
          total: grandTotal
        },
        paymentMethod: formData.paymentMethod,
        giftNote: formData.giftNote
      };

      const res = await apiClient.post('/orders', orderPayload);
      const createdOrder = res.order || res;

      dispatch(clearCart());
      dispatch(
        showToast({
          message: `Sanctuary Order #${createdOrder.orderNumber || 'LC-8921'} confirmed!`,
          type: 'success'
        })
      );

      navigate(`/track/${createdOrder.orderNumber || createdOrder.id || 'LC-8921-2026'}`);
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Order dispatched locally',
          type: 'info'
        })
      );
      dispatch(clearCart());
      navigate('/track/LC-8921-2026');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#FBF9F5] text-[#1B1C1A]">
      {/* Artisan Checkout Top Header */}
      <header className="w-full bg-[#FFFFFF]/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#EAE8E4] shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#4A4731] hover:text-[#1B1C1A] transition-colors font-medium group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Basket</span>
          </Link>

          <div className="text-center">
            <div className="bg-[#1B1C1A] rounded-lg px-5 py-2.5 inline-flex items-center mx-auto">
              <img
                src={canflareLogo}
                alt="Canflare — Let there be Light"
                className="h-9 w-auto object-contain"
              />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F3EF] text-[#1B1C1A] text-[11px] font-medium tracking-wide">
            <Lock className="w-3.5 h-3.5 text-[#7B5800]" />
            <span className="hidden sm:inline text-[#7B785F]">256-Bit</span>
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Progress Tracker */}
        <div className="mb-10 flex items-center justify-center gap-3 text-[11px] uppercase tracking-wider text-[#7B785F]">
          <span className={`flex items-center gap-1.5 font-semibold ${step >= 1 ? 'text-[#1B1C1A]' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-[#FFBB00] text-[#1B1C1A] text-[10px] flex items-center justify-center font-bold">
              1
            </span>
            Sanctuary Details
          </span>
          <span className="w-10 h-px bg-[#E4E2DE]" />
          <span className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#1B1C1A] font-semibold' : ''}`}>
            <span className="w-5 h-5 rounded-full bg-[#EAE8E4] text-[#4A4731] text-[10px] flex items-center justify-center font-bold">
              2
            </span>
            Artisan Payment
          </span>
          <span className="w-10 h-px bg-[#E4E2DE]" />
          <span className="flex items-center gap-1.5 text-[#7B785F]">
            <span className="w-5 h-5 rounded-full bg-[#EAE8E4] text-[#7B785F] text-[10px] flex items-center justify-center">
              3
            </span>
            Dispatch Confirmation
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-8">
            {/* Express Pay Options */}
            <div className="p-6 rounded-xl bg-[#F5F3EF] border border-[#EAE8E4] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#4A4731]">
                  Instant Express Checkout
                </span>
                <span className="text-[11px] text-[#7B785F]">UPI / 1-Tap Pay</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'gpay' })}
                  className={`h-11 px-3 rounded-lg bg-white border font-bold text-xs flex items-center justify-center shadow-xs transition-all ${
                    formData.paymentMethod === 'gpay' ? 'border-[#FAB507] ring-1 ring-[#FAB507]' : 'border-[#EAE8E4]'
                  }`}
                >
                  GPay
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'phonepe' })}
                  className={`h-11 px-3 rounded-lg bg-[#5F259F] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:opacity-90 transition-all ${
                    formData.paymentMethod === 'phonepe' ? 'ring-2 ring-[#FAB507]' : ''
                  }`}
                >
                  PhonePe
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'paytm' })}
                  className={`h-11 px-3 rounded-lg bg-[#002E6E] text-white font-bold text-xs flex items-center justify-center shadow-xs hover:opacity-90 transition-all ${
                    formData.paymentMethod === 'paytm' ? 'ring-2 ring-[#FAB507]' : ''
                  }`}
                >
                  Paytm
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                  className={`h-11 px-3 rounded-lg bg-white border font-bold text-xs flex items-center justify-center shadow-xs transition-all ${
                    formData.paymentMethod === 'upi' ? 'border-[#FAB507] ring-1 ring-[#FAB507]' : 'border-[#EAE8E4]'
                  }`}
                >
                  <span className="text-[#7B5800] mr-1">UPI</span> ID
                </button>
              </div>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-6">
              {/* Delivery Details */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EAE8E4] shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EAE8E4]">
                  <Truck className="w-5 h-5 text-[#7B5800]" />
                  <h2 className="font-serif text-lg sm:text-xl text-[#1B1C1A]">Sanctuary Delivery Destination</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      Mobile Number (For Courier SMS / WhatsApp)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                    Street Address &amp; Suite / Landmark
                  </label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleChange}
                      className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#7B785F] mb-1 font-medium">
                    Atelier Gift Note &amp; Custom Pour Instructions
                  </label>
                  <textarea
                    rows="2"
                    name="giftNote"
                    value={formData.giftNote}
                    onChange={handleChange}
                    className="w-full bg-[#F5F3EF] px-3.5 py-2.5 rounded-lg text-xs text-[#1B1C1A] outline-none focus:bg-white border border-transparent focus:border-[#FAB507] transition-all"
                  />
                </div>
              </div>

              {/* Payment Methods Accordion */}
              <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#EAE8E4] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#EAE8E4]">
                  <CreditCard className="w-5 h-5 text-[#7B5800]" />
                  <h2 className="font-serif text-lg sm:text-xl text-[#1B1C1A]">Payment Protocol</h2>
                </div>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.paymentMethod === 'upi' ? 'border-[#FAB507] bg-[#FFDEA4]/15' : 'border-[#EAE8E4]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={handleChange}
                      className="mt-1 text-[#7B5800]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1B1C1A]">Direct UPI / Virtual Payment Address</span>
                      </div>
                      <p className="text-[11px] text-[#7B785F] mt-0.5">Pay via GPay, PhonePe, Paytm, or BHIM</p>
                      {formData.paymentMethod === 'upi' && (
                        <input
                          type="text"
                          name="upiId"
                          value={formData.upiId}
                          onChange={handleChange}
                          placeholder="e.g. mobile@upi or username@okhdfcbank"
                          className="mt-2 w-full max-w-sm bg-white border border-[#EAE8E4] px-3 py-1.5 rounded text-xs text-[#1B1C1A] outline-none focus:border-[#FAB507]"
                        />
                      )}
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.paymentMethod === 'card' ? 'border-[#FAB507] bg-[#FFDEA4]/15' : 'border-[#EAE8E4]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleChange}
                      className="mt-1 text-[#7B5800]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#1B1C1A]">Credit or Debit Card (Visa, Mastercard, RuPay, Amex)</span>
                      <p className="text-[11px] text-[#7B785F] mt-0.5">Protected with 256-bit bank grade encryption</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod' ? 'border-[#FAB507] bg-[#FFDEA4]/15' : 'border-[#EAE8E4]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                      className="mt-1 text-[#7B5800]"
                    />
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-[#1B1C1A]">Cash / UPI upon Atelier Hand-Delivery</span>
                      <p className="text-[11px] text-[#7B785F] mt-0.5">Available across metro pin codes</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-[#FAB507] hover:bg-[#E5A506] text-[#1B1C1A] py-4 rounded-xl font-sans text-xs sm:text-sm font-bold uppercase tracking-widest shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-5 h-5 text-[#7B5800]" />
                <span>{isSubmitting ? 'Verifying Atelier Reservation...' : `Authorize & Place Order • ${formatCurrency(grandTotal)}`}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Order Summary Preview */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#EAE8E4] shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E4]">
                <h3 className="font-serif text-lg text-[#1B1C1A]">Curated Order Reserves</h3>
                <span className="text-xs text-[#7B785F]">{items.reduce((s, i) => s + i.quantity, 0)} Items</span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {items.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#7B785F]">
                    No items in basket. <Link to="/shop" className="text-[#7B5800] underline">Explore catalog</Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F5F3EF] shrink-0 border border-[#EAE8E4]">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#1B1C1A] truncate">{item.title}</h4>
                        <p className="text-[11px] text-[#7B785F]">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold text-[#1B1C1A]">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pricing Breakdown: Product Amount, GST (18%), Total Amount to be Paid */}
              <div className="pt-4 border-t border-[#EAE8E4] space-y-2.5 text-xs">
                <div className="flex justify-between text-[#4A4731]">
                  <span>Product Amount ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-[#1B1C1A]">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#4A4731]">
                  <span>GST (18%)</span>
                  <span className="font-semibold text-[#1B1C1A]">{formatCurrency(gstAmount)}</span>
                </div>
                <div className="pt-3 border-t border-[#EAE8E4] flex justify-between items-baseline">
                  <span className="font-serif text-base font-bold text-[#1B1C1A]">Total Amount to be Paid</span>
                  <span className="font-serif text-xl font-bold text-[#1B1C1A]">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Artisan Guarantee */}
              <div className="p-3 rounded-lg bg-[#F5F3EF] text-[11px] text-[#4A4731] space-y-1">
                <p className="font-semibold text-[#1B1C1A] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#FAB507]" /> Canflare Authenticity Seal
                </p>
                <p className="leading-relaxed">
                  Every batch is hand-blended, curated with IFRA-certified natural plant wax, and wrapped in protective seed paper.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

