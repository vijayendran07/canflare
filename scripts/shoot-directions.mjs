import { chromium } from "playwright-core";
import { copyFileSync } from "node:fs";
import { resolve } from "node:path";

copyFileSync("public/logo.jpg", "design-review/directions/logo.jpg");
const b = await chromium.launch({ executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
for (const n of ["a-cinematic-luxe", "b-soft-futurism", "c-editorial-craft"]) {
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await p.goto("file:///" + resolve("design-review/directions", n + ".html").replace(/\\/g, "/"));
  await p.waitForTimeout(400);
  await p.screenshot({ path: `design-review/directions/${n}.png`, fullPage: true });
  console.log("shot", n);
}
await b.close();
