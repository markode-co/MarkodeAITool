// ================================
// 🔐 GOOGLE OAUTH STRATEGY (Passport)
// ================================
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage.js";

// ================================
// ⚙️ إعداد استراتيجية Google OAuth
// ================================
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.API_URL
          ? `${process.env.API_URL}/auth/google/callback`
          : "http://localhost:5050/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("لم يتم العثور على بريد إلكتروني في حساب Google"));
        }

        // 🔎 البحث عن المستخدم في قاعدة البيانات
        let user = await storage.getUserByEmail(email);

        // ✅ إنشاء مستخدم جديد إن لم يكن موجودًا
        if (!user) {
          user = await storage.createUser({
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            email,
            password: "", // مستخدم Google لا يحتاج كلمة مرور
            profileImageUrl: profile.photos?.[0]?.value || "",
          });
        }

        done(null, user);
      } catch (error) {
        console.error("❌ خطأ أثناء مصادقة Google:", error);
        done(error, null);
      }
    }
  )
);

// ================================
// 🧩 جلسة Passport (اختيارية)
// ================================
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
