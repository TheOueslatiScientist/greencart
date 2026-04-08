"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Leaf, Lock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, totalPrice } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = totalPrice();
  const shipping = total >= 35 ? 0 : 4.9;

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const deliveryAddress = `${fd.get("address")}, ${fd.get("city")}`;
    const deliveryType = fd.get("deliveryType") as string;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            name: i.product.name,
            image: i.product.image,
            quantity: i.quantity,
            unitPrice: i.product.price,
          })),
          deliveryAddress,
          deliveryType,
          shipping: total >= 35 ? 0 : 4.9,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error ?? "Erreur lors de la création du paiement.");
        setLoading(false);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="section container-main text-center py-20">
        <p className="text-4xl mb-4">🛒</p>
        <p className="text-gray-500 mb-4">Votre panier est vide.</p>
        <a href="/catalogue">
          <Button>Explorer le catalogue</Button>
        </a>
      </div>
    );
  }

  return (
    <div className="section bg-brand-offwhite min-h-screen">
      <div className="container-main max-w-4xl">
        <h1 className="section-title mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* ── Form ───────────────────────────────────────────────── */}
          <form onSubmit={handleOrder} className="lg:col-span-3 space-y-6">
            {/* Coordonnées */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-gray-900">Coordonnées</h2>
              <div className="grid grid-cols-2 gap-4">
                <Input name="firstName" label="Prénom" placeholder="Marie" required />
                <Input name="lastName" label="Nom" placeholder="Dupont" required />
              </div>
              <Input
                name="email"
                label="Email"
                type="email"
                placeholder="vous@example.com"
                required
              />
              <Input
                name="phone"
                label="Téléphone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                required
              />
            </div>

            {/* Mode de retrait */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-gray-900">Mode de retrait</h2>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    value: "delivery",
                    label: "Livraison à domicile",
                    detail: `+${formatPrice(shipping)} (gratuit dès ${formatPrice(35)})`,
                  },
                  {
                    value: "pickup",
                    label: "Click & Collect chez le producteur",
                    detail: "Gratuit",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 p-3 border border-brand-gray rounded-xl cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value={opt.value}
                      defaultChecked={opt.value === "delivery"}
                      className="accent-brand-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 flex-1">
                      {opt.label}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        opt.value === "pickup" ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      {opt.detail}
                    </span>
                  </label>
                ))}
              </div>
              <Input
                name="address"
                label="Adresse de livraison"
                placeholder="12 rue de la Paix"
                required
              />
              <Input
                name="city"
                label="Ville"
                placeholder="59000 Lille"
                required
              />
            </div>

            {/* Paiement Stripe */}
            <div className="card p-6 space-y-4">
              <h2 className="font-display font-bold text-gray-900">Paiement sécurisé</h2>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-brand-gray">
                <div className="text-3xl leading-none mt-0.5">💳</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">Paiement via Stripe</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Visa, Mastercard, CB — vous serez redirigé vers une page sécurisée Stripe.
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {["visa", "mc", "cb"].map((b) => (
                      <div
                        key={b}
                        className="h-6 px-2 bg-white rounded border border-gray-200 flex items-center text-[10px] font-bold text-gray-400 uppercase"
                      >
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <Lock size={12} className="text-brand-primary shrink-0" />
                Vos données bancaires sont traitées directement par Stripe. GreenCart n'y a
                jamais accès.
              </p>
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-1.5">
                <Leaf size={12} className="shrink-0 mt-0.5" />
                <span>
                  <strong>Mode test :</strong> utilisez la carte <code className="font-mono">4242 4242 4242 4242</code>,
                  date future, CVC quelconque.
                </span>
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-brand-red">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? "Redirection vers Stripe…"
                : `Payer ${formatPrice(total + shipping)} avec Stripe →`}
            </Button>
          </form>

          {/* ── Récapitulatif ──────────────────────────────────────── */}
          <div className="lg:col-span-2">
            <div className="card p-5 sticky top-24">
              <h2 className="font-display font-bold text-gray-900 mb-4">Votre commande</h2>
              <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">× {quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-brand-gray pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500">
                  <span>Sous-total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Gratuite 🎉" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-brand-gray">
                  <span>Total</span>
                  <span className="text-brand-primary">{formatPrice(total + shipping)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
