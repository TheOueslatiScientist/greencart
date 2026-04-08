import { BadgeList } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { prisma } from "@/lib/db";
import { products as mockProducts } from "@/lib/data/products";
import { getProducerById } from "@/lib/data/producers";
import { formatPrice } from "@/lib/utils";
import type { Badge, Product, Producer } from "@/types";
import { Leaf, MapPin, Package, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";

type Props = { params: Promise<{ slug: string }> };

async function getProductData(slug: string): Promise<{
  product: Product;
  producer: { id: string; name: string; slug: string; location: string; avatar: string };
} | null> {
  // Try DB first
  try {
    const row = await prisma.product.findUnique({
      where: { slug },
      include: {
        producer: {
          select: { id: true, name: true, slug: true, location: true, avatar: true },
        },
      },
    });

    if (row) {
      return {
        product: {
          id: row.id,
          name: row.name,
          slug: row.slug,
          description: row.description,
          price: row.price,
          originalPrice: row.originalPrice ?? undefined,
          image: row.image,
          category: row.category,
          badges: JSON.parse(row.badges) as Badge[],
          producerId: row.producerId,
          producerName: row.producer.name,
          producerLocation: row.producer.location,
          stock: row.stock,
          unit: row.unit,
          weight: row.weight ?? undefined,
          rating: row.rating,
          reviewCount: row.reviewCount,
          isAvailable: row.isAvailable,
        },
        producer: row.producer,
      };
    }
  } catch {
    // DB not ready, fall through to mock
  }

  // Fallback to mock data
  const mockProduct = mockProducts.find((p) => p.slug === slug);
  if (!mockProduct) return null;
  const mockProducer = getProducerById(mockProduct.producerId);
  if (!mockProducer) return null;

  return {
    product: mockProduct,
    producer: {
      id: mockProducer.id,
      name: mockProducer.name,
      slug: mockProducer.slug,
      location: mockProducer.location,
      avatar: mockProducer.avatar,
    },
  };
}

export async function generateStaticParams() {
  return mockProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductData(slug);
  if (!data) return { title: "Produit introuvable" };
  return { title: data.product.name, description: data.product.description };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProductData(slug);
  if (!data) notFound();

  const { product, producer } = data;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="section">
      <div className="container-main">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-brand-primary transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/catalogue" className="hover:text-brand-primary transition-colors">Catalogue</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {discount && (
              <div className="absolute top-5 left-5 bg-brand-red text-white font-bold text-sm px-3 py-1.5 rounded-xl shadow-card">
                -{discount}%
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-6">
            <div>
              <BadgeList badges={product.badges} className="mb-3" />
              <h1 className="font-display text-3xl font-bold text-gray-900">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <MapPin size={14} />
                <Link
                  href={`/producteurs/${producer.slug}`}
                  className="hover:text-brand-primary transition-colors font-medium"
                >
                  {product.producerName}
                </Link>
                <span>·</span>
                <span>{product.producerLocation}</span>
              </div>
            </div>

            <StarRating rating={product.rating} reviewCount={product.reviewCount} size="md" />

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-brand-primary">
                {formatPrice(product.price)}
              </span>
              <span className="text-gray-500 mb-1">/ {product.unit}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-400 line-through mb-1">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.weight && (
              <p className="text-sm text-gray-500">
                <span className="font-medium">Poids :</span> {product.weight}
              </p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <Package
                size={14}
                className={product.stock <= 5 ? "text-brand-orange" : "text-brand-primary"}
              />
              <span className={product.stock <= 5 ? "text-brand-orange font-medium" : "text-gray-600"}>
                {product.stock <= 0
                  ? "Rupture de stock"
                  : product.stock <= 5
                  ? `Plus que ${product.stock} disponibles !`
                  : `${product.stock} disponibles`}
              </span>
            </div>

            <AddToCartButton product={product} />

            {/* Description */}
            <div className="pt-4 border-t border-brand-gray">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{product.description}</p>
            </div>

            {/* Trust indicators */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Leaf size={16} />, label: "Circuit court" },
                { icon: <ShieldCheck size={16} />, label: "Garanti frais" },
                { icon: <MapPin size={16} />, label: "Producteur vérifié" },
              ].map((item) => (
                <div key={item.label} className="card p-3 text-center">
                  <div className="flex justify-center text-brand-primary mb-1">{item.icon}</div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Producer mini card */}
            <div className="card p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {producer.avatar ? (
                  <Image
                    src={producer.avatar}
                    alt={producer.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-100 text-brand-primary font-bold">
                    {producer.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400 mb-0.5">Vendu par</p>
                <p className="font-semibold text-gray-900">{producer.name}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={10} /> {producer.location}
                </p>
              </div>
              <Link href={`/producteurs/${producer.slug}`}>
                <Button variant="secondary" size="sm">Voir le profil</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
