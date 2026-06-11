"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, formatDate, getPaymentStatusClass, getPaymentStatusLabel } from "@/lib/utils";
import { MessageCircle, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminPaymentsPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<any>({
    queryKey: ["admin-payments"],
    queryFn: () =>
      api.get("/api/admin/orders", { params: { payment_status: "awaiting_payment", per_page: 50 } }).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payment_status, notes }: { id: number; payment_status: string; notes?: string }) =>
      api.put(`/api/admin/orders/${id}`, { payment_status, payment_notes: notes }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-payments"] });
      qc.invalidateQueries({ queryKey: ["admin-orders"] });
      toast.success("Payment status updated");
    },
  });

  const confirm = (id: number) => updateMutation.mutate({ id, payment_status: "payment_confirmed", notes: "Payment confirmed by admin" });
  const fail = (id: number) => updateMutation.mutate({ id, payment_status: "payment_failed", notes: "Payment not received" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Payment Management</h1>
        <p className="text-text-secondary text-sm mt-1">Review and confirm manual WhatsApp payments</p>
      </div>

      <div className="card-dark">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm">Awaiting Payment ({data?.total || 0})</h2>
        </div>
        <div className="divide-y divide-border">
          {isLoading ? (
            [...Array(4)].map((_, i) => <div key={i} className="p-5 skeleton h-20" />)
          ) : data?.items?.length === 0 ? (
            <div className="p-10 text-center text-text-secondary">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
              No pending payments!
            </div>
          ) : (
            data?.items?.map((o: any) => (
              <div key={o.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gold font-semibold text-sm">{o.order_number}</span>
                      <span className={getPaymentStatusClass(o.payment_status)}>{getPaymentStatusLabel(o.payment_status)}</span>
                    </div>
                    <p className="text-sm font-medium">{o.full_name}</p>
                    <p className="text-xs text-text-secondary">{o.email} · {o.phone}</p>
                    <p className="text-xs text-text-secondary mt-1">{formatDate(o.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gold font-bold text-lg">{formatPrice(o.total_amount)}</p>
                    <div className="flex gap-2 mt-2">
                      <a
                        href={`https://wa.me/${o.phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hello ${o.full_name}, regarding order ${o.order_number}:`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-ghost py-1.5 px-3 text-xs border border-border flex items-center gap-1"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </a>
                      <button
                        onClick={() => confirm(o.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Confirm
                      </button>
                      <button
                        onClick={() => fail(o.id)}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
