// server/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage.js";
import type { User as DBUser } from "../shared/schema.js";

// ===== تعريف نوع المستخدم للجلسة =====
export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
};

// ===== Google OAuth Strategy =====
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL:
        process.env.API_URL
          ? `${process.env.API_URL}/auth/google/callback`
          : "https://markode-ai-tool.onrender.com/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("لم يتم العثور على بريد إلكتروني في حساب Google"), false);

        const dbUser: DBUser = await storage.upsertUser({
          email,
          firstName: profile.name?.givenName || "User",
          lastName: profile.name?.familyName || "",
          password: "",
          profileImageUrl: profile.photos?.[0]?.value || "",
        });

        const user: SessionUser = {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.firstName || "User",
          lastName: dbUser.lastName || "",
          profileImageUrl: dbUser.profileImageUrl || "",
        };

        done(null, user);
      } catch (error) {
        console.error("❌ خطأ أثناء مصادقة Google:", error);
        done(error as Error, false);
      }
    }
  )
);

// ===== Passport Sessions =====
// استخدام any لتجاوز تعارض TypeScript
passport.serializeUser((user: any, done) => {
  done(null, user.id); // نخزن فقط id في الجلسة
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const dbUser = await storage.getUser(id);
    if (!dbUser) return done(null, false);

    const user: SessionUser = {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.firstName || "User",
      lastName: dbUser.lastName || "",
      profileImageUrl: dbUser.profileImageUrl || "",
    };

    done(null, user);
  } catch (error) {
    done(error as Error, false);
  }
});

export default passport;
