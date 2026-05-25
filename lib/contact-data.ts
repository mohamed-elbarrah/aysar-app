export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  whatsapp: string;
  location?: string;
  hoursDays?: string;
  hoursTime?: string;
}

export const CONTACT_INFO: ContactInfo = {
  phone: "+966125101107",
  email: "support@aysar.sa",
  address: "جدة، المملكة العربية السعودية",
  whatsapp: "+966125101107",
  location: "جدة، المملكة العربية السعودية",
  hoursDays: "الأحد – الخميس",
  hoursTime: "10:00 ص – 5:00 م",
};

export type ChannelId = "whatsapp" | "email" | "help";

export interface Channel {
  key: ChannelId;
  label: string;
  enabled: boolean;
  href: string;
  displayText: string;
  iconBg?: string;
  actionLabel?: string;
}

export const CHANNELS: Channel[] = [
  {
    key: "whatsapp",
    label: "واتساب",
    enabled: true,
    href: "http://wa.me/966125101107",
    displayText: "+966125101107",
    iconBg: "#e9faf0",
    actionLabel: "تواصل الآن",
  },
  {
    key: "email",
    label: "البريد الإلكتروني",
    enabled: true,
    href: "mailto:support@aysar.sa",
    displayText: "support@aysar.sa",
    iconBg: "#eef2ff",
    actionLabel: "راسلنا",
  },
  {
    key: "help",
    label: "مركز المساعدة",
    enabled: true,
    href: "https://support.aysar.sa/",
    displayText: "support.aysar.sa",
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
