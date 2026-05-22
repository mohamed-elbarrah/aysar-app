import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, AuthenticatedRequest } from "@/app/lib/shared-types";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ success: false, error: "الرجاء تسجيل الدخول" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "انتهت الجلسة، الرجاء إعادة تسجيل الدخول" });
  }
}

export function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user) {
    res.status(401).json({ success: false, error: "الرجاء تسجيل الدخول" });
    return;
  }

  if (req.user.role !== "ADMIN") {
    res.status(403).json({ success: false, error: "غير مصرح" });
    return;
  }

  next();
}
