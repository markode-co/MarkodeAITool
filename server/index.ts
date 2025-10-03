import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import cors from "cors";
import "dotenv/config";
import "module-alias/register.js";
import authGoogleRouter from "./auth-google.js"; // ✅ استيراد مسار Google Auth

const app = express();
const PORT = Number(process.env.PORT) || 5050;

// ✅ إعداد CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);

// ✅ إعداد body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ تسجيل الطلبات
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // ✅ تسجيل مسارات Google OAuth قبل المسارات الأخرى
  app.use("/auth", authGoogleRouter);

  // ✅ تسجيل باقي المسارات
  const server = await registerRoutes(app);

  // ✅ معالجة الأخطاء
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error("❌ Server Error:", err);
  });

  // ✅ اختيار Vite أو الملفات الثابتة
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ✅ تشغيل الخادم
  server.listen(PORT, "127.0.0.1", () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`);
  });
})();
