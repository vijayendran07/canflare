import { revalidateTag } from "next/cache";
import { z } from "zod";
import { guard, json, needSheet } from "@/lib/admin-api";
import { sheetCall } from "@/lib/sheet";
import { products as base } from "@/data/products";
import type { PriceRow } from "@/lib/catalog";

export const dynamic = "force-dynamic";

/** Everything the admin product screen needs: the base catalogue, saved overrides and custom items. */
export async function GET(req: Request) {
  const g = guard(req) || needSheet();
  if (g) return g;
  try {
    const [p, c] = await Promise.all([
      sheetCall<{ rows: PriceRow[] }>("products"),
      sheetCall<{ items: unknown[] }>("custom"),
    ]);
    return json({ ok: true, base, rows: p.rows ?? [], custom: c.items ?? [] });
  } catch {
    return json({ ok: false, error: "sheet", message: "Could not read the sheet." }, 502);
  }
}

const rows = z.object({
  rows: z.array(z.object({ slug: z.string().max(80), variant: z.string().max(80), price: z.number().min(0).max(1_000_000).nullable(), inStock: z.boolean() })).max(2000),
});

export async function POST(req: Request) {
  const g = guard(req) || needSheet();
  if (g) return g;
  const p = rows.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ ok: false, error: "invalid" }, 400);
  try {
    await sheetCall("admin_products_save", { method: "POST", body: p.data });
    revalidateTag("products", { expire: 0 });
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "sheet", message: "Could not save to the sheet." }, 502);
  }
}
