"use client";

import { createProduct } from "@/lib/actions/products";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { categories } from "@/lib/data/products";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const badgeOptions = [
  { value: "bio", label: "🌿 Bio certifié" },
  { value: "local", label: "📍 Local" },
  { value: "antigaspi", label: "♻️ Anti-gaspi" },
  { value: "saison", label: "🌱 De saison" },
  { value: "promo", label: "🏷️ Promo" },
];

export default function NouveauProduitPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedBadges, setSelectedBadges] = useState<string[]>(["local"]);

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

    const result = await createProduct({
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
          <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Produit publié !</h2>
          <p className="text-gray-500">Redirection vers vos produits…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/produits">
            <Button variant="ghost" size="icon"><ArrowLeft size={18} /></Button>
          </Link>
          <div>
            <h1 className="section-title">Nouveau produit</h1>
            <p className="text-gray-500">Renseignez les informations de votre produit</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card p-6 space-y-5">
            <h2 className="font-display font-bold text-gray-900">Informations générales</h2>
            <Input name="name" label="Nom du produit" placeholder="ex: Tomates cerises bio" required />
            <div>
              <label className="label">Description</label>
              <textarea
                name="description"
                className="input min-h-[100px] resize-none"
                placeholder="Décrivez votre produit : variété, culture, conservation…"
                required
              />
            </div>
            <div>
              <label className="label">Catégorie</label>
              <select name="category" className="input" required>
                <option value="">Choisir une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="card p-6 space-y-5">
            <h2 className="font-display font-bold text-gray-900">Prix & Stock</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input name="price" label="Prix (€)" type="number" step="0.01" min="0.01" placeholder="0.00" required />
              <Input name="originalPrice" label="Prix barré (€)" type="number" step="0.01" placeholder="Facultatif" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input name="stock" label="Quantité en stock" type="number" min="0" placeholder="0" required />
              <div>
                <label className="label">Unité</label>
                <select name="unit" className="input" required>
                  {["kg", "g", "pièce", "barquette", "panier", "pot", "litre", "miche", "bouquet", "filet", "boîte", "botte"].map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input name="weight" label="Poids / contenance" placeholder="ex: 500 g, 1 kg, 6 œufs" />
          </div>

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

          <div className="card p-6 space-y-4">
            <h2 className="font-display font-bold text-gray-900">URL de l'image</h2>
            <Input
              name="image"
              placeholder="https://images.unsplash.com/…"
              type="url"
            />
            <p className="text-xs text-gray-400">
              Copiez une URL d'image Unsplash ou hébergée. La gestion d'upload arrivera dans une prochaine version.
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
              {loading ? "Publication…" : "Publier le produit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
