"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";

/* ───── Native <dialog> wrapper: focus trap, Esc, inert background, backdrop click ───── */
function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    }
    if (!open && d.open) d.close();
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const cancel = (e: Event) => { e.preventDefault(); onClose(); };
    const click = (e: MouseEvent) => { if (e.target === d) onClose(); };
    d.addEventListener("cancel", cancel);
    d.addEventListener("click", click);
    return () => { d.removeEventListener("cancel", cancel); d.removeEventListener("click", click); };
  }, [onClose]);
  return ref;
}

type OverlayProps = { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode };

function Chrome({ title, onClose, children, footer, grabber }: Omit<OverlayProps, "open"> & { grabber?: boolean }) {
  return (
    <div className="flex max-h-[inherit] flex-col">
      {grabber && <div aria-hidden className="mx-auto mt-2 h-1 w-10 rounded-full bg-line md:hidden" />}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <h2 className="font-serif text-xl">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close" className="btn btn-ghost btn-icon -mr-2">✕</button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-4">{children}</div>
      {footer && <div className="border-t border-line bg-card px-5 py-3 safe-bottom">{footer}</div>}
    </div>
  );
}

/** Bottom sheet on phones, centred dialog on desktop. */
export function BottomSheet(p: OverlayProps) {
  const ref = useDialog(p.open, p.onClose);
  return <dialog ref={ref} className="sheet" aria-label={p.title}><Chrome {...p} grabber /></dialog>;
}
/** Right-hand drawer. */
export function Drawer(p: OverlayProps) {
  const ref = useDialog(p.open, p.onClose);
  return <dialog ref={ref} className="drawer" aria-label={p.title}><div className="h-full"><Chrome {...p} /></div></dialog>;
}
/** Centred modal. */
export function Modal(p: OverlayProps) {
  const ref = useDialog(p.open, p.onClose);
  return <dialog ref={ref} className="modal" aria-label={p.title}><Chrome {...p} /></dialog>;
}

/* ───── Toast ───── */
type Toast = { id: number; text: string; tone: "ok" | "error" | "info" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "info") => {
    const id = Date.now() + Math.random();
    setItems((l) => [...l.slice(-2), { id, text, tone }]);
    setTimeout(() => setItems((l) => l.filter((t) => t.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-nav-h)+16px)] z-[90] flex flex-col items-center gap-2 px-4 md:bottom-6">
        {items.map((t) => (
          <div key={t.id} className={`pointer-events-auto animate-pop max-w-sm rounded-full px-5 py-3 text-sm font-semibold shadow-e4 ${t.tone === "error" ? "bg-danger text-white" : t.tone === "ok" ? "bg-ink text-gold" : "bg-ink text-white"}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
