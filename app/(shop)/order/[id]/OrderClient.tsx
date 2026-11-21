"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { business } from "@/config/business";
import { inr } from "@/lib/money";
import { loadOrder, type SavedOrder } from "@/lib/order-client";
import { orderMessage, ownerWaLink } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/primitives";
import CandleArt from "@/components/CandleArt";
import { WhatsAppIcon } from "@/components/Icons";

export default function OrderClient({ id }: { id: string }) {
  const [saved, setSaved] = useState<SavedOrder | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // The order is already with the shop (Google Sheet → owner email + admin panel). WhatsApp is optional.
    setSaved(loadOrder(id) ?? null);
  }, [id]);

  if (saved === undefined) return <div className="container-x py-16 text-center text-taupe" role="status">Loading…</div>;

  if (!saved) {
    return (
      <div className="container-x max-w-xl py-16">
        <EmptyState icon={<CandleArt kind="votive" className="h-10 w-10" />} title={`Order ${id}`} text="The order summary is only stored on the device where the order was placed. To see its progress, use order tracking." action={<Button href="/track">Track order</Button>} />
      </div>
    );
  }

  const { order } = saved;
  const wa = ownerWaLink(orderMessage(order, id));
  const shareText = `I just ordered candles from ${business.name}! 🕯️ ${typeof location !== "undefined" ? location.origin : ""}`;
  const copy = async () => { try { await navigator.clipboard.writeText(id); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* ignore */ } };

  return (
    <>
      {/* animated success moment – dark stage */}
      <section className="stage on-stage relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/20 blur-3xl animate-fade" />
        <div className="container-x relative max-w-2xl py-12 text-center sm:py-16">
          <div className="relative mx-auto h-24 w-24" aria-hidden>
            <span className="absolute inset-0 rounded-full border-2 border-gold/60 [animation:ring_1.1s_var(--ease-emphasized)_both]" />
            <svg viewBox="0 0 96 96" className="relative h-24 w-24">
              <circle cx="48" cy="48" r="40" fill="#fab507" className="animate-pop" />
              <path d="M30 50l13 13 24-28" fill="none" stroke="#3a2a00" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" pathLength="1" strokeDasharray="1" className="[animation:draw_0.6s_0.35s_var(--ease-emphasized)_both]" />
            </svg>
          </div>
          <h1 className="mt-6 text-4xl sm:text-5xl animate-rise">Thank you, {order.name.split(" ")[0]}!</h1>
          <p className="mt-2 text-on-stage-soft animate-rise [animation-delay:80ms]">{saved.queued ? "Your order is saved." : "Your order has been placed – it's with us now."}</p>
          <button onClick={copy} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-gold px-6 py-2 font-semibold tracking-wide text-ink shadow-glow animate-pop [animation-delay:200ms]" aria-label={`Order number ${id}. Tap to copy`}>
            {id} <span className="text-xs font-normal opacity-70">{copied ? "Copied ✓" : "Copy"}</span>
          </button>
          <p className="mt-2 text-xs text-on-stage-soft">Keep this order number – you need it to track your order.</p>
          <p className="mt-6 text-sm text-on-stage-soft">We&apos;ll call or WhatsApp you on <b className="text-on-stage">{order.mobile}</b> to confirm your order and share the payment details.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button href="/track" variant="gold" size="lg">Track this order</Button>
            <Button href="/shop" variant="glass" size="lg">Continue shopping</Button>
          </div>
          {!saved.queued && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-on-stage-soft underline decoration-white/30 underline-offset-4 hover:text-on-stage">
              <WhatsAppIcon className="h-4 w-4 text-[#1faa52]" /> Optional: also send your order on WhatsApp
            </a>
          )}
        </div>
      </section>

      <div className="container-x max-w-3xl py-8">
        {saved.queued && (
          <div className="card p-4" role="status">
            <p className="text-sm text-ink-soft"><b className="text-ink">Our order system is busy right now.</b> Your order is saved on this device and will be sent to us automatically as soon as it&apos;s back. To be safe, please also send it to us on WhatsApp:</p>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-wa btn-lg mt-3 w-full"><WhatsAppIcon /> Send order on WhatsApp</a>
          </div>
        )}

        <section className="card mt-6 p-5">
          <h2 className="mb-3 text-xl">Order summary</h2>
          <ul className="divide-y divide-line text-sm">
            {order.items.map((i) => (
              <li key={i.slug + i.variant} className="flex justify-between gap-3 py-2"><span>{i.name} <span className="text-taupe">({i.variant}) × {i.qty}</span></span><b className="tabular-nums">{inr(i.price * i.qty)}</b></li>
            ))}
          </ul>
          <dl className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd className="tabular-nums">{inr(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-soft">Delivery</dt><dd>{order.delivery === 0 ? <b className="text-ok">FREE</b> : inr(order.delivery)}</dd></div>
            {order.giftWrap > 0 && <div className="flex justify-between"><dt className="text-ink-soft">Gift wrap</dt><dd className="tabular-nums">{inr(order.giftWrap)}</dd></div>}
            <div className="flex justify-between border-t border-line pt-2 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{inr(order.total)}</dd></div>
          </dl>
          <div className="mt-4 text-sm text-ink-soft">
            <p><b className="text-ink">{order.name}</b> · {order.mobile}</p>
            <p>{order.address}, {order.city}, {order.district}, {order.state} - {order.pincode}</p>
            {order.giftMessage && <p>Gift message: {order.giftMessage}</p>}
            {order.note && <p>Note: {order.note}</p>}
          </div>
        </section>

        <section className="card mt-6 p-5">
          <h2 className="mb-3 text-xl">What happens next</h2>
          <ol className="list-decimal space-y-3 pl-5 text-sm text-ink-soft">
            <li>Your order reaches us instantly.</li>
            <li>We call or WhatsApp you to confirm it and share the payment details.</li>
            <li>Once payment is received we pack your candles carefully.</li>
            <li>We ship it and send you the courier and tracking number.</li>
          </ol>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" variant="line">Share with a friend</Button>
            <Button href={`tel:${business.phoneTel}`} variant="ghost">Call {business.phoneDisplay}</Button>
          </div>
        </section>
      </div>
    </>
  );
}
