/**
 * "Frequently bought together" from REAL orders only.
 * A product is suggested for a cart when it appeared together with a product in the cart in at least `minOrders` real (non-cancelled) orders.
 * With no qualifying data this returns [] and the UI shows nothing.
 */
type O = { status?: string; items?: { slug?: string }[] };

export function coBought(orders: O[], inCart: string[], minOrders = 2, limit = 2): string[] {
  if (!inCart.length) return [];
  const cart = new Set(inCart);
  const counts = new Map<string, number>();
  for (const o of orders) {
    if (o.status === "Cancelled") continue;
    const slugs = new Set((o.items ?? []).map((i) => i.slug).filter((s): s is string => !!s && s !== "custom"));
    if (![...slugs].some((s) => cart.has(s))) continue;
    for (const s of slugs) if (!cart.has(s)) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n >= minOrders).sort((a, b) => b[1] - a[1]).slice(0, limit).map(([s]) => s);
}
