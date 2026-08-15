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
  barcode: string;
  accent: string;
  popular?: boolean;
  stock: number;
  image?: string;
}

export interface CartLine {
  productId: string;
  name: string;
  emoji: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  image?: string;
}

export interface CheckoutReceipt {
  id: string;
  lines: CartLine[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

export type SaleMethod = "cash" | "card" | "bkash" | "nagad" | "other";