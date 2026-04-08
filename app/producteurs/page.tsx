import { ProducerCard } from "@/components/shared/ProducerCard";
import { prisma } from "@/lib/db";
import { producers as mockProducers } from "@/lib/data/producers";
import type { Producer } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nos Producteurs",
  description: "Découvrez les producteurs et artisans locaux partenaires de GreenCart.",
};

async function getProducers(): Promise<Producer[]> {
  try {
    const rows = await prisma.producer.findMany({
      orderBy: { rating: "desc" },
    });

    if (rows.length === 0) return mockProducers;

    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      avatar: p.avatar,
      coverImage: p.coverImage,
      location: p.location,
      description: p.description,
      shortBio: p.shortBio,
      badges: JSON.parse(p.badges),
      rating: p.rating,
      reviewCount: p.reviewCount,
      productCount: p.productCount,
      joinedAt: p.joinedAt.toISOString(),
      certifications: JSON.parse(p.certifications),
      distance: p.distance ?? undefined,
    }));
  } catch {
    return mockProducers;
  }
}

export default async function ProducteursPage() {
  const producers = await getProducers();

  return (
    <div className="section">
      <div className="container-main">
        <div className="text-center mb-12">
          <h1 className="section-title">Nos Producteurs</h1>
          <p className="section-subtitle mx-auto">
            {producers.length} producteurs vérifiés, engagés pour une agriculture locale et durable.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {[
            { icon: "🌿", label: "Bio certifié" },
            { icon: "📍", label: "Circuit local" },
            { icon: "♻️", label: "Anti-gaspillage" },
            { icon: "🌱", label: "De saison" },
          ].map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100"
            >
              {b.icon} {b.label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {producers.map((producer) => (
            <ProducerCard key={producer.id} producer={producer} />
          ))}
        </div>
      </div>
    </div>
  );
}
