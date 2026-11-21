import { notFound } from "next/navigation";
import type { Metadata } from "next";
import DesignSystemView from "@/components/DesignSystemView";
import { ToastProvider } from "@/components/ui/overlays";

export const metadata: Metadata = { title: "Design system", robots: { index: false, follow: false } };

/** Living style guide – development only. In production it is served inside the admin at /admin/design-system. */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <ToastProvider>
      <DesignSystemView />
    </ToastProvider>
  );
}
