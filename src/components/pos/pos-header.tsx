"use client";

import * as React from "react";
import { Moon, Sun, Wifi, Radio } from "lucide-react";
import { useTheme } from "next-themes";
import { isTauri, getAppVersion } from "@/lib/tauri";

export function PosHeader() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [time, setTime] = React.useState("");
  const [date, setDate] = React.useState("");
  const [version, setVersion] = React.useState("1.0.0");

  React.useEffect(() => { setMounted(true); }, []);

  React.useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  React.useEffect(() => {
    if (isTauri()) getAppVersion().then(setVersion).catch(() => {});
  }, []);

  return (
    <header
      className="relative shrink-0 flex items-center gap-0 overflow-hidden select-none"
      style={{ height: 56, background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 55%,#1a1040 100%)" }}
    >
      {/* subtle top border glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent" />

      {/* Brand mark */}
      <div className="flex items-center gap-3 px-4 shrink-0 border-r border-white/10 h-full">
        <div
          className="flex items-center justify-center rounded-xl font-black text-white shadow-lg shadow-red-900/50"
          style={{ width: 44, height: 36, background: "linear-gradient(135deg,#dc2626,#7f1d1d)", fontSize: 11, letterSpacing: "0.12em" }}
        >
          ISM
        </div>
        <div>
          <p className="text-white font-bold text-[12px] leading-none tracking-wide">ISM POS</p>
          <p className="text-indigo-400 text-[9px] mt-0.5 leading-none">v{version}</p>
        </div>
      </div>

      {/* Centre outlet info */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <p className="text-white/90 font-semibold text-[12px] tracking-wide">Outlet : ISM Main Outlet</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-indigo-300 text-[10px]">Version {version}</span>
          <span className="w-px h-3 bg-white/20" />
          <span className="text-indigo-300 text-[10px]">Last Invoice :</span>
          <span className="bg-yellow-400 text-black text-[9px] font-extrabold px-1.5 py-px rounded-md leading-none">
            —
          </span>
        </div>
      </div>

      {/* Right: status + user + clock */}
      <div className="flex items-center gap-3 px-4 shrink-0 border-l border-white/10 h-full">
        {/* online dot */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex size-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
          </span>
          <span className="text-emerald-400 text-[9px] font-semibold hidden md:inline">Online</span>
        </div>

        <div className="w-px h-5 bg-white/10" />

        <div className="text-right">
          <p className="text-white/70 text-[10px] leading-snug">
            User : <span className="text-white font-semibold">ADMIN</span>
            &nbsp;·&nbsp; Terminal : <span className="text-white font-semibold">ISM-POS-01</span>
          </p>
          <div className="flex items-center justify-end gap-2 mt-0.5">
            <span className="text-indigo-300 text-[9px]">{date}</span>
            <span
              className="text-yellow-300 font-extrabold tabular-nums text-[12px] tracking-wider"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {time}
            </span>
          </div>
        </div>

        <div className="w-px h-5 bg-white/10" />

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 active:bg-white/20 transition-all"
          aria-label="Toggle theme"
        >
          {mounted ? (theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />) : <Moon className="size-4" />}
        </button>
      </div>

      {/* subtle bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
    </header>
  );
}
