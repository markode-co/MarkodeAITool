// server/index.ts
import express, { type Express, type Request, type Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import session, { type SessionOptions } from "express-session";
import passport from "passport";
import { registerRoutes } from "./routes.js"; // ✅ لاحظ وجود .js
import { Redis } from "ioredis";
import * as ConnectRedis from "connect-redis";

// ====================
// __dirname fix
// ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====================
// App & Port
// ====================
const app: Express = express();
const PORT: number = Number(process.env.PORT) || 3000;

// ====================
// Redis Client & Store
// ====================
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err: Error) => console.error("Redis Error:", err));

// ✅ RedisStore جاهز للعمل مع ESM + TypeScript
const RedisStore = (ConnectRedis as any)(session);

// ====================
// Middlewares
// ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sessionOptions: SessionOptions = {
  store: new RedisStore({ client: redisClient, prefix: "sess:" }),
  secret: process.env.SESSION_SECRET || "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24, // 1 يوم
  },
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

// ====================
// Serve SPA
// ====================
const clientDistPath = path.resolve(__dirname, "../client/dist");
app.use(express.static(clientDistPath));

// ====================
// Routes
// ====================
(async () => {
  await registerRoutes(app);

  // جميع المسارات غير المعروفة توجه لـ index.html
  app.get("*", (req: Request, res: Response) => {
    const indexFile = path.join(clientDistPath, "index.html");
    if (fs.existsSync(indexFile)) res.sendFile(indexFile);
    else res.status(404).send("index.html not found. Did you build the client?");
  });

  try {
    await redisClient.ping();
    app.listen(PORT, () => {
      console.log(`✅ Connected to Redis & Ready`);
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err: unknown) {
    console.error("❌ Cannot start server, Redis not reachable:", err);
    process.exit(1);
  }
})();
