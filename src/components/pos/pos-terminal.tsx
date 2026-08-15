"use client";

import * as React from "react";
import { toast } from "sonner";
import { useDark } from "@/lib/use-dark";
import { PosHeader } from "@/components/pos/pos-header";
import { PosTransactionBar } from "@/components/pos/pos-transaction-bar";
import { PosProductPanel } from "@/components/pos/pos-product-panel";
import { PosItemTable } from "@/components/pos/pos-item-table";
import { PosFreeItemsBar } from "@/components/pos/pos-free-items-bar";
import { PosTotalsPanel } from "@/components/pos/pos-totals-panel";
import { useCartStore } from "@/store/cart-store";

export function POSTerminal() {
  const dark = useDark();
  const lines = useCartStore((s) => s.lines);

  return (
    <div
      className="flex h-screen w-full flex-col overflow-hidden transition-colors duration-300"
      style={{ background: dark ? "#0a0f1e" : "#f0f4ff" }}
    >
      <PosHeader />
      <PosTransactionBar
        onBillInvoice={() => {
          if (!lines.length) { toast.warning("No items in the current transaction."); return; }
          toast.info("Enter tender amounts and press PRINT to complete the sale.");
        }}
      />

      <div className="flex flex-1 min-h-0">
        {/* LEFT */}
        <div
          className="flex flex-col flex-1 min-w-0 transition-colors duration-300"
          style={{ borderRight: `1px solid ${dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.2)"}` }}
        >
          <PosProductPanel />
          <PosItemTable />
          <PosFreeItemsBar />
        </div>

        {/* RIGHT — always dark navy */}
        <div className="shrink-0 flex flex-col" style={{ width: 300 }}>
          <PosTotalsPanel onVoid={() => {}} />
        </div>
      </div>
    </div>
  );
}
