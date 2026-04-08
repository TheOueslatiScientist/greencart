import { CatalogueClient } from "./CatalogueClient";
import { prisma } from "@/lib/db";
import { products as mockProducts } from "@/lib/data/products";
import type { Product } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogue",
  description: "Parcourez tous nos produits locaux, bio et anti-gaspi.",
};

async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({
      where: { isAvailable: true },
      include: {
        producer: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    if (rows.length === 0) return mockProducts;

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.image,
      images: [],
      category: p.category,
      badges: JSON.parse(p.badges),
      producerId: p.producerId,
      producerName: p.producer.name,
      producerLocation: p.producer.location,
      stock: p.stock,
      unit: p.unit,
      weight: p.weight ?? undefined,
      rating: p.rating,
      reviewCount: p.reviewCount,
      isAvailable: p.isAvailable,
      expiresAt: p.expiresAt?.toISOString(),
    }));
  } catch {
    return mockProducts;
  }
}

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ badge?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const products = await getProducts();

  return (
    <div className="section">
      <div className="container-main">
        <div className="mb-8">
          <h1 className="section-title">Catalogue</h1>
          <p className="section-subtitle">
            {products.length} produits locaux disponibles
          </p>
        </div>

        <CatalogueClient
          initialProducts={products}
          initialBadge={sp.badge ?? null}
          initialCategory={sp.category ?? null}
        />
      </div>
    </div>
  );
}
