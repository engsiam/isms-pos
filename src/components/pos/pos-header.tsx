"use client";

import * as React from "react";
import { ChevronDown, Calendar, Clock, User, Sun, Moon, Building2, Check, Menu, Bell } from "lucide-react";
import { useTheme } from "next-themes";
import { useDark } from "@/lib/use-dark";
import { useSalesStore } from "@/store/sales-store";

export function PosHeader() {
  const { theme, setTheme } = useTheme();
  const dark = useDark();
  const { outlets, selectedOutlet, setOutlet, cashiers, selectedCashier, setCashier } = useSalesStore();

  const [time, setTime] = React.useState("");
  const [date, setDate] = React.useState("");
  const [outletOpen, setOutletOpen] = React.useState(false);
  const [cashierOpen, setCashierOpen] = React.useState(false);

  React.useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
      setDate(
        now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-5 flex items-center justify-between select-none shadow-xs transition-colors duration-300 relative z-30">
      {/* ── Brand + Menu + Outlet ───────────────────────────── */}
      <div className="flex items-center gap-4">
        {/* Brand logo */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
            SOPNO <span className="text-blue-600 font-bold">POS</span>
          </span>
        </div>

        {/* Menu toggle icon */}
        <button
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="size-4 text-slate-600 dark:text-slate-300" />
        </button>

        {/* Outlet dropdown button */}
        <div className="relative">
          <button
            onClick={() => setOutletOpen((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-slate-500 dark:text-slate-400 font-normal">Outlet:</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{selectedOutlet}</span>
            <ChevronDown className="size-3.5 text-slate-400 ml-0.5" />
          </button>

          {outletOpen && (
            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
              <p className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Store Outlet
              </p>
              {outlets.map((o) => (
                <button
                  key={o}
                  onClick={() => {
                    setOutlet(o);
                    setOutletOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-between"
                >
                  <span>{o}</span>
                  {selectedOutlet === o && <Check className="size-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Center: Date & Time ───────────────────────── */}
      <div className="flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="size-4 text-slate-400" />
          <span>{date || "13 May 2024"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="size-4 text-slate-400" />
          <span className="tabular-nums">{time || "10:30 AM"}</span>
        </div>
      </div>

      {/* ── Right: Theme + Status + Bell + User profile ────────── */}
      <div className="flex items-center gap-3.5">
        {/* Status pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Online</span>
        </div>

        {/* Bell notification badge icon */}
        <div className="relative cursor-pointer p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="size-4 text-slate-600 dark:text-slate-300" />
          <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs">
            3
          </span>
        </div>

        {/* Theme toggle button */}
        <button
          onClick={() => setTheme(dark ? "light" : "dark")}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          title={`Switch to ${dark ? "Light" : "Dark"} Mode`}
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-slate-600" />}
        </button>

        {/* Cashier user profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setCashierOpen((v) => !v)}
            className="flex items-center gap-2 pl-2 hover:opacity-80 transition-opacity"
          >
            <div className="size-7 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
              <User className="size-3.5" />
            </div>
            <div className="text-left leading-tight">
              <p className="text-xs font-bold text-slate-800 dark:text-white">
                User: {selectedCashier.split(" ")[0]}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {selectedCashier.includes("(") ? selectedCashier.split("(")[1].replace(")", "") : "Cashier"}
              </p>
            </div>
            <ChevronDown className="size-3.5 text-slate-400 ml-0.5" />
          </button>

          {cashierOpen && (
            <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1 z-50">
              <p className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Select Active Cashier
              </p>
              {cashiers.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setCashier(c);
                    setCashierOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-between"
                >
                  <span>{c}</span>
                  {selectedCashier === c && <Check className="size-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
