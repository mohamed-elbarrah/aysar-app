import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/api-utils";
import { supabase } from "@/app/lib/db";

export async function GET(request: NextRequest) {
  const payload = verifyAuth(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", payload.userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    data: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
}