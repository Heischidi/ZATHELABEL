"use client";

import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import { useState } from "react";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <Navbar onCartOpen={() => setCartOpen(true)} />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </AuthProvider>
  );
}
