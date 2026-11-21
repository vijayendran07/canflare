"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { AdminOrder } from "@/lib/admin-types";

type Patch = Partial<Pick<AdminOrder, "status" | "courier" | "tracking" | "adminNote" | "payment">>;
type Ctx = {
  base: string;
  orders: AdminOrder[];
  loading: boolean;
  error: string;
  lastSync: Date | null;
  fresh: AdminOrder[]; // orders that arrived since the panel was opened and have not been dismissed
  dismissFresh: () => void;
  refresh: () => Promise<void>;
  update: (id: string, p: Patch) => Promise<boolean>;
  alertsOn: boolean;
  enableAlerts: () => Promise<void>;
};
const C = createContext<Ctx | null>(null);
export const useAdmin = () => {
  const c = useContext(C);
  if (!c) throw new Error("AdminProvider missing");
  return c;
};

const POLL_MS = 30_000;

function chime() {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    [880, 1318].forEach((f, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.value = f;
      o.type = "sine";
      o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      o.start(t); o.stop(t + 0.55);
    });
  } catch { /* audio blocked until the first tap */ }
}

export default function AdminProvider({ base, children }: { base: string; children: React.ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [fresh, setFresh] = useState<AdminOrder[]>([]);
  const [alertsOn, setAlertsOn] = useState(false);
  const known = useRef<Set<string> | null>(null);
  const title = useRef("");

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/orders", { cache: "no-store" });
      if (r.status === 401) { location.reload(); return; }
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Could not load orders");
      const list: AdminOrder[] = d.orders;
      if (known.current) {
        const added = list.filter((o) => !known.current!.has(o.id));
        if (added.length) {
          setFresh((f) => [...added, ...f]);
          chime();
          try { if ("Notification" in window && Notification.permission === "granted") new Notification(`New order ${added[0].id}`, { body: `${added[0].name} · ₹${added[0].total}`, icon: "/emblem.png" }); } catch { /* ignore */ }
        }
      }
      known.current = new Set(list.map((o) => o.id));
      setOrders(list);
      setError("");
      setLastSync(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sync failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    title.current = document.title;
    void refresh();
    const t = setInterval(refresh, POLL_MS);
    const vis = () => document.visibilityState === "visible" && void refresh();
    document.addEventListener("visibilitychange", vis);
    return () => { clearInterval(t); document.removeEventListener("visibilitychange", vis); };
  }, [refresh]);

  useEffect(() => {
    if ("Notification" in window) setAlertsOn(Notification.permission === "granted");
  }, []);

  // unread count in the tab title
  useEffect(() => {
    const t = title.current || document.title;
    document.title = fresh.length ? `(${fresh.length}) New order · ${t.replace(/^\(\d+\) New order · /, "")}` : t.replace(/^\(\d+\) New order · /, "");
  }, [fresh]);

  const update = useCallback(async (id: string, p: Patch) => {
    const prev = orders;
    setOrders((l) => l.map((o) => (o.id === id ? { ...o, ...p } : o)));
    try {
      const r = await fetch(`/api/admin/orders/${encodeURIComponent(id)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
      const d = await r.json();
      if (!d.ok) throw new Error(d.message || "Update failed");
      return true;
    } catch (e) {
      setOrders(prev);
      setError(e instanceof Error ? e.message : "Update failed");
      return false;
    }
  }, [orders]);

  const enableAlerts = useCallback(async () => {
    chime(); // also unlocks audio playback
    if ("Notification" in window) {
      const p = await Notification.requestPermission();
      setAlertsOn(p === "granted");
    }
  }, []);

  return (
    <C.Provider value={{ base, orders, loading, error, lastSync, fresh, dismissFresh: () => setFresh([]), refresh, update, alertsOn, enableAlerts }}>
      {children}
    </C.Provider>
  );
}
