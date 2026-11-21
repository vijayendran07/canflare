"use client";
import { useRef } from "react";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { motionOK } from "@/lib/motion";

/** Primary CTA that leans a few pixels toward the cursor on desktop (fine pointers only; off for reduced motion). */
export default function MagneticButton({ href, variant = "gold", children, className = "" }: { href: string; variant?: ButtonVariant; children: React.ReactNode; className?: string }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !motionOK() || !wrap.current) return;
    const r = wrap.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    wrap.current.style.transform = `translate(${x}px,${y}px)`;
  };
  const leave = () => { if (wrap.current) wrap.current.style.transform = ""; };
  return (
    <span ref={wrap} onPointerMove={move} onPointerLeave={leave} className="inline-block transition-transform duration-[220ms] ease-spring will-change-transform">
      <Button href={href} variant={variant} size="lg" className={className}>{children}</Button>
    </span>
  );
}
