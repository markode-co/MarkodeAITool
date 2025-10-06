// server/index.ts
import express, { type Express, type Request, type Response } from "express";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import session from "express-session";
import passport from "./passport.js";
import authGoogleRouter from "./auth-google.js";
import { registerRoutes } from "./routes.js";

// ✅ تصحيح __dirname في ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authGoogleRouter);

// ✅ Serve client/dist as static files
const clientDistPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// ✅ تسجيل Routes إضافية من ملفات routes.ts
(async () => {
  await registerRoutes(app);

  // ✅ SPA fallback: تحويل المسار إلى URL لحل مشكلة Windows + ESM
  app.get("*", (_req: Request, res: Response) => {
    const indexUrl = pathToFileURL(path.join(clientDistPath, "index.html")).href;
    res.sendFile(indexUrl);
  });

  // ✅ بدء السيرفر
  app.listen(PORT, () => {
    console.log(`✅ Connected to Neon Database (Production)`);
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
