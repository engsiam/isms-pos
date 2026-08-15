export const siteConfig = {
  name: "ISM POS",
  description:
    "Modern point-of-sale desktop application for retail and hospitality.",
  nav: [
    { label: "Dashboard", href: "#dashboard", icon: "LayoutDashboard" },
    { label: "Point of Sale", href: "#", icon: "Store", active: true },
    { label: "Orders", href: "#orders", icon: "ShoppingBag" },
    { label: "Products", href: "#products", icon: "Package" },
    { label: "Customers", href: "#customers", icon: "Users" },
    { label: "Reports", href: "#reports", icon: "BarChart3" },
    { label: "Settings", href: "#settings", icon: "Settings" },
  ],
  paymentMethods: ["cash", "card", "mobile"] as const,
  taxRate: 0.08,
} as const;

export const currency = {
  code: "USD",
  symbol: "$",
} as const;