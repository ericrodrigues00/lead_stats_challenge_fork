import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import { url } from 'inspector';

dotenv.config();

export default defineConfig({
  schema: './backend/src/schema/task.ts',


  out: './drizzle/migrations',

dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} as any); 

