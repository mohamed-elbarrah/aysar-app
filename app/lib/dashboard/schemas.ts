import { z } from "zod";

export const requiredString = z.string().min(1, "هذا الحقل مطلوب");
export const optionalString = z.string().optional().or(z.literal(""));
export const urlString = z.string().url("رابط غير صالح").optional().or(z.literal(""));

export const heroSectionSchema = z.object({
  badge: optionalString,
  title: requiredString,
  titleAccent: optionalString,
  subtitle: requiredString,
  primaryCtaLabel: optionalString,
  primaryCtaHref: urlString,
  secondaryCtaLabel: optionalString,
  secondaryCtaHref: urlString,
});

export const featureSectionSchema = z.object({
  eyebrow: requiredString,
  title: requiredString,
  titleAccent: optionalString,
  description: requiredString,
  features: z.array(requiredString).min(1, "يجب إضافة ميزة واحدة على الأقل"),
  layout: z.enum(["text-left", "text-right"]),
  accentColor: requiredString,
});

export const bentoFeatureSchema = z.object({
  iconName: requiredString,
  iconUrl: z.string().nullable().optional(),
  title: requiredString,
  description: requiredString,
  iconBg: requiredString,
  iconColor: requiredString,
});

export const planSchema = z.object({
  id: requiredString,
  name: requiredString,
  description: requiredString,
  priceMonthly: z.number().nullable(),
  priceYearly: z.number().nullable(),
  isFree: z.boolean(),
  isFeatured: z.boolean(),
  ctaLabel: requiredString,
  ctaHref: urlString,
  featuresTitle: requiredString,
  features: z.array(
    z.object({
      text: requiredString,
      enabled: z.boolean(),
      soon: z.boolean().optional(),
    })
  ),
});

export const faqItemSchema = z.object({
  question: requiredString,
  answer: requiredString,
});

export const contactChannelSchema = z.object({
  name: requiredString,
  value: requiredString,
  href: requiredString,
  iconBg: requiredString,
  actionLabel: requiredString,
});

export const policySchema = z.object({
  content: requiredString,
  version: optionalString,
  effectiveDate: optionalString,
});

export const siteSettingsSchema = z.object({
  siteTitle: requiredString,
  siteDescription: requiredString,
  faviconUrl: urlString,
  seoKeywords: optionalString,
});

export const navLinkSchema = z.object({
  label: requiredString,
  href: requiredString,
});

export const socialLinksSchema = z.object({
  xUrl: urlString,
  instagramUrl: urlString,
  tiktokUrl: urlString,
  whatsappNumber: optionalString,
});

export const appLinksSchema = z.object({
  appStoreUrl: urlString,
  googlePlayUrl: urlString,
});

export const socialLinkSchema = z.object({
  key: requiredString,
  label: requiredString,
  url: z.string().url("رابط غير صالح"),
  iconUrl: optionalString,
});

export const contactInfoSchema = z.object({
  phone: requiredString,
  email: z.string().email("بريد إلكتروني غير صالح"),
  legalEmail: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal("")),
  whatsappNumber: requiredString,
  location: requiredString,
});

export const platformLinksSchema = z.object({
  loginUrl: z.string().url("رابط غير صالح"),
  registerUrl: z.string().url("رابط غير صالح"),
  supportCenterUrl: z.string().url("رابط غير صالح"),
});

export const workHoursSchema = z.object({
  days: requiredString,
  time: requiredString,
});
