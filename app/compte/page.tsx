import { Button } from "@/components/ui/Button";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { LogOut, Package, Settings, User } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignOutButton } from "./SignOutButton";

export default async function ComptePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/connexion?callbackUrl=/compte");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, avatar: true, role: true, createdAt: true },
  });

  if (!user) redirect("/connexion");

  const orderCount = await prisma.order.count({ where: { userId: user.id } });

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main max-w-2xl">
        <h1 className="section-title mb-8">Mon compte</h1>

        {/* Profile card */}
        <div className="card p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-gray-400" />
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-display text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <p className="text-xs text-gray-400 mt-1">
              Membre depuis {formatDate(user.createdAt)}
            </p>
            <p className="text-xs mt-1">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                user.role === "vendor"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {user.role === "vendor" ? "🚜 Producteur" : "🛒 Consommateur"}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Settings size={14} />
              Modifier
            </Button>
            <SignOutButton />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { value: orderCount, label: "Commandes" },
            { value: "0", label: "Avis laissés" },
            { value: "0", label: "Producteurs favoris" },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 text-center">
              <div className="font-display text-2xl font-bold text-brand-primary">{stat.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="card divide-y divide-brand-gray">
          {[
            { href: "/commandes", icon: <Package size={18} />, label: "Mes commandes", desc: `${orderCount} commandes` },
            ...(user.role === "vendor"
              ? [{ href: "/dashboard", icon: "🚜", label: "Espace vendeur", desc: "Gérer mes produits et commandes" }]
              : []),
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-brand-primary shrink-0">
                {typeof item.icon === "string" ? (
                  <span className="text-lg">{item.icon}</span>
                ) : (
                  item.icon
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 group-hover:text-brand-primary transition-colors">
                  {item.label}
                </p>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
              <span className="text-gray-300 group-hover:text-brand-primary transition-colors">→</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
