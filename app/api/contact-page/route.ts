import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { contactPageUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import { CONTACT_HERO, CONTACT_PAGE_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import { migrateFormFields, FORM_FIELDS_DEFAULTS, CONTACT_FORM_DEFAULTS } from "@/app/lib/contact-page-data";

const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";

const CONTACT_DEFAULTS = {
  hero: CONTACT_HERO,
  contactInfo: CONTACT_PAGE_INFO,
  channels: CHANNELS,
  inquiryOptions: INQUIRY_OPTIONS,
  successMessage: SUCCESS_MESSAGE_DEFAULT,
  formFields: FORM_FIELDS_DEFAULTS,
  formConfig: CONTACT_FORM_DEFAULTS,
};

export async function GET() {
  const page = await prisma.contactPage.findUnique({ where: { id: "CONTACT" } });

  if (!page) {
    return NextResponse.json({
      success: true,
      data: { id: "CONTACT", ...CONTACT_DEFAULTS, updatedAt: new Date().toISOString() },
    });
  }

  return NextResponse.json({
    success: true,
    data: { ...page, formFields: migrateFormFields(page.formFields) },
  });
}

export async function PATCH(request: NextRequest) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const body = await request.json();
  const parsed = contactPageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 422 });
  }

  const existing = await prisma.contactPage.findUnique({ where: { id: "CONTACT" } });
  const current = existing ?? CONTACT_DEFAULTS;

  const merged = deepMerge(
    current as unknown as Record<string, unknown>,
    parsed.data as Record<string, unknown>
  );

  const page = await prisma.contactPage.upsert({
    where: { id: "CONTACT" },
    create: { id: "CONTACT", ...merged },
    update: merged,
  });

  return NextResponse.json({ success: true, data: page });
}