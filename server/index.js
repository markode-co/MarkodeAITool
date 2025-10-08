// server/index.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "passport";
import { registerRoutes } from "./routes.js"; // ✅ أضفنا .js
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
const app = express();
const PORT = Number(process.env.PORT) || 3000;
// ====================
// Redis Client & Store
// ====================
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
redisClient.on("connect", () => console.log("✅ Connected to Redis"));
redisClient.on("error", (err) => console.error("Redis Error:", err));
// ✅ إنشاء RedisStore متوافق مع TypeScript + ESM
const ConnectRedisFactory = ConnectRedis.default ?? ConnectRedis;
const RedisStore = ConnectRedisFactory(session);
// ====================
// Middlewares
// ====================
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const sessionOptions = {
    store: new RedisStore({ client: redisClient, prefix: "sess:" }),
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24, // 1 day
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
    app.get("*", (req, res) => {
        const indexFile = path.join(clientDistPath, "index.html");
        if (fs.existsSync(indexFile))
            res.sendFile(indexFile);
        else
            res.status(404).send("index.html not found. Did you build the client?");
    });
    try {
        await redisClient.ping();
        app.listen(PORT, () => {
            console.log(`✅ Connected to Redis & Ready`);
            console.log(`🚀 Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Cannot start server, Redis not reachable:", err);
        process.exit(1);
    }
})();
