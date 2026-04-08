import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { error: "Vous devez être connecté pour commander." },
      { status: 401 }
    );
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: "Stripe non configuré. Vérifiez les variables d'environnement." },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { items, deliveryAddress, deliveryType, shipping } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Panier vide." }, { status: 400 });
    }

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item: { name: string; image?: string; quantity: number; unitPrice: number }) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name,
            ...(item.image ? { images: [item.image] } : {}),
          },
          unit_amount: Math.round(item.unitPrice * 100),
        },
        quantity: item.quantity,
      })
    );

    // Add shipping as a line item if needed
    if (shipping && shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "eur",
          product_data: { name: "Frais de livraison" },
          unit_amount: Math.round(shipping * 100),
        },
        quantity: 1,
      });
    }

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      customer_email: session.user.email ?? undefined,
      metadata: {
        userId: session.user.id,
        deliveryAddress: deliveryAddress ?? "",
        deliveryType: deliveryType ?? "delivery",
        // Store items for order creation on success
        items: JSON.stringify(
          items.map((i: { productId: string; quantity: number; unitPrice: number }) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
          }))
        ),
      },
      locale: "fr",
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("[/api/checkout]", err);
    return NextResponse.json(
      { error: "Erreur lors de la création de la session Stripe." },
      { status: 500 }
    );
  }
}
