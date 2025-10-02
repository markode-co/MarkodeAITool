import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config.js";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

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
 * 🧩 إعداد Vite أثناء التطوير (localhost)
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
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(__dirname, "../client/index.html");
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

      // إضافة كاش ID لتجنب تخزين المتصفح للنسخة القديمة
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );

      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

/**
 * 🚀 يستخدم في الإنتاج (Render)
 */
export function serveStatic(app: Express) {
  // ✅ هذا هو المسار الصحيح بعد النسخ في build-copy.js
  const distPath = path.resolve(__dirname, "./public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `❌ لم يتم العثور على مجلد البناء: ${distPath}\n➡️ تأكد من تشغيل "npm run build" داخل مجلد client`
    );
  }

  // ✅ تقديم ملفات React المبنية
  app.use(express.static(distPath));

  // ✅ توجيه أي طلب غير API إلى index.html (SPA)
  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
