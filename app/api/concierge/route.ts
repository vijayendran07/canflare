import { NextResponse } from "next/server";
import { z } from "zod";
import { buildSystemPrompt, callModel, conciergeEnabled, parseReply } from "@/lib/concierge";
import { getCatalog } from "@/lib/server-catalog";

export const dynamic = "force-dynamic";

const body = z.object({
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(500) })).min(1).max(12),
  page: z.object({ path: z.string().max(200).optional(), title: z.string().max(200).optional() }).optional(),
});

// tiny in-memory limiter (per server instance): 20 questions / hour / IP
const hits = new Map<string, number[]>();
const limited = (ip: string, now = Date.now()) => {
  const l = (hits.get(ip) ?? []).filter((t) => now - t < 3600_000);
  if (l.length >= 20) return true;
  hits.set(ip, [...l, now]);
  return false;
};
export const _resetLimiter = () => hits.clear();

export async function POST(req: Request) {
  if (!conciergeEnabled()) return NextResponse.json({ ok: false, enabled: false }, { status: 501 });
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success || p.data.messages.at(-1)?.role !== "user") return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate-limited", reply: "That's a lot of questions! Please message us on WhatsApp for more help." }, { status: 429 });
  try {
    const catalog = await getCatalog();
    const raw = await callModel(buildSystemPrompt(catalog, p.data.page), p.data.messages);
    return NextResponse.json({ ok: true, ...parseReply(raw, catalog) });
  } catch {
    return NextResponse.json({ ok: false, error: "unavailable", reply: "I can't answer right now – please message us on WhatsApp and we'll help." }, { status: 503 });
  }
}
