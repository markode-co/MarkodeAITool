// server/types.d.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// ===== تعريف المستخدم العام =====
export interface User {
  sub: string;               // معرف المستخدم الخارجي (مثل Google ID)
  id: string;                // معرف داخلي مكرر أو قاعدة بيانات
  name?: string;             // الاسم الكامل
  email?: string;            // البريد الإلكتروني
  picture?: string;          // رابط الصورة الشخصية
}

// ===== Request الموسع مع مصادقة JWT =====
export interface AuthRequest extends Request {
  user?: User | (JwtPayload & {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
  });
}
