"use client";
import type { Status } from "@/lib/admin-types";

export const statusStyle: Record<Status, string> = {
  New: "bg-amber-100 text-amber-900",
  Confirmed: "bg-blue-100 text-blue-900",
  Packed: "bg-purple-100 text-purple-900",
  Shipped: "bg-cyan-100 text-cyan-900",
  Delivered: "bg-green-100 text-green-900",
  Cancelled: "bg-red-100 text-red-900",
};

export const StatusBadge = ({ s }: { s: Status }) => (
  <span className={`inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[s] ?? "bg-oat"}`}>{s}</span>
);

export const Panel = ({ title, children, right }: { title?: string; children: React.ReactNode; right?: React.ReactNode }) => (
  <section className="card p-4 md:p-5">
    {(title || right) && (
      <div className="flex items-center justify-between mb-3">
        {title && <h2 className="font-serif text-lg">{title}</h2>}
        {right}
      </div>
    )}
    {children}
  </section>
);

export const when = (d: string) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
