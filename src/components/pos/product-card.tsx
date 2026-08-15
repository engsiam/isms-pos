"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/cart-store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <Card
      className="group relative gap-0 overflow-hidden py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      data-testid={`product-card-${product.id}`}
    >
      <CardContent className="px-4">
        {/* Emoji tile */}
        <div
          className={`relative flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-gradient-to-br ${product.accent} opacity-90`}
        >
          <span className="text-4xl drop-shadow-sm transition-transform duration-200 group-hover:scale-110 sm:text-5xl">
            {product.emoji}
          </span>
          {product.popular && (
            <Badge className="absolute top-2 left-2 bg-white/90 text-[10px] text-foreground backdrop-blur">
              Popular
            </Badge>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1.5">
          <h3 className="truncate text-sm font-semibold">{product.name}</h3>
          <p className="text-muted-foreground line-clamp-1 text-xs">{product.description}</p>
          <div className="flex items-center justify-between pt-0.5">
            <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
            <Button
              size="icon-sm"
              variant="secondary"
              onClick={() =>
                addItem(product.id, product.name, product.emoji, product.barcode || "2400153", product.price)
              }
              aria-label={`Add ${product.name} to cart`}
              className="rounded-full"
            >
              <Plus className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}