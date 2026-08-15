import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatId(id: string): string {
  return id.toUpperCase().replace(/-/g, "").slice(0, 8);
}