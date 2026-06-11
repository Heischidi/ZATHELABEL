"use client";

import { useCartStore } from "@/store/cartStore";
import { Product } from "@/types";
import toast from "react-hot-toast";

export function useCart() {
  const store = useCartStore();

  const addToCart = (product: Product, size?: string, color?: string, quantity = 1) => {
    store.addItem(product, size, color, quantity);
    toast.success(`${product.name} added to cart`);
  };

  const removeFromCart = (productId: number, size?: string, color?: string) => {
    store.removeItem(productId, size, color);
    toast.success("Item removed from cart");
  };

  return {
    items: store.items,
    itemCount: store.getItemCount(),
    subtotal: store.getSubtotal(),
    addToCart,
    removeFromCart,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  };
}
