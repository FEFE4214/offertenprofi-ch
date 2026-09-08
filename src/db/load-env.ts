import { config } from "dotenv";

// Match Next.js's own env-file precedence (.env.local overrides .env) so a single
// .env.local works for both `next dev`/`next build` and CLI scripts (seed, drizzle-kit).
config({ path: ".env" });
config({ path: ".env.local", override: true });
