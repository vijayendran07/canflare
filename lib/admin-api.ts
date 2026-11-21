import "server-only";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { sheetConfigured } from "@/lib/sheet";

export const noindex = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: noindex });
}

/** Returns an error response when the caller isn't a logged-in admin, otherwise null. */
export function guard(req: Request): NextResponse | null {
  if (!isAdminRequest(req)) return json({ ok: false, error: "unauthorized" }, 401);
  return null;
}

export function needSheet(): NextResponse | null {
  return sheetConfigured() ? null : json({ ok: false, error: "sheet-not-configured", message: "Google Sheet is not connected yet (set ORDER_WEBHOOK_URL / ORDER_WEBHOOK_SECRET)." }, 503);
}
