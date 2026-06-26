"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Instagram } from "lucide-react";

interface InstagramEmbedProps {
  instagramUrl: string;
  productSlug: string;
  productName: string;
}

/**
 * Extracts the post shortcode from any Instagram URL format:
 * https://www.instagram.com/p/ABC123/
 * https://www.instagram.com/reel/ABC123/
 * https://instagram.com/p/ABC123/?utm_source=...
 */
function extractPostId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

export default function InstagramEmbed({
  instagramUrl,
  productSlug,
  productName,
}: InstagramEmbedProps) {
  const [loaded, setLoaded] = useState(false);
  const postId = extractPostId(instagramUrl);

  // Load Instagram's embed.js once
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.getElementById("ig-embed-script")) return;
    const script = document.createElement("script");
    script.id = "ig-embed-script";
    script.src = "//www.instagram.com/embed.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  if (!postId) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-surface text-text-secondary text-xs text-center p-4">
        <div>
          <Instagram className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>Invalid Instagram URL</p>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.instagram.com/p/${postId}/embed/captioned/`;

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0B0D09]">
      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface animate-pulse">
          <Instagram className="w-8 h-8 text-text-secondary opacity-40" />
        </div>
      )}

      {/* Instagram embed iframe — pointer-events: none so it doesn't intercept clicks */}
      <iframe
        src={embedUrl}
        title={`Instagram post for ${productName}`}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          pointerEvents: "none",
          transform: "scale(1.02)", // slightly scale up to hide iframe border artifacts
          transformOrigin: "top center",
        }}
        onLoad={() => setLoaded(true)}
        scrolling="no"
        allowTransparency
      />

      {/* Clickable overlay — routes to product page */}
      <Link
        href={`/products/${productSlug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${productName}`}
      />

      {/* Instagram badge */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full pointer-events-none">
        <Instagram className="w-3 h-3 text-white/70" />
        <span className="text-[9px] text-white/70 tracking-widest uppercase">Instagram</span>
      </div>
    </div>
  );
}
