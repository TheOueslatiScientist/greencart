import { Button } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import {
  ArrowUpRight,
  BarChart3,
  Box,
  CheckCircle,
  Clock,
  Package,
  Plus,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

async function getDashboardData(userId: string) {
  const producer = await prisma.producer.findUnique({
    where: { userId },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!producer) return null;

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { product: { producerId: producer.id } } },
    },
    include: {
      user: { select: { name: true } },
      items: {
        include: {
          product: { select: { name: true, producerId: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const allOrders = await prisma.order.findMany({
    where: { items: { some: { product: { producerId: producer.id } } } },
    include: { items: { include: { product: { select: { producerId: true } } } } },
  });

  const revenue = allOrders.reduce((acc, o) => {
    const producerTotal = o.items
      .filter((i) => i.product.producerId === producer.id)
      .reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    return acc + producerTotal;
  }, 0);

  const uniqueCustomers = new Set(allOrders.map((o) => o.userId)).size;

  return { producer, orders, revenue, uniqueCustomers, totalOrders: allOrders.length };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "Confirmée", color: "bg-blue-100 text-blue-700" },
  preparing: { label: "En préparation", color: "bg-purple-100 text-purple-700" },
  ready: { label: "Prête", color: "bg-teal-100 text-teal-700" },
  delivered: { label: "Livrée", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Annulée", color: "bg-red-100 text-red-600" },
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    redirect("/connexion?callbackUrl=/dashboard");
  }

  const data = await getDashboardData(session.user.id);

  if (!data) {
    return (
      <div className="section bg-brand-offwhite min-h-screen">
        <div className="container-main text-center py-20">
          <p className="text-gray-500 mb-4">Aucun profil producteur trouvé.</p>
          <Link href="/inscription?role=vendeur">
            <Button>Créer mon profil producteur</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { producer, orders, revenue, uniqueCustomers, totalOrders } = data;

  const kpis = [
    {
      label: "Chiffre d'affaires",
      value: formatPrice(revenue),
      icon: <TrendingUp size={20} className="text-brand-primary" />,
    },
    {
      label: "Commandes",
      value: String(totalOrders),
      icon: <ShoppingBag size={20} className="text-brand-primary" />,
    },
    {
      label: "Produits actifs",
      value: String(producer.products.filter((p) => p.isAvailable).length),
      icon: <Box size={20} className="text-brand-primary" />,
    },
    {
      label: "Clients uniques",
      value: String(uniqueCustomers),
      icon: <Users size={20} className="text-brand-primary" />,
    },
  ];

  const lowStockProducts = producer.products.filter((p) => p.stock <= 10 && p.isAvailable);

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="section-title">Tableau de bord</h1>
            <p className="text-gray-500 mt-1">
              Bienvenue, <strong>{producer.name}</strong> 👋
            </p>
          </div>
          <Link href="/dashboard/produits/nouveau">
            <Button size="md">
              <Plus size={16} />
              Ajouter un produit
            </Button>
          </Link>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  {kpi.icon}
                </div>
              </div>
              <div className="font-display text-2xl font-bold text-gray-900">{kpi.value}</div>
              <div className="text-sm text-gray-500 mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 card">
            <div className="p-6 flex items-center justify-between border-b border-brand-gray">
              <h2 className="font-display font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-brand-primary" />
                Dernières commandes
              </h2>
              <Link href="/dashboard/commandes">
                <Button variant="ghost" size="sm">
                  Tout voir <ArrowUpRight size={14} />
                </Button>
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <Package size={40} className="mx-auto mb-3 opacity-50" />
                <p className="text-sm">Aucune commande pour l'instant</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-gray">
                {orders.map((order) => {
                  const status = statusConfig[order.status] ?? statusConfig.pending;
                  const firstItem = order.items.find(
                    (i) => i.product.producerId === producer.id
                  );
                  return (
                    <div key={order.id} className="p-4 flex items-center gap-4">
                      <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                        <Package size={16} className="text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-gray-900">
                            #{order.id.slice(-8).toUpperCase()}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.user.name} · {firstItem?.product.name ?? "—"}
                        </p>
                      </div>
                      <span className="font-bold text-brand-primary shrink-0">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick actions */}
            <div className="card p-6">
              <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-brand-primary" />
                Actions rapides
              </h2>
              <div className="space-y-1">
                {[
                  { href: "/dashboard/produits/nouveau", label: "Ajouter un produit", icon: "➕" },
                  { href: "/dashboard/produits", label: "Gérer mes produits", icon: "📦" },
                  { href: "/dashboard/commandes", label: "Gérer les commandes", icon: "🛒" },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-brand-primary transition-colors">
                        {action.label}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Low stock */}
            {lowStockProducts.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-brand-orange" />
                  Stock faible
                </h2>
                <div className="space-y-2">
                  {lowStockProducts.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-2">
                      <span className="text-sm text-gray-700 line-clamp-1 flex-1 mr-2">
                        {p.name}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        p.stock <= 3 ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {p.stock} restants
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
