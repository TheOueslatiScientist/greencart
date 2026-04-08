import { Button } from "@/components/ui/Button";
import { BadgeList } from "@/components/ui/Badge";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Edit, Plus, Trash2, ToggleLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { Badge } from "@/types";
import { DeleteProductButton } from "./DeleteProductButton";
import { ToggleProductButton } from "./ToggleProductButton";

export default async function DashboardProduitsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    redirect("/connexion?callbackUrl=/dashboard/produits");
  }

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
    include: {
      products: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!producer) {
    return (
      <div className="section bg-brand-offwhite min-h-screen">
        <div className="container-main text-center py-20">
          <p className="text-gray-500">Aucun profil producteur trouvé.</p>
        </div>
      </div>
    );
  }

  const products = producer.products;

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="section-title">Mes produits</h1>
            <p className="text-gray-500 mt-1">
              {products.filter((p) => p.isAvailable).length} actifs · {products.length} au total
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="outline" size="md">← Dashboard</Button>
            </Link>
            <Link href="/dashboard/produits/nouveau">
              <Button size="md">
                <Plus size={16} />
                Ajouter
              </Button>
            </Link>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-4xl mb-4">🌿</p>
            <p className="font-semibold text-gray-700 mb-2">Aucun produit pour l'instant</p>
            <p className="text-gray-500 text-sm mb-6">Ajoutez votre premier produit pour commencer à vendre.</p>
            <Link href="/dashboard/produits/nouveau">
              <Button><Plus size={16} /> Ajouter un produit</Button>
            </Link>
          </div>
        ) : (
          <div className="card overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-brand-gray text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span></span>
              <span>Produit</span>
              <span>Prix</span>
              <span>Stock</span>
              <span>Labels</span>
              <span>Actions</span>
            </div>

            <div className="divide-y divide-brand-gray">
              {products.map((product) => {
                const badges: Badge[] = JSON.parse(product.badges);
                return (
                  <div
                    key={product.id}
                    className={`grid grid-cols-1 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 ${
                      !product.isAvailable ? "opacity-50" : ""
                    }`}
                  >
                    {/* Image */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-green-50 flex items-center justify-center text-xl">🌿</div>
                      )}
                    </div>

                    {/* Name */}
                    <div>
                      <p className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                    </div>

                    {/* Price */}
                    <div className="text-sm font-bold text-brand-primary">
                      {formatPrice(product.price)}
                      <span className="font-normal text-gray-400"> /{product.unit}</span>
                    </div>

                    {/* Stock */}
                    <div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        product.stock <= 3
                          ? "bg-red-100 text-red-600"
                          : product.stock <= 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}>
                        {product.stock}
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="hidden lg:flex">
                      <BadgeList badges={badges} max={2} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Link href={`/dashboard/produits/${product.id}/modifier`}>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-brand-primary" title="Modifier">
                          <Edit size={15} />
                        </button>
                      </Link>
                      <ToggleProductButton productId={product.id} isAvailable={product.isAvailable} />
                      <DeleteProductButton productId={product.id} productName={product.name} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
