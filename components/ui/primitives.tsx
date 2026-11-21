import Link from "next/link";
import type { ReactNode } from "react";
import { inr } from "@/lib/money";

/* ───── Badge ───── */
export function Badge({ tone = "gold", children }: { tone?: "gold" | "dark" | "ok" | "warn" | "danger"; children: ReactNode }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

/* ───── Price (whole rupees, Indian grouping) ───── */
export function Price({ value, from, size = "md", className = "" }: { value: number; from?: boolean; size?: "sm" | "md" | "lg"; className?: string }) {
  const s = size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <span className={`font-semibold tabular-nums ${s} ${className}`}>
      {from && <span className="text-xs font-normal text-taupe mr-1">From</span>}
      {inr(value)}
    </span>
  );
}

/* ───── Rating – REAL DATA ONLY. Renders nothing unless there are real reviews. ───── */
export function Rating({ average, count }: { average?: number | null; count?: number | null }) {
  if (!average || !count || count < 1) return null;
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rated ${average.toFixed(1)} out of 5 from ${count} reviews`}>
      <span className="text-gold-deep" aria-hidden>★</span>
      <b>{average.toFixed(1)}</b>
      <span className="text-taupe">({count})</span>
    </span>
  );
}

/* ───── Skeleton ───── */
export const Skeleton = ({ className = "" }: { className?: string }) => <div aria-hidden className={`skeleton ${className}`} />;

/* ───── Empty / error state ───── */
export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="card px-6 py-12 text-center">
      {icon && <div className="mx-auto mb-4 grid w-16 h-16 place-items-center rounded-full bg-oat text-gold-deep">{icon}</div>}
      <h2 className="text-2xl">{title}</h2>
      {text && <p className="mt-2 text-ink-soft max-w-md mx-auto">{text}</p>}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

/* ───── Breadcrumb ───── */
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-taupe">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? <Link href={it.href} className="hover:text-ink hover:underline">{it.label}</Link> : <span aria-current="page" className="text-ink-soft">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ───── Accordion (native <details>: zero JS, accessible) ───── */
export function Accordion({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="divide-y divide-line rounded-lg border border-line bg-card px-5">
      {items.map((it) => (
        <details key={it.q} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {it.q}
            <span aria-hidden className="text-gold-deep text-xl leading-none transition-transform duration-[220ms] group-open:rotate-45">+</span>
          </summary>
          <div className="mt-2 text-ink-soft">{it.a}</div>
        </details>
      ))}
    </div>
  );
}
