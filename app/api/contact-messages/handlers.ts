import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { contactMessageSubmitSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";

export async function submitContactMessageHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const parsed = contactMessageSubmitSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    res.status(422).json({ success: false, error: firstError?.message || "بيانات غير صالحة" });
    return;
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

  res.json({ success: true, data: { message: "تم إرسال رسالتك بنجاح" } });
}

export async function getContactMessagesHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
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
    status: m.isRead ? "read" as const : "new" as const,
  }));

  res.json({ success: true, data: mapped });
}

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
