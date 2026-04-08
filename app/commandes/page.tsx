import { Button } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  preparing: { label: "En préparation", color: "bg-purple-100 text-purple-700" },
  ready: { label: "Prête à récupérer", color: "bg-teal-100 text-teal-700" },
  delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-600" },
};

export default async function CommandesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion?callbackUrl=/commandes");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, image: true, producer: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="section min-h-screen bg-brand-offwhite">
      <div className="container-main max-w-3xl">
        <h1 className="section-title mb-8">Mes commandes</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="mx-auto text-brand-gray mb-4" />
            <p className="text-xl font-semibold text-gray-700 mb-2">Aucune commande</p>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore passé de commande.</p>
            <Link href="/catalogue">
              <Button>Explorer le catalogue</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.pending;
              const firstItem = order.items[0];
              return (
                <div key={order.id} className="card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-gray-900 font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                  </div>

                  {/* Items preview */}
                  <div className="flex items-center gap-2 mb-3">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <span className="text-xs text-gray-500">+{order.items.length - 3} autres</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-1">
                    {order.items.map((i) => `${i.product.name} x${i.quantity}`).join(" · ")}
                  </p>
                  {firstItem && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      Chez {firstItem.product.producer.name}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-brand-gray">
                    <span className="font-bold text-brand-primary">
                      {formatPrice(order.total)}
                    </span>
                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <Button variant="ghost" size="sm" className="text-brand-red hover:bg-red-50">
                          Annuler
                        </Button>
                      )}
                      <Button variant="outline" size="sm">Détails</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
