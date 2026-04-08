import { Button } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/utils";
import { Package } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UpdateOrderStatusButton } from "./UpdateOrderStatusButton";

const statusConfig: Record<string, { label: string; color: string; next?: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", next: "confirmed" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-700", next: "preparing" },
  preparing: { label: "En préparation", color: "bg-purple-100 text-purple-700", next: "ready" },
  ready: { label: "Prête", color: "bg-teal-100 text-teal-700", next: "delivered" },
  delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-600" },
};

export default async function DashboardCommandesPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    redirect("/connexion?callbackUrl=/dashboard/commandes");
  }

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });

  if (!producer) redirect("/dashboard");

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { product: { producerId: producer.id } } },
    },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        where: { product: { producerId: producer.id } },
        include: {
          product: { select: { name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">Commandes</h1>
            <p className="text-gray-500 mt-1">{orders.length} commandes au total</p>
          </div>
          <a href="/dashboard">
            <Button variant="outline" size="md">← Dashboard</Button>
          </a>
        </div>

        {orders.length === 0 ? (
          <div className="card p-12 text-center">
            <Package size={48} className="mx-auto text-brand-gray mb-4" />
            <p className="text-lg font-semibold text-gray-700">Aucune commande pour l'instant</p>
            <p className="text-sm text-gray-500 mt-2">Les commandes apparaîtront ici dès qu'un client achètera vos produits.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.pending;
              return (
                <div key={order.id} className="card p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-bold text-gray-900 font-mono">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-brand-primary">{formatPrice(order.total)}</span>
                      {status.next && (
                        <UpdateOrderStatusButton
                          orderId={order.id}
                          nextStatus={status.next}
                          nextLabel={statusConfig[status.next]?.label ?? status.next}
                        />
                      )}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{order.user.name}</span>
                    <span className="text-gray-400"> · {order.user.email}</span>
                  </div>

                  <div className="space-y-1">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-6 h-6 rounded-md overflow-hidden bg-gray-100 shrink-0">
                          {item.product.image && (
                            <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="line-clamp-1">
                          {item.product.name} × {item.quantity}
                        </span>
                        <span className="ml-auto text-gray-400 shrink-0">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
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
