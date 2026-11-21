import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Star,
  Heart,
  ShoppingBag,
  Share2,
  Check,
  Truck,
  Leaf,
  ShieldCheck,
  Award,
  Sparkles,
  Minus,
  Plus,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { showToast, openLoginModal } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';
import apiClient from '../services/apiClient';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Configuration options
  const [selectedSize, setSelectedSize] = useState({
    name: '220g Amber Glass',
    burn: '55 hrs burn',
    priceOffset: 0,
  });
  const [selectedWick, setSelectedWick] = useState({
    name: 'Egyptian Cotton',
    desc: 'Silent, steady radiant glow',
    priceOffset: 0,
  });
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.warn('Could not fetch product details:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-[#7B5800]">
          <span className="w-6 h-6 border-2 border-[#FAB507] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest font-semibold">
            Opening Atelier Archive...
          </span>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <h2 className="font-serif text-3xl text-[#1B1C1A]">Candle Formulation Not Found</h2>
        <p className="text-xs text-[#4A4731]">This small-batch reserve might have concluded its harvest window.</p>
        <Link
          to="/shop"
          className="bg-[#FAB507] text-[#1B1C1A] px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider"
        >
          Return to All Candles
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const currentPrice =
    (product.price + selectedSize.priceOffset + selectedWick.priceOffset) * quantity;
  const originalPrice = product.originalPrice
    ? (product.originalPrice + selectedSize.priceOffset + selectedWick.priceOffset) * quantity
    : null;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(openLoginModal('/cart'));
      dispatch(
        showToast({
          message: 'Please sign in to add items to your cart.',
          type: 'info',
        })
      );
      return;
    }

    setIsAdding(true);
    dispatch(
      addToCart({
        id: `${product.id}-${selectedSize.name}-${selectedWick.name}`,
        title: product.title,
        price: product.price + selectedSize.priceOffset + selectedWick.priceOffset,
        image: product.images?.[0]?.url || product.image,
        vesselSize: selectedSize.name,
        wickType: selectedWick.name,
        quantity,
      })
    );

    dispatch(
      showToast({
        message: `${quantity}x ${product.title} (${selectedSize.name}) added to basket!`,
        type: 'success',
      })
    );

    setTimeout(() => setIsAdding(false), 800);
  };

  const handleToggleWishlist = () => {
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

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setPincodeStatus({ valid: false, message: 'Please enter a valid 6-digit Indian PIN code.' });
      return;
    }
    setPincodeStatus({
      valid: true,
      message: `Delivery available to ${pincode} via BlueDart Express. Estimated arrival in 2-4 business days.`,
    });
  };

  const galleryImages = product.images?.length
    ? product.images.map((img) => img.url)
    : [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBwpEaKyo-dxXfze4Y8wOoEoN_SyX_DqZXjmGdw1aCfd60xa0AJWLevRYMiw1y2atMHCGwcHIW-gAsfQG3iWCyPk4H4JT7RlrgYdOhiy7ieFTcQkS671GBQErh5YqM_7bCjUOYcOjzlGhPgq_x9i97Hs3FWX7f8HS5A53v0t41pDL3CipXVmKteRE85nyECzz-6TfDrYHslFGgaveFopC8O-M4QMRE_OpG2fz5QNdux',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDu4cQ6j1FfJEFGbqE0WBzO_k1WTaCU3_ZuN-P9NldquNLwRuR-VpSS5NbptVRL6Am9IY8zIiytqqGYa3GJtoT3PF47mKWcJPZkc8kjW4aBu0bEsfZr3Mq6Ow861gmZKCrgjHkLtmsawabd7-0SaVgWXv2SVqRWgqdDsHtfN7xFxoYL81IywLZTyqaGJHHkVKx2lziHhTPuxvaPez6ejeNXXwIVB1XaERVaGNtGfham',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVV3k-nsh9NOnZYyoGm2IeS4OqBNz6TRI-0M5gLQKEak0nOIdtxit80urNg2BspFtK7xZkL1rrnu86v9Au9oV3XOYBoLNiYvfZhVvP4EOwYzh15inm46vW4zl31H9CqxR87F5sQHWLJ95K2tni7xKvRDxY19fLLWnHXOZosPFT1i9r3sYNnoV9hKKsjdFEiT39iiaRPnOQf4wUrypfuH9dUBycc9vr80QYO7Q25gc',
      ];

  const sizeOptions = [
    { name: '220g Amber Glass', burn: '~55 hrs burn', priceOffset: 0 },
    { name: '350g Ceramic Tumbler', burn: '~85 hrs burn', priceOffset: 400 },
    { name: '80g Travel Tin', burn: '~20 hrs burn', priceOffset: -350 },
  ];

  const wickOptions = [
    { name: 'Egyptian Cotton', desc: 'Silent, steady radiant glow', priceOffset: 0 },
    { name: 'Crackling Wood', desc: 'Fireplace sound (+₹50)', priceOffset: 50 },
  ];

  return (
    <div className="w-full flex flex-col bg-[#FBF9F5]">
      {/* 1. BREADCRUMB */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#4A4731] font-medium">
          <Link to="/" className="hover:text-[#1B1C1A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#1B1C1A] transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-[#1B1C1A] font-semibold">{product.title}</span>
        </nav>
      </section>

      {/* 2. MAIN PRODUCT HERO SHOWCASE (2 Columns) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT: MULTI-IMAGE GALLERY (7/12 Desktop) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Primary Big Vessel Photo (4:5 Ratio) */}
            <div className="relative w-full aspect-[4/5] bg-[#F5F0E8] rounded-sm overflow-hidden border border-[#EAE5DE] shadow-xs">
              <img
                src={galleryImages[selectedImage] || galleryImages[0]}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-500"
              />
              {product.badge && product.badge !== 'None' && (
                <span className="absolute top-4 left-4 bg-[#FBF9F5]/90 backdrop-blur-sm text-[#1B1C1A] text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-sm border border-[#EAE5DE]/80 shadow-xs">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-sm overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === idx
                      ? 'border-[#FAB507] shadow-sm'
                      : 'border-[#EAE5DE] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: CONFIGURATION & PURCHASE PANEL (5/12 Desktop) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="space-y-2">
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
                {product.fragranceFamily || 'Woody & Resinous'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] leading-tight font-normal">
                {product.title}
              </h1>
              <p className="text-xs text-[#4A4731] font-light italic">
                {product.subtitle || 'Damask Rose & Warm Golden Amber'}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex text-[#FAB507]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FAB507]" />
                  ))}
                </div>
                <span className="font-semibold text-[#1B1C1A]">{product.rating || 4.9}</span>
                <span className="text-[#4A4731]">({product.numReviews || 88} Verified Reviews)</span>
              </div>
            </div>

            {/* Pricing Block */}
            <div className="bg-[#F5F0E8] p-5 rounded-sm border border-[#EAE5DE] shadow-xs space-y-1.5">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-3xl font-semibold text-[#1B1C1A]">
                  {formatCurrency(currentPrice)}
                </span>
                {originalPrice && (
                  <span className="text-sm text-[#7B785F] line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
                <span className="text-xs px-2 py-0.5 rounded-sm bg-[#FAB507] text-[#1B1C1A] font-bold uppercase tracking-wide">
                  22% OFF
                </span>
              </div>
              <p className="text-[11px] text-[#4A4731]">
                Inclusive of all taxes.
              </p>
            </div>

            {/* Vessel Size Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-widest font-semibold text-[#1B1C1A]">Size &amp; Vessel:</span>
                <span className="text-[#7B5800] font-medium">{selectedSize.name}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((sz) => {
                  const isSelected = selectedSize.name === sz.name;
                  return (
                    <button
                      key={sz.name}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-sm text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#FAB507] bg-[#FFFFFF] shadow-xs font-semibold'
                          : 'border-[#EAE5DE] bg-[#EFEEEA] opacity-80 hover:opacity-100 text-[#4A4731]'
                      }`}
                    >
                      <span className="text-xs text-[#1B1C1A] block">{sz.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-[#7B785F] mt-1">{sz.burn}</span>
                      <span className="text-xs text-[#7B5800] font-medium mt-1">
                        {formatCurrency(product.price + sz.priceOffset)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Wick Type Selector */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-widest font-semibold text-[#1B1C1A]">Wick Selection:</span>
                <span className="text-[11px] text-[#7B785F]">Natural botanicals</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {wickOptions.map((wk) => {
                  const isSelected = selectedWick.name === wk.name;
                  return (
                    <button
                      key={wk.name}
                      type="button"
                      onClick={() => setSelectedWick(wk)}
                      className={`p-3 rounded-sm text-left border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FAB507] bg-[#FFFFFF] shadow-xs'
                          : 'border-[#EAE5DE] bg-[#EFEEEA] opacity-80 hover:opacity-100'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-[#1B1C1A]">{wk.name}</span>
                        <span className="text-[10px] text-[#7B785F]">{wk.desc}</span>
                      </div>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#FAB507] bg-[#FAB507]' : 'border-[#7B785F]'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Stock Indicator */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center bg-[#EFEEEA] rounded-sm p-1 border border-[#EAE5DE]">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                  className="w-7 h-7 rounded-sm bg-[#FFFFFF] text-[#1B1C1A] flex items-center justify-center hover:bg-[#EAE8E4] transition-colors shadow-xs cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-9 text-center text-xs font-semibold text-[#1B1C1A]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                  className="w-7 h-7 rounded-sm bg-[#FFFFFF] text-[#1B1C1A] flex items-center justify-center hover:bg-[#EAE8E4] transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#FAB507] animate-pulse" />
                <span className="text-[#7B5800] font-medium">In Stock — Hand-poured in small batch</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="w-full py-4 px-6 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] font-semibold text-xs uppercase tracking-[0.2em] rounded-sm shadow-md flex items-center justify-center gap-3 transition-transform active:scale-[0.99] cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Check className="w-4 h-4 text-[#1B1C1A]" />
                    <span>ADDED TO BASKET</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#1B1C1A]" />
                    <span>ADD TO BAG — {formatCurrency(currentPrice)}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-3">
                <Link
                  to="/cart"
                  className="flex-1 py-3 px-4 bg-[#1B1C1A] hover:bg-[#30312E] text-white font-medium text-xs uppercase tracking-[0.18em] rounded-sm shadow-xs transition-colors text-center"
                >
                  BUY IT NOW
                </Link>
                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  aria-label="Wishlist"
                  className="w-12 h-11 bg-[#EFEEEA] hover:bg-[#EAE8E4] rounded-sm flex items-center justify-center text-[#4A4731] hover:text-[#BA1A1A] transition-colors shadow-xs border border-[#EAE5DE] cursor-pointer"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#BA1A1A] text-[#BA1A1A]' : ''}`} />
                </button>
              </div>
            </div>

            {/* Pincode Estimator */}
            <form onSubmit={handleCheckPincode} className="p-4 bg-[#EFEEEA] rounded-sm border border-[#EAE5DE] space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
                <Truck className="w-4 h-4 text-[#7B5800]" />
                <span>Delivery Availability &amp; Transit</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 bg-white px-3 py-2 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] rounded-sm border border-[#CCC7AA] focus:outline-none focus:ring-1 focus:ring-[#FAB507]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B1C1A] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#30312E] transition-colors cursor-pointer"
                >
                  Check
                </button>
              </div>
              {pincodeStatus && (
                <p className={`text-[11px] ${pincodeStatus.valid ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {pincodeStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
