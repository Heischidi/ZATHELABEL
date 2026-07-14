"use client";

import { useRef, useState, useEffect } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (products.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Check if we are near the end of the scrollable area
        const isEnd = scrollLeft + clientWidth >= scrollWidth - 20;

        if (isEnd) {
          // Smoothly scroll back to the beginning
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          // Scroll right by approximately one item width (approx 300px)
          scrollRef.current.scrollTo({ left: scrollLeft + 320, behavior: "smooth" });
        }
      }
    }, 3500); // Slide every 3.5 seconds

    return () => clearInterval(interval);
  }, [products.length, isHovered]);

  if (products.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="section-pad relative overflow-hidden">
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
          <div className="flex items-center gap-6">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="flex items-center gap-2 text-xs tracking-widest uppercase text-text-secondary hover:text-gold transition-colors"
              >
                {viewAllLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            
            {/* Carousel navigation controls */}
            {products.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleScroll("left")}
                  className="w-9 h-9 border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-gold hover:bg-gold/5 transition-all active:scale-95"
                  aria-label="Previous Products"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleScroll("right")}
                  className="w-9 h-9 border border-border flex items-center justify-center text-text-secondary hover:text-white hover:border-gold hover:bg-gold/5 transition-all active:scale-95"
                  aria-label="Next Products"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sliding products track */}
        <div className="relative">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            className="flex gap-4 md:gap-6 overflow-x-auto scroll-smooth scrollbar-none snap-x snap-mandatory pb-4"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                className="w-[260px] sm:w-[290px] md:w-[320px] flex-shrink-0 snap-start"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
