"use client";

import * as React from "react";
import { useSalesStore, type SaleRecord } from "@/store/sales-store";
import { formatCurrency } from "@/lib/format";
import { History, Printer, X } from "lucide-react";

export function PosFooter() {
  const { salesHistory, getLastSale, getTodaySalesTotal } = useSalesStore();
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [selectedReceipt, setSelectedReceipt] = React.useState<SaleRecord | null>(null);

  const lastSale = getLastSale();
  const todayTotal = getTodaySalesTotal();

  return (
    <>
      {/* ── Sales History & Invoice Reprint Modal ────────── */}
      {(historyOpen || selectedReceipt) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => {
            setHistoryOpen(false);
            setSelectedReceipt(null);
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <History className="size-5 text-blue-600" />
                <h3 className="font-extrabold text-base">Sales History & Receipt Reprint</h3>
              </div>
              <button
                onClick={() => {
                  setHistoryOpen(false);
                  setSelectedReceipt(null);
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                <X className="size-4" />
              </button>
            </div>

            {selectedReceipt ? (
              /* Receipt Detailed View */
              <div className="space-y-4 overflow-y-auto flex-1">
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline mb-2"
                >
                  ← Back to Sales List
                </button>
                <div className="text-center space-y-1 font-mono text-xs p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-extrabold text-sm tracking-tight text-blue-900 dark:text-blue-400">SOPNO POS SUPERMARKET</h4>
                  <p className="text-[10px] text-slate-500">{selectedReceipt.outlet}</p>
                  <p className="text-[10px] text-slate-500">Date: {new Date(selectedReceipt.createdAt).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-blue-600 pt-1">Invoice #: {selectedReceipt.id}</p>
                  <p className="text-[10px] text-slate-500">Customer: {selectedReceipt.customerName}</p>

                  <div className="my-3 border-t border-dashed border-slate-300 dark:border-slate-700" />

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 font-bold">
                        <th className="py-1">Item</th>
                        <th className="py-1 text-center">Qty</th>
                        <th className="py-1 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {selectedReceipt.lines.map((l) => (
                        <tr key={l.productId}>
                          <td className="py-1 font-medium">{l.name}</td>
                          <td className="py-1 text-center">{l.quantity}</td>
                          <td className="py-1 text-right tabular-nums">{formatCurrency(l.unitPrice * l.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="my-3 border-t border-dashed border-slate-300 dark:border-slate-700" />

                  <div className="space-y-1 text-right font-sans">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-bold">{formatCurrency(selectedReceipt.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-blue-600 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>TOTAL PAID</span>
                      <span>{formatCurrency(selectedReceipt.total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Printer className="size-4" /> Print Receipt
                </button>
              </div>
            ) : (
              /* Sales History Table */
              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Invoice #</th>
                      <th className="py-2.5 px-3">Customer</th>
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Method</th>
                      <th className="py-2.5 px-3 text-right">Total</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {salesHistory.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-600">{s.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-700 dark:text-slate-200">{s.customerName}</td>
                        <td className="py-2.5 px-3 text-slate-400 text-[11px]">{new Date(s.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2.5 px-3 capitalize font-bold text-emerald-600">{s.paymentMethod}</td>
                        <td className="py-2.5 px-3 text-right font-black tabular-nums">{formatCurrency(s.total)}</td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => setSelectedReceipt(s)}
                            className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 rounded-lg text-[10px] font-bold"
                          >
                            View / Reprint
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="h-9 shrink-0 bg-[#070b15] dark:bg-[#070b15] border-t border-slate-800 px-6 flex items-center justify-between text-xs font-semibold text-slate-300 select-none transition-colors duration-300">
        {/* Left: Last Invoice & Reprint */}
        <div className="flex items-center gap-3">
          <div>
            <span className="text-slate-400">Last Invoice: </span>
            <span className="text-white font-bold">
              {lastSale ? lastSale.id : "INV-240513-00025"}
            </span>
          </div>

          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-400 text-[11px] font-bold hover:bg-blue-900 transition-colors cursor-pointer"
          >
            <History className="size-3" />
            <span>Reprint History</span>
          </button>
        </div>

        {/* Center: Last Payment */}
        <div>
          <span className="text-slate-400">Last Payment: </span>
          <span className="text-white font-bold">
            {lastSale ? `${formatCurrency(lastSale.total)} (${lastSale.paymentMethod})` : "৳ 1,000.00 (Cash)"}
          </span>
        </div>

        {/* Right: Today's Sales */}
        <div>
          <span className="text-slate-400">Today's Sales: </span>
          <span className="text-white font-black">
            {formatCurrency(todayTotal > 0 ? todayTotal : 12550)}
          </span>
        </div>
      </footer>
    </>
  );
}
