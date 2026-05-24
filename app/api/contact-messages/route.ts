import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
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

    await prisma.contactMessage.create({
      data: {
        fullName,
        email: email || "",
        phone,
        inquiry,
        message: msgBody,
      },
    });

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

  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const mapped = messages.map((m) => ({
    id: m.id,
    type: inquiryLabel(m.inquiry),
    name: m.fullName,
    email: m.email,
    phone: m.phone || "",
    message: m.message,
    date: m.createdAt.toISOString(),
    status: m.isRead ? ("read" as const) : ("new" as const),
  }));

  return NextResponse.json({ success: true, data: mapped });
}