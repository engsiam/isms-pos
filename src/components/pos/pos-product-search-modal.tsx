"use client";

import * as React from "react";
import { X, Search, ChevronUp, ChevronDown, Plus, Filter } from "lucide-react";
import {
  Coffee, Cookie, Croissant, CupSoda, GlassWater,
  LayoutGrid, Utensils, type LucideIcon,
} from "lucide-react";
import { products, categories } from "@/config/products";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const CAT_ICONS: Record<string, LucideIcon> = {
  LayoutGrid, Coffee, CupSoda, Croissant, Utensils, Cookie, GlassWater,
};

interface PosProductSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function PosProductSearchModal({ open, onClose }: PosProductSearchModalProps) {
  const [search, setSearch] = React.useState("");
  const [filterCat, setFilterCat] = React.useState("all");
  const [priceMin, setPriceMin] = React.useState("");
  const [priceMax, setPriceMax] = React.useState("");
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const [justAdded, setJustAdded] = React.useState<string | null>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const tableRef = React.useRef<HTMLDivElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const lines = useCartStore((s) => s.lines);

  const getQty = (id: string) => lines.find((l) => l.productId === id)?.quantity ?? 0;

  const filtered = React.useMemo<Product[]>(() => {
    const q = search.trim().toLowerCase();
    const minP = parseFloat(priceMin) || 0;
    const maxP = parseFloat(priceMax) || Infinity;
    return products.filter((p) => {
      const catOk = filterCat === "all" || p.categoryId === filterCat;
      const searchOk = !q || p.name.toLowerCase().includes(q) || p.id.includes(q);
      const priceOk = p.price >= minP && p.price <= maxP;
      return catOk && searchOk && priceOk;
    });
  }, [search, filterCat, priceMin, priceMax]);

  // focus search on open
  React.useEffect(() => {
    if (open) {
      setSearch("");
      setFilterCat("all");
      setSelectedIdx(0);
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // keyboard navigation
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const p = filtered[selectedIdx];
        if (p) handleAdd(p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, selectedIdx]);

  // scroll selected row into view
  React.useEffect(() => {
    const row = tableRef.current?.querySelector(`[data-idx="${selectedIdx}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  const handleAdd = (p: Product) => {
    addItem(p.id, p.name, p.emoji, p.price);
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 700);
  };

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2,6,23,0.72)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div
        className="flex flex-col w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          maxHeight: "82vh",
          background: "linear-gradient(160deg,#0f172a 0%,#1e1b4b 100%)",
          border: "1px solid rgba(99,102,241,0.3)",
        }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-3.5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Search className="size-4" />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">Product Search</h2>
              <p className="text-indigo-300 text-[10px]">
                Filter on [Total Record : {filtered.length} / {products.length}]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* ── Filters ────────────────────────────────────────── */}
        <div className="shrink-0 px-4 py-3 border-b border-white/10 space-y-2.5">
          {/* Search + price filter */}
          <div className="flex gap-2.5">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-indigo-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedIdx(0); }}
                placeholder="Search by name or code…"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            {/* Price range */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5">
                <Filter className="size-3 text-indigo-400" />
                <span className="text-white/40 text-[10px]">Price</span>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-12 bg-transparent text-white text-[11px] tabular-nums focus:outline-none placeholder:text-white/20"
                />
                <span className="text-white/30">–</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-12 bg-transparent text-white text-[11px] tabular-nums focus:outline-none placeholder:text-white/20"
                />
              </div>
              <button
                onClick={() => { setSearch(""); setFilterCat("all"); setPriceMin(""); setPriceMax(""); setSelectedIdx(0); }}
                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/50 hover:text-white text-[10px] font-semibold transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => {
              const Icon = CAT_ICONS[cat.icon] ?? LayoutGrid;
              const active = filterCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setFilterCat(cat.id); setSelectedIdx(0); }}
                  className={cn(
                    "shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all",
                    active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/50"
                      : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"
                  )}
                >
                  <Icon className="size-2.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product table ───────────────────────────────────── */}
        {/* Column headers */}
        <div
          className="shrink-0 grid text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest px-2"
          style={{ gridTemplateColumns: "2.5rem 1fr 6.5rem 5rem 3rem" }}
        >
          <div className="px-2 py-2">#</div>
          <div className="px-2 py-2">Description</div>
          <div className="px-2 py-2">Code</div>
          <div className="px-2 py-2 text-right">Price</div>
          <div className="px-2 py-2 text-center">Add</div>
        </div>

        {/* Rows */}
        <div ref={tableRef} className="flex-1 overflow-y-auto px-2 pb-2">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-white/30 text-sm">
              No products match your filters
            </div>
          ) : (
            filtered.map((p, idx) => {
              const qty = getQty(p.id);
              const isSelected = idx === selectedIdx;
              const wasAdded = justAdded === p.id;
              return (
                <div
                  key={p.id}
                  data-idx={idx}
                  onClick={() => { setSelectedIdx(idx); handleAdd(p); }}
                  className={cn(
                    "grid items-center rounded-xl mb-0.5 cursor-pointer transition-all duration-150",
                    "text-xs",
                    isSelected
                      ? "bg-indigo-600/30 border border-indigo-500/40"
                      : "hover:bg-white/5 border border-transparent",
                    wasAdded && "bg-emerald-600/20 border-emerald-500/40"
                  )}
                  style={{ gridTemplateColumns: "2.5rem 1fr 6.5rem 5rem 3rem" }}
                >
                  {/* Index */}
                  <div className="px-2 py-2 text-white/30 font-mono text-[10px] text-center">
                    {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Description */}
                  <div className="px-2 py-2 flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "size-7 shrink-0 rounded-lg flex items-center justify-center text-sm bg-gradient-to-br",
                        p.accent
                      )}
                    >
                      {p.emoji}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate leading-tight">{p.name}</p>
                      <p className="text-white/40 text-[9px] truncate">{p.description}</p>
                    </div>
                    {p.popular && (
                      <span className="shrink-0 text-[8px] bg-amber-400/20 text-amber-400 font-bold px-1 rounded">★</span>
                    )}
                  </div>

                  {/* Code */}
                  <div className="px-2 py-2 font-mono text-indigo-300 text-[10px] truncate">
                    {p.id}
                  </div>

                  {/* Price */}
                  <div className="px-2 py-2 text-right tabular-nums text-white font-semibold">
                    {formatCurrency(p.price)}
                  </div>

                  {/* Add button */}
                  <div className="px-2 py-2 flex justify-center">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAdd(p); }}
                      className={cn(
                        "size-7 rounded-lg flex items-center justify-center font-bold transition-all",
                        wasAdded
                          ? "bg-emerald-500 text-white scale-90"
                          : qty > 0
                          ? "bg-indigo-600 text-white"
                          : "bg-white/10 hover:bg-indigo-600 text-white/60 hover:text-white"
                      )}
                    >
                      {qty > 0 ? (
                        <span className="text-[9px] font-extrabold">{qty}</span>
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-5 py-2.5 border-t border-white/10 bg-white/3">
          <p className="text-white/40 text-[10px]">
            ↑↓ navigate · Enter to add · Esc to close
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedIdx((i) => Math.max(i - 1, 0))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <ChevronUp className="size-3.5" />
            </button>
            <button
              onClick={() => setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1))}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <ChevronDown className="size-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
