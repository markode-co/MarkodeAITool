import "dotenv/config";
import * as schema from "../shared/schema.js";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Client as NodePgClient } from "pg";

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL must be set in environment variables");
}

let db: any;

if (isProduction) {
  // 🚀 استخدام قاعدة بيانات Neon في بيئة الإنتاج
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzleNeon(sql, { schema });
  console.log("✅ Connected to Neon Database (Production)");
} else {
  // 💻 استخدام PostgreSQL المحلي أثناء التطوير
  const client = new NodePgClient({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  db = drizzlePg(client, { schema });
  console.log("✅ Connected to Local PostgreSQL (Development)");
}

export { db };
