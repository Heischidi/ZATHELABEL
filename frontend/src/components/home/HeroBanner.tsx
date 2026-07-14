"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export default function HeroBanner() {
  const { data: settings } = useQuery<Record<string, string>>({
    queryKey: ["public-settings"],
    queryFn: () => api.get("/api/admin/settings/public").then((r) => r.data),
  });

  const bgUrl = settings?.homepage_bg_url;

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Background image or gradient */}
      {bgUrl ? (
        <div className="absolute inset-0 bg-[#0B0D09]">
          <img
            src={bgUrl}
            alt="ZA Background"
            className="w-full h-full object-cover object-center opacity-40 transition-opacity duration-1000"
          />
          {/* Readability overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D09] via-transparent to-black/50" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B0D09] via-[#0E110C] to-[#151B11]">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-25"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, #7E8F6A 0%, transparent 50%),
                                radial-gradient(circle at 80% 20%, #7E8F6A 0%, transparent 40%)`,
            }}
          />
          <div className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 40px,
                rgba(126,143,106,0.03) 40px,
                rgba(126,143,106,0.03) 80px
              )`,
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-za">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-10 h-px bg-gold" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
                SS 2025 Collection
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-display-xl md:text-display-2xl font-bold text-white leading-[1.05] tracking-tight"
            >
              New Season
              <br />
              <span className="text-gold italic">Arrivals.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-text-secondary text-lg leading-relaxed max-w-md"
            >
              Premium streetwear crafted for those who move with intention. Elevate every moment.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 mt-10"
            >
              <Link href="/products" className="btn-gold px-8 py-4 text-base">
                Shop Collection
              </Link>
              <Link href="/products?sort=newest&featured=true" className="btn-outline px-8 py-4 text-base flex items-center gap-2">
                New Arrivals
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating ZA watermark */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none">
        <span className="font-display text-[20vw] font-bold text-white/[0.03] leading-none">ZA</span>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent animate-pulse" />
        <span className="text-[10px] text-text-secondary tracking-[0.3em] uppercase">Scroll</span>
      </motion.div>
    </section>
  );
}
