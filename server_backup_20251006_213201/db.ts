// server/db.ts
import "dotenv/config";
import * as schema from "../shared/schema.js";

import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { Client as NodePgClient } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL must be set in environment variables");
}

// نوع أي مؤقت ليتم استنتاجه لاحقًا من الاتصال
let db: any;

async function initDb(): Promise<void> {
  try {
    if (process.env.NODE_ENV === "production") {
      // اتصال Neon في بيئة الإنتاج
      const sql = neon(process.env.DATABASE_URL!);
      db = drizzleNeon(sql, { schema });
      console.log("✅ Connected to Neon Database (Production)");
    } else {
      // PostgreSQL محلي في بيئة التطوير
      const client = new NodePgClient({ connectionString: process.env.DATABASE_URL });
      await client.connect();
      db = drizzlePg(client, { schema });
      console.log("✅ Connected to Local PostgreSQL (Development)");
    }
  } catch (error) {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1); // إيقاف التطبيق عند فشل الاتصال
  }
}

// تأكد من تهيئة الاتصال قبل استخدام db
await initDb();

export { db };
