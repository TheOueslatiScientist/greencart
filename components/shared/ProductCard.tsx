"use client";

import { Badge, BadgeList } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link href={`/produits/${product.slug}`}>
      <div className="card-hover group h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {discount && (
            <div className="absolute top-3 left-3 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-lg">
              -{discount}%
            </div>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-3 right-3 bg-brand-orange text-white text-xs font-semibold px-2 py-1 rounded-lg">
              Plus que {product.stock} !
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-2">
          <BadgeList badges={product.badges} max={2} />

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2 text-sm">
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              📍 {product.producerName} · {product.producerLocation}
            </p>
          </div>

          <StarRating rating={product.rating} reviewCount={product.reviewCount} />

          <div className="flex items-center justify-between mt-1">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-brand-primary">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-gray-400">/ {product.unit}</span>
              </div>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <Button
              size="icon"
              variant={added ? "secondary" : "primary"}
              onClick={handleAdd}
              className="shrink-0"
            >
              <ShoppingCart size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
