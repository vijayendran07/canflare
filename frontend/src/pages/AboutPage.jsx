import React from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Leaf,
  Sparkles,
  ShieldCheck,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import canflareLogo from '../assets/canflare-logo.jpg';

export default function AboutPage() {
  const pillars = [
    {
      title: '100% Botanical Wax Sanctuary',
      subtitle: 'Pure Soy & Coconut Formulation',
      description:
        'We vehemently refuse petroleum-derived paraffin wax. Every Canflare candle is poured exclusively from biodegradable botanical soy and coconut wax, delivering a clean, non-toxic, and soot-free flame.',
      icon: <Leaf className="w-6 h-6 text-emerald-700" />,
      badge: 'Zero Paraffin',
    },
    {
      title: 'IFRA-Certified Olfactory Blends',
      subtitle: 'Rare Essential Oils & Aromatics',
      description:
        'Our fragrance formulas are crafted in harmony with IFRA safety standards, combining ethically harvested botanical absolutes, wild resins, and therapeutic essences that gently elevate your mental sanctuary.',
      icon: <Sparkles className="w-6 h-6 text-[#FAB507]" />,
      badge: 'Non-Toxic',
    },
    {
      title: '14-Day Climate Cured',
      subtitle: 'Slow Batch Maturation',
      description:
        'A truly magnificent candle cannot be rushed. Each small batch rests for a minimum of 14 days in our Chennai curing chamber, allowing the essential oils to bond seamlessly into the wax for an unmatched scent throw.',
      icon: <Clock className="w-6 h-6 text-[#7B5800]" />,
      badge: 'Small-Batch',
    },
    {
      title: 'Heirloom Reusable Vessels',
      subtitle: 'Ribbed Ceramics & Amber Glass',
      description:
        'Designed to transcend their burn life, our heavy amber glass and ceramic vessels are meant to be repurposed as planters, brush holders, or keepsake canisters once the wax has lived its journey.',
      icon: <Heart className="w-6 h-6 text-[#BA1A1A]" />,
      badge: 'Eco-Luxe',
    },
  ];

  const craftSteps = [
    {
      step: '01',
      title: 'Olfactory Formulation',
      description: 'Balancing contemplative base notes of Indian sandalwood, amber, and cedar with delicate floral hearts.',
    },
    {
      step: '02',
      title: 'Hand-Wicking & Pouring',
      description: 'Centering lead-free braided cotton and crackling FSC wood wicks, poured at strictly monitored micro-temperatures.',
    },
    {
      step: '03',
      title: 'Sanctuary Curing',
      description: 'Allowing the botanical wax crystals to stabilize over 14 days in our Chennai studio for deep cold and hot scent dispersion.',
    },
    {
      step: '04',
      title: 'Final Flame Inspection',
      description: 'Individual hand-buffing, flame test sampling, and sealing with the Canflare quality batch hallmark.',
    },
  ];

  return (
    <div className="w-full bg-[#FBF9F5] text-[#1B1C1A] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative bg-[#1B1C1A] text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAB507_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-3 bg-black/60 rounded-full px-5 py-2 border border-white/10 mx-auto">
            <img
              src={canflareLogo}
              alt="Canflare Logo"
              className="h-7 w-auto object-contain"
            />
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-tight">
            Let there be Light
          </h1>

          <p className="text-sm sm:text-lg text-[#D4CFBD] max-w-2xl mx-auto leading-relaxed font-light">
            Born in Chennai, India, <strong>Canflare candles</strong> are artisan aromatics poured slowly with plant-based botanical waxes, rare oils, and lead-free cotton wicks for mindful living sanctuaries.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs font-semibold uppercase tracking-wider">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-[#FAB507] hover:bg-[#e0a205] text-[#1B1C1A] rounded-full transition-all shadow-md active:scale-95"
            >
              Explore All Candles
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full transition-all active:scale-95"
            >
              Contact Our Atelier
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Brand Story / The Atelier Heritage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
                Our Origin &amp; Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A] leading-tight">
                Slow Living, Rooted in Natural Light &amp; Purity
              </h2>
            </div>

            <p className="text-sm text-[#4A4731] leading-relaxed">
              In a world hurried by synthetic shortcuts and mass manufacturing, <strong>Canflare candles</strong> was created to honor the timeless ritual of a contemplative flame. We believe lighting a candle is not merely about fragrance—it is an intentional pause, an invitation to quiet the mind and reclaim stillness in your space.
            </p>

            <p className="text-sm text-[#4A4731] leading-relaxed">
              Every single candle is envisioned, formulated, and hand-poured in our Kolathur, Chennai studio. We source renewable soy and coconut waxes directly from farmers, pairing them with phthalate-free fragrance oils and essential absolutes that smell evocative, never artificial or headache-inducing.
            </p>

            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-[#EAE5DE] text-center">
              <div>
                <p className="font-serif text-2xl font-bold text-[#1B1C1A]">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7B785F] mt-0.5">Botanical Wax</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1B1C1A]">55+ Hrs</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7B785F] mt-0.5">Clean Burn Time</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1B1C1A]">0%</p>
                <p className="text-[10px] uppercase tracking-wider text-[#7B785F] mt-0.5">Paraffin &amp; Toxins</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-[#EAE5DE]">
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80"
                alt="Artisan Candle Making at Canflare Atelier"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl border border-[#EAE5DE] shadow-lg max-w-xs hidden sm:block">
              <p className="font-serif text-sm font-semibold text-[#1B1C1A]">
                Hand-Poured in Chennai
              </p>
              <p className="text-[11px] text-[#7B785F] mt-1 leading-snug">
                Small-batch wicking &amp; natural curing for maximum aroma diffusion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Four Pillars */}
      <section className="bg-[#F5F0E8] py-20 border-y border-[#EAE5DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
              The Canflare Standard
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A]">
              Crafted Without Compromise
            </h2>
            <p className="text-xs text-[#7B785F]">
              What we put into our candles matters just as much as what we leave out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-[#EAE5DE] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-lg bg-[#F5F0E8] flex items-center justify-center">
                      {pillar.icon}
                    </div>
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#FBF9F5] text-[#1B1C1A] border border-[#EAE5DE]">
                      {pillar.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-serif text-base font-semibold text-[#1B1C1A]">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] text-[#7B5800] font-medium mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-[#4A4731] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The 4-Step Slow Craft Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#7B5800] font-semibold">
            From Wax to Warmth
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1B1C1A]">
            The Artisanal Pouring Ritual
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {craftSteps.map((c, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-xl bg-white border border-[#EAE5DE] shadow-xs space-y-3"
            >
              <span className="font-serif text-3xl font-bold text-[#FAB507]/40 block">
                {c.step}
              </span>
              <h3 className="font-serif text-lg text-[#1B1C1A] font-semibold">
                {c.title}
              </h3>
              <p className="text-xs text-[#4A4731] leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Connect & Visit Studio Section */}
      <section className="bg-[#1B1C1A] text-white py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#FAB507] font-semibold">
              Direct Contact &amp; Community
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white">
              Connect With the Canflare Family
            </h2>
            <p className="text-xs sm:text-sm text-[#D4CFBD] max-w-xl mx-auto leading-relaxed">
              We welcome custom wedding orders, bulk corporate gifting, and bespoke fragrance inquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            {/* Address */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#FAB507]">
                <MapPin className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Atelier Studio</span>
              </div>
              <p className="text-xs text-[#D4CFBD] leading-relaxed">
                Canflare Candles<br />
                No 6, Varalakshmi Nagar Ext,<br />
                1st Street, Kolathur,<br />
                Chennai 600099, Tamil Nadu
              </p>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#FAB507]">
                <Phone className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Phone &amp; WhatsApp</span>
              </div>
              <p className="text-xs text-[#D4CFBD]">
                Call: <a href="tel:9840699339" className="hover:text-white transition-colors underline">+91 98406 99339</a>
              </p>
              <p className="text-xs text-[#D4CFBD]">
                WhatsApp: <a href="https://wa.me/message/NTBONRJVIW56I1" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366] transition-colors underline">Chat Direct</a>
              </p>
            </div>

            {/* Email & Instagram */}
            <div className="p-5 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-[#FAB507]">
                <Mail className="w-4 h-4" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Online &amp; Social</span>
              </div>
              <p className="text-xs text-[#D4CFBD]">
                Email: <a href="mailto:canflare@gmail.com" className="hover:text-white transition-colors underline">canflare@gmail.com</a>
              </p>
              <p className="text-xs text-[#D4CFBD]">
                Instagram: <a href="https://www.instagram.com/canflare?utm_source=qr&srtk=bHdnNGRvdDd6NGZm" target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] transition-colors underline">@canflare</a>
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://wa.me/message/NTBONRJVIW56I1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Us on WhatsApp</span>
            </a>
            <a
              href="https://www.instagram.com/canflare?utm_source=qr&srtk=bHdnNGRvdDd6NGZm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E4405F] hover:bg-[#d62e4e] text-white px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
            >
              <span>Follow @canflare on Instagram</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
