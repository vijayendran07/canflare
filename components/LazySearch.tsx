"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useUI } from "@/store/ui";

const SearchOverlay = dynamic(() => import("./SearchOverlay"), { ssr: false });

/** Search code (overlay, fuzzy matcher, voice) is only downloaded the first time search is opened (button, "/" key). */
export default function LazySearch() {
  const open = useUI((s) => s.searchOpen);
  const [load, setLoad] = useState(false);
  useEffect(() => { if (open) setLoad(true); }, [open]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "/" && !/input|textarea|select/i.test((e.target as HTMLElement).tagName)) { e.preventDefault(); useUI.getState().openSearch(); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return load ? <SearchOverlay /> : null;
}
