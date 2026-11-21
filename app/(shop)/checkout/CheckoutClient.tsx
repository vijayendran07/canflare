"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business } from "@/config/business";
import { STATES } from "@/lib/states";
import { inr } from "@/lib/money";
import { stateForPincode } from "@/lib/pincode";
import { enqueue, saveOrder } from "@/lib/order-client";
import { forgetProfile, loadProfile, saveProfile, type Profile } from "@/lib/profile";
import { track } from "@/lib/analytics";
import type { Order, OrderInput } from "@/lib/order";
import { useCart, useCartReady, useCartTotals } from "@/store/cart";
import CartSummary from "@/components/CartSummary";
import FreeDeliveryBar from "@/components/FreeDeliveryBar";
import { Field, SelectField } from "@/components/ui/controls";
import { EmptyState } from "@/components/ui/primitives";
import { Button } from "@/components/ui/Button";
import CandleArt from "@/components/CandleArt";

type F = {
  name: string; mobile: string; whatsapp: string; same: boolean; line1: string; area: string; city: string;
  state: string; district: string; pincode: string; landmark: string; giftWrap: boolean; giftMessage: string; note: string; remember: boolean;
};
const empty: F = { name: "", mobile: "", whatsapp: "", same: true, line1: "", area: "", city: "", state: "", district: "", pincode: "", landmark: "", giftWrap: false, giftMessage: "", note: "", remember: false };

const STEPS = ["Contact", "Delivery", "Confirm"] as const;
const FIELDS_BY_STEP: (keyof F)[][] = [["mobile", "name", "whatsapp"], ["pincode", "state", "line1", "area", "city", "district"], []];

function validate(f: F, step: number): Record<string, string> {
  const e: Record<string, string> = {};
  if (step === 0) {
    if (!/^\d{10}$/.test(f.mobile)) e.mobile = "Enter a 10-digit mobile number";
    if (f.name.trim().length < 2) e.name = "Enter your name";
    if (!f.same && !/^\d{10}$/.test(f.whatsapp)) e.whatsapp = "Enter a 10-digit WhatsApp number";
  }
  if (step === 1) {
    if (!business.pincodePattern.test(f.pincode)) e.pincode = "Enter a valid 6-digit pincode";
    if (!f.state) e.state = "Choose your state";
    if (f.line1.trim().length < 3) e.line1 = "Enter house no. / street";
    if (f.area.trim().length < 2) e.area = "Enter your area";
    if (f.city.trim().length < 2) e.city = "Enter your city";
    if (f.district.trim().length < 2) e.district = "Enter your district";
  }
  return e;
}

