"use client";

import { deleteProduct } from "@/lib/actions/products";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${productName}" ? Cette action est irréversible.`)) return;
    setLoading(true);
    await deleteProduct(productId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-brand-red disabled:opacity-50"
      title="Supprimer"
    >
      <Trash2 size={15} />
    </button>
  );
}
