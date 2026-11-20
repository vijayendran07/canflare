import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  LogOut,
} from 'lucide-react';
import { setSearchQuery, openLoginModal } from '../../redux/slices/uiSlice';
import { logoutUser } from '../../redux/slices/authSlice';
import canflareLogo from '../../assets/canflare-logo.jpg';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const searchQuery = useSelector((state) => state.ui?.searchQuery || '');
  const { isAuthenticated, user } = useSelector((state) => state.auth || {});

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop Candles', path: '/shop' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FBF9F5]/95 backdrop-blur-md shadow-[0_1px_8px_rgba(45,36,26,0.06)] border-b border-[#EAE5DE]">
      {/* 1. Top Announcement Strip (Desktop only for compact mobile height) */}
      <div className="hidden sm:block w-full bg-[#1B1C1A] text-white py-1.5 px-3 text-center tracking-widest text-[10px] sm:text-[11px] font-medium uppercase">
        <p className="flex items-center justify-center gap-1.5 sm:gap-2 truncate">
          <span>100% Pure Botanical Soy Wax</span>
          <span className="opacity-40 text-[#FFDEA4]">|</span>
          <span className="text-[#FFDEA4]">Handcrafted in Chennai</span>
        </p>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="shrink-0 flex items-center">
            <div className="bg-[#1B1C1A] rounded px-2 sm:px-3 py-1 sm:py-1.5 inline-flex items-center shadow-xs">
              <img
                src={canflareLogo}
                alt="Canflare — Let there be Light"
                className="h-6 sm:h-9 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Visible Search Bar Between Logo and Wishlist */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex flex-1 max-w-sm sm:max-w-md mx-2 sm:mx-4"
          >
            <div className="relative w-full flex items-center bg-[#EFEEEA] rounded-full sm:rounded-lg border border-gray-200/90 focus-within:border-[#FAB507] transition-all">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder="Search candles, fragrances..."
                className="w-full bg-transparent pl-3.5 sm:pl-4 pr-8 sm:pr-10 py-1.5 sm:py-2 text-[11px] sm:text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-1 top-1 bottom-1 w-6 sm:w-8 bg-[#FAB507] text-[#1B1C1A] flex items-center justify-center rounded-full sm:rounded-md hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs tracking-wider uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-[#1B1C1A] font-bold border-b-2 border-[#FAB507]'
                      : 'text-[#4A4731] hover:text-[#1B1C1A] font-medium'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Icons (Wishlist always visible; Cart & Profile on Desktop) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              aria-label="Wishlist"
              className="relative text-[#4A4731] hover:text-[#1B1C1A] transition-colors p-1"
            >
              <Heart className="w-5 h-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FAB507] text-[#1B1C1A] text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart (Desktop only, mobile has BottomNav) */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="hidden md:flex relative text-[#4A4731] hover:text-[#1B1C1A] transition-colors p-1"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1B1C1A] text-white text-[9px] sm:text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </Link>

            {/* Profile / Account (Desktop only, mobile has BottomNav) */}
            <div className="hidden md:block relative">
              {isAuthenticated ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowProfileMenu((prev) => !prev)}
                    aria-label="Account Menu"
                    className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-3 py-1 rounded-full bg-[#EFEEEA] hover:bg-[#EAE5DE] text-[#1B1C1A] text-xs font-medium transition-colors cursor-pointer"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1B1C1A] text-[#FFDEA4] flex items-center justify-center font-bold text-[11px] sm:text-xs uppercase">
                      {user?.name ? user.name.charAt(0) : 'U'}
                    </div>
                    <span className="hidden sm:inline max-w-[80px] truncate">
                      {user?.name || 'Account'}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileMenu && (
                    <div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-[#EAE5DE] py-2 z-50"
                      onMouseLeave={() => setShowProfileMenu(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#EAE5DE]">
                        <p className="text-xs font-semibold text-[#1B1C1A] truncate">
                          {user?.name}
                        </p>
                        <p className="text-[10px] text-[#7B785F] truncate">
                          {user?.email}
                        </p>
                        {user?.isAdmin && (
                          <span className="inline-block mt-1 text-[9px] font-bold bg-[#1B1C1A] text-[#FFDEA4] px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Admin
                          </span>
                        )}
                      </div>

                      {user?.isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className="block px-4 py-2 text-xs text-[#1B1C1A] hover:bg-[#F5F0E8] transition-colors"
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/account"
                        onClick={() => setShowProfileMenu(false)}
                        className="block px-4 py-2 text-xs text-[#1B1C1A] hover:bg-[#F5F0E8] transition-colors"
                      >
                        My Account &amp; Orders
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          dispatch(logoutUser());
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-[#EAE5DE] mt-1 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => dispatch(openLoginModal())}
                  aria-label="Sign In"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1B1C1A] text-white flex items-center justify-center hover:bg-[#30312E] hover:scale-105 transition-all shadow-xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
