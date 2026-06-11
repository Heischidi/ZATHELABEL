"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Users, Search } from "lucide-react";
import Link from "next/link";

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery<any>({
    queryKey: ["admin-customers", page, search],
    queryFn: () =>
      api.get("/api/admin/customers", { params: { page, per_page: 20, search: search || undefined } }).then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Customers</h1>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="input-dark pl-10 py-2.5 text-sm"
        />
      </div>

      <div className="card-dark overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Name", "Email", "Phone", "Joined", ""].map((h) => (
                <th key={h} className="text-left text-[10px] tracking-widest uppercase text-text-secondary px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[...Array(5)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4" /></td>)}
                </tr>
              ))
            ) : data?.items?.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-text-secondary">
                  <Users className="w-10 h-10 mx-auto mb-2 text-border" />
                  No customers found
                </td>
              </tr>
            ) : (
              data?.items?.map((c: any) => (
                <tr key={c.id} className="border-b border-border hover:bg-card transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-gold/10 flex items-center justify-center text-gold text-[10px] font-bold">
                        {c.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="text-sm font-medium">{c.full_name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{c.email}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{c.phone || "—"}</td>
                  <td className="px-4 py-3 text-xs text-text-secondary">{formatDate(c.created_at)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="text-xs text-text-secondary hover:text-white transition-colors">View</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {data?.pages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: data.pages }).map((_: any, i: number) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-sm ${page === i + 1 ? "bg-gold text-black" : "border border-border text-text-secondary"}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
