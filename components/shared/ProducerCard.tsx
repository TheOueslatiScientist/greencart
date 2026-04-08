import { BadgeList } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import type { Producer } from "@/types";
import { MapPin, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProducerCardProps {
  producer: Producer;
}

export function ProducerCard({ producer }: ProducerCardProps) {
  return (
    <Link href={`/producteurs/${producer.slug}`}>
      <div className="card-hover group h-full flex flex-col">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden bg-gray-100">
          <Image
            src={producer.coverImage}
            alt={producer.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Avatar + content */}
        <div className="p-4 flex flex-col gap-3 -mt-8 relative">
          <div className="flex items-end justify-between">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white shadow-card bg-gray-100">
              <Image
                src={producer.avatar}
                alt={producer.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            {producer.distance && (
              <span className="text-xs text-gray-500 bg-white px-2.5 py-1 rounded-full border border-brand-gray shadow-soft">
                📍 {producer.distance} km
              </span>
            )}
          </div>

          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              {producer.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <MapPin size={10} />
              {producer.location}
            </p>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
            {producer.shortBio}
          </p>

          <BadgeList badges={producer.badges} />

          <div className="flex items-center justify-between pt-2 border-t border-brand-gray">
            <StarRating rating={producer.rating} reviewCount={producer.reviewCount} />
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Package size={12} />
              {producer.productCount} produits
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
