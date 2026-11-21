"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { business } from "@/config/business";
import { ownerWaLink } from "@/lib/whatsapp";
import { inr } from "@/lib/money";
import { useCart } from "@/store/cart";
import { useToast } from "@/components/ui/overlays";
import ProductImage from "@/components/ProductImage";
import { WhatsAppIcon } from "@/components/Icons";

type Msg = { role: "user" | "assistant"; content: string; products?: Rec[] };
type Rec = { slug: string; name: string; category: string; image: string | null; variants: { label: string; price: number }[] };

const CHIPS = ["A gift under ₹600", "Do you deliver to my city?", "Return gift ideas", "How do I pay?"];

/** Chat panel – only mounted when the concierge is enabled server-side (CONCIERGE_API_KEY). Lazy-loaded on first open. */
export default function ConciergePanel({ onClose }: { onClose: () => void }) {
  const path = usePathname();
  const dlg = useRef<HTMLDialogElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "assistant", content: `Hi! I can help you choose a candle, check delivery or answer questions about ordering. What are you looking for?` }]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [catalog, setCatalog] = useState<Rec[]>([]);
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.openDrawer);
  const toast = useToast();

  useEffect(() => { dlg.current?.showModal(); fetch("/api/catalog").then((r) => r.json()).then((j) => setCatalog(j.products)).catch(() => {}); }, []);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [msgs, busy]);
  useEffect(() => {
    const d = dlg.current; if (!d) return;
    const c = () => onClose();
    d.addEventListener("close", c);
    return () => d.removeEventListener("close", c);
  }, [onClose]);

  const send = async (q: string) => {
    const content = q.trim();
    if (!content || busy) return;
    const next: Msg[] = [...msgs, { role: "user", content }];
    setMsgs(next); setText(""); setBusy(true);
    try {
      const history = next.slice(-8).map((m) => ({ role: m.role, content: m.content }));
      const r = await fetch("/api/concierge", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history, page: { path: path, title: document.title } }) });
      const d = await r.json();
      const recs = ((d.products as string[]) ?? []).map((s) => catalog.find((p) => p.slug === s)).filter(Boolean) as Rec[];
      setMsgs((m) => [...m, { role: "assistant", content: d.reply ?? "Sorry, I couldn't answer that. Please message us on WhatsApp.", products: recs }]);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", content: "I can't connect right now – please message us on WhatsApp." }]);
    }
    setBusy(false);
  };

  return (
    <dialog ref={dlg} className="sheet !h-[min(40rem,88dvh)]" aria-label="Shopping assistant">
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div><h2 className="font-serif text-xl">Shopping assistant</h2><p className="text-[11px] text-taupe">Answers from our catalogue &amp; policies only</p></div>
          <button onClick={() => dlg.current?.close()} aria-label="Close" className="btn btn-ghost btn-icon">✕</button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={m.role === "user" ? "ml-10 flex justify-end" : "mr-6"}>
              <div className={`rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-ink text-white" : "bg-oat text-ink"}`}>
                {m.content}
                {m.products && m.products.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {m.products.map((p) => {
                      const v = p.variants[0];
                      return (
                        <li key={p.slug} className="flex items-center gap-3 rounded-xl bg-card p-2">
                          <a href={`/product/${p.slug}`} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-oat"><ProductImage src={p.image} alt="" category={p.category} sizes="56px" /></a>
                          <a href={`/product/${p.slug}`} className="min-w-0 flex-1"><b className="block truncate">{p.name}</b><span className="text-xs text-gold-deep">{p.variants.length > 1 ? "from " : ""}{inr(Math.min(...p.variants.map((x) => x.price)))}</span></a>
                          {p.variants.length === 1 ? <button className="btn btn-dark !min-h-9 !px-3 text-xs" onClick={() => { add({ slug: p.slug, variant: v.label, name: p.name, price: v.price, image: p.image ?? undefined }); toast(`${p.name} added`, "ok"); openDrawer(); dlg.current?.close(); }}>Add</button> : <a className="btn btn-line !min-h-9 !px-3 text-xs" href={`/product/${p.slug}`}>Choose</a>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          ))}
          {busy && <div className="mr-6"><div className="inline-flex gap-1 rounded-2xl bg-oat px-4 py-3" aria-label="Typing"><span className="h-2 w-2 animate-pulse rounded-full bg-taupe" /><span className="h-2 w-2 animate-pulse rounded-full bg-taupe [animation-delay:150ms]" /><span className="h-2 w-2 animate-pulse rounded-full bg-taupe [animation-delay:300ms]" /></div></div>}
          {msgs.length === 1 && <div className="flex flex-wrap gap-2 pt-1">{CHIPS.map((c) => <button key={c} className="chip" onClick={() => send(c)}>{c}</button>)}</div>}
          <div ref={end} />
        </div>
        <div className="border-t border-line bg-card px-4 py-3 safe-bottom">
          <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2">
            <label className="min-w-0 flex-1"><span className="sr-only">Your question</span><input className="input" value={text} maxLength={500} onChange={(e) => setText(e.target.value)} placeholder="Ask about candles, delivery, gifts…" /></label>
            <button className="btn btn-gold" disabled={busy || !text.trim()}>Send</button>
          </form>
          <a href={ownerWaLink(`Hi ${business.name}! (from the website assistant)`)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs underline"><WhatsAppIcon className="h-4 w-4 text-[#1faa52]" /> Prefer to talk to a person? Continue on WhatsApp</a>
        </div>
      </div>
    </dialog>
  );
}
