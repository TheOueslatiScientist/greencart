import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// GET /api/products — list all (with optional filters)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const badge = searchParams.get("badge");
    const producerId = searchParams.get("producerId");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") ?? "100");

    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        ...(category && { category }),
        ...(producerId && { producerId }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }),
        ...(badge && { badges: { contains: badge } }),
      },
      include: {
        producer: {
          select: { id: true, name: true, slug: true, location: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    // Parse badges JSON for each product
    const parsed = products.map((p) => ({
      ...p,
      badges: JSON.parse(p.badges) as string[],
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/products — create (vendor only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "vendor") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const producer = await prisma.producer.findUnique({
      where: { userId: session.user.id },
    });
    if (!producer) {
      return NextResponse.json({ error: "Producteur introuvable" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, price, originalPrice, image, category, badges, stock, unit, weight } = body;

    if (!name || !price || !category) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        image: image ?? "",
        category,
        badges: JSON.stringify(badges ?? []),
        stock: parseInt(stock ?? 0),
        unit: unit ?? "pièce",
        weight: weight ?? null,
        producerId: producer.id,
      },
    });

    // Update producer product count
    await prisma.producer.update({
      where: { id: producer.id },
      data: { productCount: { increment: 1 } },
    });

    return NextResponse.json({ ...product, badges: JSON.parse(product.badges) }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
