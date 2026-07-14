"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, MessageCircle, Copy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { OrderCreateResponse } from "@/types";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order");
  const [orderData, setOrderData] = useState<OrderCreateResponse | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("za_last_order");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OrderCreateResponse;
        setOrderData(parsed);
        
        // Automatically redirect to WhatsApp if we haven't already for this session
        if (parsed.whatsapp_url && !sessionStorage.getItem(`redirected_${parsed.order.order_number}`)) {
          sessionStorage.setItem(`redirected_${parsed.order.order_number}`, "true");
          // Small delay to let the user see the "Order Placed" success screen briefly
          setTimeout(() => {
            window.location.href = parsed.whatsapp_url;
          }, 800);
        }
      } catch (err) {
        console.error("Failed to parse last order data", err);
      }
    }
  }, []);

  const copyOrderNumber = () => {
    if (orderNumber) {
      navigator.clipboard.writeText(orderNumber);
      toast.success("Order number copied!");
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        {/* Success icon */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle className="w-10 h-10 text-gold" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold mb-2">Order Placed!</h1>
          <p className="text-text-secondary">Thank you for shopping with ZA</p>
        </div>

        {/* Order Number */}
        <div className="card-dark p-6 mb-5 text-center">
          <p className="text-xs text-text-secondary tracking-widest uppercase mb-2">Order Number</p>
          <div className="flex items-center justify-center gap-3">
            <span className="font-display text-2xl font-bold text-gold">{orderNumber || "—"}</span>
            <button onClick={copyOrderNumber} className="text-text-secondary hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payment Instructions */}
        <div className="card-dark p-6 mb-5 border-gold/20">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-5 h-5 text-gold" />
            <h2 className="font-semibold text-sm tracking-wide uppercase">Payment Instructions</h2>
          </div>
          <ol className="space-y-3 text-sm text-text-secondary">
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
              <span>Click the WhatsApp button below to open a pre-filled message.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
              <span>Send the message to our team to receive bank transfer details.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-5 h-5 bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
              <span>Make payment and send proof. Your order will be confirmed within 24 hours.</span>
            </li>
          </ol>
        </div>

        {/* Order summary */}
        {orderData && (
          <div className="card-dark p-5 mb-5">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {orderData.order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-text-secondary">
                  <span>{item.product_name} × {item.quantity}{item.size ? ` (${item.size})` : ""}</span>
                  <span>{formatPrice(item.total_price)}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold">
                <span>Total Paid</span>
                <span className="text-gold">{formatPrice(orderData.order.total_amount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {orderData?.whatsapp_url && (
            <a
              href={orderData.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full text-center py-4 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Open WhatsApp to Pay
            </a>
          )}
          <Link href="/dashboard/orders" className="btn-outline w-full text-center py-3.5 flex items-center justify-center gap-2 text-sm">
            Track My Order <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className="btn-ghost w-full text-center py-3 text-sm">
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="pt-20 min-h-screen flex items-center justify-center"><div className="skeleton h-32 w-full max-w-lg" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
