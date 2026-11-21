/** Whole rupees with Indian digit grouping: 1050 -> ₹1,050, 125000 -> ₹1,25,000 */
export function inr(n: number): string {
  const v = Math.round(Number.isFinite(n) ? n : 0);
  return "₹" + v.toLocaleString("en-IN");
}
