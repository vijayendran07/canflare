// Prints the JS a page loads on first view (gzip transfer sizes). usage: node scripts/js-size.mjs /path [base]
const path = process.argv[2] || "/";
const base = process.argv[3] || "http://localhost:3100";
const html = await (await fetch(base + path)).text();
const srcs = [...new Set([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]).concat([...html.matchAll(/href="([^"]+\.js)"/g)].map((m) => m[1])))].filter((s) => s.endsWith(".js") || s.includes(".js?"));
let total = 0; const rows = [];
for (const s of srcs) {
  const r = await fetch(new URL(s, base), { headers: { "accept-encoding": "gzip" } });
  const size = (await r.arrayBuffer()).byteLength; // fetch transparently decompresses; approximate gzip with node's zlib
  const { gzipSync } = await import("node:zlib");
  const gz = gzipSync(Buffer.from(await (await fetch(new URL(s, base))).arrayBuffer())).length;
  total += gz; rows.push([gz, s.split("/").pop().slice(0, 60)]);
}
rows.sort((a, b) => b[0] - a[0]);
console.log(path, "first-load JS (gzip):", (total / 1024).toFixed(1), "KB in", rows.length, "files");
rows.slice(0, 8).forEach(([g, n]) => console.log("  ", (g / 1024).toFixed(1).padStart(6), "KB", n));
