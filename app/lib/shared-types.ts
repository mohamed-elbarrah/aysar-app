import { z } from "zod";
import type { Request } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});

export type LoginInput = z.infer<typeof loginSchema>;

const jsonValueSchema: z.ZodType<unknown> = z.union([
  z.string(), z.number(), z.boolean(), z.null(),
  z.array(z.lazy(() => jsonValueSchema)),
  z.record(z.string(), z.lazy(() => jsonValueSchema)),
]);

export const homePageUpdateSchema = z.object({
  hero: jsonValueSchema.optional(), featureSections: jsonValueSchema.optional(),
  bentoFeatures: jsonValueSchema.optional(), projectOverview: jsonValueSchema.optional(),
  appSection: jsonValueSchema.optional(), ctaSection: jsonValueSchema.optional(),
});

export const plansPageUpdateSchema = z.object({
  hero: jsonValueSchema.optional(), plans: jsonValueSchema.optional(),
  compareRows: jsonValueSchema.optional(), faqItems: jsonValueSchema.optional(),
});

export const contactPageUpdateSchema = z.object({
  hero: jsonValueSchema.optional(), contactInfo: jsonValueSchema.optional(),
  channels: jsonValueSchema.optional(), inquiryOptions: jsonValueSchema.optional(),
  successMessage: z.string().optional(), formFields: jsonValueSchema.optional(),
  formConfig: jsonValueSchema.optional(),
});

export const contactMessageSubmitSchema = z.object({
  fullName: z.string().min(1, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح").optional().or(z.literal("")),
  phone: z.string().min(1, "رقم الجوال مطلوب"),
  inquiry: z.string().min(1, "نوع الاستفسار مطلوب"),
  message: z.string().min(1, "الرسالة مطلوبة"),
});

export const policiesUpdateSchema = jsonValueSchema;

export const settingsUpdateSchema = jsonValueSchema;

export type HomePageUpdate = z.infer<typeof homePageUpdateSchema>;

export interface JwtPayload { userId: string; email: string; role: string; }

export type AuthenticatedRequest = Request & { user?: JwtPayload };
