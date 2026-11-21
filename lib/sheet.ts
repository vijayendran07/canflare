import "server-only";

const TIMEOUT_MS = 6000;

export const sheetConfigured = () => !!process.env.ORDER_WEBHOOK_URL && !!process.env.ORDER_WEBHOOK_SECRET;

/**
 * Talks to the Apps Script web app. Apps Script answers every request with a 302 to
 * script.googleusercontent.com - we follow it manually (always with GET) within one 6 s budget.
 */
export async function sheetCall<T = any>(
  action: string,
  opts: { method?: "GET" | "POST"; params?: Record<string, string>; body?: unknown; timeoutMs?: number } = {},
): Promise<T> {
  const base = process.env.ORDER_WEBHOOK_URL;
  const secret = process.env.ORDER_WEBHOOK_SECRET;
  if (!base || !secret) throw new Error("sheet-not-configured");
  const signal = AbortSignal.timeout(opts.timeoutMs ?? TIMEOUT_MS);
  const method = opts.method ?? "GET";

  let res: Response;
  if (method === "GET") {
    const u = new URL(base);
    u.searchParams.set("action", action);
    u.searchParams.set("secret", secret);
    for (const [k, v] of Object.entries(opts.params ?? {})) u.searchParams.set(k, v);
    res = await fetch(u, { redirect: "manual", signal, cache: "no-store" });
  } else {
    res = await fetch(base, {
      method: "POST",
      redirect: "manual",
      signal,
      cache: "no-store",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action, secret, ...(opts.body as object) }),
    });
  }
  // follow redirects (Apps Script: 302 -> googleusercontent echo URL, must be fetched with GET)
  for (let i = 0; i < 3 && res.status >= 300 && res.status < 400; i++) {
    const loc = res.headers.get("location");
    if (!loc) break;
    res = await fetch(loc, { redirect: "manual", signal, cache: "no-store" });
  }
  if (!res.ok) throw new Error(`sheet-http-${res.status}`);
  const data = await res.json();
  if (data && data.ok === false) throw new Error(data.error || "sheet-error");
  return data as T;
}
