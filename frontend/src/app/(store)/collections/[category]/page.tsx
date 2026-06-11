"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ProductListResponse } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  men: "Men's Collection",
  women: "Women's Collection",
  accessories: "Accessories",
  outerwear: "Outerwear",
  footwear: "Footwear",
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const label = CATEGORY_LABELS[category] || category;

  const { data, isLoading } = useQuery<ProductListResponse>({
    queryKey: ["products-category", category],
    queryFn: () => api.get("/api/products", { params: { category, per_page: 24 } }).then((r) => r.data),
  });

  return (
    <div className="pt-20 min-h-screen">
      <div className="border-b border-border">
        <div className="container-za py-10">
          <Link href="/products" className="flex items-center gap-2 text-text-secondary hover:text-white text-sm mb-3 transition-colors">
            <ArrowLeft className="w-4 h-4" /> All Products
          </Link>
          <h1 className="font-display text-display-md font-bold">{label}</h1>
          {data && <p className="text-text-secondary text-sm mt-1">{data.total} pieces</p>}
        </div>
      </div>
      <div className="container-za py-10">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton aspect-[3/4]" />)}
          </div>
        ) : data?.items.length === 0 ? (
          <div className="text-center py-20 text-text-secondary">No products in this category yet.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
