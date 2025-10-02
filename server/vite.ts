import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 🧾 دالة لتسجيل الرسائل في الكونسول مع الوقت
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
 * ⚙️ أثناء التطوير فقط (localhost)
 */
export async function setupVite(app: Express, server: Server) {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      middlewareMode: true,
      hmr: { server },
      allowedHosts: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const clientTemplate = path.resolve(__dirname, "../client/index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // 🔄 تحديث الرابط لتفادي الكاش أثناء التطوير
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
 * 🚀 يستخدم في الإنتاج (مثل Render)
 */
export function serveStatic(app: Express) {
  // ✅ المسار الصحيح للملفات المبنية بعد build
  const distPath = path.resolve(__dirname, "public");
  const indexPath = path.join(distPath, "index.html");

  console.log("📦 Serving static files from:", distPath);

  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.html not found in:", distPath);
    throw new Error("❌ لم يتم العثور على index.html داخل مجلد البناء!");
  }

  // تقديم الملفات الثابتة (JS / CSS / صور ...)
  app.use(express.static(distPath));

  // ✅ جميع المسارات الأخرى تعيد index.html (مطلوب لتطبيق React Router)
  app.get("*", (_req, res) => {
    res.sendFile(indexPath);
  });
}
