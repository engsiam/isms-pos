"use client";

import * as React from "react";
import { Menu, Moon, Search, ShoppingCart, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore, selectCartCount } from "@/store/cart-store";
import { useUiStore } from "@/store/ui-store";
import { isTauri, getAppVersion } from "@/lib/tauri";

export function Topbar() {
  const { theme, setTheme } = useTheme();
  const { search, setSearch, toggleCart, toggleSidebar } = useUiStore();
  const cartCount = useCartStore(selectCartCount);
  const [version, setVersion] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    if (isTauri()) {
      getAppVersion()
        .then((v) => mounted && setVersion(v))
        .catch(() => {});
    }
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open navigation"
      >
        <Menu className="size-5" />
      </Button>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <h1 className="truncate text-base font-semibold sm:text-lg">Point of Sale</h1>
          {version && (
            <span className="hidden rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-flex">
              desktop {version}
            </span>
          )}
        </div>
        <p className="hidden text-xs text-muted-foreground sm:block">
          New sale · Ready to scan items
        </p>
      </div>

      {/* Search */}
      <div className="relative hidden flex-1 md:block md:max-w-xs">
        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="pl-9"
          aria-label="Search products"
        />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
        className="hidden sm:inline-flex"
      >
        {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
      </Button>

      {/* Cart button */}
      <Button
        onClick={toggleCart}
        size="sm"
        className="relative gap-2 lg:hidden"
        aria-label="Open cart"
      >
        <ShoppingCart className="size-4" />
        <span className="hidden sm:inline">Cart</span>
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {cartCount}
          </span>
        )}
      </Button>
    </header>
  );
}