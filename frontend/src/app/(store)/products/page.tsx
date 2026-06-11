"use client";

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ProductListResponse } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { SlidersHorizontal, Search } from "lucide-react";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const page = Number(searchParams.get("page") || 1);
  const sort = searchParams.get("sort") || "newest";
  const category = searchParams.get("category") || "";
  const search = searchParams.get("search") || "";

  const { data, isLoading } = useQuery<ProductListResponse>({
    queryKey: ["products", { page, sort, category, search }],
    queryFn: () =>
      api
        .get("/api/products", {
          params: { page, sort, category: category || undefined, search: search || undefined, per_page: 12 },
        })
        .then((r) => r.data),
  });

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    router.push(`/products?${params}`);
  };

  return (
    <div className="pt-20 min-h-screen">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container-za py-10">
          <h1 className="font-display text-display-md font-bold">All Products</h1>
          <p className="text-text-secondary text-sm mt-1">
            {data ? `${data.total} pieces` : ""}
          </p>
        </div>
      </div>

      <div className="container-za py-8">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              type="text"
              placeholder="Search products..."
              defaultValue={search}
              onChange={(e) => updateParam("search", e.target.value)}
              className="input-dark pl-10 py-2.5 text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            {/* Filter button */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 btn-outline py-2.5 text-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="input-dark py-2.5 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filters sidebar + Grid */}
        <div className="flex gap-8">
          <ProductFilters
            open={filtersOpen}
            category={category}
            onCategoryChange={(c) => updateParam("category", c)}
          />

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton aspect-[3/4]" />
                ))}
              </div>
            ) : data?.items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-text-secondary">No products found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data?.items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {data && data.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: data.pages }).map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => updateParam("page", String(i + 1))}
                        className={`w-9 h-9 text-sm font-medium transition-colors ${
                          page === i + 1
                            ? "bg-gold text-black"
                            : "border border-border text-text-secondary hover:border-white hover:text-white"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center"><div className="skeleton h-64 w-full" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
