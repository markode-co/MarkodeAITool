// server/auth-google.ts
import express from "express";
import passport from "passport";
import session from "express-session";
import { generateToken } from "./auth.js";
import type { SessionUser } from "./passport.js";

const router = express.Router();

// ================================
// إعداد جلسات Express
// ================================
router.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret", // يجب تغييره في الإنتاج
    resave: false,
    saveUninitialized: false, // عدم إنشاء جلسة جديدة إذا لم تُستخدم
    cookie: {
      httpOnly: true, // يحمي من وصول JS في المتصفح
      secure: process.env.NODE_ENV === "production", // يستخدم HTTPS في الإنتاج
      maxAge: 24 * 60 * 60 * 1000, // 1 يوم
    },
  })
);

router.use(passport.initialize());
router.use(passport.session());

// ================================
// رابط المصادقة: Google OAuth
// ================================
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account", // يتيح اختيار الحساب كل مرة
  })
);

// ================================
// رابط callback بعد Google OAuth
// ================================
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: true }),
  (req, res) => {
    // نوع المستخدم
    const user = req.user as SessionUser | undefined;
    if (!user) return res.redirect("/login");

    // توليد JWT
    const token = generateToken({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      email: user.email,
      picture: user.profileImageUrl,
    });

    // إعادة التوجيه إلى الواجهة الأمامية مع التوكن
    const frontendCallback = process.env.FRONTEND_CALLBACK_URL || "https://markode-ai-tool.onrender.com/auth/callback";
    res.redirect(`${frontendCallback}?token=${token}`);
  }
);

export default router;
