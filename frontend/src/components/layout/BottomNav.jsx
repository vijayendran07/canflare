import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, LayoutGrid, User, ShoppingCart } from 'lucide-react';
import { openLoginModal } from '../../redux/slices/uiSlice';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0);
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  const handleAccountClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      dispatch(openLoginModal('/account'));
    }
  };

  const navItems = [
    {
      label: 'Home',
      path: '/',
      icon: Home,
      exact: true,
    },
    {
      label: 'Categories',
      path: '/shop',
      icon: LayoutGrid,
    },
    {
      label: 'Account',
      path: '/account',
      icon: User,
      onClick: handleAccountClick,
    },
    {
      label: 'Cart',
      path: '/cart',
      icon: ShoppingCart,
      badge: totalQuantity,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200/90 shadow-[0_-3px_12px_rgba(0,0,0,0.06)] md:hidden py-1 px-2"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={item.onClick}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors relative cursor-pointer ${
                isActive ? 'text-[#2874F0]' : 'text-[#717478] hover:text-[#1B1C1A]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'stroke-[2.5px] scale-105' : 'stroke-[1.8px]'
                  }`}
                />
                {item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#E91E63] text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] mt-1 tracking-tight leading-none ${
                  isActive ? 'font-bold text-[#2874F0]' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
