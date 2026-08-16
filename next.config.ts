import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tauri cannot serve SSR pages — export a fully static build.
  output: "export",
  // Next.js Image optimization is not available in static export mode.
  images: { unoptimized: true },
  // Only set assetPrefix if a remote TAURI_DEV_HOST is explicitly provided (e.g. mobile dev).
  // Leaving it undefined allows Next.js to serve CSS and JS relatively on whatever port dev server runs.
  assetPrefix: process.env.TAURI_DEV_HOST ? `http://${process.env.TAURI_DEV_HOST}:3000` : undefined,
  reactStrictMode: true,
};

export default nextConfig;