import {
  PLANS,
  COMPARE_ROWS,
  FAQ_ITEMS,
} from "@/lib/plans-data";
import {
  CONTACT_INFO,
  CHANNELS,
  INQUIRY_OPTIONS,
} from "@/lib/contact-data";
import {
  PRIVACY_POLICY,
  TERMS_OF_USE,
  RETURN_POLICY,
} from "@/lib/policy-data";
interface SocialLink { key: string; label: string; url: string; iconUrl?: string }
interface ContactInfo { phone: string; email: string; legalEmail: string; whatsappNumber: string; location: string }
interface PlatformLinks { loginUrl: string; registerUrl: string; supportCenterUrl: string }
interface WorkHours { days: string; time: string }

export { PLANS, COMPARE_ROWS, FAQ_ITEMS, CHANNELS, INQUIRY_OPTIONS, PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY };
export { CONTACT_INFO as CONTACT_PAGE_INFO };

export const HOME_HERO = {
  badge: "منصة سحابية للتطوير العقاري",
  title: "إدارة مشاريعك العقارية",
  titleAccent: "بسهولة وشفافية كاملة",
  subtitle: "أيسَر تمنحك لوحة تحكم احترافية لإدارة مشاريعك وعملاءك — من تتبع مراحل الإنشاء وإشعارات فورية، حتى صفحات هبوط واستقبال حجوزات ونظام CRM متكامل.",
  primaryCtaLabel: "اطلب تجربة مجانية",
  primaryCtaHref: "#",
  secondaryCtaLabel: "اكتشف المميزات",
  secondaryCtaHref: "#features",
};

export const FEATURE_SECTIONS = [
  {
    eyebrow: "01 — تتبع مراحل الإنشاء",
    title: "تتبع مراحل الإنشاء",
    titleAccent: "خطوة بخطوة",
    description: "يتيح أيسَر متابعة دقيقة لكل مراحل تنفيذ العقار — من الحفر حتى التسليم. المنصة تأتي بقوالب جاهزة تصل إلى 50 مرحلة قابلة للتعديل بالكامل حسب مشروعك.",
    features: [
      "صور وفيديو — من الموقع ترفعها الفرق مباشرة",
      "إشعارات فورية — عند كل تحديث لكل مرحلة",
      "قوالب مرنة — تصل إلى 50 مرحلة وتعدّلها كما تشاء",
    ],
    layout: "text-left" as const,
    accentColor: "#2d2e83",
  },
  {
    eyebrow: "02 — إدارة طلبات الصيانة",
    title: "بلاغات الصيانة",
    titleAccent: "بضغطة واحدة",
    description: "بعد التسليم، يمكن للعميل تقديم بلاغات الصيانة بشكل مباشر عبر التطبيق. يتم توجيهها فورًا إلى حسابك وتستطيع متابعة حالة الطلب حتى الإغلاق.",
    features: [
      "إشعار فوري — عند رفع أي بلاغ جديد",
      "تتبع الحالة — من مفتوح حتى الإغلاق",
      "تعيين موظف — مسؤول لكل بلاغ",
      "سجل كامل — لكل طلبات الصيانة",
    ],
    layout: "text-right" as const,
    accentColor: "#ef4444",
  },
  {
    eyebrow: "03 — استقبال الحجوزات",
    title: "استقبل الحجوزات",
    titleAccent: "من كل مكان",
    description: "صفحات هبوط مخصصة لكل مشروع مع نموذج حجز مدمج — الحجوزات تصل تلقائياً للوحة التحكم. وإذا جاء عميل مباشرة أضفه يدوياً في ثوانٍ، ثم أدر الكل من CRM واحد.",
    features: [
      "صفحة هبوط — مخصصة لكل مشروع برابط خاص",
      "نموذج حجز — مدمج يصل تلقائياً للوحة التحكم",
      "إضافة يدوية — للعملاء المباشرين بثوانٍ",
      "CRM متكامل — لإدارة pipeline المبيعات",
    ],
    layout: "text-left" as const,
    accentColor: "#f97316",
  },
  {
    eyebrow: "04 — القوالب الجاهزة",
    title: "قوالب جاهزة",
    titleAccent: "تصل إلى 50 مرحلة",
    description: "لا تبدأ من الصفر — أيسَر يوفر قوالب مراحل جاهزة لكل أنواع المشاريع. استورد القالب، عدّل المراحل حسب مشروعك، وابدأ فوراً.",
    features: [
      "قوالب جاهزة — لكل أنواع المشاريع العقارية",
      "50 مرحلة — قابلة للتعديل الكامل حسب مشروعك",
      "ترتيب بالسحب والإفلات — لإعادة ترتيب المراحل",
      "صور وفيديو — لكل مرحلة ترفعها الفرق مباشرة",
    ],
    layout: "text-right" as const,
    accentColor: "#f97316",
  },
];

