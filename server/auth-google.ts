import express from "express";
import passport from "passport";
import session from "express-session";
import jwt from "jsonwebtoken";
import { generateToken } from "./auth.js";

const router = express.Router();

router.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

// رابط المصادقة
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// رابط callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user as any;
    if (!user) return res.redirect("/login");

    const token = generateToken({
      id: user.id,
      name: user.firstName + " " + user.lastName,
      email: user.email,
      picture: user.profileImageUrl,
    });

    res.redirect(`https://markode-ai-tool.onrender.com/auth/callback?token=${token}`);
  }
);

export default router;
