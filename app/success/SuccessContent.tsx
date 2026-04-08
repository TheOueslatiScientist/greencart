"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { CheckCircle, Leaf, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Status = "loading" | "success" | "error";

export function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCartStore((s) => s.clearCart);

  const [status, setStatus] = useState<Status>("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setErrorMsg("Session de paiement introuvable.");
      setStatus("error");
      return;
    }

    // Idempotency guard: if already processed, don't call API again
    const stored = localStorage.getItem(`gc_order_${sessionId}`);
    if (stored) {
      setOrderId(stored);
      clearCart();
      setStatus("success");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setErrorMsg(data.error ?? "Erreur lors de la vérification du paiement.");
          setStatus("error");
          return;
        }

        // Persist so refreshing the page doesn't duplicate orders
        localStorage.setItem(`gc_order_${sessionId}`, data.orderId);
        setOrderId(data.orderId);
        clearCart();
        setStatus("success");
      } catch {
        setErrorMsg("Erreur réseau. Votre paiement a peut-être abouti — vérifiez vos commandes.");
        setStatus("error");
      }
    };

    verify();
  }, [sessionId, clearCart]);

  /* ── Loading ─────────────────────────────────────────────────────────── */
  if (status === "loading") {
    return (
      <div className="section min-h-screen bg-brand-offwhite flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-5" />
          <p className="font-semibold text-gray-700">Confirmation en cours…</p>
          <p className="text-sm text-gray-400 mt-1">Merci de patienter quelques secondes.</p>
        </div>
      </div>
    );
  }

  /* ── Error ───────────────────────────────────────────────────────────── */
  if (status === "error") {
    return (
      <div className="section min-h-screen bg-brand-offwhite flex items-center justify-center">
        <div className="container-main max-w-md text-center">
          <XCircle size={64} className="text-brand-red mx-auto mb-6" />
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-3">
            Une erreur est survenue
          </h1>
          <p className="text-gray-500 mb-6">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/commandes">
              <Button variant="outline" size="md">Voir mes commandes</Button>
            </Link>
            <Link href="/catalogue">
              <Button size="md">Retour au catalogue</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Success ─────────────────────────────────────────────────────────── */
  return (
    <div className="section min-h-screen bg-brand-offwhite flex items-center justify-center">
      <div className="container-main max-w-lg text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle size={52} className="text-brand-primary" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center animate-bounce">
            <Leaf size={14} className="text-white" />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Commande confirmée !
        </h1>

        <p className="text-gray-500 mb-3">
          Votre paiement a été accepté avec succès.
        </p>

        {orderId && (
          <div className="inline-flex items-center gap-2 bg-white border border-brand-gray px-4 py-2 rounded-xl mb-4 shadow-soft">
            <span className="text-xs text-gray-400">N° de commande</span>
            <span className="font-mono text-sm font-bold text-gray-900">
              #{orderId.slice(-8).toUpperCase()}
            </span>
          </div>
        )}

        <p className="text-sm text-green-600 font-medium mb-8 flex items-center justify-center gap-2">
          <Leaf size={14} />
          Merci de soutenir les producteurs locaux de la MEL !
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/commandes">
            <Button size="lg">Suivre ma commande</Button>
          </Link>
          <Link href="/catalogue">
            <Button size="lg" variant="secondary">Continuer mes achats</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
