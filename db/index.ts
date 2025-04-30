import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Create a Neon connection
const sql = neon(process.env.DATABASE_URL!);

// Create a Drizzle ORM instance
export const db = drizzle(sql, { schema });

// Export all schema objects
export * from './schema';
