"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { AdminDashboard } from "@/types";
import { formatPrice, formatDate, getPaymentStatusClass, getPaymentStatusLabel } from "@/lib/utils";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
  ShoppingBag, DollarSign, Clock, CheckCircle,
  Package, Users, TrendingUp
} from "lucide-react";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery<AdminDashboard>({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/api/admin/dashboard").then((r) => r.data),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28" />)}
        </div>
        <div className="skeleton h-64" />
      </div>
    );
  }

  const stats = data?.stats;

  const statCards = [
    { label: "Total Orders", value: stats?.total_orders ?? 0, icon: ShoppingBag, color: "text-blue-400" },
    { label: "Revenue", value: formatPrice(stats?.total_revenue ?? 0), icon: DollarSign, color: "text-gold" },
    { label: "Pending Payments", value: stats?.pending_payments ?? 0, icon: Clock, color: "text-yellow-400" },
    { label: "Confirmed Payments", value: stats?.confirmed_payments ?? 0, icon: CheckCircle, color: "text-green-400" },
    { label: "Delivered", value: stats?.delivered_orders ?? 0, icon: Package, color: "text-purple-400" },
    { label: "Active Customers", value: stats?.active_customers ?? 0, icon: Users, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-text-secondary text-sm mt-1">Welcome to ZA Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card-dark p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-text-secondary tracking-widest uppercase">{label}</p>
                <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
              </div>
              <Icon className={`w-5 h-5 ${color} opacity-60`} />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="card-dark p-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-gold" />
          <h2 className="font-semibold">Revenue — Last 7 Days</h2>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data?.revenue_chart || []}>
            <defs>
              <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C9A96E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C9A96E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
            <XAxis dataKey="date" tick={{ fill: "#9A9A9A", fontSize: 11 }} />
            <YAxis tick={{ fill: "#9A9A9A", fontSize: 11 }} tickFormatter={(v) => `₦${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: "#1A1A1A", border: "1px solid #2A2A2A", borderRadius: 0 }}
              formatter={(v: any) => [formatPrice(v), "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#C9A96E" fill="url(#goldGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="card-dark">
        <div className="p-5 border-b border-border">
          <h2 className="font-semibold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Order #", "Customer", "Amount", "Payment", "Date", ""].map((h) => (
                  <th key={h} className="text-left text-[10px] tracking-widest uppercase text-text-secondary px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.recent_orders.map((o: any) => (
                <tr key={o.id} className="border-b border-border hover:bg-card transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-gold">{o.order_number}</td>
                  <td className="px-5 py-3 text-sm">{o.full_name}</td>
                  <td className="px-5 py-3 text-sm">{formatPrice(o.total_amount)}</td>
                  <td className="px-5 py-3">
                    <span className={getPaymentStatusClass(o.payment_status)}>
                      {getPaymentStatusLabel(o.payment_status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-text-secondary">{formatDate(o.created_at)}</td>
                  <td className="px-5 py-3">
                    <a href={`/admin/orders/${o.id}`} className="text-xs text-text-secondary hover:text-white transition-colors">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
