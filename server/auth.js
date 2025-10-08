// server/auth.ts
import jwt from "jsonwebtoken";
import { storage } from "./storage.js"; // ⚡ ESM import
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";
// ================================
// توليد JWT
// ================================
export function generateToken(user) {
    const payload = {
        sub: user.id,
        name: user.name ?? undefined,
        email: user.email ?? undefined,
        picture: user.picture ?? undefined,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" }); // صالحة لمدة 7 أيام
}
// ================================
// Middleware للتحقق من JWT
// ================================
export const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        const token = authHeader.split(" ")[1];
        // فك التوكن والتحقق
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded?.sub) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        // جلب بيانات المستخدم من قاعدة البيانات
        const userFromDb = await storage.getUser(decoded.sub);
        if (!userFromDb)
            return res.status(401).json({ message: "User not found" });
        // ⚡ تحويل بيانات قاعدة البيانات لتوافق AuthRequest
        req.user = {
            sub: userFromDb.id,
            name: userFromDb.firstName ?? undefined,
            email: userFromDb.email ?? undefined,
            picture: userFromDb.profileImageUrl ?? undefined,
        };
        next();
    }
    catch (err) {
        console.error("❌ JWT verification error:", err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
