"use client";

import * as React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

import type { CartLine } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export function CartItemRow({ line }: { line: CartLine }) {
  const { updateQuantity, removeItem } = useCartStore();

  const lineTotal = line.unitPrice * line.quantity;

  return (
    <div className="group flex items-center gap-3 rounded-lg border p-2.5">
      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md text-xl">
        {line.emoji}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium">{line.name}</p>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => removeItem(line.productId)}
            aria-label={`Remove ${line.name}`}
            className="text-muted-foreground size-7 opacity-100 transition-opacity hover:text-destructive lg:opacity-0 lg:group-hover:opacity-100"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
        <p className="text-muted-foreground text-xs">{formatCurrency(line.unitPrice)} each</p>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div
            className="flex items-center rounded-md border"
            aria-label={`Quantity for ${line.name}`}
          >
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-6 rounded-none text-muted-foreground"
              onClick={() => updateQuantity(line.productId, line.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </Button>
            <span className="w-6 text-center text-xs font-semibold tabular-nums">
              {line.quantity}
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              className={cn(
                "size-6 rounded-none text-muted-foreground",
                line.quantity >= 99 && "pointer-events-none opacity-40"
              )}
              onClick={() => updateQuantity(line.productId, line.quantity + 1)}
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </Button>
          </div>
          <p className="text-sm font-semibold tabular-nums">{formatCurrency(lineTotal)}</p>
        </div>
      </div>
    </div>
  );
}