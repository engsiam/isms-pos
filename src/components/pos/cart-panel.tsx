"use client";

import * as React from "react";
import { CheckCircle2, ShoppingBag, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";

import type { SaleMethod } from "@/types";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/format";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CartItemRow } from "@/components/pos/cart-item-row";
import { useCartStore, selectCartCount, selectSubtotal } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { pingBackend } from "@/lib/tauri";

const METHOD_LABELS: Record<SaleMethod, string> = {
  cash: "Cash",
  card: "Card",
  bkash: "bKash",
  nagad: "Nagad",
  other: "Other",
};

export function CartPanel({ className }: { className?: string }) {
  const { lines, method, setMethod, clear, checkout } = useCartStore();
  const { setCartOpen } = useUiStore();
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectSubtotal);
  const tax = subtotal * siteConfig.taxRate;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    const receipt = checkout();
    if (!receipt) return;

    let desktop = false;
    try {
      const pong = await pingBackend();
      desktop = pong.ok;
    } catch {
      desktop = false;
    }

    toast.success(
      <div>
        <p className="font-semibold">Sale completed · {receipt.id}</p>
        <p className="mt-0.5 text-xs opacity-90">
          {formatCurrency(receipt.total)} paid via{" "}
          {METHOD_LABELS[method].toLowerCase()} ·{" "}
          {desktop ? "recorded on device" : "demo mode (no desktop shell)"}
        </p>
      </div>,
      { duration: 5000 }
    );
    setCartOpen(false);
  };

  return (
    <section
      aria-label="Current order"
      className={cn("flex flex-col bg-card", className)}
    >
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="size-4" />
          <h2 className="font-semibold">Current Sale</h2>
          <Badge variant="secondary" className="rounded-full">
            {count}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={clear}
          disabled={count === 0}
          aria-label="Clear cart"
          className="text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      {/* Items */}
      <ScrollArea className="min-h-0 flex-1">
        {lines.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="bg-muted flex size-14 items-center justify-center rounded-full">
              <ShoppingBag className="text-muted-foreground size-6" />
            </div>
            <div>
              <p className="text-sm font-medium">Cart is empty</p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Tap a product to start a sale.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5 p-3">
            {lines.map((line) => (
              <CartItemRow key={line.productId} line={line} />
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="shrink-0 space-y-4 border-t p-4">
        <div className="space-y-1.5 text-sm">
          <div className="text-muted-foreground flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          <div className="text-muted-foreground flex justify-between">
            <span>Tax ({Math.round(siteConfig.taxRate * 100)}%)</span>
            <span className="tabular-nums">{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-base font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-muted p-1" role="group" aria-label="Payment method">
          {(Object.keys(METHOD_LABELS) as SaleMethod[]).map((key) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              aria-pressed={method === key}
              className={cn(
                "flex h-8 items-center justify-center rounded-md text-xs font-medium transition-colors",
                method === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {METHOD_LABELS[key]}
            </button>
          ))}
        </div>

        <Button
          className="h-11 w-full text-sm font-semibold"
          onClick={handleCheckout}
          disabled={count === 0}
        >
          <Wallet className="size-4" />
          Charge {formatCurrency(total)}
        </Button>
      </div>
    </section>
  );
}