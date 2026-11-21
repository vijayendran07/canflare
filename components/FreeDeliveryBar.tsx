import { business } from "@/config/business";
import { inr } from "@/lib/money";

export default function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const t = business.freeDeliveryThreshold;
  const left = Math.max(0, t - subtotal);
  const pct = Math.min(100, Math.round((subtotal / t) * 100));
  return (
    <div className="rounded-lg bg-oat p-3">
      <p className="text-sm text-ink">
        {left > 0 ? (
          <>
            Add <b>{inr(left)}</b> more for <b className="text-ok">FREE delivery</b>
          </>
        ) : (
          <b className="text-ok">You have unlocked FREE delivery 🎉</b>
        )}
      </p>
      <div className="mt-2 h-2 rounded-full bg-line overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-gold transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
