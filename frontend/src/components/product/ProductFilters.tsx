"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Category } from "@/types";

interface ProductFiltersProps {
  open: boolean;
  category: string;
  onCategoryChange: (slug: string) => void;
}

export default function ProductFilters({ open, category, onCategoryChange }: ProductFiltersProps) {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => api.get("/api/categories/").then((r) => r.data),
  });

  if (!open) return null;

  return (
    <aside className="w-48 flex-shrink-0">
      <div className="sticky top-24">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-white">Category</h3>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`block w-full text-left text-sm py-1.5 transition-colors ${
              !category ? "text-gold font-medium" : "text-text-secondary hover:text-white"
            }`}
          >
            All Products
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => onCategoryChange(cat.slug)}
              className={`block w-full text-left text-sm py-1.5 transition-colors ${
                category === cat.slug ? "text-gold font-medium" : "text-text-secondary hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
