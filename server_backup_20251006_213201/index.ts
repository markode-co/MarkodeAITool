import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import passport from "./passport.js";
import authGoogleRouter from "./auth-google.js";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

(async () => {
  await registerRoutes(app);

  // Serve SPA correctly
  app.get("*", (_req, res) => {
    const indexFile = path.resolve(__dirname, "../client/dist/index.html");
    res.sendFile(indexFile); // ✅ هذا الصحيح
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
