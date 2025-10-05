import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ✅ تسجيل الأحداث في السيرفر
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

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    try {
      let template = await fs.promises.readFile(clientTemplate, "utf-8");

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
  const distPath = path.resolve(__dirname, "../server/public");
  const indexPath = path.join(distPath, "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error("❌ index.html not found in:", distPath);
    throw new Error("❌ لم يتم العثور على index.html داخل مجلد البناء!");
  }

  app.use(express.static(distPath));

  const reactRoutes = [
    "/", "/landing", "/login", "/signup", "/about", "/dashboard",
    "/profile", "/settings", "/contact", "/pricing", "/features"
  ];

  reactRoutes.forEach((route) => {
    app.get(route, (_req: Request, res: Response) => {
      res.sendFile(indexPath);
    });
  });

  // ✅ إعادة التوجيه لمصادقة Google عبر السيرفر
  app.get("/auth/google", (_req: Request, res: Response) => {
    res.redirect("/auth/google"); // سيُعالَج بواسطة Passport في routes.ts
  });

  app.get("/auth/google/callback", (_req: Request, res: Response) => {
    res.redirect("/dashboard");
  });

  // ✅ أي مسار آخر يعاد إلى React
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(indexPath);
  });
}
