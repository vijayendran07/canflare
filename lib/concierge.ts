/**
 * Shopping concierge – grounded in the REAL catalogue, policies and FAQ only.
 * - Off by default. Enabled only when CONCIERGE_API_KEY is set (server side).
 * - Provider sits behind a tiny adapter (Anthropic Messages API by default; swap `callModel` for another provider).
 * - The model may only recommend products that exist; recommended slugs are validated against the catalogue before they reach the shopper.
 */
import { business } from "@/config/business";
import { faqs } from "@/data/faq";
import { categoryName, isVisible, pricedVariants } from "@/lib/catalog";
import { inr } from "@/lib/money";
import type { Product } from "@/data/products";

export type ChatMsg = { role: "user" | "assistant"; content: string };
export type ConciergeReply = { reply: string; products: string[] };

export const conciergeEnabled = () => !!process.env.CONCIERGE_API_KEY;

export function buildSystemPrompt(catalog: Product[], page?: { path?: string; title?: string }): string {
  const items = catalog.filter(isVisible).map((p) => ({
    slug: p.slug,
    name: p.name,
    type: categoryName(p.category),
    about: p.shortDescription,
    options: pricedVariants(p).map((v) => `${v.label}: ${inr(v.price)}`),
    inStock: p.inStock,
  }));
  return [
    `You are the shopping assistant for ${business.name}, a candle brand from ${business.address.city}. Be warm, brief (max 3 short sentences) and practical.`,
    "STRICT RULES:",
    "- Answer ONLY from the CATALOGUE, POLICIES and FAQ below. If something is not covered, say you are not sure and suggest messaging the shop on WhatsApp. Never invent products, prices, discounts, offers, reviews, ratings, ingredients, burn times or delivery promises.",
    "- Only recommend products from the catalogue, by their exact slug. Never recommend out-of-stock products.",
    "- There is no online payment: orders are placed on the site; the shop then confirms by phone or WhatsApp and shares payment details.",
    '- Reply with JSON only, exactly: {"reply": string, "products": string[]} where products has at most 3 catalogue slugs (or []).',
    "",
    `POLICIES: Delivery to all India pincodes. Free delivery on orders of ${inr(business.freeDeliveryThreshold)} or more, otherwise ${inr(business.deliveryCharge)}. Gift wrap ${inr(business.giftWrapPrice)}. Dispatch within ${business.dispatchDays} working days, delivery ${business.deliveryDays} days after dispatch. Damaged or wrong items: report on WhatsApp within ${business.returnWindowDays} days. Shop WhatsApp/phone: ${business.phoneDisplay}.`,
    "",
    `FAQ: ${JSON.stringify(faqs)}`,
    "",
    `CATALOGUE: ${JSON.stringify(items)}`,
    page?.path ? `\nThe shopper is currently viewing: ${page.title ?? ""} (${page.path}).` : "",
  ].join("\n");
}

/** Parses the model output and drops anything that is not a real, visible, in-stock product. */
export function parseReply(raw: string, catalog: Product[]): ConciergeReply {
  let obj: { reply?: unknown; products?: unknown } = {};
  try {
    const m = raw.match(/\{[\s\S]*\}/);
    obj = JSON.parse(m ? m[0] : raw);
  } catch {
    obj = { reply: raw };
  }
  const valid = new Set(catalog.filter((p) => isVisible(p) && p.inStock).map((p) => p.slug));
  const products = Array.isArray(obj.products) ? [...new Set(obj.products.filter((s): s is string => typeof s === "string" && valid.has(s)))].slice(0, 3) : [];
  const reply = (typeof obj.reply === "string" ? obj.reply : "").trim().slice(0, 700) || "I'm not sure about that – please message us on WhatsApp and we'll help.";
  return { reply, products };
}

/** Provider adapter. Replace this function to use another model provider. */
export async function callModel(system: string, messages: ChatMsg[]): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": process.env.CONCIERGE_API_KEY!, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: process.env.CONCIERGE_MODEL || "claude-haiku-5-5", max_tokens: 400, system, messages }),
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`model-${res.status}`);
  const data = (await res.json()) as { content?: { type: string; text?: string }[] };
  return (data.content ?? []).filter((c) => c.type === "text").map((c) => c.text ?? "").join("");
}
