// server/routes.ts
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { authMiddleware, generateToken, AuthRequest } from "./auth.js";
import { createProjectFormSchema } from "../shared/schema.js";
import { z } from "zod";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import passport from "passport";
import authGoogleRoutes from "./auth-google.js";
import { PRICING_PLANS, createPaymentIntentSchema, type PlanId } from "./pricing.js";
import { improveCode } from "./openai.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import(path.join(__dirname, "passport.js"));

export async function registerRoutes(app: Express): Promise<Server> {
  // ================================
  // GOOGLE AUTH ROUTES
  // ================================
  app.use("/auth", authGoogleRoutes);

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("❌ Missing required Stripe secret: STRIPE_SECRET_KEY");
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-08-27.basil",
  });

  const isPayPalAvailable =
    !!process.env.PAYPAL_CLIENT_ID && !!process.env.PAYPAL_CLIENT_SECRET;

  // GOOGLE AUTH CALLBACK
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    async (req: Request, res: Response) => {
      const user = req.user as any;
      if (!user) return res.redirect("/login");

      const token = generateToken({
        id: user.id,
        name: user.firstName || "User",
        email: user.email,
        picture: user.profileImageUrl || undefined,
      });

      res.redirect(`/auth/callback?token=${token}`);
    }
  );

  // ================================
  // SIGNUP
  // ================================
  app.post("/api/signup", async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ message: "جميع الحقول مطلوبة" });

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser)
        return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقًا" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createUser({
        firstName: name,
        lastName: "",
        email,
        password: hashedPassword,
        profileImageUrl: "",
      });

      const token = generateToken({
        id: newUser.id,
        name: newUser.firstName,
        email: newUser.email,
        picture: newUser.profileImageUrl || undefined,
      });

      res.json({ message: "تم إنشاء الحساب بنجاح", user: newUser, token });
    } catch (error) {
      console.error("❌ Signup error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء التسجيل" });
    }
  });

  // ================================
  // LOGIN
  // ================================
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

      const user = await storage.getUserByEmail(email);
      if (!user) return res.status(401).json({ message: "Invalid email or password" });

      const validPassword = await bcrypt.compare(password, user.password || "");
      if (!validPassword)
        return res.status(401).json({ message: "Invalid email or password" });

      const token = generateToken({
        id: user.id,
        name: user.firstName || "User",
        email: user.email,
        picture: user.profileImageUrl || undefined,
      });

      res.json({ message: "Login successful", token, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // ================================
  // AUTH USER INFO
  // ================================
  app.get("/api/auth/user", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.sub;
      if (!userId) return res.status(401).json({ message: "User not authenticated" });

      const userData = await storage.getUser(userId);
      if (!userData) return res.status(404).json({ message: "User not found" });

      res.json(userData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ================================
  // PROJECT ROUTES
  // ================================
  app.post("/api/projects", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user!.sub;
      const validatedData = createProjectFormSchema.parse(req.body);

      const project = await storage.createProject({
        ...validatedData,
        userId,
        status: "building",
      });

      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.issues });
      }
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      const userId = authReq.user!.sub;

      const project = await storage.getProject(id);
      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.userId !== userId) return res.status(403).json({ message: "Access denied" });

      const updated = await storage.updateProject(id, { ...req.body, userId });
      res.json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      const userId = authReq.user!.sub;

      const project = await storage.getProject(id);
      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.userId !== userId) return res.status(403).json({ message: "Access denied" });

      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // ================================
  // TEMPLATE ROUTES
  // ================================
  app.get("/api/templates", async (_, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) return res.status(404).json({ message: "Template not found" });
      res.json(template);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/projects/from-template/:templateId", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { templateId } = req.params;
      const { name, description } = req.body;
      const userId = authReq.user!.sub;

      const template = await storage.getTemplate(templateId);
      if (!template) return res.status(404).json({ message: "Template not found" });

      const project = await storage.createProject({
        userId,
        name: name || template.name,
        description: description || template.description,
        framework: template.framework,
        language: template.language,
        sourceCode: template.sourceCode,
        status: "ready",
      });

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create project from template" });
    }
  });

  // ================================
  // CODE IMPROVEMENT (محسن)
  // ================================
  app.post("/api/projects/:id/improve", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const { id } = req.params;
      const { code, improvements } = req.body;

      if (!code || typeof code !== "string")
        return res.status(400).json({ message: "Code is required and must be a string" });

      const project = await storage.getProject(id);
      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.userId !== authReq.user!.sub) return res.status(403).json({ message: "Access denied" });

      const improvedCode = await improveCode(code, improvements || "");
      res.json({ improvedCode });
    } catch (error) {
      console.error("Improve code error:", error);
      res.status(500).json({ message: "Failed to improve code" });
    }
  });

  // ================================
  // STRIPE PAYMENTS (محسن)
  // ================================
  app.post("/api/create-payment-intent", authMiddleware, async (req: Request, res: Response) => {
    try {
      const authReq = req as AuthRequest;
      const parsedBody = createPaymentIntentSchema.safeParse(req.body);
      if (!parsedBody.success) {
        return res.status(400).json({ message: "Invalid request data", errors: parsedBody.error.issues });
      }

      const { planId } = parsedBody.data as { planId: PlanId };
      const userId = authReq.user!.sub;

      const plan = PRICING_PLANS[planId];
      if (!plan) return res.status(404).json({ message: "Plan not found" });

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(plan.price), // بالوحدة الصحيحة
        currency: plan.currency,
        automatic_payment_methods: { enabled: true },
        metadata: { planId, planName: plan.name, userId },
      });

      res.json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
    } catch (error: any) {
      console.error("Stripe PaymentIntent error:", error);
      res.status(500).json({ message: error.message || "Failed to create payment intent" });
    }
  });

  // ================================
  // PAYPAL ROUTES (محسنة)
  // ================================
  app.get("/api/paypal/setup", async (req, res) => {
    if (!isPayPalAvailable) return res.status(503).json({ error: "PayPal not configured" });
    try {
      const { loadPaypalDefault } = await import("./paypal.js");
      await loadPaypalDefault(req, res);
    } catch (error) {
      console.error("PayPal setup error:", error);
      res.status(500).json({ error: "Failed to setup PayPal" });
    }
  });

  app.post("/api/paypal/order", async (req, res) => {
    if (!isPayPalAvailable) return res.status(503).json({ error: "PayPal not configured" });
    try {
      const { createPaypalOrder } = await import("./paypal.js");
      await createPaypalOrder(req, res);
    } catch (error) {
      console.error("PayPal create order error:", error);
      res.status(500).json({ error: "Failed to create PayPal order" });
    }
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    if (!isPayPalAvailable) return res.status(503).json({ error: "PayPal not configured" });
    try {
      const { capturePaypalOrder } = await import("./paypal.js");
      await capturePaypalOrder(req, res);
    } catch (error) {
      console.error("PayPal capture order error:", error);
      res.status(500).json({ error: "Failed to capture PayPal order" });
    }
  });

  const server = createServer(app);
  return server;
}
