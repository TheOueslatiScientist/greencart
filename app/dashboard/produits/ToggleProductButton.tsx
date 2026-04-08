"use client";

import { toggleProductAvailability } from "@/lib/actions/products";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ToggleProductButton({
  productId,
  isAvailable,
}: {
  productId: string;
  isAvailable: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await toggleProductAvailability(productId);
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-brand-orange disabled:opacity-50"
      title={isAvailable ? "Désactiver" : "Activer"}
    >
      {isAvailable ? <ToggleRight size={15} className="text-brand-primary" /> : <ToggleLeft size={15} />}
    </button>
  );
}
