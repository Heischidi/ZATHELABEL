"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, getPaymentStatusClass, getPaymentStatusLabel, getOrderStatusLabel, getOrderStatusClass } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["order", id],
    queryFn: () => api.get(`/api/orders/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div className="skeleton h-64" />;
  if (!order) return <div className="text-text-secondary">Order not found.</div>;

  return (
    <div>
      <Link href="/dashboard/orders" className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">{order.order_number}</h1>
          <p className="text-text-secondary text-sm">{formatDate(order.created_at)}</p>
        </div>
        <div className="flex gap-2">
          <span className={getPaymentStatusClass(order.payment_status)}>{getPaymentStatusLabel(order.payment_status)}</span>
          <span className={getOrderStatusClass(order.order_status)}>{getOrderStatusLabel(order.order_status)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="card-dark p-5">
            <h2 className="font-semibold mb-4 text-sm tracking-widest uppercase">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-16 h-20 bg-surface flex-shrink-0 overflow-hidden">
                    {item.product_image && (
                      <Image src={item.product_image} alt={item.product_name} width={64} height={80} className="object-cover w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    {item.size && <p className="text-xs text-text-secondary">Size: {item.size}</p>}
                    {item.color && <p className="text-xs text-text-secondary">Color: {item.color}</p>}
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                      <p className="text-sm text-gold font-semibold">{formatPrice(item.total_price)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery address */}
          <div className="card-dark p-5">
            <h2 className="font-semibold mb-3 text-sm tracking-widest uppercase">Delivery Address</h2>
            <div className="text-sm text-text-secondary space-y-1">
              <p className="text-white font-medium">{order.full_name}</p>
              <p>{order.delivery_address}</p>
              <p>{order.city}, {order.state}, {order.country}</p>
              <p>{order.phone}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Totals */}
          <div className="card-dark p-5">
            <h2 className="font-semibold mb-4 text-sm tracking-widest uppercase">Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery</span><span>{formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                <span>Total</span><span className="text-gold">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          {order.payment_status === "awaiting_payment" && (
            <a
              href={`https://wa.me/2348000000000?text=${encodeURIComponent(`Hello ZA Team,\n\nI would like to make payment for my order.\n\nOrder Number: ${order.order_number}\nCustomer Name: ${order.full_name}\nTotal Amount: ₦${order.total_amount.toLocaleString()}\n\nPlease send payment details.\n\nThank you.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full text-center block py-3 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Pay via WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
