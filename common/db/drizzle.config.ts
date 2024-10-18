import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';

config({
  path: ['../../.env'], // load .env from root of the project
});
export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
  out: './src/out',
});
