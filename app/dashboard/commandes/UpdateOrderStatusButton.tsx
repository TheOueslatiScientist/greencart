"use client";

import { updateOrderStatus } from "@/lib/actions/orders";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdateOrderStatusButton({
  orderId,
  nextStatus,
  nextLabel,
}: {
  orderId: string;
  nextStatus: string;
  nextLabel: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    await updateOrderStatus(orderId, nextStatus);
    router.refresh();
    setLoading(false);
  };

  return (
    <Button size="sm" variant="secondary" onClick={handleUpdate} disabled={loading}>
      {loading ? "…" : `→ ${nextLabel}`}
    </Button>
  );
}
