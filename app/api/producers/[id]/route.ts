import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

// GET /api/producers/[id] — fetch by id OR slug
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const producer = await prisma.producer.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        products: {
          where: { isAvailable: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!producer) {
      return NextResponse.json({ error: "Producteur introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      ...producer,
      badges: JSON.parse(producer.badges) as string[],
      certifications: JSON.parse(producer.certifications) as string[],
      products: producer.products.map((p) => ({
        ...p,
        badges: JSON.parse(p.badges) as string[],
      })),
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
