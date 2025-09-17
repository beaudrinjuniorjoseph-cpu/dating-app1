import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const sqlite = new Database(process.env.DATABASE_URL.replace('file:', ''));
export const db = drizzle(sqlite, { schema });
