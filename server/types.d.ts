// server/types.d.ts
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface User {
  sub: string;
  id: string;
  name?: string;
  email?: string;
  picture?: string;
}

export interface AuthRequest extends Request {
  user?: User | (JwtPayload & { sub: string; name?: string; email?: string; picture?: string });
}
