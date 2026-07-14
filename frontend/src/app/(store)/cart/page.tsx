"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice, getProductPrimaryImage } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const DELIVERY_FEE = 3500;

export default function CartPage() {
  const { items, subtotal, itemCount, removeFromCart, updateQuantity } = useCart();
  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  if (items.length === 0) {
    return (
      <div className="pt-20 min-h-screen flex flex-col items-center justify-center text-center px-4">
        <ShoppingBag className="w-20 h-20 text-border mb-5" />
        <h1 className="font-display text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-text-secondary mb-8">Looks like you haven't added anything yet.</p>
        <Link href="/products" className="btn-gold px-10">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container-za py-10">
        <h1 className="font-display text-display-sm font-bold mb-8">
          Your Cart <span className="text-text-secondary text-lg font-body">({itemCount} items)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => {
              const price = (item.product.discount_price && item.product.discount_price > 0) ? item.product.discount_price : item.product.price;
              const img = getProductPrimaryImage(item.product.images);
              return (
                <div key={`${item.product.id}-${item.size}-${i}`} className="flex gap-5 p-5 card-dark">
                  <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden bg-surface">
                    <Image src={img} alt={item.product.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-sm">{item.product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.product.id, item.size, item.color)}
                        className="text-text-secondary hover:text-error transition-colors ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {item.size && <p className="text-xs text-text-secondary mt-1">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-text-secondary">Color: {item.color}</p>}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-white"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-gold font-semibold">{formatPrice(price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-dark p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Delivery Fee</span>
                  <span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="h-px bg-border my-3" />
                <div className="flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="btn-gold w-full text-center block mt-6 py-4">
                Proceed to Checkout <ArrowRight className="w-4 h-4 inline ml-1" />
              </Link>
              <Link href="/products" className="btn-ghost w-full text-center block mt-3 text-xs">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
