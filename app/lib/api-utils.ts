import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";

export type JwtPayload = { userId: string; email: string; role: string };

export function deepMerge<T extends Record<string, unknown>>(existing: T, incoming: Partial<T>): T {
  const result = { ...existing };
  for (const key of Object.keys(incoming) as (keyof T)[]) {
    const incomingVal = incoming[key];
    const existingVal = result[key];
    if (
      incomingVal !== null &&
      incomingVal !== undefined &&
      typeof incomingVal === "object" &&
      !Array.isArray(incomingVal) &&
      typeof existingVal === "object" &&
      existingVal !== null &&
      !Array.isArray(existingVal)
    ) {
      result[key] = deepMerge(existingVal as Record<string, unknown>, incomingVal as Record<string, unknown>) as T[keyof T];
    } else if (incomingVal !== undefined) {
      result[key] = incomingVal as T[keyof T];
    }
  }
  return result;
}

export function apiResponse(data: unknown, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function verifyAuth(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function requireAuth(request: NextRequest): JwtPayload | NextResponse {
  const payload = verifyAuth(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }
  return payload;
}

export function requireAdmin(request: NextRequest): JwtPayload | NextResponse {
  const authResult = requireAuth(request);
  if (authResult instanceof NextResponse) return authResult;
  if (authResult.role !== "ADMIN") {
    return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 403 });
  }
  return authResult;
}

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

export function setAuthCookie(token: string, response: NextResponse) {
  response.cookies.set("token", token, COOKIE_OPTIONS);
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set("token", "", { path: "/", maxAge: 0 });
  return response;
}

export async function parseBody<T>(request: NextRequest): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}