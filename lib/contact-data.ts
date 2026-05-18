export interface ContactInfo {
  phone: string;
  email: string;
  location: string;
  hoursDays: string;
  hoursTime: string;
}

export const CONTACT_INFO: ContactInfo = {
  phone: "+966125101107",
  email: "support@aysar.sa",
  location: "جدة، المملكة العربية السعودية",
  hoursDays: "الأحد – الخميس",
  hoursTime: "10:00 ص – 5:00 م",
};

export type ChannelId = "whatsapp" | "email" | "help";

export interface Channel {
  id: ChannelId;
  name: string;
  value: string;
  href: string;
  iconBg: string;
  actionLabel: string;
}

export const CHANNELS: Channel[] = [
  {
    id: "whatsapp",
    name: "واتساب",
    value: "+966125101107",
    href: "http://wa.me/966125101107",
    iconBg: "#e9faf0",
    actionLabel: "تواصل الآن",
  },
  {
    id: "email",
    name: "البريد الإلكتروني",
    value: "support@aysar.sa",
    href: "mailto:support@aysar.sa",
    iconBg: "#eef2ff",
    actionLabel: "راسلنا",
  },
  {
    id: "help",
    name: "مركز المساعدة",
    value: "support.aysar.sa",
    href: "https://support.aysar.sa/",
    iconBg: "#fff7ed",
    actionLabel: "اطرح سؤالاً",
  },
];

export type InquiryType = "demo" | "pricing" | "support" | "partnership" | "other";

export interface InquiryOption {
  value: InquiryType | "";
  label: string;
}

export const INQUIRY_OPTIONS: InquiryOption[] = [
  { value: "", label: "اختر نوع الاستفسار" },
  { value: "demo", label: "طلب عرض تجريبي" },
  { value: "pricing", label: "استفسار عن الأسعار" },
  { value: "support", label: "دعم فني" },
  { value: "partnership", label: "شراكة أو تعاون" },
  { value: "other", label: "أخرى" },
];

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  type: string;
  message: string;
}
