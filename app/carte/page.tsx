import { MapWrapper } from "./MapWrapper";
import { prisma } from "@/lib/db";
import { producers as mockProducers } from "@/lib/data/producers";
import type { ProducerMarker, Badge } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte des producteurs",
  description:
    "Localisez les producteurs GreenCart autour de vous sur la carte interactive.",
};

async function getProducerMarkers(): Promise<ProducerMarker[]> {
  try {
    const rows = await prisma.producer.findMany({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        address: true,
        latitude: true,
        longitude: true,
        badges: true,
        rating: true,
        productCount: true,
        avatar: true,
      },
    });

    if (rows.length === 0) throw new Error("empty");

    return rows
      .filter((p) => p.latitude !== null && p.longitude !== null)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        city: p.city,
        address: p.address,
        latitude: p.latitude!,
        longitude: p.longitude!,
        badges: JSON.parse(p.badges) as Badge[],
        rating: p.rating,
        productCount: p.productCount,
        avatar: p.avatar,
      }));
  } catch {
    // Fallback to mock data
    return mockProducers
      .filter((p) => p.latitude !== undefined && p.longitude !== undefined)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        city: p.city ?? p.location.split(",")[0].trim(),
        address: p.address ?? "",
        latitude: p.latitude!,
        longitude: p.longitude!,
        badges: p.badges,
        rating: p.rating,
        productCount: p.productCount,
        avatar: p.avatar,
      }));
  }
}

export default async function CartePage() {
  const markers = await getProducerMarkers();

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)" }}>
      {/* Header compact */}
      <div className="bg-white border-b border-brand-gray px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-display font-bold text-gray-900 text-lg">
            🗺️ Carte des producteurs
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {markers.length} producteurs dans la MEL · Cliquez sur un marqueur pour en savoir plus
          </p>
        </div>
        <a
          href="/producteurs"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-brand-primary hover:underline"
        >
          ← Liste des producteurs
        </a>
      </div>

      {/* Map (full remaining height) */}
      <div className="flex-1 overflow-hidden">
        <MapWrapper producers={markers} />
      </div>
    </div>
  );
}
