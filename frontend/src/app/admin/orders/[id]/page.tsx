"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, getPaymentStatusClass, getPaymentStatusLabel, getOrderStatusLabel, getOrderStatusClass } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Truck, Check, X, Loader2 } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const PAYMENT_STATUSES = ["awaiting_payment", "payment_confirmed", "payment_failed"];

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["admin-order", id],
    queryFn: () => api.get(`/api/admin/orders/${id}`).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.put(`/api/admin/orders/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-order", id] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Order updated successfully");
    },
    onError: () => toast.error("Failed to update order"),
  });

  if (isLoading) return <div className="skeleton h-96" />;
  if (!order) return <div className="text-text-secondary">Order not found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-text-secondary hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-3xl font-bold">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="card-dark p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-xs text-text-secondary tracking-widest uppercase mb-1">Order Number</p>
                <h2 className="text-xl font-bold text-gold">{order.order_number}</h2>
                <p className="text-xs text-text-secondary mt-1">Placed on {formatDate(order.created_at)}</p>
              </div>
              <div className="flex gap-2">
                <span className={getPaymentStatusClass(order.payment_status)}>{getPaymentStatusLabel(order.payment_status)}</span>
                <span className={getOrderStatusClass(order.order_status)}>{getOrderStatusLabel(order.order_status)}</span>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Items</h3>
              <div className="divide-y divide-border">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="w-16 h-20 bg-surface flex-shrink-0 overflow-hidden relative">
                      {item.product_image && (
                        <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product_name}</p>
                      {item.size && <p className="text-xs text-text-secondary mt-0.5">Size: {item.size}</p>}
                      {item.color && <p className="text-xs text-text-secondary">Color: {item.color}</p>}
                      <div className="flex justify-between items-end mt-2">
                        <p className="text-xs text-text-secondary">Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold text-gold">{formatPrice(item.total_price)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="card-dark p-6">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Delivery Address</h3>
            <div className="text-sm space-y-1">
              <p className="font-semibold">{order.full_name}</p>
              <p className="text-text-secondary">{order.delivery_address}</p>
              <p className="text-text-secondary">{order.city}, {order.state}, {order.country}</p>
              <p className="text-text-secondary">Phone: {order.phone}</p>
              <p className="text-text-secondary">Email: {order.email}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* Order Actions */}
          <div className="card-dark p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-2">Manage Order</h3>

            <div>
              <label className="block text-xs text-text-secondary uppercase mb-2">Order Status</label>
              <select
                value={order.order_status}
                onChange={(e) => updateMutation.mutate({ order_status: e.target.value })}
                className="input-dark py-2 text-sm"
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>{getOrderStatusLabel(s as any)}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary uppercase mb-2">Payment Status</label>
              <select
                value={order.payment_status}
                onChange={(e) => updateMutation.mutate({ payment_status: e.target.value })}
                className="input-dark py-2 text-sm"
              >
                {PAYMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>{getPaymentStatusLabel(s as any)}</option>
                ))}
              </select>
            </div>

            {order.payment_status === "awaiting_payment" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => updateMutation.mutate({ payment_status: "payment_confirmed" })}
                  className="flex-1 py-2 bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Confirm Pay
                </button>
                <button
                  onClick={() => updateMutation.mutate({ payment_status: "payment_failed" })}
                  className="flex-1 py-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reject Pay
                </button>
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="card-dark p-6">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Totals Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Delivery Fee</span>
                <span>{formatPrice(order.delivery_fee)}</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-gold">{formatPrice(order.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* Contact Customer */}
          <div className="card-dark p-6">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Contact Customer</h3>
            <a
              href={`https://wa.me/${order.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${order.full_name}, regarding your order ${order.order_number}:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full py-2.5 text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Message on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
