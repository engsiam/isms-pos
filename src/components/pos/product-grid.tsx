"use client";

import * as React from "react";
import { PackageSearch } from "lucide-react";

import { products } from "@/config/products";
import { useUiStore, selectFilteredProducts } from "@/store/ui-store";
import { ProductCard } from "@/components/pos/product-card";
import { CategoryFilter } from "@/components/pos/category-filter";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductGrid() {
  const { search, activeCategory } = useUiStore();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  const filtered = React.useMemo(
    () => selectFilteredProducts(products, search, activeCategory),
    [search, activeCategory]
  );

  return (
    <section aria-label="Products">
      <CategoryFilter />

      {loading ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-16 text-center">
          <PackageSearch className="text-muted-foreground size-8" />
          <p className="font-medium">No products found</p>
          <p className="text-muted-foreground text-sm">
            Try a different search term or category.
          </p>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}