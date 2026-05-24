import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { contactMessageSubmitSchema } from "@/app/lib/shared-types";
import { verifyAuth } from "@/app/lib/api-utils";

function inquiryLabel(inquiry: string): string {
  const labels: Record<string, string> = {
    demo: "طلب عرض تجريبي",
    pricing: "استفسار عن الأسعار",
    support: "دعم فني",
    partnership: "شراكة أو تعاون",
    other: "أخرى",
  };
  return labels[inquiry] || inquiry;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = contactMessageSubmitSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = parsed.error.issues[0];
      return NextResponse.json(
        { success: false, error: firstError?.message || "بيانات غير صالحة" },
        { status: 422 }
      );
    }

    const { fullName, email, phone, inquiry, message: msgBody } = parsed.data;

    const { error } = await supabase
      .from("contact_messages")
      .insert({
        full_name: fullName,
        email: email || "",
        phone,
        inquiry,
        message: msgBody,
      });

    if (error) {
      console.error("[contact-messages POST db error]", error);
      return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: { message: "تم إرسال رسالتك بنجاح" } });
  } catch (error) {
    console.error("[contact-messages POST error]", error);
    return NextResponse.json({ success: false, error: "حدث خطأ في الخادم" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const payload = verifyAuth(request);
  if (!payload) {
    return NextResponse.json({ success: false, error: "الرجاء تسجيل الدخول" }, { status: 401 });
  }

  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const mapped = (messages || []).map((m: Record<string, unknown>) => ({
    id: m.id,
    type: inquiryLabel(m.inquiry as string),
    name: m.full_name,
    email: m.email,
    phone: m.phone || "",
    message: m.message,
    date: m.created_at,
    status: m.is_read ? ("read" as const) : ("new" as const),
  }));

  return NextResponse.json({ success: true, data: mapped });
}