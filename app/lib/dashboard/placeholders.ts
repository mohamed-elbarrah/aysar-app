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

export { PLANS, COMPARE_ROWS, FAQ_ITEMS, CONTACT_INFO, CHANNELS, INQUIRY_OPTIONS, PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY };

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

export const BENTO_FEATURES = [
  { iconName: "Bell", title: "إشعارات لحظية", description: "عند كل تحديث للمراحل", iconBg: "#e9f9f0", iconColor: "#1a9a5a" },
  { iconName: "Globe", title: "صفحات هبوط", description: "برابط خاص لكل مشروع", iconBg: "#eef2ff", iconColor: "#4f46e5" },
  { iconName: "Users", title: "نظام CRM", description: "إدارة العملاء والمبيعات", iconBg: "#f0f4ff", iconColor: "#2d2e83" },
  { iconName: "Smartphone", title: "تطبيق مخصص", description: "iOS و Android للعملاء", iconBg: "#fff7ed", iconColor: "#f97316" },
  { iconName: "ImageIcon", title: "صور وفيديو", description: "توثيق المراحل من الموقع", iconBg: "#fdf2f8", iconColor: "#ec4899" },
  { iconName: "Cloud", title: "سحابي 100%", description: "بدون تثبيت أو خوادم", iconBg: "#e7fafd", iconColor: "#06b6d4" },
  { iconName: "LayoutGrid", title: "مشاريع متعددة", description: "فيلات، شقق، تجاري", iconBg: "#f3eefe", iconColor: "#8b5cf6" },
  { iconName: "MessageCircle", title: "دعم فني 7/24", description: "واتساب أو بريد إلكتروني", iconBg: "#fff8e8", iconColor: "#f59e0b" },
];

export const APP_SECTION = {
  eyebrow: "تطبيق أيسَر",
  title: "من أول طوبة",
  titleAccent: "لآخر لمسة",
  description: "لن تحتاج سوى برنامج أيسَر للحصول على تطبيق مخصص لعملائك. حمِّل تطبيق أيسَر وراقب منزلك يكبر أمام عينك.",
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
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

export const SOCIAL_LINKS = {
  xUrl: "https://x.com/aysar_ksa",
  instagramUrl: "https://instagram.com/aysar_ksa",
  tiktokUrl: "https://tiktok.com/@aysar_sa",
  whatsappNumber: "966125101107",
};
