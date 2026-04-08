import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";

const footerLinks = {
  marketplace: {
    title: "Marketplace",
    links: [
      { label: "Catalogue", href: "/catalogue" },
      { label: "Producteurs", href: "/producteurs" },
      { label: "Carte interactive", href: "/carte" },
      { label: "Produits anti-gaspi", href: "/catalogue?badge=antigaspi" },
      { label: "Produits bio", href: "/catalogue?badge=bio" },
    ],
  },
  compte: {
    title: "Mon compte",
    links: [
      { label: "Connexion", href: "/connexion" },
      { label: "Inscription", href: "/inscription" },
      { label: "Mes commandes", href: "/commandes" },
      { label: "Espace vendeur", href: "/dashboard" },
    ],
  },
  info: {
    title: "Informations",
    links: [
      { label: "À propos", href: "/a-propos" },
      { label: "Contact", href: "/contact" },
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "CGV", href: "/cgv" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-main px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Green<span className="text-brand-light">Cart</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Projet universitaire connectant producteurs locaux et consommateurs de la
              Métropole Européenne de Lille.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={14} />
                <span>Métropole Européenne de Lille</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail size={14} />
                <span>contact@greencart.fr</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-brand-light transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Values bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { icon: "🌿", label: "100% local MEL" },
              { icon: "♻️", label: "Anti-gaspillage" },
              { icon: "🚜", label: "Producteurs vérifiés" },
              { icon: "🎓", label: "Projet universitaire" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-sm text-gray-400">
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>© {new Date().getFullYear()} GreenCart — Projet universitaire. Tous droits réservés.</p>
            <div className="flex items-center gap-4">
              <Link href="/mentions-legales" className="hover:text-gray-300 transition-colors">
                Mentions légales
              </Link>
              <Link href="/cgv" className="hover:text-gray-300 transition-colors">
                CGV
              </Link>
              <p>Fait avec 💚 pour la MEL</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
