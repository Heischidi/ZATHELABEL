"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const links = [
  { label: "All Products", href: "/products" },
  { label: "Dresses", href: "/collections/dresses" },
  { label: "Tops & Blouses", href: "/collections/tops" },
  { label: "Bottoms", href: "/collections/bottoms" },
  { label: "Accessories", href: "/collections/accessories" },
  { label: "Outerwear", href: "/collections/outerwear" },
  { label: "New Arrivals", href: "/products?sort=newest" },
  { label: "Best Sellers", href: "/products?sort=newest" },
];

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[300px] bg-surface border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                  <Image
                    src="/logo.jpg"
                    alt="ZAZA Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-display text-xl font-bold tracking-[0.2em]">ZA</span>
              </div>
              <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Links */}
            <nav className="flex-1 overflow-y-auto p-6 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 text-sm tracking-widest uppercase text-text-secondary hover:text-white border-b border-border/50 transition-colors"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ))}
            </nav>

            {/* User section */}
            <div className="p-6 border-t border-border space-y-3">
              {user ? (
                <>
                  <p className="text-xs text-text-secondary uppercase tracking-widest">
                    Hello, {user.full_name.split(" ")[0]}
                  </p>
                  <Link href="/dashboard" onClick={onClose} className="btn-outline w-full text-center block">
                    My Account
                  </Link>
                  <button onClick={() => { logout(); onClose(); }} className="w-full text-sm text-text-secondary hover:text-white transition-colors text-center">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={onClose} className="btn-primary w-full text-center block">
                    Sign In
                  </Link>
                  <Link href="/auth/register" onClick={onClose} className="btn-outline w-full text-center block">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