export interface BentoFeature {
  iconName: string;
  iconUrl: string | null;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

export const BENTO_FEATURES: BentoFeature[] = [
  { iconName: "Bell", iconUrl: null, title: "إشعارات لحظية", description: "عند كل تحديث للمراحل", iconBg: "#e9f9f0", iconColor: "#1a9a5a" },
  { iconName: "Globe", iconUrl: null, title: "صفحات هبوط", description: "برابط خاص لكل مشروع", iconBg: "#eef2ff", iconColor: "#4f46e5" },
  { iconName: "Users", iconUrl: null, title: "نظام CRM", description: "إدارة العملاء والمبيعات", iconBg: "#f0f4ff", iconColor: "#2d2e83" },
  { iconName: "Smartphone", iconUrl: null, title: "تطبيق مخصص", description: "iOS و Android للعملاء", iconBg: "#fff7ed", iconColor: "#f97316" },
  { iconName: "ImageIcon", iconUrl: null, title: "صور وفيديو", description: "توثيق المراحل من الموقع", iconBg: "#fdf2f8", iconColor: "#ec4899" },
  { iconName: "Cloud", iconUrl: null, title: "سحابي 100%", description: "بدون تثبيت أو خوادم", iconBg: "#e7fafd", iconColor: "#06b6d4" },
  { iconName: "LayoutGrid", iconUrl: null, title: "مشاريع متعددة", description: "فيلات، شقق، تجاري", iconBg: "#f3eefe", iconColor: "#8b5cf6" },
  { iconName: "MessageCircle", iconUrl: null, title: "دعم فني 7/24", description: "واتساب أو بريد إلكتروني", iconBg: "#fff8e8", iconColor: "#f59e0b" },
];

export const APP_SECTION = {
  eyebrow: "تطبيق أيسَر",
  title: "من أول طوبة",
  titleAccent: "لآخر لمسة",
  description: "لن تحتاج سوى برنامج أيسَر للحصول على تطبيق مخصص لعملائك. حمِّل تطبيق أيسَر وراقب منزلك يكبر أمام عينك.",
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
  app_images: {
    left_phone: null as string | null,
    right_phone: null as string | null,
  },
};

export const CTA_SECTION = {
  title: "جاهز تبدأ مع أيسَر؟",
  subtitle: "انضم لمطورين عقاريين يستخدمون أيسَر لتوفير الوقت ورفع مستوى تجربة عملائهم.",
  primaryCtaLabel: "ابدأ مجاناً الآن",
  primaryCtaHref: "https://platform.aysar.sa/ar/company/dashboard/register",
  secondaryCtaLabel: "تواصل على واتساب",
  secondaryCtaHref: "http://wa.me/966125101107",
  note: "لا بطاقة ائتمان · فريقنا يتواصل معك خلال 24 ساعة",
  variant: "dark" as const,
};

export const PROJECT_OVERVIEW = {
  eyebrow: "لوحة التحكم",
  title: "كل مشاريعك",
  titleAccent: "في نظرة واحدة",
  description: "لوحة تحكم احترافية تعطيك صورة كاملة عن جميع مشاريعك، وحداتك، وعملاءك — محدّثة لحظياً.",
  checkItems: [
    { bold: "إدارة مشاريع متعددة", detail: " — فيلات، شقق، تجاري من لوحة واحدة" },
    { bold: "تتبع نسبة الإنجاز", detail: " لكل مشروع ولكل مرحلة بدقة" },
    { bold: "توثيق بالصور والفيديو", detail: " — يراها العميل فور رفعها" },
    { bold: "سحابي 100%", detail: " — من أي جهاز وأي مكان بدون تثبيت" },
  ],
  linkLabel: "ادخل لوحة التحكم",
  linkHref: "https://platform.aysar.sa/",
};

export const CONTACT_HERO = {
  badge: "اتصل بنا",
  titleLine1: "تواصل معنا",
  titleLine2: "بكل سهولة",
  subtitle: "سواء كنت مطوراً عقارياً أو عميلاً يبحث عن دعم، نحن هنا لخدمتك والإجابة عن جميع استفساراتك.",
};

export const SITE_SETTINGS = {
  siteTitle: "أيسَر — منصة إدارة التطوير العقاري",
  siteDescription: "أيسَر تمنحك لوحة تحكم احترافية لإدارة مشاريعك وعملاءك — من تتبع مراحل الإنشاء وإشعارات فورية، حتى صفحات هبوط واستقبال حجوزات ونظام CRM متكامل.",
  faviconUrl: "/favicon.ico",
  seoKeywords: "تطوير عقاري, إدارة مشاريع, CRM عقاري, تطبيق عقارات, منصة سحابية",
};

export const NAV_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "الأسعار", href: "/plans" },
  { label: "اتصل بنا", href: "/contact" },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { key: "x", label: "X (Twitter)", url: "https://x.com/aysar_ksa" },
  { key: "instagram", label: "Instagram", url: "https://instagram.com/aysar_ksa" },
  { key: "tiktok", label: "TikTok", url: "https://tiktok.com/@aysar_sa" },
];

