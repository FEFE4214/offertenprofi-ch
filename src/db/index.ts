import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL ist nicht gesetzt. Bitte in .env.local (lokal) oder in den Render-Umgebungsvariablen (Produktion) hinterlegen."
  );
}

// Reuse a single pool across hot-reloads in dev.
const globalForDb = globalThis as unknown as {
  pgPool?: Pool;
};

const pool =
  globalForDb.pgPool ??
  new Pool({
    connectionString,
    // Render's internal Postgres connections don't require TLS, but external
    // connections do and Render's cert isn't in the default CA store.
    ssl: connectionString.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { pool };
