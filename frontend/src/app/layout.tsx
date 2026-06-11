import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/Providers";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZA — Premium Streetwear & Fashion",
    template: "%s | ZA",
  },
  description:
    "ZA is a premium streetwear and fashion brand. Shop the latest collections in men's, women's, and accessories.",
  keywords: ["ZA", "streetwear", "fashion", "premium", "clothing", "Nigeria"],
  openGraph: {
    title: "ZA — Premium Streetwear & Fashion",
    description: "Redefine your style with ZA's premium collections.",
    type: "website",
    locale: "en_NG",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="bg-background text-text-primary font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
