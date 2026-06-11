"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onCartOpen: () => void;
}

const navLinks = [
  {
    label: "Collections",
    href: "/products",
    children: [
      { label: "All Products", href: "/products" },
      { label: "Men", href: "/collections/men" },
      { label: "Women", href: "/collections/women" },
      { label: "Accessories", href: "/collections/accessories" },
      { label: "Outerwear", href: "/collections/outerwear" },
    ],
  },
  { label: "New Arrivals", href: "/products?sort=newest&featured=true" },
  { label: "Best Sellers", href: "/products?sort=newest" },
];

export default function Navbar({ onCartOpen }: NavbarProps) {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass border-b border-border" : "bg-transparent"
        }`}
      >
        <div className="container-za">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border group-hover:border-gold transition-colors">
                <Image
                  src="/logo.jpg"
                  alt="ZAZA Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display text-lg md:text-xl font-bold tracking-[0.2em] text-white group-hover:text-gold transition-colors">
                ZA
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.children ? (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 text-sm tracking-widest uppercase text-text-secondary hover:text-white transition-colors py-2">
                      {link.label}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 w-48 bg-card border border-border shadow-2xl py-2"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors tracking-wide"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text-sm tracking-widest uppercase text-text-secondary hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 md:gap-5">
              <Link
                href="/products"
                className="text-text-secondary hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </Link>

              {user ? (
                <div className="relative group hidden md:block">
                  <button className="flex items-center gap-1 text-text-secondary hover:text-white transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-card border border-border shadow-2xl py-2">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors">
                      My Account
                    </Link>
                    <Link href="/dashboard/orders" className="block px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors">
                      My Orders
                    </Link>
                    <Link href="/dashboard/wishlist" className="block px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors">
                      Wishlist
                    </Link>
                    {user.is_admin && (
                      <Link href="/admin" className="block px-4 py-2.5 text-sm text-gold hover:bg-surface transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-border" />
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-surface transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden md:block text-text-secondary hover:text-white transition-colors"
                  aria-label="Login"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <Link href="/dashboard/wishlist" className="hidden md:block text-text-secondary hover:text-white transition-colors" aria-label="Wishlist">
                <Heart className="w-5 h-5" />
              </Link>

              <button
                onClick={onCartOpen}
                className="relative text-text-secondary hover:text-white transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden text-text-secondary hover:text-white transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
