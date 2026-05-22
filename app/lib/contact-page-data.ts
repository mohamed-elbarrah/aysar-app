import { prisma } from "@/app/lib/db";
import { CONTACT_HERO, CONTACT_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import type { ContactInfo as ContactInfoType, Channel, InquiryOption } from "@/lib/contact-data";

const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";
const FORM_FIELDS_DEFAULTS = { name: true, phone: true, email: true, type: true, message: true };

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
  formFields: { name: boolean; phone: boolean; email: boolean; type: boolean; message: boolean };
  updatedAt: string;
}

export async function getContactPageData(): Promise<ContactPageResponse> {
  let page = await prisma.contactPage.findUnique({ where: { id: "CONTACT" } });

  if (!page) {
    return {
      id: "CONTACT",
      hero: { ...CONTACT_HERO },
      contactInfo: { ...CONTACT_INFO },
      channels: [...CHANNELS],
      inquiryOptions: [...INQUIRY_OPTIONS],
      successMessage: SUCCESS_MESSAGE_DEFAULT,
      formFields: { ...FORM_FIELDS_DEFAULTS },
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: page.id,
    hero: page.hero as ContactPageResponse["hero"],
    contactInfo: page.contactInfo as ContactPageResponse["contactInfo"],
    channels: page.channels as ContactPageResponse["channels"],
    inquiryOptions: page.inquiryOptions as ContactPageResponse["inquiryOptions"],
    successMessage: page.successMessage,
    formFields: page.formFields as ContactPageResponse["formFields"],
    updatedAt: page.updatedAt.toISOString(),
  };
}
