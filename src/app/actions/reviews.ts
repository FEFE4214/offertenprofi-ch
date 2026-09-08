"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, offers, reviews } from "@/db/schema";
import { reviewSchema } from "@/lib/validators";
import { requireUser } from "@/lib/session";
import { newId } from "@/lib/ids";
import type { ActionState } from "@/app/actions/auth";

export async function submitReviewAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser("CUSTOMER");

  const raw = Object.fromEntries(formData);
  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [job] = await db.select().from(jobs).where(eq(jobs.id, data.jobId));
  if (!job || job.customerId !== user.id) {
    return { error: "Auftrag nicht gefunden." };
  }
  if (job.status !== "COMPLETED") {
    return { error: "Du kannst erst nach Abschluss des Auftrags bewerten." };
  }
  if (!job.acceptedOfferId) {
    return { error: "Für diesen Auftrag gibt es kein angenommenes Angebot." };
  }

  const [existingReview] = await db.select().from(reviews).where(eq(reviews.jobId, job.id));
  if (existingReview) {
    return { error: "Du hast diesen Auftrag bereits bewertet." };
  }

  const [acceptedOffer] = await db.select().from(offers).where(eq(offers.id, job.acceptedOfferId));
  if (!acceptedOffer) {
    return { error: "Angenommenes Angebot nicht gefunden." };
  }

  await db.insert(reviews).values({
    id: newId("rev"),
    jobId: job.id,
    customerId: user.id,
    craftsmanId: acceptedOffer.craftsmanId,
    rating: data.rating,
    comment: data.comment || null,
  });

  revalidatePath(`/dashboard/kunde/auftrag/${job.id}`);
  revalidatePath(`/handwerker/${acceptedOffer.craftsmanId}`);
  return { error: undefined };
}
