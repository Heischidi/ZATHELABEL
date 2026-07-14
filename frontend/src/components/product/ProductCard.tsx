"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types";
import { formatPrice, getProductPrimaryImage } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cn } from "@/lib/utils";
import InstagramEmbed from "./InstagramEmbed";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);
  const primaryImg = getProductPrimaryImage(product.images);
  const secondaryImg = product.images[1]?.image_url;
  const price = (product.discount_price && product.discount_price > 0) ? product.discount_price : product.price;
  const hasDiscount = !!(product.discount_price && product.discount_price > 0);
  const hasImages = product.images.length > 0;
  const useInstagram = !hasImages && !!product.instagram_url;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={cn("group relative bg-card", className)}
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {useInstagram ? (
          <InstagramEmbed
            instagramUrl={product.instagram_url!}
            productSlug={product.slug}
            productName={product.name}
          />
        ) : (
          <Link href={`/products/${product.slug}`}>
            <Image
              src={primaryImg}
              alt={product.name}
              fill
              className={cn(
                "object-cover transition-all duration-700 ease-out",
                secondaryImg ? "group-hover:opacity-0" : "group-hover:scale-105"
              )}
            />
            {secondaryImg && (
              <Image
                src={secondaryImg}
                alt={`${product.name} alternate`}
                fill
                className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out scale-105"
              />
            )}
          </Link>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new_arrival && <span className="badge-new text-[10px]">NEW</span>}
          {hasDiscount && <span className="badge-gold text-[10px]">SALE</span>}
          {product.is_best_seller && !product.is_new_arrival && (
            <span className="bg-white/10 backdrop-blur-sm text-white text-[10px] px-2 py-1 font-bold tracking-widest uppercase">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product.id)}
            className={cn(
              "w-9 h-9 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all duration-200",
              inWishlist ? "text-red-400" : "text-white hover:text-gold"
            )}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" fill={inWishlist ? "currentColor" : "none"} />
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="w-9 h-9 flex items-center justify-center bg-black/70 backdrop-blur-sm text-white hover:text-gold transition-colors"
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Add to cart — bottom slide up */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={() => addToCart(product, product.sizes[0], product.colors[0]?.name)}
            className="w-full py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-gold transition-colors"
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        {product.category && (
          <p className="text-[10px] text-text-secondary tracking-widest uppercase mb-1">
            {product.category.name}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-medium hover:text-gold transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-gold font-semibold text-sm">{formatPrice(price)}</span>
          {hasDiscount && (
            <span className="text-text-secondary text-xs line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Color swatches */}
        {product.colors.length > 0 && (
          <div className="flex gap-1.5 mt-2">
            {product.colors.slice(0, 4).map((c) => (
              <div
                key={c.name}
                className="w-3.5 h-3.5 rounded-full border border-border"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
