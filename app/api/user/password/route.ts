import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAuth } from "@/app/lib/api-utils";
import { supabase } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const payload = verifyAuth(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور الحالية والجديدة مطلوبتان" },
        { status: 422 }
      );
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل" },
        { status: 422 }
      );
    }

    // Get current user data with password hash
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("password_hash")
      .eq("id", payload.userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: "المستخدم غير موجود" },
        { status: 404 }
      );
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "كلمة المرور الحالية غير صحيحة" },
        { status: 401 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: hashedPassword, updated_at: new Date().toISOString() })
      .eq("id", payload.userId);

    if (updateError) {
      return NextResponse.json(
        { success: false, error: "فشل تغيير كلمة المرور" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("[user/password error]", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ في الخادم" },
      { status: 500 }
    );
  }
}
