import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id]
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        producer: {
          select: {
            id: true,
            name: true,
            slug: true,
            location: true,
            avatar: true,
            rating: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({ ...product, badges: JSON.parse(product.badges) });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/products/[id] — update (owner vendor)
export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, price, originalPrice, stock, badges, isAvailable } = body;

    // Verify ownership
    const product = await prisma.product.findUnique({
      where: { id },
      include: { producer: { select: { userId: true } } },
    });
    if (!product || product.producer.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(originalPrice !== undefined && {
          originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(badges && { badges: JSON.stringify(badges) }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });

    return NextResponse.json({ ...updated, badges: JSON.parse(updated.badges) });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/products/[id]
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { producer: { select: { userId: true, id: true } } },
    });
    if (!product || product.producer.userId !== session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
    }

    await prisma.product.delete({ where: { id } });
    await prisma.producer.update({
      where: { id: product.producerId },
      data: { productCount: { decrement: 1 } },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
