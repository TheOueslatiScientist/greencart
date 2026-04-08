"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { cn } from "@/lib/utils";
import { Leaf, LogOut, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/producteurs", label: "Producteurs" },
  { href: "/carte", label: "Carte 🗺️" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

// ── Composant isolé pour le badge panier ─────────────────────────────────────
// Rendu uniquement côté client après hydration pour éviter le mismatch SSR
function CartBadge() {
  const totalItems = useCartStore((s) => s.totalItems());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 min-w-[18px] min-h-[18px] bg-brand-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 pointer-events-none">
      {totalItems > 99 ? "99+" : totalItems}
    </span>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const isVendor = session?.user?.role === "vendor";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-brand-gray"
            : "bg-white/90 backdrop-blur-sm"
        )}
      >
        <div className="container-main flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center group-hover:bg-green-700 transition-colors">
              <Leaf size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gray-900">
              Green<span className="text-brand-primary">Cart</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href || pathname.startsWith(link.href + "/")
                    ? "bg-green-50 text-brand-primary"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link href="/catalogue">
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Search size={18} />
              </Button>
            </Link>

            {/* Cart — badge isolé pour éviter l'hydration mismatch */}
            <Link href="/panier" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart size={18} />
                <CartBadge />
              </Button>
            </Link>

            {/* User menu (desktop) */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-xl bg-gray-100 animate-pulse" />
            ) : session ? (
              <div className="hidden sm:block relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {session.user.avatar ? (
                    <img
                      src={session.user.avatar}
                      alt={session.user.name ?? ""}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {session.user.name?.split(" ")[0]}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-float border border-brand-gray py-2 z-50 animate-fade-up">
                    <div className="px-4 py-2 border-b border-brand-gray mb-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    {isVendor && (
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        🚜 Tableau de bord
                      </Link>
                    )}
                    <Link
                      href="/compte"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User size={15} /> Mon compte
                    </Link>
                    <Link
                      href="/commandes"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      📦 Mes commandes
                    </Link>
                    <div className="border-t border-brand-gray mt-1 pt-1">
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-brand-red hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut size={15} /> Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/connexion">
                  <Button variant="ghost" size="sm">Connexion</Button>
                </Link>
                <Link href="/inscription">
                  <Button variant="primary" size="sm">S'inscrire</Button>
                </Link>
              </div>
            )}

            {/* Mobile burger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="absolute top-16 left-0 right-0 bg-white border-b border-brand-gray shadow-float px-4 py-4 flex flex-col gap-1 animate-fade-up">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-green-50 text-brand-primary"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-brand-gray mt-2 pt-2 flex flex-col gap-2">
              {session ? (
                <>
                  {isVendor && (
                    <Link href="/dashboard">
                      <Button variant="outline" size="md" className="w-full justify-start">
                        🚜 Tableau de bord
                      </Button>
                    </Link>
                  )}
                  <Link href="/compte">
                    <Button variant="outline" size="md" className="w-full justify-start">
                      <User size={15} /> Mon compte
                    </Button>
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="btn-ghost w-full text-brand-red"
                  >
                    <LogOut size={15} /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link href="/connexion">
                    <Button variant="outline" size="md" className="w-full">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/inscription">
                    <Button variant="primary" size="md" className="w-full">
                      S'inscrire
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
