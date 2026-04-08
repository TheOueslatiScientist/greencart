"use client";

import { updateProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { categories } from "@/lib/data/products";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Badge } from "@/types";

interface ProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badges: Badge[];
  stock: number;
  unit: string;
  weight?: string;
}

const badgeOptions = [
  { value: "bio", label: "🌿 Bio certifié" },
  { value: "local", label: "📍 Local" },
  { value: "antigaspi", label: "♻️ Anti-gaspi" },
  { value: "saison", label: "🌱 De saison" },
  { value: "promo", label: "🏷️ Promo" },
];

const unitOptions = [
  "kg", "g", "pièce", "barquette", "panier", "pot",
  "litre", "miche", "bouquet", "filet", "boîte", "botte",
];

export function ModifierProduitForm({ product }: { product: ProductData }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>(product.badges);

  const toggleBadge = (value: string) => {
    setSelectedBadges((prev) =>
      prev.includes(value) ? prev.filter((b) => b !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);

    const result = await updateProduct(product.id, {
      name: fd.get("name") as string,
      description: fd.get("description") as string,
      price: fd.get("price") as string,
      originalPrice: (fd.get("originalPrice") as string) || undefined,
      image: (fd.get("image") as string) || undefined,
      category: fd.get("category") as string,
      badges: selectedBadges,
      stock: fd.get("stock") as string,
      unit: fd.get("unit") as string,
      weight: (fd.get("weight") as string) || undefined,
    });

    if (!result.success) {
      setError(result.error ?? "Une erreur est survenue.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/dashboard/produits"), 1500);
  };

  if (success) {
    return (
      <div className="section min-h-screen bg-brand-offwhite flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="text-brand-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Produit mis à jour !</h2>
          <p className="text-gray-500">Redirection vers vos produits…</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations générales */}
      <div className="card p-6 space-y-5">
        <h2 className="font-display font-bold text-gray-900">Informations générales</h2>
        <Input
          name="name"
          label="Nom du produit"
          defaultValue={product.name}
          placeholder="ex: Tomates cerises bio"
          required
        />
        <div>
          <label className="label">Description</label>
          <textarea
            name="description"
            className="input min-h-[100px] resize-none"
            defaultValue={product.description}
            placeholder="Décrivez votre produit : variété, culture, conservation…"
            required
          />
        </div>
        <div>
          <label className="label">Catégorie</label>
          <select name="category" className="input" defaultValue={product.category} required>
            <option value="">Choisir une catégorie</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prix & Stock */}
      <div className="card p-6 space-y-5">
        <h2 className="font-display font-bold text-gray-900">Prix & Stock</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="price"
            label="Prix (€)"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={String(product.price)}
            required
          />
          <Input
            name="originalPrice"
            label="Prix barré (€)"
            type="number"
            step="0.01"
            defaultValue={product.originalPrice ? String(product.originalPrice) : ""}
            placeholder="Facultatif"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            name="stock"
            label="Quantité en stock"
            type="number"
            min="0"
            defaultValue={String(product.stock)}
            required
          />
          <div>
            <label className="label">Unité</label>
            <select name="unit" className="input" defaultValue={product.unit} required>
              {unitOptions.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>
        <Input
          name="weight"
          label="Poids / contenance"
          defaultValue={product.weight ?? ""}
          placeholder="ex: 500 g, 1 kg, 6 œufs"
        />
      </div>

      {/* Labels */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-gray-900">Labels</h2>
        <div className="flex flex-wrap gap-2">
          {badgeOptions.map((badge) => (
            <button
              key={badge.value}
              type="button"
              onClick={() => toggleBadge(badge.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                selectedBadges.includes(badge.value)
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "border-brand-gray text-gray-600 hover:border-brand-primary"
              }`}
            >
              {badge.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image */}
      <div className="card p-6 space-y-4">
        <h2 className="font-display font-bold text-gray-900">URL de l'image</h2>
        <Input
          name="image"
          defaultValue={product.image}
          placeholder="https://images.unsplash.com/…"
          type="url"
        />
        {product.image && (
          <div className="w-20 h-20 rounded-xl overflow-hidden border border-brand-gray">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt="Aperçu"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <p className="text-xs text-gray-400">
          Copiez une URL d'image Unsplash ou hébergée.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-brand-red">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Link href="/dashboard/produits" className="flex-1">
          <Button variant="outline" size="lg" className="w-full">Annuler</Button>
        </Link>
        <Button type="submit" size="lg" className="flex-1" disabled={loading}>
          {loading ? "Enregistrement…" : "Enregistrer les modifications"}
        </Button>
      </div>
    </form>
  );
}
