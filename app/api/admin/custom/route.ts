import { revalidateTag } from "next/cache";
import { z } from "zod";
import { guard, json, needSheet } from "@/lib/admin-api";
import { sheetCall } from "@/lib/sheet";

export const dynamic = "force-dynamic";

const item = z.object({
  slug: z.string().regex(/^[a-z0-9-]{2,80}$/),
  category: z.string().max(60),
  name: z.string().trim().min(2).max(120),
  subtitle: z.string().max(160).optional(),
  shortDescription: z.string().max(300).default(""),
  description: z.string().max(3000).default(""),
  variants: z.array(z.object({ label: z.string().min(1).max(80), price: z.number().min(1).max(1_000_000).nullable() })).min(1).max(20),
  details: z.array(z.object({ label: z.string().max(60), value: z.string().max(300) })).max(30).default([]),
  images: z.array(z.string().url().max(500)).max(10).default([]),
  active: z.boolean().default(true),
  inStock: z.boolean().default(true),
  sortOrder: z.number().default(100),
  highlights: z.array(z.string().max(60)).max(10).default([]),
  comboItems: z.array(z.object({ slug: z.string(), variant: z.string(), qty: z.number().int().min(1).max(50) })).max(20).optional(),
});

export async function POST(req: Request) {
  const g = guard(req) || needSheet();
  if (g) return g;
  const p = item.safeParse(await req.json().catch(() => null));
  if (!p.success) return json({ ok: false, error: "invalid", message: p.error.issues[0]?.path.join(".") + ": " + p.error.issues[0]?.message }, 400);
  try {
    await sheetCall("admin_custom_save", { method: "POST", body: { item: p.data } });
    revalidateTag("products", { expire: 0 });
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "sheet", message: "Could not save to the sheet." }, 502);
  }
}

export async function DELETE(req: Request) {
  const g = guard(req) || needSheet();
  if (g) return g;
  const slug = new URL(req.url).searchParams.get("slug") ?? "";
  if (!/^[a-z0-9-]{2,80}$/.test(slug)) return json({ ok: false, error: "bad-slug" }, 400);
  try {
    await sheetCall("admin_custom_delete", { method: "POST", body: { slug } });
    revalidateTag("products", { expire: 0 });
    return json({ ok: true });
  } catch {
    return json({ ok: false, error: "sheet", message: "Could not delete." }, 502);
  }
}
