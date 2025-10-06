// server/storage.ts
import bcrypt from "bcryptjs";
import {
  users,
  projects,
  templates,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Template,
  type InsertTemplate,
} from "../shared/schema.js";
import { db } from "./db.js";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;

  getUserProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
}

export class DatabaseStorage implements IStorage {
  // ===== USER OPERATIONS =====
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    try {
      let password = userData.password || "";
      if (password && !password.startsWith("$2a$")) {
        password = await bcrypt.hash(password, 10);
      }

      const [newUser] = await db
        .insert(users)
        .values({
          ...userData,
          password,
          firstName: userData.firstName || "User",
          lastName: userData.lastName || "",
          profileImageUrl: userData.profileImageUrl || "",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      console.log(`✅ User created: ${newUser.email}`);
      return newUser;
    } catch (error: any) {
      console.error("❌ Error creating user:", error.message || error);
      throw new Error("Failed to create user");
    }
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    try {
      const existing = await this.getUserByEmail(userData.email);

      let password = userData.password || "";
      if (password && !password.startsWith("$2a$")) {
        password = await bcrypt.hash(password, 10);
      }

      if (existing) {
        const [updated] = await db
          .update(users)
          .set({
            email: userData.email,
            password: password || existing.password,
            firstName: userData.firstName || existing.firstName,
            lastName: userData.lastName || existing.lastName,
            profileImageUrl: userData.profileImageUrl || existing.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.email, userData.email))
          .returning();

        console.log(`🔄 User updated: ${updated.email}`);
        return updated;
      } else {
        return await this.createUser({
          email: userData.email,
          password,
          firstName: userData.firstName || "User",
          lastName: userData.lastName || "",
          profileImageUrl: userData.profileImageUrl || "",
        });
      }
    } catch (error: any) {
      console.error("❌ Error upserting user:", error.message || error);
      throw new Error("Failed to upsert user");
    }
  }

  // ===== PROJECT OPERATIONS =====
  async getUserProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(desc(projects.updatedAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [created] = await db.insert(projects).values(project).returning();
    return created;
  }

  async updateProject(
    id: string,
    updates: Partial<InsertProject>
  ): Promise<Project> {
    const [updated] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updated;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // ===== TEMPLATE OPERATIONS =====
  async getTemplates(): Promise<Template[]> {
    return await db
      .select()
      .from(templates)
      .where(eq(templates.isPublic, true))
      .orderBy(desc(templates.createdAt));
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    const [template] = await db.select().from(templates).where(eq(templates.id, id));
    return template;
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const [created] = await db.insert(templates).values(template).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
