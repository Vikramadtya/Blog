import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

/**
 * Initializes and returns the Drizzle database instance
 * using the provided Neon connection string.
 */
export function getDb(databaseUrl: string) {
  if (!databaseUrl) {
    throw new Error(`DATABASE_URL is missing! Type: ${typeof databaseUrl}`);
  }
  if (typeof databaseUrl !== 'string') {
    throw new Error(`DATABASE_URL is not a string! Type: ${typeof databaseUrl}, Value: ${JSON.stringify(databaseUrl)}`);
  }
  try {
    const sql = neon(databaseUrl);
    return drizzle(sql);
  } catch (err: any) {
    throw new Error(`Failed to initialize neon. Error: ${err.message}. URL length: ${databaseUrl.length}, starts with: ${databaseUrl.substring(0, 15)}`);
  }
}
