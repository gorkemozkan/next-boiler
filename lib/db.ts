import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DB_CONFIG } from '@/lib/constants';

const pool = new Pool({
  connectionString: DB_CONFIG.URL,
  ssl: false, // Disable SSL for Docker development
});

export const db = drizzle(pool);
