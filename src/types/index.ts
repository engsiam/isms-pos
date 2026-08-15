export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  emoji: string;
  accent: string;
  popular?: boolean;
  stock: number;
}

export interface CartLine {
  productId: string;
  name: string;
  emoji: string;
  unitPrice: number;
  quantity: number;
}

export interface CheckoutReceipt {
  id: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

export type SaleMethod = "cash" | "card" | "mobile";