"use client";

import * as React from "react";
import { AlertCircle, Search, Scan } from "lucide-react";
import { products } from "@/config/products";
import { useCartStore, selectCartCount, selectSubtotal } from "@/store/cart-store";
import { PosProductSearchModal } from "@/components/pos/pos-product-search-modal";

interface PosTransactionBarProps {
  onBillInvoice: () => void;
}

export function PosTransactionBar({ onBillInvoice }: PosTransactionBarProps) {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [flash, setFlash] = React.useState(false);
  const [customer, setCustomer] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [searchOpen, setSearchOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectSubtotal);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") { e.preventDefault(); setSearchOpen(true); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCodeSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const query = code.trim().toLowerCase();
    if (!query) { setSearchOpen(true); return; }

    const match = products.find(
      (p) =>
        p.id === query || p.id === `prd-${query}` ||
        p.id.replace("prd-", "") === query ||
        p.name.toLowerCase() === query ||
        p.name.toLowerCase().startsWith(query)
    );

    if (match) {
      addItem(match.id, match.name, match.emoji, match.price);
      setCode(""); setError(null);
      setFlash(true);
      setTimeout(() => setFlash(false), 500);
      inputRef.current?.focus();
    } else {
      setError(`"${code.trim()}" not found`);
      setTimeout(() => setError(null), 2500);
    }
  };

  return (
    <>
      <PosProductSearchModal
        open={searchOpen}
        onClose={() => { setSearchOpen(false); inputRef.current?.focus(); }}
      />

      {/* Bar with violet-to-indigo gradient */}
      <div
        className="shrink-0 border-b"
        style={{
          background: "linear-gradient(135deg, #312e81 0%, #1e1b4b 40%, #0f172a 100%)",
          borderColor: "rgba(99,102,241,0.25)",
        }}
      >
        <div className="flex items-center gap-3 px-4 py-2.5 flex-wrap text-[11px]">

          {/* ── Barcode input group ───────────────────── */}
          <div
            className="flex items-stretch rounded-xl overflow-hidden shadow-lg"
            style={{
              boxShadow: flash
                ? "0 0 0 2px #10b981, 0 4px 20px rgba(99,102,241,0.4)"
                : "0 0 0 2px rgba(165,180,252,0.4), 0 4px 20px rgba(99,102,241,0.3)",
              transition: "box-shadow 0.3s",
            }}
          >
            <div
              className="flex items-center gap-1.5 px-3 text-[11px] font-bold text-white whitespace-nowrap"
              style={{ background: "linear-gradient(135deg,#7c3aed,#4f46e5)" }}
            >
              <Scan className="size-3.5" />
              Item Code/Barcode
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={handleCodeSearch}
                autoFocus
                id="pos-item-code-input"
                className="w-44 px-3 py-2 text-xs focus:outline-none border-0"
                style={{
                  background: flash ? "#ecfdf5" : "#fefce8",
                  color: "#0f172a",
                  transition: "background 0.3s",
                }}
                placeholder="Scan / type + ↵  ·  F2 browse"
              />
              {error && (
                <div className="absolute top-full left-0 mt-2 z-30 flex items-center gap-1.5 bg-rose-50 border border-rose-400 text-rose-700 px-3 py-1.5 rounded-xl text-[10px] whitespace-nowrap shadow-lg">
                  <AlertCircle className="size-3 shrink-0" />
                  {error}
                </div>
              )}
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-1 px-3 text-white/70 hover:text-white hover:bg-white/10 border-l border-white/10 transition-colors"
              title="Browse products (F2)"
            >
              <Search className="size-3.5" />
            </button>
          </div>

          <div className="w-px h-6 bg-white/15" />

          {/* Customer */}
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-200 font-semibold whitespace-nowrap">Customer</span>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              className="w-28 border-0 border-b border-white/20 bg-transparent text-white placeholder:text-white/30 px-1 py-1.5 text-xs focus:outline-none focus:border-indigo-400 transition-colors"
            />
          </div>

          {/* Mobile # */}
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-200 font-semibold whitespace-nowrap">Mobile #</span>
            <input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-28 border-0 border-b border-white/20 bg-transparent text-white placeholder:text-white/30 px-1 py-1.5 text-xs focus:outline-none focus:border-indigo-400 transition-colors"
              type="tel"
            />
          </div>

          {/* Points */}
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-200 font-semibold">Points</span>
            <span className="bg-white/10 border border-white/15 text-white/60 px-2 py-1 rounded-lg text-xs tabular-nums min-w-[2.5rem] text-center">0</span>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-200 font-semibold">Amount</span>
            <span className="bg-white/10 border border-white/15 text-white font-bold px-2 py-1 rounded-lg text-xs tabular-nums min-w-[4.5rem] text-right">
              {subtotal.toFixed(2)}
            </span>
          </div>

          {/* Item count badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-200 font-semibold whitespace-nowrap">No. of Items :</span>
            <span
              className="min-w-[2rem] text-center font-extrabold text-white text-[11px] px-2.5 py-1 rounded-lg tabular-nums shadow-md transition-all"
              style={{
                background: count > 0
                  ? "linear-gradient(135deg,#f97316,#ea580c)"
                  : "rgba(255,255,255,0.12)",
              }}
            >
              {count}
            </span>
          </div>

          {/* Invoice buttons */}
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              onClick={onBillInvoice}
              id="pos-bill-invoice-btn"
              className="flex items-center gap-1.5 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
              style={{ background: "linear-gradient(135deg,#06b6d4,#0891b2)", boxShadow: "0 4px 14px rgba(6,182,212,0.35)" }}
            >
              Bill Invoice
            </button>
            <button className="border border-white/20 bg-white/10 hover:bg-white/15 text-white/80 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all">
              Reprint Invoice
            </button>
            <select className="bg-white/10 border border-white/15 text-white text-[10px] px-2 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-400">
              <option className="bg-slate-800">Regular</option>
              <option className="bg-slate-800">Fiscal</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
