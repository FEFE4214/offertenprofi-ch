import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leadUnlocks, creditPurchases, craftsmanProfiles } from "@/db/schema";
import { stripe } from "@/lib/stripe";

/**
 * Stripe ruft diesen Endpunkt bei Zahlungsereignissen auf (im Stripe-Dashboard unter
 * "Developers -> Webhooks" mit der URL https://<deine-domain>/api/stripe/webhook und dem
 * Event "checkout.session.completed" einzurichten). Das ist die verlässliche Quelle der
 * Wahrheit für abgeschlossene Zahlungen — unabhängig davon, ob der Nutzer nach der Zahlung
 * korrekt zurückgeleitet wurde.
 */
export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe ist nicht konfiguriert." }, { status: 503 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event;
  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Kein Webhook-Secret hinterlegt: Event ungeprüft parsen (nur für erste Tests OK,
      // für den Live-Betrieb sollte STRIPE_WEBHOOK_SECRET gesetzt sein).
      event = JSON.parse(body);
    }
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      id: string;
      payment_status: string;
      metadata?: Record<string, string>;
    };

    if (session.payment_status === "paid") {
      const type = session.metadata?.type;

      if (type === "lead_unlock") {
        const [existing] = await db
          .select()
          .from(leadUnlocks)
          .where(eq(leadUnlocks.stripeSessionId, session.id));
        if (existing && existing.status !== "PAID") {
          await db
            .update(leadUnlocks)
            .set({ status: "PAID" })
            .where(eq(leadUnlocks.id, existing.id));
        }
      }

      if (type === "credit_purchase") {
        const [existing] = await db
          .select()
          .from(creditPurchases)
          .where(eq(creditPurchases.stripeSessionId, session.id));
        if (existing && existing.status !== "PAID") {
          await db
            .update(creditPurchases)
            .set({ status: "PAID" })
            .where(eq(creditPurchases.id, existing.id));

          const [profile] = await db
            .select()
            .from(craftsmanProfiles)
            .where(eq(craftsmanProfiles.userId, existing.craftsmanId));
          if (profile) {
            await db
              .update(craftsmanProfiles)
              .set({ creditBalance: profile.creditBalance + existing.credits })
              .where(eq(craftsmanProfiles.id, profile.id));
          }
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
