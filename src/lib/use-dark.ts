/**
 * useDark — safe client-side hook that returns true when the
 * dark theme is active. Returns false during SSR / before mount
 * to avoid hydration mismatches.
 */
"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function useDark(): boolean {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted && resolvedTheme === "dark";
}
