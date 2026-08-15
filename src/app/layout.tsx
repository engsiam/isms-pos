import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ISM POS",
    template: "%s | ISM POS",
  },
  description:
    "A modern, responsive point-of-sale desktop application built with Tauri, Next.js, shadcn/ui and Zustand.",
  applicationName: "ISM POS",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AppProviders>
          {children}
          <Toaster position="top-right" richColors />
        </AppProviders>
      </body>
    </html>
  );
}