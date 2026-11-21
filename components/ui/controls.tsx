"use client";
import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from "react";

/* ───── Field: label + input + error, wired for screen readers ───── */
export function Field({ label, error, hint, className = "", ...rest }: { label: string; error?: string; hint?: string } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input" aria-invalid={!!error} aria-describedby={error ? `${id}-e` : hint ? `${id}-h` : undefined} {...rest} />
      {hint && !error && <p id={`${id}-h`} className="mt-1 text-xs text-taupe">{hint}</p>}
      {error && <p id={`${id}-e`} role="alert" className="err">{error}</p>}
    </div>
  );
}

export function SelectField({ label, error, children, className = "", ...rest }: { label: string; error?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className={className}>
      <label className="label" htmlFor={id}>{label}</label>
      <select id={id} className="input" aria-invalid={!!error} {...rest}>{children}</select>
      {error && <p role="alert" className="err">{error}</p>}
    </div>
  );
}

/* ───── Quantity stepper ───── */
export function QtyStepper({ value, onChange, min = 1, max = 50, size = "md", label = "Quantity" }: { value: number; onChange: (n: number) => void; min?: number; max?: number; size?: "sm" | "md"; label?: string }) {
  const b = size === "sm" ? "w-9 h-9" : "w-11 h-11";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-sm border border-line bg-card">
      <button type="button" aria-label="Decrease" className={`${b} text-lg disabled:opacity-40`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <output aria-live="polite" className="w-9 text-center text-sm font-semibold tabular-nums">{value}</output>
      <button type="button" aria-label="Increase" className={`${b} text-lg disabled:opacity-40`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

/* ───── Chip group (single-select, e.g. pack size) ───── */
export function ChipGroup<T extends string>({ label, options, value, onChange }: { label: string; options: { value: T; label: ReactNode }[]; value: T; onChange: (v: T) => void }) {
  return (
    <fieldset>
      <legend className="label !text-[11px] uppercase tracking-[0.18em]">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o.value} type="button" className="chip" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </fieldset>
  );
}

/* ───── Tabs (roving tabindex, arrow keys) ───── */
export function Tabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0].id);
  const base = useId();
  const onKey = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const n = (i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length;
    setActive(tabs[n].id);
    document.getElementById(`${base}-t-${tabs[n].id}`)?.focus();
  };
  return (
    <div>
      <div role="tablist" className="flex gap-1 overflow-x-auto no-scrollbar border-b border-line">
        {tabs.map((t, i) => (
          <button key={t.id} id={`${base}-t-${t.id}`} role="tab" aria-selected={active === t.id} aria-controls={`${base}-p-${t.id}`} tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)} onKeyDown={(e) => onKey(e, i)}
            className={`min-h-11 whitespace-nowrap px-4 text-sm font-semibold border-b-2 -mb-px transition-colors ${active === t.id ? "border-gold-deep text-ink" : "border-transparent text-taupe hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} id={`${base}-p-${t.id}`} role="tabpanel" aria-labelledby={`${base}-t-${t.id}`} hidden={active !== t.id} className="pt-5">{t.content}</div>
      ))}
    </div>
  );
}
