import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Projects table
export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  framework: varchar("framework").notNull(),
  language: varchar("language").default("javascript"),
  status: varchar("status").default("draft"),
  sourceCode: jsonb("source_code"),
  deployUrl: varchar("deploy_url"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Templates table
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(),
  framework: varchar("framework").notNull(),
  language: varchar("language").default("javascript"),
  sourceCode: jsonb("source_code").notNull(),
  imageUrl: varchar("image_url"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ✅ Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertTemplate = typeof templates.$inferInsert;
export type Template = typeof templates.$inferSelect;

// ✅ Validation schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
});

// ✅ Form schema (frontend)
export const createProjectFormSchema = z.object({
  name: z.string().min(3, "اسم المشروع مطلوب"),
  framework: z.string().min(2, "يجب اختيار الإطار (framework)"),
  language: z.string().default("javascript"),
  description: z.string().optional(),
  prompt: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل"),
});

// ✅ Backend validation schema
export const createProjectSchema = insertProjectSchema.extend({
  prompt: z.string().min(10, "يجب أن يكون الوصف 10 أحرف على الأقل"),
});

export type CreateProjectForm = z.infer<typeof createProjectFormSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
