"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDeliveryPage() {
  const qc = useQueryClient();
  const [updating, setUpdating] = useState<number | null>(null);

  const { data: deliveries, isLoading } = useQuery<any[]>({
    queryKey: ["admin-deliveries"],
    queryFn: () => api.get("/api/admin/delivery").then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      api.put(`/api/admin/delivery/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-deliveries"] });
      toast.success("Delivery updated");
      setUpdating(null);
    },
  });

  const statusColors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    in_transit: "text-blue-400 bg-blue-400/10",
    delivered: "text-green-400 bg-green-400/10",
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Delivery Management</h1>
      <div className="card-dark divide-y divide-border">
        {isLoading ? (
          [...Array(3)].map((_, i) => <div key={i} className="p-5 skeleton h-24" />)
        ) : deliveries?.length === 0 ? (
          <div className="p-10 text-center text-text-secondary">No deliveries yet.</div>
        ) : (
          deliveries?.map((d: any) => (
            <div key={d.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">Order #{d.order_id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 ${statusColors[d.status] || ""}`}>
                      {d.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  {d.courier_name && <p className="text-xs text-text-secondary mt-1">Courier: {d.courier_name}</p>}
                  {d.tracking_number && <p className="text-xs text-text-secondary">Tracking: {d.tracking_number}</p>}
                </div>
                <div className="flex flex-col gap-2 w-48">
                  <input
                    defaultValue={d.courier_name || ""}
                    placeholder="Courier name"
                    className="input-dark text-xs py-1.5"
                    onChange={(e) => {
                      d._courier = e.target.value;
                    }}
                  />
                  <input
                    defaultValue={d.tracking_number || ""}
                    placeholder="Tracking number"
                    className="input-dark text-xs py-1.5"
                    onChange={(e) => { d._tracking = e.target.value; }}
                  />
                  <select
                    defaultValue={d.status}
                    className="input-dark text-xs py-1.5"
                    onChange={(e) => { d._status = e.target.value; }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                  </select>
                  <button
                    onClick={() => {
                      setUpdating(d.id);
                      updateMutation.mutate({
                        id: d.id,
                        data: {
                          courier_name: d._courier ?? d.courier_name,
                          tracking_number: d._tracking ?? d.tracking_number,
                          status: d._status ?? d.status,
                        },
                      });
                    }}
                    className="btn-gold py-1.5 text-xs flex items-center justify-center gap-1"
                  >
                    {updating === d.id ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
