import { ProductCard } from "@/components/shared/ProductCard";
import { ProducerCard } from "@/components/shared/ProducerCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { products } from "@/lib/data/products";
import { producers } from "@/lib/data/producers";
import { ArrowRight, Leaf, ShieldCheck, Truck, Zap } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <Leaf className="text-brand-primary" size={24} />,
    title: "100% Local & Saisonnier",
    desc: "Tous nos producteurs sont sélectionnés en Île-de-France. Zéro intermédiaire, maximum de fraîcheur.",
  },
  {
    icon: <ShieldCheck className="text-brand-primary" size={24} />,
    title: "Producteurs vérifiés",
    desc: "Chaque producteur est audité et certifié. Vous connaissez l'origine exacte de vos aliments.",
  },
  {
    icon: <Zap className="text-brand-primary" size={24} />,
    title: "Anti-gaspillage actif",
    desc: "Valorisation des invendus à prix réduit. Agissez concrètement contre le gaspillage alimentaire.",
  },
  {
    icon: <Truck className="text-brand-primary" size={24} />,
    title: "Livraison & Click & Collect",
    desc: "Récupérez vos commandes directement chez le producteur ou recevez-les chez vous.",
  },
];

const stats = [
  { value: "120+", label: "Producteurs partenaires" },
  { value: "2 400+", label: "Produits disponibles" },
  { value: "18 000", label: "Consommateurs actifs" },
  { value: "8,3 t", label: "Gaspillage évité / mois" },
];

export default function HomePage() {
  const featuredProducts = products.slice(0, 8);
  const featuredProducers = producers.slice(0, 3);
  const antigaspiProducts = products.filter((p) => p.badges.includes("antigaspi")).slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* ─────────── HERO ─────────── */}
      <section className="relative bg-gradient-to-br from-green-900 via-brand-primary to-green-700 text-white overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-white/5 rounded-full" />
        </div>

        <div className="container-main px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
              <span>🌱</span>
              <span>La marketplace écoresponsable #1 en Île-de-France</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Mangez local,{" "}
              <span className="text-brand-light">vivez mieux</span>
            </h1>

            <p className="text-lg sm:text-xl text-green-100 leading-relaxed mb-8 max-w-xl">
              Commandez directement auprès de producteurs locaux vérifiés. Produits frais, circuits
              courts, anti-gaspillage — une expérience d'achat responsable et moderne.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalogue">
                <Button size="lg" variant="orange" className="w-full sm:w-auto shadow-float">
                  Explorer le catalogue
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Link href="/producteurs">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Découvrir les producteurs
                </Button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-3">
              {["🌿 Bio certifié", "📍 Km 0", "♻️ Anti-gaspi", "✅ Paiement sécurisé"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-sm text-green-100 bg-white/10 px-3 py-1 rounded-full border border-white/15"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── STATS ─────────── */}
      <section className="bg-brand-primary text-white">
        <div className="container-main px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-3xl font-bold text-brand-light">{stat.value}</div>
                <div className="text-sm text-green-100 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── FEATURES ─────────── */}
      <section className="section bg-brand-offwhite">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="section-title">Pourquoi choisir GreenCart ?</h2>
            <p className="section-subtitle mx-auto">
              Une plateforme pensée pour faciliter la consommation responsable sans compromis
              sur la qualité et l'expérience.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 text-center group hover:shadow-card transition-all duration-300">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── PRODUCTS ─────────── */}
      <section className="section">
        <div className="container-main">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Produits du moment</h2>
              <p className="section-subtitle">Sélectionnés par nos producteurs partenaires</p>
            </div>
            <Link href="/catalogue">
              <Button variant="secondary" size="sm">
                Voir tout
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── ANTI-GASPI BANNER ─────────── */}
      <section className="section bg-amber-50 border-y border-amber-100">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <Badge type="antigaspi" className="mb-4 text-sm px-4 py-1.5" />
              <h2 className="section-title">Anti-gaspillage : agissez maintenant</h2>
              <p className="section-subtitle mt-3">
                Des invendus de qualité à prix réduit. Chaque commande évite du gaspillage
                alimentaire et soutient directement nos producteurs.
              </p>
              <Link href="/catalogue?badge=antigaspi" className="mt-6 inline-flex">
                <Button size="lg" variant="orange">
                  Voir les offres anti-gaspi
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4 w-full">
              {antigaspiProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── PRODUCERS ─────────── */}
      <section className="section bg-brand-offwhite">
        <div className="container-main">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-title">Nos producteurs</h2>
              <p className="section-subtitle">Rencontrez ceux qui cultivent pour vous</p>
            </div>
            <Link href="/producteurs">
              <Button variant="secondary" size="sm">
                Voir tous
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducers.map((producer) => (
              <ProducerCard key={producer.id} producer={producer} />
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── CTA vendeur ─────────── */}
      <section className="section gradient-green text-white">
        <div className="container-main text-center max-w-2xl mx-auto">
          <span className="text-4xl mb-4 block">🚜</span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Vous êtes producteur ou commerçant local ?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Rejoignez GreenCart et touchez des milliers de consommateurs locaux engagés.
            Espace vendeur intuitif, zéro commission les 3 premiers mois.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inscription?role=vendeur">
              <Button size="lg" variant="orange" className="w-full sm:w-auto shadow-float">
                Devenir partenaire
                <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/a-propos">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20 border font-semibold rounded-xl px-8 py-4"
              >
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
