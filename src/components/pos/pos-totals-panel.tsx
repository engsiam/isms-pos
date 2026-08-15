"use client";

import * as React from "react";
import { Printer, RotateCcw, Ban, LogOut, ChevronRight, Zap } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCartStore, selectSubtotal } from "@/store/cart-store";
import { siteConfig } from "@/config/site";

/** Payment methods matching the reference image, each with an icon color */
const TENDER_METHODS = [
  { key: "eastern_bank", label: "Eastern Bank",   icon: "🏦", color: "#3b82f6" },
  { key: "cash",         label: "Cash",           icon: "💵", color: "#10b981" },
  { key: "iecm_cash",    label: "ieCom Cash",     icon: "📱", color: "#8b5cf6" },
  { key: "iecm_online",  label: "ieCom Online",   icon: "🌐", color: "#06b6d4" },
  { key: "mtb_card",     label: "MTB Card",       icon: "💳", color: "#f59e0b" },
  { key: "mtb_qr",       label: "MTB QR",         icon: "📷", color: "#ec4899" },
  { key: "nagad",        label: "Nagad",          icon: "📲", color: "#f97316" },
  { key: "pbl",          label: "PBL",            icon: "🏛️", color: "#6366f1" },
  { key: "ucbl",         label: "UCBL",           icon: "🏦", color: "#14b8a6" },
  { key: "round_off",    label: "Round Off",      icon: "🔁", color: "#94a3b8" },
] as const;

interface PosTotalsPanelProps {
  onVoid: () => void;
}

