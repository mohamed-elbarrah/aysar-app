import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";

function verifyToken(request: NextRequest): { userId: string; email: string; role: string } | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (request.method === "OPTIONS") {
    return NextResponse.next();
  }

  // GET on admin content routes = public
  if (request.method === "GET") {
    const publicGetRoutes = [
      "/api/home-page",
      "/api/plans-page",
      "/api/contact-page",
      "/api/policies",
      "/api/settings",
    ];
    if (publicGetRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.next();
    }
  }

  // POST submit contact message = public
  if (request.method === "POST" && pathname === "/api/contact-messages") {
    return NextResponse.next();
  }

  // POST login/logout = public
  if (pathname === "/api/auth/login" || pathname === "/api/auth/logout") {
    return NextResponse.next();
  }

  // Auth required: GET /api/auth/me, GET /api/contact-messages
  // Admin required: PATCH on content routes
  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }

  // Admin-only routes (PATCH on content routes)
  const adminPatchRoutes = [
    "/api/home-page",
    "/api/plans-page",
    "/api/contact-page",
    "/api/policies",
    "/api/settings",
  ];
  if (request.method === "PATCH" && adminPatchRoutes.some((route) => pathname.startsWith(route))) {
    if (payload.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "غير مصرح" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};