import { z } from "zod";
import { guard, json, needSheet } from "@/lib/admin-api";
import { sheetCall } from "@/lib/sheet";

export const dynamic = "force-dynamic";

const patch = z.object({
  status: z.enum(["New", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"]).optional(),
  courier: z.string().max(80).optional(),
  tracking: z.string().max(80).optional(),
  adminNote: z.string().max(1000).optional(),
  payment: z.string().max(60).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const g = guard(req) || needSheet();
  if (g) return g;
  const { id } = await ctx.params;
  if (!/^[A-Z]{2}-\d{4}-R?\d{4}$/.test(id)) return json({ ok: false, error: "bad-id" }, 400);
  const p = patch.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ ok: false, error: "invalid" }, 400);
  try {
    await sheetCall("admin_update", { method: "POST", body: { id, ...p.data } });
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "sheet", message: "Could not update the sheet." }, 502);
  }
}