export default function CheckoutClient() {
  const router = useRouter();
  const ready = useCartReady();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const sync = useCart((s) => s.sync);
  const [f, setF] = useState<F>(empty);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState("");
  const [welcome, setWelcome] = useState("");
  const [autoState, setAutoState] = useState(false);
  const tracked = useRef(false);
  const t = useCartTotals({ giftWrap: f.giftWrap });

  // returning customer (only if they opted in earlier)
  useEffect(() => {
    const p = loadProfile();
    if (!p) return;
    setF((x) => ({ ...x, name: p.name, mobile: p.mobile, whatsapp: p.whatsapp, same: p.sameWhatsapp, line1: p.line1, area: p.area, city: p.city, state: p.state, district: p.district, pincode: p.pincode, landmark: p.landmark, remember: true }));
    setWelcome(p.name.split(" ")[0]);
  }, []);

  useEffect(() => {
    if (ready && items.length && !tracked.current) {
      tracked.current = true;
      track("begin_checkout", { value: t.total, items: items.map((i) => ({ item_id: i.slug, item_name: i.name, item_variant: i.variant, price: i.price, quantity: i.qty })) });
    }
  }, [ready, items, t.total]);

  const set = <K extends keyof F>(k: K, v: F[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((e) => { if (!e[k as string]) return e; const n = { ...e }; delete n[k as string]; return n; });
  };
  const digits = (k: "mobile" | "whatsapp" | "pincode") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "");
    set(k, v);
    if (k === "pincode" && v.length === 6) {
      const s = stateForPincode(v);
      if (s && (!f.state || autoState)) { set("state", s); setAutoState(true); }
    }
  };

  if (!ready) return <div className="container-x max-w-xl py-16" role="status" aria-label="Loading"><div className="skeleton h-[22rem] rounded-lg" /></div>;
  if (items.length === 0) {
    return (
      <div className="container-x max-w-xl py-16 min-h-[22rem]">
        <EmptyState icon={<CandleArt kind="jar" className="h-10 w-10" />} title="Your cart is empty" text="Add a candle or two and come back here to check out." action={<Button href="/shop">Shop candles</Button>} />
      </div>
    );
  }

  const focusFirst = (e: Record<string, string>) => {
    const first = FIELDS_BY_STEP[step].find((k) => e[k]);
    if (first) (document.querySelector(`[name="${first}"]`) as HTMLElement | null)?.focus();
  };

  const next = () => {
    const e = validate(f, step);
    setErrors(e);
    if (Object.keys(e).length) return focusFirst(e);
    setStep((s) => Math.min(2, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => { setStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const place = async () => {
    // belt and braces: re-validate everything
    for (const s of [0, 1]) {
      const e = validate(f, s);
      if (Object.keys(e).length) { setErrors(e); setStep(s); return; }
    }
    setBusy(true);
    setServerError("");
    const input: OrderInput = {
      items: items.map((i) => ({ slug: i.slug, variant: i.variant, qty: i.qty, price: i.price })),
      customer: { name: f.name.trim(), mobile: f.mobile, whatsapp: f.same ? f.mobile : f.whatsapp },
      address: { line1: f.line1.trim(), area: f.area.trim(), city: f.city.trim(), state: f.state as OrderInput["address"]["state"], district: f.district.trim(), pincode: f.pincode, landmark: f.landmark.trim() },
      giftWrap: f.giftWrap,
      giftMessage: f.giftWrap ? f.giftMessage.trim() : "",
      note: f.note.trim(),
      total: t.total,
    };
    try {
      const res = await fetch("/api/order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data.error === "price-mismatch" || data.error === "out-of-stock" || data.error?.startsWith("unknown")) {
          try {
            const c = await (await fetch("/api/catalog")).json();
            sync(c.products.filter((p: { inStock: boolean }) => p.inStock).flatMap((p: { slug: string; variants: { label: string; price: number }[] }) => p.variants.map((v) => ({ slug: p.slug, variant: v.label, price: v.price }))));
          } catch { /* ignore */ }
        }
        setServerError(data.message || "Could not place the order. Please try again.");
        setBusy(false);
        return;
      }
      const order: Order = data.order;
      const id: string = data.id;
      if (data.queued) enqueue(id, input); // sheet unreachable: keep it safe and retry in the background
      saveOrder({ id, order, queued: !!data.queued, at: new Date().toISOString() });
      if (f.remember) {
        const prev = loadProfile();
        const p: Profile = { name: f.name.trim(), mobile: f.mobile, whatsapp: f.same ? f.mobile : f.whatsapp, sameWhatsapp: f.same, line1: f.line1.trim(), area: f.area.trim(), city: f.city.trim(), state: f.state, district: f.district.trim(), pincode: f.pincode, landmark: f.landmark.trim(), variants: prev?.variants ?? {} };
        saveProfile(p);
      } else forgetProfile();
      track("purchase", { transaction_id: id, value: order.total, items: order.items.map((i) => ({ item_id: i.slug, item_name: i.name, item_variant: i.variant, price: i.price, quantity: i.qty })) });
      clear();
      router.push(`/order/${encodeURIComponent(id)}`); // order is already with the shop (email + admin); WhatsApp is optional
    } catch {
      setServerError("Network problem. Check your connection and try again.");
      setBusy(false);
    }
  };

  const errList = Object.entries(errors);
  const primary = step < 2 ? { label: "Continue", onClick: next } : { label: busy ? "Placing order…" : "Place order", onClick: place };

  return (
    <div className="section-bg bg-glow"><div className="container-x py-6 sm:py-10 pb-28 lg:pb-10">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>

      <ol className="mt-5 grid grid-cols-3 gap-2" aria-label="Checkout steps">
        {STEPS.map((s, i) => (
          <li key={s} aria-current={i === step ? "step" : undefined}>
            <button type="button" disabled={i > step} onClick={() => i < step && setStep(i)} className={`w-full rounded-xl border px-3 py-2.5 text-left transition-colors duration-[220ms] ${i === step ? "border-gold bg-gold text-[#3a2a00] shadow-glow" : i < step ? "border-line bg-card" : "border-line bg-oat text-taupe"}`}>
              <span className="block text-[11px] font-bold uppercase tracking-widest opacity-80">Step {i + 1}</span>
              <span className="block text-sm font-semibold">{i < step ? "✓ " : ""}{s}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* order summary – collapsible on phones, sticky column on desktop */}
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <details className="card mb-5 p-4 lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">Order summary ({t.itemCount}) <span>{inr(t.total)}</span></summary>
            <div className="mt-3 space-y-3"><SummaryList /><CartSummary t={t} /></div>
          </details>

          {welcome && step === 0 && (
            <p className="mb-4 rounded-xl bg-oat p-3 text-sm">Welcome back, <b>{welcome}</b> – we filled in your saved details. <button className="underline" onClick={() => { forgetProfile(); setF(empty); setWelcome(""); }}>Not you?</button></p>
          )}
          {errList.length > 1 && (
            <div role="alert" className="mb-4 rounded-xl border border-danger/40 bg-red-50 p-3 text-sm text-danger">
              <b>Please fix {errList.length} things:</b>
              <ul className="mt-1 list-disc pl-5">{errList.map(([k, m]) => <li key={k}>{m}</li>)}</ul>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); primary.onClick(); }} noValidate className="space-y-5">
            {step === 0 && (
              <section className="card space-y-4 p-5" aria-labelledby="s1">
                <h2 id="s1" className="text-xl">Contact</h2>
                <Field label="Mobile number" name="mobile" inputMode="numeric" autoComplete="tel-national" maxLength={10} placeholder="10-digit number" value={f.mobile} onChange={digits("mobile")} error={errors.mobile} autoFocus />
                <Field label="Full name" name="name" autoComplete="name" value={f.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
                <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#7b5800]" checked={f.same} onChange={(e) => set("same", e.target.checked)} /> WhatsApp number is the same as mobile</label>
                {!f.same && <Field label="WhatsApp number" name="whatsapp" inputMode="numeric" maxLength={10} value={f.whatsapp} onChange={digits("whatsapp")} error={errors.whatsapp} />}
              </section>
            )}

            {step === 1 && (
              <section className="card space-y-4 p-5" aria-labelledby="s2">
                <h2 id="s2" className="text-xl">Delivery address</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Pincode" name="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={f.pincode} onChange={digits("pincode")} error={errors.pincode} hint="We'll suggest your state from the pincode" autoFocus />
                  <div>
                    <SelectField label="State / UT" name="state" autoComplete="address-level1" value={f.state} onChange={(e) => { set("state", e.target.value); setAutoState(false); }} error={errors.state}>
                      <option value="">Select state</option>
                      {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </SelectField>
                    {autoState && f.state && <p className="mt-1 text-xs text-ok">Filled from your pincode – change it if it&apos;s wrong.</p>}
                  </div>
                </div>
                <Field label="House no. / street" name="line1" autoComplete="address-line1" value={f.line1} onChange={(e) => set("line1", e.target.value)} error={errors.line1} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Area / locality" name="area" autoComplete="address-line2" value={f.area} onChange={(e) => set("area", e.target.value)} error={errors.area} />
                  <Field label="City" name="city" autoComplete="address-level2" value={f.city} onChange={(e) => set("city", e.target.value)} error={errors.city} />
                  <Field label="District" name="district" value={f.district} onChange={(e) => set("district", e.target.value)} error={errors.district} />
                  <Field label="Landmark (optional)" name="landmark" value={f.landmark} onChange={(e) => set("landmark", e.target.value)} />
                </div>
              </section>
            )}

            {step === 2 && (
              <>
                <section className="card space-y-4 p-5" aria-labelledby="s3">
                  <h2 id="s3" className="text-xl">Almost done</h2>
                  <label className="flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" className="h-5 w-5 accent-[#7b5800]" checked={f.giftWrap} onChange={(e) => set("giftWrap", e.target.checked)} /> Gift wrap (+{inr(business.giftWrapPrice)})</label>
                  {f.giftWrap && <div><label className="label" htmlFor="gm">Gift message</label><textarea id="gm" className="input" rows={2} maxLength={240} value={f.giftMessage} onChange={(e) => set("giftMessage", e.target.value)} /></div>}
                  <div><label className="label" htmlFor="nt">Note to us (optional)</label><textarea id="nt" className="input" rows={2} maxLength={400} value={f.note} onChange={(e) => set("note", e.target.value)} /></div>
                  <div className="rounded-xl bg-oat p-3 text-sm">
                    <p className="font-semibold">Delivering to</p>
                    <p className="text-ink-soft">{f.name} · {f.mobile}<br />{f.line1}, {f.area}, {f.city}, {f.district}, {f.state} - {f.pincode}</p>
                    <button type="button" className="mt-1 text-xs underline" onClick={() => setStep(1)}>Edit address</button>
                  </div>
                  <label className="flex items-start gap-3 text-sm"><input type="checkbox" className="mt-0.5 h-5 w-5 accent-[#7b5800]" checked={f.remember} onChange={(e) => set("remember", e.target.checked)} /> <span>Remember my details and size choices on this device for faster checkout next time. <span className="text-taupe">(Stays on your phone; untick to forget.)</span></span></label>
                </section>
                <div className="rounded-2xl border border-line bg-card p-4 text-sm text-ink-soft">
                  <b className="text-ink">How it works:</b> tap <b>Place order</b> – your order comes straight to us. We&apos;ll call or WhatsApp you to confirm it and share the payment details. <b>No payment is taken on this website.</b>
                </div>
              </>
            )}

            {serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-danger">{serverError} {serverError.includes("Prices") && <Link href="/cart" className="underline">Review cart</Link>}</p>}

            <div className="hidden items-center gap-3 lg:flex">
              {step > 0 && <Button type="button" variant="line" size="lg" onClick={back}>Back</Button>}
              <Button type="submit" size="lg" variant={step === 2 ? "gold" : "dark"} className="flex-1" disabled={busy}>{primary.label}</Button>
            </div>
          </form>
        </div>

        <aside className="hidden h-fit space-y-4 lg:sticky lg:top-32 lg:block">
          <div className="card space-y-4 p-5">
            <h2 className="text-xl">Order summary</h2>
            <SummaryList />
            <FreeDeliveryBar subtotal={t.subtotal} />
            <CartSummary t={t} />
          </div>
          <p className="text-center text-xs text-taupe">No surprise costs – delivery and gift wrap are already included above.</p>
        </aside>
      </div>

      {/* phones: sticky action bar */}
      <div className="no-print glass safe-bottom fixed inset-x-0 bottom-0 z-40 border-x-0 border-b-0 px-3 pt-2 lg:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-2">
          {step > 0 && <button type="button" onClick={back} className="btn btn-line">Back</button>}
          <div className="min-w-0 flex-1 leading-tight"><p className="text-[11px] text-taupe">Total</p><p className="text-lg font-semibold tabular-nums">{inr(t.total)}</p></div>
          <button type="button" onClick={primary.onClick} disabled={busy} className={`btn btn-lg ${step === 2 ? "btn-gold" : "btn-dark"} min-w-[10rem]`}>{step === 2 ? (busy ? "Placing…" : "Place order") : "Continue"}</button>
        </div>
      </div>
    </div></div>
  );

  function SummaryList() {
    return (
      <ul className="divide-y divide-line text-sm">
        {items.map((i) => (
          <li key={i.slug + i.variant} className="flex justify-between gap-3 py-2">
            <span>{i.name} <span className="text-taupe">({i.variant}) × {i.qty}</span></span>
            <span className="font-medium tabular-nums">{inr(i.price * i.qty)}</span>
          </li>
        ))}
      </ul>
    );
  }
}
