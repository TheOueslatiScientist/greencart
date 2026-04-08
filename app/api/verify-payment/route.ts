import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe non configuré." }, { status: 500 });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID manquant." }, { status: 400 });
    }

    // Verify with Stripe
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Paiement non confirmé par Stripe." },
        { status: 400 }
      );
    }

    // Idempotency: check if order already exists for this Stripe session
    const existing = await prisma.order.findUnique({
      where: { stripeSessionId: sessionId },
    });
    if (existing) {
      return NextResponse.json({ success: true, orderId: existing.id });
    }

    // Parse metadata
    const meta = stripeSession.metadata ?? {};
    const items: { productId: string; quantity: number; unitPrice: number }[] = JSON.parse(
      meta.items ?? "[]"
    );

    if (items.length === 0) {
      return NextResponse.json({ error: "Données de commande introuvables." }, { status: 400 });
    }

    const total = (stripeSession.amount_total ?? 0) / 100;

    // Create order + decrement stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Verify stock before creating
      for (const item of items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Produit introuvable: ${item.productId}`);
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour ${product.name}`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          userId: session.user.id,
          status: "confirmed",
          total,
          deliveryAddress: meta.deliveryAddress ?? null,
          deliveryType: meta.deliveryType ?? "delivery",
          stripeSessionId: sessionId,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          },
        },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err) {
    console.error("[/api/verify-payment]", err);
    const message = err instanceof Error ? err.message : "Erreur serveur.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
