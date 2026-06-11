import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  viewAllLabel?: string;
}

export default function ProductGrid({
  title,
  subtitle,
  products,
  viewAllHref,
  viewAllLabel = "View All",
}: ProductGridProps) {
  if (products.length === 0) return null;

  return (
    <section className="section-pad">
      <div className="container-za">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-gold" />
              <span className="text-gold text-[10px] tracking-[0.3em] uppercase">ZA</span>
            </div>
            <h2 className="font-display text-display-sm font-bold">{title}</h2>
            {subtitle && (
              <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-text-secondary hover:text-gold transition-colors"
            >
              {viewAllLabel}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
