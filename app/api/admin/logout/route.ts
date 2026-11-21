import { json } from "@/lib/admin-api";
import { COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const res = json({ ok: true });
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
