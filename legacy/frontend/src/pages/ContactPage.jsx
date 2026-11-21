import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { showToast } from '../redux/slices/uiSlice';

export default function ContactPage() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'custom_order',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate sending message to Canflare atelier
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      dispatch(
        showToast({
          message: 'Thank you! Your message has been sent to our Canflare atelier team.',
          type: 'success',
        })
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: 'custom_order',
        message: '',
      });
    }, 600);
  };

  const contactMethods = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Instant Chat',
      subtitle: 'Fastest response for quick queries & orders',
      value: 'Message Canflare on WhatsApp',
      actionLabel: 'Chat on WhatsApp',
      link: 'https://wa.me/message/NTBONRJVIW56I1',
      badge: 'Instant Response',
      isExternal: true,
      icon: (
        <svg className="w-6 h-6 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.54 1.777.82 2.791.82 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.766-5.768-5.766zm0 10.367c-.89 0-1.637-.247-2.428-.73l-.174-.107-1.782.467.476-1.737-.117-.187c-.524-.834-.842-1.67-.842-2.504 0-2.536 2.064-4.6 4.601-4.6 2.538 0 4.602 2.064 4.602 4.6 0 2.537-2.064 4.601-4.602 4.601zM12 2C6.477 2 2 6.477 2 12c0 1.891.523 3.662 1.433 5.178L2 22l4.957-1.399C8.423 21.493 10.153 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
        </svg>
      ),
      highlightBg: 'hover:border-[#25D366]/40',
    },
    {
      id: 'phone',
      title: 'Direct Phone & Calls',
      subtitle: 'Mon - Sat: 10:00 AM - 7:30 PM IST',
      value: '+91 98406 99339',
      actionLabel: 'Call Now',
      link: 'tel:9840699339',
      badge: 'Voice Support',
      isExternal: false,
      icon: <Phone className="w-6 h-6 text-[#FAB507]" />,
      highlightBg: 'hover:border-[#FAB507]/50',
    },
    {
      id: 'email',
      title: 'Email Correspondence',
      subtitle: 'Detailed quotes, corporate & collaborations',
      value: 'canflare@gmail.com',
      actionLabel: 'Send an Email',
      link: 'mailto:canflare@gmail.com',
      badge: 'Within 4 Hours',
      isExternal: false,
      icon: <Mail className="w-6 h-6 text-[#7B5800]" />,
      highlightBg: 'hover:border-[#7B5800]/40',
    },
    {
      id: 'instagram',
      title: 'Instagram Community',
      subtitle: 'New candle launches, scent stories & reels',
      value: '@canflare',
      actionLabel: 'Follow on Instagram',
      link: 'https://www.instagram.com/canflare?utm_source=qr&srtk=bHdnNGRvdDd6NGZm',
      badge: 'Social Atelier',
      isExternal: true,
      icon: (
        <svg
          className="w-6 h-6 text-[#E4405F]"
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
      ),
      highlightBg: 'hover:border-[#E4405F]/40',
    },
  ];

  return (
    <div className="w-full bg-[#FBF9F5] text-[#1B1C1A] min-h-screen">
      {/* 1. Header Hero Section */}
      <section className="relative bg-[#1B1C1A] text-[#FBF9F5] py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#FAB507_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAB507]/15 border border-[#FAB507]/30 text-[#FAB507] text-[11px] font-semibold tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect with Canflare Candles</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white">
            Let there be Light
          </h1>

          <p className="text-sm sm:text-base text-[#D4CFBD] max-w-2xl mx-auto leading-relaxed">
            Have a question about our slow-poured fragrances, bespoke gifting hampers, or custom candle orders? Reach out directly to our Chennai atelier team.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs">
            <a
              href="https://wa.me/message/NTBONRJVIW56I1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-full font-semibold transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us Direct</span>
            </a>
            <a
              href="tel:9840699339"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-full font-semibold transition-all active:scale-95"
            >
              <Phone className="w-4 h-4 text-[#FAB507]" />
              <span>+91 98406 99339</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Direct Channels Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((method) => (
            <div
              key={method.id}
              className={`bg-white rounded-xl p-6 border border-[#EAE5DE] shadow-xs transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${method.highlightBg}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F0E8] flex items-center justify-center">
                    {method.icon}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F5F0E8] text-[#7B5800]">
                    {method.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-base font-semibold text-[#1B1C1A]">
                    {method.title}
                  </h3>
                  <p className="text-xs text-[#7B785F] mt-0.5">{method.subtitle}</p>
                </div>

                <p className="text-sm font-semibold text-[#1B1C1A] break-all pt-1 font-mono">
                  {method.value}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-[#EAE5DE]/60">
                <a
                  href={method.link}
                  target={method.isExternal ? '_blank' : undefined}
                  rel={method.isExternal ? 'noopener noreferrer' : undefined}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#F5F0E8] hover:bg-[#1B1C1A] text-[#1B1C1A] hover:text-white text-xs font-semibold tracking-wide transition-all"
                >
                  <span>{method.actionLabel}</span>
                  {method.isExternal && <ExternalLink className="w-3 h-3" />}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Main Form & Atelier Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EAE5DE] p-6 sm:p-10 shadow-xs">
            <div className="border-b border-[#EAE5DE] pb-6 mb-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
                Direct Inquiry Form
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#1B1C1A] mt-1">
                Send a Message to the Atelier
              </h2>
              <p className="text-xs text-[#7B785F] mt-1 leading-relaxed">
                Whether seeking a bespoke signature fragrance for your home, bulk event favors, or corporate hampers, we respond with care.
              </p>
            </div>

            {submitted ? (
              <div className="bg-[#F5F0E8] rounded-xl p-8 text-center space-y-4 border border-[#EAE5DE]">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl text-[#1B1C1A]">Message Received</h3>
                <p className="text-xs text-[#4A4731] max-w-md mx-auto leading-relaxed">
                  Thank you for writing to <strong>Canflare candles</strong>. Our artisans in Chennai have received your message and will get back to you shortly via WhatsApp or email.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-[#1B1C1A] text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-[#30312E] transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Vijayendran B"
                      className="w-full bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg px-4 py-2.5 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-1 focus:ring-[#FAB507] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg px-4 py-2.5 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-1 focus:ring-[#FAB507] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                      Phone Number (WhatsApp Preferred)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98406 99339"
                      className="w-full bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg px-4 py-2.5 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-1 focus:ring-[#FAB507] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                      Subject / Inquiry Type
                    </label>
                    <select
                      name="inquiryType"
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg px-4 py-2.5 text-xs text-[#1B1C1A] focus:outline-none focus:ring-1 focus:ring-[#FAB507] focus:bg-white transition-all cursor-pointer"
                    >
                      <option value="custom_order">Custom & Bulk Candle Order</option>
                      <option value="gifting">Wedding & Corporate Gifting</option>
                      <option value="scent_consult">Fragrance / Scent Consultation</option>
                      <option value="order_status">Existing Order Status</option>
                      <option value="general">General Atelier Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#4A4731] mb-1.5 font-medium">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements, preferred notes, quantities, or event dates..."
                    className="w-full bg-[#FBF9F5] border border-[#EAE5DE] rounded-lg px-4 py-2.5 text-xs text-[#1B1C1A] placeholder:text-[#7B785F] focus:outline-none focus:ring-1 focus:ring-[#FAB507] focus:bg-white transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-[#1B1C1A] hover:bg-[#30312E] text-white font-semibold text-xs uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Transmit Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Physical Location & Atelier Info */}
          <div className="lg:col-span-5 space-y-6">
            {/* Atelier Studio Card */}
            <div className="bg-[#1B1C1A] text-white rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-lg">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#FAB507] font-semibold">
                  Chennai Atelier Studio
                </span>
                <h3 className="font-serif text-2xl text-white">Canflare Candles</h3>
                <p className="text-xs text-[#D4CFBD] leading-relaxed">
                  Every batch of Canflare candles is hand-wicked, slowly poured, and temperature-cured in our dedicated Chennai sanctuary.
                </p>
              </div>

              {/* Physical Address */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FAB507] shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed">
                    <p className="font-semibold text-white">Canflare Candles</p>
                    <p className="text-[#D4CFBD]">No 6, Varalakshmi Nagar Ext,</p>
                    <p className="text-[#D4CFBD]">1st Street, Kolathur,</p>
                    <p className="text-[#D4CFBD]">Chennai - 600099, Tamil Nadu, India</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#FAB507] shrink-0" />
                  <a
                    href="tel:9840699339"
                    className="text-xs text-[#D4CFBD] hover:text-[#FAB507] transition-colors"
                  >
                    +91 98406 99339
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-[#FAB507] shrink-0" />
                  <a
                    href="mailto:canflare@gmail.com"
                    className="text-xs text-[#D4CFBD] hover:text-[#FAB507] transition-colors"
                  >
                    canflare@gmail.com
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#FAB507] shrink-0" />
                  <span className="text-xs text-[#D4CFBD]">
                    Mon - Sat: 10:00 AM – 7:30 PM IST (Sun by appointment)
                  </span>
                </div>
              </div>

              {/* Google Maps Link */}
              <div className="pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=No+6+Varalakshmi+Nagar+Ext+1st+Street+Kolathur+Chennai+600099"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-lg bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="bg-white rounded-2xl border border-[#EAE5DE] p-6 space-y-4 shadow-xs">
              <h4 className="font-serif text-base text-[#1B1C1A]">Canflare Quality Commitment</h4>
              <ul className="space-y-3 text-xs text-[#4A4731]">
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>100% Botanical Soy &amp; Coconut:</strong> No paraffin, clean soot-free burn.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Safe Delivery Guarantee:</strong> Break-free transit packaging across India.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span><strong>Complimentary Consultations:</strong> Chat directly via WhatsApp for custom scent matching.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
