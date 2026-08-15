import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const internalHost = process.env.TAURI_DEV_HOST || "localhost";

const nextConfig: NextConfig = {
  // Tauri cannot serve SSR pages — export a fully static build.
  output: "export",
  // Next.js Image optimization is not available in static export mode.
  images: { unoptimized: true },
  // Required so the dev server is reachable from the Tauri webview.
  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
  reactStrictMode: true,
};

export default nextConfig;