import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';
import canflareLogo from '../../assets/canflare-logo.jpg';

export default function Footer() {
  return (
    <footer className="w-full bg-[#F5F0E8] border-t border-[#EAE5DE] pt-12 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#EAE5DE]">
          {/* Brand Bio */}
          <div className="space-y-4">
            <div className="bg-[#1B1C1A] rounded px-3 py-2 inline-flex items-center">
              <img
                src={canflareLogo}
                alt="Canflare — Let there be Light"
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#4A4731] leading-relaxed font-sans">
              Artisanal aromatics poured slowly with plant-based botanical waxes, rare oils, and lead-free cotton wicks for mindful living sanctuaries.
            </p>

            {/* Social & Direct Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/message/NTBONRJVIW56I1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors border border-[#CCC7AA]"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm0 10.367c-.89 0-1.637-.247-2.428-.73l-.174-.107-1.782.467.476-1.737-.117-.187c-.524-.834-.842-1.67-.842-2.504 0-2.536 2.064-4.6 4.601-4.6 2.538 0 4.602 2.064 4.602 4.6 0 2.537-2.064 4.601-4.602 4.601z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/canflare?utm_source=qr&srtk=bHdnNGRvdDd6NGZm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#E4405F] text-[#E4405F] hover:text-white flex items-center justify-center transition-colors border border-[#CCC7AA]"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>

              <a
                href="tel:9840699339"
                aria-label="Phone"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#FAB507] text-[#1B1C1A] flex items-center justify-center transition-colors border border-[#CCC7AA]"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>

              <a
                href="mailto:canflare@gmail.com"
                aria-label="Email"
                className="w-8 h-8 rounded-full bg-white hover:bg-[#1B1C1A] hover:text-white text-[#1B1C1A] flex items-center justify-center transition-colors border border-[#CCC7AA]"
              >
                <Mail className="w-3.5 h-3.5" />
              </a>
            </div>
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
                <Link to="/about" className="hover:text-[#1B1C1A] transition-colors">
                  About Canflare Atelier
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1B1C1A] transition-colors">
                  Contact Us &amp; Custom Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Atelier Contact & Studio */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#1B1C1A]">
              Atelier Studio
            </h4>
            <div className="space-y-2.5 text-xs text-[#4A4731]">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#7B5800] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  No 6, Varalakshmi Nagar Ext,<br />
                  1st Street, Kolathur,<br />
                  Chennai 600099, Tamil Nadu
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#7B5800] shrink-0" />
                <a href="tel:9840699339" className="hover:text-[#1B1C1A] transition-colors">
                  +91 98406 99339
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#7B5800] shrink-0" />
                <a href="mailto:canflare@gmail.com" className="hover:text-[#1B1C1A] transition-colors">
                  canflare@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Payment Badges & Trust */}
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
          <p>© 2025 Canflare — Let there be Light. All rights reserved.</p>
          <p className="text-[10px] uppercase tracking-widest text-[#7B785F]">
            Crafted with reverence for nature &amp; slow living • Kolathur, Chennai
          </p>
        </div>
      </div>
    </footer>
  );
}
