// server/types.d.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

// ===== تعريف المستخدم العام =====
export interface User {
  sub: string;               // معرف المستخدم
  id: string;                // نسخة مكررة من sub أو معرف داخلي
  name?: string;
  email?: string;
  picture?: string;
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
