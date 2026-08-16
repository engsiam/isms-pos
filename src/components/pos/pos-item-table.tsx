"use client";

import * as React from "react";
import { Trash2, Plus, Minus, ShoppingBag, RotateCcw, Pause } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function PosItemTable() {
  const { lines, updateQuantity, removeItem, clear, loadDefaultItems, note, setNote } = useCartStore();
  const [showNoteInput, setShowNoteInput] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleHoldOrder = React.useCallback(() => {
    if (lines.length === 0) return;
    toast.info("Order #HOLD-240513 has been put on hold!");
    clear();
  }, [lines, clear]);

  // Keybindings F8 for Hold
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F8") {
        e.preventDefault();
        handleHoldOrder();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleHoldOrder]);

  const cartLines = mounted ? lines : [];

  return (
    <div className="flex flex-col flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-colors duration-300 min-h-0">
      {/* ── Cart Header ───────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-extrabold text-slate-800 dark:text-white tracking-tight">CART</h2>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
            ({cartLines.length} {cartLines.length === 1 ? "Item" : "Items"})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {cartLines.length > 0 && (
            <button
              onClick={handleHoldOrder}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold transition-colors cursor-pointer"
              title="Hold Order (F8)"
            >
              <Pause className="size-3.5 fill-current" />
              <span>Hold (F8)</span>
            </button>
          )}

          {cartLines.length === 0 && (
            <button
              onClick={() => loadDefaultItems()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-600 dark:text-blue-400 text-[11px] font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Load Default Items</span>
            </button>
          )}

          {cartLines.length > 0 && (
            <button
              onClick={() => clear()}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/40 hover:bg-rose-100/70 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
            >
              <Trash2 className="size-3.5" />
              <span>Clear Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Cart Table Content ────────────────────────────── */}
      <div className="flex-1 overflow-x-auto overflow-y-auto">
        {cartLines.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-44 text-slate-400 dark:text-slate-500 gap-2">
            <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
              <ShoppingBag className="size-6" />
            </div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Your cart is empty</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Scan a barcode, select from catalogue above, or load sample data</p>
            <button
              onClick={() => loadDefaultItems()}
              className="mt-1 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Load Default Sample Items</span>
            </button>
          </div>
        ) : (
          <table className="w-full min-w-[500px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6 w-12 text-center">#</th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Barcode</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Qty</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-6 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {cartLines.map((line, idx) => {
                const lineTotal = line.unitPrice * line.quantity;
                return (
                  <tr
                    key={line.productId}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    {/* # Index */}
                    <td className="py-4 px-6 text-center font-medium text-slate-400 dark:text-slate-500">
                      {idx + 1}
                    </td>

                    {/* Product Name & Icon */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950 dark:to-orange-900 border border-amber-200/60 dark:border-amber-700/60 flex items-center justify-center text-xl shrink-0 shadow-xs">
                          {line.emoji || "📦"}
                        </div>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-xs leading-tight">
                          {line.name}
                        </span>
                      </div>
                    </td>

                    {/* Barcode */}
                    <td className="py-4 px-4 font-mono text-slate-500 dark:text-slate-400 text-xs">
                      {line.barcode || "2400153"}
                    </td>

                    {/* Unit Price */}
                    <td className="py-4 px-4 text-right font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                      {formatCurrency(line.unitPrice)}
                    </td>

                    {/* Quantity Stepper */}
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center">
                        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                            className="size-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center font-extrabold text-slate-800 dark:text-white tabular-nums text-xs">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                            className="size-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Line Total */}
                    <td className="py-4 px-4 text-right font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(lineTotal)}
                    </td>

                    {/* Action Trash */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => removeItem(line.productId)}
                        className="size-7 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/80 hover:text-rose-700 flex items-center justify-center transition-colors mx-auto"
                        title="Remove item"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add Note Footer ───────────────────────────────── */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        {showNoteInput ? (
          <div className="flex items-center gap-2">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add order note (e.g. deliver after 5pm)…"
              autoFocus
              className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              onClick={() => setShowNoteInput(false)}
              className="px-3 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNoteInput(true)}
            className="w-full py-2.5 rounded-xl border border-dashed border-blue-300 dark:border-blue-700 bg-blue-50/30 dark:bg-blue-950/30 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus className="size-3.5" />
            <span>{note ? `Note: "${note}"` : "Add Note"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
