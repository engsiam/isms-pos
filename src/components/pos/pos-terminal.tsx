"use client";

import * as React from "react";
import { PosHeader } from "@/components/pos/pos-header";
import { PosTransactionBar } from "@/components/pos/pos-transaction-bar";
import { PosProductPanel } from "@/components/pos/pos-product-panel";
import { PosItemTable } from "@/components/pos/pos-item-table";
import { PosTotalsPanel } from "@/components/pos/pos-totals-panel";
import { PosFooter } from "@/components/pos/pos-footer";

export function POSTerminal() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-slate-100 dark:bg-slate-950 font-sans select-none antialiased transition-colors duration-300">
      {/* ── Top Header ─────────────────────────────── */}
      <PosHeader />

      {/* ── Main POS Workspace ──────────────────────── */}
      <main className="flex-1 p-2.5 sm:p-4 overflow-y-auto lg:overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_380px] gap-3 sm:gap-4 min-h-0">
          {/* Left Column: Controls + Product Panel + Cart Table */}
          <div className="flex flex-col min-w-0 min-h-0 gap-3">
            <PosTransactionBar />
            <PosProductPanel />
            <PosItemTable />
          </div>

          {/* Right Column: Order Summary & Complete Sale */}
          <div className="flex flex-col min-h-0 pb-3 lg:pb-0">
            <PosTotalsPanel />
          </div>
        </div>
      </main>

      {/* ── Bottom Status Bar ───────────────────────── */}
      <PosFooter />
    </div>
  );
}
