"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export type ProductFormData = {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image?: string;
  category: string;
  badges: string[];
  stock: string;
  unit: string;
  weight?: string;
};

export async function createProduct(data: ProductFormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    return { success: false, error: "Non autorisé" };
  }

  const producer = await prisma.producer.findUnique({
    where: { userId: session.user.id },
  });
  if (!producer) {
    return { success: false, error: "Profil producteur introuvable" };
  }

  const slug =
    data.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now();

  await prisma.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: parseFloat(data.price),
      originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      image: data.image ?? "",
      category: data.category,
      badges: JSON.stringify(data.badges),
      stock: parseInt(data.stock),
      unit: data.unit,
      weight: data.weight ?? null,
      producerId: producer.id,
    },
  });

  await prisma.producer.update({
    where: { id: producer.id },
    data: { productCount: { increment: 1 } },
  });

  revalidatePath("/dashboard/produits");
  revalidatePath("/catalogue");

  return { success: true };
}

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    return { success: false, error: "Non autorisé" };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { producer: { select: { userId: true } } },
  });
  if (!product || product.producer.userId !== session.user.id) {
    return { success: false, error: "Non autorisé" };
  }

  await prisma.product.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.price && { price: parseFloat(data.price) }),
      ...(data.originalPrice !== undefined && {
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
      }),
      ...(data.stock && { stock: parseInt(data.stock) }),
      ...(data.badges && { badges: JSON.stringify(data.badges) }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.category && { category: data.category }),
      ...(data.unit && { unit: data.unit }),
      ...(data.weight !== undefined && { weight: data.weight || null }),
    },
  });

  revalidatePath("/dashboard/produits");
  revalidatePath(`/produits/${product.slug}`);
  revalidatePath("/catalogue");

  return { success: true };
}

export async function toggleProductAvailability(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    return { success: false, error: "Non autorisé" };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { producer: { select: { userId: true } } },
  });
  if (!product || product.producer.userId !== session.user.id) {
    return { success: false, error: "Non autorisé" };
  }

  await prisma.product.update({
    where: { id },
    data: { isAvailable: !product.isAvailable },
  });

  revalidatePath("/dashboard/produits");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "vendor") {
    return { success: false, error: "Non autorisé" };
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { producer: { select: { userId: true, id: true } } },
  });
  if (!product || product.producer.userId !== session.user.id) {
    return { success: false, error: "Non autorisé" };
  }

  await prisma.product.delete({ where: { id } });
  await prisma.producer.update({
    where: { id: product.producerId },
    data: { productCount: { decrement: 1 } },
  });

  revalidatePath("/dashboard/produits");
  revalidatePath("/catalogue");

  return { success: true };
}
