import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/producers
export async function GET() {
  try {
    const producers = await prisma.producer.findMany({
      orderBy: { rating: "desc" },
    });

    const parsed = producers.map((p) => ({
      ...p,
      badges: JSON.parse(p.badges) as string[],
      certifications: JSON.parse(p.certifications) as string[],
    }));

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
