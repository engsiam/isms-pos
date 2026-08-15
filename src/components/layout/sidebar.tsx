"use client";

import * as React from "react";
import Link from "next/link";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground flex h-full w-16 shrink-0 flex-col border-r lg:w-60",
        className
      )}
    >
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b px-3 lg:px-5">
        <div className="from-primary to-indigo-600 flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white shadow-sm">
          ISM
        </div>
        <div className="hidden lg:block">
          <p className="text-sm leading-tight font-semibold">ISM POS</p>
          <p className="text-muted-foreground text-[11px]">Point of Sale</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4 lg:px-3">
        {siteConfig.nav.map((item) => {
          const Icon = ICONS[item.icon] ?? Store;
          const active = item.label === "Point of Sale";
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors lg:px-3",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              <span className="hidden flex-1 lg:block">{item.label}</span>
              {item.label === "Orders" && (
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className="hidden rounded-full px-1.5 text-[10px] lg:inline-flex"
                >
                  8
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-2 py-4 lg:px-3">
        <div className="hidden flex-col gap-3 lg:flex">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-full text-xs font-bold">
              OP
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">Operator</p>
              <p className="text-muted-foreground truncate text-[11px]">Main Shift</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>v1.0.0</span>
            <span className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Online
            </span>
          </div>
        </div>
        <Settings className="size-5 text-muted-foreground lg:hidden" />
      </div>
    </aside>
  );
}