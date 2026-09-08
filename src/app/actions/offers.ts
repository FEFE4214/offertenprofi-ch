"use server";

import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { jobs, offers } from "@/db/schema";
import { submitOfferSchema } from "@/lib/validators";
import { requireUser } from "@/lib/session";
import { newId } from "@/lib/ids";
import type { ActionState } from "@/app/actions/auth";

export async function submitOfferAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser("CRAFTSMAN");

  const raw = Object.fromEntries(formData);
  const parsed = submitOfferSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [job] = await db.select().from(jobs).where(eq(jobs.id, data.jobId));
  if (!job) {
    return { error: "Auftrag nicht gefunden." };
  }
  if (job.status !== "OPEN") {
    return { error: "Für diesen Auftrag können keine Angebote mehr abgegeben werden." };
  }

  const [existingOffer] = await db
    .select()
    .from(offers)
    .where(and(eq(offers.jobId, data.jobId), eq(offers.craftsmanId, user.id)));
  if (existingOffer) {
    return { error: "Du hast für diesen Auftrag bereits ein Angebot abgegeben." };
  }

  await db.insert(offers).values({
    id: newId("off"),
    jobId: data.jobId,
    craftsmanId: user.id,
    price: data.price,
    message: data.message,
    estimatedDuration: data.estimatedDuration || null,
    status: "PENDING",
  });

  revalidatePath(`/dashboard/handwerker`);
  revalidatePath(`/dashboard/kunde/auftrag/${data.jobId}`);
  return { error: undefined };
}

export async function acceptOfferAction(offerId: string) {
  const user = await requireUser("CUSTOMER");

  const [offer] = await db.select().from(offers).where(eq(offers.id, offerId));
  if (!offer) throw new Error("Angebot nicht gefunden.");

  const [job] = await db.select().from(jobs).where(eq(jobs.id, offer.jobId));
  if (!job || job.customerId !== user.id) {
    throw new Error("Auftrag nicht gefunden.");
  }
  if (job.status !== "OPEN") {
    throw new Error("Dieser Auftrag wurde bereits vergeben.");
  }

  await db.update(offers).set({ status: "ACCEPTED" }).where(eq(offers.id, offerId));
  await db
    .update(offers)
    .set({ status: "REJECTED" })
    .where(and(eq(offers.jobId, job.id), eq(offers.status, "PENDING")));
  await db
    .update(jobs)
    .set({ status: "IN_PROGRESS", acceptedOfferId: offerId })
    .where(eq(jobs.id, job.id));

  revalidatePath(`/dashboard/kunde/auftrag/${job.id}`);
  revalidatePath("/dashboard/kunde");
  revalidatePath("/dashboard/handwerker");
}

export async function withdrawOfferAction(offerId: string) {
  const user = await requireUser("CRAFTSMAN");
  const [offer] = await db.select().from(offers).where(eq(offers.id, offerId));
  if (!offer || offer.craftsmanId !== user.id) {
    throw new Error("Angebot nicht gefunden.");
  }
  if (offer.status !== "PENDING") {
    throw new Error("Nur ausstehende Angebote können zurückgezogen werden.");
  }
  await db.update(offers).set({ status: "WITHDRAWN" }).where(eq(offers.id, offerId));
  revalidatePath("/dashboard/handwerker/angebote");
  revalidatePath(`/dashboard/kunde/auftrag/${offer.jobId}`);
}
