"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { formatPrice, getProductPrimaryImage } from "@/lib/utils";
import { OrderCreateResponse, CheckoutFormData } from "@/types";
import Image from "next/image";
import { MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  full_name: z.string().min(2, "Full name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().min(10, "Valid phone number required"),
  delivery_address: z.string().min(5, "Delivery address required"),
  city: z.string().min(2, "City required"),
  state: z.string().min(2, "State required"),
  country: z.string().default("Nigeria"),
  notes: z.string().optional(),
});

const DELIVERY_FEE = 3500;

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue","Borno",
  "Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT","Gombe","Imo",
  "Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi","Kwara","Lagos","Nasarawa",
  "Niger","Ogun","Ondo","Osun","Oyo","Plateau","Rivers","Sokoto","Taraba",
  "Yobe","Zamfara"
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const total = subtotal + DELIVERY_FEE;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
    defaultValues: { country: "Nigeria" },
  });

  const mutation = useMutation({
    mutationFn: (data: CheckoutFormData) =>
      api.post<OrderCreateResponse>("/api/orders", {
        ...data,
        items: items.map((i) => ({
          product_id: i.product.id,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
      }).then((r) => r.data),
    onSuccess: (data) => {
      clearCart();
      localStorage.setItem("za_last_order", JSON.stringify(data));
      router.push(`/order-success?order=${data.order.order_number}`);
    },
    onError: () => toast.error("Failed to place order. Please try again."),
  });

  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      setRedirecting(true);
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0 || redirecting) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen">
      <div className="container-za py-10">
        <h1 className="font-display text-display-sm font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <form
            onSubmit={handleSubmit((d) => mutation.mutate(d))}
            className="lg:col-span-3 space-y-6"
          >
            {/* Customer Info */}
            <div className="card-dark p-6">
              <h2 className="font-display text-lg font-semibold mb-5">Customer Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">Full Name *</label>
                  <input {...register("full_name")} className="input-dark" placeholder="John Doe" />
                  {errors.full_name && <p className="text-error text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">Email *</label>
                  <input {...register("email")} type="email" className="input-dark" placeholder="john@example.com" />
                  {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">Phone *</label>
                  <input {...register("phone")} type="tel" className="input-dark" placeholder="+234 800 000 0000" />
                  {errors.phone && <p className="text-error text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card-dark p-6">
              <h2 className="font-display text-lg font-semibold mb-5">Delivery Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">Delivery Address *</label>
                  <textarea {...register("delivery_address")} rows={2} className="input-dark resize-none" placeholder="House/flat number, street name..." />
                  {errors.delivery_address && <p className="text-error text-xs mt-1">{errors.delivery_address.message}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">City *</label>
                    <input {...register("city")} className="input-dark" placeholder="Lagos" />
                    {errors.city && <p className="text-error text-xs mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">State *</label>
                    <select {...register("state")} className="input-dark">
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.state && <p className="text-error text-xs mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">Country</label>
                    <input {...register("country")} className="input-dark" readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-[0.15em] uppercase mb-2">Additional Notes</label>
                  <textarea {...register("notes")} rows={2} className="input-dark resize-none" placeholder="Any special delivery instructions..." />
                </div>
              </div>
            </div>

            {/* Payment notice */}
            <div className="card-dark p-5 border-gold/30 bg-gold/5">
              <div className="flex gap-3">
                <MessageCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gold mb-1">WhatsApp Payment</p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    After placing your order, you'll be redirected to WhatsApp to receive payment details. 
                    Your order will be processed once payment is confirmed.
                  </p>
                </div>
              </div>
            </div>

            <button type="submit" disabled={mutation.isPending} className="btn-gold w-full py-4">
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Placing Order...</>
              ) : (
                <><MessageCircle className="w-4 h-4 mr-2" /> Place Order via WhatsApp</>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="card-dark p-6 sticky top-24">
              <h2 className="font-display text-lg font-semibold mb-5">Order Summary</h2>
              <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="relative w-14 h-16 flex-shrink-0 overflow-hidden bg-surface">
                      <Image src={getProductPrimaryImage(item.product.images)} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{item.product.name}</p>
                      {item.size && <p className="text-[10px] text-text-secondary">Size: {item.size}</p>}
                      <div className="flex justify-between mt-1">
                        <p className="text-[10px] text-text-secondary">Qty: {item.quantity}</p>
                        <p className="text-xs text-gold font-semibold">
                          {formatPrice(((item.product.discount_price && item.product.discount_price > 0) ? item.product.discount_price : item.product.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Delivery</span><span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-border pt-2 mt-2">
                  <span>Total</span><span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
