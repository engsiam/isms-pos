import { DollarSign, PackageOpen, ReceiptText, TrendingUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { formatCompactCurrency, formatCurrency, formatNumber } from "@/lib/format";

interface Stat {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  icon: typeof DollarSign;
  iconClass: string;
}

const stats: Stat[] = [
  {
    label: "Today's Sales",
    value: formatCurrency(1284.5),
    delta: "+12.4%",
    trend: "up",
    icon: DollarSign,
    iconClass: "bg-emerald-500/10 text-emerald-600",
  },
  {
    label: "Orders",
    value: formatNumber(47),
    delta: "+3.1%",
    trend: "up",
    icon: ReceiptText,
    iconClass: "bg-indigo-500/10 text-indigo-600",
  },
  {
    label: "Avg. Order",
    value: formatCurrency(27.32),
    delta: "+0.8%",
    trend: "up",
    icon: TrendingUp,
    iconClass: "bg-amber-500/10 text-amber-600",
  },
  {
    label: "Items Sold",
    value: formatNumber(318),
    delta: "-2.0%",
    trend: "down",
    icon: PackageOpen,
    iconClass: "bg-rose-500/10 text-rose-600",
  },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="gap-0 py-4 shadow-none sm:py-5">
            <CardContent className="flex items-center gap-3 px-4 sm:px-5">
              <div
                className={`flex size-9 shrink-0 items-center justify-center rounded-lg sm:size-10 ${stat.iconClass}`}
              >
                <Icon className="size-4 sm:size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground truncate text-[11px] font-medium sm:text-xs">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p className="truncate text-sm font-semibold sm:text-lg">{stat.value}</p>
                  <span
                    className={`text-[10px] font-medium sm:text-xs ${
                      stat.trend === "up" ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {stat.delta}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}