function fmt(n: number) {
  return `৳${new Intl.NumberFormat("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;
}

export function PosTotalsPanel({ onVoid }: PosTotalsPanelProps) {
  const { lines, clear, checkout } = useCartStore();
  const subtotal = useCartStore(selectSubtotal);

  const [discount, setDiscount] = React.useState("");
  const [tenderAmounts, setTenderAmounts] = React.useState<Record<string, string>>({});
  const [agent, setAgent] = React.useState("Head Of Sales");
  const [loyalty, setLoyalty] = React.useState<"no" | "yes">("no");
  const [printing, setPrinting] = React.useState(false);

  const discountVal = Math.max(0, parseFloat(discount) || 0);
  const tax         = subtotal * siteConfig.taxRate;
  const total       = Math.max(0, subtotal + tax - discountVal);

  const tenderTotal = Object.values(tenderAmounts).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const change      = tenderTotal - total;

  const setTender = (key: string, value: string) =>
    setTenderAmounts((p) => ({ ...p, [key]: value }));

  const reset = () => { setDiscount(""); setTenderAmounts({}); };

  const handlePrint = async () => {
    if (!lines.length) { toast.error("Cart is empty."); return; }
    setPrinting(true);
    await new Promise((r) => setTimeout(r, 700));
    const receipt = checkout();
    setPrinting(false);
    if (!receipt) return;
    reset();
    toast.success(
      <div>
        <p className="font-bold">✅ Invoice {receipt.id}</p>
        <p className="text-xs mt-0.5 opacity-80">
          ৳{receipt.total.toFixed(2)} · {receipt.lines.length} item{receipt.lines.length !== 1 ? "s" : ""}
        </p>
      </div>,
      { duration: 6000 }
    );
  };

  const handleVoid = () => {
    if (!lines.length) return;
    clear(); reset(); onVoid();
    toast.warning("Transaction voided.");
  };

  return (
    <div
      className="flex flex-col h-full text-[11px] select-none"
      style={{ background: "linear-gradient(175deg,#0a0f2e 0%,#0d1b4b 35%,#0a0f2e 100%)" }}
    >
      {/* ── Status strip ─────────────────────────────── */}
      <div
        className="shrink-0 flex items-center gap-2 px-4 py-2 border-b"
        style={{ borderColor: "rgba(99,102,241,0.2)", background: "rgba(99,102,241,0.07)" }}
      >
        <span className="relative flex size-2">
          <span className="animate-ping absolute size-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative rounded-full size-2 bg-emerald-500" />
        </span>
        <span className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">Current Sale</span>
        <span className="ml-auto text-indigo-500 text-[10px]">
          {lines.length} item{lines.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Totals ───────────────────────────────────── */}
      <div className="shrink-0 px-4 py-3 space-y-2 border-b" style={{ borderColor: "rgba(99,102,241,0.15)" }}>
        {/* MRP Total */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">MRP Total</span>
          <span className="tabular-nums text-white/80">{fmt(subtotal)}</span>
        </div>
        {/* Tax */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">(+) SD ({Math.round(siteConfig.taxRate * 100)}%)</span>
          <span className="tabular-nums text-white/70">{fmt(tax)}</span>
        </div>
        {/* Discount */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400">(-) Discount</span>
          <input
            type="number" min="0" step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            placeholder="0.00"
            className="w-20 rounded-lg text-right px-2 py-1 text-[11px] tabular-nums focus:outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#fbbf24")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          />
        </div>

        {/* TOTAL card */}
        <div
          className="rounded-2xl p-3 mt-2"
          style={{
            background: "linear-gradient(135deg,rgba(99,102,241,0.15),rgba(99,102,241,0.05))",
            border: "1px solid rgba(99,102,241,0.3)",
            boxShadow: total > 0 ? "0 0 30px rgba(250,204,21,0.08) inset, 0 0 30px rgba(99,102,241,0.1)" : "none",
          }}
        >
          <div className="flex justify-between items-center">
            <span
              className="font-black tracking-widest uppercase"
              style={{ fontSize: 15, color: "#fde68a" }}
            >
              TOTAL
            </span>
            <span
              className="font-black tabular-nums"
              style={{
                fontSize: 18,
                color: total > 0 ? "#fde68a" : "rgba(255,255,255,0.3)",
                textShadow: total > 0 ? "0 0 20px rgba(251,191,36,0.5)" : "none",
              }}
            >
              {fmt(total)}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tender details ────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div
          className="flex justify-between items-center px-4 py-1.5 text-[9px] font-extrabold uppercase tracking-widest sticky top-0 backdrop-blur-sm"
          style={{ color: "#6366f1", background: "rgba(10,15,46,0.9)", borderBottom: "1px solid rgba(99,102,241,0.12)" }}
        >
          <span>Tender Details</span>
          <span>Amount</span>
        </div>

        {TENDER_METHODS.map((m) => (
          <div
            key={m.key}
            className="flex items-center justify-between px-3 py-1.5 group transition-colors"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "rgba(99,102,241,0.06)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "")}
          >
            <div className="flex items-center gap-2">
              {/* Colored dot */}
              <span
                className="size-2 rounded-full shrink-0"
                style={{ background: m.color, boxShadow: `0 0 6px ${m.color}80` }}
              />
              <span className="text-sm">{m.icon}</span>
              <span className="text-white/70 group-hover:text-white/95 transition-colors">{m.label}</span>
            </div>
            <input
              type="number" min="0" step="0.01"
              value={tenderAmounts[m.key] ?? ""}
              onChange={(e) => setTender(m.key, e.target.value)}
              placeholder="—"
              className="w-[4.5rem] bg-transparent text-right px-1 py-0.5 text-white tabular-nums text-[11px] focus:outline-none transition-colors placeholder:text-white/15"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
              onFocus={(e) => (e.target.style.borderBottomColor = "#fbbf24")}
              onBlur={(e) => (e.target.style.borderBottomColor = "rgba(255,255,255,0.1)")}
            />
          </div>
        ))}

        {/* Summary */}
        <div
          className="mx-3 mt-2 mb-1 rounded-2xl overflow-hidden"
          style={{ border: "1px solid rgba(99,102,241,0.2)" }}
        >
          <div className="flex justify-between items-center px-3 py-2" style={{ background: "rgba(16,185,129,0.08)" }}>
            <span className="text-emerald-400 font-bold">Payable Amount</span>
            <span className="tabular-nums text-emerald-400 font-bold">{fmt(total)}</span>
          </div>
          <div className="flex justify-between items-center px-3 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <span className="text-white/50">Cash Receive</span>
            <span className="tabular-nums font-semibold" style={{ color: "#fde68a" }}>{fmt(tenderTotal)}</span>
          </div>

          {change > 0.004 && (
            <div className="flex justify-between items-center px-3 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(16,185,129,0.12)" }}>
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <ChevronRight className="size-3" /> Change Return
              </span>
              <span className="tabular-nums text-emerald-300 font-extrabold text-sm">{fmt(change)}</span>
            </div>
          )}
          {change < -0.004 && (
            <div className="flex justify-between items-center px-3 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(244,63,94,0.12)" }}>
              <span className="text-rose-300">Remaining</span>
              <span className="tabular-nums text-rose-300 font-bold">{fmt(Math.abs(change))}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Agent / Loyalty ──────────────────────────── */}
      <div className="shrink-0 px-4 py-2 space-y-2" style={{ borderTop: "1px solid rgba(99,102,241,0.15)", background: "rgba(99,102,241,0.04)" }}>
        <div className="flex items-center gap-2">
          <span className="text-indigo-400 shrink-0">Agent</span>
          <select
            value={agent}
            onChange={(e) => setAgent(e.target.value)}
            className="flex-1 text-[11px] px-2 py-1.5 rounded-lg focus:outline-none transition-colors"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(99,102,241,0.25)", color: "#e0e7ff" }}
          >
            <option className="bg-slate-900">Head Of Sales</option>
            <option className="bg-slate-900">Cashier</option>
            <option className="bg-slate-900">Supervisor</option>
            <option className="bg-slate-900">Floor Manager</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          {["Touch", "Select"].map((label) => (
            <label key={label} className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" defaultChecked={label === "Touch"} className="accent-indigo-400 rounded" />
              <span className="text-white/50">{label}</span>
            </label>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-indigo-400 text-[10px]">Loyalty</span>
            {(["no", "yes"] as const).map((v) => (
              <label key={v} className="flex items-center gap-1 cursor-pointer">
                <input type="radio" name="loyalty" checked={loyalty === v} onChange={() => setLoyalty(v)} className="accent-indigo-400" />
                <span className="text-white/50 capitalize">{v}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ── Action Buttons ────────────────────────────── */}
      <div className="shrink-0 p-3 space-y-2" style={{ borderTop: "1px solid rgba(99,102,241,0.15)" }}>
        {/* PRINT */}
        <button
          onClick={handlePrint}
          disabled={!lines.length || printing}
          id="pos-print-btn"
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-extrabold text-sm tracking-widest transition-all",
            (!lines.length || printing) ? "cursor-not-allowed" : "hover:brightness-110 active:scale-[0.97]"
          )}
          style={
            lines.length > 0 && !printing
              ? { background: "linear-gradient(135deg,#059669,#047857)", boxShadow: "0 4px 20px rgba(5,150,105,0.4)", color: "#fff" }
              : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.2)" }
          }
        >
          {printing
            ? <><Zap className="size-4 animate-spin" /> Printing…</>
            : <><Printer className="size-4" /> PRINT</>
          }
        </button>

        {/* Reprint row */}
        <div className="grid grid-cols-2 gap-2">
          {["Reprint Last Invoice", "Reprint"].map((label) => (
            <button
              key={label}
              className="flex items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-semibold transition-all"
              style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#a5b4fc" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.2)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.1)")}
            >
              <RotateCcw className="size-3" /> {label}
            </button>
          ))}
        </div>

        {/* VOID / EXIT */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleVoid}
            disabled={!lines.length}
            id="pos-void-btn"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-extrabold tracking-widest text-sm transition-all"
            style={
              lines.length > 0
                ? { background: "linear-gradient(135deg,#be123c,#881337)", color: "#fff", boxShadow: "0 4px 16px rgba(190,18,60,0.35)" }
                : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.15)" }
            }
          >
            <Ban className="size-3.5" /> VOID
          </button>
          <button
            onClick={() => { if (lines.length > 0) { toast.info("Complete or void first."); return; } window.close(); }}
            id="pos-exit-btn"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-extrabold tracking-widest text-sm transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)")}
          >
            <LogOut className="size-3.5" /> EXIT
          </button>
        </div>
      </div>
    </div>
  );
}