export const SITE_CONTACT_INFO: ContactInfo = {
  phone: "+966125101107",
  email: "support@aysar.sa",
  legalEmail: "legal@aysar.sa",
  whatsappNumber: "966125101107",
  location: "جدة، المملكة العربية السعودية",
};

export const PLATFORM_LINKS: PlatformLinks = {
  loginUrl: "https://platform.aysar.sa/",
  registerUrl: "https://platform.aysar.sa/ar/company/dashboard/register",
  supportCenterUrl: "https://support.aysar.sa/",
};

export const WORK_HOURS: WorkHours = {
  days: "الأحد – الخميس",
  time: "10:00 ص – 5:00 م",
};

export const APP_LINKS_DEFAULTS = {
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
};

interface FooterLinkItem { label: string; href: string; external?: boolean }
interface FooterColumn {
  type: "brand" | "links";
  title: string;
  links?: FooterLinkItem[];
  tagline?: string;
  copyright?: string;
}

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    type: "brand",
    title: "أيسَر",
    tagline: "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.",
    copyright: "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045",
  },
  {
    type: "links",
    title: "روابط سريعة",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "الأسعار", href: "/plans" },
      { label: "اتصل بنا", href: "/contact" },
    ],
  },
  {
    type: "links",
    title: "المساعدة",
    links: [
      { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
      { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
      { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
      { label: "سياسة الخصوصية", href: "/privacy-policy" },
      { label: "شروط الاستخدام", href: "/terms-of-use" },
      { label: "سياسة الاسترجاع", href: "/return-policy" },
    ],
  },
  {
    type: "links",
    title: "التطبيق",
    links: [
      { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone", external: true },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application", external: true },
    ],
  },
];