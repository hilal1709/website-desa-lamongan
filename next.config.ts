import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  async headers() {
    return [
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
