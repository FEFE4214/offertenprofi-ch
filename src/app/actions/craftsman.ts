"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { craftsmanProfiles, craftsmanCategories, craftsmanServiceAreas } from "@/db/schema";
import { editProfileSchema } from "@/lib/validators";
import { requireUser, getCurrentCraftsmanProfile } from "@/lib/session";
import type { ActionState } from "@/app/actions/auth";

export async function updateProfileAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const user = await requireUser("CRAFTSMAN");
  const profile = await getCurrentCraftsmanProfile();
  if (!profile) {
    return { error: "Profil nicht gefunden." };
  }

  const raw = Object.fromEntries(formData);
  const categories = formData.getAll("categories").map(String);
  const serviceAreas = formData.getAll("serviceAreas").map(String);

  const parsed = editProfileSchema.safeParse({ ...raw, categories, serviceAreas });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  await db
    .update(craftsmanProfiles)
    .set({
      companyName: data.companyName || null,
      bio: data.bio || null,
      yearsExperience: data.yearsExperience ?? null,
      website: data.website || null,
    })
    .where(eq(craftsmanProfiles.id, profile.id));

  await db.delete(craftsmanCategories).where(eq(craftsmanCategories.craftsmanProfileId, profile.id));
  for (const categoryId of data.categories) {
    await db.insert(craftsmanCategories).values({ craftsmanProfileId: profile.id, categoryId });
  }

  await db.delete(craftsmanServiceAreas).where(eq(craftsmanServiceAreas.craftsmanProfileId, profile.id));
  for (const canton of data.serviceAreas) {
    await db.insert(craftsmanServiceAreas).values({ craftsmanProfileId: profile.id, canton });
  }

  revalidatePath("/dashboard/handwerker/profil");
  revalidatePath(`/handwerker/${user.id}`);
  return { error: "__success__" };
}
