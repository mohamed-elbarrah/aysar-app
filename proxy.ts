import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET environment variable is required in production");
  }
  return secret || "aysar-dev-secret-change-in-production";
}

const JWT_SECRET = getJwtSecret();

function verifyToken(request: NextRequest): { userId: string; email: string; role: string } | null {
  const token = request.cookies.get("token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dashboard pages: redirect unauthenticated users to login
  if (pathname.startsWith("/dashboard")) {
    const payload = verifyToken(request);
    if (!payload) {
      return redirectToLogin(request);
    }
    return NextResponse.next();
  }

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
  matcher: ["/dashboard/:path*", "/api/:path*"],
};