"use client";

import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cartStore";
import type { Product } from "@/types";
import { CheckCircle, Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border border-brand-gray rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-4 py-3 hover:bg-gray-50 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-sm text-gray-400">/ {product.unit}</span>
      </div>

      <Button
        size="lg"
        variant={added ? "secondary" : "primary"}
        onClick={handleAdd}
        disabled={!product.isAvailable}
        className="w-full"
      >
        {added ? (
          <>
            <CheckCircle size={18} />
            Ajouté au panier !
          </>
        ) : (
          <>
            <ShoppingCart size={18} />
            Ajouter au panier
          </>
        )}
      </Button>
    </div>
  );
}
