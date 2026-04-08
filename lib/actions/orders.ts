"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export type CartItemInput = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export async function createOrder(data: {
  items: CartItemInput[];
  deliveryAddress?: string;
  deliveryType?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { success: false, error: "Vous devez être connecté pour commander." };
  }

  if (!data.items || data.items.length === 0) {
    return { success: false, error: "Votre panier est vide." };
  }

  // Verify each product stock
  for (const item of data.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
    });
    if (!product) {
      return { success: false, error: `Produit introuvable (${item.productId})` };
    }
    if (!product.isAvailable) {
      return { success: false, error: `${product.name} n'est plus disponible.` };
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Stock insuffisant pour ${product.name} (dispo: ${product.stock})`,
      };
    }
  }

  const total = data.items.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId: session.user.id,
        total,
        deliveryAddress: data.deliveryAddress ?? null,
        deliveryType: data.deliveryType ?? "delivery",
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          })),
        },
      },
    });

    for (const item of data.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return newOrder;
  });

  revalidatePath("/commandes");
  revalidatePath("/catalogue");

  return { success: true, orderId: order.id };
}

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    return { success: false, error: "Non autorisé" };
  }

  const validStatuses = ["confirmed", "preparing", "ready", "delivered", "cancelled"];
  if (!validStatuses.includes(status)) {
    return { success: false, error: "Statut invalide" };
  }

  await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  revalidatePath("/dashboard/commandes");

  return { success: true };
}
