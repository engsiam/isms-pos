import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CheckoutReceipt } from "@/types";

export interface SaleRecord extends CheckoutReceipt {
  customerName: string;
  customerMobile?: string;
  paymentMethod: string;
  amountReceived: number;
  changeReturn: number;
  outlet: string;
  cashier: string;
  note?: string;
}

interface SalesState {
  salesHistory: SaleRecord[];
  outlets: string[];
  selectedOutlet: string;
  cashiers: string[];
  selectedCashier: string;
  addSale: (sale: SaleRecord) => void;
  setOutlet: (outlet: string) => void;
  setCashier: (cashier: string) => void;
  getLastSale: () => SaleRecord | null;
  getTodaySalesTotal: () => number;
}

const DEFAULT_SALES: SaleRecord[] = [
  {
    id: "INV-240513-00025",
    customerName: "Walk-in Customer",
    paymentMethod: "cash",
    subtotal: 1030,
    tax: 0,
    total: 1000,
    amountReceived: 1200,
    changeReturn: 200,
    outlet: "F277 Ramganj Outlet",
    cashier: "LAS1421",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    lines: [
      {
        productId: "prd-miniket-5kg",
        name: "Rice Miniket 5kg",
        emoji: "🌾",
        barcode: "2400153",
        unitPrice: 350,
        quantity: 2,
      },
      {
        productId: "prd-soyabean-1l",
        name: "Fresh Soyabean Oil 1L",
        emoji: "🍾",
        barcode: "6000132",
        unitPrice: 180,
        quantity: 1,
      },
      {
        productId: "prd-lifebuoy-125g",
        name: "Lifebuoy Soap 125g",
        emoji: "🧼",
        barcode: "2400165",
        unitPrice: 50,
        quantity: 3,
      },
    ],
  },
];

export const useSalesStore = create<SalesState>()(
  persist(
    (set, get) => ({
      salesHistory: DEFAULT_SALES,
      outlets: [
        "F277 Ramganj Outlet",
        "Dhanmondi Branch",
        "Gulshan Branch",
        "Uttara Branch",
        "Chittagong Main",
      ],
      selectedOutlet: "F277 Ramganj Outlet",
      cashiers: ["LAS1421 (Cashier)", "ADMIN (Supervisor)", "MGR001 (Manager)"],
      selectedCashier: "LAS1421 (Cashier)",

      addSale: (sale) =>
        set((state) => ({
          salesHistory: [sale, ...state.salesHistory],
        })),

      setOutlet: (outlet) => set({ selectedOutlet: outlet }),
      setCashier: (cashier) => set({ selectedCashier: cashier }),

      getLastSale: () => {
        const { salesHistory } = get();
        return salesHistory.length > 0 ? salesHistory[0] : null;
      },

      getTodaySalesTotal: () => {
        const { salesHistory } = get();
        const todayStr = new Date().toISOString().slice(0, 10);
        return salesHistory
          .filter((s) => s.createdAt.startsWith(todayStr))
          .reduce((sum, s) => sum + s.total, 0);
      },
    }),
    {
      name: "sopno-pos-sales-history",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
