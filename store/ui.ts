"use client";
import { create } from "zustand";

type UI = { searchOpen: boolean; openSearch: () => void; closeSearch: () => void; conciergeOpen: boolean; setConcierge: (v: boolean) => void };

export const useUI = create<UI>((set) => ({
  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  conciergeOpen: false,
  setConcierge: (v) => set({ conciergeOpen: v }),
}));
