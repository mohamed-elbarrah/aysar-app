import type { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/app/lib/db";
import { loginSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function loginHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ token: string; user: { id: string; email: string; name: string; role: string } }>>
): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    res.status(401).json({ success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({
    success: true,
    data: {
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    },
  });
}

export async function logoutHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  res.clearCookie("token", { path: "/" });
  res.json({ success: true });
}

export async function meHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse<{ id: string; email: string; name: string; role: string }>>
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, error: "غير مصرح" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
  if (!user) {
    res.status(401).json({ success: false, error: "المستخدم غير موجود" });
    return;
  }

  res.json({
    success: true,
    data: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}
