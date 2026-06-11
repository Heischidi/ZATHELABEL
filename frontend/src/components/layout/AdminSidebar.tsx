"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Truck, CreditCard, Settings, LogOut, Store
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Delivery", href: "/admin/delivery", icon: Truck },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border group-hover:border-gold transition-colors">
            <Image
              src="/logo.jpg"
              alt="ZAZA Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-display text-xl font-bold tracking-[0.2em] text-white group-hover:text-gold transition-colors">
            ZA
          </span>
        </Link>
        <p className="text-[10px] text-text-secondary tracking-[0.2em] uppercase mt-2">Admin Dashboard</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-all rounded-none ${
                active
                  ? "bg-gold/10 text-gold border-l-2 border-gold -ml-0.5 pl-3.5"
                  : "text-text-secondary hover:text-white hover:bg-card"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-white transition-colors">
          <Store className="w-4 h-4" /> View Store
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-text-secondary hover:text-error transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
        {user && (
          <div className="px-3 pt-2 border-t border-border">
            <p className="text-xs font-medium truncate">{user.full_name}</p>
            <p className="text-[10px] text-text-secondary truncate">{user.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
}
