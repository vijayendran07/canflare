import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F0E8] border-t border-[#EAE5DE] pt-12 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#EAE5DE]">
          {/* Brand Bio */}
          <div className="space-y-4">
            <div>
              <span className="font-serif text-2xl tracking-tight text-[#1B1C1A]">
                Lueur &amp; Co.
              </span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-[#7B785F]">
                canflare • Atelier Aromatics
              </span>
            </div>
            <p className="text-xs text-[#4A4731] leading-relaxed font-sans">
              Artisanal aromatics poured slowly with plant-based botanical waxes, rare oils, and lead-free cotton wicks for mindful living sanctuaries.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#4A4731]">
              <li>
                <Link to="/shop" className="hover:text-[#1B1C1A] transition-colors">
                  Shop All Candles
                </Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-[#1B1C1A] transition-colors">
                  Curated Collections
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#1B1C1A] transition-colors">
                  About Atelier
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1B1C1A] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#4A4731]">
              <li>
                <span className="hover:text-[#1B1C1A] transition-colors cursor-pointer">
                  Shipping &amp; Deliveries (Free ₹1,499+)
                </span>
              </li>
              <li>
                <span className="hover:text-[#1B1C1A] transition-colors cursor-pointer">
                  Returns &amp; Break-Free Guarantee
                </span>
              </li>
              <li>
                <span className="hover:text-[#1B1C1A] transition-colors cursor-pointer">
                  Candle Care &amp; Burn Rituals
                </span>
              </li>
              <li>
                <span className="hover:text-[#1B1C1A] transition-colors cursor-pointer">
                  Privacy Policy &amp; Terms
                </span>
              </li>
            </ul>
          </div>

          {/* Payment Badges */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
              Verified Payment
            </h4>
            <p className="text-xs text-[#4A4731]">
              256-bit SSL encrypted checkout supported by trusted local and international payment rails.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-2.5 py-1 bg-white border border-[#CCC7AA] text-[10px] uppercase font-bold text-[#1B1C1A] rounded-sm">
                UPI
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#CCC7AA] text-[10px] uppercase font-bold text-[#1B1C1A] rounded-sm">
                Visa
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#CCC7AA] text-[10px] uppercase font-bold text-[#1B1C1A] rounded-sm">
                Mastercard
              </span>
              <span className="px-2.5 py-1 bg-white border border-[#CCC7AA] text-[10px] uppercase font-bold text-[#1B1C1A] rounded-sm">
                RuPay
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A4731]">
          <p>© 2025 Canflare — Lueur &amp; Co. Artisan Aromatics. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-widest text-[#7B785F]">
            Crafted with reverence for nature &amp; slow living
          </p>
        </div>
      </div>
    </footer>
  );
}

