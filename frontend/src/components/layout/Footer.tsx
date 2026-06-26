import Link from "next/link";
import Image from "next/image";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      {/* Main footer */}
      <div className="container-za py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-border group-hover:border-gold transition-colors">
                <Image
                  src="/logo.jpg"
                  alt="ZAZA Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display text-2xl font-bold tracking-[0.2em] text-white group-hover:text-gold transition-colors">
                ZA
              </span>
            </Link>
            <p className="mt-4 text-sm text-text-secondary leading-relaxed">
              Premium streetwear and fashion for those who move with intention. Quality crafted for the bold.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-text-secondary hover:text-gold transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-gold transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-secondary hover:text-gold transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-5">Shop</h4>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/products" },
                { label: "Dresses", href: "/collections/dresses" },
                { label: "Tops & Blouses", href: "/collections/tops" },
                { label: "Accessories", href: "/collections/accessories" },
                { label: "New Arrivals", href: "/products?sort=newest" },
                { label: "Best Sellers", href: "/products" },
              ].map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-5">Help</h4>
            <ul className="space-y-3">
              {[
                { label: "Size Guide", href: "#" },
                { label: "Shipping & Delivery", href: "#" },
                { label: "Returns", href: "#" },
                { label: "Track Your Order", href: "/dashboard/orders" },
                { label: "Contact Us", href: "#" },
                { label: "FAQ", href: "#" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-text-secondary hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-white mb-5">Contact</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li>Lagos, Nigeria</li>
              <li>
                <a href="mailto:hello@za.store" className="hover:text-white transition-colors">
                  hello@za.store
                </a>
              </li>
              <li>+234 800 000 0000</li>
              <li className="pt-2">
                <a
                  href="https://wa.me/2348000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:text-accent-light transition-colors text-xs tracking-widest uppercase"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-za py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} ZA. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-text-secondary hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-text-secondary hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
