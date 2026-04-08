"use client";

import { ProductCard } from "@/components/shared/ProductCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { categories } from "@/lib/data/products";
import type { Badge, Product } from "@/types";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

const badgeFilters: { value: Badge; label: string; icon: string }[] = [
  { value: "bio", label: "Bio", icon: "🌿" },
  { value: "local", label: "Local", icon: "📍" },
  { value: "antigaspi", label: "Anti-gaspi", icon: "♻️" },
  { value: "saison", label: "De saison", icon: "🌱" },
  { value: "promo", label: "Promo", icon: "🏷️" },
];

interface CatalogueClientProps {
  initialProducts: Product[];
  initialBadge?: string | null;
  initialCategory?: string | null;
}

export function CatalogueClient({
  initialProducts,
  initialBadge,
  initialCategory,
}: CatalogueClientProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory ?? null
  );
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>(
    initialBadge ? [initialBadge as Badge] : []
  );
  const [sortBy, setSortBy] = useState<"relevance" | "price_asc" | "price_desc" | "rating">(
    "relevance"
  );
  const [showFilters, setShowFilters] = useState(false);

  const toggleBadge = (badge: Badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  const filtered = useMemo(() => {
    let result = [...initialProducts];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.producerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedBadges.length > 0) {
      result = result.filter((p) =>
        selectedBadges.every((b) => p.badges.includes(b))
      );
    }

    if (sortBy === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [initialProducts, search, selectedCategory, selectedBadges, sortBy]);

  const hasFilters = search || selectedCategory || selectedBadges.length > 0;

  return (
    <>
      {/* Search + sort bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit, producteur…"
            leftIcon={<Search size={16} />}
            rightIcon={
              search ? (
                <button onClick={() => setSearch("")}>
                  <X size={16} className="hover:text-gray-700" />
                </button>
              ) : null
            }
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters((v) => !v)}
          className="gap-2 shrink-0"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:inline">Filtres</span>
          {hasFilters && <span className="w-2 h-2 bg-brand-primary rounded-full" />}
        </Button>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="input w-auto shrink-0"
        >
          <option value="relevance">Pertinence</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="rating">Mieux notés</option>
        </select>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="card p-5 mb-6 animate-fade-up">
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Catégories</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                    !selectedCategory
                      ? "bg-brand-primary text-white border-brand-primary"
                      : "border-brand-gray text-gray-600 hover:border-brand-primary hover:text-brand-primary"
                  }`}
                >
                  Tout
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() =>
                      setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                    }
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "border-brand-gray text-gray-600 hover:border-brand-primary hover:text-brand-primary"
                    }`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Labels</p>
              <div className="flex flex-wrap gap-2">
                {badgeFilters.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => toggleBadge(b.value)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${
                      selectedBadges.includes(b.value)
                        ? "bg-brand-primary text-white border-brand-primary"
                        : "border-brand-gray text-gray-600 hover:border-brand-primary hover:text-brand-primary"
                    }`}
                  >
                    {b.icon} {b.label}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                className="text-sm text-brand-red font-medium hover:underline self-start"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                  setSelectedBadges([]);
                }}
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-6">
        {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🌿</p>
          <p className="text-xl font-semibold text-gray-700 mb-2">Aucun produit trouvé</p>
          <p className="text-gray-500">Essayez de modifier vos filtres.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
