import type { Metadata } from "next";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import ProductGrid from "@/components/home/ProductGrid";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import api from "@/lib/api";
import { Product } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ZA — Premium Streetwear & Fashion",
  description: "Shop ZA's premium streetwear collections. New arrivals, bestsellers, and exclusive drops.",
};

async function getProducts(params: string): Promise<Product[]> {
  try {
    const res = await api.get(`/api/products${params}`);
    return res.data.items || [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, newArrivals, bestSellers] = await Promise.all([
    getProducts("?featured=true&per_page=8"),
    getProducts("?sort=newest&per_page=8"),
    getProducts("?per_page=8"),
  ]);

  return (
    <>
      <HeroBanner />
      <FeaturedCollections />
      <ProductGrid
        title="New Arrivals"
        subtitle="Fresh drops, just landed"
        products={newArrivals}
        viewAllHref="/products?sort=newest"
      />
      <PromoBanner />
      <ProductGrid
        title="Featured Pieces"
        subtitle="Curated for the discerning"
        products={featured}
        viewAllHref="/products?featured=true"
      />
      <ProductGrid
        title="Best Sellers"
        subtitle="What everyone is wearing"
        products={bestSellers}
        viewAllHref="/products"
      />
      <Testimonials />
      <Newsletter />
    </>
  );
}
