import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site GreenCart — projet universitaire.",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-display text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-brand-gray">
        {title}
      </h2>
      <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function MentionsLegalesPage() {
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
          <h1 className="section-title">Mentions légales</h1>
          <p className="text-gray-500 mt-2">Dernière mise à jour : avril 2026</p>

          {/* Bandeau projet universitaire */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 text-sm text-amber-800">
            <strong>⚠️ Important —</strong> Ce site est un projet réalisé dans un cadre
            pédagogique et <strong>ne constitue pas une plateforme commerciale réelle</strong>.
            Les transactions effectuées sont simulées ou réalisées à des fins de démonstration
            uniquement.
          </div>
        </div>

        <div className="card p-8">
          <Section title="1. Identification du site">
            <p><strong>Nom du site :</strong> GreenCart</p>
            <p>
              <strong>Nature :</strong> Projet universitaire — plateforme de démonstration à
              vocation pédagogique.
            </p>
            <p>
              <strong>URL :</strong>{" "}
              <a href="https://greencart.vercel.app" className="text-brand-primary hover:underline">
                greencart.vercel.app
              </a>
            </p>
          </Section>

          <Section title="2. Responsables du projet">
            <p>
              Ce projet a été développé dans le cadre d'un cursus universitaire par :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Skander</li>
              <li>Salma</li>
              <li>Ketisa</li>
              <li>Rodrigue</li>
            </ul>
          </Section>

          <Section title="3. Contact">
            <p>
              Pour toute question relative à ce projet, vous pouvez nous contacter via le
              formulaire de contact du site ou à l'adresse suivante :
            </p>
            <p className="mt-2">
              <strong>Email :</strong>{" "}
              <a
                href="mailto:contact@greencart.fr"
                className="text-brand-primary hover:underline"
              >
                contact@greencart.fr
              </a>
            </p>
          </Section>

          <Section title="4. Hébergement">
            <p>
              <strong>Hébergeur :</strong> Vercel Inc.
            </p>
            <p>340 Pine Street, Suite 701, San Francisco, CA 94104 — États-Unis</p>
            <p>
              <a
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline"
              >
                vercel.com
              </a>
            </p>
          </Section>

          <Section title="5. Propriété intellectuelle">
            <p>
              L'ensemble du contenu présent sur le site GreenCart (textes, images, logos,
              architecture) est protégé par le droit de la propriété intellectuelle. Toute
              reproduction, même partielle, est interdite sans autorisation préalable des auteurs.
            </p>
            <p>
              Les images utilisées proviennent de la plateforme{" "}
              <a
                href="https://unsplash.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary hover:underline"
              >
                Unsplash
              </a>{" "}
              (licence libre d'utilisation).
            </p>
          </Section>

          <Section title="6. Données personnelles">
            <p>
              Les données collectées lors de l'inscription (nom, email) sont utilisées
              uniquement dans le cadre de ce projet pédagogique et ne sont pas transmises à
              des tiers.
            </p>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de
              suppression de vos données. Pour exercer ces droits, contactez-nous à l'adresse
              indiquée ci-dessus.
            </p>
          </Section>

          <Section title="7. Cookies">
            <p>
              Ce site utilise des cookies de session nécessaires au fonctionnement de
              l'authentification (NextAuth). Aucun cookie publicitaire ou de traçage n'est
              utilisé.
            </p>
          </Section>

          <Section title="8. Limitation de responsabilité">
            <p>
              GreenCart est un projet universitaire à but exclusivement pédagogique. Les
              informations présentes sur ce site (producteurs, produits, prix) sont fictives
              ou à titre illustratif uniquement. L'équipe ne saurait être tenue responsable
              de toute utilisation qui en serait faite en dehors du cadre prévu.
            </p>
          </Section>
        </div>

        <div className="mt-8 text-center">
          <Link href="/cgv" className="text-sm text-brand-primary hover:underline mr-6">
            Voir les CGV →
          </Link>
          <Link href="/contact" className="text-sm text-brand-primary hover:underline">
            Nous contacter →
          </Link>
        </div>
      </div>
    </div>
  );
}
