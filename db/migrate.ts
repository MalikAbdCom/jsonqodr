import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Main migration function
async function runMigration() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in environment variables');
  }

  console.log('🚀 Starting database migration...');
  
  // Create a Neon connection
  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);
  
  // Run migrations
  console.log('⏳ Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  
  console.log('✅ Migrations completed successfully!');
  process.exit(0);
}

// Run the migration
runMigration().catch((err) => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});
