import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// 🔐 سر التوكن
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// ✅ نوع الطلب مع المستخدم بعد فك التوكن
export interface AuthRequest extends Request {
  user?: any;
}

// ✅ دالة توليد التوكن (JWT)
export function generateToken(user: { id: string; name: string; email: string; picture?: string }) {
  return jwt.sign(
    {
      sub: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
    },
    JWT_SECRET,
    { expiresIn: "7d" } // صلاحية أسبوع
  );
}

// ✅ ميدل وير للتحقق من صلاحية التوكن
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  // التحقق من وجود التوكن
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (!decoded || !decoded.sub) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // ✅ حفظ بيانات المستخدم في الطلب
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ JWT verification error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
