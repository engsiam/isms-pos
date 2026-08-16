"use client";

import * as React from "react";
import { CheckCircle2, Calculator, Printer, X, Receipt, FileText } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/format";
import { useCartStore, selectSubtotal } from "@/store/cart-store";
import { useSalesStore, type SaleRecord } from "@/store/sales-store";
import type { SaleMethod } from "@/types";
import { CashIcon, BkashIcon, NagadIcon, CardIcon, OtherPaymentIcon } from "@/components/ui/payment-icons";

export function PosTotalsPanel() {
  const { lines, discount, taxRate, customer, checkout, setDiscount, setTaxRate, clear } = useCartStore();
  const { addSale, selectedOutlet, selectedCashier } = useSalesStore();
  const subtotal = useCartStore(selectSubtotal);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartLines = mounted ? lines : [];

  const [paymentMethod, setPaymentMethod] = React.useState<SaleMethod>("cash");
  const [receivedInput, setReceivedInput] = React.useState<string>("1200");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [discountInput, setDiscountInput] = React.useState<string>(discount.toString());

  // Receipt Modal State
  const [activeReceipt, setActiveReceipt] = React.useState<SaleRecord | null>(null);

  const discountVal = parseFloat(discountInput) || 0;
  const vat = subtotal * taxRate;
  const total = Math.max(0, subtotal - discountVal + vat);

  const amountReceived = parseFloat(receivedInput) || 0;
  const change = Math.max(0, amountReceived - total);

  // Sync discount input with store
  React.useEffect(() => {
    setDiscount(discountVal);
  }, [discountVal, setDiscount]);

  const handleCompleteSale = React.useCallback(async () => {
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

    const fullRecord: SaleRecord = {
      ...receipt,
      customerName: customer.name,
      customerMobile: customer.mobile,
      paymentMethod,
      amountReceived,
      changeReturn: change,
      outlet: selectedOutlet,
      cashier: selectedCashier.split(" ")[0],
    };

    addSale(fullRecord);
    setActiveReceipt(fullRecord);

    toast.success(
      <div>
        <p className="font-extrabold text-sm">✅ Sale Completed Successfully!</p>
        <p className="text-xs opacity-90 mt-0.5">
          Invoice: {fullRecord.id} · Total: {formatCurrency(fullRecord.total)}
        </p>
      </div>,
      { duration: 4000 }
    );
  }, [lines, amountReceived, total, checkout, customer, paymentMethod, change, selectedOutlet, selectedCashier, addSale]);

  const handleNewInvoice = React.useCallback(() => {
    clear();
    setDiscountInput("0");
    setReceivedInput("0");
    toast.info("New Invoice session started");
  }, [clear]);

  // Keybindings F9 (Payment), F10 (Complete Sale), Ctrl+P (Print), F11 (New Invoice)
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F10") {
        e.preventDefault();
        handleCompleteSale();
      } else if (e.key === "F11") {
        e.preventDefault();
        handleNewInvoice();
      } else if (e.key === "F9") {
        e.preventDefault();
        const methods: SaleMethod[] = ["cash", "card", "bkash", "nagad", "other"];
        setPaymentMethod((prev) => {
          const idx = methods.indexOf(prev);
          return methods[(idx + 1) % methods.length];
        });
      } else if (e.ctrlKey && (e.key === "p" || e.key === "P")) {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleCompleteSale, handleNewInvoice]);

  return (
    <>
      {/* ── Invoice Receipt Modal ──────────────────────── */}
      {activeReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs"
          onClick={() => setActiveReceipt(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-800 dark:text-slate-100"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="size-5 text-blue-600" />
                <h3 className="font-extrabold text-sm">Invoice Receipt</h3>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div className="text-center space-y-1 font-mono text-xs">
              <h4 className="font-extrabold text-sm tracking-tight text-blue-900 dark:text-blue-400">SOPNO POS SUPERMARKET</h4>
              <p className="text-[10px] text-slate-500">{activeReceipt.outlet}</p>
              <p className="text-[10px] text-slate-500">Date: {new Date(activeReceipt.createdAt).toLocaleString()}</p>
              <p className="text-[10px] font-bold text-blue-600 pt-1">Invoice #: {activeReceipt.id}</p>
              <p className="text-[10px] text-slate-500">Customer: {activeReceipt.customerName}</p>

              <div className="my-3 border-t border-dashed border-slate-300 dark:border-slate-700" />

              <table className="w-full text-left text-[11px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 font-bold">
                    <th className="py-1">Item</th>
                    <th className="py-1 text-center">Qty</th>
                    <th className="py-1 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {activeReceipt.lines.map((l) => (
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
                  <span className="font-bold">{formatCurrency(activeReceipt.subtotal)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-600">
                  <span>Discount</span>
                  <span className="font-bold">-{formatCurrency(activeReceipt.subtotal - activeReceipt.total)}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-blue-600 pt-1 border-t border-slate-200 dark:border-slate-700">
                  <span>TOTAL PAID</span>
                  <span>{formatCurrency(activeReceipt.total)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Tender ({activeReceipt.paymentMethod.toUpperCase()})</span>
                  <span>{formatCurrency(activeReceipt.amountReceived)}</span>
                </div>
                <div className="flex justify-between text-[10px] text-emerald-600 font-bold">
                  <span>Change Return</span>
                  <span>{formatCurrency(activeReceipt.changeReturn)}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 pt-4">*** Thank you for shopping with us! ***</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <Printer className="size-4" /> Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between h-full select-none transition-colors duration-300">
        <div>
          {/* ── Order Summary Header ───────────────────────── */}
          <h3 className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
            ORDER SUMMARY
          </h3>

          {/* ── Summary breakdown ──────────────────────────── */}
          <div className="space-y-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span>Items</span>
              <span className="font-extrabold text-slate-800 dark:text-white tabular-nums">
                {cartLines.reduce((s, l) => s + l.quantity, 0)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span className="font-extrabold text-slate-800 dark:text-white tabular-nums">
                {formatCurrency(subtotal)}
              </span>
            </div>

            {/* Dynamic Discount Input */}
            <div className="flex justify-between items-center">
              <span>Discount (৳)</span>
              <input
                type="number"
                min="0"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="0"
                className="w-20 px-2 py-1 text-right text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            {/* Dynamic Tax Selection */}
            <div className="flex justify-between items-center">
              <span>VAT / Tax</span>
              <select
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value))}
                className="px-2 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none"
              >
                <option value={0.0}>VAT (0%)</option>
                <option value={0.05}>VAT (5%)</option>
                <option value={0.10}>VAT (10%)</option>
                <option value={0.15}>VAT (15%)</option>
              </select>
            </div>
          </div>

          {/* Dashed divider */}
          <div className="my-3 border-t border-dashed border-slate-200 dark:border-slate-800" />

          {/* ── TOTAL ──────────────────────────────────────── */}
          <div className="flex justify-between items-center mb-5">
            <span className="text-sm font-black tracking-wide text-slate-800 dark:text-white">TOTAL</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums tracking-tight">
              {formatCurrency(total)}
            </span>
          </div>

          {/* ── PAYMENT METHOD (F9) ─────────────────────────── */}
          <div className="mb-4">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              PAYMENT METHOD (F9)
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {/* Cash */}
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  paymentMethod === "cash"
                    ? "border-emerald-500 dark:border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-800"
                }`}
              >
                <CashIcon className="size-5 shrink-0 shadow-xs" />
                <span>Cash</span>
              </button>

              {/* Card */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  paymentMethod === "card"
                    ? "border-blue-600 dark:border-blue-500 bg-blue-500/10 text-blue-900 dark:text-blue-100 shadow-sm ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-800"
                }`}
              >
                <CardIcon className="size-5 shrink-0 shadow-xs" />
                <span>Card</span>
              </button>

              {/* bKash */}
              <button
                onClick={() => setPaymentMethod("bkash")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  paymentMethod === "bkash"
                    ? "border-pink-600 dark:border-pink-500 bg-pink-500/10 text-pink-900 dark:text-pink-100 shadow-sm ring-2 ring-pink-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-pink-300 dark:hover:border-pink-800"
                }`}
              >
                <BkashIcon className="size-5 shrink-0 shadow-xs" />
                <span>bKash</span>
              </button>

              {/* Nagad */}
              <button
                onClick={() => setPaymentMethod("nagad")}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  paymentMethod === "nagad"
                    ? "border-orange-600 dark:border-orange-500 bg-orange-500/10 text-orange-900 dark:text-orange-100 shadow-sm ring-2 ring-orange-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-orange-300 dark:hover:border-orange-800"
                }`}
              >
                <NagadIcon className="size-5 shrink-0 shadow-xs" />
                <span>Nagad</span>
              </button>
            </div>

            {/* Other */}
            <button
              onClick={() => setPaymentMethod("other")}
              className={`w-full mt-1.5 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                paymentMethod === "other"
                  ? "border-slate-600 dark:border-slate-500 bg-slate-500/10 text-slate-900 dark:text-slate-100 shadow-xs ring-2 ring-slate-500/20"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <OtherPaymentIcon className="size-4 shrink-0" />
              <span>Other Payment</span>
            </button>
          </div>

          {/* ── AMOUNT RECEIVED & Quick Buttons ────────────── */}
          <div className="mb-4 space-y-1.5">
            <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              AMOUNT RECEIVED
            </h4>

            <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
              <input
                type="number"
                value={receivedInput}
                onChange={(e) => setReceivedInput(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-3.5 py-2 text-sm font-bold text-slate-800 dark:text-white focus:outline-none tabular-nums bg-transparent"
              />
              <button
                onClick={() => setReceivedInput(total.toString())}
                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors border-l border-slate-100 dark:border-slate-700"
                title="Set exact total"
              >
                <Calculator className="size-4" />
              </button>
            </div>

            {/* Quick cash buttons */}
            <div className="flex gap-1 pt-0.5">
              {[total, 500, 1000, 2000].map((amt, i) => (
                <button
                  key={i}
                  onClick={() => setReceivedInput(amt.toString())}
                  className="flex-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
                >
                  {i === 0 ? "Exact" : `৳${amt}`}
                </button>
              ))}
            </div>
          </div>

          {/* ── CHANGE ─────────────────────────────────────── */}
          <div className="mb-4">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-0.5">
              CHANGE
            </p>
            <p className="text-xl font-black text-emerald-500 dark:text-emerald-400 tabular-nums tracking-tight">
              {formatCurrency(change)}
            </p>
          </div>
        </div>

        {/* ── COMPLETE SALE & ACTION BUTTONS ──────────────── */}
        <div className="space-y-2">
          <button
            onClick={handleCompleteSale}
            disabled={isProcessing || cartLines.length === 0}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
          >
            <CheckCircle2 className="size-4" />
            <span>{isProcessing ? "PROCESSING..." : "F10 COMPLETE SALE"}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => window.print()}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="size-3.5 text-blue-600" />
              <span>Print (Ctrl+P)</span>
            </button>
            <button
              onClick={handleNewInvoice}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="size-3.5 text-blue-600" />
              <span>New Invoice (F11)</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
