"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Package, Heart, LogOut } from "lucide-react";

const navItems = [
  { label: "Profile", href: "/dashboard", icon: User },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="pt-20 min-h-screen">
      <div className="container-za py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="card-dark p-5 mb-4">
              <div className="w-12 h-12 bg-gold/10 border border-gold/30 flex items-center justify-center mb-3">
                <span className="text-gold font-bold text-lg">
                  {user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              </div>
              <p className="font-semibold text-sm">{user.full_name}</p>
              <p className="text-xs text-text-secondary">{user.email}</p>
            </div>

            <nav className="space-y-1">
              {navItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    pathname === href
                      ? "bg-gold/10 text-gold border-l-2 border-gold"
                      : "text-text-secondary hover:text-white hover:bg-surface"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-text-secondary hover:text-error transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
