"use client";
import DesignSystemView from "@/components/DesignSystemView";
import { ToastProvider } from "@/components/ui/overlays";

/** Admin-only living style guide (the admin layout already requires a login and sends noindex). */
export default function AdminDesignSystem() {
  return (
    <ToastProvider>
      <DesignSystemView />
    </ToastProvider>
  );
}
