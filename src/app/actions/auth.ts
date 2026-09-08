"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, craftsmanProfiles, craftsmanCategories, craftsmanServiceAreas } from "@/db/schema";
import {
  registerCustomerSchema,
  registerCraftsmanSchema,
  loginSchema,
} from "@/lib/validators";
import { hashPassword, verifyPassword, createSessionToken } from "@/lib/auth";
import { setSessionCookie, clearSessionCookie } from "@/lib/session";
import { newId } from "@/lib/ids";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export async function registerCustomerAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = registerCustomerSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [existing] = await db.select().from(users).where(eq(users.email, data.email));
  if (existing) {
    return { error: "Diese E-Mail-Adresse ist bereits registriert." };
  }

  const passwordHash = await hashPassword(data.password);
  const id = newId("usr");
  await db.insert(users).values({
    id,
    email: data.email,
    passwordHash,
    role: "CUSTOMER",
    name: data.name,
    phone: data.phone || null,
    canton: data.canton,
    plz: data.plz,
    city: data.city,
  });

  const token = await createSessionToken({ userId: id, role: "CUSTOMER" });
  await setSessionCookie(token);
  redirect("/dashboard/kunde");
}

export async function registerCraftsmanAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const categories = formData.getAll("categories").map(String);
  const serviceAreas = formData.getAll("serviceAreas").map(String);

  const parsed = registerCraftsmanSchema.safeParse({
    ...raw,
    categories,
    serviceAreas,
  });
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;

  const [existing] = await db.select().from(users).where(eq(users.email, data.email));
  if (existing) {
    return { error: "Diese E-Mail-Adresse ist bereits registriert." };
  }

  const passwordHash = await hashPassword(data.password);
  const userId = newId("usr");
  await db.insert(users).values({
    id: userId,
    email: data.email,
    passwordHash,
    role: "CRAFTSMAN",
    name: data.name,
    phone: data.phone || null,
    canton: data.canton,
    plz: data.plz,
    city: data.city,
  });

  const profileId = newId("cwp");
  await db.insert(craftsmanProfiles).values({
    id: profileId,
    userId,
    companyName: data.companyName,
    bio: data.bio || null,
    yearsExperience: data.yearsExperience ?? null,
    verified: false,
  });

  for (const categoryId of data.categories) {
    await db.insert(craftsmanCategories).values({ craftsmanProfileId: profileId, categoryId });
  }
  for (const canton of data.serviceAreas) {
    await db.insert(craftsmanServiceAreas).values({ craftsmanProfileId: profileId, canton });
  }

  const token = await createSessionToken({ userId, role: "CRAFTSMAN" });
  await setSessionCookie(token);
  redirect("/dashboard/handwerker");
}

export async function loginAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const { email, password } = parsed.data;

  const [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  const token = await createSessionToken({ userId: user.id, role: user.role });
  await setSessionCookie(token);

  if (user.role === "CRAFTSMAN") {
    redirect("/dashboard/handwerker");
  } else {
    redirect("/dashboard/kunde");
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
