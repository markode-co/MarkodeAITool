import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ✅ دالة تسجيل الأحداث في السيرفر
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

/**
 * ✅ إعداد Vite أثناء التطوير (Hot Reload)
 */
export async function setupVite(app: Express, server: Server) {
  const clientRoot = path.resolve(__dirname, "../client");
  const clientTemplate = path.join(clientRoot, "index.html");

  const vite = await createViteServer({
    root: clientRoot,
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  // ✅ توجيه جميع المسارات إلى React أثناء التطوير
  app.use("*", async (req, res, next) => {
    try {
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // منع الكاش بإضافة معرف فريد
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(req.originalUrl, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * ✅ تقديم الملفات الثابتة أثناء الإنتاج
 */
export function serveStatic(app: Express) {
  // 📁 مجلد البناء النهائي
  const distPath = path.resolve(__dirname, "../server/public");
  const indexPath = path.join(distPath, "index.html");

  console.log("📦 Serving static files from:", distPath);

  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.html not found in:", distPath);
    throw new Error("❌ لم يتم العثور على index.html داخل مجلد البناء!");
  }

  // ✅ تقديم الملفات الثابتة
  app.use(express.static(distPath));

  /**
   * ✅ المسارات التي يجب أن تعيد index.html (ليتعامل معها React Router)
   */
  const reactRoutes = [
    "/",                 // الصفحة الرئيسية
    "/landing",          // صفحة الهبوط
    "/login",            // تسجيل الدخول
    "/signup",           // إنشاء حساب
    "/about",            // من نحن
    "/dashboard",        // لوحة التحكم
    "/profile",          // الملف الشخصي
    "/settings",         // الإعدادات
    "/contact",          // اتصل بنا
    "/pricing",          // الأسعار
    "/features",         // المميزات
  ];

  reactRoutes.forEach((route) => {
    app.get(route, (_req, res) => {
      res.sendFile(indexPath);
    });
  });

  /**
   * ✅ معالجة مسارات Google Auth بشكل خاص
   */
  app.get("/auth/google", (_req, res) => {
    // هذه المسارات تُدار من السيرفر (وليس React)
    res.redirect("http://127.0.0.1:5000/api/auth/google");
  });

  app.get("/auth/google/callback", (_req, res) => {
    // بعد نجاح تسجيل الدخول يعاد التوجيه إلى لوحة التحكم
    res.redirect("/dashboard");
  });

  /**
   * ✅ أي مسار آخر غير موجود يعاد إلى React Router
   */
  app.get("*", (_req, res) => {
    res.sendFile(indexPath);
  });
}
