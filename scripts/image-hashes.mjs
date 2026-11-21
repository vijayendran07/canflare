// Builds data/image-hashes.json: content hash for every file in /public, appended as ?v= to image URLs
// so a replaced photo shows up immediately instead of a cached old one.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

const root = new URL("../public", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const out = {};
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jpe?g|png|webp|avif|gif|svg|ico)$/i.test(name)) {
      out["/" + relative(root, p).split("\\").join("/")] = createHash("md5").update(readFileSync(p)).digest("hex").slice(0, 8);
    }
  }
};
walk(root);
mkdirSync(new URL("../data", import.meta.url), { recursive: true });
writeFileSync(new URL("../data/image-hashes.json", import.meta.url), JSON.stringify(out, null, 2));
console.log(`image hashes: ${Object.keys(out).length} files`);
