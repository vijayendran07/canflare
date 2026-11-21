"use client";
import { useState } from "react";
import { business } from "@/config/business";
import { deliveryEstimate } from "@/lib/pincode";
import { inr } from "@/lib/money";
import { TruckIcon } from "@/components/Icons";

/** Delivery estimate by pincode (all India pincodes are served; charges and timings come from config/business.ts). */
export default function DeliveryEstimate({ subtotal }: { subtotal: number }) {
  const [pin, setPin] = useState("");
  const [checked, setChecked] = useState("");
  const result = checked ? deliveryEstimate(checked, subtotal) : null;
  const invalid = checked && !result;

  return (
    <section aria-labelledby="deliv" className="rounded-2xl border border-line bg-card p-4">
      <h2 id="deliv" className="flex items-center gap-2 text-base font-sans font-semibold"><TruckIcon className="h-5 w-5 text-gold-deep" /> Check delivery</h2>
      <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); setChecked(pin); }}>
        <label className="min-w-0 flex-1">
          <span className="sr-only">Pincode</span>
          <input className="input" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="Enter 6-digit pincode" value={pin} aria-invalid={!!invalid} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setChecked(""); }} />
        </label>
        <button className="btn btn-dark" disabled={pin.length !== 6}>Check</button>
      </form>
      <div aria-live="polite" className="mt-3 text-sm">
        {invalid && <p className="text-danger">Please enter a valid 6-digit pincode.</p>}
        {result && (
          <ul className="space-y-1 text-ink-soft">
            <li><b className="text-ok">We deliver to {checked}</b>{result.state ? ` (${result.state})` : ""}.</li>
            <li>Delivery: {result.free ? <b className="text-ok">FREE</b> : <b>{inr(result.charge)}</b>}{!result.free && ` · free on orders of ${inr(business.freeDeliveryThreshold)}+`}</li>
            <li>Dispatch in {result.dispatch} working days, delivered {result.transit} days after dispatch.</li>
          </ul>
        )}
        {!checked && <p className="text-taupe">We deliver to every pincode in India.</p>}
      </div>
    </section>
  );
}
