// server/passport.ts
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage.js";
// ===== Google OAuth Strategy =====
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.API_URL
        ? `${process.env.API_URL}/auth/google/callback`
        : "https://markode-ai-tool.onrender.com/auth/google/callback",
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("❌ لم يتم العثور على بريد إلكتروني في حساب Google"), false);
        }
        // Upsert user في قاعدة البيانات
        const dbUser = await storage.upsertUser({
            email,
            firstName: profile.name?.givenName || "User",
            lastName: profile.name?.familyName || "",
            password: "",
            profileImageUrl: profile.photos?.[0]?.value || "",
        });
        // إنشاء كائن الجلسة
        const user = {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName || "User",
            lastName: dbUser.lastName || "",
            profileImageUrl: dbUser.profileImageUrl || "",
        };
        done(null, user);
    }
    catch (error) {
        console.error("❌ خطأ أثناء مصادقة Google:", error);
        done(error, false);
    }
}));
/**
 * ===== Passport Sessions =====
 * لحل مشكلة TypeScript، نستخدم أي مع serializeUser/deserializeUser
 */
passport.serializeUser((user, done) => {
    // نمرر معرف المستخدم فقط للجلسة
    done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const dbUser = await storage.getUser(id);
        if (!dbUser)
            return done(null, false);
        const user = {
            id: dbUser.id,
            email: dbUser.email,
            firstName: dbUser.firstName || "User",
            lastName: dbUser.lastName || "",
            profileImageUrl: dbUser.profileImageUrl || "",
        };
        done(null, user);
    }
    catch (error) {
        console.error("❌ خطأ أثناء استرجاع المستخدم من الجلسة:", error);
        done(error, false);
    }
});
export default passport;
