import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "@/app/providers";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "GreenCart – Marketplace locale & écoresponsable",
    template: "%s | GreenCart",
  },
  description:
    "Découvrez et commandez des produits frais et locaux directement auprès des producteurs de votre région. Réduisez votre empreinte carbone, soutenez l'agriculture locale.",
  keywords: ["produits locaux", "bio", "circuit court", "anti-gaspillage", "marketplace", "producteurs"],
  openGraph: {
    title: "GreenCart – Marketplace locale & écoresponsable",
    description:
      "Découvrez et commandez des produits frais et locaux directement auprès des producteurs de votre région.",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
