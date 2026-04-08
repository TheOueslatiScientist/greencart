import { Suspense } from "react";
import type { Metadata } from "next";
import { SuccessContent } from "./SuccessContent";

export const metadata: Metadata = {
  title: "Commande confirmée",
  description: "Votre paiement a été accepté, merci pour votre commande GreenCart.",
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="section min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Vérification du paiement…</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
