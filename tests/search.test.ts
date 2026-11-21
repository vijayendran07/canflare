import { describe, expect, it } from "vitest";
import { lev, norm, searchItems, type SearchItem } from "@/lib/search";

const items: SearchItem[] = [
  { slug: "jar-candle", name: "Jar Candle", category: "jar-candles", categoryName: "Jar Candles", subtitle: "Scented · 120 ml" },
  { slug: "lavender-calm-candle", name: "Lavender Calm Candle", category: "floral-candles", categoryName: "Floral Candles", subtitle: "French Lavender & Wild Chamomile" },
  { slug: "rose-bliss-candle", name: "Rose Bliss Candle", category: "floral-candles", categoryName: "Floral Candles", subtitle: "Damask Rose & Warm Amber" },
  { slug: "diya-candle", name: "Diya Candle", category: "diya-candles", categoryName: "Diya Candles" },
  { slug: "return-gift-pillar", name: "Return Gift Pillar", category: "return-gift-pillars", categoryName: "Return Gift Pillars" },
];
const slugs = (q: string) => searchItems(items, q).map((i) => i.slug);

describe("search", () => {
  it("normalises text", () => expect(norm("  Café  JAR!! ")).toBe("cafe jar"));
  it("computes edit distance with an early exit", () => {
    expect(lev("calm", "clm")).toBe(1);
    expect(lev("lavender", "lavendar")).toBe(1);
    expect(lev("abc", "xyzxyz", 2)).toBeGreaterThan(2);
  });
  it("finds by prefix and by category", () => {
    expect(slugs("jar")[0]).toBe("jar-candle");
    expect(slugs("floral")).toEqual(expect.arrayContaining(["lavender-calm-candle", "rose-bliss-candle"]));
  });
  it("tolerates typos", () => {
    expect(slugs("lavendar")[0]).toBe("lavender-calm-candle");
    expect(slugs("lavendar clm")[0]).toBe("lavender-calm-candle");
    expect(slugs("rse blis")[0]).toBe("rose-bliss-candle");
    expect(slugs("pilar")).toContain("return-gift-pillar");
  });
  it("matches subtitle words and requires every word", () => {
    expect(slugs("chamomile")).toEqual(["lavender-calm-candle"]);
    expect(slugs("rose chamomile")).toEqual([]);
  });
  it("returns nothing for gibberish or empty input", () => {
    expect(slugs("zzzzqq")).toEqual([]);
    expect(slugs("   ")).toEqual([]);
  });
});
