// ─── Bangladeshi Taka (৳ BDT) ───────────────────────────────────────
// Intl does not render ৳ natively via "BDT" currency code on all platforms,
// so we format the number with en-IN grouping (lakh/crore style) and
// prepend the ৳ symbol manually.
const numFmt = new Intl.NumberFormat("en-BD", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNumFmt = new Intl.NumberFormat("en-BD", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-BD");

export function formatCurrency(value: number): string {
  return `৳${numFmt.format(value)}`;
}

export function formatCompactCurrency(value: number): string {
  return `৳${compactNumFmt.format(value)}`;
}


export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}