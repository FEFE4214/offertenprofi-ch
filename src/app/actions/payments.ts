"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, craftsmanProfiles, leadUnlocks, creditPurchases } from "@/db/schema";
import { requireUser, getCurrentCraftsmanProfile } from "@/lib/session";
import { calculateLeadPrice, getCreditPackage } from "@/lib/leadPricing";
import { getLeadUnlock } from "@/lib/queries";
import { stripe, stripeEnabled, getBaseUrl } from "@/lib/stripe";
import { newId } from "@/lib/ids";

/**
 * Handwerker will die Kontaktdaten eines Auftrags sehen. Wenn Guthaben vorhanden ist, wird
 * direkt 1 Credit abgezogen. Sonst geht es (falls Stripe konfiguriert ist) zu einer
 * Stripe-Checkout-Seite für eine Einzelzahlung.
 */
export async function unlockJobContactAction(jobId: string): Promise<void> {
  const user = await requireUser("CRAFTSMAN");

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job) {
    throw new Error("Auftrag nicht gefunden.");
  }

  const alreadyUnlocked = await getLeadUnlock(jobId, user.id);
  if (alreadyUnlocked) {
    return;
  }

  const profile = await getCurrentCraftsmanProfile();
  if (!profile) {
    throw new Error("Profil nicht gefunden.");
  }

  const price = calculateLeadPrice(job);

  // 1. Guthaben vorhanden? Dann direkt damit bezahlen, kein Stripe nötig.
  if (profile.creditBalance >= 1) {
    await db
      .update(craftsmanProfiles)
      .set({ creditBalance: profile.creditBalance - 1 })
      .where(eq(craftsmanProfiles.id, profile.id));

    await db.insert(leadUnlocks).values({
      id: newId("unlock"),
      jobId,
      craftsmanId: user.id,
      priceChf: price,
      paymentMethod: "CREDIT",
      status: "PAID",
    });

    revalidatePath(`/dashboard/handwerker/auftrag/${jobId}`);
    return;
  }

  // 2. Kein Guthaben -> Einzelzahlung per Stripe (Karte, TWINT, Banküberweisung je nach
  //    Stripe-Dashboard-Konfiguration).
  if (!stripeEnabled || !stripe) {
    throw new Error(
      "Zahlungen sind aktuell noch nicht eingerichtet. Der Betreiber muss zuerst ein Stripe-Konto verbinden."
    );
  }

  const baseUrl = getBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "chf",
          unit_amount: Math.round(price * 100),
          product_data: {
            name: `Kontakt-Freischaltung: ${job.title}`,
            description: "Einmalige Freischaltung der Kontaktdaten für diesen Auftrag.",
          },
        },
        quantity: 1,
      },
    ],
    metadata: { type: "lead_unlock", jobId, craftsmanUserId: user.id },
    success_url: `${baseUrl}/dashboard/handwerker/auftrag/${jobId}?unlock_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/handwerker/auftrag/${jobId}`,
  });

  await db.insert(leadUnlocks).values({
    id: newId("unlock"),
    jobId,
    craftsmanId: user.id,
    priceChf: price,
    paymentMethod: "STRIPE",
    stripeSessionId: session.id,
    status: "PENDING",
  });

  redirect(session.url!);
}

/** Handwerker kauft ein Guthaben-Paket (mehrere Freischaltungen auf einmal, günstiger). */
export async function buyCreditsAction(packageId: string): Promise<void> {
  const user = await requireUser("CRAFTSMAN");

  const pkg = getCreditPackage(packageId);
  if (!pkg) {
    throw new Error("Unbekanntes Guthaben-Paket.");
  }

  if (!stripeEnabled || !stripe) {
    throw new Error(
      "Zahlungen sind aktuell noch nicht eingerichtet. Der Betreiber muss zuerst ein Stripe-Konto verbinden."
    );
  }

  const baseUrl = getBaseUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "chf",
          unit_amount: Math.round(pkg.amountChf * 100),
          product_data: {
            name: `Guthaben-Paket: ${pkg.label}`,
            description: `${pkg.credits} Kontakt-Freischaltungen für Offertenprofi.ch`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      type: "credit_purchase",
      craftsmanUserId: user.id,
      credits: String(pkg.credits),
      packageId: pkg.id,
    },
    success_url: `${baseUrl}/dashboard/handwerker/guthaben?purchase_session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/dashboard/handwerker/guthaben`,
  });

  await db.insert(creditPurchases).values({
    id: newId("cred"),
    craftsmanId: user.id,
    credits: pkg.credits,
    amountChf: pkg.amountChf,
    stripeSessionId: session.id,
    status: "PENDING",
  });

  redirect(session.url!);
}

/**
 * Sofort-Bestätigung nach der Rückkehr von Stripe (zusätzlich zum Webhook, der die
 * eigentliche Quelle der Wahrheit ist — das hier sorgt nur für sofortiges UI-Feedback,
 * falls der Webhook noch nicht angekommen ist).
 */
export async function confirmStripeSessionIfPaid(sessionId: string) {
  if (!stripe) return;

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.payment_status !== "paid") return;

  const type = session.metadata?.type;

  if (type === "lead_unlock") {
    const [existing] = await db
      .select()
      .from(leadUnlocks)
      .where(eq(leadUnlocks.stripeSessionId, sessionId));
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
      .where(eq(creditPurchases.stripeSessionId, sessionId));
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
