import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { contactPageUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import { CONTACT_HERO, CONTACT_PAGE_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import { migrateFormFields, FORM_FIELDS_DEFAULTS, CONTACT_FORM_DEFAULTS } from "@/app/lib/contact-page-data";

const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";

function deepMerge<T extends Record<string, unknown>>(existing: T, incoming: Partial<T>): T {
  const result = { ...existing };
  for (const key of Object.keys(incoming) as (keyof T)[]) {
    const incomingVal = incoming[key];
    const existingVal = result[key];
    if (
      incomingVal !== null &&
      incomingVal !== undefined &&
      typeof incomingVal === "object" &&
      !Array.isArray(incomingVal) &&
      typeof existingVal === "object" &&
      existingVal !== null &&
      !Array.isArray(existingVal)
    ) {
      result[key] = deepMerge(existingVal as Record<string, unknown>, incomingVal as Record<string, unknown>) as T[keyof T];
    } else if (incomingVal !== undefined) {
      result[key] = incomingVal as T[keyof T];
    }
  }
  return result;
}

const CONTACT_DEFAULTS = {
  hero: CONTACT_HERO,
  contactInfo: CONTACT_PAGE_INFO,
  channels: CHANNELS,
  inquiryOptions: INQUIRY_OPTIONS,
  successMessage: SUCCESS_MESSAGE_DEFAULT,
  formFields: FORM_FIELDS_DEFAULTS,
  formConfig: CONTACT_FORM_DEFAULTS,
};

export async function getContactPageHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const page = await prisma.contactPage.findUnique({ where: { id: "CONTACT" } });

  if (!page) {
    res.json({
      success: true,
      data: {
        id: "CONTACT",
        ...CONTACT_DEFAULTS,
        updatedAt: new Date().toISOString(),
      },
    });
    return;
  }

  res.json({
    success: true,
    data: {
      ...page,
      formFields: migrateFormFields(page.formFields),
    },
  });
}

export async function updateContactPageHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const parsed = contactPageUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const existing = await prisma.contactPage.findUnique({ where: { id: "CONTACT" } });
  const current = existing ?? CONTACT_DEFAULTS;

  const merged = deepMerge(current as unknown as Record<string, unknown>, parsed.data as Record<string, unknown>);

  const page = await prisma.contactPage.upsert({
    where: { id: "CONTACT" },
    create: { id: "CONTACT", ...merged },
    update: merged,
  });

  res.json({ success: true, data: page });
}
