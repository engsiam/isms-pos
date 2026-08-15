import type { Metadata } from "next";
import { POSTerminal } from "@/components/pos/pos-terminal";

export const metadata: Metadata = {
  title: "Point of Sale | ISM POS",
  description:
    "Modern POS terminal — scan items, manage cart, choose tender and print invoice.",
};

export default function POSPage() {
  return <POSTerminal />;
}