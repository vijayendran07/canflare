"use client";
import { useEffect, useState } from "react";

/** Calm offline state: browsing continues from cache, orders are queued and retried automatically. */
export default function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const set = () => setOffline(!navigator.onLine);
    set();
    window.addEventListener("online", set);
    window.addEventListener("offline", set);
    return () => { window.removeEventListener("online", set); window.removeEventListener("offline", set); };
  }, []);
  if (!offline) return null;
  return (
    <p role="status" className="bg-warn px-4 py-2 text-center text-sm font-semibold text-white">
      You&apos;re offline. You can keep browsing – any order you place is saved and sent as soon as you&apos;re back online.
    </p>
  );
}
