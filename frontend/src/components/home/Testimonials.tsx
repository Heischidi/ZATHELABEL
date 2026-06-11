"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Aisha M.",
    location: "Lagos",
    text: "ZA has completely transformed my wardrobe. The quality is unmatched and every piece feels intentionally crafted. I get compliments everywhere I go.",
    rating: 5,
    initials: "AM",
  },
  {
    name: "Emeka O.",
    location: "Abuja",
    text: "Finally a brand that understands Nigerian streetwear. The fits are perfect and the delivery was quick. Will definitely shop again.",
    rating: 5,
    initials: "EO",
  },
  {
    name: "Chioma N.",
    location: "Port Harcourt",
    text: "The bomber jacket I ordered is absolutely stunning. Premium material, great stitching, and the packaging was beautiful. 10/10.",
    rating: 5,
    initials: "CN",
  },
];

export default function Testimonials() {
  return (
    <section className="section-pad bg-surface">
      <div className="container-za">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Reviews</span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-display-md font-bold">What Our Customers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="card-dark p-8 relative"
            >
              {/* Quote mark */}
              <div className="absolute top-6 right-6 font-display text-5xl text-gold/20 leading-none select-none">"</div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-6">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-[11px] text-text-secondary">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
