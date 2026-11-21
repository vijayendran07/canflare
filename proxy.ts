import { NextRequest, NextResponse } from "next/server";

const hostOf = (h: string | null) => (h ?? "").toLowerCase().split(":")[0];
const NOINDEX = "noindex, nofollow";

/**
 * - ADMIN_HOST (e.g. admin.example.com): serves the admin panel at /, /orders, /orders/[id], /orders/new, /products
 * - With ADMIN_HOST set, /admin and /api/admin return 404 on every other host (the shop domain).
 * - www.* and *.vercel.app redirect (308) to the main domain.
 */
export function proxy(req: NextRequest) {
  const adminHost = hostOf(process.env.ADMIN_HOST ?? null);
  const host = hostOf(req.headers.get("host"));
  const { pathname, search } = req.nextUrl;
  const isAdminHost = !!adminHost && host === adminHost;

  if (isAdminHost) {
    if (pathname === "/robots.txt") {
      return new NextResponse("User-agent: *\nDisallow: /\n", { headers: { "content-type": "text/plain", "X-Robots-Tag": NOINDEX } });
    }
    const passthrough = pathname.startsWith("/_next") || pathname.startsWith("/api/admin") || /\.[a-z0-9]+$/i.test(pathname);
    const headers = new Headers(req.headers);
    headers.set("x-admin-base", "");
    let res: NextResponse;
    if (passthrough) {
      res = NextResponse.next({ request: { headers } });
    } else if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/admin/, "") || "/";
      res = NextResponse.redirect(url, 308);
    } else if (pathname.startsWith("/api/")) {
      res = new NextResponse(null, { status: 404 });
    } else {
      const url = req.nextUrl.clone();
      url.pathname = "/admin" + (pathname === "/" ? "" : pathname);
      res = NextResponse.rewrite(url, { request: { headers } });
    }
    res.headers.set("X-Robots-Tag", NOINDEX);
    res.headers.set("Cache-Control", "no-store");
    return res;
  }

  // Shop domain: hide the admin entirely once ADMIN_HOST is configured
  if (adminHost && (pathname === "/admin" || pathname.startsWith("/admin/") || pathname.startsWith("/api/admin"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/__not_found__";
    return NextResponse.rewrite(url, { status: 404 });
  }

  // Redirect www and *.vercel.app to the canonical domain (production only)
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (site && !/localhost|127\.0\.0\.1/.test(site)) {
    const main = hostOf(new URL(site).host);
    if (host && host !== main && (host === `www.${main}` || host.endsWith(".vercel.app"))) {
      return NextResponse.redirect(new URL(pathname + search, site), 308);
    }
  }

  const headers = new Headers(req.headers);
  headers.set("x-admin-base", "/admin");
  const res = NextResponse.next({ request: { headers } });
  if (pathname === "/admin" || pathname.startsWith("/admin/")) res.headers.set("X-Robots-Tag", NOINDEX);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png).*)"],
};
