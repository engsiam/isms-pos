"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { useDark } from "@/lib/use-dark";

interface FreeItem { code: string; description: string; freeQty: string; manualQty: string; }
const EMPTY: FreeItem = { code: "", description: "", freeQty: "", manualQty: "" };

export function PosFreeItemsBar() {
  const dark = useDark();
  const [items, setItems] = React.useState<FreeItem[]>([{ ...EMPTY }]);
  const update = (idx: number, field: keyof FreeItem, value: string) =>
    setItems((p) => p.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

  const barBg  = dark ? "#0a0f1e" : "#eef2ff";
  const labelC = dark ? "#6366f1" : "#4f46e5";
  const inpBg  = dark ? "#1e293b" : "#ffffff";
  const inpBdr = dark ? "#334155" : "#c7d2fe";
  const inpClr = dark ? "#e2e8f0" : "#1e293b";

  return (
    <div
      className="shrink-0 px-3 py-2 transition-colors duration-300"
      style={{ background: barBg, borderTop: `1px solid ${dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.2)"}` }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: labelC }}>
          Free Items
        </span>
        <button
          onClick={() => setItems((p) => [...p, { ...EMPTY }])}
          className="flex items-center gap-0.5 text-[10px] font-semibold transition-colors"
          style={{ color: labelC }}
        >
          <Plus className="size-2.5" /> Add Row
        </button>
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div key={idx} className="grid gap-2" style={{ gridTemplateColumns: "5.5rem 1fr 5rem 5rem" }}>
            {(["code", "description", "freeQty", "manualQty"] as const).map((field) => (
              <input
                key={field}
                value={item[field]}
                onChange={(e) => update(idx, field, e.target.value)}
                placeholder={field === "code" ? "Item Code" : field === "description" ? "Description" : field === "freeQty" ? "Free Qty" : "Manual Qty"}
                type={field.includes("Qty") ? "number" : "text"}
                className="border px-2 py-1 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-400 transition-all"
                style={{ background: inpBg, borderColor: inpBdr, color: inpClr, textAlign: field.includes("Qty") ? "right" : "left" }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
