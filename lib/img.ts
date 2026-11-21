import hashes from "@/data/image-hashes.json";

/** Adds a content hash (?v=) to local image URLs so replaced photos are never served stale. */
export function img(src: string): string {
  if (!src || /^(https?:)?\/\//.test(src) || src.startsWith("data:")) return src;
  const h = (hashes as Record<string, string>)[src.split("?")[0]];
  return h ? `${src.split("?")[0]}?v=${h}` : src;
}
