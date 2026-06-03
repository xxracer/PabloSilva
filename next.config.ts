import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Optimize external images too: Instagram, Vercel Blob, etc.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "**.blob.vercel-storage.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "scontent.cdninstagram.com" },
    ],
    // Modern formats by default; aggressive caching on Vercel.
    formats: ["image/avif", "image/webp"],
    // Allow the quality values used throughout the site (Next 16 default is [75]).
    qualities: [60, 65, 70, 75, 80, 85, 90],
  },
  // Compress HTML responses (RSC payloads) for first paint speed.
  compress: true,
};

export default nextConfig;
