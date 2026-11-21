import { NextResponse } from "next/server";
import { z } from "zod";
import { sheetCall, sheetConfigured } from "@/lib/sheet";

export const dynamic = "force-dynamic";

const q = z.object({
  id: z.string().trim().toUpperCase().regex(/^[A-Z]{2}-\d{4}-(R?\d{4})$/, "Enter a valid order ID"),
  mobile: z.string().regex(/^\d{10}$/, "Enter the 10-digit mobile number"),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = q.safeParse({ id: url.searchParams.get("id") ?? "", mobile: url.searchParams.get("mobile") ?? "" });
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid", message: parsed.error.issues[0].message }, { status: 400 });
  }
  if (!sheetConfigured()) {
    return NextResponse.json(
      { ok: false, error: "unavailable", message: "Tracking is temporarily unavailable. Please WhatsApp us." },
      { status: 503 },
    );
  }
  try {
    const res = await sheetCall<{ ok: true; found: boolean; order?: any }>("track", { params: parsed.data });
    if (!res.found) {
      return NextResponse.json(
        { ok: false, error: "not-found", message: "We could not find that order. Check the ID and mobile number." },
        { status: 404 },
      );
    }
    return NextResponse.json({ ok: true, order: res.order });
  } catch {
    return NextResponse.json(
      { ok: false, error: "unavailable", message: "Tracking is temporarily unavailable. Please try again." },
      { status: 503 },
    );
  }
}
