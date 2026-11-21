import Link from "next/link";
import Image from "next/image";
import { business } from "@/config/business";
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "./Icons";
import { ownerWaLink } from "@/lib/whatsapp";

const policies = [
  { href: "/shipping", label: "Shipping" },
  { href: "/refund", label: "Refund & Cancellation" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  const a = business.address;
  return (
    <footer id="site-footer" className="bg-oat border-t border-line mt-16 pb-20 md:pb-0">
      <div className="container-x py-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <Image src="/logo-light.png" alt="Canflare" width={148} height={52} className="h-10 w-auto" />
          <p className="mt-3 text-sm text-ink-soft">{business.tagline}.</p>
          <div className="mt-4 flex gap-2">
            <a href={ownerWaLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 rounded-full bg-card border border-line grid place-items-center text-[#25d366] hover:bg-[#25d366] hover:text-white transition-colors"><WhatsAppIcon /></a>
            <a href={business.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-card border border-line grid place-items-center text-[#e4405f] hover:bg-[#e4405f] hover:text-white transition-colors"><InstagramIcon /></a>
          </div>
        </div>
        <div>
          <h2 className="font-serif text-lg mb-3">Shop</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            <li><Link href="/shop" className="hover:text-ink">All candles</Link></li>
            <li><Link href="/category/return-gift-pillars" className="hover:text-ink">Return gift pillars</Link></li>
            <li><Link href="/category/votive-candles" className="hover:text-ink">Votive candles</Link></li>
            <li><Link href="/category/pillar-candles" className="hover:text-ink">Pillar candles</Link></li>
            <li><Link href="/track" className="hover:text-ink">Track your order</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-serif text-lg mb-3">Policies</h2>
          <ul className="space-y-2 text-sm text-ink-soft">
            {policies.map((p) => (
              <li key={p.href}><Link href={p.href} className="hover:text-ink">{p.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-1">
          <h2 className="font-serif text-lg mb-3">Contact</h2>
          <ul className="space-y-3 text-sm text-ink-soft">
            <li className="flex gap-2"><PhoneIcon className="w-4 h-4 mt-0.5 shrink-0 text-gold-deep" /><a href={`tel:${business.phoneTel}`}>{business.phoneDisplay}</a></li>
            <li className="flex gap-2"><MailIcon className="w-4 h-4 mt-0.5 shrink-0 text-gold-deep" /><a href={`mailto:${business.email}`} className="break-all">{business.email}</a></li>
            <li className="flex gap-2"><InstagramIcon className="w-4 h-4 mt-0.5 shrink-0 text-gold-deep" /><a href={business.instagramUrl} target="_blank" rel="noopener noreferrer">{business.instagramHandle}</a></li>
            <li className="flex gap-2">
              <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-gold-deep" />
              <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer">
                {a.line1}, {a.area}, {a.city} {a.pincode}, {a.state} <span className="underline">(Open in Maps)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x py-4 text-center text-xs text-taupe">
          <p>© {new Date().getFullYear()} {business.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
