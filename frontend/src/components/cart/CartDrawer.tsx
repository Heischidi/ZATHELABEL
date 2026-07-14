"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getProductPrimaryImage } from "@/lib/utils";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, subtotal, itemCount, removeFromCart, updateQuantity } = useCart();
  const DELIVERY_FEE = 3500;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-surface border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-gold" />
                <h2 className="font-display text-lg font-semibold">
                  Your Cart {itemCount > 0 && <span className="text-text-secondary text-sm">({itemCount})</span>}
                </h2>
              </div>
              <button onClick={onClose} className="text-text-secondary hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-border mb-4" />
                  <p className="text-text-secondary mb-2">Your cart is empty</p>
                  <Link href="/products" onClick={onClose} className="btn-gold mt-4 text-xs">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                items.map((item, i) => {
                  const price = (item.product.discount_price && item.product.discount_price > 0) ? item.product.discount_price : item.product.price;
                  const img = getProductPrimaryImage(item.product.images);
                  return (
                    <div key={`${item.product.id}-${item.size}-${item.color}-${i}`} className="flex gap-4 py-4 border-b border-border last:border-0">
                      <div className="w-20 h-24 bg-card flex-shrink-0 relative overflow-hidden">
                        <Image
                          src={img}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                        {item.size && <p className="text-xs text-text-secondary mt-0.5">Size: {item.size}</p>}
                        {item.color && <p className="text-xs text-text-secondary">Color: {item.color}</p>}
                        <p className="text-gold text-sm font-semibold mt-1">{formatPrice(price)}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                            className="w-6 h-6 border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                            className="w-6 h-6 border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                            className="ml-auto text-text-secondary hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-3">
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-text-secondary">
                  <span>Delivery</span>
                  <span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-border pt-3">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(subtotal + DELIVERY_FEE)}</span>
                </div>
                <Link href="/checkout" onClick={onClose} className="btn-gold w-full text-center block mt-4">
                  Proceed to Checkout
                </Link>
                <Link href="/cart" onClick={onClose} className="btn-outline w-full text-center block text-xs">
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
