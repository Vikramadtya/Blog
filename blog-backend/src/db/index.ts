import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

/**
 * Initializes and returns the Drizzle database instance
 * using the provided Neon connection string.
 */
export function getDb(databaseUrl: string) {
  const sql = neon(databaseUrl);
  return drizzle(sql);
}
