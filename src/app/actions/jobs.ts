"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jobs, categories } from "@/db/schema";
import { postJobSchema } from "@/lib/validators";
import { requireUser } from "@/lib/session";
import { newId } from "@/lib/ids";
import type { ActionState } from "@/app/actions/auth";

export async function postJobAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser("CUSTOMER");

  const raw = Object.fromEntries(formData);
  const parsed = postJobSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, data.categoryId));
  if (!category) {
    return { error: "Ungültige Kategorie." };
  }

  if (
    data.budgetMin !== undefined &&
    data.budgetMax !== undefined &&
    data.budgetMin > data.budgetMax
  ) {
    return { error: "Das Mindestbudget darf nicht höher sein als das Maximalbudget." };
  }

  const id = newId("job");
  await db.insert(jobs).values({
    id,
    customerId: user.id,
    categoryId: data.categoryId,
    title: data.title,
    description: data.description,
    canton: data.canton,
    plz: data.plz,
    city: data.city,
    budgetMin: data.budgetMin ?? null,
    budgetMax: data.budgetMax ?? null,
    desiredDate: data.desiredDate || null,
    status: "OPEN",
  });

  revalidatePath("/dashboard/kunde");
  redirect(`/dashboard/kunde/auftrag/${id}`);
}

export async function cancelJobAction(jobId: string) {
  const user = await requireUser("CUSTOMER");
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job || job.customerId !== user.id) {
    throw new Error("Auftrag nicht gefunden.");
  }
  if (job.status !== "OPEN") {
    throw new Error("Nur offene Aufträge können storniert werden.");
  }
  await db.update(jobs).set({ status: "CANCELLED" }).where(eq(jobs.id, jobId));
  revalidatePath("/dashboard/kunde");
  revalidatePath(`/dashboard/kunde/auftrag/${jobId}`);
}

export async function markJobCompleteAction(jobId: string) {
  const user = await requireUser("CUSTOMER");
  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job || job.customerId !== user.id) {
    throw new Error("Auftrag nicht gefunden.");
  }
  if (job.status !== "IN_PROGRESS") {
    throw new Error("Nur laufende Aufträge können abgeschlossen werden.");
  }
  await db.update(jobs).set({ status: "COMPLETED" }).where(eq(jobs.id, jobId));
  revalidatePath("/dashboard/kunde");
  revalidatePath(`/dashboard/kunde/auftrag/${jobId}`);
}
