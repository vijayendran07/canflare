import { NextResponse } from "next/server";
import { orderInputSchema, buildOrder, makeFallbackId } from "@/lib/order";
import { getCatalog } from "@/lib/server-catalog";
import { sheetCall, sheetConfigured } from "@/lib/sheet";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json", message: "Invalid request." }, { status: 400 });
  }

  const parsed = orderInputSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: "invalid", message: first ? `${first.path.join(".")}: ${first.message}` : "Invalid order." },
      { status: 400 },
    );
  }
  const input = parsed.data;

  // Every price is recalculated here from the catalogue. A queued retry (fallbackId) is accepted
  // even if prices moved meanwhile - the customer already confirmed on WhatsApp - and gets flagged.
  const built = buildOrder(input, await getCatalog(), { lenient: !!input.fallbackId });
  if (!built.ok) {
    return NextResponse.json({ ok: false, error: built.error, message: built.message }, { status: built.status });
  }
  const order = built.order;

  try {
    if (!sheetConfigured()) throw new Error("sheet-not-configured");
    const res = await sheetCall<{ ok: true; id: string }>("order", {
      method: "POST",
      body: { order, orderId: input.fallbackId },
    });
    return NextResponse.json({ ok: true, id: res.id, queued: false, order: { ...order, id: res.id } });
  } catch {
    // The sheet is unreachable: the customer must never lose an order.
    const id = input.fallbackId ?? makeFallbackId();
    return NextResponse.json({ ok: true, id, queued: true, order: { ...order, id } });
  }
}
