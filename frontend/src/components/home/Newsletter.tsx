"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    toast.success("You're on the list! Welcome to ZA.");
    setEmail("");
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-surface">
      <div className="container-za">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-gold" />
            <span className="text-gold text-xs tracking-[0.3em] uppercase">Newsletter</span>
            <div className="h-px w-12 bg-gold" />
          </div>
          <h2 className="font-display text-display-md font-bold mb-3">
            Stay in the Loop
          </h2>
          <p className="text-text-secondary text-base mb-8 leading-relaxed">
            Be the first to know about new arrivals, exclusive drops, and special offers. No spam — ever.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 text-gold">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-sm tracking-widest uppercase">You're subscribed!</span>
              <div className="w-2 h-2 rounded-full bg-gold" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 input-dark"
                required
                aria-label="Email address"
              />
              <button type="submit" className="btn-gold px-6 flex-shrink-0" aria-label="Subscribe">
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] text-text-secondary mt-4 tracking-wide">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
