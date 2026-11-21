"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/store/ui";
import { searchItems, type SearchItem } from "@/lib/search";
import { track } from "@/lib/analytics";
import { inr } from "@/lib/money";
import ProductImage from "./ProductImage";
import CandleArt, { kindForCategory } from "./CandleArt";
import { SearchIcon } from "./Icons";

type Item = SearchItem & { inStock: boolean; image: string | null; variants: { label: string; price: number }[] };
type SR = { new (): { lang: string; interimResults: boolean; onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void; onend: () => void; onerror: () => void; start: () => void; stop: () => void } };

const SUGGESTIONS = ["Jar candle", "Votive", "Pillar", "Diya", "Return gift", "Advent"];
let cache: Item[] | null = null;

/** Instant search-as-you-type (typo tolerant) with images and prices; optional voice search where the browser supports it. */
export default function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const close = useUI((s) => s.closeSearch);
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>(cache ?? []);
  const [listening, setListening] = useState(false);
  const [voice, setVoice] = useState(false);

  useEffect(() => {
    setVoice(!!((window as unknown as Record<string, unknown>).SpeechRecognition || (window as unknown as Record<string, unknown>).webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setTimeout(() => input.current?.focus(), 50);
      if (!cache) fetch("/api/catalog").then((r) => r.json()).then((j) => { cache = j.products; setItems(j.products); }).catch(() => {});
    }
    if (!open && d.open) d.close();
  }, [open]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => close();
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, [close]);

  const results = useMemo(() => searchItems(items, q, 8), [items, q]);

  // debounce the analytics event
  useEffect(() => {
    if (q.trim().length < 3) return;
    const t = setTimeout(() => track("search", { search_term: q.trim(), results: results.length }), 700);
    return () => clearTimeout(t);
  }, [q, results.length]);

  const startVoice = () => {
    const W = window as unknown as { SpeechRecognition?: SR; webkitSpeechRecognition?: SR };
    const R = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!R) return;
    const r = new R();
    r.lang = navigator.language || "en-IN";
    r.interimResults = true;
    r.onresult = (e) => setQ(Array.from(e.results).map((x) => x[0].transcript).join(" "));
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    setListening(true);
    r.start();
  };

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    close();
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <dialog ref={ref} className="sheet !max-h-[100dvh] md:!max-h-[80dvh] h-[100dvh] md:h-auto md:!mt-[8vh] md:!mb-auto" aria-label="Search candles"
      onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className="flex h-full max-h-[inherit] flex-col">
        <form onSubmit={go} role="search" className="flex items-center gap-2 border-b border-line px-4 py-3">
          <SearchIcon className="w-5 h-5 text-taupe shrink-0" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} type="search" enterKeyHint="search" autoComplete="off" spellCheck={false}
            placeholder={listening ? "Listening…" : "Search jar, votive, pillar, diya…"} aria-label="Search candles"
            className="min-w-0 flex-1 bg-transparent py-2 text-[17px] outline-none placeholder:text-taupe" />
          {voice && (
            <button type="button" onClick={startVoice} aria-label="Search by voice" aria-pressed={listening} className={`btn btn-icon ${listening ? "btn-gold animate-pulse" : "btn-ghost"}`}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4" /></svg>
            </button>
          )}
          <button type="button" onClick={close} className="btn btn-ghost !px-3 text-sm">Close</button>
        </form>

        <div className="flex-1 overflow-y-auto p-4">
          {!q.trim() ? (
            <div>
              <p className="eyebrow mb-3">Popular searches</p>
              <div className="flex flex-wrap gap-2">{SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}</div>
            </div>
          ) : results.length ? (
            <ul className="space-y-1" aria-live="polite">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link href={`/product/${p.slug}`} onClick={close} className="flex items-center gap-3 rounded-lg p-2 hover:bg-oat">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-oat"><ProductImage src={p.image} alt="" category={p.category} sizes="64px" /></span>
                    <span className="min-w-0 flex-1">
                      <b className="block truncate">{p.name}</b>
                      <span className="block text-xs text-taupe">{p.categoryName}{!p.inStock && " · Out of stock"}</span>
                    </span>
                    <span className="text-sm font-semibold">{p.variants.length > 1 && <span className="text-xs font-normal text-taupe">from </span>}{inr(Math.min(...p.variants.map((v) => v.price)))}</span>
                  </Link>
                </li>
              ))}
              <li className="pt-2"><button className="btn btn-line w-full" onClick={go}>See all results for “{q.trim()}”</button></li>
            </ul>
          ) : (
            <div className="py-10 text-center" role="status">
              <CandleArt kind={kindForCategory("")} className="mx-auto h-24 w-24 opacity-70" />
              <p className="mt-3 font-serif text-xl">No candles match “{q.trim()}”</p>
              <p className="mt-1 text-sm text-ink-soft">Try a shorter word, or browse by type.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">{SUGGESTIONS.slice(0, 4).map((s) => <button key={s} className="chip" onClick={() => setQ(s)}>{s}</button>)}</div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
