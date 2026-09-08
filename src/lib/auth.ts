import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "offerta_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export type SessionPayload = {
  userId: string;
  role: "CUSTOMER" | "CRAFTSMAN" | "ADMIN";
};

export async function createSessionToken(
  payload: SessionPayload
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (
      typeof payload.userId === "string" &&
      (payload.role === "CUSTOMER" ||
        payload.role === "CRAFTSMAN" ||
        payload.role === "ADMIN")
    ) {
      return { userId: payload.userId, role: payload.role };
    }
    return null;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS };
