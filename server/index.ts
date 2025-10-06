// server/index.ts
import express, { type Express, type Request, type Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "./passport.js";
import authGoogleRouter from "./auth-google.js";
import { registerRoutes } from "./routes.js";

// ✅ تصحيح __dirname في ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = Number(process.env.PORT) || 3000;

// ====================
// Middlewares
// ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS فقط في الإنتاج
      maxAge: 1000 * 60 * 60 * 24, // يوم واحد
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ====================
// Authentication Routes
// ====================
app.use("/auth", authGoogleRouter);

// ====================
// Serve Client (SPA)
// ====================
const clientDistPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// ====================
// API / App Routes
// ====================
(async () => {
  await registerRoutes(app);

  // SPA fallback
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });

  // ====================
  // Start Server
  // ====================
  app.listen(PORT, () => {
    console.log(`✅ Connected to Neon Database (Production)`);
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
