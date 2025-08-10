import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { DB_CONFIG } from '@/lib/constants';

if (!DB_CONFIG.URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

export default defineConfig({
  out: './drizzle',
  schema: './lib/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: DB_CONFIG.URL,
  },
  verbose: false,
  strict: true,
});
