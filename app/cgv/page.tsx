import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "CGV du site GreenCart — projet universitaire.",
};

function Section({ num, title, children }: { num: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-brand-gray">
        Article {num} — {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-3">{children}</div>
    </div>
  );
}

export default function CGVPage() {
  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-brand-primary hover:underline mb-4 inline-block"
          >
            ← Retour à l'accueil
          </Link>
          <h1 className="section-title">Conditions Générales de Vente</h1>
          <p className="text-gray-500 mt-2">Dernière mise à jour : avril 2026</p>

          {/* Bandeau projet universitaire */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
            <strong>⚠️ Mention importante —</strong> GreenCart étant un projet universitaire,
            les transactions effectuées sur ce site sont{" "}
            <strong>simulées ou réalisées à des fins de démonstration uniquement</strong>.
            Elles ne constituent pas des engagements commerciaux réels.
          </div>
        </div>

        <div className="card p-8">
          <Section num="1" title="Objet">
            <p>
              Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation du
              site <strong>GreenCart</strong>, plateforme de démonstration développée dans le
              cadre d'un projet universitaire par Skander, Salma, Ketisa et Rodrigue.
            </p>
            <p>
              GreenCart simule une marketplace mettant en relation des consommateurs et des
              producteurs locaux de la Métropole Européenne de Lille (MEL). L'objectif est
              pédagogique : démontrer les fonctionnalités d'une plateforme e-commerce moderne.
            </p>
          </Section>

          <Section num="2" title="Accès au site">
            <p>
              L'accès au site GreenCart est gratuit. Certaines fonctionnalités (commande,
              espace vendeur) nécessitent la création d'un compte utilisateur.
            </p>
            <p>
              L'utilisateur s'engage à fournir des informations exactes lors de son inscription
              et à ne pas utiliser le site à des fins illicites ou contraires aux présentes CGV.
            </p>
          </Section>

          <Section num="3" title="Produits et producteurs">
            <p>
              Les produits présentés sur GreenCart sont des données de démonstration associées
              à des producteurs fictifs ou inspirés de la réalité de la MEL. Toute ressemblance
              avec des producteurs réels est purement illustrative.
            </p>
            <p>
              Les prix affichés sont indicatifs et ne reflètent pas des transactions
              commerciales réelles.
            </p>
          </Section>

          <Section num="4" title="Commandes">
            <p>
              Le processus de commande sur GreenCart est entièrement simulé dans un cadre
              pédagogique :
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>L'ajout au panier ne génère aucune réservation réelle.</li>
              <li>La validation d'une commande est une simulation de flux e-commerce.</li>
              <li>Aucun produit physique ne sera expédié.</li>
              <li>Les stocks affichés sont des données de démonstration.</li>
            </ul>
          </Section>

          <Section num="5" title="Paiement via Stripe">
            <p>
              Le paiement en ligne est intégré via <strong>Stripe</strong> en mode test
              (sandbox). Cela signifie :
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                Aucun débit réel n'est effectué sur votre carte bancaire lors des tests.
              </li>
              <li>
                La carte de test Stripe à utiliser est : <code className="font-mono bg-gray-100 px-1 rounded">4242 4242 4242 4242</code>,
                date future, CVC quelconque.
              </li>
              <li>
                En cas d'activation en production, les règles de sécurité Stripe s'appliquent
                intégralement.
              </li>
            </ul>
            <p>
              Les données bancaires saisies sur Stripe sont traitées exclusivement par Stripe
              et ne sont jamais accessibles à l'équipe GreenCart.
            </p>
          </Section>

          <Section num="6" title="Livraison">
            <p>
              Les options de livraison présentées (livraison à domicile, Click & Collect)
              sont des fonctionnalités de démonstration. Aucune livraison physique n'est
              organisée dans le cadre de ce projet.
            </p>
          </Section>

          <Section num="7" title="Droit de rétractation">
            <p>
              Dans le cadre d'un projet pédagogique, aucun droit de rétractation légal ne
              s'applique, aucune transaction commerciale réelle n'étant réalisée.
            </p>
            <p>
              En cas de mise en production réelle, le délai légal de rétractation de 14 jours
              prévu par le Code de la consommation s'appliquerait.
            </p>
          </Section>

          <Section num="8" title="Responsabilité limitée">
            <p>
              L'équipe GreenCart ne saurait être tenue responsable de tout dommage direct ou
              indirect résultant de l'utilisation du site, notamment en cas d'interruption de
              service, d'erreur dans les données affichées ou de problème technique.
            </p>
            <p>
              Les informations présentes (producteurs, produits, coordonnées GPS) sont
              fictives ou illustratives. Elles ne constituent pas des engagements contractuels.
            </p>
          </Section>

          <Section num="9" title="Propriété intellectuelle">
            <p>
              L'ensemble du code source, du design et du contenu de GreenCart est la
              propriété de l'équipe du projet. Toute reproduction ou utilisation commerciale
              est soumise à autorisation préalable.
            </p>
          </Section>

          <Section num="10" title="Droit applicable">
            <p>
              Les présentes CGV sont soumises au droit français. Tout litige relatif à leur
              interprétation ou à leur exécution relève de la compétence exclusive des
              tribunaux français.
            </p>
          </Section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/mentions-legales" className="text-sm text-brand-primary hover:underline mr-6">
            Voir les mentions légales →
          </Link>
          <Link href="/contact" className="text-sm text-brand-primary hover:underline">
            Nous contacter →
          </Link>
        </div>
      </div>
    </div>
  );
}
