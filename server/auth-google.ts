import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🧩 إعداد الجلسات
router.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

// 🔑 إعداد استراتيجية Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://127.0.0.1:5000/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      // هنا يمكنك حفظ المستخدم في قاعدة البيانات
      const user = {
        id: profile.id,
        name: profile.displayName,
        email: profile.emails?.[0].value,
        picture: profile.photos?.[0].value,
      };
      done(null, user);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj: any, done) => done(null, obj));

// 🚀 بدء تسجيل الدخول عبر Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// ✅ عند عودة المستخدم من Google
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const user = req.user as any;
    const token = jwt.sign(user, process.env.JWT_SECRET || "jwtsecret", {
      expiresIn: "1d",
    });

    // يمكنك تغيير عنوان التوجيه إلى واجهة React الخاصة بك
    res.redirect(`http://127.0.0.1:5173/dashboard?token=${token}`);
  }
);

export default router;
