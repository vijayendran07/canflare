import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Heart, ShoppingBag, User } from 'lucide-react';
import { setSearchQuery } from '../../redux/slices/uiSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const searchQuery = useSelector((state) => state.ui?.searchQuery || '');

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop / All Candles', path: '/shop' },
    { label: 'Collections', path: '/collections' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(45,36,26,0.06)] border-b border-[#EAE5DE]">
      {/* 1. Top Announcement Strip */}
      <div className="w-full bg-[#1B1C1A] text-white py-1.5 px-4 text-center tracking-widest text-[11px] font-medium uppercase">
        <p className="flex items-center justify-center gap-2">
          <span>Complimentary shipping on orders over ₹1,499</span>
          <span className="opacity-40 text-[#FFDEA4]">|</span>
          <span className="text-[#FFDEA4]">Handcrafted in Small Batches</span>
        </p>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col group shrink-0">
            <span className="font-serif text-2xl lg:text-3xl tracking-tight text-[#1B1C1A] group-hover:text-[#7B5800] transition-colors font-normal">
              Lueur &amp; Co.
            </span>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#4A4731] -mt-1 font-sans">
              canflare • Artisan Aromatics
            </span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full flex items-center bg-[#EFEEEA] rounded-sm">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search candles, fragrances, notes..."
                className="w-full bg-transparent pl-4 pr-11 py-2 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-1 focus:ring-[#FAB507]"
              />
              <button
                type="button"
                aria-label="Search"
                className="absolute right-1 top-1 bottom-1 w-8 bg-[#FAB507] text-[#1B1C1A] flex items-center justify-center rounded-sm hover:opacity-90 transition-opacity"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-[#1B1C1A] font-semibold border-b-2 border-[#FAB507]'
                      : 'text-[#4A4731] hover:text-[#1B1C1A]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-[#4A4731] hover:text-[#1B1C1A] transition-colors p-1"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FAB507] text-[#1B1C1A] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="relative text-[#4A4731] hover:text-[#1B1C1A] transition-colors p-1"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1B1C1A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Profile */}
            <Link
              to="/auth"
              aria-label="Account"
              className="w-8 h-8 rounded-full bg-[#1B1C1A] text-white flex items-center justify-center hover:bg-[#30312E] transition-colors"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

