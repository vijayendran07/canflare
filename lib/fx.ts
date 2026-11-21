"use client";
import { motionOK } from "@/lib/motion";

/** The visible cart button (header on desktop, bottom nav on phones). */
function cartTarget(): HTMLElement | null {
  const all = Array.from(document.querySelectorAll<HTMLElement>("[data-cart-target]"));
  return all.find((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; }) ?? null;
}

export function bumpCart() {
  const t = cartTarget();
  if (!t || !motionOK()) return;
  t.animate([{ transform: "none" }, { transform: "translateY(-6px) scale(1.12)" }, { transform: "translateY(1px) scale(.98)" }, { transform: "none" }], { duration: 480, easing: "cubic-bezier(.34,1.56,.64,1)" });
}

/**
 * Add-to-cart flourish: a copy of the product image flies into the cart icon, which then bounces.
 * Skipped for reduced-motion / Save-Data users (they just get the toast + badge update).
 */
export function flyToCart(source: Element | null | undefined) {
  const target = cartTarget();
  if (!source || !target || !motionOK() || !("animate" in Element.prototype)) return;
  const s = source.getBoundingClientRect();
  const t = target.getBoundingClientRect();
  if (!s.width || !s.height || s.bottom < 0 || s.top > innerHeight) return;
  const size = Math.min(88, s.width, s.height);
  const ghost = document.createElement("div");
  const style = ghost.style;
  style.cssText = `position:fixed;z-index:200;pointer-events:none;left:${s.left + s.width / 2 - size / 2}px;top:${s.top + s.height / 2 - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;box-shadow:0 8px 30px rgba(250,181,7,.55);background:#f3e7cf;will-change:transform,opacity;`;
  const img = source.querySelector("img");
  if (img) {
    const c = document.createElement("img");
    c.src = (img as HTMLImageElement).currentSrc || (img as HTMLImageElement).src;
    c.alt = "";
    c.style.cssText = "width:100%;height:100%;object-fit:cover";
    ghost.appendChild(c);
  } else {
    ghost.style.background = "radial-gradient(circle at 50% 35%,#fff4d6,#fab507)";
  }
  document.body.appendChild(ghost);
  const dx = t.left + t.width / 2 - (s.left + s.width / 2);
  const dy = t.top + t.height / 2 - (s.top + s.height / 2);
  const a = ghost.animate(
    [
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 60}px) scale(.7)`, opacity: 1, offset: 0.55 },
      { transform: `translate(${dx}px,${dy}px) scale(.12)`, opacity: 0.4 },
    ],
    { duration: 700, easing: "cubic-bezier(.5,0,.2,1)" },
  );
  a.onfinish = () => { ghost.remove(); bumpCart(); };
  a.oncancel = () => ghost.remove();
}
