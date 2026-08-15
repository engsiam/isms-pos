"use client";

import * as React from "react";
import { Scan, User, ChevronDown, AlertCircle, Search, LayoutGrid } from "lucide-react";
import { products } from "@/config/products";
import { useCartStore } from "@/store/cart-store";
import { PosProductSearchModal } from "@/components/pos/pos-product-search-modal";

export function PosTransactionBar() {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState("Walk-in Customer");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addItem = useCartStore((s) => s.addItem);

  // F2 key to open search modal
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const query = code.trim().toLowerCase();
    if (!query) {
      setSearchOpen(true);
      return;
    }

    const match = products.find(
      (p) =>
        p.barcode.toLowerCase() === query ||
        p.id.toLowerCase() === query ||
        p.name.toLowerCase().includes(query)
    );

    if (match) {
      addItem(match.id, match.name, match.emoji, match.barcode, match.price);
      setCode("");
      setError(null);
      inputRef.current?.focus();
    } else {
      setError(`Item "${code.trim()}" not found — showing catalog`);
      setSearchOpen(true);
      setTimeout(() => setError(null), 2500);
    }
  };

  return (
    <>
      <PosProductSearchModal
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          inputRef.current?.focus();
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-4 mb-4">
        {/* ── Scan barcode & Search box ───────────────────── */}
        <div className="relative">
          <div
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-3 bg-white dark:bg-slate-900 border-2 border-blue-500/80 dark:border-blue-500 rounded-xl px-4 py-3 shadow-xs focus-within:ring-4 focus-within:ring-blue-500/15 transition-all cursor-pointer group"
          >
            <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Scan className="size-5" />
            </div>
            <input
              ref={inputRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleScan}
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen(true);
              }}
              autoFocus
              placeholder="Scan barcode or click to view all products… (F2)"
              className="w-full bg-transparent text-sm font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none cursor-pointer"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
              title="Show All Products (F2)"
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden sm:inline">All Products</span>
            </button>
          </div>

          {error && (
            <div className="absolute left-0 top-full mt-1.5 z-20 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-xs shadow-md">
              <AlertCircle className="size-3.5" />
              {error}
            </div>
          )}
        </div>

        {/* ── Customer selector ──────────────────────────── */}
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-xs cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <User className="size-4" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-none">Customer</p>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{customer}</p>
            </div>
          </div>
          <ChevronDown className="size-4 text-slate-400 shrink-0 ml-1" />
        </div>
      </div>
    </>
  );
}
