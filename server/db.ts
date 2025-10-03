import "dotenv/config";
import * as schema from "../shared/schema.js";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Client } from "pg";

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL must be set in environment variables");
}

let db: any;

if (isProduction) {
  // ✅ الإنتاج: استخدام drizzle-orm/neon-http
  const client = neon(process.env.DATABASE_URL!);
  db = drizzleNeon(client, { schema });
  console.log("✅ Connected to Neon PostgreSQL (Production)");
} else {
  // 💻 التطوير المحلي
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  db = drizzlePg(client, { schema });
  console.log("✅ Connected to Local PostgreSQL (Development)");
}

export { db };
