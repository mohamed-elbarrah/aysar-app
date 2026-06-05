import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/api-utils";
import { supabase } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const payload = verifyAuth(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("id, email, name, role, created_at, updated_at")
    .eq("id", payload.userId)
    .single();

  if (error || !user) {
    return NextResponse.json({ success: false, error: "المستخدم غير موجود" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const payload = verifyAuth(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: "الاسم والبريد الإلكتروني مطلوبان" },
        { status: 422 }
      );
    }

    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", payload.userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 409 }
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({ name, email })
      .eq("id", payload.userId)
      .select("id, email, name, role, created_at, updated_at")
      .single();

    if (updateError || !updated) {
      return NextResponse.json(
        { success: false, error: "فشل تحديث الملف الشخصي" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        createdAt: updated.created_at,
        updatedAt: updated.updated_at,
      },
    });
  } catch (error) {
    console.error("[user PATCH error]", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
