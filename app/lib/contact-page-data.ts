import { prisma } from "@/app/lib/db";
import { CONTACT_HERO, CONTACT_PAGE_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import { FORM_FIELDS_DEFAULTS, CONTACT_FORM_DEFAULTS, migrateFormFields } from "@/app/lib/form-fields-data";
import type { FormFieldConfig } from "@/app/lib/form-fields-data";
import type { ContactInfo as ContactInfoType, Channel, InquiryOption } from "@/lib/contact-data";

export type { FormFieldConfig };
export { FORM_FIELDS_DEFAULTS, CONTACT_FORM_DEFAULTS, migrateFormFields };

const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";

export interface ContactPageResponse {
  id: string;
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    subtitle: string;
  };
  contactInfo: ContactInfoType;
  channels: Channel[];
  inquiryOptions: InquiryOption[];
  successMessage: string;
  formFields: FormFieldConfig[];
  thirdPartyFormScript: string;
  formReplaced: boolean;
  updatedAt: string;
}

export async function getContactPageData(): Promise<ContactPageResponse> {
  const page = await prisma.contactPage.findUnique({ where: { id: "CONTACT" } });

  const defaults = {
    hero: CONTACT_HERO,
    contactInfo: CONTACT_PAGE_INFO,
    channels: CHANNELS,
    inquiryOptions: INQUIRY_OPTIONS,
    successMessage: SUCCESS_MESSAGE_DEFAULT,
    formFields: FORM_FIELDS_DEFAULTS,
    thirdPartyFormScript: CONTACT_FORM_DEFAULTS.thirdPartyFormScript,
    formReplaced: CONTACT_FORM_DEFAULTS.formReplaced,
  };

  if (!page) {
    return { id: "CONTACT", ...defaults, updatedAt: new Date().toISOString() };
  }

  const formConfig = page.formConfig as Record<string, unknown> | null;

  return {
    id: page.id,
    hero: page.hero as ContactPageResponse["hero"],
    contactInfo: page.contactInfo as unknown as ContactPageResponse["contactInfo"],
    channels: page.channels as unknown as ContactPageResponse["channels"],
    inquiryOptions: page.inquiryOptions as unknown as ContactPageResponse["inquiryOptions"],
    successMessage: page.successMessage,
    formFields: migrateFormFields(page.formFields),
    thirdPartyFormScript: (formConfig?.thirdPartyFormScript as string) ?? CONTACT_FORM_DEFAULTS.thirdPartyFormScript,
    formReplaced: (formConfig?.formReplaced as boolean) ?? CONTACT_FORM_DEFAULTS.formReplaced,
    updatedAt: page.updatedAt.toISOString(),
  };
}
