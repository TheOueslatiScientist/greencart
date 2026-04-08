import { Button } from "@/components/ui/Button";
import { XCircle } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Paiement annulé",
  description: "Votre paiement a été annulé. Votre panier est conservé.",
};

export default function CancelPage() {
  return (
    <div className="section min-h-screen bg-brand-offwhite flex items-center justify-center">
      <div className="container-main max-w-md text-center">
        {/* Icon */}
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle size={52} className="text-red-400" />
        </div>

        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          Paiement annulé
        </h1>

        <p className="text-gray-500 mb-2">
          Vous avez annulé le paiement. Ne vous inquiétez pas — votre panier est conservé.
        </p>

        <p className="text-sm text-gray-400 mb-8">
          Vous pouvez reprendre votre commande à tout moment.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/panier">
            <Button size="lg">Retour au panier</Button>
          </Link>
          <Link href="/catalogue">
            <Button size="lg" variant="secondary">Continuer les achats</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
