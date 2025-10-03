// ================================
// 🌐 IMPORTS
// ================================
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { authMiddleware, generateToken, AuthRequest } from "./auth.js";
import { generateProjectCode, improveCode } from "./openai.js";
import { createProjectFormSchema } from "../shared/schema.js";
import { z } from "zod";
import Stripe from "stripe";
import bcrypt from "bcryptjs";
import passport from "passport";
import "./passport.js";

// ================================
// 💳 STRIPE INITIALIZATION
// ================================
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ Missing required Stripe secret: STRIPE_SECRET_KEY");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

console.log("🧭 Router initialized");

const isPayPalAvailable =
  process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET;

// ================================
// 🚀 REGISTER ROUTES FUNCTION
// ================================
export async function registerRoutes(app: Express): Promise<Server> {
  // ================================
  // 🔑 GOOGLE AUTH CALLBACK
  // ================================
  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      const user = req.user as any;

      if (!user) {
        return res.redirect("https://markode-ai-tool.onrender.com/login");
      }

      const token = generateToken({
        id: user.id,
        name: user.firstName,
        email: user.email,
        picture: user.profileImageUrl,
      });

      res.redirect(`https://markode-ai-tool.onrender.com/auth/callback?token=${token}`);
    }
  );

  // ================================
  // 🧍 SIGNUP ROUTE
  // ================================
  app.post("/api/signup", async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "جميع الحقول مطلوبة" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "البريد الإلكتروني مستخدم مسبقًا" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await storage.createUser({
        firstName: name,
        lastName: "",
        email,
        password: hashedPassword,
        profileImageUrl: "",
      });

      res.json({ message: "تم إنشاء الحساب بنجاح", user: newUser });
    } catch (error) {
      console.error("❌ Signup error:", error);
      res.status(500).json({ message: "حدث خطأ أثناء التسجيل" });
    }
  });

  // ================================
  // 🔐 LOGIN ROUTE
  // ================================
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = generateToken({
        id: user.id,
        name: user.firstName,
        email: user.email,
        picture: user.profileImageUrl,
      });

      res.json({ message: "Login successful", token, user });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // ================================
  // 🧾 GET AUTH USER
  // ================================
  app.get("/api/auth/user", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ================================
  // 🧩 PROJECT ROUTES
  // ================================

  // ✅ CREATE PROJECT
  app.post("/api/projects", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const userId = req.user.sub;
      const validatedData = createProjectFormSchema.parse(req.body);

      const project = await storage.createProject({
        ...(validatedData as { name: string; framework: string }),
        userId,
        status: "building",
      });

      console.log(`🚀 Starting code generation for project ${project.id}...`);

      generateProjectCode(
        validatedData.prompt,
        validatedData.framework,
        validatedData.language || undefined
      )
        .then(async (generatedCode: any) => {
          console.log(`✅ Code generation successful for project ${project.id}`);
          await storage.updateProject(project.id, {
            sourceCode: generatedCode,
            status: "ready",
          });
        })
        .catch(async (error: unknown) => {
          console.error(`❌ Error generating code for project ${project.id}:`, error);
          await storage.updateProject(project.id, { status: "error" });
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

  // ✅ UPDATE PROJECT
  app.put("/api/projects/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);

      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.userId !== req.user.sub) return res.status(403).json({ message: "Access denied" });

      const updated = await storage.updateProject(id, { ...req.body, userId: req.user.sub });
      res.json(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // ✅ DELETE PROJECT
  app.delete("/api/projects/:id", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);

      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.userId !== req.user.sub) return res.status(403).json({ message: "Access denied" });

      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // ================================
  // 📦 TEMPLATE ROUTES
  // ================================
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      if (!template) return res.status(404).json({ message: "Template not found" });
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/projects/from-template/:templateId", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { templateId } = req.params;
      const { name, description } = req.body;
      const userId = req.user.sub;

      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

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
      console.error("Error creating project from template:", error);
      res.status(500).json({ message: "Failed to create project from template" });
    }
  });

  // ================================
  // ⚙️ CODE IMPROVEMENT
  // ================================
  app.post("/api/projects/:id/improve", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const { code, improvements } = req.body;
      const project = await storage.getProject(id);

      if (!project) return res.status(404).json({ message: "Project not found" });
      if (project.userId !== req.user.sub) return res.status(403).json({ message: "Access denied" });

      const improvedCode = await improveCode(code, improvements);
      res.json({ improvedCode });
    } catch (error) {
      console.error("Error improving code:", error);
      res.status(500).json({ message: "Failed to improve code" });
    }
  });

  // ================================
  // 💳 STRIPE PAYMENTS
  // ================================
  const PRICING_PLANS = {
    pro: { price: 2900, name: "Pro Plan", currency: "usd" },
    enterprise: { price: 19900, name: "Enterprise Plan", currency: "usd" },
  } as const;

  const createPaymentIntentSchema = z.object({
    planId: z.enum(["pro", "enterprise"]),
  });

  app.post("/api/create-payment-intent", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const { planId } = createPaymentIntentSchema.parse(req.body);
      const userId = req.user?.sub || null;

      const plan = PRICING_PLANS[planId];
      const metadata: any = { planId, planName: plan.name };
      if (userId) metadata.userId = userId;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.price,
        currency: plan.currency,
        automatic_payment_methods: { enabled: true },
        metadata,
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // ================================
  // 💰 PAYPAL ROUTES
  // ================================
  app.get("/api/paypal/setup", async (req, res) => {
    if (!isPayPalAvailable)
      return res.status(503).json({ error: "PayPal not configured" });
    try {
      const { loadPaypalDefault } = await import("./paypal.js");
      await loadPaypalDefault(req, res);
    } catch {
      res.status(500).json({ error: "PayPal service unavailable" });
    }
  });

  app.post("/api/paypal/order", async (req, res) => {
    if (!isPayPalAvailable)
      return res.status(503).json({ error: "PayPal not configured" });
    try {
      const { createPaypalOrder } = await import("./paypal.js");
      await createPaypalOrder(req, res);
    } catch {
      res.status(500).json({ error: "PayPal service unavailable" });
    }
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    if (!isPayPalAvailable)
      return res.status(503).json({ error: "PayPal not configured" });
    try {
      const { capturePaypalOrder } = await import("./paypal.js");
      await capturePaypalOrder(req, res);
    } catch {
      res.status(500).json({ error: "PayPal service unavailable" });
    }
  });

  // ================================
  // ✅ RETURN SERVER INSTANCE
  // ================================
  const httpServer = createServer(app);
  return httpServer;
}
