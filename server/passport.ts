import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage.js";

/**
 * 🎯 Google OAuth 2.0 Strategy configuration
 * تعمل على ربط المستخدمين من Google بقاعدة بياناتك.
 */

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: `${process.env.API_URL || "http://localhost:5050"}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("لم يتم العثور على بريد إلكتروني في حساب Google"));
        }

        // 🔍 البحث عن المستخدم في قاعدة البيانات
        let user = await storage.getUserByEmail(email);

        // 🆕 إذا لم يكن موجودًا، يتم إنشاؤه تلقائيًا
        if (!user) {
          user = await storage.createUser({
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email,
            password: "", // مستخدم Google لا يحتاج كلمة مرور
            profileImageUrl: profile.photos?.[0]?.value || "",
          });
        }

        // ✅ نجاح المصادقة
        return done(null, user);
      } catch (error) {
        console.error("❌ خطأ أثناء مصادقة Google:", error);
        return done(error as Error);
      }
    }
  )
);

/**
 * 🧠 إعدادات تخزين المستخدم في الجلسة
 * (مطلوبة من مكتبة passport لكنها اختيارية في حالتك)
 */
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
