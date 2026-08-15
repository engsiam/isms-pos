import { create } from "zustand";
import type { Product } from "@/types";

interface UiState {
  search: string;
  activeCategory: string;
  cartOpen: boolean;
  sidebarOpen: boolean;
  setSearch: (search: string) => void;
  setActiveCategory: (categoryId: string) => void;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  search: "",
  activeCategory: "all",
  cartOpen: false,
  sidebarOpen: false,

  setSearch: (search) => set({ search }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setCartOpen: (cartOpen) => set({ cartOpen }),
  toggleCart: () => set((state) => ({ cartOpen: !state.cartOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

export const selectFilteredProducts = (
  products: Product[],
  search: string,
  activeCategory: string
): Product[] => {
  const query = search.trim().toLowerCase();
  return products.filter((product) => {
    const matchesCategory = activeCategory === "all" || product.categoryId === activeCategory;
    const matchesSearch = !query || product.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
};