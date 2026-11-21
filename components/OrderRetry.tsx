"use client";
import { useEffect } from "react";
import { flushQueue, readQueue } from "@/lib/order-client";

/** Silently re-sends orders that were queued while the sheet was unreachable. */
export default function OrderRetry() {
  useEffect(() => {
    const run = () => {
      if (readQueue().length) void flushQueue();
    };
    run();
    const t = setInterval(run, 30_000);
    window.addEventListener("online", run);
    return () => {
      clearInterval(t);
      window.removeEventListener("online", run);
    };
  }, []);
  return null;
}
