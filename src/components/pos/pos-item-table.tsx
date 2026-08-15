"use client";

import * as React from "react";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import { useCartStore, selectSubtotal } from "@/store/cart-store";
import { siteConfig } from "@/config/site";
import { useDark } from "@/lib/use-dark";

export function PosItemTable() {
  const dark = useDark();
  const { lines, updateQuantity, removeItem } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);
  const tax = subtotal * siteConfig.taxRate;
  const cols = "grid-cols-[2.5rem_1fr_6rem_8.5rem_7rem]";

  /* theme-aware colors */
  const tableBg    = dark ? "#0d1117" : "#f8faff";
  const rowEven    = dark ? "#0f172a" : "#ffffff";
  const rowOdd     = dark ? "#111827" : "#eef2ff";
  const rowHover   = dark ? "#1e1b4b" : "#e0e7ff";
  const borderClr  = dark ? "rgba(99,102,241,0.1)" : "rgba(209,213,219,0.8)";
  const textMain   = dark ? "#e2e8f0" : "#1e293b";
  const textMuted  = dark ? "#64748b" : "#6b7280";
  const footerBg   = dark ? "#0a0f1e" : "#eef2ff";

  return (
    <div className="flex flex-col flex-1 min-h-0 transition-colors duration-300" style={{ background: tableBg }}>
      {/* Column headers — always deep violet/indigo */}
      <div
        className={`grid ${cols} shrink-0 select-none text-[10px] font-extrabold text-slate-300 uppercase tracking-widest`}
        style={{ background: "linear-gradient(135deg,#312e81 0%,#1e1b4b 60%,#0f172a 100%)" }}
      >
        {[
          { label: "#",          cls: "text-center" },
          { label: "Description", cls: "" },
          { label: "Unit Price",  cls: "text-right" },
          { label: "Quantity",    cls: "text-center" },
          { label: "Line Total",  cls: "text-right" },
        ].map(({ label, cls }) => (
          <div key={label} className={`px-3 py-2.5 border-r last:border-r-0 ${cls}`}
            style={{ borderColor: "rgba(255,255,255,0.08)" }}>
            {label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto">
        {lines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)" }}
            >
              <ShoppingCart className="size-7" style={{ color: dark ? "#6366f1" : "#818cf8" }} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: textMuted }}>No items in current sale</p>
              <p className="text-xs mt-0.5" style={{ color: dark ? "#374151" : "#9ca3af" }}>
                Click a product card above or scan a barcode to begin
              </p>
            </div>
          </div>
        ) : (
          <>
            {lines.map((line, idx) => (
              <div
                key={line.productId}
                className={`grid ${cols} text-xs group transition-colors duration-100`}
                style={{ borderBottom: `1px solid ${borderClr}` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = rowHover)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = idx % 2 === 0 ? rowEven : rowOdd)}
              >
                {/* Row # */}
                <div className="flex items-center justify-center px-2 py-2.5 font-mono text-[10px]"
                  style={{ color: textMuted, borderRight: `1px solid ${borderClr}`, background: idx % 2 === 0 ? rowEven : rowOdd }}>
                  {String(idx + 1).padStart(2, "0")}
                </div>

                {/* Description */}
                <div className="flex items-center gap-2.5 px-3 py-2 min-w-0"
                  style={{ borderRight: `1px solid ${borderClr}`, background: idx % 2 === 0 ? rowEven : rowOdd }}>
                  <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-sm bg-gradient-to-br from-indigo-400 to-indigo-600`}>
                    {line.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate text-[12px]" style={{ color: textMain }}>{line.name}</p>
                    <p className="text-[9px] font-mono truncate" style={{ color: textMuted }}>{line.productId}</p>
                  </div>
                </div>

                {/* Unit price */}
                <div className="flex items-center justify-end px-3 py-2.5 tabular-nums font-medium"
                  style={{ color: textMain, borderRight: `1px solid ${borderClr}`, background: idx % 2 === 0 ? rowEven : rowOdd }}>
                  {formatCurrency(line.unitPrice)}
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-center px-2 py-2"
                  style={{ borderRight: `1px solid ${borderClr}`, background: idx % 2 === 0 ? rowEven : rowOdd }}>
                  <div className="flex items-center rounded-xl overflow-hidden shadow-sm"
                    style={{ border: `1px solid ${dark ? "#334155" : "#c7d2fe"}` }}>
                    <button onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                      className="w-7 h-8 flex items-center justify-center transition-colors"
                      style={{ background: dark ? "#1e293b" : "#f8faff", color: dark ? "#94a3b8" : "#6366f1" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = dark ? "#4c0519" : "#ffe4e6")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = dark ? "#1e293b" : "#f8faff")}
                    >
                      <Minus className="size-3" />
                    </button>
                    <input type="number" min={1} max={99} value={line.quantity}
                      onChange={(e) => updateQuantity(line.productId, Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-10 text-center text-xs font-bold tabular-nums border-x h-8 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      style={{ background: dark ? "#0f172a" : "#fff", color: textMain, borderColor: dark ? "#334155" : "#c7d2fe" }}
                    />
                    <button onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                      disabled={line.quantity >= 99}
                      className="w-7 h-8 flex items-center justify-center transition-colors disabled:opacity-30"
                      style={{ background: dark ? "#1e293b" : "#f8faff", color: dark ? "#94a3b8" : "#6366f1" }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = dark ? "#064e3b" : "#d1fae5")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = dark ? "#1e293b" : "#f8faff")}
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div className="flex items-center justify-between px-3 py-2.5"
                  style={{ background: idx % 2 === 0 ? rowEven : rowOdd }}>
                  <span className="tabular-nums font-bold" style={{ color: textMain }}>
                    {formatCurrency(line.unitPrice * line.quantity)}
                  </span>
                  <button onClick={() => removeItem(line.productId)}
                    className="opacity-0 group-hover:opacity-100 transition-all ml-1 active:scale-90"
                    style={{ color: dark ? "#ef4444" : "#f43f5e" }}
                    aria-label={`Remove ${line.name}`}
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Subtotal footer */}
            <div className={`grid ${cols} border-t-2 text-xs`}
              style={{ background: footerBg, borderColor: dark ? "rgba(99,102,241,0.2)" : "#c7d2fe" }}>
              <div />
              <div className="px-3 py-2.5 font-semibold" style={{ color: textMuted }}>
                {lines.length} item{lines.length !== 1 ? "s" : ""}
              </div>
              <div className="px-3 py-2.5 text-right" style={{ color: textMuted }}>
                <span className="text-[10px]">Subtotal</span>
              </div>
              <div className="px-3 py-2.5 text-center text-[10px]" style={{ color: textMuted }}>
                +{Math.round(siteConfig.taxRate * 100)}% tax
              </div>
              <div className="px-3 py-2.5 flex flex-col items-end">
                <span className="tabular-nums font-extrabold text-sm" style={{ color: dark ? "#a5b4fc" : "#4f46e5" }}>
                  {formatCurrency(subtotal + tax)}
                </span>
                <span className="text-[9px] tabular-nums" style={{ color: textMuted }}>
                  incl. {formatCurrency(tax)} tax
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
