import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "@/app/lib/db";
import { loginSchema } from "@/app/lib/shared-types";

const JWT_SECRET = process.env.JWT_SECRET || "aysar-dev-secret-change-in-production";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 422 });
    }

    const { email, password } = parsed.data;

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return NextResponse.json({ success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "بريد إلكتروني أو كلمة مرور غير صحيحة" }, { status: 401 });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      },
    });

    response.cookies.set("token", token, COOKIE_OPTIONS);
    return response;
  } catch (error) {
    console.error("[auth/login error]", error);
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}