"use client";

import * as React from "react";
import { X, Search, Plus, Filter, Check } from "lucide-react";
import {
  Coffee, Cookie, Croissant, CupSoda, GlassWater,
  LayoutGrid, Utensils, type LucideIcon,
} from "lucide-react";
import { products, categories } from "@/config/products";
import type { Product } from "@/types";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import { useDark } from "@/lib/use-dark";
import { cn } from "@/lib/utils";

const CAT_ICONS: Record<string, LucideIcon> = {
  LayoutGrid, Coffee, CupSoda, Croissant, Utensils, Cookie, GlassWater,
};

interface PosProductSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function PosProductSearchModal({ open, onClose }: PosProductSearchModalProps) {
  const dark = useDark();
  const [search, setSearch] = React.useState("");
  const [filterCat, setFilterCat] = React.useState("all");
  const [priceMin, setPriceMin] = React.useState("");
  const [priceMax, setPriceMax] = React.useState("");
  const [justAdded, setJustAdded] = React.useState<string | null>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const lines = useCartStore((s) => s.lines);

  const getQty = (id: string) => lines.find((l) => l.productId === id)?.quantity ?? 0;

  const filtered = React.useMemo<Product[]>(() => {
    const q = search.trim().toLowerCase();
    const minP = parseFloat(priceMin) || 0;
    const maxP = parseFloat(priceMax) || Infinity;
    return products.filter((p) => {
      const catOk = filterCat === "all" || p.categoryId === filterCat;
      const searchOk =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const priceOk = p.price >= minP && p.price <= maxP;
      return catOk && searchOk && priceOk;
    });
  }, [search, filterCat, priceMin, priceMax]);

  // focus search on open
  React.useEffect(() => {
    if (open) {
      setSearch("");
      setFilterCat("all");
      setTimeout(() => searchRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC key to close
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAdd = (p: Product) => {
    addItem(p.id, p.name, p.emoji, p.barcode, p.price);
    setJustAdded(p.id);
    setTimeout(() => setJustAdded(null), 700);
  };

  if (!open) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(15,23,42,0.65)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal Container */}
      <div
        className="flex flex-col w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors duration-300"
        style={{ maxHeight: "88vh" }}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <LayoutGrid className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-800 dark:text-white">Product Catalogue</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                Showing {filtered.length} of {products.length} products · Click any item to add to cart
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* ── Filters Row ────────────────────────────────────── */}
        <div className="shrink-0 px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <div className="flex gap-3 items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name, barcode, or ID…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Price Filter */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs">
                <Filter className="size-3.5 text-slate-400" />
                <span className="text-slate-400 font-medium text-[11px]">Price:</span>
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  placeholder="Min"
                  className="w-12 bg-transparent text-slate-800 dark:text-white text-xs tabular-nums focus:outline-none placeholder:text-slate-400"
                />
                <span className="text-slate-300 dark:text-slate-600">–</span>
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  placeholder="Max"
                  className="w-12 bg-transparent text-slate-800 dark:text-white text-xs tabular-nums focus:outline-none placeholder:text-slate-400"
                />
              </div>
              <button
                onClick={() => { setSearch(""); setFilterCat("all"); setPriceMin(""); setPriceMax(""); }}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold transition-all"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {categories.map((cat) => {
              const Icon = CAT_ICONS[cat.icon] ?? LayoutGrid;
              const active = filterCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCat(cat.id)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all",
                    active
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white border border-slate-200/60 dark:border-slate-700/60"
                  )}
                >
                  <Icon className="size-3.5" />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product Grid Cards ─────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400 dark:text-slate-500 text-xs font-semibold">
              No products match your search filters
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filtered.map((p) => {
                const qty = getQty(p.id);
                const wasAdded = justAdded === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleAdd(p)}
                    className={cn(
                      "group relative flex flex-col items-center p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-200 cursor-pointer select-none hover:shadow-lg active:scale-98",
                      wasAdded
                        ? "border-emerald-500 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20"
                        : qty > 0
                        ? "border-blue-500 dark:border-blue-500 bg-blue-50/30 dark:bg-blue-950/30 ring-2 ring-blue-500/15"
                        : "border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700"
                    )}
                  >
                    {/* Cart Quantity Badge */}
                    {qty > 0 && (
                      <span className="absolute top-2.5 right-2.5 min-w-[22px] h-5 px-1.5 rounded-full bg-blue-600 text-white font-black text-[10px] flex items-center justify-center shadow-md">
                        {qty}
                      </span>
                    )}

                    {/* Emoji Thumbnail */}
                    <div className={cn("size-14 rounded-2xl flex items-center justify-center text-3xl mb-3 shadow-md bg-gradient-to-br transition-transform group-hover:scale-105", p.accent)}>
                      {wasAdded ? <Check className="size-7 text-white drop-shadow" /> : p.emoji}
                    </div>

                    {/* Product Name */}
                    <h3 className="font-extrabold text-xs text-slate-800 dark:text-white text-center leading-tight line-clamp-2 w-full mb-1">
                      {p.name}
                    </h3>

                    {/* Barcode */}
                    <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mb-3">
                      {p.barcode}
                    </p>

                    {/* Price & Add Button */}
                    <div className="mt-auto flex items-center justify-between w-full pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-black text-xs text-blue-600 dark:text-blue-400 tabular-nums">
                        {formatCurrency(p.price)}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAdd(p);
                        }}
                        className={cn(
                          "size-7 rounded-lg flex items-center justify-center font-bold text-xs transition-colors",
                          wasAdded
                            ? "bg-emerald-600 text-white"
                            : qty > 0
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white"
                        )}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="shrink-0 flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Click any product card to add directly to cart · Press Esc to close</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 text-white font-bold text-xs hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
