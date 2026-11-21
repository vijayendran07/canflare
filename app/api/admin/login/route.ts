import { json } from "@/lib/admin-api";
import {
  COOKIE, SESSION_DAYS, adminConfigured, checkPassword, createSession, recordFail, recordSuccess, throttleState,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!adminConfigured()) return json({ ok: false, error: "not-configured", message: "Admin password is not set on the server." }, 503);
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const t = throttleState(ip);
  if (t.locked) return json({ ok: false, error: "locked", message: `Too many attempts. Try again in ${Math.ceil(t.retryAfter / 60)} min.` }, 429);

  let pw = "";
  try {
    pw = String((await req.json()).password ?? "");
  } catch {
    /* ignore */
  }
  if (!checkPassword(pw)) {
    recordFail(ip);
    return json({ ok: false, error: "wrong", message: "Wrong password." }, 401);
  }
  recordSuccess(ip);
  const res = json({ ok: true });
  res.cookies.set(COOKIE, createSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 86400,
  });
  return res;
}
