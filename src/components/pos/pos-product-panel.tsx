"use client";

import * as React from "react";
import { Search, ChevronDown, ChevronUp, Check, Star, Plus, Minus } from "lucide-react";
import {
  Coffee, Cookie, Croissant, CupSoda, GlassWater,
  LayoutGrid, Utensils, type LucideIcon,
} from "lucide-react";
import { products, categories } from "@/config/products";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/format";
import { useDark } from "@/lib/use-dark";
import { cn } from "@/lib/utils";

const CAT_ICONS: Record<string, LucideIcon> = {
  LayoutGrid, Coffee, CupSoda, Croissant, Utensils, Cookie, GlassWater,
};

const CAT_COLORS: Record<string, string> = {
  all:       "linear-gradient(135deg,#6366f1,#4f46e5)",
  coffee:    "linear-gradient(135deg,#92400e,#78350f)",
  tea:       "linear-gradient(135deg,#15803d,#14532d)",
  bakery:    "linear-gradient(135deg,#d97706,#b45309)",
  meals:     "linear-gradient(135deg,#dc2626,#9f1239)",
  snacks:    "linear-gradient(135deg,#7c3aed,#5b21b6)",
  beverages: "linear-gradient(135deg,#0891b2,#0e7490)",
};

export function PosProductPanel() {
  const dark = useDark();
  const [search, setSearch] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [collapsed, setCollapsed] = React.useState(false);
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const addItem      = useCartStore((s) => s.addItem);
  const updateQty    = useCartStore((s) => s.updateQuantity);
  const lines        = useCartStore((s) => s.lines);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const catOk    = activeCategory === "all" || p.categoryId === activeCategory;
      const searchOk = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [search, activeCategory]);

  const getQty = (id: string) => lines.find((l) => l.productId === id)?.quantity ?? 0;

  const handleAdd = (p: (typeof products)[0]) => {
    addItem(p.id, p.name, p.emoji, p.barcode, p.price);
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 600);
  };

  const handleDecrement = (e: React.MouseEvent, p: (typeof products)[0]) => {
    e.stopPropagation();
    const qty = getQty(p.id);
    if (qty > 0) updateQty(p.id, qty - 1);
  };

  /* ── theme palette ───────────────────────────────── */
  const panelBg   = dark ? "linear-gradient(180deg,#0f172a 0%,#0a0f1e 100%)" : "linear-gradient(180deg,#f0f4ff 0%,#e8eeff 100%)";
  const searchBg  = dark ? "#1e293b" : "#ffffff";
  const searchBdr = dark ? "#4338ca" : "#a5b4fc";
  const searchClr = dark ? "#e2e8f0" : "#1e293b";
  const pillInact = dark
    ? { background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.25)" }
    : { background: "rgba(99,102,241,0.08)", color: "#4f46e5", border: "1px solid rgba(99,102,241,0.2)" };

  return (
    <div
      className="shrink-0 flex flex-col overflow-hidden transition-colors duration-300"
      style={{
        height: collapsed ? 36 : "13.5rem",
        borderBottom: `1px solid ${dark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.18)"}`,
      }}
    >
      {/* ── Title bar ─────────────────────────────── */}
      <div
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center justify-between px-4 py-2 cursor-pointer select-none shrink-0"
        style={{ background: "linear-gradient(90deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)" }}
      >
        <div className="flex items-center gap-2.5">
          <LayoutGrid className="size-3 text-indigo-300" />
          <span className="text-white text-[11px] font-bold tracking-wider uppercase">Product Catalogue</span>
          <span className="text-indigo-400/60 text-[9px]">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="text-white/30 hover:text-white/80 transition-colors">
          {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </div>
      </div>

      {!collapsed && (
        <div className="flex flex-col flex-1 min-h-0 transition-colors duration-300" style={{ background: panelBg }}>

          {/* ── Search + Category row ──────────────── */}
          <div className="flex items-center gap-2 px-3 pt-2 pb-1.5 shrink-0">
            <div className="relative w-48 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-indigo-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="w-full pl-8 pr-3 py-1.5 text-[11px] rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm transition-all"
                style={{ background: searchBg, border: `1.5px solid ${searchBdr}`, color: searchClr }}
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1">
              {categories.map((cat) => {
                const Icon = CAT_ICONS[cat.icon] ?? LayoutGrid;
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all whitespace-nowrap"
                    style={
                      active
                        ? { background: CAT_COLORS[cat.id] ?? CAT_COLORS.all, color: "#fff", boxShadow: "0 2px 12px rgba(0,0,0,0.25)", transform: "scale(1.05)" }
                        : pillInact
                    }
                  >
                    <Icon className="size-2.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Product Cards ──────────────────────── */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden no-scrollbar px-3 pb-2.5">
            {filtered.length === 0 ? (
              <div className="flex items-center h-full text-xs" style={{ color: dark ? "#64748b" : "#9ca3af" }}>
                No products found for this filter
              </div>
            ) : (
              <div className="flex gap-2.5 h-full items-center">
                {filtered.map((p) => {
                  const qty      = getQty(p.id);
                  const wasAdded = addedId === p.id;
                  const inCart   = qty > 0;

                  return (
                    <ProductCard
                      key={p.id}
                      product={p}
                      qty={qty}
                      wasAdded={wasAdded}
                      inCart={inCart}
                      dark={dark}
                      onAdd={() => handleAdd(p)}
                      onDecrement={(e) => handleDecrement(e, p)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Individual Product Card
═══════════════════════════════════════════════════════ */
interface CardProps {
  product: (typeof products)[0];
  qty: number;
  wasAdded: boolean;
  inCart: boolean;
  dark: boolean;
  onAdd: () => void;
  onDecrement: (e: React.MouseEvent) => void;
}

function ProductCard({ product: p, qty, wasAdded, inCart, dark, onAdd, onDecrement }: CardProps) {
  const [hovered, setHovered] = React.useState(false);

  /* card border + shadow based on state */
  const cardStyle = React.useMemo(() => {
    if (wasAdded) return {
      background: dark ? "linear-gradient(160deg,#022c22,#064e3b)" : "linear-gradient(160deg,#d1fae5,#ecfdf5)",
      border: "2px solid #10b981",
      boxShadow: "0 0 18px rgba(16,185,129,0.35)",
    };
    if (inCart) return {
      background: dark ? "linear-gradient(160deg,#1e1b4b,#312e81)" : "linear-gradient(160deg,#e0e7ff,#eef2ff)",
      border: "2px solid #6366f1",
      boxShadow: dark ? "0 0 18px rgba(99,102,241,0.35)" : "0 4px 20px rgba(99,102,241,0.25)",
    };
    if (hovered) return {
      background: dark ? "linear-gradient(160deg,#1e293b,#1e1b4b)" : "linear-gradient(160deg,#eef2ff,#e0e7ff)",
      border: "2px solid rgba(99,102,241,0.6)",
      boxShadow: dark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(99,102,241,0.2)",
    };
    return {
      background: dark ? "linear-gradient(160deg,#0f172a,#1a1f3a)" : "linear-gradient(160deg,#ffffff,#f8faff)",
      border: `2px solid ${dark ? "rgba(99,102,241,0.18)" : "rgba(199,210,254,0.8)"}`,
      boxShadow: dark ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.06)",
    };
  }, [wasAdded, inCart, hovered, dark]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onAdd}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onAdd(); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={`${p.name} — ${formatCurrency(p.price)}`}
      className="relative flex flex-col items-center rounded-2xl transition-all duration-200 active:scale-95 shrink-0 cursor-pointer select-none"
      style={{
        ...cardStyle,
        width: 100,
        padding: "10px 8px 8px",
        transform: hovered && !wasAdded ? "translateY(-2px) scale(1.03)" : wasAdded ? "scale(0.96)" : "none",
        transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* ── Popular star ─ */}
      {p.popular && !inCart && (
        <span className="absolute top-1.5 left-1.5">
          <Star className="size-3 fill-amber-400 text-amber-400 drop-shadow" />
        </span>
      )}

      {/* ── Cart qty badge ─ */}
      {qty > 0 && (
        <span
          className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center shadow-lg z-10"
          style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 2px 8px rgba(249,115,22,0.5)" }}
        >
          {qty}
        </span>
      )}

      {/* ── Emoji tile ─ */}
      <div
        className={cn("flex items-center justify-center rounded-xl mb-1.5 shadow-lg transition-transform duration-200 bg-gradient-to-br", p.accent)}
        style={{ width: 52, height: 52, fontSize: 26, transform: hovered ? "scale(1.08)" : "scale(1)" }}
      >
        {wasAdded ? (
          <Check className="size-6 text-white drop-shadow-md" />
        ) : (
          p.emoji
        )}
      </div>

      {/* ── Name ─ */}
      <p
        className="text-[10px] font-bold text-center leading-tight line-clamp-2 w-full mb-1"
        style={{ color: dark ? (inCart ? "#c7d2fe" : "#cbd5e1") : (inCart ? "#3730a3" : "#374151") }}
      >
        {p.name}
      </p>

      {/* ── Price + add row ─ */}
      <div className="flex items-center justify-between w-full mt-auto pt-1"
        style={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(99,102,241,0.12)"}` }}
      >
        <span
          className="text-[11px] font-extrabold tabular-nums"
          style={{ color: inCart ? (dark ? "#a5b4fc" : "#4f46e5") : (dark ? "#818cf8" : "#6366f1") }}
        >
          {formatCurrency(p.price)}
        </span>

        {/* +/- controls if in cart, else + */}
        {inCart ? (
          <div className="flex items-center gap-0.5">
            <button
              onClick={onDecrement}
              className="size-5 rounded-md flex items-center justify-center transition-colors"
              style={{ background: dark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)", color: "#ef4444" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.3)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = dark ? "rgba(239,68,68,0.15)" : "rgba(239,68,68,0.1)")}
            >
              <Minus className="size-2.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onAdd(); }}
              className="size-5 rounded-md flex items-center justify-center transition-colors"
              style={{ background: dark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)", color: "#6366f1" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(99,102,241,0.4)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = dark ? "rgba(99,102,241,0.25)" : "rgba(99,102,241,0.15)")}
            >
              <Plus className="size-2.5" />
            </button>
          </div>
        ) : (
          <div
            className="size-5 rounded-md flex items-center justify-center"
            style={{ background: "linear-gradient(135deg,#6366f1,#4f46e5)", color: "#fff", boxShadow: "0 2px 6px rgba(99,102,241,0.4)" }}
          >
            <Plus className="size-3" />
          </div>
        )}
      </div>

      {/* Low stock badge */}
      {p.stock <= 30 && (
        <span
          className="absolute bottom-1 left-1 text-[7px] font-bold px-1 py-px rounded-sm leading-none"
          style={{ background: "rgba(251,146,60,0.2)", color: "#f97316", border: "1px solid rgba(249,115,22,0.3)" }}
        >
          LOW
        </span>
      )}
    </div>
  );
}
