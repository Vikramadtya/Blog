import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

let cachedDb: ReturnType<typeof drizzle> | null = null;

/**
 * Initializes and returns the Drizzle database instance
 * using the provided Neon connection string.
 */
export function getDb(databaseUrl: string) {
  if (cachedDb) return cachedDb;

  if (!databaseUrl) {
    throw new Error(`DATABASE_URL is missing!`);
  }
  if (typeof databaseUrl !== 'string') {
    throw new Error(`DATABASE_URL is not a string!`);
  }
  try {
    const sql = neon(databaseUrl);
    cachedDb = drizzle(sql);
    return cachedDb;
  } catch (err: any) {
    throw new Error(`Failed to initialize neon. Error: ${err.message}.`);
  }
}
