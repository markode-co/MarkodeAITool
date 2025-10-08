import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
/** ✅ __dirname في ESM */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/** ✅ تسجيل الأحداث */
export function log(message, source = "express") {
    const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });
    console.log(`${formattedTime} [${source}] ${message}`);
}
/** ✅ إعداد Vite أثناء التطوير */
export async function setupVite(app, server) {
    const clientRoot = path.resolve(process.cwd(), "client");
    const clientTemplate = path.join(clientRoot, "index.html");
    const vite = await createViteServer({
        root: clientRoot,
        server: {
            middlewareMode: true,
            hmr: { server },
            watch: {
                usePolling: true,
            },
            allowedHosts: ["localhost", "127.0.0.1"],
        },
        appType: "custom",
    });
    app.use(vite.middlewares);
    app.use("*", async (req, res, next) => {
        try {
            let template = await fs.promises.readFile(clientTemplate, "utf-8");
            template = template.replace(`src="/src/main.tsx"`, `src="/src/main.tsx?v=${nanoid()}"`);
            const page = await vite.transformIndexHtml(req.originalUrl, template);
            res.status(200).set({ "Content-Type": "text/html" }).end(page);
        }
        catch (e) {
            vite.ssrFixStacktrace(e);
            next(e);
        }
    });
}
/** ✅ تقديم الملفات الثابتة أثناء الإنتاج */
export function serveStatic(app) {
    const distPath = path.resolve(__dirname, "../client/dist");
    const indexPath = path.join(distPath, "index.html");
    if (!fs.existsSync(indexPath)) {
        console.error("❌ index.html not found in:", distPath);
        throw new Error("❌ لم يتم العثور على index.html داخل مجلد البناء!");
    }
    app.use(express.static(distPath));
    // جميع مسارات React
    const reactRoutes = [
        "/", "/landing", "/login", "/signup", "/about", "/dashboard",
        "/profile", "/settings", "/contact", "/pricing", "/features"
    ];
    reactRoutes.forEach((route) => {
        app.get(route, (_req, res) => {
            res.sendFile(indexPath);
        });
    });
    // إعادة التوجيه لمصادقة Google
    app.get("/auth/google", (_req, res) => {
        res.redirect("/auth/google");
    });
    app.get("/auth/google/callback", (_req, res) => {
        res.redirect("/dashboard");
    });
    // أي مسار آخر إلى React
    app.get("*", (_req, res) => {
        res.sendFile(indexPath);
    });
}
