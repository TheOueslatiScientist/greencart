"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { ArrowRight, Leaf, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PanierPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const total = totalPrice();
  const count = totalItems();
  const shipping = total >= 35 ? 0 : 4.9;

  if (count === 0) {
    return (
      <div className="section">
        <div className="container-main text-center py-20">
          <ShoppingCart size={64} className="mx-auto text-brand-gray mb-6" />
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Votre panier est vide</h1>
          <p className="text-gray-500 mb-8">
            Ajoutez des produits locaux depuis notre catalogue.
          </p>
          <Link href="/catalogue">
            <Button size="lg">
              Découvrir le catalogue
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-main">
        <h1 className="section-title mb-8">
          Mon panier <span className="text-brand-primary">({count})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="card p-5 flex gap-4">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    📍 {product.producerName} · {product.producerLocation}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatPrice(product.price)} / {product.unit}
                  </p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-brand-gray rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-gray-50 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-brand-primary">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-gray-400 hover:text-brand-red transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-bold text-lg text-gray-900 mb-5">Récapitulatif</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total ({count} articles)</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                    {shipping === 0 ? "Gratuite 🎉" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-400">
                    Livraison gratuite dès {formatPrice(35)} d'achat
                  </p>
                )}
                <div className="border-t border-brand-gray pt-3 flex justify-between font-bold text-gray-900 text-base">
                  <span>Total</span>
                  <span className="text-brand-primary">{formatPrice(total + shipping)}</span>
                </div>
              </div>

              <Link href="/checkout" className="block mt-6">
                <Button size="lg" className="w-full">
                  Passer la commande
                  <ArrowRight size={18} />
                </Button>
              </Link>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 justify-center">
                <Leaf size={12} className="text-brand-primary" />
                <span>Paiement sécurisé · Impact positif garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
