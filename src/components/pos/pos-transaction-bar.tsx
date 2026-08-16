"use client";

import * as React from "react";
import { Scan, User, ChevronDown, AlertCircle, Search, LayoutGrid, Plus, Check, Phone } from "lucide-react";
import { products } from "@/config/products";
import { useCartStore } from "@/store/cart-store";
import { PosProductSearchModal } from "@/components/pos/pos-product-search-modal";

export function PosTransactionBar() {
  const [code, setCode] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [customerDropdownOpen, setCustomerDropdownOpen] = React.useState(false);
  const [addCustomerModalOpen, setAddCustomerModalOpen] = React.useState(false);

  // New Customer Form State
  const [newCustName, setNewCustName] = React.useState("");
  const [newCustMobile, setNewCustMobile] = React.useState("");

  const inputRef = React.useRef<HTMLInputElement>(null);

  const addItem = useCartStore((s) => s.addItem);
  const customer = useCartStore((s) => s.customer);
  const customers = useCartStore((s) => s.customers);
  const setCustomer = useCartStore((s) => s.setCustomer);
  const addCustomer = useCartStore((s) => s.addCustomer);

  // F2 key to open search modal
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F2") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleScan = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const query = code.trim().toLowerCase();
    if (!query) {
      setSearchOpen(true);
      return;
    }

    const match = products.find(
      (p) =>
        p.barcode.toLowerCase() === query ||
        p.id.toLowerCase() === query ||
        p.name.toLowerCase().includes(query)
    );

    if (match) {
      addItem(match.id, match.name, match.emoji, match.barcode, match.price);
      setCode("");
      setError(null);
      inputRef.current?.focus();
    } else {
      setError(`Item "${code.trim()}" not found — showing catalog`);
      setSearchOpen(true);
      setTimeout(() => setError(null), 2500);
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim()) return;
    const created = addCustomer(newCustName.trim(), newCustMobile.trim());
    setCustomer(created);
    setNewCustName("");
    setNewCustMobile("");
    setAddCustomerModalOpen(false);
  };

  return (
    <>
      <PosProductSearchModal
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
          inputRef.current?.focus();
        }}
      />

      {/* Add New Customer Modal */}
      {addCustomerModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          onClick={() => setAddCustomerModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Add New Customer</h3>
              <button
                onClick={() => setAddCustomerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Customer Name *</label>
                <input
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Tanvir Hossain"
                  required
                  autoFocus
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300">Mobile Number</label>
                <input
                  value={newCustMobile}
                  onChange={(e) => setNewCustMobile(e.target.value)}
                  placeholder="017xxxxxxxx"
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddCustomerModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] md:grid-cols-[1fr_260px] gap-2.5 sm:gap-4 mb-2 sm:mb-3">
        {/* ── Scan barcode & Search box ───────────────────── */}
        <div className="relative">
          <div
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2.5 sm:gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-xs focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all cursor-pointer group"
          >
            <div className="size-6 rounded-md bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Scan className="size-4" />
            </div>
            <input
              ref={inputRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleScan}
              onClick={(e) => {
                e.stopPropagation();
                setSearchOpen(true);
              }}
              autoFocus
              placeholder="Scan barcode or search product…"
              className="w-full bg-transparent text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none cursor-pointer min-w-0"
            />
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
              F2
            </span>
          </div>

          {error && (
            <div className="absolute left-0 top-full mt-1.5 z-20 flex items-center gap-1.5 bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-3 py-1.5 rounded-lg text-xs shadow-md">
              <AlertCircle className="size-3.5" />
              {error}
            </div>
          )}
        </div>

        {/* ── Customer Selector (F4) ──────────────────── */}
        <div className="relative">
          <button
            onClick={() => setCustomerDropdownOpen((v) => !v)}
            className="w-full flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 sm:px-3.5 py-2 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="size-7 sm:size-8 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <User className="size-4" />
              </div>
              <div className="text-left min-w-0">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold leading-none">Customer (F4)</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">{customer.name}</p>
              </div>
            </div>
            <ChevronDown className="size-3.5 text-slate-400 shrink-0 ml-1" />
          </button>

          {customerDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-full sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-50 space-y-1">
              <div className="px-3 pb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Select Customer</span>
                <button
                  onClick={() => {
                    setCustomerDropdownOpen(false);
                    setAddCustomerModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                >
                  <Plus className="size-3" /> New
                </button>
              </div>

              <div className="max-h-56 overflow-y-auto">
                {customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setCustomer(c);
                      setCustomerDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-800 dark:text-slate-100">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Phone className="size-2.5" /> {c.mobile}
                      </p>
                    </div>
                    {customer.id === c.id && <Check className="size-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
