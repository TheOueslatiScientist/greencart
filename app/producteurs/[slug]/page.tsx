import { BadgeList } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { ProductCard } from "@/components/shared/ProductCard";
import { prisma } from "@/lib/db";
import { producers as mockProducers } from "@/lib/data/producers";
import { getProductsByProducer } from "@/lib/data/products";
import { formatDate } from "@/lib/utils";
import type { Producer, Product, Badge } from "@/types";
import { MapPin, Package, ShieldCheck, Star } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

async function getProducerData(slug: string): Promise<{
  producer: Producer;
  products: Product[];
} | null> {
  try {
    const row = await prisma.producer.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isAvailable: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (row) {
      const producer: Producer = {
        id: row.id,
        name: row.name,
        slug: row.slug,
        avatar: row.avatar,
        coverImage: row.coverImage,
        location: row.location,
        description: row.description,
        shortBio: row.shortBio,
        badges: JSON.parse(row.badges) as Badge[],
        rating: row.rating,
        reviewCount: row.reviewCount,
        productCount: row.productCount,
        joinedAt: row.joinedAt.toISOString(),
        certifications: JSON.parse(row.certifications),
        distance: row.distance ?? undefined,
      };

      const products: Product[] = row.products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice ?? undefined,
        image: p.image,
        category: p.category,
        badges: JSON.parse(p.badges) as Badge[],
        producerId: p.producerId,
        producerName: row.name,
        producerLocation: row.location,
        stock: p.stock,
        unit: p.unit,
        weight: p.weight ?? undefined,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isAvailable: p.isAvailable,
      }));

      return { producer, products };
    }
  } catch {
    // Fall through to mock data
  }

  // Fallback to mock data
  const mockProducer = mockProducers.find((p) => p.slug === slug);
  if (!mockProducer) return null;

  return {
    producer: mockProducer,
    products: getProductsByProducer(mockProducer.id),
  };
}

export async function generateStaticParams() {
  return mockProducers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProducerData(slug);
  if (!data) return { title: "Producteur introuvable" };
  return { title: data.producer.name, description: data.producer.shortBio };
}

export default async function ProducerPage({ params }: Props) {
  const { slug } = await params;
  const data = await getProducerData(slug);
  if (!data) notFound();

  const { producer, products } = data;

  return (
    <div>
      {/* Cover */}
      <div className="relative h-56 sm:h-72 overflow-hidden bg-gray-200">
        {producer.coverImage ? (
          <Image
            src={producer.coverImage}
            alt={producer.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 gradient-green" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="container-main px-4 sm:px-6 lg:px-8">
        {/* Profile header */}
        <div className="relative -mt-16 mb-8 flex flex-col sm:flex-row items-start gap-5">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-card bg-gray-100 shrink-0">
            {producer.avatar ? (
              <Image
                src={producer.avatar}
                alt={producer.name}
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-brand-primary flex items-center justify-center text-white font-display text-3xl font-bold">
                {producer.name[0]}
              </div>
            )}
          </div>

          <div className="sm:mt-10 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-900">{producer.name}</h1>
                <p className="text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin size={14} />
                  {producer.location}
                  {producer.distance && (
                    <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                      {producer.distance} km
                    </span>
                  )}
                </p>
              </div>
              <StarRating rating={producer.rating} reviewCount={producer.reviewCount} size="md" />
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: <Package size={18} className="text-brand-primary" />, value: producer.productCount, label: "Produits" },
            { icon: <Star size={18} className="text-brand-orange" />, value: producer.rating.toFixed(1), label: "Note" },
            { icon: <ShieldCheck size={18} className="text-brand-primary" />, value: producer.reviewCount, label: "Avis" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="flex justify-center mb-1">{stat.icon}</div>
              <div className="font-display font-bold text-xl text-gray-900">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-3">À propos</h2>
              <p className="text-gray-600 leading-relaxed">{producer.description}</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-bold text-gray-900 mb-5">
                Produits disponibles ({products.length})
              </h2>
              {products.length === 0 ? (
                <p className="text-gray-400 text-sm">Aucun produit disponible pour l'instant.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Labels & Certifications</h3>
              <BadgeList badges={producer.badges} className="mb-4" />
              <div className="space-y-2">
                {producer.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2 text-sm text-gray-600">
                    <ShieldCheck size={14} className="text-brand-primary shrink-0" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Membre depuis</h3>
              <p className="text-sm text-gray-600">{formatDate(producer.joinedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
