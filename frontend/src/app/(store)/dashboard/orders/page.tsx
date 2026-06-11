"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Order } from "@/types";
import { formatPrice, formatDate, getPaymentStatusClass, getPaymentStatusLabel, getOrderStatusLabel } from "@/lib/utils";
import Link from "next/link";
import { Package } from "lucide-react";

export default function OrdersPage() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/api/orders").then((r) => r.data),
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">My Orders</h1>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-20" />)}
        </div>
      ) : orders?.length === 0 ? (
        <div className="card-dark p-10 text-center">
          <Package className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-text-secondary">No orders yet.</p>
          <Link href="/products" className="btn-gold mt-4 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders?.map((order) => (
            <div key={order.id} className="card-dark p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-sm">{order.order_number}</p>
                  <p className="text-xs text-text-secondary">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex gap-2">
                  <span className={getPaymentStatusClass(order.payment_status)}>
                    {getPaymentStatusLabel(order.payment_status)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <div className="text-sm text-text-secondary">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} · {getOrderStatusLabel(order.order_status)}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gold font-semibold">{formatPrice(order.total_amount)}</span>
                  <Link
                    href={`/dashboard/orders/${order.order_number}`}
                    className="text-xs tracking-widest uppercase text-text-secondary hover:text-white transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
