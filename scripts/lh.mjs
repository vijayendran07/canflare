// Lighthouse (mobile) for the key pages.  usage: node scripts/lh.mjs <label> [baseUrl]
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const label = process.argv[2] || "run";
const base = process.argv[3] || "http://localhost:3100";
process.env.CHROME_PATH ||= "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const pages = [["Home", "/"], ["Category", "/category/floral-candles"], ["Product", "/product/rose-bliss-candle"], ["Checkout", "/checkout"]];
mkdirSync("design-review", { recursive: true });
const rows = [];
for (const [name, path] of pages) {
  const f = `design-review/lh-${label}-${name}.json`;
  spawnSync("node", ["node_modules/lighthouse/cli/index.js", base + path, "--only-categories=performance,accessibility,best-practices,seo", "--chrome-flags=--headless=new --no-sandbox", "--quiet", "--output=json", `--output-path=${f}`], { stdio: "ignore" });
  const r = JSON.parse(readFileSync(f, "utf8"));
  const c = r.categories, a = r.audits;
  const js = a["network-requests"].details.items.filter((i) => i.resourceType === "Script").reduce((s, i) => s + i.transferSize, 0);
  rows.push({
    page: name, perf: Math.round(c.performance.score * 100), a11y: Math.round(c.accessibility.score * 100), bp: Math.round(c["best-practices"].score * 100), seo: Math.round(c.seo.score * 100),
    lcp: a["largest-contentful-paint"].displayValue, cls: a["cumulative-layout-shift"].displayValue, tbt: a["total-blocking-time"].displayValue, jsKB: Math.round(js / 1024),
  });
  console.log(JSON.stringify(rows.at(-1)));
}
writeFileSync(`design-review/lh-${label}.json`, JSON.stringify(rows, null, 2));
