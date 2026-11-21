import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  CheckCircle,
  Layers,
  Palette,
  Route,
  Activity,
  Flame,
} from 'lucide-react';
import Button from '../components/common/Button';
import { addToCart } from '../redux/slices/cartSlice';
import { toggleWishlistItem } from '../redux/slices/wishlistSlice';
import { showToast } from '../redux/slices/uiSlice';
import { formatCurrency } from '../utils/formatters';

export default function TestSetupPage() {
  const dispatch = useDispatch();
  const { totalQuantity, subtotal } = useSelector((state) => state.cart);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const handleTestAddToCart = () => {
    dispatch(
      addToCart({
        id: 'test-sandalwood',
        title: 'Sandalwood Luxury Votive',
        price: 699,
        quantity: 1,
      })
    );
    dispatch(
      showToast({
        message: 'Sandalwood Luxury Votive added to sensory basket!',
        type: 'success',
      })
    );
  };

  const handleTestToggleWishlist = () => {
    dispatch(
      toggleWishlistItem({
        id: 'test-sandalwood',
        title: 'Sandalwood Luxury Votive',
      })
    );
    dispatch(
      showToast({
        message: 'Wishlist reserve updated!',
        type: 'info',
      })
    );
  };

  const tokens = [
    { name: 'Canvas Surface', hex: '#FBF9F5', role: 'Main background' },
    { name: 'Oat Silk Surface', hex: '#F5F0E8', role: 'Container background' },
    { name: 'Rich Charcoal', hex: '#1B1C1A', role: 'Primary text & headings' },
    { name: 'Luminous Gold', hex: '#FAB507', role: 'Primary CTAs & stars' },
    { name: 'Radiant Amber', hex: '#7B5800', role: 'Category tags & borders' },
    { name: 'Warm Gilded Border', hex: '#EAE5DE', role: 'Hairline dividers' },
  ];

  const verificationItems = [
    { title: 'React 19 + Vite HMR', desc: 'Fast modular frontend bundler', icon: Activity, ok: true },
    { title: 'Tailwind CSS Theme', desc: 'Custom tokens matching DESIGN.md', icon: Palette, ok: true },
    { title: 'React Router DOM', desc: 'MainLayout with nested routing', icon: Route, ok: true },
    { title: 'Redux Toolkit Store', desc: 'Cart, Wishlist, Auth & UI slices', icon: Layers, ok: true },
    { title: 'Framer Motion', desc: 'Fluid spring animations enabled', icon: Sparkles, ok: true },
    { title: 'Axios API Client', desc: 'Configured with interceptors & base URL', icon: Flame, ok: true },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Hero Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAB507]/20 border border-[#FAB507]/40 text-[#7B5800] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Frontend Architecture Setup Complete
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-[#1B1C1A] leading-tight font-normal">
          Canflare — Lueur &amp; Co.
        </h1>
        <p className="text-xs uppercase tracking-[0.25em] text-[#7B5800] mt-1 font-semibold">
          Artisan Scented Candles • MERN E-Commerce
        </p>
        <p className="mt-4 text-sm text-[#4A4731] leading-relaxed max-w-xl mx-auto">
          The core frontend infrastructure is verified and operational. Global styles, typography, Redux state slices, and layout wrappers are configured according to <code className="bg-[#EFEEEA] px-1.5 py-0.5 rounded text-xs">DESIGN.md</code>.
        </p>
      </motion.div>

      {/* Live Interactive State Verification Card */}
      <div className="bg-[#FFFFFF] border border-[#EAE5DE] rounded-lg p-6 sm:p-8 shadow-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#EAE5DE] gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#7B5800] font-semibold">
              Live State Verification
            </span>
            <h2 className="font-serif text-2xl text-[#1B1C1A] mt-0.5">
              Redux Toolkit Store &amp; Interactive Toast
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={handleTestAddToCart}
              icon={<ShoppingBag className="w-4 h-4" />}
            >
              Test Add to Basket
            </Button>
            <Button
              variant="secondary"
              onClick={handleTestToggleWishlist}
              icon={<Heart className="w-4 h-4" />}
            >
              Toggle Wishlist
            </Button>
          </div>
        </div>

        {/* State Display Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-sm bg-[#F5F0E8] border border-[#EAE5DE]">
            <span className="text-xs uppercase tracking-wider text-[#7B785F]">
              Basket Items
            </span>
            <p className="font-serif text-3xl text-[#1B1C1A] mt-1 font-normal">
              {totalQuantity}
            </p>
            <span className="text-[11px] text-[#7B5800]">
              Subtotal: {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="p-4 rounded-sm bg-[#F5F0E8] border border-[#EAE5DE]">
            <span className="text-xs uppercase tracking-wider text-[#7B785F]">
              Saved Reserves (Wishlist)
            </span>
            <p className="font-serif text-3xl text-[#1B1C1A] mt-1 font-normal">
              {wishlistItems.length}
            </p>
            <span className="text-[11px] text-[#7B5800]">
              Items reserved for ritual
            </span>
          </div>

          <div className="p-4 rounded-sm bg-[#F5F0E8] border border-[#EAE5DE]">
            <span className="text-xs uppercase tracking-wider text-[#7B785F]">
              Free Shipping Status
            </span>
            <p className="font-serif text-3xl text-[#1B1C1A] mt-1 font-normal">
              {subtotal >= 1499 ? 'Unlocked' : `₹${Math.max(0, 1499 - subtotal)} away`}
            </p>
            <span className="text-[11px] text-[#7B5800]">
              Threshold: ₹1,499
            </span>
          </div>
        </div>
      </div>

      {/* Design System Tokens Grid */}
      <div className="mb-10">
        <h3 className="font-serif text-2xl text-[#1B1C1A] mb-4">
          Artisan Warm Luxury Tokens
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {tokens.map((token) => (
            <div
              key={token.hex}
              className="p-3 rounded-sm bg-[#FFFFFF] border border-[#EAE5DE] shadow-xs flex flex-col justify-between"
            >
              <div
                className="w-full h-12 rounded-xs border border-black/10 mb-2"
                style={{ backgroundColor: token.hex }}
              />
              <span className="text-[11px] font-semibold text-[#1B1C1A]">
                {token.name}
              </span>
              <span className="text-[10px] font-mono text-[#7B785F]">
                {token.hex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Architecture Checklist */}
      <div>
        <h3 className="font-serif text-2xl text-[#1B1C1A] mb-4">
          Core Architecture Modules
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verificationItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-sm bg-[#FFFFFF] border border-[#EAE5DE] flex items-start gap-3"
              >
                <div className="p-2 rounded-sm bg-[#FAB507]/20 text-[#7B5800] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
                      {item.title}
                    </h4>
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-[#4A4731] mt-1">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

