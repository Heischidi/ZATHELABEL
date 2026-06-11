"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-16">
      <div className="container-za">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Banner 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-64 overflow-hidden bg-gradient-to-r from-[#0B0D09] to-[#1C2417] group"
          >
            <div className="absolute inset-0 flex flex-col justify-center pl-10">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Limited Time</p>
              <h3 className="font-display text-3xl font-bold text-white">Up to 30% Off</h3>
              <p className="text-text-secondary text-sm mt-2 mb-5">On selected men's styles</p>
              <Link href="/collections/men" className="flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-gold group-hover:text-white transition-colors">
                Shop Men's <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {/* Decorative */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-gradient-to-l from-gold to-transparent" />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-display text-[6rem] font-bold text-gold/10 leading-none select-none">
              MEN
            </div>
          </motion.div>

          {/* Banner 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-64 overflow-hidden bg-gradient-to-r from-[#2D3925] to-[#0B0D09] group"
          >
            <div className="absolute inset-0 flex flex-col justify-center pl-10">
              <p className="text-gold text-xs tracking-[0.3em] uppercase mb-2">New In</p>
              <h3 className="font-display text-3xl font-bold text-white">Women's Edit</h3>
              <p className="text-text-secondary text-sm mt-2 mb-5">Curated looks for every occasion</p>
              <Link href="/collections/women" className="flex items-center gap-2 text-xs tracking-widest uppercase font-bold text-gold group-hover:text-white transition-colors">
                Explore <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 font-display text-[5rem] font-bold text-gold/10 leading-none select-none">
              HER
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
