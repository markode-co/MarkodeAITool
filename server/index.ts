// server.ts
import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import cors from "cors";
import session from "express-session";
import "dotenv/config";
import "module-alias/register.js";

import passport from "./passport.js";
import authGoogleRouter from "./auth-google.js";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();
const PORT = Number(process.env.PORT) || 5050;

// ================================
// CORS Configuration
// ================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://markode-ai-tool.onrender.com",
    ],
    credentials: true,
  })
);

// ================================
// Body Parsing
// ================================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ================================
// Session & Passport
// ================================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ================================
// Request Logging Middleware
// ================================
app.use((req, res, next) => {
  const start = Date.now();
  const pathReq = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (pathReq.startsWith("/api")) {
      let logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});

// ================================
// Google Auth Routes
// ================================
app.use("/auth", authGoogleRouter);

// ================================
// API & App Routes
// ================================
(async () => {
  try {
    const server = await registerRoutes(app);

    // ================================
    // Error Handling Middleware
    // ================================
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("❌ Server Error:", err);
      res.status(status).json({ message });
    });

    // ================================
    // Vite Dev / Production Static
    // ================================
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // ================================
    // SPA Fallback
    // ================================
    app.get("*", (_req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });

    // ================================
    // Start Server
    // ================================
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
