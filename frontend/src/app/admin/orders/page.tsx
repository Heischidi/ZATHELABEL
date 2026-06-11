"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, formatDate, getPaymentStatusClass, getPaymentStatusLabel, getOrderStatusLabel, getOrderStatusClass } from "@/lib/utils";
import Link from "next/link";
import { Search } from "lucide-react";

const PAYMENT_STATUSES = ["", "awaiting_payment", "payment_confirmed", "payment_failed"];
const ORDER_STATUSES = ["", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["admin-orders", page, search, paymentFilter, orderFilter],
    queryFn: () =>
      api.get("/api/admin/orders", {
        params: {
          page, per_page: 20,
          search: search || undefined,
          payment_status: paymentFilter || undefined,
          order_status: orderFilter || undefined,
        },
      }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.put(`/api/admin/orders/${id}`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-orders"] }),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Orders</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="input-dark pl-10 py-2 text-sm w-48"
          />
        </div>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="input-dark py-2 text-sm">
          <option value="">All Payments</option>
          <option value="awaiting_payment">Awaiting Payment</option>
          <option value="payment_confirmed">Payment Confirmed</option>
          <option value="payment_failed">Payment Failed</option>
        </select>
        <select value={orderFilter} onChange={(e) => setOrderFilter(e.target.value)} className="input-dark py-2 text-sm">
          <option value="">All Statuses</option>
          {ORDER_STATUSES.filter(Boolean).map((s) => <option key={s} value={s}>{getOrderStatusLabel(s as any)}</option>)}
        </select>
      </div>

      <div className="card-dark overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Order #", "Customer", "Total", "Payment", "Status", "Date", ""].map((h) => (
                <th key={h} className="text-left text-[10px] tracking-widest uppercase text-text-secondary px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[...Array(7)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4" /></td>)}
                </tr>
              ))
            ) : (
              data?.items?.map((o: any) => (
                <tr key={o.id} className="border-b border-border hover:bg-card transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gold">{o.order_number}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{o.full_name}</p>
                    <p className="text-[10px] text-text-secondary">{o.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatPrice(o.total_amount)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.payment_status}
                      onChange={(e) => updateMutation.mutate({ id: o.id, data: { payment_status: e.target.value } })}
                      className="bg-transparent text-xs border-0 outline-none cursor-pointer"
                    >
                      {PAYMENT_STATUSES.filter(Boolean).map((s) => (
                        <option key={s} value={s} className="bg-card">{getPaymentStatusLabel(s as any)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={o.order_status}
                      onChange={(e) => updateMutation.mutate({ id: o.id, data: { order_status: e.target.value } })}
                      className="bg-transparent text-xs border-0 outline-none cursor-pointer"
                    >
                      {ORDER_STATUSES.filter(Boolean).map((s) => (
                        <option key={s} value={s} className="bg-card">{getOrderStatusLabel(s as any)}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{formatDate(o.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="text-xs text-text-secondary hover:text-white transition-colors">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data?.pages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: data.pages }).map((_: any, i: number) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-sm ${page === i + 1 ? "bg-gold text-black" : "border border-border text-text-secondary hover:text-white"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
