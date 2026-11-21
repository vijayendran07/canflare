import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { COOKIE, adminConfigured, verifySession } from "@/lib/admin-auth";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminProvider from "@/components/admin/AdminProvider";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Canflare Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const h = await headers();
  // "" on the admin subdomain, "/admin" when the panel is reached through the shop domain (local dev)
  const base = h.get("x-admin-base") ?? "/admin";
  if (!verifySession(jar.get(COOKIE)?.value)) return <AdminLogin configured={adminConfigured()} />;
  return (
    <AdminProvider base={base}>
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}
