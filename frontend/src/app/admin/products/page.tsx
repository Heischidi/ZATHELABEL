"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { ProductListResponse, Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, Package } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<ProductListResponse>({
    queryKey: ["admin-products", page, search],
    queryFn: () =>
      api.get("/api/admin/products", { params: { page, per_page: 20, search: search || undefined } })
         .then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/admin/products/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("Product deleted");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn-gold py-2.5 text-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="input-dark pl-10 py-2.5 text-sm"
        />
      </div>

      {/* Table */}
      <div className="card-dark overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["Product", "Price", "Stock", "Category", "Status", ""].map((h) => (
                <th key={h} className="text-left text-[10px] tracking-widest uppercase text-text-secondary px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {[...Array(6)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4" /></td>)}
                </tr>
              ))
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-text-secondary">
                  <Package className="w-10 h-10 mx-auto mb-2 text-border" />
                  No products found
                </td>
              </tr>
            ) : (
              data?.items.map((product) => {
                const img = product.images[0]?.image_url;
                return (
                  <tr key={product.id} className="border-b border-border hover:bg-card transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-surface flex-shrink-0 overflow-hidden">
                          {img ? <Image src={img} alt="" width={40} height={48} className="object-cover w-full h-full" /> : <div className="w-full h-full bg-surface" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-[10px] text-text-secondary">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gold">{formatPrice(product.discount_price ?? product.price)}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={product.stock_quantity < 5 ? "text-red-400" : "text-green-400"}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-text-secondary">{product.category?.name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-1 ${product.is_active ? "bg-green-400/10 text-green-400" : "bg-gray-400/10 text-gray-400"}`}>
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}/edit`} className="text-text-secondary hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm("Delete this product?")) deleteMutation.mutate(product.id);
                          }}
                          className="text-text-secondary hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data && data.pages > 1 && (
          <div className="flex justify-center gap-2 p-4">
            {Array.from({ length: data.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-sm ${page === i + 1 ? "bg-gold text-black" : "border border-border text-text-secondary hover:text-white"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
