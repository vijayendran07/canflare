import { createHmac, timingSafeEqual } from "crypto";

export const COOKIE = "cf_admin";
export const SESSION_DAYS = 7;

const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";

const hmac = (data: string) => createHmac("sha256", secret()).update(data).digest("hex");

const safeEq = (a: string, b: string) => {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
};

export function adminConfigured() {
  return !!process.env.ADMIN_PASSWORD && secret().length > 0;
}

export function checkPassword(pw: string): boolean {
  const real = process.env.ADMIN_PASSWORD;
  if (!real) return false;
  return safeEq(hmac("pw:" + pw), hmac("pw:" + real));
}

/** Session token: "<expiryMs>.<hmac>" */
export function createSession(now = Date.now()): string {
  const exp = String(now + SESSION_DAYS * 86400_000);
  return `${exp}.${hmac("session:" + exp)}`;
}

export function verifySession(token: string | undefined | null, now = Date.now()): boolean {
  if (!token || !secret()) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp)) return false;
  if (Number(exp) < now) return false;
  return safeEq(sig, hmac("session:" + exp));
}

export function readCookie(header: string | null, name = COOKIE): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return decodeURIComponent(v.join("="));
  }
  return undefined;
}

export const isAdminRequest = (req: Request) => verifySession(readCookie(req.headers.get("cookie")));

// ---- login throttling (best effort, per server instance) ----
const attempts = new Map<string, { n: number; until: number }>();
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60_000;

export function throttleState(key: string, now = Date.now()) {
  const a = attempts.get(key);
  if (a && a.until > now) return { locked: true, retryAfter: Math.ceil((a.until - now) / 1000) };
  return { locked: false, retryAfter: 0 };
}
export function recordFail(key: string, now = Date.now()) {
  const a = attempts.get(key) ?? { n: 0, until: 0 };
  a.n += 1;
  if (a.n >= MAX_FAILS) {
    a.until = now + LOCK_MS;
    a.n = 0;
  }
  attempts.set(key, a);
}
export const recordSuccess = (key: string) => attempts.delete(key);
export const _resetThrottle = () => attempts.clear();
