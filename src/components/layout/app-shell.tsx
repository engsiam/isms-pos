"use client";

import * as React from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CartPanel } from "@/components/pos/cart-panel";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useUiStore } from "@/store/ui-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, cartOpen, setSidebarOpen, setCartOpen } = useUiStore();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar className="hidden lg:flex" />

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="no-scrollbar flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Desktop cart panel (right side) */}
      <CartPanel className="hidden w-[340px] shrink-0 border-l lg:flex" />

      {/* Mobile sidebar sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Sidebar className="h-full w-full border-r-0" />
        </SheetContent>
      </Sheet>

      {/* Mobile cart sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent side="right" className="w-full max-w-md p-0 sm:max-w-md">
          <SheetTitle className="sr-only">Cart</SheetTitle>
          <CartPanel className="h-full w-full border-l-0" />
        </SheetContent>
      </Sheet>
    </div>
  );
}