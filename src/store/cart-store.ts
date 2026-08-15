import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartLine, CheckoutReceipt, SaleMethod } from "@/types";

interface CartState {
  lines: CartLine[];
  method: SaleMethod;
  discount: number;
  note: string;
  addItem: (productId: string, name: string, emoji: string, barcode: string, unitPrice: number, image?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  setDiscount: (discount: number) => void;
  setNote: (note: string) => void;
  clear: () => void;
  setMethod: (method: SaleMethod) => void;
  checkout: () => CheckoutReceipt | null;
}

const MAX_LINE_QTY = 99;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [
        {
          productId: "prd-miniket-5kg",
          name: "Rice Miniket 5kg",
          emoji: "🌾",
          barcode: "2400153",
          unitPrice: 350.0,
          quantity: 2,
        },
        {
          productId: "prd-soyabean-1l",
          name: "Fresh Soyabean Oil 1L",
          emoji: "🍾",
          barcode: "6000132",
          unitPrice: 180.0,
          quantity: 1,
        },
        {
          productId: "prd-lifebuoy-125g",
          name: "Lifebuoy Soap 125g",
          emoji: "🧼",
          barcode: "2400165",
          unitPrice: 50.0,
          quantity: 3,
        },
      ],
      method: "cash",
      discount: 30.0,
      note: "",

      addItem: (productId, name, emoji, barcode, unitPrice, image) =>
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
            lines: [...state.lines, { productId, name, emoji, barcode, unitPrice, quantity: 1, image }],
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

      setDiscount: (discount) => set({ discount }),
      setNote: (note) => set({ note }),

      clear: () => set({ lines: [], discount: 0, note: "" }),

      setMethod: (method) => set({ method }),

      checkout: () => {
        const { lines, method, discount } = get();
        if (lines.length === 0) return null;

        const subtotal = lines.reduce(
          (sum, line) => sum + line.unitPrice * line.quantity,
          0
        );
        const total = Math.max(0, subtotal - discount);

        const receipt: CheckoutReceipt = {
          id: `INV-${new Date().toISOString().slice(2, 10).replace(/-/g, "")}-${Math.floor(10000 + Math.random() * 90000)}`,
          lines: lines.map((line) => ({ ...line })),
          subtotal,
          tax: 0,
          total,
          createdAt: new Date().toISOString(),
        };

        set({ lines: [], discount: 0, note: "" });
        return receipt;
      },
    }),
    {
      name: "sopno-pos-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines, method: state.method, discount: state.discount }),
    }
  )
);

export const selectCartCount = (state: CartState): number =>
  state.lines.reduce((sum, line) => sum + line.quantity, 0);

export const selectSubtotal = (state: CartState): number =>
  state.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);