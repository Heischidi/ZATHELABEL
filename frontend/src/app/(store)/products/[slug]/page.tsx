"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Heart, ShoppingBag, ChevronLeft, ChevronRight, Minus, Plus, Share2 } from "lucide-react";
import api from "@/lib/api";
import { Product } from "@/types";
import { formatPrice, getProductPrimaryImage } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["product", slug],
    queryFn: () => api.get(`/api/products/${slug}`).then((r) => r.data),
  });

  const { data: related } = useQuery<Product[]>({
    queryKey: ["related", slug],
    queryFn: () => api.get(`/api/products/${slug}/related`).then((r) => r.data),
    enabled: !!product,
  });

  if (isLoading) {
    return (
      <div className="pt-20 container-za py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="skeleton aspect-square" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4" />
            <div className="skeleton h-6 w-1/4" />
            <div className="skeleton h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return <div className="pt-20 text-center py-20 text-text-secondary">Product not found.</div>;

  const inWishlist = isInWishlist(product.id);
  const price = product.discount_price ?? product.price;
  const images = product.images.length > 0
    ? product.images
    : [{ id: 0, image_url: "/placeholder-product.jpg", is_primary: true, sort_order: 0 }];

  const handleAddToCart = () => {
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="container-za py-4">
        <nav className="flex items-center gap-2 text-xs text-text-secondary">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-white transition-colors">Products</Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </nav>
      </div>

      <div className="container-za pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative aspect-[4/5] bg-surface overflow-hidden">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[activeImage]?.image_url || "/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImage(i)}
                    className={`relative aspect-square overflow-hidden border-2 transition-colors ${
                      activeImage === i ? "border-gold" : "border-border"
                    }`}
                  >
                    <Image src={img.image_url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            {product.category && (
              <Link
                href={`/collections/${product.category.slug}`}
                className="text-xs text-gold tracking-[0.2em] uppercase hover:text-accent-light transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            <h1 className="font-display text-display-sm font-bold leading-tight">{product.name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-gold text-2xl font-bold">{formatPrice(price)}</span>
              {product.discount_price && (
                <span className="text-text-secondary text-lg line-through">{formatPrice(product.price)}</span>
              )}
              {product.discount_price && (
                <span className="badge-gold text-[10px]">
                  -{Math.round((1 - product.discount_price / product.price) * 100)}%
                </span>
              )}
            </div>

            <div className="h-px bg-border" />

            {/* Description */}
            {product.description && (
              <p className="text-text-secondary text-sm leading-relaxed">{product.description}</p>
            )}

            {/* Colors */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  Color: <span className="text-gold font-normal">{selectedColor || "Select"}</span>
                </p>
                <div className="flex gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === c.name ? "border-gold scale-110" : "border-border"
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes.length > 0 && (
              <div>
                <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3">
                  Size: <span className="text-gold font-normal">{selectedSize || "Select"}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 text-xs font-medium transition-all border ${
                        selectedSize === size
                          ? "border-gold text-gold bg-gold/10"
                          : "border-border text-text-secondary hover:border-white hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-xs text-text-secondary">
                  {product.stock_quantity} in stock
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="btn-gold flex-1 py-4"
                disabled={product.stock_quantity === 0}
              >
                <ShoppingBag className="w-5 h-5" />
                {product.stock_quantity === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
              <button
                onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
                className={`w-14 border flex items-center justify-center transition-all ${
                  inWishlist ? "border-gold text-gold" : "border-border text-text-secondary hover:border-white hover:text-white"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart className="w-5 h-5" fill={inWishlist ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Stock warning */}
            {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
              <p className="text-[11px] text-warning">Only {product.stock_quantity} left in stock!</p>
            )}

            {/* Meta */}
            <div className="text-[11px] text-text-secondary space-y-1 pt-4 border-t border-border">
              <p>Free delivery on orders over ₦50,000</p>
              <p>Secure checkout via WhatsApp payment</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related && related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-8 bg-gold" />
              <h2 className="font-display text-2xl font-bold">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
