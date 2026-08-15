"use client";

import * as React from "react";

export function PosFooter() {
  return (
    <footer className="h-10 shrink-0 bg-slate-100/90 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 select-none transition-colors duration-300">
      {/* Left: Last Invoice */}
      <div>
        <span className="text-slate-400 dark:text-slate-500">Last Invoice: </span>
        <span className="text-slate-800 dark:text-slate-200 font-bold">INV-240513-00025</span>
      </div>

      {/* Center: Last Payment */}
      <div>
        <span className="text-slate-400 dark:text-slate-500">Last Payment: </span>
        <span className="text-slate-800 dark:text-slate-200 font-bold">৳ 1,000.00 (Cash)</span>
      </div>

      {/* Right: Today's Sales */}
      <div>
        <span className="text-slate-400 dark:text-slate-500">Today's Sales: </span>
        <span className="text-slate-900 dark:text-white font-extrabold">৳ 12,550.00</span>
      </div>
    </footer>
  );
}
