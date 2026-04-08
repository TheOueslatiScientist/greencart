import { Button } from "@/components/ui/Button";
import { ArrowRight, Heart, Leaf, MapPin, Shield, Zap } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "GreenCart — projet universitaire pour connecter producteurs locaux et consommateurs de la Métropole Européenne de Lille.",
};

const values = [
  {
    icon: <Leaf size={28} className="text-brand-primary" />,
    title: "Circuits courts MEL",
    desc: "Tous nos producteurs sont issus de la Métropole Européenne de Lille. Les produits voyagent moins, vous profitez plus de la fraîcheur.",
  },
  {
    icon: <Zap size={28} className="text-brand-primary" />,
    title: "Contre le gaspillage",
    desc: "Nous valorisons activement les invendus et les calibres B. Chaque commande anti-gaspi évite une perte concrète.",
  },
  {
    icon: <Shield size={28} className="text-brand-primary" />,
    title: "Transparence totale",
    desc: "Vous savez exactement qui produit vos aliments, où, et comment. Aucun intermédiaire caché entre vous et le producteur.",
  },
  {
    icon: <Heart size={28} className="text-brand-primary" />,
    title: "Économie locale",
    desc: "La majorité de la valeur reste dans les mains des producteurs de la MEL. Votre achat soutient directement des familles locales.",
  },
];

const team = [
  { initial: "S", name: "Skander", color: "bg-brand-primary" },
  { initial: "S", name: "Salma", color: "bg-green-500" },
  { initial: "K", name: "Ketisa", color: "bg-teal-500" },
  { initial: "R", name: "Rodrigue", color: "bg-green-700" },
];

export default function AProposPage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="section gradient-green text-white">
        <div className="container-main text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
            <MapPin size={14} />
            Métropole Européenne de Lille
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-6">
            Notre histoire
          </h1>
          <p className="text-xl text-green-100 leading-relaxed">
            Un projet étudiant pour repenser l'accès aux produits locaux dans la MEL.
          </p>
        </div>
      </section>

      {/* ── Texte projet ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container-main max-w-3xl mx-auto">
          <div className="prose max-w-none text-gray-600 space-y-5 leading-relaxed text-lg">
            <p>
              <strong className="text-gray-900">GreenCart</strong> est un projet développé
              dans le cadre d'un cursus universitaire par{" "}
              <strong className="text-gray-900">Skander</strong>,{" "}
              <strong className="text-gray-900">Salma</strong>,{" "}
              <strong className="text-gray-900">Ketisa</strong> et{" "}
              <strong className="text-gray-900">Rodrigue</strong>.
            </p>
            <p>
              L'objectif est de repenser l'accès aux produits locaux en mettant en avant les
              producteurs de la{" "}
              <strong className="text-gray-900">
                Métropole Européenne de Lille (MEL)
              </strong>
              , à travers une plateforme digitale moderne et accessible.
            </p>
            <p>
              Ce projet s'inscrit dans une démarche pédagogique, explorant comment la
              technologie peut rapprocher producteurs et consommateurs tout en valorisant les
              circuits courts et une consommation plus responsable.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
            {[
              { value: "6", label: "Producteurs MEL" },
              { value: "20+", label: "Produits locaux" },
              { value: "5", label: "Villes couvertes" },
              { value: "100%", label: "Circuit court" },
            ].map((stat) => (
              <div key={stat.label} className="card p-5 text-center">
                <div className="font-display text-3xl font-bold text-brand-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valeurs ──────────────────────────────────────────────── */}
      <section className="section bg-brand-offwhite">
        <div className="container-main">
          <h2 className="section-title text-center mb-12">Nos valeurs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-4">
                  {v.icon}
                </div>
                <h3 className="font-display font-semibold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Équipe ───────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-main">
          <h2 className="section-title text-center mb-4">L'équipe</h2>
          <p className="section-subtitle text-center mx-auto mb-12">
            Quatre étudiants passionnés par la technologie et l'alimentation responsable.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div
                  className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center mx-auto mb-3 shadow-card`}
                >
                  <span className="font-display text-2xl font-bold text-white">
                    {member.initial}
                  </span>
                </div>
                <p className="font-semibold text-gray-900 text-lg">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Zone MEL ─────────────────────────────────────────────── */}
      <section className="section bg-green-50 border-t border-brand-gray">
        <div className="container-main text-center max-w-2xl mx-auto">
          <div className="text-4xl mb-4">🗺️</div>
          <h2 className="section-title mb-4">Fièrement local — MEL</h2>
          <p className="section-subtitle mb-6">
            Lille · Roubaix · Tourcoing · Villeneuve-d'Ascq · Marcq-en-Barœul · Lambersart
          </p>
          <Link href="/carte">
            <Button size="lg">
              Voir la carte des producteurs <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section bg-brand-offwhite border-t border-brand-gray">
        <div className="container-main text-center">
          <h2 className="section-title mb-4">Rejoignez le mouvement</h2>
          <p className="section-subtitle mx-auto mb-8">
            Que vous soyez consommateur ou producteur de la MEL, votre place est ici.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/catalogue">
              <Button size="lg">
                Explorer le catalogue <ArrowRight size={18} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="secondary">Nous contacter</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
