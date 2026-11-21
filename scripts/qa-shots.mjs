// Screenshots every page at 390 and 1440 px.  usage: node scripts/qa-shots.mjs <outDir> [baseUrl]
import { chromium } from "playwright-core";
import { mkdirSync } from "node:fs";

const out = process.argv[2] || "design-review/before";
const base = process.argv[3] || "http://localhost:3100";
const EDGE = process.env.CHROME_PATH || "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
mkdirSync(out, { recursive: true });

const cart = { state: { items: [{ slug: "rose-bliss-candle", variant: "Standard", name: "Rose Bliss Candle", price: 499, qty: 1 }, { slug: "lavender-calm-candle", variant: "Standard", name: "Lavender Calm Candle", price: 449, qty: 1 }] }, version: 0 };
const pages = [
  ["home", "/"], ["shop", "/shop"], ["category", "/category/floral-candles"], ["product", "/product/rose-bliss-candle"],
  ["cart", "/cart"], ["checkout", "/checkout"], ["track", "/track"], ["about", "/about"], ["contact", "/contact"],
  ["faq", "/faq"], ["shipping", "/shipping"], ["notfound", "/does-not-exist"],
];
const browser = await chromium.launch({ executablePath: EDGE, headless: true });
for (const [label, vp, mobile] of [["390", { width: 390, height: 844 }, true], ["1440", { width: 1440, height: 900 }, false]]) {
  const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript((c) => { try { if (!localStorage.getItem("canflare-cart-v1")) localStorage.setItem("canflare-cart-v1", JSON.stringify(c)); } catch {} }, cart);
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(base + path, { waitUntil: "networkidle" }).catch(() => {});
    await page.waitForTimeout(700);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    await page.screenshot({ path: `${out}/${name}-${label}.png`, fullPage: true });
    console.log(label, name, over ? `OVERFLOW ${over}px` : "ok");
  }
  await ctx.close();
}
await browser.close();
