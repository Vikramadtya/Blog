import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

// Cloudflare Workers typically use .dev.vars for local dev
dotenv.config({ path: ".dev.vars" });
// Fallback to .env if .dev.vars isn't found
dotenv.config({ path: ".env" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  }
} satisfies Config;
