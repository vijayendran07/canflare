"use client";
import { inr } from "@/lib/money";
import type { Totals } from "@/lib/pricing";

export default function CartSummary({ t, showGift = true }: { t: Totals; showGift?: boolean }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between"><dt className="text-ink-soft">Subtotal</dt><dd>{inr(t.subtotal)}</dd></div>
      <div className="flex justify-between">
        <dt className="text-ink-soft">Delivery</dt>
        <dd>{t.delivery === 0 ? <b className="text-ok">FREE</b> : inr(t.delivery)}</dd>
      </div>
      {showGift && t.giftWrap > 0 && (
        <div className="flex justify-between"><dt className="text-ink-soft">Gift wrap</dt><dd>{inr(t.giftWrap)}</dd></div>
      )}
      <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
        <dt>Total</dt><dd>{inr(t.total)}</dd>
      </div>
    </dl>
  );
}
