import {
  Coffee,
  Cookie,
  Croissant,
  CupSoda,
  GlassWater,
  LayoutGrid,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { categories } from "@/config/products";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const ICONS: Record<string, LucideIcon> = {
  LayoutGrid,
  Coffee,
  CupSoda,
  Croissant,
  Utensils,
  Cookie,
  GlassWater,
};

export function CategoryFilter() {
  const { activeCategory, setActiveCategory } = useUiStore();

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max gap-2 py-0.5">
        {categories.map((category) => {
          const Icon = ICONS[category.icon] ?? LayoutGrid;
          const active = activeCategory === category.id;
          return (
            <Button
              key={category.id}
              variant={active ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "h-8 gap-1.5 rounded-full px-3.5 text-xs font-medium",
                active && "shadow-sm"
              )}
            >
              <Icon className="size-3.5" />
              {category.label}
            </Button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" className="h-1" />
    </ScrollArea>
  );
}