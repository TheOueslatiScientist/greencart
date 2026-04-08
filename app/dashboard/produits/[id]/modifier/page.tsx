import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { ModifierProduitForm } from "./ModifierProduitForm";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Badge } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Modifier le produit" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModifierProduitPage({ params }: PageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    redirect("/connexion?callbackUrl=/dashboard/produits");
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { producer: { select: { userId: true } } },
  });

  if (!product || product.producer.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/produits">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="section-title">Modifier le produit</h1>
            <p className="text-gray-500 truncate max-w-xs">{product.name}</p>
          </div>
        </div>

        <ModifierProduitForm
          product={{
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            originalPrice: product.originalPrice ?? undefined,
            image: product.image,
            category: product.category,
            badges: JSON.parse(product.badges) as Badge[],
            stock: product.stock,
            unit: product.unit,
            weight: product.weight ?? undefined,
          }}
        />
      </div>
    </div>
  );
}
