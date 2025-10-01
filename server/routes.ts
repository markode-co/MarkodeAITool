import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { authMiddleware, generateToken, AuthRequest } from "./auth.js";
import { generateProjectCode, improveCode } from "./openai.js";
import { createProjectFormSchema } from "../shared/schema.js";
import { z } from "zod";
import Stripe from "stripe";
// PayPal imports - conditional handling done in routes

// Initialize Stripe - blueprint: javascript_stripe
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// PayPal availability check
const isPayPalAvailable = process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  // Temporary auth middleware for development
  

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Project routes
  app.get('/api/projects', async (req: any, res) => {
    try {
      const userId = req.user.sub;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get('/api/projects/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Check if user owns the project
      if (project.userId !== req.user.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

// تسجيل الدخول (يرجع JWT)
app.post("/api/login", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: "userId required" });
  }

  const token = generateToken(userId);
  res.json({ token });
});

// ✅ من هنا يبدأ التوثيق الإجباري
app.use(authMiddleware);

// استرجاع بيانات المستخدم الحالي
app.get("/api/auth/user", async (req: any, res) => {
  try {
    const userId = req.user.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// إنشاء مشروع جديد
app.post('/api/projects', async (req: any, res) => {
  try {
    const userId = req.user.sub;
    const validatedData = createProjectFormSchema.parse(req.body);
    
    // إنشاء مشروع بالحالة "building"
    const project = await storage.createProject({
      ...validatedData,
      userId,
      status: 'building',
    });

    console.log(`🚀 Starting code generation for project ${project.id}...`);

    // توليد الكود بشكل غير متزامن
    generateProjectCode(
      validatedData.prompt, 
      validatedData.framework,
      validatedData.language || undefined
    )
    .then(async (generatedCode: any) => {
      console.log(`✅ Code generation successful for project ${project.id}`);
      await storage.updateProject(project.id, {
        sourceCode: generatedCode,
        status: 'ready',
      });
    })
    .catch(async (error: unknown) => {
      console.error(`❌ Error generating code for project ${project.id}:`, error);
      await storage.updateProject(project.id, { status: 'error' });
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

  app.put('/api/projects/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.userId !== req.user.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      const updated = await storage.updateProject(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', async (req: any, res) => {
    try {
      const { id } = req.params;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.userId !== req.user.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Template routes
  app.get('/api/templates', async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get('/api/templates/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post('/api/projects/from-template/:templateId', async (req: any, res) => {
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
        status: 'ready',
      });

      res.json(project);
    } catch (error) {
      console.error("Error creating project from template:", error);
      res.status(500).json({ message: "Failed to create project from template" });
    }
  });

  // Code improvement endpoint
  app.post('/api/projects/:id/improve', async (req: any, res) => {
    try {
      const { id } = req.params;
      const { code, improvements } = req.body;
      const project = await storage.getProject(id);
      
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.userId !== req.user.sub) {
        return res.status(403).json({ message: "Access denied" });
      }

      const improvedCode = await improveCode(code, improvements);
      res.json({ improvedCode });
    } catch (error) {
      console.error("Error improving code:", error);
      res.status(500).json({ message: "Failed to improve code" });
    }
  });

  // Define trusted pricing plans
  const PRICING_PLANS = {
    pro: {
      price: 2900, // $29.00 in cents
      name: "Pro Plan",
      currency: "usd"
    },
    enterprise: {
      price: 19900, // $199.00 in cents  
      name: "Enterprise Plan",
      currency: "usd"
    }
  } as const;

  const createPaymentIntentSchema = z.object({
    planId: z.enum(["pro", "enterprise"])
  });

  // Stripe payment routes - blueprint: javascript_stripe
  app.post("/api/create-payment-intent", async (req: any, res) => {
    try {
      const { planId } = createPaymentIntentSchema.parse(req.body);
      // Get userId if authenticated, otherwise null
      const userId = req.user?.claims?.sub || null;
      
      const plan = PRICING_PLANS[planId];
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan ID" });
      }
      
      const metadata: any = {
        planId,
        planName: plan.name,
      };
      
      // Add userId only if user is authenticated
      if (userId) {
        metadata.userId = userId;
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plan.price,
        currency: plan.currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res
        .status(500)
        .json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Test Stripe connection (development only)
  app.get("/api/stripe-test", async (req, res) => {
    // Only allow in development environment
    if (process.env.NODE_ENV === "production") {
      return res.status(404).json({ message: "Not found" });
    }
    try {
      // Test the Stripe connection by retrieving account info
      const account = await stripe.accounts.retrieve();
      res.json({ 
        success: true, 
        accountId: account.id,
        country: account.country,
        isLive: !account.id.startsWith("acct_"),
        message: "Stripe connection successful"
      });
    } catch (error: any) {
      console.error("Stripe test failed:", error);
      res.status(500).json({ 
        success: false, 
        error: error.message,
        message: "Stripe connection failed"
      });
    }
  });

  // PayPal payment routes - blueprint: javascript_paypal
  app.get("/api/paypal/setup", async (req, res) => {
    if (!isPayPalAvailable) {
      return res.status(503).json({ error: "PayPal service not configured" });
    }
    try {
      const { loadPaypalDefault } = await import("./paypal.js");
      await loadPaypalDefault(req, res);
    } catch (error) {
      res.status(500).json({ error: "PayPal service unavailable" });
    }
  });

  app.post("/api/paypal/order", async (req, res) => {
    if (!isPayPalAvailable) {
      return res.status(503).json({ error: "PayPal service not configured" });
    }
    try {
      const { createPaypalOrder } = await import("./paypal.js");
      await createPaypalOrder(req, res);
    } catch (error) {
      res.status(500).json({ error: "PayPal service unavailable" });
    }
  });

  app.post("/api/paypal/order/:orderID/capture", async (req, res) => {
    if (!isPayPalAvailable) {
      return res.status(503).json({ error: "PayPal service not configured" });
    }
    try {
      const { capturePaypalOrder } = await import("./paypal.js");
      await capturePaypalOrder(req, res);
    } catch (error) {
      res.status(500).json({ error: "PayPal service unavailable" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
