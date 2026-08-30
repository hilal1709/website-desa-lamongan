import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async headers() {
    const scriptSrc = process.env.NODE_ENV === "development"
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      : "script-src 'self' 'unsafe-inline'"
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Content-Security-Policy", value: `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; ${scriptSrc}; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://images.unsplash.com https://lh3.googleusercontent.com https://*.supabase.co https://cdnjs.cloudflare.com https://server.arcgisonline.com https://*.tile.openstreetmap.org; connect-src 'self' https://api.open-meteo.com https://*.supabase.co https://*.pusher.com wss://*.pusher.com; font-src 'self' data:; media-src 'self'; worker-src 'self' blob:` },
      ...(process.env.ENABLE_HSTS === "true" ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }] : []),
    ]
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/videos/:path*.mp4",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800" }],
      },
      {
        source: "/images/pesona-potensi-desa-poster.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800" }],
      },
      {
        source: "/images/struktur-organisasi.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=2592000, stale-while-revalidate=604800" }],
      },
      {
        source: "/images/logokedungrejo.jpeg",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=2592000, immutable" }],
      },
    ]
  },
};

export default nextConfig;
