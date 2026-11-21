import { business } from "@/config/business";
import { InstagramIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/Icons";
import { ownerWaLink } from "@/lib/whatsapp";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ title: "Contact Canflare – WhatsApp, Phone, Chennai", description: "Contact Canflare on WhatsApp, phone, email or Instagram. Visit us in Kolathur, Chennai.", path: "/contact" });

export default function Contact() {
  const a = business.address;
  const cards = [
    { icon: <WhatsAppIcon className="w-6 h-6 text-[#25d366]" />, title: "WhatsApp", text: business.phoneDisplay, href: ownerWaLink(`Hi ${business.name}!`) },
    { icon: <PhoneIcon className="w-6 h-6 text-gold-deep" />, title: "Call us", text: business.phoneDisplay, href: `tel:${business.phoneTel}` },
    { icon: <InstagramIcon className="w-6 h-6 text-[#e4405f]" />, title: "Instagram", text: business.instagramHandle, href: business.instagramUrl },
    { icon: <MailIcon className="w-6 h-6 text-gold-deep" />, title: "Email", text: business.email, href: `mailto:${business.email}` },
  ];
  return (
    <div className="section-bg bg-corners">
    <div className="container-x py-10 max-w-4xl">
      <h1 className="text-3xl sm:text-4xl">Contact us</h1>
      <p className="mt-2 text-ink-soft">Orders, bulk enquiries, custom candles – we reply fastest on WhatsApp.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <a key={c.title} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="card p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <span className="w-12 h-12 rounded-full bg-oat grid place-items-center shrink-0">{c.icon}</span>
            <span className="min-w-0"><b className="block">{c.title}</b><span className="text-sm text-ink-soft break-all">{c.text}</span></span>
          </a>
        ))}
      </div>
      <a href={business.mapsUrl} target="_blank" rel="noopener noreferrer" className="card mt-4 p-5 flex gap-4 items-start hover:shadow-md transition-shadow">
        <span className="w-12 h-12 rounded-full bg-oat grid place-items-center shrink-0"><MapPinIcon className="w-6 h-6 text-gold-deep" /></span>
        <span>
          <b className="block">Our location</b>
          <span className="text-sm text-ink-soft">{business.legalName}<br />{a.line1}, {a.area}<br />{a.city} {a.pincode}, {a.state}</span>
          <span className="block mt-2 text-sm underline text-gold-deep">Open in Google Maps</span>
        </span>
      </a>
    </div>
    </div>
  );
}
