"use client";

import { useWishlist } from "@/hooks/useWishlist";
import ProductCard from "@/components/product/ProductCard";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist() as any;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-6">My Wishlist</h1>
      {wishlist?.items.length === 0 ? (
        <div className="card-dark p-10 text-center">
          <Heart className="w-12 h-12 text-border mx-auto mb-3" />
          <p className="text-text-secondary mb-4">Your wishlist is empty.</p>
          <Link href="/products" className="btn-gold">Browse Products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist?.items.map((item: any) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
}
