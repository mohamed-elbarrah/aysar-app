import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { contactPageUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import { CONTACT_HERO, CONTACT_PAGE_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import { migrateFormFields, FORM_FIELDS_DEFAULTS, CONTACT_FORM_DEFAULTS } from "@/app/lib/contact-page-data";

export const dynamic = "force-dynamic";

const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";

const CONTACT_DEFAULTS = {
  hero: CONTACT_HERO,
  contactInfo: CONTACT_PAGE_INFO,
  channels: CHANNELS,
  inquiryOptions: INQUIRY_OPTIONS,
  successMessage: SUCCESS_MESSAGE_DEFAULT,
  formFields: FORM_FIELDS_DEFAULTS,
  thirdPartyFormScript: CONTACT_FORM_DEFAULTS.thirdPartyFormScript,
  formReplaced: CONTACT_FORM_DEFAULTS.formReplaced,
};

function toSnakeCase(data: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    contactInfo: "contact_info",
    inquiryOptions: "inquiry_options",
    successMessage: "success_message",
    formFields: "form_fields",
    formConfig: "form_config",
  };
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[map[key] || key] = val;
  }
  return result;
}

export async function GET() {
  const { data: page } = await supabase
    .from("contact_page")
    .select("*")
    .eq("id", "CONTACT")
    .single();

  if (!page) {
    return NextResponse.json({
      success: true,
      data: { id: "CONTACT", ...CONTACT_DEFAULTS, updated_at: new Date().toISOString() },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: page.id,
      hero: page.hero,
      contactInfo: page.contact_info,
      channels: page.channels,
      inquiryOptions: page.inquiry_options,
      successMessage: page.success_message,
      formFields: migrateFormFields(page.form_fields),
      thirdPartyFormScript: page.form_config?.thirdPartyFormScript ?? CONTACT_FORM_DEFAULTS.thirdPartyFormScript,
      formReplaced: page.form_config?.formReplaced ?? CONTACT_FORM_DEFAULTS.formReplaced,
      updatedAt: page.updated_at,
    },
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

  const { data: existing } = await supabase
    .from("contact_page")
    .select("*")
    .eq("id", "CONTACT")
    .single();

  const current = existing ?? CONTACT_DEFAULTS;

  const merged = deepMerge(
    current as unknown as Record<string, unknown>,
    toSnakeCase(parsed.data as Record<string, unknown>)
  );

  const { data: page, error } = await supabase
    .from("contact_page")
    .upsert({ id: "CONTACT", ...merged }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: page.id,
      hero: page.hero,
      contactInfo: page.contact_info,
      channels: page.channels,
      inquiryOptions: page.inquiry_options,
      successMessage: page.success_message,
      formFields: migrateFormFields(page.form_fields),
      thirdPartyFormScript: page.form_config?.thirdPartyFormScript ?? CONTACT_FORM_DEFAULTS.thirdPartyFormScript,
      formReplaced: page.form_config?.formReplaced ?? CONTACT_FORM_DEFAULTS.formReplaced,
      updatedAt: page.updated_at,
    },
  });
}