"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAdmin } from "./AdminProvider";
import { business } from "@/config/business";

const nav = [
  { path: "", label: "Dashboard", icon: "▦" },
  { path: "/orders", label: "Orders", icon: "☰" },
  { path: "/orders/new", label: "New order", icon: "＋" },
  { path: "/products", label: "Products", icon: "❖" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { base, fresh, dismissFresh, lastSync, error, refresh, alertsOn, enableAlerts } = useAdmin();
  const pathname = usePathname();
  const rel = pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  const active = (p: string) => (p === "" ? rel === "" || rel === "/" : p === "/orders" ? rel === "/orders" || (rel.startsWith("/orders/") && rel !== "/orders/new") : rel.startsWith(p));
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const href = (p: string) => (base + p || "/");

  const logout = async () => { await fetch("/api/admin/logout", { method: "POST" }); location.href = base || "/"; };

  return (
    <div className="min-h-screen md:flex bg-oat">
      <aside className="no-print hidden md:flex w-60 shrink-0 flex-col bg-black text-white sticky top-0 h-screen">
        <div className="p-5 border-b border-white/10"><Image src="/logo-transparent.png" alt="Canflare" width={148} height={52} className="h-10 w-auto" /><p className="mt-2 text-[11px] tracking-widest text-gold uppercase">Admin</p></div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((n) => (
            <Link key={n.path} href={href(n.path)} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${active(n.path) ? "bg-gold text-ink font-semibold" : "text-white/80 hover:bg-white/10"}`}>
              <span className="w-5 text-center">{n.icon}</span>{n.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 text-sm space-y-1">
          <a href="/" target="_blank" className="block px-3 py-2 text-white/70 hover:text-white" onClick={(e) => { if (base === "/admin") return; e.preventDefault(); window.open(process.env.NEXT_PUBLIC_SITE_URL || "/", "_blank"); }}>View shop ↗</a>
          <button onClick={logout} className="w-full text-left px-3 py-2 text-white/70 hover:text-white">Log out</button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 pb-20 md:pb-0">
        <header className="no-print sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-line">
          <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-14">
            <div className="min-w-0">
              <p className="font-serif text-lg leading-tight truncate">{greet}, {business.name}</p>
              <p className="text-[11px] text-taupe truncate">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={refresh} title="Sync now" className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border ${error ? "border-danger text-danger" : "border-line text-ink-soft"}`}>
                <span className={`w-2 h-2 rounded-full ${error ? "bg-danger" : "bg-ok"}`} />{error ? "Sync problem" : lastSync ? `Synced ${lastSync.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}` : "Syncing…"}
              </button>
              {!alertsOn && <button onClick={enableAlerts} className="text-xs font-semibold px-3 py-2 rounded-lg bg-ink text-gold">Enable order alerts</button>}
              <button onClick={logout} className="md:hidden text-xs px-2 py-2 text-taupe">Log out</button>
            </div>
          </div>
          {fresh.length > 0 && (
            <div className="bg-gold text-ink px-4 md:px-6 py-2 flex items-center justify-between gap-3 text-sm font-semibold" role="status">
              <span>🔔 {fresh.length} new order{fresh.length > 1 ? "s" : ""}: {fresh.slice(0, 3).map((o) => o.id).join(", ")}</span>
              <span className="flex gap-3">
                <Link href={href(`/orders/${fresh[0].id}`)} onClick={dismissFresh} className="underline">Open</Link>
                <button onClick={dismissFresh} aria-label="Dismiss">✕</button>
              </span>
            </div>
          )}
          {error && <p className="bg-red-50 text-danger text-xs px-4 md:px-6 py-1.5">{error}</p>}
        </header>
        <div className="p-4 md:p-6">{children}</div>
      </div>

      <nav className="no-print md:hidden fixed bottom-0 inset-x-0 z-40 bg-black text-white grid grid-cols-4 pb-[env(safe-area-inset-bottom)]" aria-label="Admin">
        {nav.map((n) => (
          <Link key={n.path} href={href(n.path)} className={`py-2.5 text-center text-[11px] ${active(n.path) ? "text-gold font-semibold" : "text-white/70"}`}>
            <span className="block text-lg leading-none">{n.icon}</span>{n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
