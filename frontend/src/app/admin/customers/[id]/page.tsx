"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { formatDate, formatPrice, getPaymentStatusClass, getPaymentStatusLabel, getOrderStatusClass, getOrderStatusLabel } from "@/lib/utils";
import { ArrowLeft, User, Package, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function AdminCustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["admin-customer", id],
    queryFn: () => api.get(`/api/admin/customers/${id}`).then((r) => r.data),
  });

  if (isLoading) return <div className="skeleton h-96" />;
  if (!data || data.error) return <div className="text-text-secondary">Customer not found.</div>;

  const { customer, orders } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-text-secondary hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-3xl font-bold">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Profile */}
        <div className="lg:col-span-1 space-y-6">
          <div className="card-dark p-6 text-center">
            <div className="w-20 h-20 bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-4">
              <span className="text-gold font-bold text-2xl">
                {customer.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <h2 className="font-display text-xl font-bold">{customer.full_name}</h2>
            <p className="text-sm text-text-secondary">{customer.email}</p>
            {customer.phone && <p className="text-sm text-text-secondary mt-1">{customer.phone}</p>}
            <p className="text-[10px] text-text-secondary tracking-widest uppercase mt-4">Joined {formatDate(customer.created_at)}</p>

            {customer.phone && (
              <a
                href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${customer.full_name}, regarding your ZA account:`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full py-2 text-xs flex items-center justify-center gap-2 mt-6"
              >
                <MessageCircle className="w-4 h-4" /> Message on WhatsApp
              </a>
            )}
          </div>
        </div>

        {/* Customer Orders */}
        <div className="lg:col-span-2">
          <div className="card-dark p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-gold" /> Order History ({orders.length})
            </h3>
            {orders.length === 0 ? (
              <p className="text-text-secondary text-sm">No orders found for this customer.</p>
            ) : (
              <div className="divide-y divide-border">
                {orders.map((o: any) => (
                  <div key={o.order_number} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gold">{o.order_number}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{formatDate(o.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={getPaymentStatusClass(o.payment_status)}>{getPaymentStatusLabel(o.payment_status)}</span>
                      <span className={getOrderStatusClass(o.order_status)}>{getOrderStatusLabel(o.order_status)}</span>
                      <span className="text-sm font-semibold">{formatPrice(o.total_amount)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
