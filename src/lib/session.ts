import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users, craftsmanProfiles } from "@/db/schema";
import {
  SESSION_COOKIE_NAME,
  SESSION_DURATION_SECONDS,
  verifySessionToken,
  type SessionPayload,
} from "@/lib/auth";

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  return user ?? null;
}

export async function getCurrentCraftsmanProfile() {
  const session = await getSession();
  if (!session || session.role !== "CRAFTSMAN") return null;
  const [profile] = await db
    .select()
    .from(craftsmanProfiles)
    .where(eq(craftsmanProfiles.userId, session.userId));
  return profile ?? null;
}

/** Redirects to /login if not authenticated. Optionally enforces a role. */
export async function requireUser(role?: "CUSTOMER" | "CRAFTSMAN" | "ADMIN") {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (role && session.role !== role) {
    redirect("/");
  }
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
