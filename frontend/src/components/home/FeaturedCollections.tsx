"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const collections = [
  {
    title: "Dresses",
    subtitle: "From day to night, draped in elegance",
    href: "/collections/dresses",
    gradient: "from-[#1B2016] to-[#0B0D09]",
    accent: "#7E8F6A",
    tag: "Dresses",
  },
  {
    title: "Tops & Blouses",
    subtitle: "Effortless femininity, every detail",
    href: "/collections/tops",
    gradient: "from-[#222A1E] to-[#0B0D09]",
    accent: "#9BB083",
    tag: "Tops",
  },
  {
    title: "Accessories",
    subtitle: "The finishing touch to every look",
    href: "/collections/accessories",
    gradient: "from-[#131710] to-[#0B0D09]",
    accent: "#7E8F6A",
    tag: "Acc.",
  },
];

export default function FeaturedCollections() {
  return (
    <section className="section-pad bg-background">
      <div className="container-za">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Explore</span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-display-md font-bold">Featured Collections</h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Link href={col.href} className="group block relative h-[400px] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} transition-transform duration-700 group-hover:scale-105`} />
                {/* Decorative diagonal */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 30% 70%, ${col.accent}15, transparent 60%)`,
                  }}
                />
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: col.accent }}>
                      ZA {col.tag}
                    </p>
                    <h3 className="font-display text-2xl font-bold text-white mb-1">{col.title}</h3>
                    <p className="text-text-secondary text-sm mb-4">{col.subtitle}</p>
                    <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-semibold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Shop Now <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                {/* Corner accent */}
                <div
                  className="absolute top-6 right-6 w-12 h-12 border-t border-r opacity-30 group-hover:opacity-70 transition-opacity duration-300"
                  style={{ borderColor: col.accent }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
