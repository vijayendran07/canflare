/** Typo-tolerant product search – pure functions (unit-tested). */
export type SearchItem = {
  slug: string;
  name: string;
  subtitle?: string;
  category: string;
  categoryName: string;
  keywords?: string;
};

export const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

/** Levenshtein distance with an early exit once it exceeds `max`. */
export function lev(a: string, b: string, max = 2): number {
  if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

const allowed = (len: number) => (len >= 7 ? 2 : len >= 3 ? 1 : 0);

/** Score one query token against a field's words. 0 = no match. */
function tokenScore(token: string, words: string[]): number {
  let best = 0;
  for (const w of words) {
    if (w === token) best = Math.max(best, 4);
    else if (w.startsWith(token)) best = Math.max(best, 3);
    else if (token.length >= 3 && w.includes(token)) best = Math.max(best, 2);
    else if (token.length >= 3 && lev(token, w.slice(0, token.length + 1), allowed(token.length)) <= allowed(token.length)) best = Math.max(best, 1.5);
    else if (token.length >= 3 && lev(token, w, allowed(token.length)) <= allowed(token.length)) best = Math.max(best, 1.5);
  }
  return best;
}

export function searchItems<T extends SearchItem>(items: T[], query: string, limit = 8): T[] {
  const tokens = norm(query).split(" ").filter(Boolean);
  if (!tokens.length) return [];
  const scored: { it: T; s: number }[] = [];
  for (const it of items) {
    const fields: [string[], number][] = [
      [norm(it.name).split(" "), 3],
      [norm(it.categoryName).split(" "), 2],
      [norm(`${it.subtitle ?? ""} ${it.keywords ?? ""}`).split(" ").filter(Boolean), 1],
    ];
    let total = 0;
    let all = true;
    for (const t of tokens) {
      let ts = 0;
      for (const [words, weight] of fields) ts = Math.max(ts, tokenScore(t, words) * weight);
      if (ts === 0) { all = false; break; }
      total += ts;
    }
    if (all) scored.push({ it, s: total });
  }
  return scored.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.it);
}
