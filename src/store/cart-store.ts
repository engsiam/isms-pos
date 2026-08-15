import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine, CheckoutReceipt, SaleMethod } from "@/types";

interface CartState {
  lines: CartLine[];
  method: SaleMethod;
  addItem: (productId: string, name: string, emoji: string, unitPrice: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  setMethod: (method: SaleMethod) => void;
  checkout: () => CheckoutReceipt | null;
}

const MAX_LINE_QTY = 99;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      method: "cash",

      addItem: (productId, name, emoji, unitPrice) =>
        set((state) => {
          const existing = state.lines.find((line) => line.productId === productId);
          if (existing) {
            return {
              lines: state.lines.map((line) =>
                line.productId === productId
                  ? {
                      ...line,
                      quantity: Math.min(line.quantity + 1, MAX_LINE_QTY),
                    }
                  : line
              ),
            };
          }
          return {
            lines: [...state.lines, { productId, name, emoji, unitPrice, quantity: 1 }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({
          lines: state.lines.filter((line) => line.productId !== productId),
        })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((line) => line.productId !== productId)
              : state.lines.map((line) =>
                  line.productId === productId
                    ? { ...line, quantity: Math.min(quantity, MAX_LINE_QTY) }
                    : line
                ),
        })),

      clear: () => set({ lines: [] }),

      setMethod: (method) => set({ method }),

      checkout: () => {
        const { lines, method } = get();
        if (lines.length === 0) return null;

        const subtotal = lines.reduce(
          (sum, line) => sum + line.unitPrice * line.quantity,
          0
        );
        const receipt: CheckoutReceipt = {
          id: `INV-${Date.now().toString(36).toUpperCase()}`,
          lines: lines.map((line) => ({ ...line })),
          subtotal,
          tax: 0,
          total: subtotal,
          createdAt: new Date().toISOString(),
        };

        set({ lines: [] });
        return receipt;
      },
    }),
    {
      name: "ism-pos-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines, method: state.method }),
    }
  )
);

export const selectCartCount = (state: CartState): number =>
  state.lines.reduce((sum, line) => sum + line.quantity, 0);

export const selectSubtotal = (state: CartState): number =>
  state.lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);