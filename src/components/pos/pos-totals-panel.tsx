"use client";

import * as React from "react";
import { CheckCircle2, Calculator, CreditCard, Banknote, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { useCartStore, selectSubtotal } from "@/store/cart-store";
import type { SaleMethod } from "@/types";

export function PosTotalsPanel() {
  const { lines, discount, checkout } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);

  const [paymentMethod, setPaymentMethod] = React.useState<SaleMethod>("cash");
  const [receivedInput, setReceivedInput] = React.useState<string>("1200");
  const [isProcessing, setIsProcessing] = React.useState(false);

  const discountVal = discount;
  const vat = 0.0;
  const total = Math.max(0, subtotal - discountVal + vat);

  const amountReceived = parseFloat(receivedInput) || 0;
  const change = Math.max(0, amountReceived - total);

  const handleCompleteSale = async () => {
    if (lines.length === 0) {
      toast.error("Cart is empty — add products first!");
      return;
    }
    if (amountReceived < total) {
      toast.error(`Received amount (${formatCurrency(amountReceived)}) is less than total (${formatCurrency(total)})`);
      return;
    }

    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 600));
    const receipt = checkout();
    setIsProcessing(false);

    if (!receipt) return;

    toast.success(
      <div>
        <p className="font-extrabold text-sm">✅ Sale Completed Successfully!</p>
        <p className="text-xs opacity-90 mt-0.5">
          Invoice: {receipt.id} · Total: {formatCurrency(receipt.total)}
        </p>
      </div>,
      { duration: 5000 }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between h-full select-none transition-colors duration-300">
      <div>
        {/* ── Order Summary Header ───────────────────────── */}
        <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-4">
          ORDER SUMMARY
        </h3>

        {/* ── Summary breakdown ──────────────────────────── */}
        <div className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex justify-between items-center">
            <span>Items</span>
            <span className="font-extrabold text-slate-800 dark:text-white tabular-nums">
              {lines.reduce((s, l) => s + l.quantity, 0)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Subtotal</span>
            <span className="font-extrabold text-slate-800 dark:text-white tabular-nums">
              {formatCurrency(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Discount</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {formatCurrency(discountVal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>VAT (0%)</span>
            <span className="font-extrabold text-slate-800 dark:text-white tabular-nums">
              {formatCurrency(vat)}
            </span>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="my-4 border-t border-dashed border-slate-200 dark:border-slate-800" />

        {/* ── TOTAL ──────────────────────────────────────── */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-black tracking-wide text-slate-800 dark:text-white">TOTAL</span>
          <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums tracking-tight">
            {formatCurrency(total)}
          </span>
        </div>

        {/* ── PAYMENT METHOD ─────────────────────────────── */}
        <div className="mb-6">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2.5">
            PAYMENT METHOD
          </h4>

          <div className="grid grid-cols-2 gap-2">
            {/* Cash */}
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                paymentMethod === "cash"
                  ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 shadow-2xs ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="size-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Banknote className="size-3.5" />
              </div>
              <span>Cash</span>
            </button>

            {/* Card */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                paymentMethod === "card"
                  ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 shadow-2xs ring-2 ring-blue-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="size-6 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <CreditCard className="size-3.5" />
              </div>
              <span>Card</span>
            </button>

            {/* bKash */}
            <button
              onClick={() => setPaymentMethod("bkash")}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                paymentMethod === "bkash"
                  ? "border-pink-600 dark:border-pink-500 bg-pink-50/50 dark:bg-pink-950/50 text-pink-900 dark:text-pink-100 shadow-2xs ring-2 ring-pink-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="size-6 rounded-lg bg-pink-100 dark:bg-pink-950 flex items-center justify-center text-pink-600 dark:text-pink-400 font-black text-[10px]">
                bK
              </div>
              <span>bKash</span>
            </button>

            {/* Nagad */}
            <button
              onClick={() => setPaymentMethod("nagad")}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                paymentMethod === "nagad"
                  ? "border-orange-600 dark:border-orange-500 bg-orange-50/50 dark:bg-orange-950/50 text-orange-900 dark:text-orange-100 shadow-2xs ring-2 ring-orange-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="size-6 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 dark:text-orange-400 font-black text-[10px]">
                N
              </div>
              <span>Nagad</span>
            </button>
          </div>

          {/* Other */}
          <button
            onClick={() => setPaymentMethod("other")}
            className={`w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
              paymentMethod === "other"
                ? "border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/50 text-blue-900 dark:text-blue-100 shadow-2xs ring-2 ring-blue-500/20"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
            }`}
          >
            <MoreHorizontal className="size-4 text-slate-400" />
            <span>Other</span>
          </button>
        </div>

        {/* ── AMOUNT RECEIVED ────────────────────────────── */}
        <div className="mb-5">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
            AMOUNT RECEIVED
          </h4>

          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
            <input
              type="number"
              value={receivedInput}
              onChange={(e) => setReceivedInput(e.target.value)}
              placeholder="0.00"
              className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white focus:outline-none tabular-nums bg-transparent"
            />
            <button
              onClick={() => setReceivedInput(total.toString())}
              className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors border-l border-slate-100 dark:border-slate-700"
              title="Exact amount"
            >
              <Calculator className="size-4" />
            </button>
          </div>
        </div>

        {/* ── CHANGE ─────────────────────────────────────── */}
        <div className="mb-6">
          <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
            CHANGE
          </p>
          <p className="text-xl font-black text-emerald-500 dark:text-emerald-400 tabular-nums tracking-tight">
            {formatCurrency(change)}
          </p>
        </div>
      </div>

      {/* ── COMPLETE SALE BUTTON ─────────────────────────── */}
      <button
        onClick={handleCompleteSale}
        disabled={isProcessing || lines.length === 0}
        className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 transition-all"
      >
        <CheckCircle2 className="size-4" />
        <span>{isProcessing ? "PROCESSING..." : "COMPLETE SALE"}</span>
      </button>
    </div>
  );
}
