import type { NextConfig } from "next";

const adminHeaders = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // product photos carry a content hash (?v=…) so replaced photos show immediately (see lib/img.ts);
    // every other local image is served without a query string
    localPatterns: [{ pathname: "/products/**" }, { pathname: "/**", search: "" }],
  },
  async headers() {
    return [
      { source: "/admin/:path*", headers: adminHeaders },
      { source: "/api/admin/:path*", headers: adminHeaders },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};
export default nextConfig;
